---
title: Hexo图片显示
published: 2025-03-01
tags:
  - Hexo
category: Hexo
image: /articel/Hexo图片显示.png
category_bar: "true"
---

对于那些想要更有规律地提供图片和其他资源以及想要将他们的资源分布在各个文章上的人来说，Hexo也提供了更组织化的方式来管理资源。 这个稍微有些复杂但是管理资源非常方便的功能可以通过将 `config.yml` 文件中的 `post_asset_folder` 选项设为 `true` 来打开。
```_config.yml
post_asset_folder: true
```
当资源文件管理功能打开后，Hexo将会在你每一次通过 `hexo new [layout] <title>` 命令创建新文章时自动创建一个文件夹。 这个资源文件夹将会有与这个文章文件一样的名字。 将所有与你的文章有关的资源放在这个关联文件夹中之后，你可以通过相对路径来引用它们，这样你就得到了一个更简单而且方便得多的工作流。
## 使用 Markdown 嵌入图片

[hexo-renderer-marked](https://github.com/hexojs/hexo-renderer-marked) 3.1.0 引入了一个新的选项，其允许你无需使用 `asset_img` 标签插件就可以在 markdown 中嵌入图片

如需启用：

_config.yml

|                                                                                      |
| ------------------------------------------------------------------------------------ |
| post_asset_folder: true  <br>marked:  <br>  prependRoot: true  <br>  postAsset: true |

启用后，资源图片将会被自动解析为其对应文章的路径。 例如： `image.jpg` 位置为 `/2020/01/02/foo/image.jpg` ，这表示它是 `/2020/01/02/foo/` 文章的一张资源图片， `![](image.jpg)` 将会被解析为 `<img src="/2020/01/02/foo/image.jpg">` 。
然后
```bash
hexo g
```
停止项目
```bash
hexo clean
```
清除缓存
```bash
hexo s
```
运行项目
不出意外就能正常解析图片
如果还是不行
那就把插件重新装一下吧
```bash
npm install hexo-renderer-marked --save
```
然后
```bash
hexo g
```
停止项目
```bash
hexo clean
```
清除缓存
```bash
hexo s
```
运行项目
就可以了
