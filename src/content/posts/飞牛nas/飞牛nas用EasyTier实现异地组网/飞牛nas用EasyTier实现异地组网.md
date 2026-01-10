---
title: 飞牛nas用EasyTier实现异地组网
published: 2025-08-26
tags:
  - 飞牛nas
category: 飞牛nas
image: https://cdn.mengze.vip/gh/Skarie/hexoimg/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91%E6%87%92%E7%BE%8A%E7%BE%8A-%E7%9D%A1%E8%A7%89.png
---

# 飞牛NAS通过EasyTier实现异地组网

## 前言
许多用户家中虽配备NAS设备，但因没有公网IP，无法直接实现外网访问NAS内的文件或项目。本文将详细介绍如何通过EasyTier工具，利用异地组网功能解决这一问题。


## 操作步骤

### 1. 注册EasyTier账号
1. 访问[EasyTier官网](https://easytier.cn/)，点击进入"web控制台"  
   ![注册入口](./1.png)
2. 完成账号注册并登录（请牢记用户名和密码）  
   ![注册页面](./2.png)


### 2. 配置飞牛NAS的Docker环境
1. 登录飞牛NAS系统，打开Docker管理界面
2. 依次点击「Compose」→「新增项目」，输入项目名称和路径后，点击「创建docker-compose.yml」
3. 填入以下配置内容（注意替换用户名）：

```docker-compose.yml
services:
  # 用于自动更新easytier镜像，若不需要可删除此部分
  watchtower:
    command: --interval 3600 --cleanup --label-enable
    container_name: watchtower
    environment:
      - TZ=Asia/Shanghai
      - WATCHTOWER_NO_STARTUP_MESSAGE
    image: containrrr/watchtower
    restart: always
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      
  # EasyTier主服务配置
  easytier:
    restart: always
    labels:
      com.centurylinklabs.watchtower.enable: 'true'
    privileged: true
    mem_limit: 0m
    container_name: easytier
    hostname: easytier
    network_mode: host
    volumes:
      - ./config:/root
    environment:
      - TZ=Asia/Shanghai
    # 国内用户建议使用镜像：m.daocloud.io/docker.io/easytier/easytier:latest
    image: easytier/easytier:latest
    command: -w 你的EasyTier用户名  # 替换为实际注册的用户名
```

4. 点击确认后，选择「构建项目」  
   ![Docker配置](./3.png)  
   ![构建项目](./4.png)


### 3. 创建EasyTier网络
1. 返回EasyTier的web控制台，进入「设备列表」→「设置」→「创建新网络」  
   ![创建网络入口](./5.png)
2. 网络类型默认选择「动态ipv4」，填写网络名称和密码
3. 服务器选择：
   - 可直接使用默认公共服务器
   - 也可从[EasyTier公共服务器列表](https://easytier.gd.nkbpal.cn/status/easytier)选择支持中转的服务器  
     ![服务器选择](./6.png) ![服务器列表](./7.png)
4. 点击「高级设置」，找到「子网代理CIDR」
5. 输入需要访问的网段（例如NAS内网IP为`192.168.1.6:5666`，则填写`192.168.1.0/24`）  
   ![子网配置](./8.png)
6. 点击「运行网络」完成配置


### 4. 配置客户端（手机/Windows）
1. 下载对应客户端：
   - [EasyTier官方下载页](https://easytier.cn/guide/download.html)
   - [Windows客户端直接下载](https://release-assets.githubusercontent.com/github-production-release-asset/698328708/4eea8f32-ed94-4763-8a66-9cabcb8f213e?sp=r&sv=2018-11-09&sr=b&spr=https&se=2025-08-14T15%3A18%3A39Z&rscd=attachment%3B+filename%3Deasytier-gui_2.4.2_x64-setup.exe&rsct=application%2Foctet-stream&skoid=96c2d410-5711-43a1-aedd-ab1947aa7ab0&sktid=398a6654-997b-47e9-b12b-9515b896b4de&skt=2025-08-14T14%3A18%3A09Z&ske=2025-08-14T15%3A18%3A39Z&sks=b&skv=2018-11-09&sig=SXbx%2FKcn%2F526tyfqqKWgT%2Be5TEMQBAUs5K7aza4PxTQ%3D&jwt=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJnaXRodWIuY29tIiwiYXVkIjoicmVsZWFzZS1hc3NldHMuZ2l0aHVidXNlcmNvbnRlbnQuY29tIiwia2V5Ijoia2V5MSIsImV4cCI6MTc1NTE4MjcyOSwibmJmIjoxNzU1MTgyNDI5LCJwYXRoIjoicmVsZWFzZWFzc2V0cHJvZHVjdGlvbi5ibG9iLmNvcmUud2luZG93cy5uZXQifQ.jBlujD4dcRzGEPIiBUDgfix2TuBEw_Y6Ot-m2FUIpZE&response-content-disposition=attachment%3B%20filename%3Deasytier-gui_2.4.2_x64-setup.exe&response-content-type=application%2Foctet-stream)
   - [Android客户端直接下载](https://ghfast.top/https://github.com/EasyTier/EasyTier/releases/download/v2.4.2/app-universal-release.apk)
2. 安装后使用注册的EasyTier账号登录
3.   客户端和web端配置一样
4. 客户端无需配置高级功能（子网代理保持默认即可）


### 5. 验证连接
当web控制台显示手机端、Windows端与NAS设备均处于「P2P」连接状态时，说明组网成功。此时可直接通过内网IP+端口号访问飞牛NAS（例如：`http://192.168.1.6:5666`）。  
![连接状态验证](./9.png)


## 注意事项
- 国内用户建议使用DaoCloud镜像加速EasyTier下载
- 子网代理CIDR需根据实际NAS内网网段填写，确保包含目标设备IP
- 若连接失败，可尝试更换公共服务器后重新配置