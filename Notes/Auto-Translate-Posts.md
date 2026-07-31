# Hugo Stack 博客：中文文章自动翻译为英文并部署到 GitHub Pages

## 1. 目标

实现下面的自动化流程：

```text
编写或修改中文文章
        ↓
Push 到 master 分支
        ↓
GitHub Actions 检测中文文章变化
        ↓
调用 OpenAI API 翻译
        ↓
生成对应的 .en.md 英文文章
        ↓
自动创建 Pull Request
        ↓
人工检查并合并 Pull Request
        ↓
GitHub Actions 运行 Hugo
        ↓
自动部署到 GitHub Pages
```

最终效果：

```text
中文文章：
content/post/my-article/index.md

英文文章：
content/post/my-article/index.en.md
```

中文站点通常是：

```text
https://www.jalen-qian.com/
```

英文站点通常是：

```text
https://www.jalen-qian.com/en/
```

Hugo 会根据文件名中的语言后缀识别语言。相同目录、相同基础文件名的 `index.md` 和 `index.en.md` 会被自动关联为同一篇文章的两个语言版本。([Hugo][1])

---

# 2. 方案特点

这套方案不会在每次运行时重新调用 AI 翻译所有文章。

它会：

* 第一次运行时翻译全部中文文章；
* 后续只翻译新增的中文文章；
* 中文文章修改后，重新生成对应英文文章；
* 中文文章没有变化时，不调用 OpenAI API；
* 使用 SHA-256 保存每篇中文文章的内容指纹；
* 自动创建 Pull Request，不直接修改 `master`；
* 中文文章删除后，可以同步删除英文版本；
* 支持用 `aiTranslate: false` 禁止 AI 维护特定文章。

脚本虽然会快速扫描 `content/post/`，但未变化的文章不会调用 API，因此不会产生重复翻译费用。

---

# 3. 需要创建的文件

最终项目结构大致如下：

```text
blog/
├── .github/
│   └── workflows/
│       ├── translate.yml
│       └── pages.yml
│
├── scripts/
│   ├── requirements.txt
│   └── translate_posts.py
│
├── content/
│   └── post/
│       └── my-article/
│           ├── index.md
│           ├── index.en.md
│           └── cover.jpg
│
├── themes/
│   └── hugo-theme-stack/
│
├── .ai-translation-cache.json
├── .gitignore
└── hugo.toml
```

其中：

```text
index.md
```

是你手动编写的中文原文。

```text
index.en.md
```

由 AI 自动创建。

```text
.ai-translation-cache.json
```

记录中文文章上一次翻译时的内容哈希，必须提交到 GitHub。

---

# 4. 检查 Hugo 多语言配置

你现在已经能看到中英文切换按钮，说明多语言配置大概率已经存在。仍然建议检查配置中的语言代码。

## 4.1 使用单个 `hugo.toml` 的情况

在项目根目录的 `hugo.toml` 中确认存在类似配置：

```toml
baseURL = "https://www.jalen-qian.com/"
theme = "hugo-theme-stack"

defaultContentLanguage = "zh-cn"
defaultContentLanguageInSubdir = false

[languages]

  [languages.zh-cn]
    languageName = "中文"
    languageCode = "zh-CN"
    weight = 1
    title = "Jalen的博客"

  [languages.en]
    languageName = "English"
    languageCode = "en-US"
    weight = 2
    title = "Jalen's Blog"
```

其中：

```toml
defaultContentLanguage = "zh-cn"
```

表示中文是默认语言。

```toml
defaultContentLanguageInSubdir = false
```

表示中文站点放在根路径：

```text
/
```

而英文站点放在：

```text
/en/
```

---

## 4.2 使用 Stack 的 `config/_default/` 结构

部分 Hugo Stack 项目的配置结构如下：

```text
config/
└── _default/
    ├── config.toml
    ├── languages.toml
    ├── params.toml
    └── menu.toml
```

这时可以在 `config/_default/config.toml` 中设置：

```toml
baseURL = "https://www.jalen-qian.com/"
theme = "hugo-theme-stack"

defaultContentLanguage = "zh-cn"
defaultContentLanguageInSubdir = false
```

在 `config/_default/languages.toml` 中设置：

```toml
[zh-cn]
languageName = "中文"
languageCode = "zh-CN"
weight = 1
title = "Jalen的博客"

[en]
languageName = "English"
languageCode = "en-US"
weight = 2
title = "Jalen's Blog"
```

不要同时在多个配置文件中重复定义冲突的语言设置。

---

# 5. 统一文章目录结构

推荐使用 Hugo Page Bundle：

```text
content/post/my-article/
├── index.md
├── index.en.md
└── cover.jpg
```

优点是中英文文章可以共用图片。

中文文章：

```text
content/post/my-article/index.md
```

英文文章：

```text
content/post/my-article/index.en.md
```

普通单文件文章也支持：

```text
content/post/my-article.md
content/post/my-article.en.md
```

本方案中的脚本同时支持这两种结构。

---

# 6. 准备 OpenAI API

## 6.1 创建 API Key

需要在 OpenAI API Platform 中创建 API Key。

注意：

> ChatGPT Plus 和 OpenAI API 是两个独立计费系统，ChatGPT Plus 不包含 API 使用额度。API 使用需要单独配置 API 计费。([OpenAI Help Center][2])

API Key 完整内容通常只会在创建时显示一次，创建后应立即保存。([OpenAI Help Center][3])

不要把 API Key 写进：

```text
translate_posts.py
translate.yml
hugo.toml
README.md
```

也不要提交到 GitHub。OpenAI 官方建议使用环境变量或秘密存储管理 API Key。([OpenAI Help Center][4])

---

## 6.2 添加 GitHub Secret

进入 GitHub 仓库：

```text
Settings
→ Secrets and variables
→ Actions
→ Secrets
→ New repository secret
```

创建：

```text
Name:
OPENAI_API_KEY
```

```text
Secret:
你的 OpenAI API Key
```

GitHub Actions Secrets 适合存储 API Key 等敏感信息。([GitHub Docs][5])

---

## 6.3 添加模型变量

进入：

```text
Settings
→ Secrets and variables
→ Actions
→ Variables
→ New repository variable
```

创建：

```text
Name:
OPENAI_MODEL
```

值填写你的 OpenAI API Project 中可以使用的模型，例如：

```text
gpt-5.6
```

脚本使用 OpenAI Responses API：

```python
client.responses.create(...)
```

并通过：

```python
response.output_text
```

读取文本结果，这是 OpenAI 官方当前提供的 Python 调用方式。([OpenAI Platform][6])

把模型名称保存在 GitHub Variable 中，可以在不修改代码的情况下切换模型。

---

# 7. 创建 Python 依赖文件

创建：

```text
scripts/requirements.txt
```

内容：

```text
openai
```

---

# 8. 创建自动翻译脚本

创建：

```text
scripts/translate_posts.py
```

完整内容如下：

```python
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
7. Preserve code, commands, class names, method names, variable names,
   file paths, API names, and configuration keys.
8. Preserve URLs and image paths.
9. Preserve HTML and Hugo shortcodes.
10. Preserve LaTeX and mathematical formulas.
11. Translate explanations around technical terms, but use standard
    English terminology for:
    - software engineering
    - algorithms
    - cloud computing
    - Kubernetes
    - DevOps
    - artificial intelligence
    - machine learning
12. Do not add information that does not exist in the source article.
13. Do not remove any section from the source article.
14. Keep existing English technical terms when they are already correct.
15. Produce valid UTF-8 Markdown.
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

FENCED_CODE_RE = re.compile(
    r"(?ms)"
    r"^(?P<fence>`{3,}|~{3,})[^\n]*\n"
    r".*?"
    r"^(?P=fence)[ \t]*$"
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

    # 先保护完整代码块。
    result = FENCED_CODE_RE.sub(
        replace_match,
        result,
    )

    # 再保护 Hugo shortcode。
    result = HUGO_SHORTCODE_RE.sub(
        replace_match,
        result,
    )

    # 最后保护行内代码。
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
```

---

# 9. 脚本如何区分新增和修改的文章

脚本会为每篇中文文章计算 SHA-256：

```python
digest = calculate_hash(source)
```

然后保存到：

```text
.ai-translation-cache.json
```

缓存文件大致如下：

```json
{
  "files": {
    "content/post/greedy-algorithm/index.md": {
      "model": "gpt-5.6",
      "sha256": "b7411fded70a...",
      "target": "content/post/greedy-algorithm/index.en.md"
    }
  },
  "version": 1
}
```

下一次运行时，脚本比较：

```text
当前中文文章的 SHA-256
```

和：

```text
缓存中上一次翻译的 SHA-256
```

判断逻辑如下：

| 状态         | 处理方式           |
| ---------- | -------------- |
| 新增中文文章     | 调用 AI 翻译       |
| 中文文章内容发生变化 | 调用 AI 重新翻译     |
| 中文文章完全没变   | 跳过，不调用 API     |
| 英文文章不存在    | 调用 AI 翻译       |
| 中文文章被删除    | 删除缓存，可同步删除英文文章 |
| 手动强制刷新     | 重新翻译全部中文文章     |

因此：

> 扫描所有文件不等于翻译所有文件。真正产生 API 请求的只有新增或修改过的文章。

---

# 10. 创建翻译工作流

创建：

```text
.github/workflows/translate.yml
```

完整内容如下：

```yaml
name: Translate Chinese posts

on:
  push:
    branches:
      - master

    paths:
      - "content/post/**/*.md"
      - "!content/post/**/*.en.md"
      - "scripts/translate_posts.py"
      - "scripts/requirements.txt"

  workflow_dispatch:
    inputs:
      force:
        description: "Re-translate all Chinese posts"
        required: false
        default: false
        type: boolean

permissions:
  contents: write
  pull-requests: write

concurrency:
  group: ai-article-translation
  cancel-in-progress: false

jobs:
  translate:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v7
        with:
          fetch-depth: 0
          submodules: recursive

      - name: Set up Python
        uses: actions/setup-python@v7
        with:
          python-version: "3.13"
          cache: "pip"
          cache-dependency-path: scripts/requirements.txt

      - name: Install Python dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r scripts/requirements.txt

      - name: Translate Chinese posts
        env:
          OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
          OPENAI_MODEL: ${{ vars.OPENAI_MODEL }}

          HUGO_CONTENT_ROOT: content/post
          AI_TRANSLATION_CACHE: .ai-translation-cache.json

          FORCE_TRANSLATE: >-
            ${{ inputs.force && 'true' || 'false' }}

          DELETE_ORPHAN_TRANSLATIONS: "true"

        run: |
          python scripts/translate_posts.py

      - name: Create translation pull request
        uses: peter-evans/create-pull-request@v8
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

          branch: ai/english-translations
          base: master

          delete-branch: true

          commit-message: >-
            Add or update English article translations

          title: >-
            AI: update English article translations

          body: |
            This Pull Request contains AI-generated English
            translations for new or modified Chinese Hugo posts.

            Please review:

            - English title
            - Technical terminology
            - Front matter
            - Categories and tags
            - Markdown links
            - Image paths
            - Hugo shortcodes
            - Mathematical formulas
            - Code blocks

            The Pull Request should be merged only after review.

          add-paths: |
            content/post/**/*.en.md
            .ai-translation-cache.json

          draft: false
```

当前官方的 `actions/checkout` 和 `actions/setup-python` 示例使用 `v7`；`create-pull-request` 当前文档使用 `v8`。([GitHub][7])

---

# 11. 如果你的目录是 `content/posts`

有些 Hugo 项目使用：

```text
content/posts/
```

而不是：

```text
content/post/
```

这时需要修改 `translate.yml` 中的路径。

把：

```yaml
- "content/post/**/*.md"
- "!content/post/**/*.en.md"
```

改成：

```yaml
- "content/posts/**/*.md"
- "!content/posts/**/*.en.md"
```

把：

```yaml
HUGO_CONTENT_ROOT: content/post
```

改成：

```yaml
HUGO_CONTENT_ROOT: content/posts
```

把：

```yaml
add-paths: |
  content/post/**/*.en.md
```

改成：

```yaml
add-paths: |
  content/posts/**/*.en.md
```

整个项目必须统一使用同一个目录。

---

# 12. 允许 GitHub Actions 创建 Pull Request

进入 GitHub 仓库：

```text
Settings
→ Actions
→ General
→ Workflow permissions
```

选择：

```text
Read and write permissions
```

然后勾选：

```text
Allow GitHub Actions to create and approve pull requests
```

最后点击：

```text
Save
```

GitHub 默认可能禁止工作流创建 Pull Request，因此必须检查这一项。([GitHub Docs][8])

虽然选项名称中包含 `approve pull requests`，本方案只让工作流创建 PR，不让它自动批准或自动合并。

---

# 13. 修改 GitHub Pages 部署方式

你现在原来的 Pages 工作流只是上传仓库中的：

```text
public/
```

例如：

```yaml
with:
  path: ./public
```

这种方式要求你每次在本地运行 Hugo，再把 `public/` 提交到 GitHub。

但是自动翻译后的英文文件是在 GitHub Actions 中生成的。合并英文文章 PR 后，如果 Pages 工作流不重新运行 Hugo，英文页面就不会被生成到 `public/`。

因此应改成：

```text
源 Markdown
→ GitHub Actions 运行 Hugo
→ 生成 public
→ 部署 GitHub Pages
```

GitHub 官方 Hugo Pages 工作流同样采用“先构建 Hugo，再上传 `public` artifact”的方式。([GitHub][9])

---

# 14. 创建新的 Pages 工作流

使用下面的内容替换：

```text
.github/workflows/pages.yml
```

完整内容如下：

```yaml
name: Build and deploy Hugo site

on:
  push:
    branches:
      - master

  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

defaults:
  run:
    shell: bash

jobs:
  build:
    runs-on: ubuntu-latest

    env:
      HUGO_VERSION: 0.164.0

    steps:
      - name: Checkout repository
        uses: actions/checkout@v7
        with:
          fetch-depth: 0
          submodules: recursive

      - name: Install Hugo Extended
        run: |
          wget \
            -O "${{ runner.temp }}/hugo.deb" \
            "https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/hugo_extended_${HUGO_VERSION}_linux-amd64.deb"

          sudo dpkg \
            -i "${{ runner.temp }}/hugo.deb"

          hugo version

      - name: Install Dart Sass
        run: |
          sudo snap install dart-sass

      - name: Configure GitHub Pages
        id: pages
        uses: actions/configure-pages@v5

      - name: Install Node.js dependencies
        run: |
          if [[ -f package-lock.json ]]; then
            npm ci
          elif [[ -f npm-shrinkwrap.json ]]; then
            npm ci
          else
            echo "No Node.js lock file found."
          fi

      - name: Build website with Hugo
        env:
          HUGO_CACHEDIR: ${{ runner.temp }}/hugo_cache
          HUGO_ENVIRONMENT: production

        run: |
          hugo \
            --gc \
            --minify \
            --baseURL "${{ steps.pages.outputs.base_url }}/"

      - name: Upload GitHub Pages artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./public

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}

    runs-on: ubuntu-latest

    needs:
      - build

    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

截至当前 Hugo 官方文档显示的版本为 `0.164.0`。Stack 主题通常需要 Hugo Extended 来处理 SCSS，因此这里安装 Extended 版本。([Hugo][10])

GitHub Pages 官方 starter workflow 使用：

```text
actions/configure-pages
actions/upload-pages-artifact
actions/deploy-pages
```

完成配置、artifact 上传和部署。([GitHub][9])

---

# 15. GitHub Pages 设置

进入：

```text
Repository
→ Settings
→ Pages
```

将：

```text
Source
```

设置为：

```text
GitHub Actions
```

不要再选择：

```text
Deploy from a branch
```

自定义域名保持：

```text
www.jalen-qian.com
```

Hugo 构建时使用：

```yaml
--baseURL "${{ steps.pages.outputs.base_url }}/"
```

这样 Pages 工作流会根据 GitHub Pages 当前配置生成正确的 `baseURL`，不需要在工作流中手动拼接域名。

---

# 16. 不再提交 `public/`

在 `.gitignore` 中加入：

```gitignore
/public/
/resources/_gen/
.DS_Store
```

如果 `public/` 已经被 Git 跟踪，执行：

```bash
git rm -r --cached public
```

这条命令只是从 Git 的版本控制中移除 `public/`，不会强制删除你本地的文件。

以后不需要再执行：

```bash
git add public
```

也不需要把生成后的 HTML、CSS 和 JavaScript 提交到仓库。

Pages 工作流会自动执行：

```bash
hugo --gc --minify
```

并自动生成新的 `public/`。

---

# 17. 首次提交配置

确认创建了这些文件：

```text
scripts/requirements.txt
scripts/translate_posts.py
.github/workflows/translate.yml
.github/workflows/pages.yml
.gitignore
```

然后执行：

```bash
git add \
  scripts \
  .github/workflows \
  .gitignore
```

如果修改了 Hugo 配置：

```bash
git add \
  hugo.toml \
  config
```

提交：

```bash
git commit \
  -m "Add automatic English translation workflow"
```

推送：

```bash
git push origin master
```

---

# 18. 第一次运行翻译

第一次运行时还没有：

```text
.ai-translation-cache.json
```

所以所有中文文章都会被视为尚未翻译。

进入 GitHub：

```text
Actions
→ Translate Chinese posts
→ Run workflow
```

第一次运行时：

```text
force = false
```

即可。

第一次运行会：

```text
扫描全部中文文章
→ 调用 OpenAI API
→ 创建全部 .en.md
→ 创建缓存文件
→ 创建 Pull Request
```

文章较多时，第一次运行的 API 使用量也会较大。

---

# 19. 检查自动生成的 Pull Request

工作流完成后，进入：

```text
Pull requests
```

应该看到：

```text
AI: update English article translations
```

检查以下内容：

* 标题是否自然；
* 专业术语是否准确；
* 代码块是否完整；
* 命令是否被修改；
* Markdown 链接是否正常；
* 图片路径是否正常；
* Hugo shortcode 是否完整；
* front matter 是否完整；
* 日期是否保持不变；
* `draft` 是否保持不变；
* 分类和标签是否合理；
* 数学公式是否完整。

确认后点击：

```text
Merge pull request
```

合并后，`master` 分支中会出现：

```text
content/post/.../index.en.md
.ai-translation-cache.json
```

随后 `pages.yml` 会自动运行 Hugo 并重新部署网站。

---

# 20. 以后发布新文章的日常流程

以后只需要写中文。

例如创建：

```text
content/post/my-new-post/index.md
```

内容：

```yaml
---
title: "我的新文章"
date: 2026-07-31
draft: false
categories:
  - 技术
tags:
  - Hugo
  - GitHub Actions
---

这里是中文正文。
```

本地预览：

```bash
hugo server -D
```

确认后提交：

```bash
git add content/post/my-new-post/index.md
```

```bash
git commit -m "Add new Chinese article"
```

```bash
git push origin master
```

之后自动发生：

```text
1. GitHub Actions 发现新增中文文章
2. AI 创建 index.en.md
3. 自动创建或更新翻译 Pull Request
4. 你检查英文内容
5. 合并 Pull Request
6. Hugo 自动构建
7. GitHub Pages 自动部署
```

---

# 21. 修改已有文章时的流程

修改：

```text
content/post/my-article/index.md
```

然后提交：

```bash
git add content/post/my-article/index.md
git commit -m "Update Chinese article"
git push origin master
```

脚本发现中文 SHA-256 已经改变，因此重新生成：

```text
content/post/my-article/index.en.md
```

没有修改的其他文章会显示：

```text
Unchanged, skipping
```

不会调用 OpenAI API。

---

# 22. 强制重新翻译全部文章

有时可能需要重新生成所有英文文章，例如：

* 更换了翻译模型；
* 修改了翻译 Prompt；
* 想统一全部英文术语；
* 旧翻译质量不好；
* 缓存和英文内容不同步。

进入：

```text
Actions
→ Translate Chinese posts
→ Run workflow
```

把：

```text
force
```

设置为：

```text
true
```

这时脚本会忽略 SHA-256 缓存，并重新翻译所有允许 AI 翻译的中文文章。

注意：

> 强制翻译会产生更多 API 使用量，并覆盖现有 AI 英文版本。

---

# 23. 禁止某篇文章被 AI 覆盖

如果某篇英文文章经过人工仔细修改，不希望以后被 AI 覆盖，可以在对应中文文章的 front matter 中加入：

```yaml
aiTranslate: false
```

例如：

```yaml
---
title: "Kubernetes Namespace 删除方法"
date: 2026-07-31
draft: false
aiTranslate: false
---
```

之后脚本会显示：

```text
AI translation disabled
```

并跳过这篇文章。

这适用于：

* 人工维护英文版；
* 不希望公开英文版；
* 文章包含大量特殊格式；
* 文章不适合机器翻译。

若以后恢复自动翻译，把它改成：

```yaml
aiTranslate: true
```

或者删除该字段。

---

# 24. 手动修改英文文章时的注意事项

假设你手动修改：

```text
index.en.md
```

而中文：

```text
index.md
```

没有变化。

下一次工作流运行时，中文 SHA-256 仍与缓存一致，因此脚本会跳过，不会覆盖英文修改。

但是，之后只要中文文章发生任何变化，脚本就会重新生成英文文章，并覆盖之前的人工修改。

对于长期人工维护的英文版，应在中文 front matter 中设置：

```yaml
aiTranslate: false
```

---

# 25. 删除文章时的行为

删除中文文章：

```text
content/post/old-post/index.md
```

并推送后，脚本会根据缓存找到对应英文文件：

```text
content/post/old-post/index.en.md
```

在当前配置中：

```yaml
DELETE_ORPHAN_TRANSLATIONS: "true"
```

所以英文版本也会自动删除。

如果不希望自动删除英文文章，把工作流中的：

```yaml
DELETE_ORPHAN_TRANSLATIONS: "true"
```

改成：

```yaml
DELETE_ORPHAN_TRANSLATIONS: "false"
```

---

# 26. 重命名文章目录时的行为

例如把：

```text
content/post/old-name/index.md
```

改成：

```text
content/post/new-name/index.md
```

脚本会把它视为：

```text
删除 old-name
新增 new-name
```

最终行为是：

```text
删除：
content/post/old-name/index.en.md

创建：
content/post/new-name/index.en.md
```

这是正常行为。

---

# 27. 缓存文件不能加入 `.gitignore`

必须提交：

```text
.ai-translation-cache.json
```

不要在 `.gitignore` 中添加：

```gitignore
.ai-translation-cache.json
```

如果缓存文件丢失，脚本无法知道哪些文章已经翻译过，会把所有中文文章当成首次处理。

正确的 `.gitignore` 示例：

```gitignore
/public/
/resources/_gen/
.DS_Store

# 不要忽略下面这个文件：
# .ai-translation-cache.json
```

---

# 28. 为什么使用 Pull Request，而不是直接提交到 master

AI 翻译可能出现：

* 专业术语不准确；
* 分类名称不统一；
* 标题翻译不自然；
* Markdown 格式被轻微修改；
* 技术含义被误解；
* 中英文表达风格不一致。

因此推荐：

```text
AI 生成翻译
→ 自动创建 PR
→ 人工检查
→ 手动合并
```

而不是：

```text
AI 生成翻译
→ 直接上线
```

GitHub 也提醒，让自动化工作流创建或批准 Pull Request 涉及安全和代码审查风险，因此不应在没有检查的情况下自动合并。([GitHub Docs][11])

---

# 29. 常见错误排查

## 29.1 `OPENAI_API_KEY is not configured`

原因：

```text
GitHub Secret 中没有 OPENAI_API_KEY
```

检查：

```text
Settings
→ Secrets and variables
→ Actions
→ Secrets
```

Secret 名称必须严格是：

```text
OPENAI_API_KEY
```

---

## 29.2 `OPENAI_MODEL is not configured`

原因：

```text
GitHub Variable 中没有 OPENAI_MODEL
```

检查：

```text
Settings
→ Secrets and variables
→ Actions
→ Variables
```

变量名称必须是：

```text
OPENAI_MODEL
```

---

## 29.3 API Key 错误

可能出现：

```text
Incorrect API key
```

处理方法：

* 检查是否复制了完整 API Key；
* 检查 Key 是否已被删除；
* 创建新的 API Key；
* 更新 GitHub Secret；
* 不要在 Secret 前后加入引号或空格。

---

## 29.4 API 没有余额或未启用计费

ChatGPT Plus 不包含 API 使用额度。

需要进入 OpenAI API Platform 单独配置 API Billing。([OpenAI Help Center][12])

---

## 29.5 工作流没有创建 Pull Request

检查：

```text
Settings
→ Actions
→ General
→ Workflow permissions
```

确认：

```text
Read and write permissions
```

以及：

```text
Allow GitHub Actions to create and approve pull requests
```

已经启用。

---

## 29.6 工作流成功，但没有任何 PR

查看运行日志。

如果全部显示：

```text
Unchanged, skipping
```

说明没有文章发生变化，这是正常情况。

如果想强制测试，手动运行工作流并设置：

```text
force = true
```

---

## 29.7 英文文章生成了，但英文首页仍然为空

检查是否已经：

1. 合并翻译 Pull Request；
2. 成功运行 `pages.yml`；
3. GitHub Pages Source 设置为 `GitHub Actions`；
4. Hugo 的英文语言代码是 `en`；
5. 英文文件名是 `.en.md`；
6. 英文文章中的 `draft` 不是 `true`。

本地运行：

```bash
hugo server -D
```

访问：

```text
http://localhost:1313/en/
```

---

## 29.8 Stack 样式构建失败

Hugo Stack 通常需要 Hugo Extended。

检查 Pages 工作流日志中的：

```bash
hugo version
```

结果中应包含：

```text
extended
```

如果没有，说明安装了普通 Hugo，而不是 Hugo Extended。

---

## 29.9 主题文件找不到

如果 Stack 主题使用 Git Submodule，工作流必须包含：

```yaml
with:
  submodules: recursive
```

本方案已经配置。

本地也可以检查：

```bash
git submodule status
```

---

## 29.10 CSS URL 再次出现重复域名

构建时使用：

```yaml
--baseURL "${{ steps.pages.outputs.base_url }}/"
```

同时确保 Hugo 配置中没有错误的：

```toml
baseURL = "/https://www.jalen-qian.com/"
```

正确值应为：

```toml
baseURL = "https://www.jalen-qian.com/"
```

不要在主题模板中手动拼接：

```go-html-template
/{{ .Site.BaseURL }}
```

---

# 30. 最终日常操作总结

以后你只需要执行：

```bash
hugo server -D
```

完成中文文章后：

```bash
git add content
git commit -m "Add or update Chinese article"
git push origin master
```

后面的流程自动完成：

```text
中文内容 Push
        ↓
AI 检查 SHA-256
        ↓
只翻译新增或修改文章
        ↓
创建英文 .en.md
        ↓
自动创建 PR
        ↓
人工检查并合并
        ↓
Hugo 自动构建
        ↓
GitHub Pages 自动部署
```

最终维护原则：

```text
中文 index.md：
由你负责，是主要内容源。

英文 index.en.md：
默认由 AI 负责。

.ai-translation-cache.json：
记录翻译状态，必须提交。

public/：
由 GitHub Actions 自动生成，不再提交。
```

[1]: https://gohugo.io/content-management/multilingual/?utm_source=chatgpt.com "Multilingual mode"
[2]: https://help.openai.com/en/articles/8156019-how-can-i-move-my-chatgpt-subscription-to-the-api?utm_source=chatgpt.com "How can I move my ChatGPT subscription to the API?"
[3]: https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-api-key?utm_source=chatgpt.com "Where do I find my OpenAI API Key?"
[4]: https://help.openai.com/en/articles/5112595-best-practices-for-api-key-safety?utm_source=chatgpt.com "Best Practices for API Key Safety"
[5]: https://docs.github.com/actions/security-guides/using-secrets-in-github-actions?utm_source=chatgpt.com "Using secrets in GitHub Actions"
[6]: https://platform.openai.com/docs/guides/text?api-mode=responses "Text generation | OpenAI API"
[7]: https://github.com/actions/setup-python "GitHub - actions/setup-python: Set up your GitHub Actions workflow with a specific version of Python · GitHub"
[8]: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository?utm_source=chatgpt.com "Managing GitHub Actions settings for a repository"
[9]: https://github.com/actions/starter-workflows/blob/main/pages/hugo.yml "starter-workflows/pages/hugo.yml at main · actions/starter-workflows · GitHub"
[10]: https://gohugo.io/installation/?utm_source=chatgpt.com "Installation"
[11]: https://docs.github.com/en/actions/reference/security/secure-use?utm_source=chatgpt.com "Secure use reference - GitHub Docs"
[12]: https://help.openai.com/en/articles/9039756-managing-billing-settings-on-chatgpt-web-and-platform?utm_source=chatgpt.com "Managing Billing Settings on ChatGPT Web and Platform"
