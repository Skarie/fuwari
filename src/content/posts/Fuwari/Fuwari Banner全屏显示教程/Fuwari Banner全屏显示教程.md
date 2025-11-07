---
title: Fuwari Banner 全屏显示教程
published: 2025-11-06
tags:
  - Fuwari
  - Astro
  - 教程
  - CSS
category: Fuwari
description: 详细讲解如何在 Fuwari 博客中实现 banner 图全屏显示，同时保持其他元素（导航栏、内容区域等）的布局位置不变。
draft: false
---

# Fuwari Banner 全屏显示教程

本教程将详细讲解如何在 Fuwari 博客中实现 banner 图全屏显示（100vh），同时保持其他元素（导航栏、主内容区域等）的布局位置不变。这是一个常见的需求，可以让 banner 图作为全屏背景，而页面内容仍然按照原来的布局逻辑显示。

## 📋 目录

- [问题背景](#问题背景)
- [解决方案思路](#解决方案思路)
- [步骤一：修改常量定义](#步骤一修改常量定义)
- [步骤二：修改 Banner 容器](#步骤二修改-banner-容器)
- [步骤三：修改主内容区域定位](#步骤三修改主内容区域定位)
- [步骤四：修改 CSS 样式](#步骤四修改-css-样式)
- [步骤五：修改 JavaScript 滚动逻辑](#步骤五修改-javascript-滚动逻辑)
- [实现效果](#实现效果)
- [技术原理](#技术原理)
- [常见问题](#常见问题)
- [总结](#总结)

---

## 问题背景

在 Fuwari 博客中，banner 图的默认高度是：
- 普通页面：35vh
- 首页：65vh（35vh + 30vh 扩展）

如果我们直接将 banner 高度改为 100vh，会导致：
- 主内容区域被推到屏幕底部
- 导航栏位置发生变化
- 整体布局被破坏

**需求**：让 banner 图全屏显示（100vh），但其他元素保持原来的布局位置。

---

## 解决方案思路

核心思路是**分离视觉显示高度和布局计算高度**：

1. **视觉显示高度**：用于控制 banner 的实际显示高度（100vh，全屏）
2. **布局计算高度**：用于计算其他元素的位置（保持原来的 35vh/65vh）

这样，banner 会全屏显示作为背景层，而其他元素的位置计算仍然使用原来的值，布局保持不变。

---

## 步骤一：修改常量定义

首先，我们需要在 `src/constants/constants.ts` 文件中添加用于布局计算的常量。

### 1.1 打开常量文件

打开 `src/constants/constants.ts` 文件。

### 1.2 修改常量定义

**修改前**（原始代码）：

```typescript
// Banner height unit: vh
export const BANNER_HEIGHT = 35;
export const BANNER_HEIGHT_EXTEND = 30;
export const BANNER_HEIGHT_HOME = BANNER_HEIGHT + BANNER_HEIGHT_EXTEND;
```

**修改后**（全屏显示）：

```typescript
// Banner height unit: vh
// 视觉显示高度（全屏）
export const BANNER_HEIGHT = 100; // 全屏显示
export const BANNER_HEIGHT_EXTEND = 0; // 全屏时不需要扩展
export const BANNER_HEIGHT_HOME = 100; // 全屏显示

// 用于布局计算的高度（保持原来的值，让内容位置不变）
export const BANNER_HEIGHT_FOR_LAYOUT = 35;
export const BANNER_HEIGHT_EXTEND_FOR_LAYOUT = 30;
export const BANNER_HEIGHT_HOME_FOR_LAYOUT = BANNER_HEIGHT_FOR_LAYOUT + BANNER_HEIGHT_EXTEND_FOR_LAYOUT;
```

**说明**：
- `BANNER_HEIGHT` 等用于控制 banner 的视觉显示（全屏）
- `BANNER_HEIGHT_FOR_LAYOUT` 等用于计算其他元素的位置（保持原值）

---

## 步骤二：修改 Banner 容器

接下来，我们需要修改 banner 容器的定位方式，使其全屏显示。

### 2.1 打开布局文件

打开 `src/layouts/MainGridLayout.astro` 文件。

### 2.2 导入布局常量

**修改前**（原始导入）：

```typescript
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_EXTEND,
	MAIN_PANEL_OVERLAPS_BANNER_HEIGHT,
} from "../constants/constants";
```

**修改后**（添加布局常量）：

```typescript
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_EXTEND,
	BANNER_HEIGHT_FOR_LAYOUT,
	MAIN_PANEL_OVERLAPS_BANNER_HEIGHT,
} from "../constants/constants";
```

### 2.3 修改 Banner 容器

**修改前**（原始代码）：

```astro
<!-- Banner -->
{siteConfig.banner.enable && <div id="banner-wrapper" class={`absolute z-10 w-full transition duration-700 overflow-hidden`} style={`top: -${BANNER_HEIGHT_EXTEND}vh`}>
    <ImageWrapper id="banner" alt="Banner image of the blog" class:list={["object-cover h-full transition duration-700 opacity-0 scale-105"]}
                  src={siteConfig.banner.src} position={siteConfig.banner.position}
    >
    </ImageWrapper>
</div>}
```

**修改后**（全屏显示）：

```astro
<!-- Banner -->
{siteConfig.banner.enable && <div id="banner-wrapper" class={`fixed z-10 w-full h-screen transition duration-700 overflow-hidden`} style={`top: 0; left: 0;`}>
    <ImageWrapper id="banner" alt="Banner image of the blog" class:list={["object-cover w-full h-full transition duration-700 opacity-0 scale-105"]}
                  src={siteConfig.banner.src} position={siteConfig.banner.position}
    >
    </ImageWrapper>
</div>}
```

**关键修改点**：
1. `absolute` → `fixed`：使 banner 固定在视口中，不随页面滚动
2. 添加 `h-screen`：全屏高度（100vh）
3. 添加 `w-full` 到图片：确保图片宽度填满容器
4. `h-full` → `h-full`（保持不变）：图片高度填满容器
5. `top: -${BANNER_HEIGHT_EXTEND}vh` → `top: 0; left: 0;`：从视口左上角开始

---

## 步骤三：修改主内容区域定位

主内容区域需要使用布局常量来计算位置，而不是视觉高度。

### 3.1 修改主内容区域计算

**修改前**（原始代码）：

```typescript
const mainPanelTop = siteConfig.banner.enable
	? `calc(${BANNER_HEIGHT}vh - ${MAIN_PANEL_OVERLAPS_BANNER_HEIGHT}rem)`
	: "5.5rem";
```

**修改后**（使用布局常量）：

```typescript
const mainPanelTop = siteConfig.banner.enable
	? `calc(${BANNER_HEIGHT_FOR_LAYOUT}vh - ${MAIN_PANEL_OVERLAPS_BANNER_HEIGHT}rem)`
	: "5.5rem";
```

**说明**：
- 将 `BANNER_HEIGHT` 改为 `BANNER_HEIGHT_FOR_LAYOUT`
- 这样主内容区域会使用 35vh 来计算位置，而不是 100vh
- 主内容区域会保持在原来的位置（`calc(35vh - 3.5rem)`）

---

## 步骤四：修改 CSS 样式

接下来，我们需要修改 `src/layouts/Layout.astro` 中的 CSS 样式。

### 4.1 导入布局常量

**修改前**（原始导入）：

```typescript
import {
	AUTO_MODE,
	BANNER_HEIGHT,
	BANNER_HEIGHT_EXTEND,
	BANNER_HEIGHT_HOME,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
	PAGE_WIDTH,
} from "../constants/constants";
```

**修改后**（添加布局常量）：

```typescript
import {
	AUTO_MODE,
	BANNER_HEIGHT,
	BANNER_HEIGHT_EXTEND,
	BANNER_HEIGHT_HOME,
	BANNER_HEIGHT_FOR_LAYOUT,
	BANNER_HEIGHT_EXTEND_FOR_LAYOUT,
	BANNER_HEIGHT_HOME_FOR_LAYOUT,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
	PAGE_WIDTH,
} from "../constants/constants";
```

### 4.2 添加 CSS 变量

**修改前**（原始 CSS 变量）：

```astro
<style is:global define:vars={{
	bannerOffset,
	'banner-height-home': `${BANNER_HEIGHT_HOME}vh`,
	'banner-height': `${BANNER_HEIGHT}vh`,
}}>
```

**修改后**（添加布局变量）：

```astro
<style is:global define:vars={{
	bannerOffset,
	'banner-height-home': `${BANNER_HEIGHT_HOME}vh`,
	'banner-height': `${BANNER_HEIGHT}vh`,
	'banner-height-for-layout': `${BANNER_HEIGHT_FOR_LAYOUT}vh`,
	'banner-height-extend-for-layout': `${BANNER_HEIGHT_EXTEND_FOR_LAYOUT}vh`,
	'banner-height-home-for-layout': `${BANNER_HEIGHT_HOME_FOR_LAYOUT}vh`,
}}>
```

### 4.3 修改 Banner 相关样式

**修改前**（原始样式）：

```css
.enable-banner.is-home #banner-wrapper {
	@apply h-[var(--banner-height-home)] translate-y-[var(--banner-height-extend)]
}
.enable-banner #banner-wrapper {
	@apply h-[var(--banner-height-home)]
}

.enable-banner.is-home #banner {
	@apply h-[var(--banner-height-home)] translate-y-0
}
.enable-banner #banner {
	@apply h-[var(--banner-height-home)] translate-y-[var(--bannerOffset)]
}
```

**修改后**（全屏显示）：

```css
.enable-banner.is-home #banner-wrapper {
	@apply h-screen translate-y-0
}
.enable-banner #banner-wrapper {
	@apply h-screen
}

.enable-banner.is-home #banner {
	@apply h-full translate-y-0
}
.enable-banner #banner {
	@apply h-full translate-y-0
}
```

**关键修改点**：
1. `h-[var(--banner-height-home)]` → `h-screen`：使用全屏高度
2. `translate-y-[var(--banner-height-extend)]` → `translate-y-0`：不需要垂直偏移
3. `translate-y-[var(--bannerOffset)]` → `translate-y-0`：不需要根据位置偏移

### 4.4 修改其他元素样式

**修改前**（原始样式）：

```css
.enable-banner.is-home #main-grid {
	@apply translate-y-[var(--banner-height-extend)];
}
.enable-banner #top-row {
	@apply h-[calc(var(--banner-height-home)_-_4.5rem)] transition-all duration-300
}
.enable-banner.is-home #sidebar-sticky {
	@apply top-[calc(1rem_-_var(--banner-height-extend))]
}
```

**修改后**（使用布局变量）：

```css
.enable-banner.is-home #main-grid {
	@apply translate-y-[var(--banner-height-extend-for-layout)];
}
.enable-banner #top-row {
	@apply h-[calc(var(--banner-height-home-for-layout)_-_4.5rem)] transition-all duration-300
}
.enable-banner.is-home #sidebar-sticky {
	@apply top-[calc(1rem_-_var(--banner-height-extend-for-layout))]
}
```

**关键修改点**：
- 所有布局相关的 CSS 变量都改为使用 `-for-layout` 后缀的变量
- 这样这些元素会使用原来的高度值（35vh/65vh）来计算位置

---

## 步骤五：修改 JavaScript 滚动逻辑

最后，我们需要修改 JavaScript 中的滚动阈值计算，使其也使用布局常量。

### 5.1 导入布局常量

**修改前**（原始导入）：

```typescript
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_HOME,
	BANNER_HEIGHT_EXTEND,
	MAIN_PANEL_OVERLAPS_BANNER_HEIGHT
} from "../constants/constants";
```

**修改后**（添加布局常量）：

```typescript
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_HOME,
	BANNER_HEIGHT_EXTEND,
	BANNER_HEIGHT_FOR_LAYOUT,
	BANNER_HEIGHT_EXTEND_FOR_LAYOUT,
	BANNER_HEIGHT_HOME_FOR_LAYOUT,
	MAIN_PANEL_OVERLAPS_BANNER_HEIGHT
} from "../constants/constants";
```

### 5.2 修改滚动函数

**修改前**（原始代码）：

```typescript
function scrollFunction() {
	let bannerHeight = window.innerHeight * (BANNER_HEIGHT / 100)
	
	if (backToTopBtn) {
		if (document.body.scrollTop > bannerHeight || document.documentElement.scrollTop > bannerHeight) {
			backToTopBtn.classList.remove('hide')
		} else {
			backToTopBtn.classList.add('hide')
		}
	}

	if (bannerEnabled && toc) {
		if (document.body.scrollTop > bannerHeight || document.documentElement.scrollTop > bannerHeight) {
			toc.classList.remove('toc-hide')
		} else {
			toc.classList.add('toc-hide')
		}
	}
	// ... 其他代码
}
```

**修改后**（使用布局常量）：

```typescript
function scrollFunction() {
	let bannerHeight = window.innerHeight * (BANNER_HEIGHT_FOR_LAYOUT / 100)
	
	if (backToTopBtn) {
		if (document.body.scrollTop > bannerHeight || document.documentElement.scrollTop > bannerHeight) {
			backToTopBtn.classList.remove('hide')
		} else {
			backToTopBtn.classList.add('hide')
		}
	}

	if (bannerEnabled && toc) {
		if (document.body.scrollTop > bannerHeight || document.documentElement.scrollTop > bannerHeight) {
			toc.classList.remove('toc-hide')
		} else {
			toc.classList.add('toc-hide')
		}
	}
	// ... 其他代码
}
```

**关键修改点**：
- `BANNER_HEIGHT` → `BANNER_HEIGHT_FOR_LAYOUT`：使用布局常量计算滚动阈值

### 5.3 修改导航栏隐藏逻辑

**修改前**（原始代码）：

```typescript
if (!bannerEnabled) return
if (navbar) {
	const NAVBAR_HEIGHT = 72
	const MAIN_PANEL_EXCESS_HEIGHT = MAIN_PANEL_OVERLAPS_BANNER_HEIGHT * 16

	let bannerHeight = BANNER_HEIGHT
	if (document.body.classList.contains('lg:is-home') && window.innerWidth >= 1024) {
		bannerHeight = BANNER_HEIGHT_HOME
	}
	let threshold = window.innerHeight * (bannerHeight / 100) - NAVBAR_HEIGHT - MAIN_PANEL_EXCESS_HEIGHT - 16
	if (document.body.scrollTop >= threshold || document.documentElement.scrollTop >= threshold) {
		navbar.classList.add('navbar-hidden')
	} else {
		navbar.classList.remove('navbar-hidden')
	}
}
```

**修改后**（使用布局常量）：

```typescript
if (!bannerEnabled) return
if (navbar) {
	const NAVBAR_HEIGHT = 72
	const MAIN_PANEL_EXCESS_HEIGHT = MAIN_PANEL_OVERLAPS_BANNER_HEIGHT * 16

	let bannerHeight = BANNER_HEIGHT_FOR_LAYOUT
	if (document.body.classList.contains('lg:is-home') && window.innerWidth >= 1024) {
		bannerHeight = BANNER_HEIGHT_HOME_FOR_LAYOUT
	}
	let threshold = window.innerHeight * (bannerHeight / 100) - NAVBAR_HEIGHT - MAIN_PANEL_EXCESS_HEIGHT - 16
	if (document.body.scrollTop >= threshold || document.documentElement.scrollTop >= threshold) {
		navbar.classList.add('navbar-hidden')
	} else {
		navbar.classList.remove('navbar-hidden')
	}
}
```

**关键修改点**：
- `BANNER_HEIGHT` → `BANNER_HEIGHT_FOR_LAYOUT`
- `BANNER_HEIGHT_HOME` → `BANNER_HEIGHT_HOME_FOR_LAYOUT`
- 使用布局常量计算导航栏隐藏的阈值，确保滚动行为正常

---

## 实现效果

完成以上步骤后，您将获得以下效果：

1. ✅ **Banner 全屏显示**：Banner 图占据整个视口高度（100vh），作为背景层
2. ✅ **布局保持不变**：导航栏、主内容区域等元素保持在原来的位置
3. ✅ **滚动行为正常**：滚动时，导航栏隐藏、返回顶部按钮等交互正常工作
4. ✅ **响应式兼容**：在不同屏幕尺寸下都能正常显示

---

## 技术原理

### 为什么需要分离视觉高度和布局高度？

1. **视觉高度**（100vh）：
   - 控制 banner 的实际显示大小
   - 使用 `fixed` 定位，固定在视口中
   - 作为背景层，不影响文档流

2. **布局高度**（35vh/65vh）：
   - 用于计算其他元素的位置
   - 保持原来的布局逻辑
   - 确保内容区域、导航栏等元素位置不变

### Fixed vs Absolute 定位

- **Fixed 定位**：
  - 相对于视口定位
  - 不占据文档流空间
  - 滚动时保持在视口中的固定位置
  - 适合全屏背景

- **Absolute 定位**：
  - 相对于最近的定位父元素
  - 占据文档流空间（会影响其他元素）
  - 适合需要参与布局的元素

### Z-index 层级

- `z-index: 10`：Banner 背景层
- `z-index: 30`：主内容区域（在 banner 上方）
- `z-index: 50`：导航栏（在最上层）

---

## 常见问题

### Q1: Banner 图片显示不完整怎么办？

**A**: 检查图片的 `object-cover` 类是否正确应用，确保图片能够填满容器。如果图片比例不合适，可以调整 `position` 属性（top/center/bottom）。

### Q2: 主内容区域被 banner 遮挡了怎么办？

**A**: 确保主内容区域的 `z-index` 高于 banner（banner 是 10，主内容应该是 30）。

### Q3: 滚动时 banner 也跟着滚动怎么办？

**A**: 确保 banner 使用 `fixed` 定位而不是 `absolute` 定位。

### Q4: 导航栏位置不对怎么办？

**A**: 检查 `#top-row` 的高度计算是否使用了 `--banner-height-home-for-layout` 变量。

### Q5: 如何恢复原来的 banner 高度？

**A**: 将 `BANNER_HEIGHT` 改回 `35`，`BANNER_HEIGHT_EXTEND` 改回 `30`，并将 banner 容器改回 `absolute` 定位。

---

## 完整代码示例

### constants.ts

```typescript
// Banner height unit: vh
// 视觉显示高度（全屏）
export const BANNER_HEIGHT = 100; // 全屏显示
export const BANNER_HEIGHT_EXTEND = 0; // 全屏时不需要扩展
export const BANNER_HEIGHT_HOME = 100; // 全屏显示

// 用于布局计算的高度（保持原来的值，让内容位置不变）
export const BANNER_HEIGHT_FOR_LAYOUT = 35;
export const BANNER_HEIGHT_EXTEND_FOR_LAYOUT = 30;
export const BANNER_HEIGHT_HOME_FOR_LAYOUT = BANNER_HEIGHT_FOR_LAYOUT + BANNER_HEIGHT_EXTEND_FOR_LAYOUT;
```

### MainGridLayout.astro（关键部分）

```astro
<!-- Banner -->
{siteConfig.banner.enable && <div id="banner-wrapper" class={`fixed z-10 w-full h-screen transition duration-700 overflow-hidden`} style={`top: 0; left: 0;`}>
    <ImageWrapper id="banner" alt="Banner image of the blog" class:list={["object-cover w-full h-full transition duration-700 opacity-0 scale-105"]}
                  src={siteConfig.banner.src} position={siteConfig.banner.position}
    >
    </ImageWrapper>
</div>}

<!-- Main content -->
<div class="absolute w-full z-30 pointer-events-none" style={`top: ${mainPanelTop}`}>
    <!-- 主内容 -->
</div>
```

### Layout.astro（CSS 部分）

```css
.enable-banner.is-home #banner-wrapper {
	@apply h-screen translate-y-0
}
.enable-banner #banner-wrapper {
	@apply h-screen
}

.enable-banner.is-home #banner {
	@apply h-full translate-y-0
}
.enable-banner #banner {
	@apply h-full translate-y-0
}

.enable-banner.is-home #main-grid {
	@apply translate-y-[var(--banner-height-extend-for-layout)];
}
.enable-banner #top-row {
	@apply h-[calc(var(--banner-height-home-for-layout)_-_4.5rem)] transition-all duration-300
}
```

---

## 总结

通过分离视觉显示高度和布局计算高度，我们成功实现了 banner 全屏显示，同时保持了其他元素的布局位置不变。这种方法的核心是：

1. ✅ 使用 `fixed` 定位让 banner 全屏显示
2. ✅ 使用布局常量计算其他元素的位置
3. ✅ 通过 CSS 变量和 JavaScript 统一管理布局逻辑

这种方法既满足了视觉需求，又保持了布局的稳定性，是一个优雅的解决方案。

---

**相关文章**：
- [Fuwari 添加友链页面详细教程](/posts/fuwari/fuwari添加友链页面/fuwari添加友链页面/)
- [Fuwari 文章内跳转方法与注意事项](/posts/fuwari/fuwari文章内跳转方法与注意事项/fuwari文章内跳转方法与注意事项/)

---

**最后更新**：2025年1月15日

