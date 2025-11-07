---
title: Openstack安装
published: 2025-05-16
tags:
  - 云计算
category: 云计算
image: https://s.panlai.com/zb_users/upload/2025/04/bizhihui_com_202504061743928409730821.jpg-arthumbs
category_bar: "true"
---

以下是使用 DevStack 部署 OpenStack 开发环境的操作指南（基于文档内容整理）：
### 准备条件
- VMware Workstation Pro
- ubuntu-22.04.5-desktop 镜像
- 配置建议2C8G/50G

### **1. 添加堆栈用户（可选）**
DevStack 需以非 root 用户运行，并具备 sudo 权限。若未使用云镜像（如 Ubuntu 的“ubuntu”或 RockyLinux 的“cloud-user”），需手动创建用户：
```bash
# 创建用户（指定家目录和 shell）
sudo useradd -s /bin/bash -d /opt/stack -m stack

# 确保家目录有可执行权限（避免 RHEL/Ubuntu 21.04+ 部署问题）
sudo chmod +x /opt/stack

# 赋予 sudo 免密权限
echo "stack ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/stack

# 切换至 stack 用户
sudo -u stack -i
```


### **2. 下载 DevStack**
```bash
# 克隆 DevStack 仓库（若已拉取过，跳过此步）
git clone https://opendev.org/openstack/devstack
cd devstack
```


### **3. 创建配置文件 local.conf**
在 `devstack` 目录下创建 `local.conf`，设置最低必要配置（四个预设密码）：
```ini
[[local|localrc]]
ADMIN_PASSWORD=secret        # 管理员密码
DATABASE_PASSWORD=$ADMIN_PASSWORD  # 数据库密码（继承管理员密码）
RABBIT_PASSWORD=$ADMIN_PASSWORD    # RabbitMQ 密码（继承管理员密码）
SERVICE_PASSWORD=$ADMIN_PASSWORD  # 服务密码（继承管理员密码）
```


### **4. 开始安装**
```bash
# 执行安装脚本（非 root 用户运行，需 sudo 权限）
./stack.sh
```
- **注意**：安装过程会修改系统配置和网络，建议在干净的 VM 中运行，并提前备份或创建快照。


### **5. 访问与登录 OpenStack 面板**
安装完成后，根据终端提示获取访问地址（通常为 `http://<服务器IP>/`）：
- **用户名**：`admin`  
- **密码**：`secret`（即 `local.conf` 中设置的 `ADMIN_PASSWORD`）
>服务器ip可以通过`ip a`和 `hostname -I`查看
#### **CLI 访问方式**
```bash
# 加载环境变量（获取 CLI 认证信息）
. openrc

# 示例：列出所有实例
openstack server list
```


### **关键注意事项**
1. **安全建议**：  
   - 首次运行时务必在 disposable VM 中测试，避免影响本地系统。  
   - 仔细阅读 `stack.sh` 等脚本内容，确保理解其操作。  
2. **版本控制**：  
   - 稳定版本可切换至对应分支（如 `stable/zed`）：  
     ```bash
     git checkout stable/zed
     ```  
   - 自定义项目分支可通过 `local.conf` 设置（如 `GLANCE_BRANCH=milestone-proposed`）。  
3. **配置扩展**：  
   - 通过 `local.conf` 扩展配置（如网络、存储等），参考 [DevStack 配置指南](https://docs.openstack.org/devstack/latest)。  

 

通过以上步骤，可快速搭建一个用于开发和测试的 OpenStack 环境。如需高级功能（如多节点部署、插件集成），请进一步查阅官方文档。### DevStack 安装指南

#### 1. 添加堆栈用户（可选）
DevStack 应使用非 root 用户运行并启用 sudo 权限（云镜像的标准登录名如 `ubuntu` 或 `cloud-user` 通常适用）。若没有云镜像，可创建专用的 `stack` 用户：

```bash
# 创建 stack 用户
sudo useradd -s /bin/bash -d /opt/stack -m stack

# 确保用户主目录权限正确（避免 RHEL 系发行版权限问题）
sudo chmod +x /opt/stack

# 赋予 stack 用户无密码 sudo 权限
echo "stack ALL=(ALL) NOPASSWD: ALL" | sudo tee /etc/sudoers.d/stack

# 切换到 stack 用户
sudo -u stack -i
```


#### 2. 下载 DevStack
```bash
# 克隆 DevStack 仓库
git clone https://opendev.org/openstack/devstack
cd devstack
```
**注意**：若克隆失败可能是已成功下载过。


#### 3. 创建配置文件 `local.conf`
在 `devstack` 目录下创建包含基础密码配置的 `local.conf` 文件：

```ini
[[local|localrc]]
ADMIN_PASSWORD=secret
DATABASE_PASSWORD=$ADMIN_PASSWORD
RABBIT_PASSWORD=$ADMIN_PASSWORD
SERVICE_PASSWORD=$ADMIN_PASSWORD
```
此为启动 DevStack 的最低配置要求。


#### 4. 开始安装
```bash
# 执行安装脚本（需耐心等待，可能持续 30 分钟以上）
./stack.sh
```


#### 5. 访问管理面板
安装成功后，终端会显示 Horizon 控制面板的访问 URL：
- 使用 `Ctrl + 鼠标左键` 快速访问链接
- 登录凭证：
  - 用户名：`admin`
  - 密码：`secret`（即 `local.conf` 中设置的 `ADMIN_PASSWORD`）


### 常见问题
1. **权限问题**：若遇到 `/opt/stack` 目录访问错误，检查 `chmod +x /opt/stack` 是否正确执行。
2. **网络问题**：确保系统能访问 OpenStack 相关镜像源，可考虑配置代理。
3. **重复安装**：若需重新安装，运行 `./unstack.sh` 清理环境后再次执行 `stack.sh`。