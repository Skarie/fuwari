---
title: 对「Fluid主题footer颜色定义」补充定稿
published: 2025-04-30
tags:
  - Fluid
category: Fluid修改
image: /articel/对「Fluid主题footer颜色定义」补充定稿.png
# https://haowallpaper.com/link/common/file/previewFileImg/86a6e519c7a8e4c4586e8fb8f7d8f07c86a6e519c7a8e4c4586e8fb8f7d8f07c
category_bar: "true"
---

# 前言
我咧个豆豆，当你看到这篇文章的时候，上一篇就不需要了[Fluid主题footer颜色定义](/Fluid修改/Fluid主题footer颜色定义)
因为，内个还是有点问题，当然我也尝试过读取他的data，毛用！！
# # 添加css样式

老规矩，采用注入的方式


 在`source/css`目录新建`footer.css`
 footer.css:
 ```css
 @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;500;600;700&display=swap');

:root {

    --day-footer-color: #268bc5; /* 白天模式页脚字体颜色 */

    --night-footer-color: #fff; /* 黑夜模式页脚字体颜色 */

    --day-footer-hover-color: #1a628b; /* 白天模式页脚 a 标签悬停字体颜色 */

    --night-footer-hover-color: #ccc; /* 黑夜模式页脚 a 标签悬停字体颜色 */

    --transition-duration: 0.3s; /* 过渡效果持续时间 */
}

/* 页脚容器样式 */

.footer-inner {

    transition: color var(--transition-duration) ease, background-color var(--transition-duration) ease;

    font-weight: bold; /* 页脚字体加粗 */

    font-family: 'Dancing Script', cursive; /* 设置字体 */

}

/* 白天模式页脚样式 */

body[data-color-scheme="day"] .footer-inner {

    color: var(--day-footer-color);

    background-color: var(--day-bg-color);

}

/* 黑夜模式页脚样式 */

body[data-color-scheme="night"] .footer-inner {

    color: var(--night-footer-color);

    background-color: var(--night-bg-color);

}

/* 白天模式页脚 a 标签样式 */

body[data-color-scheme="day"] .footer-inner a {

    color: var(--day-footer-color);

    background-color: var(--day-bg-color);

    transition: color var(--transition-duration) ease;

    font-weight: bold; /* 白天模式页脚 a 标签字体加粗 */

    font-family: 'Dancing Script', cursive; /* 设置字体 */

}
  

/* 黑夜模式页脚 a 标签样式 */

body[data-color-scheme="night"] .footer-inner a {

    color: var(--night-footer-color);

    background-color: var(--night-bg-color);

    transition: color var(--transition-duration) ease;

    font-weight: bold; /* 黑夜模式页脚 a 标签字体加粗 */

    font-family: 'Dancing Script', cursive; /* 设置字体 */

}
 

/* 白天模式页脚 a 标签悬停样式 */

body[data-color-scheme="day"] .footer-inner a:hover {

    color: var(--day-footer-hover-color);

}  

/* 黑夜模式页脚 a 标签悬停样式 */

body[data-color-scheme="night"] .footer-inner a:hover {

    color: var(--night-footer-hover-color);

}
```

~~最后`_config.fluid.yml`中的`custom_css`中引入~~
为什么不引入，因为我发现我真的癫，都采用注入了，还引入个毛文件
而且一旦主题更新，引入文件会被覆盖，
在根目录新建`scripts`文件夹,新建`injector.js`
```js
const fs = require('fs'); const path = require('path'); hexo.extend.injector.register('head_end', () => { return `<link rel="stylesheet" href="/css/footer.css">`; });
```

# 定义js监听事件实现字体颜色切换
在根目录新建`scripts`文件夹,新建`injector.js`
```js
const fs = require('fs'); const path = require('path'); hexo.extend.injector.register('head_end', () => { return `<link rel="stylesheet" href="/css/footer.css">`; }); hexo.extend.injector.register('body_end', () => { return `<script src="/js/footer.js"></script>`; });
```



在`source/js`目录新建`footer.js`
该js文件主要是用于监听主题切换的按钮是否被点击
footer.js:
```js
document.addEventListener('DOMContentLoaded', function () {

  const body = document.body;

  const colorToggleBtn = document.getElementById('color-toggle-btn');

  const icon = document.getElementById('color-toggle-icon'); 

  // 从本地存储读取主题模式

  const storedScheme = localStorage.getItem('colorScheme');

  if (storedScheme) {

      body.setAttribute('data-color-scheme', storedScheme);

      if (storedScheme === 'night') {

          icon.classList.remove('icon-dark');

          icon.classList.add('icon-light');

      } else {

          icon.classList.remove('icon-light');

          icon.classList.add('icon-dark');

      }

  } else {

      // 默认设置为白天模式

      body.setAttribute('data-color-scheme', 'day');

      icon.classList.remove('icon-light');

      icon.classList.add('icon-dark');

  }

  colorToggleBtn.addEventListener('click', function () {

      const currentScheme = body.getAttribute('data-color-scheme');

      const newScheme = currentScheme === 'day'? 'night' : 'day';

      body.setAttribute('data-color-scheme', newScheme);


      // 保存新的主题模式到本地存储

      localStorage.setItem('colorScheme', newScheme);


      if (newScheme === 'night') {

          icon.classList.remove('icon-dark');

          icon.classList.add('icon-light');

      } else {

          icon.classList.remove('icon-light');

          icon.classList.add('icon-dark');

      }

  });

});
```
# 小节
css基本无大变化，js的主要功能如下：
1. **读取本地存储**：在页面加载时，从 `localStorage` 中读取 `colorScheme` 的值。如果存在，则将其设置为 `body` 的 `data-color-scheme` 属性，并更新图标类名。
2. **默认设置**：如果本地存储中没有 `colorScheme` 的值，则默认设置为白天模式。
3. **切换主题模式**：当点击切换按钮时，切换 `data-color-scheme` 属性的值，并将新的模式保存到 `localStorage` 中，同时更新图标类名。
这样，无论刷新页面还是打开新页面，都会从本地存储中读取当前的主题模式并应用相应的样式，避免了字体颜色恢复的问题。
