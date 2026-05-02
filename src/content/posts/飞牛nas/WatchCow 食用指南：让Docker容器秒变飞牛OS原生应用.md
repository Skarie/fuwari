---
title: WatchCow 食用指南：让Docker容器秒变飞牛OS原生应用
published: 2026-01-10
tags:
  - 飞牛nas
  - WatchCow
category: 飞牛nas
image: https://v6.gh-proxy.org/https://github.com/Skarie/hexoimg/blob/main/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91%E5%8F%91%E4%B8%9D-%E6%89%8B%E7%BB%98%E5%B0%91%E5%A5%B3.png
---

# WatchCow 食用指南：让Docker容器秒变飞牛OS原生应用

如果你在飞牛OS（fnOS）上使用Docker，却遗憾于自定义容器无法像原生应用那样展示在系统界面、便捷管理——那 **WatchCow** 就是为你解决这个问题的工具！它是一款纯后台运行的增强工具，能自动监控Docker容器事件，把带有特定标签的容器“变身”为fnOS原生应用，直接纳入系统应用中心管理。

## 一、核心价值：为什么需要WatchCow？

- 打破壁垒：让海量开源Docker项目，无缝融入fnOS生态，享受原生应用体验
    
- 自由灵活：无需等官方打包，自己部署最新版镜像、自定义配置，打造专属Homelab
    
- 自动省心：全程自动化，无需手动操作，容器生命周期与应用状态自动同步
    
- 简单易用：通过Docker Labels配置，复制粘贴Compose文件即可快速上手，分享便捷
    

## 二、快速了解：WatchCow 工作原理

核心逻辑超简单，全程自动化流转：

```text
1. 启动带有 watchcow.enable=true 标签的Docker容器
2. WatchCow 实时检测到该容器事件
3. 自动提取容器配置，生成fnOS应用包
4. 通过 appcenter-cli 自动安装到fnOS应用中心
5. 容器出现在系统应用中心，可像原生应用一样管理
```

容器生命周期自动同步，无需手动干预：

|Docker事件|fnOS对应操作|
|---|---|
|容器启动（未安装过）|生成应用包 + 自动安装|
|容器启动（已安装）|自动启动应用|
|容器停止|自动停止应用|
|容器销毁|自动卸载应用|

## 三、前期准备：安装WatchCow

WatchCow已上架fnOS应用中心，安装步骤超简单：

1. 从 [WatchCow Releases](https://github.com/tf4fun/watchcow/releases) 下载 `watchcow.fpk` 安装包
    
2. 打开fnOS应用中心，使用「本地安装」功能上传安装包即可
    

注意：WatchCow是纯后台工具，安装后无前端界面，只要后台运行正常即可工作。

## 四、核心用法：给容器加标签就搞定

使用WatchCow的关键，就是在Docker Compose文件中给容器添加对应的Labels配置。按需求分为「最简配置」和「完整配置」，新手先从最简开始！

### 1. 最简配置：3步快速实现

只需要添加 `watchcow.enable: "true"` 这一个核心标签，其他信息WatchCow会自动猜测填充：

```yaml
services:
  nginx:
    image: nginx:alpine  # 任意你想部署的Docker镜像
    ports:
      - "8081:80"
    labels:
      watchcow.enable: "true"  # 核心标签：启用WatchCow识别
```

启动容器后，等待几秒，就能在fnOS应用中心看到这个Nginx应用了！

### 2. 完整配置：自定义应用信息

如果想自定义应用名称、描述、图标等，补充对应的Labels即可。以下是一个完整示例（以跳转B站为例）：

```yaml
configs:
  redirect:
    content: |
      #!/bin/sh
      echo "Status: 302 Found"
      echo "Location: https://www.bilibili.com/"
      echo ""

services:
  bilibili:
    image: busybox:uclibc
    container_name: bilibili-redirect
    ports:
      - "3000:3000"
    configs:
      - source: redirect
        target: /www/cgi-bin/index.cgi
        mode: 0755
    command: httpd -f -p 3000 -h /www
    restart: unless-stopped
    network_mode: bridge

    labels:
      # 1. 核心启用配置
      watchcow.enable: "true"

      # 2. 应用基础信息（自定义显示）
      watchcow.appname: "watchcow.bilibili"  # 应用唯一标识（默认：watchcow.容器名）
      watchcow.display_name: "哔哩哔哩"      # 应用显示名称（默认：容器名）
      watchcow.desc: "一键跳转到B站"         # 应用描述（默认：镜像名）
      watchcow.version: "1.0.0"              # 应用版本（默认：1.0.0）
      watchcow.maintainer: "WatchCow"        # 维护者（默认：WatchCow）

      # 3. 网络访问配置
      watchcow.service_port: "3000"          # Web UI端口（默认：首个暴露端口）
      watchcow.protocol: "http"              # 协议（默认：http，可选https）
      watchcow.path: "/cgi-bin/index.cgi"    # 访问路径（默认：/）

      # 4. UI与图标配置
      watchcow.ui_type: "url"                # 打开方式（url：新标签页；iframe：桌面窗口）
      watchcow.icon: "https://cdn.jsdelivr.net/gh/homarr-labs/dashboard-icons/png/bilibili.png"  # 图标URL
```

## 五、关键配置标签：按需求选择

以下是WatchCow支持的核心标签，按功能分类整理，按需添加即可：

### 1. 应用级配置（基础必选/可选）

|标签|是否必需|默认值|说明|
|---|---|---|---|
|watchcow.enable|是|-|设为"true"即启用WatchCow识别|
|watchcow.appname|否|watchcow.<容器名>|应用唯一标识，避免重复|
|watchcow.display_name|否|容器名|应用在系统中显示的名称|
|watchcow.desc|否|镜像名|应用功能描述|
|watchcow.version|否|1.0.0|应用版本号|

### 2. 入口配置（默认单个入口）

|标签|是否必需|默认值|说明|
|---|---|---|---|
|watchcow.service_port|否|首个暴露端口|应用Web UI的访问端口|
|watchcow.protocol|否|http|访问协议，可选http/https|
|watchcow.path|否|/|访问的URL路径（如示例中的/cgi-bin/index.cgi）|
|watchcow.ui_type|否|url|打开方式：url（新标签页）、iframe（桌面窗口）|
|watchcow.icon|否|自动猜测|图标来源：HTTP/HTTPS URL 或 file://本地路径|
|watchcow.all_users|否|true|访问权限：true（所有用户）、false（仅管理员）|

### 3. 高级功能：多入口配置

如果一个容器需要多个访问入口（如主应用+管理后台），可以用`watchcow.<入口名>.<字段>` 的格式定义多个入口。示例如下：

```yaml
services:
  myapp:
    image: myapp:latest
    ports:
      - "8080:8080"  # 主应用端口
      - "8081:8081"  # 管理后台端口
    labels:
      watchcow.enable: "true"
      watchcow.display_name: "我的应用"

      # 主入口（命名为main）
      watchcow.main.service_port: "8080"
      watchcow.main.path: "/"
      watchcow.main.title: "我的应用"

      # 管理后台入口（命名为admin）
      watchcow.admin.service_port: "8081"
      watchcow.admin.path: "/admin"
      watchcow.admin.title: "管理后台"
      watchcow.admin.all_users: "false"  # 仅管理员可访问
      watchcow.admin.ui_type: "iframe"
```

### 4. 实用技巧：文件右键菜单入口

可以配置让应用出现在文件右键菜单中（如“用文本编辑器打开txt文件”），只需添加 `file_types` 和 `no_display` 标签：

```yaml
labels:
  watchcow.enable: "true"
  watchcow.display_name: "文本编辑器"

  # 编辑器入口（仅出现在右键菜单）
  watchcow.editor.service_port: "8080"
  watchcow.editor.path: "/edit"
  watchcow.editor.title: "用文本编辑器打开"
  watchcow.editor.file_types: "txt,md,json,xml"  # 支持的文件类型（逗号分隔）
  watchcow.editor.no_display: "true"  # 不在桌面显示，仅在右键菜单出现
```

## 六、图标配置：让应用更美观

支持两种图标来源，按需选择：

```yaml
# 1. HTTP/HTTPS URL（推荐，无需本地文件）
watchcow.icon: "https://example.com/icon.png"

# 2. 本地文件（绝对路径或相对路径）
watchcow.icon: "file:///path/to/icon.png"  # 绝对路径
watchcow.icon: "file://./icons/icon.png"   # 相对路径（相对于Compose文件所在目录）
```

支持的图标格式：PNG、JPEG/JPG、WebP、BMP、ICO（会自动转换为PNG并选择最高分辨率），无需担心格式问题。

## 七、升级注意：从v0.1到v0.2

如果之前使用过v0.1版本，升级到v0.2后需要更新Labels配置，标签名称有变更：

|旧标签（v0.1）|新标签（v0.2）|
|---|---|
|watchcow.title|watchcow.display_name|
|watchcow.description|watchcow.desc|
|watchcow.port|watchcow.service_port|
|watchcow.appName|watchcow.appname|

## 八、项目信息

项目地址：[https://github.com/tf4fun/watchcow](https://github.com/tf4fun/watchcow)

核心优势：自由部署、自动管理、无缝融入fnOS，让Docker容器的使用体验更上一层楼！  