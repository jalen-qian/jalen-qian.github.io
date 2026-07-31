---
title: "Common Hugo Commands"
date: 2020-09-10T08:37:56+08:00
lastmod: 2020-09-10T01:37:56+08:00
draft: false
tags: ["hugo"]
categories: ["hugo"]
author: "Jalen"

contentCopyright: '<a rel="license noopener" href="https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License" target="_blank">Creative Commons Attribution-ShareAlike License</a>'


---

Hugo is a command-line-based static site generator, so it is essential to understand its basic commands.

## Common Commands

You can use the `hugo help` command to access Hugo's command-line documentation. Each command is described in more detail below. Before getting started, you need to install Hugo locally and add it to your environment variables.

### hugo new site

Creates a new website skeleton. For example, `hugo new site mysite` creates a `mysite` folder in the current directory and populates it with the required directories and files. You can also specify a path where the new website should be created. The structure of the `mysite` folder is shown below:

```bash
├─archetypes
├─content
├─data
├─layouts
├─resources
│  └─_gen
│      ├─assets
│      └─images
├─static
└─themes
    └─study-theme
        ├─archetypes
        ├─layouts
        │  ├─partials
        │  └─_default
        └─static
            ├─css
            └─js
``` 

The `content` folder contains the source material used to generate the website, while the `themes` folder contains the website's UI. Hugo uses these resources to generate the static website.

### hugo new

Adds content to the website. For example, `hugo new about.md` creates an `about.md` file in the `content` directory, from which the corresponding static page can be generated. You can add a path before `about.md`, but the path is always relative to the `content` directory. In other words, all newly added files are stored under the `content` directory.

### hugo new theme

Adds a UI to the website, namely template or theme files. For example, `hugo new theme mytheme` creates a `mytheme` directory under the `themes` directory and adds a basic file structure to it by default. All template and theme files are stored in the `themes` directory.

### hugo

`hugo` is itself a command used to generate the static website. By default, the generated static files are saved in the `public` directory. You can also specify a different path.

### hugo server

Hugo includes a built-in web server. After running `hugo server`, you can access the static website at [http://localhost:1313](http://localhost:1313/). There is no need to set up a server environment yourself, which is very convenient.

Below are commonly used parameters for `hugo server`. Note that they are case-sensitive:

- `-p port`: Changes the default port.
- `-D`: When previewing the website using the server, draft files whose `draft` property is set to `true` are not included in the preview. Add `-D` to preview draft files.
