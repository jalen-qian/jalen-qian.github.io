---
title: "Common Git Commands"
date: 2020-09-25
lastmod: 2020-09-25
draft: false
tags: ["Git"]
categories: ["Git"]
author: "Jalen"
---

Reposted from [Ruan Yifeng's Blog](https://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html)

I use Git every day, but I cannot remember many of its commands.

Generally, you only need to remember the six commands shown below for everyday use. However, to use Git proficiently, you may need to remember 60 to 100 commands.

![img](https://cdn1.jalen-qian.com/BlogBase/bg2015120901.png)

Below is my list of commonly used Git commands. The translations of several Git-specific terms are as follows:

 - Workspace: working directory
 - Index / Stage: staging area
 - Repository: repository (or local repository)
 - Remote: remote repository

## 1. Create a Repository

```bash
# Create a new Git repository in the current directory
$ git init

# Create a new directory and initialize it into Git code Library
$ git init [project-name]

# Download a project and its entire code history.
$ git clone [url]
```

## 2. Configuration

The Git configuration file is `.gitconfig`. It can be located in the user's home directory for global configuration or in the project directory for project-specific configuration.

```bash
# Show the current Git configuration
$ git config --list

# Edit Git profile
$ git config -e [--global]

# Set user information for submitting code
$ git config [--global] user.name "[name]"
$ git config [--global] user.email "[email address]"
```

## 3. Add/Delete Files

```bash
# Add specified file to temporary storage
$ git add [file1] [file2] ...

# Add specified directories to temporary storage, including subdirectories
$ git add [dir]

# Add all files of the current directory to the temporary storage area
$ git add .

# Before adding every change, you will ask for confirmation.
# For multiple changes in the same document, sub-submission is possible
$ git add -p

# Delete the workspace file and place this deletion in the reserve
$ git rm [file1] [file2] ...

# Stop tracking the specified file, but it will remain in the working area
$ git rm --cached [file]

# Rename file and place it in the reserve
$ git mv [file-original] [file-renamed]
```

## 4. Commit Changes

```bash
# Commit to storage area
$ git commit -m [message]

# Submit the specified file to the repository area for the temporary storage area
$ git commit [file1] [file2] ... -m [message]

# Submission of changes in the workspace since last session to the warehouse area
$ git commit -a

# Show all diff information when submitting
$ git commit -v

# Use one new submission instead of the previous submission
# If there are no new changes to the code, use to rewrite the last submission of the committee
$ git commit --amend -m [message]

# Redo last session and include new changes to the specified file
$ git commit --amend [file1] [file2] ...
```

## 5. Branches

```bash
# List all local branches
$ git branch

# List all remote branches
$ git branch -r

# List all local and remote branches
$ git branch -a

# New branch, but still in the current branch
$ git branch [branch-name]

# Create a new branch and switch to it
$ git checkout -b [branch]

# Create a new branch, point to the specified committee
$ git branch [branch] [commit]

# Create a new branch to track the specified remote branch
$ git branch --track [branch] [remote-branch]

# Switch to the specified branch and update the workspace
$ git checkout [branch-name]

# Switch to Previous Branch
$ git checkout -

# Establish a tracking relationship between the existing branch and the designated remote branch
$ git branch --set-upstream [branch] [remote-branch]

# Merge specified branch to current branch
$ git merge [branch]

# Select a committee to merge into the current branch
$ git cherry-pick [commit]

# Remove Branch
$ git branch -d [branch-name]

# Remove Remote Branch
$ git push origin --delete [branch-name]
$ git branch -dr [remote/branch]
```

## 6. Tags

```bash
# List All Tags
$ git tag

# New Tag
$ git tag [tag]

# New Tag Aspecting
$ git tag [tag] [commit]

# Delete Local Tag
$ git tag -d [tag]

# Remove Remote Tag
$ git push origin :refs/tags/[tagName]

# View Tag Information
$ git show [tag]

# Commit Assign Tag
$ git push [remote] [tag]

# Commit All Tags
$ git push [remote] --tags

# New branch, point to a tag
$ git checkout -b [branch] [tag]
```

## 7. View Information

```bash
# Show Changed Files
$ git status

# Show the version history of the current branch
$ git log

# Show the history of the group and the files that change each time the group changes
$ git log --stat

# Search for submission history, by keyword
$ git log -S [keyword]

# Shows all changes after a certain group, each one takes a line
$ git log [tag] HEAD --pretty=format:%s

# Show all changes after a certain group, whose "presentation" must meet the search criteria
$ git log [tag] HEAD --grep feature

# Shows the history of the version of a document, including the renaming of a file
$ git log --follow [file]
$ git whatchanged [file]

# Show each diff associated with the specified file
$ git log -p [file]

# Show past 5 submissions
$ git log -5 --pretty --oneline

# Show all submitted users, sort by number of submissions
$ git shortlog -sn

# Show when the specified file was modified
$ git blame [file]

# Show differences between temporary storage areas and work areas
$ git diff

# Show the difference between the temporary storage area and the previous section
$ git diff --cached [file]

# Show differences between the workspace and the current branch
$ git diff HEAD

# Show discrepancies between two submissions
$ git diff [first-branch]...[second-branch]

# Show how many lines you wrote today.
$ git diff --shortstat "@{0 day ago}"

# Show metadata and content changes submitted at a given time
$ git show [commit]

# Show a file submitting a change
$ git show --name-only [commit]

# Displays the contents of a file when it is submitted
$ git show [commit]:[filename]

# Show the latest submissions of the current branch
$ git reflog
```

## 8. Remote Synchronization

```bash
# Download all changes in remote warehouse
$ git fetch [remote]

# Show all remote repositories
$ git remote -v

# Show information about a remote repository
$ git remote show [remote]

# Add a new remote repository and name it
$ git remote add [shortname] [url]

# Retrieving remote warehouse changes and merging with local branches
$ git pull [remote] [branch]

# Upload local specified branch to remote repository
$ git push [remote] [branch]

# Force the current branch to a remote warehouse, even in conflict
$ git push [remote] --force

# Send all branches to remote warehouse
$ git push [remote] --all
```

## 9. Undo Changes

```bash
# Restore the specified file to the working area
$ git checkout [file]

# Restore a specified file to the temporary and working areas
$ git checkout [commit] [file]

# Restore all files in the temporary storage area to the working area
$ git checkout .

# Reset the specified file for the temporary storage area, consistent with the previous session, but the workspace remains unchanged
$ git reset [file]

# Reset the hold area and the work area, in line with previous session
$ git reset --hard

# Reset the pointer of the current branch to the specified group while reset the hold area, but the workspace remains unchanged
$ git reset [commit]

# Reset the current branch of HEAD as the designated group, and reset the temporary and working areas in line with the assigned group
$ git reset --hard [commit]

# Reset the current HEAD as a specified group but keep the temporary and working areas unchanged
$ git reset --keep [commit]

# Create a new committee to cancel designation
# All changes in the latter will be offset by the former and applied to the current branch
$ git revert [commit]

# Remove pending changes for the time being and move them later
$ git stash
$ git stash pop
```

## 10. Other Commands

```bash
# Generate a compressed package for release
$ git archive
```

### Force Local Code to Match the Remote Repository

```bash
git fetch --all
git reset --hard origin/master
git pull
```

Git commands to forcibly overwrite local code (run individually):

```bash
git fetch --all &&  git reset --hard origin/master && git pull
```
The first command fetches all updates without synchronizing them.
The second command synchronizes the local code with the latest remote version (it overwrites all local files that have the same names as files in the remote repository).
The third command updates the code once more (this step is optional because the second command has already done so).

(The End)
