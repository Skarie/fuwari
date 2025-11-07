---
title: 关于gitee文件真实路径
published: 2025-05-26
tags:
  - gitee
category: gitee
image: https://cdn.mengze.vip/gh/Skarie/photo/images/【哲风壁纸】个性写真-时尚少女.png
category_bar: "true"
---

### 序言
关于这个问题是在搭建hexo图床时候发现的
当时需要用到gitee仓库所在图片路径
但是怎么搞都没有成功

- 最开始我是打算`https://gitee.com/Skarie/photo`+分类文件夹`images`
  发现错了
- 然后在浏览器查看到其真实路径是[https://gitee.com/Skarie/photo/tree/main/images](https://gitee.com/Skarie/photo/tree/main/images)
  也是挺无语的
- 选择文件后路径有变[https://gitee.com/Skarie/photo/blob/main/images/【哲风壁纸】个性写真-时尚少女.png](https://gitee.com/Skarie/photo/blob/main/images/【哲风壁纸】个性写真-时尚少女.png)
  
但是你会发现，这是在gitee界面显示的文件，但是如果你要调用一些js，什么的就很麻烦


### 修改链接

eg：
[https://gitee.com/Skarie/photo/blob/main/images/【哲风壁纸】个性写真-时尚少女.png](https://gitee.com/Skarie/photo/blob/main/images/【哲风壁纸】个性写真-时尚少女.png)
![[关于gitee文件不能直链显示/1.png]]

我们将其中的blob修改为raw
[https://gitee.com/Skarie/photo/raw/main/images/【哲风壁纸】个性写真-时尚少女.png](https://gitee.com/Skarie/photo/raw/main/images/【哲风壁纸】个性写真-时尚少女.png)
修改效果如图：
![[关于gitee文件不能直链显示/2.png]]


----
***PS:其实干了这莫多，我的图床问题还没有解决，倒是学到了一个新知识***