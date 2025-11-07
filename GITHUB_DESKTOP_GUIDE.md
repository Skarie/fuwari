# GitHub Desktop 推送项目到仓库详细指南

## 📋 当前项目状态

- **仓库地址**：https://github.com/Skarie/fuwari.git
- **当前分支**：main
- **未提交的更改**：
  - 修改的文件：10 个
  - 新增的文件：多个（友链页面、教程文章等）

---

## 🚀 使用 GitHub Desktop 推送步骤

### 步骤 1：打开 GitHub Desktop

1. 启动 GitHub Desktop 应用程序
2. 确保已登录您的 GitHub 账号

### 步骤 2：打开项目仓库

如果项目还没有在 GitHub Desktop 中打开：

1. 点击 **File** → **Add Local Repository**
2. 选择项目目录：`D:\GitHub\fuwari`
3. 点击 **Add repository**

### 步骤 3：查看更改

在左侧面板中，您会看到：

- **Changes（更改）**：显示所有修改和新增的文件
  - 修改的文件（Modified）
  - 新增的文件（Untracked）

### 步骤 4：暂存更改（Stage Changes）

有两种方式：

**方式 A：全选所有更改**
- 在 "Changes" 标题旁边，勾选复选框以选择所有文件

**方式 B：选择特定文件**
- 逐个勾选需要提交的文件
- 建议：先提交功能相关的文件，分批提交更清晰

### 步骤 5：编写提交信息（Commit Message）

在底部填写提交信息：

**Summary（必填）**：
```
feat: 添加友链页面、分页样式优化、面板透明度调节、全局背景图片
```

**Description（可选）**：
```
- 添加友链页面功能（FriendLinkCard 组件、links 页面）
- 优化分页组件样式（独立圆角方块）
- 添加面板透明度调节功能
- 添加全局全屏背景图片
- 更新配置文件（网站标题、个人信息等）
```

### 步骤 6：提交更改（Commit）

点击 **"Commit to main"** 按钮（或 **"Commit to [分支名]"**）

### 步骤 7：推送到远程仓库（Push）

有两种情况：

**情况 A：首次推送（如果没有推送过）**
- 点击 **"Publish branch"** 按钮
- 选择推送到的远程仓库（通常是 origin）

**情况 B：已有远程仓库（当前情况）**
- 点击顶部工具栏的 **"Push origin"** 按钮
- 或使用菜单：**Repository** → **Push**

### 步骤 8：验证推送成功

推送成功后：

1. 在 GitHub Desktop 中，左侧面板应该显示 "No local changes"
2. 访问 https://github.com/Skarie/fuwari 查看远程仓库
3. 确认所有更改都已同步

---

## 💡 推荐的分批提交策略

由于更改较多，建议分批提交，更清晰：

### 第一批：友链页面功能
```
feat: 添加友链页面功能

- 创建 FriendLinkCard 组件
- 创建 links.astro 页面
- 添加友链配置文件
- 更新导航栏配置
```

**包含文件**：
- `src/components/misc/FriendLinkCard.astro`
- `src/pages/links.astro`
- `src/config/links.ts`
- `src/content/spec/links.md`
- `src/config.ts`（导航栏部分）

### 第二批：分页样式优化
```
style: 优化分页组件样式

- 将页码改为独立的圆角方块
- 添加按钮间距
- 移除外层容器背景
```

**包含文件**：
- `src/components/control/Pagination.astro`

### 第三批：面板透明度功能
```
feat: 添加面板透明度调节功能

- 添加透明度工具函数
- 更新 DisplaySettings 组件
- 添加国际化支持
- 添加初始化代码
```

**包含文件**：
- `src/utils/setting-utils.ts`
- `src/components/widget/DisplaySettings.svelte`
- `src/i18n/i18nKey.ts`
- `src/i18n/languages/zh_CN.ts`
- `src/i18n/languages/en.ts`
- `src/layouts/Layout.astro`（初始化部分）

### 第四批：全局背景图片
```
feat: 添加全局全屏背景图片

- 在 Layout.astro 中添加背景图片容器
- 添加遮罩层提高可读性
```

**包含文件**：
- `src/layouts/Layout.astro`（背景图片部分）
- `src/assets/images/1.png`

### 第五批：配置文件更新
```
chore: 更新网站配置

- 更新网站标题和语言
- 更新个人信息
- 更新 GitHub 链接
```

**包含文件**：
- `src/config.ts`（配置部分）

### 第六批：文章内容
```
docs: 添加教程文章

- 添加分页组件样式修改教程
- 添加面板透明度调节教程
- 添加全局背景图片教程
- 添加友链页面教程
- 添加其他文章
```

**包含文件**：
- `src/content/posts/Fuwari/` 下的所有教程文件
- 其他文章文件

---

## 🛠️ 常见问题解决

### Q1: 推送时出现冲突怎么办？

**A:** 如果远程仓库有新的更改：
1. 点击 **"Pull origin"** 拉取远程更改
2. 解决冲突（如果有）
3. 再次点击 **"Push origin"**

### Q2: 推送时提示权限不足？

**A:** 检查：
1. GitHub Desktop 是否已登录正确的账号
2. 是否有该仓库的写入权限
3. 如果 fork 的仓库，检查是否配置了 upstream

### Q3: 如何撤销提交？

**A:** 
- **未推送的提交**：右键点击提交 → **Undo this commit**
- **已推送的提交**：需要强制推送（谨慎使用）

### Q4: 如何查看提交历史？

**A:** 点击 **History** 标签页查看所有提交记录

### Q5: 如何创建新分支？

**A:** 
1. 点击当前分支名称（顶部）
2. 选择 **New branch**
3. 输入分支名称
4. 创建并切换到新分支

---

## 📝 提交信息规范（可选）

使用规范的提交信息格式，便于查看历史：

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式（不影响功能）
- `refactor:` 重构代码
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

---

## ✅ 推送完成后的检查清单

- [ ] 所有更改都已提交
- [ ] 提交信息清晰明了
- [ ] 推送到远程仓库成功
- [ ] GitHub 网页上可以看到最新代码
- [ ] 没有遗漏重要文件

---

## 🔗 相关资源

- [GitHub Desktop 官方文档](https://docs.github.com/en/desktop)
- [GitHub Desktop 下载](https://desktop.github.com/)
- [提交信息规范](https://www.conventionalcommits.org/)

---

**最后更新**：2025年1月15日

