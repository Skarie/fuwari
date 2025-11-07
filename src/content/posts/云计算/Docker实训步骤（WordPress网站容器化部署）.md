---
title: Docker实训步骤（WordPress网站容器化部署）
published: 2025-06-03
tags:
  - 云计算
  - docker
category: 云计算
image: https://cdn.mengze.vip/gh/Skarie/hexoimg/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91%E5%9C%B0%E9%93%81%E5%9C%BA%E6%99%AF-%E6%88%B4%E7%9C%BC%E9%95%9C.png
---

# Docker实训步骤（WordPress网站容器化部署）
## 一、环境准备
- **硬件要求**：2核CPU、2GB内存、20GB磁盘空间的虚拟机
- **系统要求**：Ubuntu 22.04+（推荐WSL环境）或CentOS 7+

## 二、安装Docker及Docker Compose
### （一）安装Docker（以Ubuntu为例）
1. **更新系统包**  
```bash
sudo apt update && sudo apt upgrade -y 
```

1. **安装依赖工具**  
```bash
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
```

2. **添加Docker官方GPG密钥**  
```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
```

2. **配置国内软件源（加速下载）**  
```bash
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://mirrors.ustc.edu.cn/docker-ce/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```  
5. **安装Docker CE**  
```bash
sudo apt update && sudo apt install docker-ce docker-ce-cli containerd.io -y
```

6. **验证安装**  
```bash
sudo docker version  # 查看版本
sudo docker run hello-world  # 运行测试容器，出现"Hello from Docker!"即成功
```  
7. **（可选）配置非root用户访问**  
```bash
sudo usermod -aG docker $USER  # 将当前用户加入docker组
newgrp docker  # 刷新用户组权限
```  

### （二）安装Docker Compose
1. **下载最新版本（国内源加速）**  
```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.3/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
```  
2. **赋予执行权限**  
```bash
sudo chmod +x /usr/local/bin/docker-compose
```

3. **验证安装**  
```bash
docker-compose --version  # 应显示v2.20.3
```


## 三、配置Docker国内镜像源
1. **创建并编辑配置文件**  
```bash
sudo mkdir -p /etc/docker
sudo nano /etc/docker/daemon.json
```  
2. **添加镜像源地址**  
```json
{
  "registry-mirrors": ["https://registry.docker-cn.com"]
}
```  
3. **重启Docker服务**  
```bash
sudo systemctl daemon-reload
sudo systemctl restart docker
```  

## 四、项目部署步骤
### （一）创建项目目录
```bash
mkdir wordpress-nginx-mysql
cd wordpress-nginx-mysql
```  

### （二）编写Dockerfile（构建Nginx镜像）
```bash
nano Dockerfile
```  
**内容**：  
```dockerfile
FROM nginx:latest
COPY nginx.conf /etc/nginx/conf.d/default.conf
```  

### （三）编写docker-compose.yml文件
```bash
nano docker-compose.yml
```  
**内容**：  
```yaml
version: '3.8'
services:
  # Nginx服务：反向代理与静态文件服务器
  nginx:
    build: .  # 基于当前目录的Dockerfile构建镜像
    ports:
      - "80:80"  # 宿主机80端口映射到容器80端口
    volumes:
      - ./nginx.conf:/etc/nginx/conf.d/default.conf  # 挂载配置文件
      - ./wordpress:/var/www/html  # 挂载WordPress内容目录
    depends_on:
      - wordpress  # 确保WordPress服务先启动

  # WordPress服务：内容管理系统
  wordpress:
    image: wordpress:latest  # 使用官方镜像
    environment:
      - WORDPRESS_DB_HOST=mysql:3306  # 数据库主机（服务名+端口）
      - WORDPRESS_DB_USER=wp_user  # 数据库用户名
      - WORDPRESS_DB_PASSWORD=wp_password  # 数据库密码
      - WORDPRESS_DB_NAME=wp_db  # 数据库名
    volumes:
      - ./wordpress:/var/www/html  # 持久化存储站点内容
    depends_on:
      - mysql  # 确保MySQL服务先启动

  # MySQL服务：数据库
  mysql:
    image: mysql:5.7  # 使用MySQL 5.7镜像
    environment:
      - MYSQL_ROOT_PASSWORD=root_password  # root用户密码
      - MYSQL_USER=wp_user  # 普通用户（供WordPress使用）
      - MYSQL_PASSWORD=wp_password  # 普通用户密码
      - MYSQL_DATABASE=wp_db  # 数据库名
    volumes:
      - ./mysql_data:/var/lib/mysql  # 持久化存储数据库文件
```  

### （四）编写Nginx配置文件
```bash
nano nginx.conf
```  
**内容**：  
```nginx
server {
    listen 80;  # 监听80端口
    server_name localhost;  # 服务器域名（本地访问）

    location / {
        proxy_pass http://wordpress:80;  # 反向代理到WordPress容器的80端口
        proxy_set_header Host $host;  # 传递请求头中的Host信息
        proxy_set_header X-Real-IP $remote_addr;  # 传递真实客户端IP
    }

    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ {
        root /var/www/html;  # 静态文件根目录（对应WordPress内容目录）
        expires 30d;  # 静态文件缓存30天
    }
}
```  

## 五、启动容器并验证
### （一）启动所有服务
```bash
docker-compose up -d  # 后台运行容器
```
  

### （二）验证容器状态
```bash
docker-compose ps  # 查看容器运行状态
# 预期结果：三个容器均显示"Up"，且端口映射正常
```  

### （三）访问WordPress安装页面
1. **在浏览器输入**：`http://虚拟机IP`  
2. **配置数据库连接**：  
   - 数据库主机：`mysql`（与docker-compose中的服务名一致）  
   - 用户名：`wp_user`  
   - 密码：`wp_password`  
   - 数据库名：`wp_db`  
3. **按提示完成安装**，验证网站功能与数据库集成是否正常。  

## 六、常见问题处理
- **端口冲突**：检查宿主机端口是否被占用，修改`docker-compose.yml`中的端口映射（如`8080:80`）。  
- **镜像拉取失败**：确认国内镜像源配置正确，尝试手动拉取镜像（`docker pull nginx:latest`）。  
- **权限问题**：确保挂载目录权限正确（如`chmod -R 755 ./wordpress`），或使用`--chown`参数指定用户组。