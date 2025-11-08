---
title: Fuwari从零开始添加相册功能
published: 2025-11-08
description: 完整详细的教程：从零开始为 Fuwari 博客添加相册功能，包含所有必要的文件创建和代码
tags:
  - Fuwari
  - 相册
  - 教程
  - Astro
category: Fuwari
draft: false
---

# Fuwari 从零开始添加相册功能 - 完整教程

本教程将详细讲解如何从零开始为 Fuwari 博客添加相册功能。假设你的博客原本没有相册功能，我们将一步步创建所有必要的文件。

## 📋 目录

- [前置要求](#前置要求)
- [第一步：创建目录结构](#第一步创建目录结构)
- [第二步：创建配置文件](#第二步创建配置文件)
- [第三步：创建相册页面](#第三步创建相册页面)
- [第四步：配置导航栏](#第四步配置导航栏)
- [第五步：添加示例内容](#第五步添加示例内容)
- [第六步：测试和验证](#第六步测试和验证)
- [完整文件代码](#完整文件代码)
- [常见问题](#常见问题)
- [总结](#总结)

## 前置要求

在开始之前，确保你已经：

- ✅ 安装了 Node.js（推荐 v18 或更高版本）
- ✅ 安装了 pnpm（或 npm/yarn）
- ✅ 拥有一个 Fuwari 博客项目
- ✅ 熟悉基本的命令行操作

## 第一步：创建目录结构

### 1.1 创建相册目录

打开终端，进入你的项目根目录，执行以下命令：

**Windows (PowerShell)**:
```powershell
# 创建相册主目录
New-Item -ItemType Directory -Path "public\gallery" -Force

# 创建图片目录
New-Item -ItemType Directory -Path "public\gallery\images" -Force

# 创建视频目录
New-Item -ItemType Directory -Path "public\gallery\videos" -Force
```

**Windows (CMD)**:
```cmd
mkdir public\gallery
mkdir public\gallery\images
mkdir public\gallery\videos
```

**Mac/Linux**:
```bash
mkdir -p public/gallery/images
mkdir -p public/gallery/videos
```

### 1.2 验证目录创建

检查目录是否创建成功：

```bash
# 查看目录结构
ls public/gallery
# 应该看到 images 和 videos 两个文件夹
```

### 1.3 创建 Git 占位文件（可选）

如果使用 Git，可以创建 `.gitkeep` 文件以确保空目录被跟踪：

**Windows**:
```powershell
New-Item -ItemType File -Path "public\gallery\images\.gitkeep" -Force
New-Item -ItemType File -Path "public\gallery\videos\.gitkeep" -Force
```

**Mac/Linux**:
```bash
touch public/gallery/images/.gitkeep
touch public/gallery/videos/.gitkeep
```

## 第二步：创建配置文件

### 2.1 创建 config 目录（如果不存在）

首先检查 `src/config/` 目录是否存在，如果不存在则创建：

**Windows**:
```powershell
New-Item -ItemType Directory -Path "src\config" -Force
```

**Mac/Linux**:
```bash
mkdir -p src/config
```

### 2.2 创建 gallery.ts 配置文件

在 `src/config/` 目录下创建 `gallery.ts` 文件，并复制以下完整代码：

```typescript
export interface GalleryItem {
	// 媒体类型：'image' 或 'video'
	type: "image" | "video";
	// 媒体源：可以是外部链接（http:// 或 https://）或本地路径
	// 本地路径支持以下格式：
	// 1. 相册目录（推荐）：/gallery/images/photo.jpg 或 /gallery/videos/video.mp4
	//    这些文件应放在 public/gallery/images/ 或 public/gallery/videos/ 目录下
	// 2. 其他 public 目录：以 / 开头，如 /images/photo.jpg
	// 3. 外部链接：http:// 或 https:// 开头的完整 URL
	src: string;
	// 缩略图（可选，主要用于视频）
	// 路径格式同上，建议使用 /gallery/images/thumbnail.jpg
	thumbnail?: string;
	// 标题（可选）
	title?: string;
	// 描述（可选）
	description?: string;
	// 宽度（可选，用于视频）
	width?: number;
	// 高度（可选，用于视频）
	height?: number;
}

export interface GalleryCategory {
	// 分类名称
	name: string;
	// 分类描述（可选）
	description?: string;
	// 该分类下的媒体项
	items: GalleryItem[];
}

export const galleryCategories: GalleryCategory[] = [
	// 在这里添加你的相册分类和内容
	// 示例配置（你可以先使用这个测试，后续再替换为你的内容）：
	{
		name: "示例分类",
		description: "这是一个示例分类",
		items: [
			// 暂时为空，后续添加图片
		],
	},
];
```

**文件保存位置**：`src/config/gallery.ts`

### 2.3 验证配置文件

确保文件创建成功：

```bash
# 检查文件是否存在
ls src/config/gallery.ts
# 或者
cat src/config/gallery.ts
```

## 第三步：创建相册页面

### 3.1 创建 gallery.astro 页面文件

在 `src/pages/` 目录下创建 `gallery.astro` 文件。

**重要**：这个文件比较长，请完整复制以下代码：

```astro
---
import { getImage, Image } from "astro:assets";
import { Icon } from "astro-icon/components";
import { galleryCategories } from "../config/gallery";
import MainGridLayout from "../layouts/MainGridLayout.astro";
import { url } from "../utils/url-utils";
import "photoswipe/style.css";

// 处理图片路径和获取图片对象
async function getImageData(itemSrc: string) {
	// 如果是外部链接或 public 目录路径（以 / 开头），直接使用 URL
	// 相册图片统一放在 /gallery/ 目录下，通过 URL 访问
	if (
		itemSrc.startsWith("http://") ||
		itemSrc.startsWith("https://") ||
		itemSrc.startsWith("/")
	) {
		return {
			type: "url" as const,
			src: itemSrc.startsWith("/") ? url(itemSrc) : itemSrc,
		};
	}
	// 如果是 assets 目录的图片（不推荐用于相册，建议使用 /gallery/ 目录）
	// 保留此功能以兼容旧配置
	try {
		const imageSrc = new URL(`../${itemSrc}`, import.meta.url);
		// @ts-expect-error - getImage accepts URL but types may not reflect this
		const image = await getImage({ src: imageSrc });
		return { type: "image" as const, image };
	} catch (error) {
		console.error(`Failed to load image: ${itemSrc}`, error);
		return { type: "url" as const, src: itemSrc };
	}
}

// 处理所有图片数据
const imageDataMap = new Map();
for (const category of galleryCategories) {
	for (const item of category.items) {
		if (item.type === "image") {
			const data = await getImageData(item.src);
			imageDataMap.set(`${category.name}-${item.src}`, data);
		}
	}
}
---

<MainGridLayout title="相册" description="我的相册 - 照片和视频集合">
	<div class="flex w-full rounded-[var(--radius-large)] overflow-hidden relative min-h-32 mb-6">
		<div class="card-base z-10 px-4 md:px-9 py-6 relative w-full">
			<!-- 标题 -->
			<div class="flex items-center gap-3 mb-6">
				<Icon name="material-symbols:photo-library-outline-rounded" class="text-3xl text-[var(--primary)]" />
				<h1 class="text-2xl font-bold text-[var(--primary)]">相册</h1>
			</div>

			<!-- 分类切换按钮 -->
			<div class="flex flex-wrap gap-2 mb-6">
				<button
					class="gallery-category-btn btn-plain scale-animation rounded-lg h-10 px-4 font-bold active:scale-95 active"
					data-category="all"
				>
					全部
				</button>
				{galleryCategories.map((category) => (
					<button
						class="gallery-category-btn btn-plain scale-animation rounded-lg h-10 px-4 font-bold active:scale-95"
						data-category={category.name}
					>
						{category.name}
					</button>
				))}
			</div>

			<!-- 相册内容 -->
			<div id="gallery-container" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
				{galleryCategories.map((category) =>
					category.items.map((item, itemIndex) => {
						const isImage = item.type === "image";
						const isVideo = item.type === "video";
						const categoryClass = `gallery-item gallery-category-${category.name}`;
						const imageKey = `${category.name}-${item.src}`;
						const imageData = isImage ? imageDataMap.get(imageKey) : null;

						return (
							<div class={categoryClass} data-type={item.type} data-category={category.name}>
								{isImage && imageData && (
									<div class="gallery-image-wrapper relative group cursor-pointer overflow-hidden rounded-xl bg-black/5 dark:bg-white/5" style="pointer-events: auto;">
										{imageData.type === "image" ? (
											<Image
												src={imageData.image}
												alt={item.title || category.name}
												title={item.title || category.name}
												class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 pointer-events-none"
												loading="lazy"
											/>
										) : (
											<img
												src={imageData.src}
												alt={item.title || category.name}
												title={item.title || category.name}
												class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 pointer-events-none"
												loading="lazy"
											/>
										)}
										<div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center pointer-events-none">
											<Icon
												name="material-symbols:zoom-in-rounded"
												class="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
											/>
										</div>
										{item.title && (
											<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
												{item.title}
											</div>
										)}
									</div>
								)}
								{isVideo && (
									<div class="gallery-video-wrapper relative group overflow-hidden rounded-xl bg-black/5 dark:bg-white/5">
										<video
											src={item.src.startsWith("http://") || item.src.startsWith("https://") || item.src.startsWith("/") ? item.src : url(item.src)}
											class="w-full h-full object-cover"
											controls
											preload="metadata"
											poster={item.thumbnail ? (item.thumbnail.startsWith("http://") || item.thumbnail.startsWith("https://") || item.thumbnail.startsWith("/") ? item.thumbnail : url(item.thumbnail)) : undefined}
										>
											您的浏览器不支持视频播放。
										</video>
										{item.title && (
											<div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 text-white text-xs">
												{item.title}
											</div>
										)}
									</div>
								)}
							</div>
						);
					})
				)}
			</div>

			<!-- 空状态 -->
			<div id="gallery-empty" class="hidden text-center py-12 text-black/50 dark:text-white/50">
				<Icon name="material-symbols:image-not-supported-outline-rounded" class="text-6xl mb-4" />
				<p>该分类下暂无内容</p>
			</div>
		</div>
	</div>
</MainGridLayout>

<script>
	// 分类切换功能
	function initGallery() {
		const categoryButtons = document.querySelectorAll(".gallery-category-btn");
		const galleryItems = document.querySelectorAll(".gallery-item");
		const emptyState = document.getElementById("gallery-empty");
		const container = document.getElementById("gallery-container");

		categoryButtons.forEach((button) => {
			button.addEventListener("click", () => {
				// 更新按钮状态
				categoryButtons.forEach((btn) => btn.classList.remove("active"));
				button.classList.add("active");

				const selectedCategory = button.getAttribute("data-category");
				let visibleCount = 0;

				// 显示/隐藏相册项
				galleryItems.forEach((item) => {
					if (!(item instanceof HTMLElement)) return;
					const itemCategory = item.getAttribute("data-category");
					if (selectedCategory === "all" || itemCategory === selectedCategory) {
						item.style.display = "";
						visibleCount++;
					} else {
						item.style.display = "none";
					}
				});

				// 显示/隐藏空状态
				if (emptyState && container) {
					if (visibleCount === 0) {
						emptyState.classList.remove("hidden");
						container.classList.add("hidden");
					} else {
						emptyState.classList.add("hidden");
						container.classList.remove("hidden");
					}
				}
			});
		});
	}

	// 初始化 PhotoSwipe 用于图片查看
	let lightboxInstance: any = null;
	let photoSwipeLoaded = false;

	async function loadPhotoSwipe() {
		if (photoSwipeLoaded) return;
		try {
			await import("photoswipe/style.css");
			photoSwipeLoaded = true;
		} catch (error) {
			console.error("Failed to load PhotoSwipe styles:", error);
		}
	}

	async function initPhotoSwipe() {
		if (typeof window === "undefined") return;

		try {
			await loadPhotoSwipe();
			const { default: PhotoSwipeLightbox } = await import("photoswipe/lightbox");
			const pswpModule = await import("photoswipe");

			// 先移除所有现有的事件监听器（通过数据属性标记）
			const existingWrappers = document.querySelectorAll(".gallery-image-wrapper[data-photoswipe-initialized]");
			existingWrappers.forEach((wrapper) => {
				wrapper.removeAttribute("data-photoswipe-initialized");
			});

			// 为所有图片包装器绑定点击事件
			const imageWrappers = document.querySelectorAll(".gallery-image-wrapper");
			imageWrappers.forEach((wrapper) => {
				if (!(wrapper instanceof HTMLElement)) return;
				if (wrapper.hasAttribute("data-photoswipe-initialized")) return;

				wrapper.setAttribute("data-photoswipe-initialized", "true");
				const img = wrapper.querySelector("img");
				if (!img || !(img instanceof HTMLImageElement)) return;

				// 在包装器上绑定点击事件，而不是图片本身
				wrapper.addEventListener("click", async (e) => {
					e.preventDefault();
					e.stopPropagation();

					// 确保图片已加载
					if (!img.complete || img.naturalWidth === 0) {
						await new Promise((resolve) => {
							if (img.complete) {
								resolve(undefined);
							} else {
								img.addEventListener("load", resolve, { once: true });
								img.addEventListener("error", resolve, { once: true });
								// 超时保护
								setTimeout(resolve, 3000);
							}
						});
					}

					try {
						// 收集所有可见图片的数据
						const visibleWrappers = Array.from(
							document.querySelectorAll(".gallery-image-wrapper:not([style*='display: none'])")
						);
						const visibleImages = visibleWrappers
							.map((w) => w.querySelector("img"))
							.filter((img): img is HTMLImageElement => img instanceof HTMLImageElement);

						const allData = visibleImages.map((image) => {
							const width = image.naturalWidth || image.width || 1920;
							const height = image.naturalHeight || image.height || 1080;

							return {
								src: image.src,
								w: width,
								h: height,
								title: image.alt || image.getAttribute("title") || "",
							};
						});

						// 找到当前点击的图片索引
						const currentIndex = visibleImages.findIndex((image) => image === img);
						if (currentIndex === -1) {
							console.warn("Could not find image index");
							return;
						}

						// 销毁之前的实例
						if (lightboxInstance) {
							try {
								lightboxInstance.destroy();
							} catch (e) {
								// 忽略销毁错误
							}
						}

						// 创建新的 PhotoSwipe 实例
						const lightbox = new PhotoSwipeLightbox({
							dataSource: allData,
							pswpModule: () => Promise.resolve(pswpModule),
							index: currentIndex,
							showHideAnimationType: "zoom",
							zoomAnimationDuration: 200,
							maxZoomLevel: 4,
							closeSVG: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>',
							zoomSVG: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M340-540h-40q-17 0-28.5-11.5T260-580q0-17 11.5-28.5T300-620h40v-40q0-17 11.5-28.5T380-700q17 0 28.5 11.5T420-660v40h40q17 0 28.5 11.5T500-580q0 17-11.5 28.5T460-540h-40v40q0 17-11.5 28.5T380-460q-17 0-28.5-11.5T340-500v-40Zm40 220q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>',
							padding: { top: 20, bottom: 20, left: 20, right: 20 },
							wheelToZoom: true,
							arrowPrev: true,
							arrowNext: true,
							imageClickAction: "close",
							tapAction: "toggle-controls",
							doubleTapAction: "zoom",
						});

						lightbox.init();
						lightbox.loadAndOpen(currentIndex);
						lightboxInstance = lightbox;
					} catch (error) {
						console.error("PhotoSwipe error:", error);
					}
				});

				// 确保包装器可以点击
				wrapper.style.cursor = "pointer";
			});
		} catch (error) {
			console.error("Failed to initialize PhotoSwipe:", error);
		}
	}

	// 页面加载完成后初始化
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", () => {
			initGallery();
			initPhotoSwipe();
		});
	} else {
		initGallery();
		initPhotoSwipe();
	}

	// 如果使用 Swup，需要在页面切换后重新初始化
	if (typeof window !== "undefined" && (window as any).swup) {
		(window as any).swup.hooks.on("page:view", () => {
			setTimeout(() => {
				initGallery();
				// 延迟初始化 PhotoSwipe，确保 DOM 已更新
				setTimeout(() => {
					initPhotoSwipe();
				}, 200);
			}, 100);
		});
	}
</script>

<style>
	.gallery-image-wrapper,
	.gallery-video-wrapper {
		aspect-ratio: 1;
		min-height: 120px;
	}

	.gallery-image-wrapper img,
	.gallery-video-wrapper video {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.gallery-category-btn.active {
		background-color: var(--primary);
		color: white;
	}

	@media (max-width: 640px) {
		#gallery-container {
			grid-template-columns: repeat(2, 1fr);
			gap: 0.5rem;
		}

		.gallery-image-wrapper,
		.gallery-video-wrapper {
			min-height: 100px;
		}
	}
</style>
```

**文件保存位置**：`src/pages/gallery.astro`

### 3.2 验证页面文件

确保文件创建成功：

```bash
# 检查文件是否存在
ls src/pages/gallery.astro
```

## 第四步：配置导航栏

### 4.1 打开配置文件

打开 `src/config.ts` 文件（如果不存在，创建它）。

### 4.2 找到导航栏配置

找到 `navBarConfig` 配置项，它应该类似于：

```typescript
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		// ... 其他链接
	],
};
```

### 4.3 添加相册链接

在 `links` 数组中添加相册链接：

```typescript
export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "相册",
			url: "/gallery/",
			external: false,
		},
		// ... 其他链接（如果有）
	],
};
```

### 4.4 验证配置

确保配置语法正确，没有拼写错误。

## 第五步：添加示例内容

### 5.1 添加测试图片（可选）

为了测试相册功能，你可以添加一张测试图片：

1. 找一张图片文件（JPG 或 PNG 格式）
2. 将图片复制到 `public/gallery/images/` 目录
3. 假设图片文件名为 `test.jpg`

### 5.2 更新配置文件

打开 `src/config/gallery.ts` 文件，更新配置：

```typescript
export const galleryCategories: GalleryCategory[] = [
	{
		name: "测试分类",
		description: "这是一个测试分类",
		items: [
			{
				type: "image",
				src: "/gallery/images/test.jpg", // 替换为你的图片文件名
				title: "测试图片",
				description: "这是一张测试图片",
			},
		],
	},
];
```

**注意**：如果你还没有添加图片，可以暂时保持 `items` 数组为空，相册页面会显示"该分类下暂无内容"的提示。

## 第六步：测试和验证

### 6.1 启动开发服务器

在项目根目录运行：

```bash
pnpm dev
```

或者：

```bash
npm run dev
```

### 6.2 访问相册页面

1. 打开浏览器
2. 访问开发服务器地址（通常是 `http://localhost:4321`）
3. 点击导航栏中的"相册"链接
4. 或直接访问 `http://localhost:4321/gallery/`

### 6.3 验证功能

#### 验证页面显示

- [ ] 相册页面能够正常打开
- [ ] 页面标题显示为"相册"
- [ ] 分类按钮正常显示
- [ ] 如果添加了图片，图片能够正常显示

#### 验证分类切换

- [ ] 点击"全部"按钮，显示所有内容
- [ ] 点击分类按钮，能够切换显示
- [ ] 分类按钮的激活状态正确

#### 验证图片放大（如果添加了图片）

- [ ] 点击图片能够打开 PhotoSwipe 灯箱
- [ ] 图片能够正常放大显示
- [ ] 鼠标滚轮可以缩放
- [ ] 双击可以放大/缩小
- [ ] 左右箭头可以切换图片
- [ ] ESC 键或点击可以关闭

### 6.4 检查控制台错误

1. 按 F12 打开浏览器开发者工具
2. 切换到"Console"（控制台）标签
3. 查看是否有红色错误信息
4. 如果有错误，根据错误信息进行修复

### 6.5 常见问题检查

如果相册页面无法正常显示，检查以下内容：

- [ ] 目录结构是否正确
  - `public/gallery/images/` 是否存在
  - `public/gallery/videos/` 是否存在
- [ ] 配置文件是否存在
  - `src/config/gallery.ts` 是否存在
- [ ] 页面文件是否存在
  - `src/pages/gallery.astro` 是否存在
- [ ] 导航栏配置是否正确
  - `src/config.ts` 中是否添加了相册链接
- [ ] 浏览器控制台是否有错误
  - 按 F12 查看控制台

## 完整文件代码

为了便于参考，这里是所有需要创建的文件和完整代码：

### 文件 1：src/config/gallery.ts

```typescript
export interface GalleryItem {
	type: "image" | "video";
	src: string;
	thumbnail?: string;
	title?: string;
	description?: string;
	width?: number;
	height?: number;
}

export interface GalleryCategory {
	name: string;
	description?: string;
	items: GalleryItem[];
}

export const galleryCategories: GalleryCategory[] = [
	// 在这里添加你的相册分类和内容
];
```

### 文件 2：src/pages/gallery.astro

（完整代码见第三步，这里不再重复）

### 文件 3：src/config.ts（修改）

在 `navBarConfig.links` 中添加：

```typescript
{
	name: "相册",
	url: "/gallery/",
	external: false,
}
```

## 常见问题

### Q1: 页面显示 404 错误

**原因**：页面文件路径不正确或文件不存在

**解决方法**：
1. 检查 `src/pages/gallery.astro` 文件是否存在
2. 确保文件路径正确
3. 重启开发服务器

### Q2: 导航栏没有显示"相册"链接

**原因**：导航栏配置不正确

**解决方法**：
1. 检查 `src/config.ts` 文件
2. 确认 `navBarConfig.links` 数组中添加了相册链接
3. 检查配置语法是否正确
4. 重启开发服务器

### Q3: 图片无法显示

**原因**：图片路径不正确或文件不存在

**解决方法**：
1. 检查图片文件是否存在于 `public/gallery/images/` 目录
2. 检查配置文件中的路径是否正确（注意开头的 `/`）
3. 确认文件名大小写正确
4. 检查浏览器控制台是否有 404 错误

### Q4: 点击图片无法放大

**原因**：PhotoSwipe 未正确加载或初始化失败

**解决方法**：
1. 检查浏览器控制台是否有错误
2. 确认 `photoswipe` 包已安装（通常已包含在项目中）
3. 检查图片是否完全加载
4. 尝试刷新页面

### Q5: 分类切换不工作

**原因**：JavaScript 初始化失败

**解决方法**：
1. 检查浏览器控制台是否有 JavaScript 错误
2. 确认页面文件中的脚本代码完整
3. 检查 HTML 元素是否正确渲染

### Q6: 构建失败

**原因**：TypeScript 类型错误或导入错误

**解决方法**：
1. 检查所有文件的导入路径是否正确
2. 确认 `gallery.ts` 文件导出正确
3. 检查 TypeScript 类型错误
4. 运行 `pnpm build` 查看详细错误信息

## 下一步：添加你的内容

现在相册功能已经创建完成，你可以：

1. **添加图片**：
   - 将图片文件放入 `public/gallery/images/` 目录
   - 在 `src/config/gallery.ts` 中添加配置

2. **添加视频**：
   - 将视频文件放入 `public/gallery/videos/` 目录
   - 在配置文件中添加视频配置

3. **创建分类**：
   - 在配置文件中添加新的分类
   - 为每个分类添加媒体项

4. **自定义样式**：
   - 修改 `gallery.astro` 文件中的样式
   - 调整布局和外观

## 创建步骤总结

### 完整步骤清单

按照以下步骤，你可以从零开始创建相册功能：

- [ ] **步骤 1**：创建目录结构
  - [ ] 创建 `public/gallery/` 目录
  - [ ] 创建 `public/gallery/images/` 目录
  - [ ] 创建 `public/gallery/videos/` 目录

- [ ] **步骤 2**：创建配置文件
  - [ ] 创建 `src/config/` 目录（如果不存在）
  - [ ] 创建 `src/config/gallery.ts` 文件
  - [ ] 复制配置代码到文件

- [ ] **步骤 3**：创建相册页面
  - [ ] 创建 `src/pages/gallery.astro` 文件
  - [ ] 复制完整页面代码到文件

- [ ] **步骤 4**：配置导航栏
  - [ ] 打开 `src/config.ts` 文件
  - [ ] 在 `navBarConfig.links` 中添加相册链接

- [ ] **步骤 5**：测试功能
  - [ ] 启动开发服务器
  - [ ] 访问相册页面
  - [ ] 验证功能正常

- [ ] **步骤 6**：添加内容
  - [ ] 添加图片到 `public/gallery/images/`
  - [ ] 在配置文件中添加图片配置
  - [ ] 测试图片显示和放大功能

### 快速验证

完成所有步骤后，运行以下命令验证：

```bash
# 1. 检查目录是否存在
ls public/gallery/images
ls public/gallery/videos

# 2. 检查配置文件是否存在
ls src/config/gallery.ts

# 3. 检查页面文件是否存在
ls src/pages/gallery.astro

# 4. 启动开发服务器
pnpm dev

# 5. 访问 http://localhost:4321/gallery/
```

## 文件清单

创建完成后，你应该有以下文件：

```
fuwari/
├── public/
│   └── gallery/
│       ├── images/          # ✅ 已创建
│       └── videos/          # ✅ 已创建
├── src/
│   ├── config/
│   │   └── gallery.ts       # ✅ 已创建
│   └── pages/
│       └── gallery.astro    # ✅ 已创建
└── src/
    └── config.ts            # ✅ 已修改（添加相册链接）
```

## 总结

恭喜！你已经成功为 Fuwari 博客添加了相册功能。现在你拥有：

- ✅ 完整的相册目录结构
- ✅ 相册配置文件
- ✅ 相册页面（支持图片和视频）
- ✅ 导航栏链接
- ✅ PhotoSwipe 图片放大功能
- ✅ 分类切换功能
- ✅ 响应式设计

### 下一步操作

1. **添加你的图片和视频**
   - 将文件放入 `public/gallery/images/` 或 `public/gallery/videos/`
   - 在 `src/config/gallery.ts` 中添加配置

2. **创建分类**
   - 在配置文件中添加新的分类
   - 为每个分类添加媒体项

3. **自定义样式**（可选）
   - 修改 `gallery.astro` 中的样式
   - 调整布局和外观

4. **部署**
   - 运行 `pnpm build` 构建项目
   - 部署到你的服务器或托管平台

## 参考资源

- [PhotoSwipe 官方文档](https://photoswipe.com/)
- [Astro 官方文档](https://docs.astro.build/)
- [Fuwari 主题仓库](https://github.com/saicaca/fuwari)

## 获取帮助

如果遇到问题：

1. **查看浏览器控制台**：按 F12 打开开发者工具，查看错误信息
2. **检查文件路径**：确保所有文件路径正确
3. **验证配置**：检查配置文件语法是否正确
4. **参考常见问题**：查看本文档的"常见问题"部分
5. **查看项目文档**：参考 Fuwari 主题的官方文档

---

**祝你使用愉快！** 🎉

现在你可以开始添加你的图片和视频内容，打造属于你的相册了！

