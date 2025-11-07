---
title: Fuwari 博客添加全局全屏背景图片详细教程
published: 2025-11-07
tags:
  - Fuwari
  - Astro
  - 教程
  - CSS
category: Fuwari
image: https://cdn.mengze.vip/gh/Skarie/hexoimg/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91AMGGT-%E6%A2%85%E8%B5%9B%E5%BE%B7%E6%96%AF.png
description: 详细讲解如何在基于 Astro 的 Fuwari 博客主题中添加全局全屏背景图片，让背景图片在所有页面显示，同时保持内容清晰可读。
draft: false
---

# Fuwari 博客添加全局全屏背景图片详细教程

本教程将详细讲解如何在 Fuwari 博客中添加全局全屏背景图片。背景图片将在所有页面（首页、文章页、友链页等）全局显示，并且不会影响页面的正常功能和内容可读性。

## 📋 目录

- [准备工作](#准备工作)
- [步骤一：准备背景图片](#步骤一准备背景图片)
- [步骤二：修改全局布局文件](#步骤二修改全局布局文件)
- [步骤三：调整遮罩层透明度（可选）](#步骤三调整遮罩层透明度可选)
- [实现效果](#实现效果)
- [技术原理](#技术原理)
- [常见问题](#常见问题)
- [总结](#总结)

---

## 准备工作

在开始之前，请确保您已经：

1. ✅ 安装了 Fuwari 博客主题
2. ✅ 准备好背景图片文件
3. ✅ 了解基本的文件操作
4. ✅ 了解 Astro 项目结构

---

## 步骤一：准备背景图片

首先，您需要准备一张背景图片。建议使用以下规格：

- **推荐尺寸**：1920x1080 或更高分辨率
- **文件格式**：PNG、JPG、WebP 等常见格式
- **文件大小**：建议控制在 500KB 以内，以保证加载速度

### 1.1 放置背景图片

将背景图片放到 `src/assets/images/` 目录下，例如：

```
src/
└── assets/
    └── images/
        └── background.png  (您的背景图片)
```

**注意**：如果您的图片文件名不同，请记住文件名，后续步骤中需要使用。

---

## 步骤二：修改全局布局文件

全局背景图片需要在 `Layout.astro` 文件中添加，这是所有页面的基础布局文件。

### 2.1 打开布局文件

找到并打开 `src/layouts/Layout.astro` 文件。

### 2.2 导入必要的模块和图片

在文件顶部的导入区域，添加以下导入语句：

**修改前**：

```astro
---
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import ConfigCarrier from "@components/ConfigCarrier.astro";
import { profileConfig, siteConfig } from "@/config";
// ... 其他导入
---
```

**修改后**：

```astro
---
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { Image } from "astro:assets";
import ConfigCarrier from "@components/ConfigCarrier.astro";
import { profileConfig, siteConfig } from "@/config";
// ... 其他导入
import backgroundImage from "../assets/images/background.png";
---
```

**关键修改点**：
1. 添加 `import { Image } from "astro:assets";` - 用于导入图片
2. 添加 `import backgroundImage from "../assets/images/background.png";` - 导入您的背景图片
   - 请将 `background.png` 替换为您实际的图片文件名

### 2.3 添加背景图片容器

在 `<body>` 标签内，添加背景图片容器。找到 `<body>` 标签，在 `<ConfigCarrier></ConfigCarrier>` 之前添加：

**修改前**：

```astro
<body class=" min-h-screen transition " class:list={[{"lg:is-home": isHomePage, "enable-banner": enableBanner}]}
	  data-overlayscrollbars-initialize
>
	<ConfigCarrier></ConfigCarrier>
	<slot />
```

**修改后**：

```astro
<body class=" min-h-screen transition " class:list={[{"lg:is-home": isHomePage, "enable-banner": enableBanner}]}
	  data-overlayscrollbars-initialize
>
	<!-- 全局全屏背景图片 -->
	<div class="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
		<Image
			src={backgroundImage}
			alt="Background"
			class="w-full h-full object-cover"
			loading="eager"
		/>
		<div class="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
	</div>
	
	<ConfigCarrier></ConfigCarrier>
	<slot />
```

**代码说明**：

1. **外层容器** (`<div class="fixed inset-0 z-0...">`)：
   - `fixed`：固定定位，背景图片不随页面滚动
   - `inset-0`：覆盖整个视口（top: 0, right: 0, bottom: 0, left: 0）
   - `z-0`：z-index 为 0，确保在所有内容下方
   - `pointer-events-none`：不阻挡鼠标事件，确保页面交互正常

2. **图片组件** (`<Image>`):
   - `src={backgroundImage}`：使用导入的背景图片
   - `class="w-full h-full object-cover"`：图片填满容器，保持比例
   - `loading="eager"`：立即加载，避免闪烁

3. **遮罩层** (`<div class="absolute inset-0 bg-black/30...">`)：
   - `bg-black/30`：浅色模式下 30% 黑色遮罩
   - `dark:bg-black/50`：深色模式下 50% 黑色遮罩
   - 提高文字可读性

---

## 步骤三：调整遮罩层透明度（可选）

如果您觉得遮罩层太暗或太亮，可以调整透明度。

### 3.1 调整浅色模式遮罩

修改 `bg-black/30` 中的数字：
- `bg-black/10`：10% 透明度（更亮）
- `bg-black/20`：20% 透明度
- `bg-black/30`：30% 透明度（默认）
- `bg-black/40`：40% 透明度（更暗）

### 3.2 调整深色模式遮罩

修改 `dark:bg-black/50` 中的数字：
- `dark:bg-black/30`：30% 透明度（更亮）
- `dark:bg-black/40`：40% 透明度
- `dark:bg-black/50`：50% 透明度（默认）
- `dark:bg-black/60`：60% 透明度（更暗）

### 3.3 完全移除遮罩层

如果您不需要遮罩层，可以删除这一行：

```astro
<div class="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
```

---

## 实现效果

完成以上步骤后，您将获得以下效果：

- ✅ **全局显示**：背景图片在所有页面显示
- ✅ **全屏覆盖**：图片覆盖整个浏览器窗口
- ✅ **固定定位**：背景图片不随页面滚动
- ✅ **响应式**：自动适配不同屏幕尺寸
- ✅ **内容清晰**：半透明遮罩确保文字可读
- ✅ **不影响交互**：所有按钮和链接正常工作

---

## 技术原理

### 为什么使用 `fixed` 定位？

`fixed` 定位相对于视口（viewport）定位，而不是相对于文档流。这意味着：
- 背景图片始终固定在屏幕位置
- 不会随页面滚动而移动
- 覆盖整个浏览器窗口

### 为什么使用 `z-0`？

z-index 层级关系：
- `z-0`：背景图片（最底层）
- `z-10`：Banner 图片
- `z-30`：主内容区域
- `z-50`：导航栏

通过设置 `z-0`，确保背景图片在所有内容下方。

### 为什么使用 `pointer-events-none`？

`pointer-events-none` 使元素不响应鼠标事件：
- 背景图片不会阻挡点击事件
- 用户可以正常点击页面上的所有元素
- 不影响页面交互功能

### 为什么需要遮罩层？

遮罩层的作用：
- **提高对比度**：深色文字在浅色背景上更清晰
- **统一风格**：让背景图片与页面内容更协调
- **可读性**：确保文字在任何背景下都清晰可读

---

## 常见问题

### Q1: 背景图片不显示怎么办？

**A:** 请检查以下几点：

1. **路径是否正确**：确认图片文件确实存在于 `src/assets/images/` 目录
2. **文件名是否匹配**：检查导入语句中的文件名是否与实际文件名一致（注意大小写）
3. **文件格式是否支持**：确保使用 PNG、JPG、WebP 等常见格式
4. **查看控制台**：浏览器开发者工具的控制台会显示错误信息

### Q2: 背景图片显示但内容看不清怎么办？

**A:** 可以尝试以下方法：

1. **增加遮罩层透明度**：将 `bg-black/30` 改为 `bg-black/40` 或更高
2. **调整图片亮度**：使用图片编辑软件降低图片亮度
3. **更换背景图片**：选择对比度较低的图片

### Q3: 如何让背景图片随页面滚动？

**A:** 将 `fixed` 改为 `absolute`：

```astro
<div class="absolute inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
```

**注意**：改为 `absolute` 后，背景图片会随页面滚动，可能不是您想要的效果。

### Q4: 如何只在特定页面显示背景图片？

**A:** 有几种方法：

**方法一：使用条件判断**

在 `Layout.astro` 中添加条件：

```astro
---
// 判断是否为特定页面
const showBackground = Astro.url.pathname.startsWith('/links/');
---

{showBackground && (
	<div class="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
		<Image
			src={backgroundImage}
			alt="Background"
			class="w-full h-full object-cover"
			loading="eager"
		/>
		<div class="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
	</div>
)}
```

**方法二：在特定页面添加**

直接在特定页面的 `.astro` 文件中添加背景图片，而不是在 `Layout.astro` 中。

### Q5: 背景图片加载慢怎么办？

**A:** 可以尝试以下优化：

1. **压缩图片**：使用图片压缩工具减小文件大小
2. **使用 WebP 格式**：WebP 格式通常比 PNG/JPG 更小
3. **使用 CDN**：将图片放到 CDN 上加速加载
4. **懒加载**：将 `loading="eager"` 改为 `loading="lazy"`（不推荐，可能导致闪烁）

### Q6: 如何更换背景图片？

**A:** 只需两步：

1. **替换图片文件**：将新图片放到 `src/assets/images/` 目录
2. **更新导入语句**：修改 `Layout.astro` 中的导入路径

```astro
import backgroundImage from "../assets/images/new-background.png";
```

### Q7: 背景图片和 Banner 图片冲突怎么办？

**A:** 如果启用了 Banner，背景图片会在 Banner 下方。如果需要：

1. **禁用 Banner**：在 `src/config.ts` 中设置 `banner.enable: false`
2. **调整 z-index**：确保背景图片的 z-index 低于 Banner

### Q8: 移动端显示效果不好怎么办？

**A:** 可以添加响应式样式：

```astro
<div class="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
	<Image
		src={backgroundImage}
		alt="Background"
		class="w-full h-full object-cover md:object-contain"
		loading="eager"
	/>
	<div class="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
</div>
```

---

## 完整代码示例

### Layout.astro（完整代码）

以下是添加了全局全屏背景图片后的完整 `Layout.astro` 文件代码：

```astro
---
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

// ⭐ 关键修改点 1：导入 Image 组件
import { Image } from "astro:assets";
import ConfigCarrier from "@components/ConfigCarrier.astro";
import { profileConfig, siteConfig } from "@/config";
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
import { defaultFavicons } from "../constants/icon";
import type { Favicon } from "../types/config";
import { pathsEqual, url } from "../utils/url-utils";
import "katex/dist/katex.css";
// ⭐ 关键修改点 2：导入背景图片（请将 1.png 替换为您的图片文件名）
import backgroundImage from "../assets/images/1.png";

interface Props {
	title?: string;
	banner?: string;
	description?: string;
	lang?: string;
	setOGTypeArticle?: boolean;
}

let { title, banner, description, lang, setOGTypeArticle } = Astro.props;

// apply a class to the body element to decide the height of the banner, only used for initial page load
// Swup can update the body for each page visit, but it's after the page transition, causing a delay for banner height change
// so use Swup hooks instead to change the height immediately when a link is clicked
const isHomePage = pathsEqual(Astro.url.pathname, url("/"));

// defines global css variables
// why doing this in Layout instead of GlobalStyles: https://github.com/withastro/astro/issues/6728#issuecomment-1502203757
const configHue = siteConfig.themeColor.hue;
if (!banner || typeof banner !== "string" || banner.trim() === "") {
	banner = siteConfig.banner.src;
}

// TODO don't use post cover as banner for now
banner = siteConfig.banner.src;

const enableBanner = siteConfig.banner.enable;

let pageTitle: string;
if (title) {
	pageTitle = `${title} - ${siteConfig.title}`;
} else {
	pageTitle = `${siteConfig.title} - ${siteConfig.subtitle}`;
}

const favicons: Favicon[] =
	siteConfig.favicon.length > 0 ? siteConfig.favicon : defaultFavicons;

// const siteLang = siteConfig.lang.replace('_', '-')
if (!lang) {
	lang = `${siteConfig.lang}`;
}
const siteLang = lang.replace("_", "-");

const bannerOffsetByPosition = {
	top: `${BANNER_HEIGHT_EXTEND}vh`,
	center: `${BANNER_HEIGHT_EXTEND / 2}vh`,
	bottom: "0",
};
const bannerOffset =
	bannerOffsetByPosition[siteConfig.banner.position || "center"];
---

<!DOCTYPE html>
<html lang={siteLang} class="bg-[var(--page-bg)] transition text-[14px] md:text-[16px]"
	  data-overlayscrollbars-initialize
>
	<head>

		<title>{pageTitle}</title>

		<meta charset="UTF-8" />
		<meta name="description" content={description || pageTitle}>
		<meta name="author" content={profileConfig.name}>

		<meta property="og:site_name" content={siteConfig.title}>
		<meta property="og:url" content={Astro.url}>
		<meta property="og:title" content={pageTitle}>
		<meta property="og:description" content={description || pageTitle}>
		{setOGTypeArticle ? (
        <meta property="og:type" content="article" />
        ) : (
        <meta property="og:type" content="website" />
        )}

		<meta name="twitter:card" content="summary_large_image">
		<meta property="twitter:url" content={Astro.url}>
		<meta name="twitter:title" content={pageTitle}>
		<meta name="twitter:description" content={description || pageTitle}>

		<meta name="viewport" content="width=device-width" />
		<meta name="generator" content={Astro.generator} />
		{favicons.map(favicon => (
			<link rel="icon"
				  href={favicon.src.startsWith('/') ? url(favicon.src) : favicon.src}
				  sizes={favicon.sizes}
				  media={favicon.theme && `(prefers-color-scheme: ${favicon.theme})`}
			/>
		))}

		<!-- Set the theme before the page is rendered to avoid a flash -->
		<script is:inline define:vars={{DEFAULT_THEME, LIGHT_MODE, DARK_MODE, AUTO_MODE, BANNER_HEIGHT_EXTEND, PAGE_WIDTH, configHue}}>
			// Load the theme from local storage
			const theme = localStorage.getItem('theme') || DEFAULT_THEME;
			switch (theme) {
				case LIGHT_MODE:
					document.documentElement.classList.remove('dark');
					break
				case DARK_MODE:
					document.documentElement.classList.add('dark');
					break
				case AUTO_MODE:
					if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
						document.documentElement.classList.add('dark');
					} else {
						document.documentElement.classList.remove('dark');
					}
			}

			// Load the hue from local storage
			const hue = localStorage.getItem('hue') || configHue;
			document.documentElement.style.setProperty('--hue', hue);

			// calculate the --banner-height-extend, which needs to be a multiple of 4 to avoid blurry text
			let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
			offset = offset - offset % 4;
			document.documentElement.style.setProperty('--banner-height-extend', `${offset}px`);
		</script>
		<style define:vars={{
			configHue,
			'page-width': `${PAGE_WIDTH}rem`,
		}}></style>  <!-- defines global css variables. This will be applied to <html> <body> and some other elements idk why -->


		<slot name="head"></slot>

		<link rel="alternate" type="application/rss+xml" title={profileConfig.name} href={`${Astro.site}rss.xml`}/>

	</head>
	<body class=" min-h-screen transition " class:list={[{"lg:is-home": isHomePage, "enable-banner": enableBanner}]}
		  data-overlayscrollbars-initialize
	>
		<!-- ⭐ 关键修改点 3：全局全屏背景图片 -->
		<div class="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none">
			<Image
				src={backgroundImage}
				alt="Background"
				class="w-full h-full object-cover"
				loading="eager"
			/>
			<div class="absolute inset-0 bg-black/30 dark:bg-black/50"></div>
		</div>
		
		<ConfigCarrier></ConfigCarrier>
		<slot />

		<!-- increase the page height during page transition to prevent the scrolling animation from jumping -->
		<div id="page-height-extend" class="hidden h-[300vh]"></div>
	</body>
</html>

<style is:global define:vars={{
	bannerOffset,
	'banner-height-home': `${BANNER_HEIGHT_HOME}vh`,
	'banner-height': `${BANNER_HEIGHT}vh`,
}}>
@tailwind components;
@layer components {
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
	.enable-banner.is-home #main-grid {
		@apply translate-y-[var(--banner-height-extend)];
	}
	.enable-banner #top-row {
		@apply h-[calc(var(--banner-height-home)_-_4.5rem)] transition-all duration-300
	}
	.enable-banner.is-home #sidebar-sticky {
		@apply top-[calc(1rem_-_var(--banner-height-extend))]
	}
	.navbar-hidden {
		@apply opacity-0 -translate-y-16
	}
}
</style>

<script>
import 'overlayscrollbars/overlayscrollbars.css';
import {
	OverlayScrollbars,
	// ScrollbarsHidingPlugin,
	// SizeObserverPlugin,
	// ClickScrollPlugin
} from 'overlayscrollbars';
import {getHue, getStoredTheme, setHue, setTheme} from "../utils/setting-utils";
import {pathsEqual, url} from "../utils/url-utils";
import {
	BANNER_HEIGHT,
	BANNER_HEIGHT_HOME,
	BANNER_HEIGHT_EXTEND,
	MAIN_PANEL_OVERLAPS_BANNER_HEIGHT
} from "../constants/constants";
import { siteConfig } from '../config';

/* Preload fonts */
// (async function() {
// 	try {
// 		await Promise.all([
// 			document.fonts.load("400 1em Roboto"),
// 			document.fonts.load("700 1em Roboto"),
// 		]);
// 		document.body.classList.remove("hidden");
// 	} catch (error) {
// 		console.log("Failed to load fonts:", error);
// 	}
// })();

/* TODO This is a temporary solution for style flicker issue when the transition is activated */
/* issue link: https://github.com/withastro/astro/issues/8711, the solution get from here too */
/* update: fixed in Astro 3.2.4 */
/*
function disableAnimation() {
	const css = document.createElement('style')
	css.appendChild(
		document.createTextNode(
			`*{
              -webkit-transition:none!important;
              -moz-transition:none!important;
              -o-transition:none!important;
              -ms-transition:none!important;
              transition:none!important
              }`
		)
	)
	document.head.appendChild(css)

	return () => {
		// Force restyle
		;(() => window.getComputedStyle(document.body))()

		// Wait for next tick before removing
		setTimeout(() => {
			document.head.removeChild(css)
		}, 1)
	}
}
*/

const bannerEnabled = !!document.getElementById('banner-wrapper')

function setClickOutsideToClose(panel: string, ignores: string[]) {
	document.addEventListener("click", event => {
		let panelDom = document.getElementById(panel);
		let tDom = event.target;
		if (!(tDom instanceof Node)) return;		// Ensure the event target is an HTML Node
		for (let ig of ignores) {
			let ie = document.getElementById(ig)
			if (ie == tDom || (ie?.contains(tDom))) {
				return;
			}
		}
		panelDom!.classList.add("float-panel-closed");
	});
}
setClickOutsideToClose("display-setting", ["display-setting", "display-settings-switch"])
setClickOutsideToClose("nav-menu-panel", ["nav-menu-panel", "nav-menu-switch"])
setClickOutsideToClose("search-panel", ["search-panel", "search-bar", "search-switch"])


function loadTheme() {
	const theme = getStoredTheme()
	setTheme(theme)
}

function loadHue() {
	setHue(getHue())
}

function initCustomScrollbar() {
	const bodyElement = document.querySelector('body');
	if (!bodyElement) return;
	OverlayScrollbars(
		// docs say that a initialization to the body element would affect native functionality like window.scrollTo
		// but just leave it here for now
		{
			target: bodyElement,
			cancel: {
				nativeScrollbarsOverlaid: true,    // don't initialize the overlay scrollbar if there is a native one
			}
		}, {
		scrollbars: {
			theme: 'scrollbar-base scrollbar-auto py-1',
			autoHide: 'move',
			autoHideDelay: 500,
			autoHideSuspend: false,
		},
	});

	const katexElements = document.querySelectorAll('.katex-display') as NodeListOf<HTMLElement>;

	const katexObserverOptions = {
		root: null,
		rootMargin: '100px',
		threshold: 0.1
	};

	const processKatexElement = (element: HTMLElement) => {
		if (!element.parentNode) return;
		if (element.hasAttribute('data-scrollbar-initialized')) return;

		const container = document.createElement('div');
		container.className = 'katex-display-container';
		container.setAttribute('aria-label', 'scrollable container for formulas');

		element.parentNode.insertBefore(container, element);
		container.appendChild(element);

		OverlayScrollbars(container, {
			scrollbars: {
				theme: 'scrollbar-base scrollbar-auto',
				autoHide: 'leave',
				autoHideDelay: 500,
				autoHideSuspend: false
			}
		});

		element.setAttribute('data-scrollbar-initialized', 'true');
	};

	const katexObserver = new IntersectionObserver((entries, observer) => {
		entries.forEach(entry => {
			if (entry.isIntersecting) {
			processKatexElement(entry.target as HTMLElement);
			observer.unobserve(entry.target);
			}
		});
	}, katexObserverOptions);

	katexElements.forEach(element => {
		katexObserver.observe(element);
	});
}

function showBanner() {
	if (!siteConfig.banner.enable) return;

	const banner = document.getElementById('banner');
	if (!banner) {
		console.error('Banner element not found');
		return;
	}

	banner.classList.remove('opacity-0', 'scale-105');
}

function init() {
	// disableAnimation()()		// TODO
	loadTheme();
	loadHue();
	initCustomScrollbar();
	showBanner();
}

/* Load settings when entering the site */
init();

const setup = () => {
	// TODO: temp solution to change the height of the banner
/*
	window.swup.hooks.on('animation:out:start', () => {
		const path = window.location.pathname
		const body = document.querySelector('body')
		if (path[path.length - 1] === '/' && !body.classList.contains('is-home')) {
			body.classList.add('is-home')
		} else if (path[path.length - 1] !== '/' && body.classList.contains('is-home')) {
			body.classList.remove('is-home')
		}
	})
*/
	window.swup.hooks.on('link:click', () => {
		// Remove the delay for the first time page load
		document.documentElement.style.setProperty('--content-delay', '0ms')

		// prevent elements from overlapping the navbar
		if (!bannerEnabled) {
			return
		}
		let threshold = window.innerHeight * (BANNER_HEIGHT / 100) - 72 - 16
		let navbar = document.getElementById('navbar-wrapper')
		if (!navbar || !document.body.classList.contains('lg:is-home')) {
			return
		}
		if (document.body.scrollTop >= threshold || document.documentElement.scrollTop >= threshold) {
			navbar.classList.add('navbar-hidden')
		}
	})
	window.swup.hooks.on('content:replace', initCustomScrollbar)
	window.swup.hooks.on('visit:start', (visit: {to: {url: string}}) => {
		// change banner height immediately when a link is clicked
		const bodyElement = document.querySelector('body')
		if (pathsEqual(visit.to.url, url('/'))) {
			bodyElement!.classList.add('lg:is-home');
		} else {
			bodyElement!.classList.remove('lg:is-home');
		}

		// increase the page height during page transition to prevent the scrolling animation from jumping
		const heightExtend = document.getElementById('page-height-extend')
		if (heightExtend) {
			heightExtend.classList.remove('hidden')
		}

		// Hide the TOC while scrolling back to top
		let toc = document.getElementById('toc-wrapper');
		if (toc) {
			toc.classList.add('toc-not-ready')
		}
	});
	window.swup.hooks.on('page:view', () => {
		// hide the temp high element when the transition is done
		const heightExtend = document.getElementById('page-height-extend')
		if (heightExtend) {
			heightExtend.classList.remove('hidden')
		}
	});
	window.swup.hooks.on('visit:end', (_visit: {to: {url: string}}) => {
		setTimeout(() => {
			const heightExtend = document.getElementById('page-height-extend')
			if (heightExtend) {
				heightExtend.classList.add('hidden')
			}

            // Just make the transition looks better
            const toc = document.getElementById('toc-wrapper');
            if (toc) {
                toc.classList.remove('toc-not-ready')
            }
        }, 200)
	});
}
if (window?.swup?.hooks) {
	setup()
} else {
	document.addEventListener('swup:enable', setup)
}

let backToTopBtn = document.getElementById('back-to-top-btn');
let toc = document.getElementById('toc-wrapper');
let navbar = document.getElementById('navbar-wrapper')
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

	if (!bannerEnabled) return
	if (navbar) {
		const NAVBAR_HEIGHT = 72
		const MAIN_PANEL_EXCESS_HEIGHT = MAIN_PANEL_OVERLAPS_BANNER_HEIGHT * 16			// The height the main panel overlaps the banner

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
}
window.onscroll = scrollFunction

window.onresize = () => {
	// calculate the --banner-height-extend, which needs to be a multiple of 4 to avoid blurry text
	let offset = Math.floor(window.innerHeight * (BANNER_HEIGHT_EXTEND / 100));
	offset = offset - offset % 4;
	document.documentElement.style.setProperty('--banner-height-extend', `${offset}px`);
}

</script>

<script>
import PhotoSwipeLightbox from "photoswipe/lightbox"
import "photoswipe/style.css"

let lightbox: PhotoSwipeLightbox
let pswp = import("photoswipe")

function createPhotoSwipe() {
	lightbox = new PhotoSwipeLightbox({
		gallery: ".custom-md img, #post-cover img",
		pswpModule: () => pswp,
		closeSVG: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M480-424 284-228q-11 11-28 11t-28-11q-11-11-11-28t11-28l196-196-196-196q-11-11-11-28t11-28q11-11 28-11t28 11l196 196 196-196q11-11 28-11t28 11q11 11 11 28t-11 28L536-480l196 196q11 11 11 28t-11 28q-11 11-28 11t-28-11L480-424Z"/></svg>',
		zoomSVG: '<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#ffffff"><path d="M340-540h-40q-17 0-28.5-11.5T260-580q0-17 11.5-28.5T300-620h40v-40q0-17 11.5-28.5T380-700q17 0 28.5 11.5T420-660v40h40q17 0 28.5 11.5T500-580q0 17-11.5 28.5T460-540h-40v40q0 17-11.5 28.5T380-460q-17 0-28.5-11.5T340-500v-40Zm40 220q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l224 224q11 11 11 28t-11 28q-11 11-28 11t-28-11L532-372q-30 24-69 38t-83 14Zm0-80q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z"/></svg>',
		padding: { top: 20, bottom: 20, left: 20, right: 20 },
		wheelToZoom: true,
		arrowPrev: false,
		arrowNext: false,
		imageClickAction: 'close',
		tapAction: 'close',
		doubleTapAction: 'zoom',
	})

	lightbox.addFilter("domItemData", (itemData, element) => {
		if (element instanceof HTMLImageElement) {
			itemData.src = element.src

			itemData.w = Number(element.naturalWidth || window.innerWidth)
			itemData.h = Number(element.naturalHeight || window.innerHeight)

			itemData.msrc = element.src
		}

		return itemData
	})

	lightbox.init()
}

const setup = () => {
	if (!lightbox) {
		createPhotoSwipe()
	}
	window.swup.hooks.on("page:view", () => {
		createPhotoSwipe()
	})

	window.swup.hooks.on(
		"content:replace",
		() => {
			lightbox?.destroy?.()
		},
		{ before: true },
	)
}

if (window.swup) {
	setup()
} else {
	document.addEventListener("swup:enable", setup)
}
</script>
```

**关键修改点说明**：

1. **第 6 行**：添加 `import { Image } from "astro:assets";` - 导入 Astro 的 Image 组件
2. **第 23 行**：添加 `import backgroundImage from "../assets/images/1.png";` - 导入背景图片（请将 `1.png` 替换为您的图片文件名）
3. **第 156-165 行**：在 `<body>` 标签内添加全局全屏背景图片容器

其他代码保持不变，这些是 Fuwari 主题的核心功能代码。

---

## 总结

通过本教程，您已经成功为 Fuwari 博客添加了全局全屏背景图片。主要特点包括：

- ✅ **简单易用**：只需修改一个文件即可实现
- ✅ **全局生效**：背景图片在所有页面显示
- ✅ **不影响功能**：所有页面功能正常工作
- ✅ **可读性强**：遮罩层确保内容清晰可读
- ✅ **响应式设计**：自动适配不同设备

现在您可以：
- 更换不同的背景图片
- 调整遮罩层透明度
- 根据需要自定义样式

如果遇到任何问题，请参考常见问题部分或查看项目文档。

---

**相关文章**：
- [Fuwari 添加友链页面详细教程](/posts/fuwari/fuwari添加友链页面/fuwari添加友链页面/)
- [Fuwari Banner 全屏显示教程](/posts/fuwari/fuwari-banner全屏显示教程/fuwari-banner全屏显示教程/)
- [Fuwari 文章内跳转方法与注意事项](/posts/fuwari/fuwari文章内跳转方法与注意事项/fuwari文章内跳转方法与注意事项/)

---

**最后更新**：2025年1月15日

