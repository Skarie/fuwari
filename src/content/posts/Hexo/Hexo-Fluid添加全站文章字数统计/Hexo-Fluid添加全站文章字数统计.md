---
title: Hexo-Fluid添加全站文章字数统计
published: 2025-06-06
tags:
  - Hexo
  - Fluid
category: Hexo
image: https://cdn.mengze.vip/gh/Skarie/hexoimg/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91%E5%AD%A4%E6%A0%91-%E6%A0%91%E6%9C%A8-%E6%B9%96%E6%99%AF.png
category_bar: "true"
---

本次功能实现在归档页面
通过编辑`archive-list.ejs`和`archive.ejs`实现

`archive-list.ejs`代码如下：
```archive-list.ejs
<div class="list-group">

  <p class="h4"><%= __(params.key + '.post_total', params.postTotal) %>

    <!-- 添加字数统计 -->

    <%= __(params.postBitTotal + ' 个字') %>

  </p>

  

  <hr>

  <% var dateCursor %>

  <% page.posts.each(function (post) { %>

    <% if(date(post.date, "YYYY") !== dateCursor) { %>

      <% dateCursor = date(post.date, "YYYY") %>

      <p class="h5"><%= dateCursor %></p>

    <% } %>

    <a href="<%= url_for(post.path) %>" class="list-group-item list-group-item-action">

      <time><%= date(post.date, "MM-DD") %></time>

      <div class="list-group-item-title"><%= post.title %></div>

    </a>

  <% }) %>

</div>

  

<%- partial('_partials/paginator') %>
```


`archive.ejs`代码如下：
```archive.ejs
<%

page.layout = "archive"

page.title = theme.archive.title || __('archive.title')

page.subtitle = theme.archive.subtitle || __('archive.subtitle')

page.banner_img = theme.archive.banner_img

page.banner_img_height = theme.archive.banner_img_height

page.banner_mask_alpha = theme.archive.banner_mask_alpha

%>

  

<!-- <%- partial('_partials/archive-list.ejs', { params: { key: page.layout, postTotal: site.posts.length } }) %> -->

<%- partial('_partials/archive-list.ejs', { params: { key: page.layout, postTotal: site.posts.length, postBitTotal: wordtotal(site) } }) %>

```


效果图：

![](./1.png)

