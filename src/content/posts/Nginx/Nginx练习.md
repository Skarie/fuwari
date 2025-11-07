---
title: Nginx练习
published: 2025-05-27
tags:
  - Nginx
  - 云计算
category: Nginx
image: https://cdn.mengze.vip/gh/Skarie/hexoimg/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91TinyGlade-%E6%9C%A8%E5%B1%8B.png
---


下面是Nginx在Linux系统中的安装、配置与测试的详细指南：

### 一、安装与启动Nginx
1. **安装Nginx**
```bash
# 以Debian/Ubuntu为例
sudo apt update
sudo apt install nginx

# 以CentOS/RHEL为例
sudo yum install epel-release
sudo yum install nginx
```

2. **启动与验证**
```bash
# 启动Nginx
sudo systemctl start nginx

# 设置开机自启
sudo systemctl enable nginx

# 验证运行状态
sudo systemctl status nginx

# 检查端口占用（默认80）
sudo netstat -tulpn | grep :80
```

3. **修改默认首页**
```bash
# 备份原文件
sudo cp /var/www/html/index.nginx-debian.html /var/www/html/index.nginx-debian.html.bak

# 使用echo命令直接修改首页内容
sudo echo "Welcome to My Nginx Server!" | sudo tee /var/www/html/index.nginx-debian.html

# 或者使用文本编辑器手动修改
sudo nano /var/www/html/index.nginx-debian.html
```

4. **测试访问**
在浏览器中输入服务器公网IP或`localhost`，应看到"Welcome to My Nginx Server!"。


### 二、配置静态网站
1. **创建网站目录与文件**
```bash
# 创建目录并设置权限
sudo mkdir -p /var/www/example.com
sudo chown -R www-data:www-data /var/www/example.com
sudo chmod -R 755 /var/www/example.com

# 创建示例文件
echo "<h1>Example.com Home Page</h1>" | sudo tee /var/www/example.com/index.html
echo "<h1>Example Subpage</h1>" | sudo tee /var/www/example.com/subpage.html
```

2. **配置虚拟主机**
```bash
# 创建配置文件
sudo nano /etc/nginx/sites-available/example.com
```
添加以下内容：
```nginx
server {
    listen 80;
    server_name example.com www.example.com;
    root /var/www/example.com;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

3. **启用配置并重启Nginx**
```bash
# 创建软链接到sites-enabled
sudo ln -s /etc/nginx/sites-available/example.com /etc/nginx/sites-enabled/

# 检查配置语法
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

4. **测试访问**
在浏览器中输入`http://example.com`（需先将域名解析到服务器IP）。


### 三、配置多个虚拟主机
1. **创建网站目录与文件**
```bash
# 创建site1目录与文件
sudo mkdir -p /var/www/site1.local
echo "<h1>Site 1 Home Page</h1>" | sudo tee /var/www/site1.local/index.html

# 创建site2目录与文件
sudo mkdir -p /var/www/site2.local
echo "<h1>Site 2 Home Page</h1>" | sudo tee /var/www/site2.local/index.html

# 设置权限
sudo chown -R www-data:www-data /var/www/{site1.local,site2.local}
sudo chmod -R 755 /var/www/{site1.local,site2.local}
```

2. **配置虚拟主机**
```bash
# 创建site1配置文件
sudo nano /etc/nginx/sites-available/site1.local
```
添加以下内容：
```nginx
server {
    listen 80;
    server_name site1.local www.site1.local;
    root /var/www/site1.local;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

```bash
# 创建site2配置文件
sudo nano /etc/nginx/sites-available/site2.local
```
添加以下内容：
```nginx
server {
    listen 80;
    server_name site2.local www.site2.local;
    root /var/www/site2.local;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

3. **启用配置并重启Nginx**
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/site1.local /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/site2.local /etc/nginx/sites-enabled/

# 移除默认配置（可选）
sudo rm /etc/nginx/sites-enabled/default

# 检查配置语法并重启
sudo nginx -t
sudo systemctl restart nginx
```

4. **本地测试（修改hosts文件）**
在本地计算机（非服务器）上编辑`/etc/hosts`文件：
```bash
# Windows: C:\Windows\System32\drivers\etc\hosts
# Linux/macOS: /etc/hosts

# 添加以下内容（假设服务器IP为192.168.1.100）
192.168.1.100 site1.local www.site1.local
192.168.1.100 site2.local www.site2.local
```

5. **测试访问**
```bash
# 使用curl测试（在服务器上或本地）
curl http://site1.local
curl http://site2.local

# 或者在浏览器中访问
http://site1.local
http://site2.local
```


### 常见问题排查
1. **端口冲突**
```bash
# 检查80端口占用情况
sudo netstat -tulpn | grep :80

# 若被占用，停止冲突服务或修改Nginx监听端口
```

2. **权限问题**
```bash
# 确保Nginx用户有访问网站目录的权限
sudo chown -R www-data:www-data /var/www/
sudo chmod -R 755 /var/www/
```

3. **配置语法错误**
```bash
# 检查配置文件语法
sudo nginx -t

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/error.log
```

4. **SELinux/AppArmor限制**
```bash
# 临时关闭SELinux（不推荐生产环境）
sudo setenforce 0

# 配置AppArmor允许Nginx访问目录
sudo nano /etc/apparmor.d/usr.sbin.nginx
# 添加：/var/www/** r,
```

配置完成后，你可以通过不同域名访问各自的网站内容，实现了Nginx的多站点配置。