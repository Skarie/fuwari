---
title: Fuwari 博客添加友链页面详细教程
published: 2025-11-06
tags:
  - Fuwari
  - Astro
  - 教程
category: Fuwari
image: https://cdn.mengze.vip/gh/Skarie/hexoimg/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91%E5%AF%8C%E5%A3%AB%E5%B1%B1-%E5%AF%8C%E5%A3%AB%E5%B1%B1%E5%80%92%E5%BD%B1.png
description: 详细讲解如何在基于 Astro 的 Fuwari 博客主题中添加一个功能完整、美观的友链页面，包括导航栏配置、友链卡片组件、本地头像支持等。
draft: false
---

# Fuwari 博客添加友链页面详细教程

本教程将详细讲解如何在 Fuwari 博客中添加一个功能完整、美观的友链页面。友链页面将包含带头像的友链卡片展示、友链申请说明等内容，并且完全基于 Markdown 格式管理，符合 Astro 的开发规范。

## 📋 目录

- [准备工作](#准备工作)
- [步骤一：创建友链配置文件](#步骤一创建友链配置文件)
- [步骤二：创建友链卡片组件](#步骤二创建友链卡片组件)
- [步骤三：创建友链 Markdown 内容文件](#步骤三创建友链-markdown-内容文件)
- [步骤四：创建友链页面](#步骤四创建友链页面)
- [步骤五：添加导航栏链接](#步骤五添加导航栏链接)
- [步骤六：添加友链数据](#步骤六添加友链数据)
- [头像配置说明](#头像配置说明)
- [常见问题](#常见问题)

---

## 准备工作

在开始之前，请确保您已经：

1. ✅ 安装了 Fuwari 博客主题
2. ✅ 熟悉基本的文件操作
3. ✅ 了解 Markdown 语法
4. ✅ 了解 TypeScript/JavaScript 基础语法

---

## 步骤一：创建友链配置文件

首先，我们需要创建一个配置文件来管理友链数据。

### 1.1 创建配置文件

在 `src/config/` 目录下创建 `links.ts` 文件：

```typescript
export interface FriendLink {
	name: string;
	url: string;
	description: string;
	avatar?: string;
	// avatar 支持三种格式：
	// 1. 外部链接：以 http:// 或 https:// 开头
	// 2. public 目录：以 / 开头，如 /images/avatar.jpg
	// 3. 本地路径：相对于 src 目录，如 assets/images/avatar.jpg
}

export const friendLinks: FriendLink[] = [
	{
		name: "示例友链",
		url: "https://example.com",
		description: "这是一个示例友链的描述",
		avatar: "https://example.com/avatar.jpg",
	},
	// 在这里添加更多友链
];
```

### 1.2 配置文件说明

- **`FriendLink` 接口**：定义了友链的数据结构
  - `name`：友链名称（必填）
  - `url`：友链链接（必填）
  - `description`：友链描述（必填）
  - `avatar`：头像链接（可选）

- **`friendLinks` 数组**：存储所有友链数据

---

## 步骤二：创建友链卡片组件

接下来，我们需要创建一个友链卡片组件来展示每个友链。

### 2.1 创建组件文件

在 `src/components/misc/` 目录下创建 `FriendLinkCard.astro` 文件：

```astro
---
import path from "node:path";
import { Image } from "astro:assets";
import { url } from "../../utils/url-utils";

interface Props {
	name: string;
	url: string;
	description: string;
	avatar?: string;
}

const { name, url: linkUrl, description, avatar } = Astro.props;

// 判断头像路径类型
const isExternal = avatar?.startsWith("http://") || avatar?.startsWith("https://");
const isPublic = avatar?.startsWith("/");
const isLocal = avatar && !isExternal && !isPublic;

// 处理本地图片
let localImage;
if (isLocal && avatar) {
	const files = import.meta.glob<ImageMetadata>("../../**", {
		import: "default",
	});
	const normalizedPath = path
		.normalize(path.join("../../", avatar))
		.replace(/\\/g, "/");
	
	const file = files[normalizedPath];
	if (file) {
		localImage = await file();
	} else {
		console.error(
			`\n[ERROR] Friend link avatar not found: ${normalizedPath.replace("../../", "src/")}`,
		);
	}
}

// 获取头像 URL
let avatarSrc = "";
if (isExternal) {
	avatarSrc = avatar || "";
} else if (isPublic) {
	avatarSrc = url(avatar || "");
}
---

<a
	href={linkUrl}
	target="_blank"
	rel="noopener noreferrer"
	class="group flex items-center gap-4 p-4 rounded-lg bg-[var(--btn-plain-bg-hover)] hover:bg-[var(--btn-card-bg-hover)] active:bg-[var(--btn-card-bg-active)] transition-all duration-200"
>
	<div class="w-12 h-12 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0 relative">
		{avatar && isLocal && localImage ? (
			<Image
				src={localImage}
				alt={name}
				class="w-12 h-12 rounded-full object-cover absolute inset-0"
				loading="lazy"
			/>
		) : avatar && avatarSrc ? (
			<img
				src={avatarSrc}
				alt={name}
				class="w-12 h-12 rounded-full object-cover absolute inset-0"
				loading="lazy"
				onerror="this.style.display='none';"
			/>
		) : null}
		<svg
			xmlns="http://www.w3.org/2000/svg"
			class:list={[
				"w-6 h-6 text-[var(--primary)]",
				avatar && ((isLocal && localImage) || (avatarSrc && !isLocal)) ? "hidden" : "",
			]}
			fill="none"
			viewBox="0 0 24 24"
			stroke="currentColor"
		>
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
			/>
		</svg>
	</div>
	<div class="flex-1 min-w-0">
		<div class="font-bold text-base text-90 group-hover:text-[var(--primary)] transition-colors mb-1 truncate">
			{name}
		</div>
		<div class="text-sm text-neutral-600 dark:text-neutral-400 truncate">
			{description}
		</div>
	</div>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		class="w-4 h-4 text-neutral-400 group-hover:text-[var(--primary)] transition-colors flex-shrink-0"
		fill="none"
		viewBox="0 0 24 24"
		stroke="currentColor"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="2"
			d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
		/>
	</svg>
</a>
```

### 2.2 组件功能说明

- **头像支持**：支持外部链接、public 目录和本地路径三种方式
- **默认图标**：当没有头像或头像加载失败时，显示默认的链接图标
- **响应式设计**：适配移动端和桌面端
- **交互效果**：鼠标悬停时卡片背景和文字颜色会变化

---

## 步骤三：创建友链 Markdown 内容文件

友链页面的说明文字使用 Markdown 格式管理，便于编辑和维护。

### 3.1 创建 Markdown 文件

在 `src/content/spec/` 目录下创建 `links.md` 文件：

```markdown
## 🌟 友链申请

如果您想与我交换友链，请满足以下条件：

- ✅ 网站内容健康向上，无违法内容
- ✅ 网站正常运行，能够正常访问
- ✅ 已添加本站链接

**申请方式**：请在您的网站添加本站链接后，通过以下方式联系我：

- 📧 邮箱：`your-email@example.com`
- 💻 GitHub：[@your-username](https://github.com/your-username)

**本站信息**：

- **网站名称**：您的网站名称
- **网站链接**：`https://your-domain.com`
- **网站描述**：您的网站描述

---

## 💡 友链格式说明

如果您想申请友链，请提供以下信息：

- **网站名称**：您的网站名称
- **网站链接**：完整的网站 URL
- **网站描述**：一句话描述您的网站
- **头像链接**：网站头像/Logo 的图片 URL（可选）

**头像支持三种格式**：

1. **外部链接**：以 `http://` 或 `https://` 开头
   
   头像链接：`https://example.com/avatar.jpg`

2. **public 目录**：以 `/` 开头，图片放在 `public` 目录下
   
   头像链接：`/images/avatar.jpg`  （对应 public/images/avatar.jpg）

3. **本地路径**：相对于 `src` 目录，图片放在 `src` 目录下
   
   头像链接：`assets/images/avatar.jpg`  （对应 src/assets/images/avatar.jpg）

---

<div style="text-align: center; color: var(--text-secondary); margin-top: 2rem;">

**最后更新**：2025年1月

</div>


```

### 3.2 文件说明

- 这个文件用于存储友链页面的说明文字
- 使用 Markdown 格式，便于编辑和维护
- 可以随时修改申请条件和联系方式

---

## 步骤四：创建友链页面

现在创建友链页面的主文件。

### 4.1 创建页面文件

在 `src/pages/` 目录下创建 `links.astro` 文件：

```astro
---
import { getEntry, render } from "astro:content";
import Markdown from "@components/misc/Markdown.astro";
import MainGridLayout from "../layouts/MainGridLayout.astro";
import FriendLinkCard from "@components/misc/FriendLinkCard.astro";
import { friendLinks } from "../config/links";
import { Icon } from "astro-icon/components";

const linksPost = await getEntry("spec", "links");

if (!linksPost) {
	throw new Error("Links page content not found");
}

const { Content } = await render(linksPost);
---
<MainGridLayout title="友链" description="友情链接">
    <!-- 友链卡片区域 - 放在最前面 -->
    {friendLinks.length > 0 && (
        <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32 mb-6">
            <div class="card-base z-10 px-9 py-6 relative w-full">
                <div class="flex items-center gap-3 mb-6">
                    <Icon name="material-symbols:group-rounded" class="text-3xl text-[var(--primary)]" />
                    <h2 class="text-2xl font-bold text-[var(--primary)]">友链列表</h2>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {friendLinks.map((link) => (
                        <FriendLinkCard
                            name={link.name}
                            url={link.url}
                            description={link.description}
                            avatar={link.avatar}
                        />
                    ))}
                </div>
            </div>
        </div>
    )}
    
    <!-- 说明文字区域 - 放在后面 -->
    <div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32">
        <div class="card-base z-10 px-9 py-6 relative w-full">
            <Markdown class="mt-2">
                <Content />
            </Markdown>
        </div>
    </div>
</MainGridLayout>
```

### 4.2 页面结构说明

- **友链卡片区域**：显示在页面顶部，包含所有友链卡片
- **说明文字区域**：显示在下方，包含申请说明和格式说明
- **响应式布局**：移动端单列，桌面端双列显示友链卡片

---

## 步骤五：添加导航栏链接

最后，我们需要在导航栏中添加友链页面的链接。

### 5.1 修改导航栏配置

编辑 `src/config.ts` 文件，在 `navBarConfig` 中添加友链链接：

```typescript
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "友链",
			url: "/links/", // 友链页面路径
			external: false,
		},
		{
			name: "GitHub",
			url: "https://github.com/saicaca/fuwari",
			external: true,
		},
	],
};
```

### 5.2 配置说明

- `name`：导航栏显示的文本
- `url`：页面路径，内部链接不需要包含 base path
- `external`：是否为外部链接（`false` 表示内部链接）

---

## 步骤六：添加友链数据

现在您可以在配置文件中添加实际的友链数据了。

### 6.1 编辑友链配置

打开 `src/config/links.ts` 文件，添加您的友链：

```typescript
export const friendLinks: FriendLink[] = [
	{
		name: "友链名称1",
		url: "https://example1.com",
		description: "友链描述1",
		avatar: "https://example1.com/avatar.jpg",
	},
	{
		name: "友链名称2",
		url: "https://example2.com",
		description: "友链描述2",
		avatar: "/images/avatar2.jpg", // 使用 public 目录
	},
	{
		name: "友链名称3",
		url: "https://example3.com",
		description: "友链描述3",
		avatar: "assets/images/avatar3.jpg", // 使用本地路径
	},
];
```

### 6.2 添加友链的步骤

1. 在 `friendLinks` 数组中添加新的对象
2. 填写友链的 `name`、`url`、`description`
3. 可选：添加 `avatar` 头像链接
4. 保存文件，刷新页面查看效果

---

## 头像配置说明

友链头像支持三种配置方式，您可以根据实际情况选择：

### 方式一：外部链接（最简单）

```typescript
avatar: "https://example.com/avatar.jpg"
```

**优点**：
- 配置简单，直接使用图片 URL
- 不需要本地存储图片

**缺点**：
- 依赖外部服务，如果图片失效则无法显示

### 方式二：public 目录（推荐）

```typescript
avatar: "/images/avatar.jpg"
```

**使用步骤**：
1. 在项目根目录创建 `public/images/` 目录
2. 将头像图片放到 `public/images/` 目录下
3. 在配置中使用 `/images/文件名` 格式

**优点**：
- 图片存储在本地，不依赖外部服务
- 配置简单，直接通过 URL 访问
- 不需要经过构建工具处理

**目录结构**：
```
public/
└── images/
    └── avatar.jpg
```

### 方式三：本地路径（src 目录）

```typescript
avatar: "assets/images/avatar.jpg"
```

**使用步骤**：
1. 将头像图片放到 `src/assets/images/` 目录下
2. 在配置中使用相对路径（相对于 `src` 目录）

**优点**：
- 图片会经过 Astro 的优化处理
- 支持图片压缩和格式转换

**缺点**：
- 路径解析相对复杂，可能出现找不到文件的情况

**目录结构**：
```
src/
└── assets/
    └── images/
        └── avatar.jpg
```

### 推荐方案

**建议使用 public 目录方式**，因为：
- ✅ 配置简单，不容易出错
- ✅ 图片加载速度快
- ✅ 不依赖构建工具
- ✅ 如果图片加载失败，会自动显示默认图标

---

## 常见问题

### Q1: 头像无法显示怎么办？

**A:** 请检查以下几点：

1. **路径是否正确**：确认图片文件确实存在于指定路径
2. **文件名是否匹配**：注意大小写和文件扩展名
3. **使用 public 目录**：如果本地路径不行，尝试使用 public 目录
4. **查看控制台**：浏览器控制台会显示错误信息，帮助定位问题

### Q2: 如何修改友链页面的说明文字？

**A:** 直接编辑 `src/content/spec/links.md` 文件即可，使用 Markdown 格式编写。

### Q3: 如何调整友链卡片的样式？

**A:** 编辑 `src/components/misc/FriendLinkCard.astro` 文件，修改其中的 CSS 类名和样式。

### Q4: 友链卡片是单列还是双列？

**A:** 默认是响应式布局：
- 移动端（小于 md 断点）：单列显示
- 桌面端（大于等于 md 断点）：双列显示

可以在 `links.astro` 中修改 `grid-cols-1 md:grid-cols-2` 来调整列数。

### Q5: 如何添加更多友链？

**A:** 在 `src/config/links.ts` 文件的 `friendLinks` 数组中添加新的友链对象即可。

### Q6: 友链页面访问路径是什么？

**A:** 默认路径是 `/links/`，可以在 `src/pages/links.astro` 的文件名或 `src/config.ts` 的导航栏配置中修改。

---

## 总结

通过本教程，您已经成功为 Fuwari 博客添加了一个功能完整的友链页面。主要特点包括：

- ✅ **美观的卡片设计**：带头像的友链卡片，支持悬停效果
- ✅ **灵活的配置方式**：使用 TypeScript 配置文件管理友链数据
- ✅ **Markdown 支持**：说明文字使用 Markdown 格式，便于编辑
- ✅ **多种头像支持**：支持外部链接、public 目录和本地路径
- ✅ **响应式布局**：适配移动端和桌面端
- ✅ **符合 Astro 规范**：遵循 Astro 的开发规范和最佳实践

现在您可以开始添加您的友链了！如果遇到任何问题，请参考常见问题部分或查看项目文档。

---

**相关文章**：
- [MM](/posts/mm/mm/)
- [Fuwari 文章内跳转方法与注意事项](/posts/fuwari/fuwari文章内跳转方法与注意事项/fuwari文章内跳转方法与注意事项/)
- [Fuwari Banner 全屏显示教程](/posts/fuwari/fuwari-banner全屏显示教程/fuwari-banner全屏显示教程/)

---

**最后更新**：2025年1月15日

