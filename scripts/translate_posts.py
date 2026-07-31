#!/usr/bin/env python3

from __future__ import annotations

import hashlib
import json
import os
import re
import sys
import time
from pathlib import Path
from typing import Any

from openai import OpenAI


# ============================================================
# 基本配置
# ============================================================

CONTENT_ROOT = Path(
    os.getenv("HUGO_CONTENT_ROOT", "content/post")
)

CACHE_FILE = Path(
    os.getenv(
        "AI_TRANSLATION_CACHE",
        ".ai-translation-cache.json",
    )
)

MODEL = os.getenv("OPENAI_MODEL", "").strip()
API_KEY = os.getenv("OPENAI_API_KEY", "").strip()

FORCE_TRANSLATE = (
    os.getenv("FORCE_TRANSLATE", "false").lower()
    == "true"
)

DELETE_ORPHAN_TRANSLATIONS = (
    os.getenv(
        "DELETE_ORPHAN_TRANSLATIONS",
        "true",
    ).lower()
    == "true"
)

MAX_RETRIES = 3

CACHE_VERSION = 1


# ============================================================
# AI 翻译指令
# ============================================================

SYSTEM_INSTRUCTIONS = """
You are a professional Chinese-to-English translator for a Hugo
technical blog.

Translate the complete Simplified Chinese Hugo Markdown article into
natural, accurate, and professional English.

Return only the complete translated Markdown file. Do not add comments,
explanations, introductions, or Markdown wrapper fences.

Requirements:

1. Preserve the original Markdown structure and heading levels.
2. Preserve the front matter delimiters exactly.
3. Preserve all front matter key names.
4. Translate these front matter values when present:
   - title
   - description
   - summary
   - categories
   - tags
5. Keep these front matter values unchanged:
   - date
   - lastmod
   - draft
   - slug
   - url
   - aliases
   - image
   - cover
   - weight
   - translationKey
   - aiTranslate
6. Preserve protected placeholder tokens exactly. Never translate,
   delete, duplicate, or modify them.
7. Preserve executable code, commands, class names, method names,
   variable names, file paths, API names, and configuration keys exactly.
8. Translate natural-language comments inside fenced code blocks into
   English while preserving comment markers, indentation, and code.
9. Preserve URLs and image paths.
10. Preserve HTML and Hugo shortcodes.
11. Preserve LaTeX and mathematical formulas.
12. Translate explanations around technical terms, but use standard
    English terminology for:
    - software engineering
    - algorithms
    - cloud computing
    - Kubernetes
    - DevOps
    - artificial intelligence
    - machine learning
13. Do not add information that does not exist in the source article.
14. Do not remove any section from the source article.
15. Keep existing English technical terms when they are already correct.
16. Produce valid UTF-8 Markdown.
"""


# ============================================================
# 正则表达式
# ============================================================

LANGUAGE_SUFFIX_RE = re.compile(
    r"\.[a-z]{2}(?:-[a-z0-9]+)?\.md$",
    re.IGNORECASE,
)

AI_TRANSLATE_DISABLED_RE = re.compile(
    r"(?mi)^\s*aiTranslate\s*[:=]\s*false\s*$"
)

HUGO_SHORTCODE_RE = re.compile(
    r"{{[<%].*?[>%]}}",
    re.DOTALL,
)

INLINE_CODE_RE = re.compile(
    r"(?<!`)`[^`\n]+`(?!`)"
)

OUTER_FENCE_RE = re.compile(
    r"^\s*"
    r"(?P<fence>`{3,}|~{3,})"
    r"(?:markdown|md)?"
    r"[ \t]*\n"
    r"(?P<body>.*)"
    r"\n(?P=fence)"
    r"\s*$",
    re.IGNORECASE | re.DOTALL,
)


# ============================================================
# 工具函数
# ============================================================

def load_cache() -> dict[str, Any]:
    if not CACHE_FILE.exists():
        return {
            "version": CACHE_VERSION,
            "files": {},
        }

    try:
        data = json.loads(
            CACHE_FILE.read_text(encoding="utf-8")
        )
    except json.JSONDecodeError as exc:
        raise RuntimeError(
            f"Invalid JSON cache file: {CACHE_FILE}"
        ) from exc

    if not isinstance(data, dict):
        raise RuntimeError(
            f"Invalid cache structure: {CACHE_FILE}"
        )

    files = data.get("files")

    if not isinstance(files, dict):
        raise RuntimeError(
            f"Cache does not contain a valid files map: "
            f"{CACHE_FILE}"
        )

    return data


def save_cache(cache: dict[str, Any]) -> None:
    CACHE_FILE.write_text(
        json.dumps(
            cache,
            ensure_ascii=False,
            indent=2,
            sort_keys=True,
        )
        + "\n",
        encoding="utf-8",
    )


def calculate_hash(content: str) -> str:
    return hashlib.sha256(
        content.encode("utf-8")
    ).hexdigest()


def is_chinese_source(path: Path) -> bool:
    name = path.name.lower()

    if not name.endswith(".md"):
        return False

    if name.endswith(".en.md"):
        return False

    language_match = LANGUAGE_SUFFIX_RE.search(name)

    # 没有语言后缀的 Markdown 被视为默认中文内容。
    if language_match is None:
        return True

    return name.endswith(
        (
            ".zh.md",
            ".zh-cn.md",
            ".zh-hans.md",
        )
    )


def get_english_path(source_path: Path) -> Path:
    name = source_path.name
    lower_name = name.lower()

    chinese_suffixes = (
        ".zh-cn.md",
        ".zh-hans.md",
        ".zh.md",
    )

    for suffix in chinese_suffixes:
        if lower_name.endswith(suffix):
            base_name = name[: -len(suffix)]

            return source_path.with_name(
                base_name + ".en.md"
            )

    # index.md -> index.en.md
    # article.md -> article.en.md
    return source_path.with_name(
        name[:-3] + ".en.md"
    )


def get_front_matter(content: str) -> str:
    lines = content.splitlines()

    if not lines:
        return ""

    delimiter = lines[0].strip()

    if delimiter not in {"---", "+++"}:
        return ""

    for index in range(1, len(lines)):
        if lines[index].strip() == delimiter:
            return "\n".join(lines[1:index])

    return ""


def is_ai_translation_disabled(content: str) -> bool:
    front_matter = get_front_matter(content)

    if not front_matter:
        return False

    return bool(
        AI_TRANSLATE_DISABLED_RE.search(front_matter)
    )


def protect_segments(
    content: str,
) -> tuple[str, dict[str, str]]:
    protected: dict[str, str] = {}

    def replace_match(
        match: re.Match[str],
    ) -> str:
        token = (
            f"@@AI_PROTECTED_"
            f"{len(protected):05d}@@"
        )

        protected[token] = match.group(0)

        return token

    result = content

    # Protect Hugo shortcodes, but leave fenced code blocks visible so the
    # model can translate natural-language comments inside them.
    result = HUGO_SHORTCODE_RE.sub(
        replace_match,
        result,
    )

    # Protect inline code outside fenced code blocks.
    result = INLINE_CODE_RE.sub(
        replace_match,
        result,
    )

    return result, protected


def restore_segments(
    translated: str,
    protected: dict[str, str],
) -> str:
    result = translated

    for token, original in protected.items():
        count = result.count(token)

        if count != 1:
            raise RuntimeError(
                "Protected content was modified by the "
                f"translation model: {token}, count={count}"
            )

        result = result.replace(token, original)

    return result


def remove_outer_markdown_fence(
    content: str,
) -> str:
    match = OUTER_FENCE_RE.match(content)

    if match:
        return match.group("body").strip() + "\n"

    return content.strip() + "\n"


def validate_translation(
    source: str,
    translated: str,
    source_path: Path,
) -> None:
    if not translated.strip():
        raise RuntimeError(
            f"Empty translation generated for "
            f"{source_path}"
        )

    source_lines = source.lstrip()
    translated_lines = translated.lstrip()

    for delimiter in ("---", "+++"):
        if source_lines.startswith(delimiter):
            if not translated_lines.startswith(delimiter):
                raise RuntimeError(
                    "Front matter delimiter was lost for "
                    f"{source_path}"
                )

    if "@@AI_PROTECTED_" in translated:
        raise RuntimeError(
            "Unrestored protected placeholder found in "
            f"{source_path}"
        )


def translate_with_ai(
    source: str,
    source_path: Path,
    client: OpenAI,
) -> str:
    protected_source, protected_segments = (
        protect_segments(source)
    )

    last_error: Exception | None = None

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            response = client.responses.create(
                model=MODEL,
                instructions=SYSTEM_INSTRUCTIONS,
                input=protected_source,
            )

            translated = response.output_text

            translated = remove_outer_markdown_fence(
                translated
            )

            translated = restore_segments(
                translated,
                protected_segments,
            )

            validate_translation(
                source,
                translated,
                source_path,
            )

            return translated

        except Exception as exc:
            last_error = exc

            if attempt >= MAX_RETRIES:
                break

            wait_seconds = 2 ** attempt

            print(
                f"Translation attempt {attempt} failed "
                f"for {source_path}: {exc}",
                file=sys.stderr,
            )

            print(
                f"Retrying in {wait_seconds} seconds...",
                file=sys.stderr,
            )

            time.sleep(wait_seconds)

    raise RuntimeError(
        f"Translation failed after "
        f"{MAX_RETRIES} attempts: {source_path}"
    ) from last_error


def delete_orphan_translations(
    cache: dict[str, Any],
    current_source_keys: set[str],
) -> int:
    files = cache["files"]
    removed_count = 0

    for source_key in list(files.keys()):
        if source_key in current_source_keys:
            continue

        entry = files[source_key]

        if not isinstance(entry, dict):
            del files[source_key]
            continue

        target_value = entry.get("target")

        if (
            DELETE_ORPHAN_TRANSLATIONS
            and isinstance(target_value, str)
        ):
            target_path = Path(target_value)

            if target_path.exists():
                target_path.unlink()

                print(
                    "Deleted orphan English article: "
                    f"{target_path}"
                )

                removed_count += 1

        del files[source_key]

    return removed_count


# ============================================================
# 主程序
# ============================================================

def main() -> None:
    if not API_KEY:
        raise RuntimeError(
            "OPENAI_API_KEY is not configured."
        )

    if not MODEL:
        raise RuntimeError(
            "OPENAI_MODEL is not configured."
        )

    if not CONTENT_ROOT.exists():
        raise RuntimeError(
            "Hugo content directory does not exist: "
            f"{CONTENT_ROOT}"
        )

    client = OpenAI(api_key=API_KEY)

    cache = load_cache()

    source_paths = sorted(
        path
        for path in CONTENT_ROOT.rglob("*.md")
        if is_chinese_source(path)
    )

    current_source_keys = {
        path.as_posix()
        for path in source_paths
    }

    removed_count = delete_orphan_translations(
        cache,
        current_source_keys,
    )

    translated_count = 0
    skipped_count = 0
    disabled_count = 0

    for source_path in source_paths:
        source = source_path.read_text(
            encoding="utf-8"
        )

        if is_ai_translation_disabled(source):
            print(
                f"AI translation disabled: "
                f"{source_path}"
            )

            disabled_count += 1
            continue

        source_key = source_path.as_posix()
        target_path = get_english_path(source_path)
        digest = calculate_hash(source)

        previous_entry = cache["files"].get(
            source_key,
            {},
        )

        previous_hash = (
            previous_entry.get("sha256")
            if isinstance(previous_entry, dict)
            else None
        )

        if (
            not FORCE_TRANSLATE
            and target_path.exists()
            and previous_hash == digest
        ):
            print(
                f"Unchanged, skipping: {source_path}"
            )

            skipped_count += 1
            continue

        print(f"Translating: {source_path}")

        translated = translate_with_ai(
            source,
            source_path,
            client,
        )

        target_path.parent.mkdir(
            parents=True,
            exist_ok=True,
        )

        target_path.write_text(
            translated,
            encoding="utf-8",
        )

        cache["files"][source_key] = {
            "sha256": digest,
            "target": target_path.as_posix(),
            "model": MODEL,
        }

        translated_count += 1

        print(f"Generated: {target_path}")

    cache["version"] = CACHE_VERSION

    save_cache(cache)

    print()
    print("Translation summary")
    print("===================")
    print(f"Translated: {translated_count}")
    print(f"Unchanged:  {skipped_count}")
    print(f"Disabled:   {disabled_count}")
    print(f"Deleted:    {removed_count}")


if __name__ == "__main__":
    main()
