---
title: Typora换主题背景
published: 2025-06-12
tags:
  - Typora
category: Typora
image: https://cdn.mengze.vip/gh/Skarie/hexoimg/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91%E5%8F%A4%E5%BB%BA%E7%AD%91%E5%A3%81%E7%BA%B8-%E5%A3%81%E7%BA%B8.png
---
多说无益，详细信息请[点击我](https://github.com/Skarie/typora-theme-github-Skarie)

```skarie.css
/* 全局变量定义 */

:root {

    --mask-bg-color: rgba(240, 238, 238, 0.2); /* 统一蒙版颜色和透明度 */

    --mask-bg-rgb: 240, 238, 238; /* 提取RGB值用于状态调整 */

    --control-text-color: #000;

    --body-bg-image: url('https://haowallpaper.com/link/common/file/previewFileImg/16845070927449472');

}

  

/* 页面整体蒙版 */

body::before {

    content: "";

    position: fixed;

    top: 0;

    left: 0;

    width: 100%;

    height: 100%;

    background-color: var(--mask-bg-color);

    background-image: var(--body-bg-image);

    background-size: cover;

    z-index: -1;

    pointer-events: none;

}

  

/* 全局背景继承 */

html, body {

    height: 100%;

    margin: 0;

    padding: 0;

    background: transparent; /* 移除重复背景设置 */

    background-color:  rgba(240, 238, 238, 0.2);

}

  

body {

    font-family: "Open Sans", "Clear Sans", "Helvetica Neue", Helvetica, Arial, 'Segoe UI Emoji', sans-serif;

    color: #000;

    line-height: 1.6;

}

  

#write {

    max-width: 860px;

    margin: 0 auto;

    padding: 30px;

    padding-bottom: 100px;

    background-color: transparent;

}

  

@media only screen and (min-width: 1400px) {

    #write {

        max-width: 1024px;

    }

}

  

@media only screen and (min-width: 1800px) {

    #write {

        max-width: 1200px;

    }

}

  

#write > ul:first-child,

#write > ol:first-child {

    margin-top: 30px;

}

  

a {

    color: #4183C4;

}

  

h1, h2, h3, h4, h5, h6 {

    position: relative;

    margin-top: 1rem;

    margin-bottom: 1rem;

    font-weight: bold;

    line-height: 1.4;

    cursor: text;

    color: #000;

}

  

h1:hover a.anchor,

h2:hover a.anchor,

h3:hover a.anchor,

h4:hover a.anchor,

h5:hover a.anchor,

h6:hover a.anchor {

    text-decoration: none;

}

  

h1 tt,

h1 code {

    font-size: inherit;

}

  

h2 tt,

h2 code {

    font-size: inherit;

}

  

h3 tt,

h3 code {

    font-size: inherit;

}

  

h4 tt,

h4 code {

    font-size: inherit;

}

  

h5 tt,

h5 code {

    font-size: inherit;

}

  

h6 tt,

h6 code {

    font-size: inherit;

}

  

h1 {

    font-size: 2.25em;

    line-height: 1.2;

    border-bottom: 1px solid #eee;

}

  

h2 {

    font-size: 1.75em;

    line-height: 1.225;

    border-bottom: 1px solid #eee;

}

  

h3 {

    font-size: 1.5em;

    line-height: 1.43;

}

  

h4 {

    font-size: 1.25em;

}

  

h5 {

    font-size: 1em;

}

  

h6 {

    font-size: 1em;

    color: #555;

}

  

p,

blockquote,

ul,

ol,

dl,

table {

    margin: 0.8em 0;

}

  

li > ol,

li > ul {

    margin: 0 0;

}

  

hr {

    height: 2px;

    padding: 0;

    margin: 16px 0;

    border: 0 none;

    overflow: hidden;

    box-sizing: content-box;

}

  

li p.first {

    display: inline-block;

}

  

ul,

ol {

    padding-left: 30px;

}

  

ul:first-child,

ol:first-child {

    margin-top: 0;

}

  

ul:last-child,

ol:last-child {

    margin-bottom: 0;

}

  

blockquote {

    border-left: 4px solid #dfe2e5;

    padding: 0 15px;

    color: #777777;

}

  

blockquote blockquote {

    padding-right: 0;

}

  

table {

    padding: 0;

    word-break: initial;

}

  

table tr {

    border: 1px solid #dfe2e5;

    margin: 0;

    padding: 0;

}

  

table tr:nth-child(2n),

thead {

    background-color: #f8f8f8;

}

  

table th {

    font-weight: bold;

    border: 1px solid #dfe2e5;

    border-bottom: 0;

    margin: 0;

    padding: 6px 13px;

}

  

table td {

    border: 1px solid #dfe2e5;

    margin: 0;

    padding: 6px 13px;

}

  

table th:first-child,

table td:first-child {

    margin-top: 0;

}

  

table th:last-child,

table td:last-child {

    margin-bottom: 0;

}

  

.CodeMirror-lines {

    padding-left: 4px;

}

  

.code-tooltip {

    box-shadow: 0 1px 1px 0 rgba(0,28,36,.3);

    border-top: 1px solid #eef2f2;

}

  

.md-fences,

code,

tt {

    border: 1px solid #e7eaed;

    border-radius: 3px;

    padding: 2px 4px;

    font-size: 0.9em;

}

  

code {

    padding: 0 2px;

}

  

.md-fences {

    margin: 15px 0;

    padding: 8px 6px;

}

  

.md-task-list-item > input {

    margin-left: -1.3em;

}

  

@media print {

    html {

        font-size: 13px;

    }

    pre {

        page-break-inside: avoid;

        word-wrap: break-word;

    }

}

  

#write pre.md-meta-block {

    padding: 1rem;

    font-size: 85%;

    line-height: 1.45;

    color: #777777;

    margin-top: 0 !important;

}

  

.mathjax-block > .code-tooltip {

    bottom: .375rem;

}

  

.md-mathjax-midline {

    /* background: #fafafa; */

}

  

#write > h3.md-focus:before,

#write > h4.md-focus:before,

#write > h5.md-focus:before,

#write > h6.md-focus:before {

    left: -1.5625rem;

    top: 0.285714286rem;

}

  

.md-image > .md-meta {

    border-radius: 3px;

    padding: 2px 0 0 4px;

    font-size: 0.9em;

    color: inherit;

}

  

.md-tag {

    color: #a7a7a7;

    opacity: 1;

}

  

.md-toc {

    margin-top: 20px;

    padding-bottom: 20px; /* 修复拼写错误 */

}

  

.sidebar-tabs {

    border-bottom: none;

}

  

#typora-quick-open {

    border: 1px solid #ddd;

}

  

#typora-quick-open-item {

    border-color: #FEFEFE #e5e5e5 #e5e5e5 #eee;

    border-style: solid;

    border-width: 1px;

}

  

/** focus mode */

.on-focus-mode blockquote {

    border-left-color: rgba(85, 85, 85, 0.12);

}

  

header, .context-menu, .megamenu-content, footer{

    font-family: "Segoe UI", "Arial", sans-serif;

}

  

.file-node-content:hover .file-node-icon,

.file-node-content:hover .file-node-open-state{

    visibility: visible;

}

  

.mac-seamless-mode #typora-sidebar {

    background-color: var(--side-bar-bg-color);

}

  

.mac-os #write{

    caret-color: AccentColor;

}

  

.md-lang {

    color: #b4654d;

}

  

.html-for-mac {

    --item-hover-bg-color: #E6F0FE;

}

  

#md-notification .btn {

    border: 0;

}

  

.dropdown-menu .divider {

    border-color: #e5e5e5;

    opacity: 0.4;

}

  

.ty-preferences .window-content {

    background-color: #fafafa;

}

  

.ty-preferences .nav-group-item.active {

    color: white;

    background: #999;

}

  

.menu-item-container a.menu-style-btn {

    background-color: #f5f8fa;

    background-image: linear-gradient( 180deg , hsla(0, 0%, 100%, 0.8), hsla(0, 0%, 100%, 0));

}

  

/* 侧边栏样式优化（使用全局蒙版） */

#typora-sidebar,

.sidebar-content-content,

.file-list-item {

    /* background-color: transparent !important; 继承全局蒙版 */

    background-color:  rgba(255, 255, 255, 0.05) !important; /* 使用全局蒙版颜色 */

    /* background-image: none !important; /* 移除背景图片 */

    /* backdrop-filter: blur(5px) !important; /*添加模糊效果*/

    /* -webkit-backdrop-filter: blur(10px) !important; 添加模糊效果 */

    /* color: var(--control-text-color) !important; 使用全局文本颜色 */

}

  

::-webkit-scrollbar-track {

    background: rgba(255, 255, 255, 0.2) !important;

}

  

.file-list-item:hover {

    background-color: rgba(var(--mask-bg-rgb), 0.6) !important; /* 基于全局蒙版调整透明度 */

}

  

.file-list-item.active {

    background-color: rgba(var(--mask-bg-rgb), 0.7) !important; /* 基于全局蒙版调整透明度 */

}

  

.outline-item:hover {

    background-color: rgba(var(--mask-bg-rgb), 0.6) !important; /* 基于全局蒙版调整透明度 */

}

  

/* 侧边栏折叠按钮背景 */

.file-tree-node-expanded > .file-node-background {

    background-color: rgba(var(--mask-bg-rgb), 0.5) !important; /* 基于全局蒙版 */

}

  

/* 侧边栏文件图标 */

.file-node-icon,

.file-node-open-state {

    color: #555 !important;

}

  

/* 侧边栏文字颜色 */

.file-list-item,

.outline-item {

    color: #333 !important;

}

  

/* 侧边栏分割线 */

.file-list-item {

    border-bottom: 1px solid rgba(0,0,0,0.1) !important;

}
```