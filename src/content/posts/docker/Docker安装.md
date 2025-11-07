---
title: Docker安装
published: 2025-05-05
tags: [docker]
category: docker
image: /articel/Docker安装.png
category_bar: "true"
---
在国内的 Ubuntu 系统上安装 Docker，可按以下步骤操作：

### 1. 更新系统包列表

首先更新系统的包列表，以确保使用的是最新的可用软件包信息。在终端中执行以下命令：

```
sudo apt update
```

### 2. 安装必要的依赖包

安装允许 apt 通过 HTTPS 使用仓库所需的包：

```
sudo apt install apt-transport-https ca-certificates curl software-properties-common
```

### 3. 添加 Docker 的官方 GPG 密钥

使用 curl 下载并添加 Docker 官方 GPG 密钥，以确保下载的软件包的完整性：

```
curl -fsSL https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

### 4. 添加 Docker 软件源

将 Docker 的软件源添加到系统中，这里使用中科大的镜像源以提高下载速度：

```
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

### 5. 更新包列表

再次更新包列表，使新添加的软件源生效：

```
sudo apt update
```

### 6. 安装 Docker 引擎

安装 Docker 引擎、容器运行时和 Docker Compose：

```
sudo apt install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### 7. 启动并设置 Docker 开机自启

安装完成后，启动 Docker 服务，并设置其在系统启动时自动启动：

```
sudo systemctl start docker
sudo systemctl enable docker
```

### 8. 验证 Docker 安装（通常情况先执行9在来看8）

通过运行 hello-world 镜像来验证 Docker 是否正确安装：
```
sudo docker pull hello-world
```

```
sudo docker run hello-world
```

### 9. 配置 Docker 镜像加速（可选）

为了进一步提高国内的下载速度，你可以配置 Docker 镜像加速器。编辑 /etc/docker/daemon.json 文件（如果文件不存在则创建）
```bash
sudo vi /etc/docker/daemon.json
```

添加如下内容：

```
{ "registry-mirrors": ["https://dxcighmx.mirror.aliyuncs.com"] }
```

然后输入完成，按`Esc`键输入`:wq`回车就能保存成功
保存文件后，重启 Docker 服务：

```
sudo systemctl restart docker
```

通过以上步骤，你就能在国内的 Ubuntu 系统上成功安装并配置 Docker。