---
title: scp推送教程
published: 2025-05-12
tags:
  - Hexo
category: Hexo
image: http://cdn-hsyq-static.shanhutech.cn/bizhi/staticwp/202504/ac63121950cc982b0df24b3406336091--1472963330.jpg
category_bar: "true"
---

以下是对原教程中代码错误进行修正，并优化使其更加详细、全面、严谨的内容：

# scp 推送教程

在进行文件传输时，scp 是一个非常实用的工具。它可以在本地与服务器之间安全地复制文件和目录。本教程将详细介绍如何使用 scp 命令进行文件推送，以及在过程中可能遇到的问题及解决方法。

## 一、scp 命令基础介绍

scp 即 “Secure Copy”，是基于 SSH 协议的安全复制命令。它能够在本地主机和远程服务器之间复制文件，并且在传输过程中对数据进行加密，确保数据的安全性。

## 二、使用场景

- **将本地文件推送到服务器**：例如将本地开发好的代码文件上传到服务器进行部署。

- **将服务器文件下载到本地**：如获取服务器上的日志文件到本地进行分析。

- **在不同服务器之间复制文件**：可通过本地作为中转，或直接在两台服务器之间进行操作。

## 三、操作步骤

### （一）Windows 系统下使用 scp

#### 1. 安装 OpenSSH

在 Windows 系统中使用 scp 命令，需要先安装 OpenSSH 客户端。具体步骤如下：

- 打开 “控制面板”。

- 在控制面板中选择 “程序”。

- 点击 “启用或关闭 Windows 功能”。

- 在弹出的列表中找到 “OpenSSH 客户端” 并勾选启用，然后点击 “确定” 等待安装完成。

#### 2. 传输单个文件

假设本地文件路径为 C:\Users\28610\Desktop\bolg\blog\source\_posts\hexo.md，服务器用户名是 `root`，服务器地址为 `server.example.com`，服务器上目标路径是 /opt/1panel/apps/local/hexo/localhexo 。在命令提示符或 PowerShell 中执行如下命令：

```
scp C:\Users\28610\Desktop\bolg\blog\source\_posts\hexo.md root@server.example.com:/opt/1panel/apps/local/hexo/localhexo
```

执行该命令后，系统会提示输入服务器用户的密码。输入正确密码后，按回车键即可开始文件传输，传输完成后会有相应提示。

#### 3. 传输整个目录（\_post）

使用 -r 选项递归传输目录及其内容。假设本地目录路径是 `C:\Users\28610\Desktop\bolg\blog\source\_posts`，执行以下命令：

```
scp -r C:\Users\28610\Desktop\bolg\blog\source\_posts root@server.example.com:/opt/1panel/apps/local/hexo/localhexo
```

同样，执行命令时系统会提示输入密码，输入正确密码后按回车键，即可开始目录传输。传输过程中会显示每个文件的传输进度，传输完成后会有相应提示。

#### 4. 使用相对路径传输当前目录

##### 方法二：在 PowerShell 中使用相对路径

要是你正在使用 PowerShell，可以通过 `Get-Location` 来获取当前目录，再拼接子目录：

```powershell
scp -r "$(Get-Location)\source" root@server.example.com:/opt/1panel/apps/local/hexo/localhexo/
```

##### 方法三：在命令提示符中使用相对路径

若在普通的命令提示符下，先进入到 `blog` 目录，再执行：

```bash
scp -r source root@server.example.com:/opt/1panel/apps/local/hexo/localhexo/
```



#### 5. 使用相对路径传输当前目录下的所有文件

>传输的是`_post`目录下的所有文件而不是`_post`
##### 在 PowerShell 中

首先，使用 cd 命令进入要传输的目录：

```
cd C:\Users\28610\Desktop\bolg\blog\source\_posts
```

然后，执行以下命令进行传输：

```
scp -r .\* root@server.example.com:/opt/1panel/apps/local/hexo/localhexo
```

##### 在命令提示符中

同样先使用 cd 命令进入要传输的目录：

```
cd C:\Users\28610\Desktop\bolg\blog\source\_posts
```

再执行以下命令：

```
scp -r.\* root@server.example.com:/opt/1panel/apps/local/hexo/localhexo
```

也可以直接使用以下命令（会传输该目录下所有文件）：

```
scp -r . root@server.example.com:/opt/1panel/apps/local/hexo/localhexo
```

### （二）类 Unix 系统（如 Linux、macOS）下使用 scp

#### 1. 传输单个文件

假设本地文件路径是 /home/user/local_file.txt，服务器用户名是 remote_user，服务器地址为 [server.example.com](http://server.example.com)，服务器上目标路径是 /path/to/remote/directory/ 。在终端执行如下命令：

```
scp /home/user/local_file.txt remote_user@server.example.com:/path/to/remote/directory/
```

执行命令后，系统会提示输入服务器用户密码，输入正确密码后按回车键，即可开始文件传输。

#### 2. 传输整个目录

假设本地目录路径是 /home/user/local_folder，执行以下命令：

```
scp -r /home/user/local_folder remote_user@server.example.com:/path/to/remote/directory/
```

输入密码后按回车键，开始目录传输。传输过程中会显示每个文件的传输进度，传输完成后会有相应提示。

## 四、常见问题及解决方法

### 1. 路径格式错误

#### 问题

在 Windows 系统中使用 scp 时，路径格式错误，如使用了 Unix/Linux 系统的路径分隔符 / 而不是 \ 或 / 的转义形式。

#### 解决方法

确保路径使用正确的格式，如 C:\Users\username\... 或 C:/Users/username/... 。在命令提示符中使用 \ 时，注意对特殊字符进行转义；在 PowerShell 中可以使用 / 或 \ 。例如，在 PowerShell 中，C:\Users\28610\Desktop 可以写成 C:/Users/28610/Desktop 。

### 2. 目录传输选项缺失

#### 问题

传输目录时未使用 -r 选项，导致报错。

#### 解决方法

在传输目录时，一定要加上 -r 选项，以递归复制目录及其所有内容。例如，要传输目录 C:\Users\28610\Desktop\bolg\blog\source\_posts ，命令应为 scp -r C:\Users\28610\Desktop\bolg\blog\source\_posts root@server.example.com:/opt/1panel/apps/local/hexo/localhexo 。

### 3. 权限问题

#### 问题

服务器上目标路径没有写入权限，导致文件传输失败。

#### 解决方法

使用具有足够权限的用户登录服务器，或者联系服务器管理员调整目标路径的权限。可以使用 chmod 命令修改目标路径的权限，例如：

```
chmod 777 /opt/1panel/apps/local/hexo/localhexo
```

上述命令将目标路径的权限设置为所有用户都有读、写、执行权限。

### 4. 连接问题

#### 问题

无法连接到服务器，可能是服务器地址错误、端口被占用或网络问题。

#### 解决方法

- 检查服务器地址是否正确，可以通过 ping 命令检查服务器是否可达：

```
ping server.example.com
```

- 确保服务器的 SSH 服务正在运行且端口未被占用。可以使用 telnet 命令检查 SSH 端口是否开放：

```
telnet server.example.com 22
```

如果 telnet 命令无法连接，可能是 SSH 服务未启动或端口被防火墙阻止，需要联系服务器管理员进行检查和处理。

通过本教程，你应该能够熟练掌握 scp 命令在不同系统下的使用，顺利完成文件和目录的推送操作。在实际使用过程中，遇到问题可参考常见问题解决方法进行排查。