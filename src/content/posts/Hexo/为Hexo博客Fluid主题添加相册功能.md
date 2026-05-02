---
title: 为 Hexo 博客 Fluid 主题添加相册功能
published: 2025-05-20
tags:
  - Hexo
category: Hexo
image: https://v6.gh-proxy.org/https://github.com/Skarie/hexoimg/blob/main/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91%E4%BC%91%E9%97%B2%E7%BE%8E%E5%A5%B3-%E5%9C%A3%E8%AF%9E%E6%A0%91.png
---

# 为 Hexo 博客 Fluid 主题添加相册功能
## 一、前期准备
- **工具与思路**  
  - 需理清文件路径关系（同级/上下级路径），避免路径错误。  
  - 借助工具辅助：代码问题可咨询 **ChatGPT**，或通过 **Bing** 搜索解决方案。

## 二、创建导航菜单
### 1. 配置文件路径
- 进入主题文件夹 `hexo-theme-fluid`，编辑配置文件 `_config.yml`。
- 也可以编辑配置文件`_config.fluid.yml`（推荐）
### 2. 添加菜单条目
在 `menu` 字段下新增相册菜单，示例代码：
```yaml
 menu:

    - { key: "home", link: "/", icon: "iconfont icon-home-fill" }

    - { key: "archive", link: "/archives/", icon: "iconfont icon-archive-fill" }

    - { key: "category", link: "/categories/", icon: "iconfont icon-category-fill" }

    - { key: "tag", link: "/tags/", icon: "iconfont icon-tags-fill" }

    - { key: "相册", link: "/photo/", icon: "iconfont icon-images" }

    - { key: "about", link: "/about/", icon: "iconfont icon-user-fill" }

    - { key: "links", link: "/links/", icon: "iconfont icon-link-fill" }
```

### 3. 菜单参数说明
- `key`：菜单显示名称（中文需注意多语言配置，可在 `themes/hexo-theme-fluid/languages/zh-CN.yml` 中添加 `photo` 对应翻译）。  
- `link`：菜单链接路径（如 `/photo/` 或 `/photos/`，需与后续页面路径一致）。  
- `icon`：菜单图标（引用字体图标类名）。

### 4. 多语言配置（可选）
在 `themes/hexo-theme-fluid/languages/zh-CN.yml` 中添加：
```yaml
photo:  
  menu: '相册'  
  title: '相册'  
  subtitle: '相册'
```

## 三、创建相册页面
### 1. 目录结构
在博客根目录 `source` 下新建 `photo` 文件夹（若路径为 `photos`，后续配置需同步修改）。

### 2. 新建页面文件
在 `photo` 文件夹中创建 `index.md`，内容模板：
```markdown
---

title: 图库

subtitle: 欢迎来到照片墙

layout: photo

published: 2024-04-1 12:44:07

---

## 欢迎来到我的图库。
---
  
<style>

.ImageGrid {

  width: 100%;

  max-width: 1040px;

  margin: 0 auto;

  text-align: center;

}

.card {

  overflow: hidden;

  transition: .3s ease-in-out;

  border-radius: 8px;

  background-color: rgba(180,180,180,0.2);

  padding: 1.4px;

}

.ImageInCard img {

  padding: 0;

  border-radius: 8px;

  width:100%;

  height:100%;

}

@media (prefers-color-scheme: dark) {

  .card {background-color: rgba(180,180,180,0.2);}

}

</style>

<div id="imageTab"></div>

<div class="ImageGrid"></div>  

--- 

##### 相册页鸣谢：

  

[小晓de雨滴 - 为hexo博客Fluid主题添加相册功能](https://fxy5750.github.io/2024/04/05/30-hexo%E7%9B%B8%E5%86%8C%E5%8A%9F%E8%83%BD/#%E5%BC%95%E7%94%A8)

[四维树的博客 - Fluid主题添加相册功能](https://4dtree.github.io/2022/06/21/Hexo-Fluid%E4%B8%BB%E9%A2%98%E6%B7%BB%E5%8A%A0%E7%9B%B8%E5%86%8C%E5%8A%9F%E8%83%BD/)

[何十七 - hexo的fluid主题添加相册功能及自定义页面 ](https://hzx17.github.io/2022/07/14/hexo%E9%85%8D%E7%BD%AE/hexo%E7%9B%B8%E5%86%8C%E5%AE%9E%E7%8E%B0/)

[GISHAI - hexo的fluid主题添加瀑布流懒加载相册功能](https://gishai.top/blog/posts/798ba833.html)

[魏超 - 为 Hexo + Fluid 博客添加承载相册的页面](https://weichao.io/09dacc5ba02c/)
```

### 3. 关键配置说明
- `layout: photo`：指定页面布局为相册（若路径为 `photos`，需后续在 `injector.js` 中修改对应名称）。  
- `<style>` 标签：定义相册图片展示样式。

## 四、图片设置与存储
### 1. 图片存储路径
在 `photo` 文件夹中新建 `images` 文件夹，用于存放需展示的图片新建文件夹名称为你图片分类名称，你可以在`photo`文件夹下建立多个子文件夹分类图片。

### 2. 图床选择（当前方案）
- 采用 **本地存储**，图片托管于 GitHub 或 Gitee。  
-  GitHub可以考虑采用jsDelivr加速[如何使用jsDelivr+Github 实现免费CDN加速? - 知乎](https://zhuanlan.zhihu.com/p/346643522)。

## 五、创建图片处理脚本（phototool.js）
### 1. 脚本功能
生成图片尺寸、名称、路径等信息，需依赖 `image-size` 库。

### 2. 脚本代码
```javascript
const fs = require('fs-extra');

const path = require('path');

const imageSize = require('image-size');

// 相册目录（直接使用当前脚本所在目录）
const photoDir = __dirname;
// 支持的图片格式
const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp'];


class Photo {

  constructor() {

    this.dirName = '';

    this.fileName = '';

    this.iconID = '';

  }

}

  

class PhotoGroup {

  constructor() {

    this.name = '';

    this.children = [];

  }

}

  

function createPlotIconsData() {

  const allPlots = [];

  const allPlotGroups = [];

  const plotJsonFile = path.join(__dirname, 'photosInfo.json');

  const plotGroupJsonFile = path.join(__dirname, 'photos.json');

  

  // 读取所有子目录（分类文件夹）

  fs.readdirSync(photoDir)

    .filter(item => {

      const itemPath = path.join(photoDir, item);

      return fs.statSync(itemPath).isDirectory() && item !== 'node_modules'; // 排除 node_modules

    })

    .forEach(dirName => {

      const dirPath = path.join(photoDir, dirName);

      const subfiles = fs.readdirSync(dirPath);

      const group = new PhotoGroup();

      group.name = dirName; // 文件夹名作为分类名

      allPlotGroups.push(group);

  

      subfiles.forEach(subfileName => {

        const imagePath = path.join(dirPath, subfileName);

        try {

          // 获取文件状态

          const stat = fs.statSync(imagePath);

          // 跳过空文件

          if (stat.size === 0) {

            console.log(`跳过空文件：${imagePath}`);

            return;

          }

          // 检查文件扩展名

          const ext = path.extname(subfileName).toLowerCase();

          if (!validExtensions.includes(ext)) {

            console.log(`跳过非图片文件：${imagePath}`);

            return;

          }

          // 处理图片

          const plot = new Photo();

          plot.dirName = dirName;

          plot.fileName = subfileName;

          // 获取图片尺寸

          const imgInfo = imageSize(imagePath);

          plot.iconID = `${imgInfo.width}.${imgInfo.height} ${subfileName}`;

          allPlots.push(plot);

          group.children.push(plot.iconID);

          console.log(`✅ 处理成功：${imagePath}`);

        } catch (error) {

          console.error(`❌ 处理失败：${imagePath}`, error.message);

        }

      });

    });

  

  // 保存结果

  fs.writeJSONSync(plotJsonFile, allPlots);

  fs.writeJSONSync(plotGroupJsonFile, allPlotGroups);

  console.log(`🎉 完成！共处理 ${allPlots.length} 张图片，生成 ${allPlotGroups.length} 个分类`);

}

  

createPlotIconsData();
```

### 3. 安装依赖
在终端运行：  
```bash
npm install image-size fs-extra path --save
```

### 4. 运行脚本
在 `photo` 目录下的终端执行脚本，生成 `photos.json` 和 `photosinfo.json` 文件（用于相册渲染）。
```bash
node source/photo/phototool.js
```

**注意事项**：  
- 所有路径需严格匹配，避免因大小写或拼写错误导致功能异常。  
- 若修改相册路径（如 `photo` → `photos`），需同步更新导航菜单、页面布局、脚本路径等多处配置。


## 六、编写相册 JS 文件（`photoWall.js`）  
在 `source/js/` 目录下创建该文件（无 `js` 文件夹则新建），代码用于渲染图片列表、实现分类切换和懒加载：  
```javascript  
var imgDataPath = "/photo/photos.json"; // 分类信息JSON

var imgPath = "/photo/"; // 分类文件夹的根路径
// var imgPath = "https://cdn.jsdelivr.net/gh/Cenergy/images/gallery/"; //网络图片访问路径实例
var imgMaxNum = 50; // 图片显示数量

  

var windowWidth =

  window.innerWidth ||

  document.documentElement.clientWidth ||

  document.body.clientWidth;

if (windowWidth < 768) {

  var imageWidth = 145; // 图片显示宽度(手机端)

} else {

  var imageWidth = 250; // 图片显示宽度

}

  

const photo = {

  page: 1,

  offset: imgMaxNum,

  init: function () {

    var that = this;

    $.getJSON(imgDataPath, function (data) {

      that.render(that.page, data);

      that.eventListen(data);

    });

  },

  constructHtml(options) {

    const {

      imageWidth,

      imageX,

      imageY,

      name, // 分类名

      imgName,

      imgPath,

      imgNameWithPattern,

    } = options;

    // 重点修改：拼接完整路径 "/photo/分类名/图片.jpg"

    const fullImgPath = `${imgPath}${name}/${imgNameWithPattern}`;

    const htmlEle = `<div class="card lozad" style="width:${imageWidth}px">

                  <div class="ImageInCard" style="height:${

                    (imageWidth * imageY) / imageX

                  }px">

                    <a data-fancybox="gallery" href="${fullImgPath}"

                          data-caption="${imgName}" title="${imgName}">

                            <img  class="lazyload" data-src="${fullImgPath}"

                            src="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw=="

                            onload="lzld(this)"

                            lazyload="auto">

                    </a>

                  </div>

                  <p>${imgName}</p>

                </div>`;

    return htmlEle;

  },

  render: function (page, data = []) {

    this.data = data;

    if (!data.length) return;

    var html,

      imgNameWithPattern,

      imgName,

      imageSize,

      imageX,

      imageY,

      li = "";

  

    let liHtml = "";

    let contentHtml = "";

  

    data.forEach((item, index) => {

      const activeClass = index === 0 ? "active" : "";

      liHtml += `<li class="nav-item" role="presentation">

          <a class="nav-link ${activeClass} photo-tab" id="home-tab" photo-uuid="${item.name}" data-toggle="tab" href="#${item.name}"  role="tab" aria-controls="${item.name}" aria-selected="true">${item.name}</a>

        </li>`;

    });

    const [initData = {}] = data;

    const { children = [], name } = initData; // 获取分类名

    children.forEach((item, index) => {

      imgNameWithPattern = item.slice(item.indexOf(" ")+1);

      imgName = imgNameWithPattern.split("/").pop();

      imageSize = item.split(" ")[0];

      imageX = imageSize.split(".")[0];

      imageY = imageSize.split(".")[1];

      let imgOptions = {

        imageWidth,

        imageX,

        imageY,

        name, // 传递分类名

        imgName,

        imgPath,

        imgNameWithPattern,

      };

      li += this.constructHtml(imgOptions);

    });

    contentHtml += ` <div class="tab-pane fade show active"  role="tabpanel" aria-labelledby="home-tab">${li}</div>`;

  

    const ulHtml = `<ul class="nav nav-tabs" id="myTab" role="tablist">${liHtml}</ul>`;

    const tabContent = `<div class="tab-content" id="myTabContent">${contentHtml}</div>`;

  

    $("#imageTab").append(ulHtml);

    $(".ImageGrid").append(tabContent);

    this.minigrid();

  },

  eventListen: function (data) {

    let self = this;

    var html,

      imgNameWithPattern,

      imgName,

      imageSize,

      imageX,

      imageY,

      li = "";

    $('a[data-toggle="tab"]').on("shown.bs.tab", function (e) {

      $(".ImageGrid").empty();

      const selectId = $(e.target).attr("photo-uuid");

      const selectedData = data.find((data) => data.name === selectId) || {};

      const { children, name } = selectedData; // 获取分类名

      let li = "";

      children.forEach((item, index) => {

        imgNameWithPattern = item.split(" ")[1];

        imgName = imgNameWithPattern.split("/").pop();

        imageSize = item.split(" ")[0];

        imageX = imageSize.split(".")[0];

        imageY = imageSize.split(".")[1];

        let imgOptions = {

          imageWidth,

          imageX,

          imageY,

          name, // 传递分类名

          imgName,

          imgPath,

          imgNameWithPattern,

        };

        li += self.constructHtml(imgOptions);

      });

      $(".ImageGrid").append(li);

      self.minigrid();

    });

  },

  minigrid: function () {

    var grid = new Minigrid({

      container: ".ImageGrid",

      item: ".card",

      gutter: 12,

    });

    grid.mount();

    $(window).resize(function () {

      grid.mount();

    });

  },

};

photo.init();
```


## 创建注入器文件（`injector.js`）  
在博客根目录新建 `scripts/injector.js`，用于加载相册所需的 CSS/JS 文件：  
```javascript  
//相册页面  
const { root: siteRoot = "/" } = hexo.config;  
// layout为photo的时候导入这些js与css  
hexo.extend.injector.register(  
"body_end",  
`  
  
<link rel="stylesheet" href="https://cdn.staticfile.org/fancybox/3.5.7/jquery.fancybox.min.css">  
<script src="https://cdn.jsdelivr.net/npm/minigrid@3.1.1/dist/minigrid.min.js"></script>  
<script src="https://cdn.staticfile.org/fancybox/3.5.7/jquery.fancybox.min.js"></script>  
<script src="https://cdn.bootcdn.net/ajax/libs/lazyloadjs/3.2.2/lazyload.js"></script>  
<script defer src="${siteRoot}js/photoWall.js"></script>  
`,  
"photo"  
);  
  
// CDN加载方案，目前上述文件使用CDN加载方案；  
// 本地加载方案，这个方案就是把上面CDN文件一个一个存到 js目录下，仅此而已，我用的这个方案，感觉更靠谱些，不用担心CDN访问时候出现 404  
// <link rel="stylesheet" href="/js/jquery.fancybox.min.css">  
// <script src="/js/minigrid.min.js"></script>  
// <script src="/js/jquery.fancybox.min.js"></script>  
// <script src="/js/lazyload.js"></script>  
// <script defer src="${siteRoot}js/photoWall.js"></script> 
```


## 后期维护与扩展  
1. **添加新图片**：  
   - 将图片复制到 `photo/images` 目录。  
   - 重新运行 `phototool.js` 生成最新元数据：  
     ```bash  
     node source/photo/phototool.js  
     ```  
2. **共用图片路径**：  
   修改 `photoWall.js` 中的 `imgPath` 为博客通用图片路径（如 `/img/images/`）。  
3. **多分类管理**：  
   在 `photos.json` 中按分类组织图片，示例结构：  
   ```json  
   [  
     {  
       "name": "壁纸",  
       "children": ["10000.4220 【哲风壁纸】WLOP-WLOP作品.png"]  
     },  
     {  
       "name": "images",  
       "children": ["800.600 旅行照.jpg", "1024.768 风景.png"]  
     }  
   ]  
   ```


### 目录结构参考  
```  
blog 
├─ _config.fluid.yml
├─ scripts/  
│  └─ injector.js          # 注入器配置  
├─ source/  
│  ├─ photo/  
│  │  ├─ index.md         # 相册页面  
│  │  ├─ images/           # 图片存储目录
|  |  ├─ 壁纸/             # 图片存储目录  
│  │  ├─ phototool.js     # 图片处理脚本  
│  │  └─ photos*.json     # 自动生成的元数据文件  
│  └─ js/  
│     └─ photoWall.js     # 相册逻辑代码  
└─ themes/  
   └─ hexo-theme-fluid/  
      ├─ _config.yml       # 主题配置文件  
      └─ languages/  
         └─ zh-CN.yml      # 多语言配置  
```


### 鸣谢  
  
- [小晓de雨滴 - 为hexo博客Fluid主题添加相册功能](https://fxy5750.github.io/2024/04/05/30-hexo%E7%9B%B8%E5%86%8C%E5%8A%9F%E8%83%BD/#%E5%BC%95%E7%94%A8)
- [四维树的博客 - Fluid主题添加相册功能](https://4dtree.github.io/2022/06/21/Hexo-Fluid%E4%B8%BB%E9%A2%98%E6%B7%BB%E5%8A%A0%E7%9B%B8%E5%86%8C%E5%8A%9F%E8%83%BD/)
- [何十七 - hexo的fluid主题添加相册功能及自定义页面 ](https://hzx17.github.io/2022/07/14/hexo%E9%85%8D%E7%BD%AE/hexo%E7%9B%B8%E5%86%8C%E5%AE%9E%E7%8E%B0/)
- [GISHAI - hexo的fluid主题添加瀑布流懒加载相册功能](https://gishai.top/blog/posts/798ba833.html)
- [魏超 - 为 Hexo + Fluid 博客添加承载相册的页面](https://weichao.io/09dacc5ba02c/)