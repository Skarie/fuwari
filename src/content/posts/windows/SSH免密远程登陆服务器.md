---
title: SSH免密远程登陆服务器
published: 2025-05-13
tags:
  - windows
image: https://s.panlai.com/upload/bizhihui_com_20231113002208169980612818169.jpg-arthumbs
category: windows
category_bar: "true"
---


# Windows → Linux 免密登录配置指南

  

以下是在 Windows 系统上生成 SSH 密钥对并配置免密登录 Linux 服务器的详细步骤：

## 一、生成 SSH 密钥对（Windows）
 
### 1. 打开 PowerShell 或 Git Bash


建议使用**Git Bash**（需提前安装），它提供更完整的 Unix 命令支持。 

### 2. 执行密钥生成命令

```
ssh-keygen -t rsa -b 4096 -C "your_email@example.com"
```

#### 参数说明
  
`-t rsa`：指定密钥类型为 RSA。

`-b 4096`：密钥长度为 4096 位（安全性更高）。

`-C "``your_email@example.com``"`：注释信息（可自定义）。

### 3. 按提示操作

**密钥保存路径**：默认路径为`C:\Users\你的用户名\.ssh\id_rsa`，直接回车使用默认。
  
**密码短语**：可为密钥设置额外密码（可选，回车跳过） 。
### 4. 验证生成结果

```
ls ~/.ssh
```

应看到两个文件：
`id_rsa`：私钥（**绝对不可泄露**）。

`id_rsa.pub`：公钥（可公开）。

## 二、将公钥上传至服务器

### 方法一：使用 ssh-copy-id 命令（推荐）

```
ssh-copy-id root@server.example.com
```

按提示输入服务器密码。

命令会自动将公钥添加到服务器的`~/.ssh/authorized_keys`。
  
### 方法二：手动复制公钥（适用于无 ssh-copy-id 的环境）
  
#### 1. 查看公钥内容

由于 Windows 系统默认没有`cat`命令，可采用以下替代方法：

**使用 PowerShell 命令查看**

```
Get-Content C:\Users\28610\.ssh\id_rsa.pub
```

操作步骤：
  
打开 PowerShell（可通过开始菜单搜索 "PowerShell" 找到）。

执行上述命令。

复制输出的全部内容（以`ssh-rsa`开头，以邮箱地址结尾）。

**使用记事本打开**  

```
notepad C:\Users\28610\.ssh\id\_rsa.pub
```

操作步骤：

在 PowerShell 中执行上述命令。

记事本会打开公钥文件。

复制文件中的全部内容。

**使用 Git Bash（推荐）**：如果安装了 Git for Windows，可以使用 Git Bash 中的`cat`命令：  

打开 Git Bash。

执行：

```
cat ~/.ssh/id_rsa.pub
```

复制输出内容。
  

#### 2. 登录服务器并编辑授权文件

```
ssh root@server.example.com # 输入密码登录
nano ~/.ssh/authorized_keys # 编辑授权文件
```

将复制的公钥内容粘贴到文件末尾。

按`Ctrl + O`保存，`Ctrl + X`退出。
*PS:然后重启服务器，验证登陆就完了（然后基本上到这后面就不用看了）
## 三、配置服务器 SSH 服务(我觉得可不看)

### 1. 确保 SSH 配置正确

```
nano /etc/ssh/sshd_config
```

确保以下设置启用（取消注释并确保值为`yes`）：

```
PubkeyAuthentication yes

AuthorizedKeysFile .ssh/authorized_keys

PasswordAuthentication yes # 保留密码认证，以防公钥配置失败
```

### 2. 重启 SSH 服务

```
# CentOS/RHEL

systemctl restart sshd

# Ubuntu/Debian

service ssh restart
```

## 四、验证免密码登录 

```
ssh root@server.example.com
```

**成功标志**：直接登录，无需输入密码。

**失败处理**：若仍提示密码，检查以下内容：

服务器`~/.ssh/authorized_keys`文件权限是否为 600。

服务器`~/.ssh`目录权限是否为 700。

SSH 服务配置是否正确并已重启。

## 五、进阶优化（可选）

### 1. 创建 SSH 配置文件（简化连接）
  

在 Windows 的`~/.ssh/config`中添加：
```
Host myserver

HostName server.example.com

User root

IdentityFile ~/.ssh/id_rsa
```

之后可直接使用：  

```
ssh myserver

scp file.txt myserver:/opt/
```


### 2. 禁用密码登录（增强安全性）

编辑服务器`sshd_config`：  

```
PasswordAuthentication no
```

重启 SSH 服务后，仅允许公钥登录。
## 六、常见问题排查

### 1. 权限问题  

```
# 服务器端执行

chmod 700 ~/.ssh

chmod 600 ~/.ssh/authorized_keys
```
  

### 2. 防火墙问题

确保服务器防火墙开放 SSH 端口（默认 22）：

```
# CentOS/RHEL

firewall-cmd --permanent --add-service=ssh

firewall-cmd --reload

# Ubuntu/Debian

ufw allow 22

```

### 3. SELinux 问题（如适用）


```
setsebool -P sshd_use_usbguard on
```

  
通过以上步骤，你可以在 Windows 上生成 SSH 密钥对并配置免密码登录服务器，大幅提升文件传输和远程管理的效率。建议在配置完成后测试几次，确保一切正常。