---
title: Fuwari 添加面板透明度调节功能
published: 2025-11-07
description: 详细教程：如何在 Fuwari 主题的 Theme Color 面板中添加透明度调节功能，实现面板背景透明度的动态控制。
tags: [Fuwari, Astro, 主题定制, 透明度, UI/UX]
category: Fuwari
image: https://v6.gh-proxy.org/https://github.com/Skarie/hexoimg/blob/main/%E3%80%90%E5%93%B2%E9%A3%8E%E5%A3%81%E7%BA%B8%E3%80%91%E5%92%96%E5%95%A1-%E5%92%96%E5%95%A1%E5%B1%8B-%E5%A4%9C%E6%99%AF.png
draft: false
---

## 前言

在博客主题定制中，透明度调节是一个常见的需求。本文详细介绍如何在 Fuwari 主题的 Theme Color 面板中添加透明度调节功能，让用户可以动态控制面板（如卡片、浮动面板等）的背景透明度。

### 你将学到什么

- 如何通过 JavaScript 动态修改 CSS 变量
- 如何实现主题切换时的自动同步
- 如何处理亮色/暗色模式的颜色转换
- 如何在 Svelte 组件中添加交互式滑块
- 如何实现设置的持久化存储

### 前置要求

- 熟悉 TypeScript/JavaScript 基础语法
- 了解 Astro 和 Svelte 的基本概念
- 熟悉 CSS 变量和 rgba 颜色格式
- 有基本的文件操作和代码编辑经验

### 预期效果

完成本教程后，你的 Theme Color 面板将新增一个透明度滑块，用户可以：
- 通过滑块调节面板透明度（0-100%）
- 实时查看当前透明度百分比
- 一键重置为默认值（可在 `config.ts` 中配置）
- 设置会自动保存，刷新后仍然有效
- 支持在配置文件中设置默认透明度值

## 实现思路

与传统的使用 CSS `opacity` 属性不同，本文采用**直接修改背景颜色的透明度**的方式：

1. **不使用 CSS `opacity` 属性**：避免影响子元素的透明度
2. **动态修改 CSS 变量**：通过 JavaScript 动态计算并设置 `--card-bg` 和 `--float-panel-bg` 为带透明度的 `rgba()` 值
3. **根据主题模式适配**：亮色模式和暗色模式使用不同的颜色计算方式
4. **自动同步**：主题切换和色相（Hue）改变时自动重新应用透明度

### 技术选型说明

#### 为什么选择直接修改背景颜色？

**方案对比：**

| 方案 | 优点 | 缺点 | 适用场景 |
|------|------|------|----------|
| CSS `opacity` | 实现简单，代码量少 | 会影响所有子元素，导致文字、按钮等也变透明 | 需要整个元素（包括子元素）一起变透明 |
| 修改 `rgba()` 的 alpha 值 | 只影响背景，子元素不受影响 | 需要动态计算颜色值，代码稍复杂 | **我们的场景**：只改变背景透明度 |

**我们的需求：**
- ✅ 只改变面板背景的透明度
- ✅ 保持文字、按钮等子元素完全不透明
- ✅ 支持亮色/暗色模式切换
- ✅ 设置持久化保存

因此，选择直接修改背景颜色的 `rgba()` alpha 值是最合适的方案。

### 文件结构概览

在开始之前，让我们了解一下需要修改的文件：

```
fuwari/
├── src/
│   ├── types/
│   │   └── config.ts                     # 类型定义（新增透明度配置类型）
│   ├── config.ts                         # 配置文件（新增透明度配置项）
│   ├── components/
│   │   ├── ConfigCarrier.astro           # 配置传递组件（传递透明度配置）
│   │   └── widget/
│   │       └── DisplaySettings.svelte    # 显示设置组件（UI）
│   ├── i18n/
│   │   ├── i18nKey.ts                    # 国际化键定义
│   │   └── languages/
│   │       ├── zh_CN.ts                  # 中文翻译
│   │       └── en.ts                     # 英文翻译
│   ├── utils/
│   │   └── setting-utils.ts              # 设置工具函数（核心逻辑）
│   └── layouts/
│       └── Layout.astro                  # 布局文件（初始化）
```

**各文件的作用：**
- `types/config.ts`：定义配置类型，包括透明度配置
- `config.ts`：配置文件，设置默认透明度值
- `ConfigCarrier.astro`：将配置传递到前端 HTML
- `i18nKey.ts` 和语言文件：提供多语言支持
- `setting-utils.ts`：核心逻辑，处理透明度的获取、设置和应用
- `DisplaySettings.svelte`：UI 组件，提供用户交互界面
- `Layout.astro`：页面初始化，加载保存的设置

## 实现步骤

### 第一步：添加国际化支持

首先，我们需要在国际化文件中添加透明度相关的翻译。这一步确保功能支持多语言，提升用户体验。

#### 1.1 更新 `src/i18n/i18nKey.ts`

打开 `src/i18n/i18nKey.ts` 文件，找到 `themeColor` 的定义位置，在其下方添加新的键：

```typescript
enum I18nKey {
	home = "home",
	about = "about",
	archive = "archive",
	search = "search",
	
	tags = "tags",
	categories = "categories",
	recentPosts = "recentPosts",
	
	comments = "comments",
	
	untitled = "untitled",
	uncategorized = "uncategorized",
	noTags = "noTags",
	
	wordCount = "wordCount",
	wordsCount = "wordsCount",
	minuteCount = "minuteCount",
	minutesCount = "minutesCount",
	postCount = "postCount",
	postsCount = "postsCount",
	
	themeColor = "themeColor",
	panelOpacity = "panelOpacity",  // 👈 新增这一行
	lightMode = "lightMode",
	darkMode = "darkMode",
	systemMode = "systemMode",
	
	more = "more",
	
	author = "author",
	publishedAt = "publishedAt",
	license = "license",
}

export default I18nKey;
```

**代码说明：**
- `panelOpacity` 是新增的国际化键，用于标识"面板透明度"这个文本
- 键名使用驼峰命名法，与项目中其他键保持一致
- 这个键会在后续的组件中通过 `i18n(I18nKey.panelOpacity)` 使用

#### 1.2 添加中文翻译

打开 `src/i18n/languages/zh_CN.ts` 文件，在 `themeColor` 的翻译下方添加：

```typescript
import Key from "../i18nKey";
import type { Translation } from "../translation";

export const zh_CN: Translation = {
	[Key.home]: "主页",
	[Key.about]: "关于",
	// ... 其他翻译 ...
	
	[Key.themeColor]: "主题色",
	[Key.panelOpacity]: "面板透明度",  // 👈 新增这一行
	
	[Key.lightMode]: "亮色",
	[Key.darkMode]: "暗色",
	[Key.systemMode]: "跟随系统",
	
	// ... 其他翻译 ...
};
```

**代码说明：**
- `[Key.panelOpacity]` 是对象字面量的计算属性名语法
- `"面板透明度"` 是显示给中文用户看的文本
- 确保逗号和格式与其他翻译项一致

#### 1.3 添加英文翻译

打开 `src/i18n/languages/en.ts` 文件，同样添加英文翻译：

```typescript
import Key from "../i18nKey";
import type { Translation } from "../translation";

export const en: Translation = {
	[Key.home]: "Home",
	[Key.about]: "About",
	// ... 其他翻译 ...
	
	[Key.themeColor]: "Theme Color",
	[Key.panelOpacity]: "Panel Opacity",  // 👈 新增这一行
	
	[Key.lightMode]: "Light",
	[Key.darkMode]: "Dark",
	[Key.systemMode]: "System",
	
	// ... 其他翻译 ...
};
```

**代码说明：**
- 英文翻译使用 "Panel Opacity"，符合英文表达习惯
- 如果项目支持其他语言（如日文、韩文等），也需要在对应的语言文件中添加翻译

#### 1.4 验证国际化配置

完成以上步骤后，你可以通过以下方式验证：

1. **TypeScript 类型检查**：如果使用 TypeScript，编辑器应该不会报错
2. **运行项目**：启动开发服务器，检查是否有编译错误
3. **查看翻译**：在组件中使用 `i18n(I18nKey.panelOpacity)` 应该能正确显示翻译文本

**常见错误：**
- ❌ 忘记在 `i18nKey.ts` 中添加键定义
- ❌ 在语言文件中拼写错误（如 `panelOpactiy` 少了一个 `a`）
- ❌ 忘记添加逗号，导致语法错误
- ❌ 键名不一致（如 `i18nKey.ts` 中是 `panelOpacity`，但语言文件中是 `panel_opacity`）

**排查方法：**
- 检查编辑器是否有红色波浪线提示
- 查看浏览器控制台是否有错误信息
- 确认所有文件都已保存

### 第二步：配置默认透明度（可选）

在开始实现透明度功能之前，我们可以先在配置文件中设置默认透明度值。这样可以让新用户首次访问时使用你预设的透明度，而不是默认的 100% 不透明。

#### 2.1 更新类型定义

首先，需要在 `src/types/config.ts` 中添加透明度配置的类型定义：

```typescript
export type SiteConfig = {
	// ... 其他配置 ...
	themeColor: {
		hue: number;
		fixed: boolean;
	};
	panelOpacity: {
		opacity: number; // 默认面板透明度，范围 0 到 1
	};
	// ... 其他配置 ...
};
```

#### 2.2 添加配置项

在 `src/config.ts` 文件中添加透明度配置：

```typescript
export const siteConfig: SiteConfig = {
	// ... 其他配置 ...
	themeColor: {
		hue: 250,
		fixed: false,
	},
	panelOpacity: {
		opacity: 1.0, // 默认面板透明度，范围 0 到 1。例如：0=完全透明，1=完全不透明
	},
	// ... 其他配置 ...
};
```

**配置说明：**
- `opacity`: 默认透明度值，范围 0 到 1
  - `1.0` = 完全不透明（默认）
  - `0.9` = 90% 不透明，10% 透明
  - `0.5` = 50% 不透明，50% 透明
  - `0.0` = 完全透明（不推荐）

#### 2.3 传递配置到前端

在 `src/components/ConfigCarrier.astro` 中添加透明度配置的传递：

```astro
---
import { siteConfig } from "../config";
---

<div id="config-carrier" data-hue={siteConfig.themeColor.hue} data-opacity={siteConfig.panelOpacity.opacity}>
</div>
```

**注意：** 如果你不想在配置文件中设置默认值，可以跳过这一步，直接使用硬编码的默认值 1.0。但建议添加配置，这样可以方便地管理默认透明度。

### 第三步：实现透明度工具函数

在 `src/utils/setting-utils.ts` 中添加透明度相关的函数。这是整个功能的核心逻辑部分。

#### 3.1 查看现有代码结构

首先，让我们看看 `setting-utils.ts` 文件的现有结构。打开文件，你应该能看到类似这样的代码：

```typescript
import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config.ts";

// 色相（Hue）相关函数
export function getDefaultHue(): number { /* ... */ }
export function getHue(): number { /* ... */ }
export function setHue(hue: number): void { /* ... */ }

// 主题相关函数
export function applyThemeToDocument(theme: LIGHT_DARK_MODE) { /* ... */ }
export function setTheme(theme: LIGHT_DARK_MODE): void { /* ... */ }
export function getStoredTheme(): LIGHT_DARK_MODE { /* ... */ }
```

我们将在文件末尾（`getStoredTheme` 函数之后）添加透明度相关的函数。

#### 3.2 添加获取和设置透明度的函数

在 `getStoredTheme()` 函数之后添加以下代码：

```typescript
/**
 * 获取默认透明度值
 * 优先从配置文件读取，如果没有配置则返回 1.0（完全不透明）
 * @returns 默认透明度，1.0 表示完全不透明
 */
export function getDefaultOpacity(): number {
	const fallback = "1.0";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseFloat(configCarrier?.dataset.opacity || fallback);
}
```

**说明：**
- 如果已在 `config.ts` 中配置了 `panelOpacity.opacity`，函数会从 `config-carrier` 元素读取该值
- 如果没有配置或读取失败，则使用默认值 1.0（完全不透明）
- 这样可以让博客管理员在配置文件中统一管理默认透明度

```typescript
/**
 * 从 localStorage 获取保存的透明度值
 * 如果未保存过，返回默认值
 * @returns 透明度值，范围 0-1
 */
export function getOpacity(): number {
	const stored = localStorage.getItem("panelOpacity");
	// 如果 localStorage 中有值，解析为浮点数；否则返回默认值
	return stored ? Number.parseFloat(stored) : getDefaultOpacity();
}

/**
 * 设置透明度并应用到 CSS 变量
 * 这是核心函数，负责：
 * 1. 保存透明度到 localStorage
 * 2. 根据当前主题模式计算背景颜色
 * 3. 动态设置 CSS 变量
 * 
 * @param opacity 透明度值，范围 0-1（0=完全透明，1=完全不透明）
 */
export function setOpacity(opacity: number): void {
	// 1. 保存到 localStorage，实现持久化
	localStorage.setItem("panelOpacity", String(opacity));
	
	// 2. 获取根元素（:root），用于设置 CSS 变量
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		// 如果获取不到根元素（理论上不应该发生），直接返回
		return;
	}

	// 3. 检查当前是否为暗色模式
	const isDark = r.classList.contains("dark");

	// 4. 根据主题模式设置不同的背景颜色
	if (isDark) {
		// === 暗色模式 ===
		// 原始颜色定义：oklch(0.23 0.015 var(--hue))
		// 为了简化，我们将 lightness 0.23 转换为灰度值
		// lightness 范围是 0-1，需要乘以 255 转换为 RGB 值
		const gray = Math.round(0.23 * 255);  // 约等于 59
		
		// 设置卡片背景：rgba(59, 59, 59, opacity)
		// 这样只有背景变透明，文字等子元素不受影响
		r.style.setProperty(
			"--card-bg",
			`rgba(${gray}, ${gray}, ${gray}, ${opacity})`,
		);

		// 浮动面板的背景色稍暗一些
		const grayPanel = Math.round(0.19 * 255);  // 约等于 48
		r.style.setProperty(
			"--float-panel-bg",
			`rgba(${grayPanel}, ${grayPanel}, ${grayPanel}, ${opacity})`,
		);
	} else {
		// === 亮色模式 ===
		// 原始颜色是白色，直接使用 rgba(255, 255, 255, opacity)
		r.style.setProperty("--card-bg", `rgba(255, 255, 255, ${opacity})`);
		r.style.setProperty("--float-panel-bg", `rgba(255, 255, 255, ${opacity})`);
	}
}

/**
 * 当主题切换时，重新应用透明度设置
 * 这个函数会在主题切换和色相改变时被调用
 */
export function applyOpacityOnThemeChange(): void {
	const opacity = getOpacity();
	setOpacity(opacity);
}
```

**代码详解：**

1. **`getDefaultOpacity()`**：
   - 从 `config-carrier` 元素读取配置的默认透明度值
   - 如果配置文件中设置了 `panelOpacity.opacity`，则使用该值
   - 如果没有配置或读取失败，返回默认值 1.0（100% 不透明）
   - 这样可以让博客管理员在 `config.ts` 中统一管理默认透明度

2. **`getOpacity()`**：
   - 从 `localStorage` 读取保存的透明度值
   - 使用 `Number.parseFloat()` 将字符串转换为数字
   - 如果 `localStorage` 中没有值（首次使用），返回默认值
   - 使用 `localStorage` 的好处是数据会持久保存，即使关闭浏览器也不会丢失

3. **`setOpacity(opacity)`**：
   - **步骤 1**：保存到 `localStorage`，键名为 `"panelOpacity"`
   - **步骤 2**：获取 `:root` 元素，这是设置 CSS 变量的目标
   - **步骤 3**：检查当前主题模式（通过 `dark` 类名判断）
   - **步骤 4**：根据主题模式计算并设置背景颜色
     - 暗色模式：将 `oklch` 的 lightness 转换为灰度 RGB 值
     - 亮色模式：直接使用白色 `rgba(255, 255, 255, opacity)`
   - 使用 `style.setProperty()` 动态设置 CSS 变量，这样会覆盖 Stylus 中定义的默认值

4. **`applyOpacityOnThemeChange()`**：
   - 这是一个辅助函数，用于在主题切换时重新应用透明度
   - 先获取当前保存的透明度值，然后调用 `setOpacity()` 重新应用

**关键点说明：**

- **为什么使用 `rgba()` 而不是 `opacity` 属性？**
  - `opacity` 会影响整个元素及其所有子元素
  - `rgba()` 只影响背景颜色，子元素不受影响
  - 这样文字、按钮等子元素保持完全不透明，可读性更好

- **颜色转换的简化处理：**
  - 完整的 `oklch` 到 `rgba` 转换需要考虑 lightness、chroma（饱和度）和 hue（色相）
  - 为了简化，我们只使用了 lightness 值，忽略了 chroma 和 hue 的影响
  - 这意味着暗色模式下的颜色是灰度，而不是带色调的颜色
  - 如果需要更精确的颜色，可以使用 `culori` 等颜色转换库

**测试方法：**

你可以在浏览器控制台中测试这些函数：

```javascript
// 获取当前透明度
getOpacity()  // 应该返回 1.0（默认值）

// 设置透明度为 50%
setOpacity(0.5)

// 检查 CSS 变量是否已更新
getComputedStyle(document.documentElement).getPropertyValue('--card-bg')
// 应该返回类似 "rgba(255, 255, 255, 0.5)" 的值

// 检查 localStorage
localStorage.getItem('panelOpacity')  // 应该返回 "0.5"
```

#### 2.3 在主题切换时自动应用透明度

找到 `applyThemeToDocument` 函数，在函数末尾添加透明度重新应用的调用：

```typescript
export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	switch (theme) {
		case LIGHT_MODE:
			document.documentElement.classList.remove("dark");
			break;
		case DARK_MODE:
			document.documentElement.classList.add("dark");
			break;
		case AUTO_MODE:
			if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
			break;
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);

	// 👇 新增：主题切换后重新应用透明度
	// 因为亮色和暗色模式使用不同的颜色计算方式，切换主题时需要重新计算
	applyOpacityOnThemeChange();
}
```

**为什么需要这一步？**

当用户从亮色模式切换到暗色模式时：
- 亮色模式使用 `rgba(255, 255, 255, opacity)`（白色背景）
- 暗色模式使用 `rgba(59, 59, 59, opacity)`（灰色背景）

如果不重新应用透明度，背景颜色会保持之前的模式，导致显示错误。

#### 2.4 在色相改变时重新应用透明度

找到 `setHue` 函数，在设置 `--hue` 变量后添加透明度重新应用的调用：

```typescript
export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
	
	// 👇 新增：Hue 改变后重新应用透明度
	// 虽然当前实现简化了颜色转换（忽略了 hue），但为了保持一致性，
	// 以及为将来可能的精确颜色转换做准备，这里也重新应用透明度
	applyOpacityOnThemeChange();
}
```

**为什么需要这一步？**

虽然当前实现简化了颜色转换（只使用 lightness，忽略了 hue），但：
1. **保持一致性**：确保所有设置改变时都重新应用透明度
2. **为未来扩展做准备**：如果将来实现完整的 `oklch` 转换，hue 的改变会影响颜色
3. **避免潜在问题**：防止在某些边缘情况下出现颜色不同步的问题

**完整的函数调用链：**

```
用户操作
  ↓
setOpacity(0.5)  ← 直接设置透明度
  ↓
setOpacity() 内部调用
  ↓
r.style.setProperty("--card-bg", "rgba(...)")  ← 更新 CSS 变量

或者

用户切换主题
  ↓
applyThemeToDocument()
  ↓
applyOpacityOnThemeChange()
  ↓
getOpacity()  ← 获取保存的值
  ↓
setOpacity()  ← 重新应用
  ↓
r.style.setProperty("--card-bg", "rgba(...)")  ← 更新 CSS 变量
```

**验证步骤：**

1. 设置透明度为 50%
2. 切换到暗色模式，检查背景是否正确
3. 切换回亮色模式，检查背景是否正确
4. 改变色相，检查透明度是否保持

### 第四步：更新 DisplaySettings 组件

在 `src/components/widget/DisplaySettings.svelte` 中添加透明度滑块。这是用户交互的界面部分。

#### 4.1 查看现有组件结构

打开 `src/components/widget/DisplaySettings.svelte`，你应该能看到类似这样的结构：

```svelte
<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { getDefaultHue, getHue, setHue } from "@utils/setting-utils";

let hue = getHue();
const defaultHue = getDefaultHue();

function resetHue() {
	hue = getDefaultHue();
}

$: if (hue || hue === 0) {
	setHue(hue);
}
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <!-- 主题色控制部分 -->
    <!-- ... -->
</div>
```

#### 4.2 更新脚本部分

修改 `<script>` 部分，添加透明度相关的导入和逻辑：

```svelte
<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { 
	getDefaultHue, 
	getHue, 
	setHue, 
	getDefaultOpacity,    // 👈 新增导入
	getOpacity,           // 👈 新增导入
	setOpacity            // 👈 新增导入
} from "@utils/setting-utils";

// 主题色相关
let hue = getHue();
const defaultHue = getDefaultHue();

// 👇 新增：透明度相关
let opacity = getOpacity();
const defaultOpacity = getDefaultOpacity();

// 重置主题色
function resetHue() {
	hue = getDefaultHue();
}

// 👇 新增：重置透明度
function resetOpacity() {
	opacity = getDefaultOpacity();
}

// 响应式语句：当 hue 改变时自动调用 setHue
$: if (hue || hue === 0) {
	setHue(hue);
}

// 👇 新增：响应式语句：当 opacity 改变时自动调用 setOpacity
$: if (opacity !== undefined) {
	setOpacity(opacity);
}
</script>
```

**代码详解：**

1. **导入语句**：
   - `getDefaultOpacity`：获取默认透明度值
   - `getOpacity`：从 localStorage 读取透明度
   - `setOpacity`：设置并应用透明度

2. **响应式变量**：
   - `let opacity = getOpacity()`：创建响应式变量，初始值为保存的透明度
   - `const defaultOpacity = getDefaultOpacity()`：默认值常量，用于重置按钮的显示逻辑

3. **重置函数**：
   - `resetOpacity()`：将透明度重置为默认值（1.0）
   - 当用户点击重置按钮时调用

4. **响应式语句（Reactive Statements）**：
   - `$: if (opacity !== undefined) { setOpacity(opacity); }`
   - 这是 Svelte 的响应式语法，当 `opacity` 变量改变时自动执行
   - `!== undefined` 检查确保值有效
   - 这样当用户拖动滑块时，`opacity` 值改变，会自动调用 `setOpacity()` 更新 CSS 变量

**Svelte 响应式语句说明：**

```svelte
$: if (条件) {
    // 当条件满足时执行
}
```

- `$:` 是 Svelte 的特殊语法，表示响应式语句
- 当语句中引用的变量（如 `opacity`）改变时，语句会自动重新执行
- 这相当于 Vue 的 `watch` 或 React 的 `useEffect`

**为什么需要 `!== undefined` 检查？**

- 在组件初始化时，`opacity` 可能暂时是 `undefined`
- 如果不检查，可能会在初始化时调用 `setOpacity(undefined)`，导致错误
- 这个检查确保只在值有效时才执行

#### 4.3 添加透明度滑块 UI

在主题色滑块下方添加透明度控制部分。找到主题色滑块的结束位置（`</div>` 标签），在其后添加以下代码：

```svelte
<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <!-- ========== 主题色部分 ========== -->
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            {i18n(I18nKey.themeColor)}
            <button aria-label="Reset to Default" class="btn-regular w-7 h-7 rounded-md active:scale-90 will-change-transform"
                    class:opacity-0={hue === defaultHue} 
                    class:pointer-events-none={hue === defaultHue} 
                    on:click={resetHue}>
                <div class="text-[var(--btn-content)]">
                    <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                </div>
            </button>
        </div>
        <div class="flex gap-1">
            <div id="hueValue" class="transition bg-[var(--btn-regular-bg)] w-10 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {hue}
            </div>
        </div>
    </div>
    <div class="w-full h-6 px-1 bg-[oklch(0.80_0.10_0)] dark:bg-[oklch(0.70_0.10_0)] rounded select-none mb-4">
        <input aria-label={i18n(I18nKey.themeColor)} type="range" min="0" max="360" bind:value={hue}
               class="slider" id="colorSlider" step="5" style="width: 100%">
    </div>
    
    <!-- ========== 透明度部分（新增） ========== -->
    <div class="flex flex-row gap-2 mb-3 items-center justify-between">
        <!-- 标题和重置按钮 -->
        <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
            before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
            before:absolute before:-left-3 before:top-[0.33rem]"
        >
            {i18n(I18nKey.panelOpacity)}
            <button 
                aria-label="Reset to Default" 
                class="btn-regular w-7 h-7 rounded-md active:scale-90 will-change-transform"
                class:opacity-0={opacity === defaultOpacity} 
                class:pointer-events-none={opacity === defaultOpacity} 
                on:click={resetOpacity}
            >
                <div class="text-[var(--btn-content)]">
                    <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
                </div>
            </button>
        </div>
        <!-- 当前值显示 -->
        <div class="flex gap-1">
            <div id="opacityValue" class="transition bg-[var(--btn-regular-bg)] w-12 h-7 rounded-md flex justify-center
            font-bold text-sm items-center text-[var(--btn-content)]">
                {Math.round(opacity * 100)}%
            </div>
        </div>
    </div>
    <!-- 透明度滑块 -->
    <div class="w-full h-6 px-1 bg-gradient-to-r from-black/10 via-black/50 to-black/90 dark:from-white/10 dark:via-white/50 dark:to-white/90 rounded select-none">
        <input 
            aria-label={i18n(I18nKey.panelOpacity)} 
            type="range" 
            min="0" 
            max="1" 
            bind:value={opacity}
            class="slider opacity-slider" 
            id="opacitySlider" 
            step="0.01" 
            style="width: 100%"
        >
    </div>
</div>
```

**UI 结构详解：**

1. **标题行**：
   ```svelte
   <div class="flex flex-row gap-2 mb-3 items-center justify-between">
   ```
   - `flex flex-row`：水平布局
   - `gap-2`：元素间距
   - `mb-3`：底部外边距
   - `items-center`：垂直居中对齐
   - `justify-between`：两端对齐

2. **标题和重置按钮**：
   ```svelte
   <div class="flex gap-2 font-bold text-lg ...">
       {i18n(I18nKey.panelOpacity)}
       <button ...>
   ```
   - 使用 `i18n()` 函数显示翻译文本
   - 重置按钮使用条件类：`class:opacity-0={opacity === defaultOpacity}`
   - 当透明度等于默认值时，按钮透明且不可点击

3. **当前值显示**：
   ```svelte
   <div id="opacityValue">
       {Math.round(opacity * 100)}%
   </div>
   ```
   - `Math.round(opacity * 100)`：将 0-1 的值转换为 0-100 的百分比
   - `Math.round()` 四舍五入，显示整数百分比
   - 例如：`0.75` → `75%`，`0.123` → `12%`

4. **滑块容器**：
   ```svelte
   <div class="... bg-gradient-to-r from-black/10 via-black/50 to-black/90 ...">
   ```
   - `bg-gradient-to-r`：从左到右的渐变
   - `from-black/10`：起始颜色（10% 黑色，即浅灰）
   - `via-black/50`：中间颜色（50% 黑色，即中灰）
   - `to-black/90`：结束颜色（90% 黑色，即深灰）
   - 暗色模式使用白色渐变：`dark:from-white/10 dark:via-white/50 dark:to-white/90`
   - 这个渐变背景直观地表示透明度的范围（从透明到不透明）

5. **滑块输入**：
   ```svelte
   <input 
       type="range"           // HTML5 范围输入控件
       min="0"                // 最小值（完全透明）
       max="1"                // 最大值（完全不透明）
       bind:value={opacity}   // Svelte 双向绑定
       step="0.01"            // 步长（1%）
   >
   ```
   - `type="range"`：HTML5 范围滑块
   - `min="0"` 和 `max="1"`：定义范围
   - `bind:value={opacity}`：Svelte 的双向绑定，滑块值改变时自动更新 `opacity` 变量
   - `step="0.01"`：每次拖动的最小步长（1%）
   - `aria-label`：无障碍标签，屏幕阅读器会读取

**样式说明：**

- 透明度部分的样式与主题色部分保持一致，确保 UI 统一
- 使用 Tailwind CSS 的工具类，无需额外 CSS
- 渐变背景提供视觉反馈，让用户直观理解透明度的含义

**完整组件代码示例：**

如果你需要查看完整的组件代码，可以参考以下结构：

```svelte
<script lang="ts">
// ... 脚本部分（见 3.2 节）
</script>

<div id="display-setting" class="float-panel float-panel-closed absolute transition-all w-80 right-4 px-4 py-4">
    <!-- 主题色部分 -->
    <!-- ... 现有代码 ... -->
    
    <!-- 透明度部分 -->
    <!-- ... 新增代码（见上方） ... -->
</div>

<style lang="stylus">
    /* 现有样式保持不变 */
    #display-setting
      input[type="range"]
        /* ... 现有样式 ... */
</style>
```

### 第五步：添加初始化代码

在 `src/layouts/Layout.astro` 中添加透明度初始化。这一步确保页面加载时自动应用保存的透明度设置。

#### 5.1 查看现有导入语句

打开 `src/layouts/Layout.astro`，找到文件顶部的导入语句部分，应该能看到类似这样的代码：

```typescript
import {getHue, getStoredTheme, setHue, setTheme} from "../utils/setting-utils";
```

#### 5.2 更新导入语句

在导入语句中添加透明度相关的函数：

```typescript
import {
	getHue, 
	getStoredTheme, 
	setHue, 
	setTheme, 
	getOpacity,    // 👈 新增
	setOpacity     // 👈 新增
} from "../utils/setting-utils";
```

**代码说明：**
- `getOpacity`：用于读取保存的透明度值
- `setOpacity`：用于应用透明度设置
- 这些函数与 `getHue`、`setHue` 等函数来自同一个文件

#### 5.3 查看现有加载函数

找到 `loadHue` 函数的位置，应该能看到类似这样的代码：

```typescript
function loadHue() {
	setHue(getHue())
}
```

#### 5.4 添加透明度加载函数

在 `loadHue` 函数之后添加透明度加载函数：

```typescript
function loadHue() {
	setHue(getHue())
}

// 👇 新增：加载透明度设置
function loadOpacity() {
	setOpacity(getOpacity())
}
```

**代码说明：**
- `loadOpacity()` 函数的作用是在页面加载时读取并应用保存的透明度设置
- 函数内部先调用 `getOpacity()` 获取保存的值（如果没有则返回默认值 1.0）
- 然后调用 `setOpacity()` 应用这个值，这会更新 CSS 变量

**为什么需要这个函数？**

- 当用户刷新页面时，`localStorage` 中的数据仍然存在
- 但是 CSS 变量会被重置为 Stylus 中定义的默认值
- 因此需要在页面加载时重新应用保存的透明度设置

#### 5.5 在初始化函数中调用

找到 `init()` 函数，在 `loadHue()` 之后添加 `loadOpacity()` 的调用：

```typescript
function init() {
	// disableAnimation()()		// TODO
	loadTheme();      // 加载主题设置
	loadHue();        // 加载色相设置
	loadOpacity();    // 👈 新增：加载透明度设置
	initCustomScrollbar();
	showBanner();
}
```

**初始化顺序说明：**

1. `loadTheme()`：先加载主题（亮色/暗色），因为透明度计算依赖于主题模式
2. `loadHue()`：加载色相设置
3. `loadOpacity()`：最后加载透明度，这样能确保使用正确的主题模式计算颜色

**完整的初始化流程：**

```
页面加载
  ↓
init() 被调用
  ↓
loadTheme()  ← 设置主题模式（亮色/暗色）
  ↓
loadHue()    ← 设置色相值
  ↓
loadOpacity()  ← 读取透明度并应用
  ↓
getOpacity()   ← 从 localStorage 读取（如 "0.5"）
  ↓
setOpacity(0.5)  ← 应用透明度
  ↓
根据当前主题模式计算颜色
  ↓
设置 CSS 变量（如 --card-bg: rgba(255, 255, 255, 0.5)）
  ↓
页面显示正确的透明度
```

**验证初始化：**

完成以上步骤后，你可以通过以下方式验证：

1. **设置透明度**：在 Theme Color 面板中设置透明度为 50%
2. **刷新页面**：按 F5 或 Ctrl+R 刷新页面
3. **检查效果**：面板应该保持 50% 的透明度，而不是重置为 100%
4. **检查控制台**：打开浏览器开发者工具，在控制台中输入：
   ```javascript
   localStorage.getItem('panelOpacity')  // 应该返回 "0.5"
   getComputedStyle(document.documentElement).getPropertyValue('--card-bg')
   // 应该返回类似 "rgba(255, 255, 255, 0.5)" 的值
   ```

**常见问题：**

- ❌ 刷新后透明度重置为 100%
  - 检查 `loadOpacity()` 是否在 `init()` 中被调用
  - 检查 `getOpacity()` 是否能正确读取 `localStorage`
  - 检查浏览器控制台是否有错误

- ❌ 透明度设置后立即失效
  - 检查 `setOpacity()` 函数是否正确设置 CSS 变量
  - 检查 CSS 变量名是否正确（`--card-bg` 和 `--float-panel-bg`）

- ❌ 主题切换后透明度不正确
  - 检查 `applyThemeToDocument()` 中是否调用了 `applyOpacityOnThemeChange()`
  - 检查主题切换后是否正确检测到暗色/亮色模式

## 测试和验证

### 功能测试清单

完成所有步骤后，请按照以下清单逐一测试：

- [ ] **基本功能**
  - [ ] 透明度滑块可以拖动
  - [ ] 滑块值改变时，面板透明度实时更新
  - [ ] 当前值显示框正确显示百分比（0-100%）
  - [ ] 重置按钮可以恢复默认值（100%）

- [ ] **持久化**
  - [ ] 设置透明度后刷新页面，设置仍然有效
  - [ ] 关闭浏览器后重新打开，设置仍然有效
  - [ ] `localStorage` 中正确保存了透明度值

- [ ] **主题切换**
  - [ ] 在亮色模式下设置透明度，切换到暗色模式后透明度正确
  - [ ] 在暗色模式下设置透明度，切换到亮色模式后透明度正确
  - [ ] 切换主题时，背景颜色正确更新（亮色用白色，暗色用灰色）

- [ ] **色相改变**
  - [ ] 改变色相后，透明度设置保持不变
  - [ ] 改变色相后，背景颜色正确更新

- [ ] **UI 交互**
  - [ ] 重置按钮在透明度为 100% 时隐藏（透明且不可点击）
  - [ ] 透明度滑块有渐变背景，视觉效果良好
  - [ ] 所有文本正确显示（中文/英文）

### 调试技巧

#### 1. 使用浏览器开发者工具

**检查 CSS 变量：**

```javascript
// 在控制台中执行
getComputedStyle(document.documentElement).getPropertyValue('--card-bg')
getComputedStyle(document.documentElement).getPropertyValue('--float-panel-bg')
```

**检查 localStorage：**

```javascript
localStorage.getItem('panelOpacity')
localStorage.getItem('hue')
localStorage.getItem('theme')
```

**检查主题模式：**

```javascript
document.documentElement.classList.contains('dark')  // true = 暗色模式
```

#### 2. 添加调试日志

在 `setOpacity` 函数中添加 `console.log`：

```typescript
export function setOpacity(opacity: number): void {
	console.log('设置透明度:', opacity);  // 👈 调试日志
	localStorage.setItem("panelOpacity", String(opacity));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		console.error('无法获取根元素');  // 👈 错误日志
		return;
	}
	const isDark = r.classList.contains("dark");
	console.log('当前主题模式:', isDark ? '暗色' : '亮色');  // 👈 调试日志
	
	// ... 其余代码
}
```

#### 3. 检查网络请求

如果使用开发服务器，检查是否有编译错误：
- 查看终端/控制台的错误信息
- 检查浏览器控制台的错误
- 确认所有文件都已保存

#### 4. 逐步验证

如果功能不工作，可以逐步验证：

1. **验证国际化**：
   ```svelte
   {i18n(I18nKey.panelOpacity)}  // 应该显示 "面板透明度" 或 "Panel Opacity"
   ```

2. **验证函数导入**：
   ```svelte
   // 在组件中临时添加
   console.log(getOpacity());  // 应该输出数字
   ```

3. **验证响应式绑定**：
   ```svelte
   // 在组件中临时添加
   $: console.log('透明度改变:', opacity);
   ```

## 技术细节

### 为什么不用 CSS `opacity` 属性？

使用 CSS `opacity` 属性会影响元素及其所有子元素的透明度，这通常不是我们想要的效果。

**对比示例：**

```css
/* 方案 1：使用 opacity（不推荐） */
.panel {
    background-color: white;
    opacity: 0.5;  /* 整个元素（包括子元素）都变透明 */
}

/* 方案 2：使用 rgba() alpha（推荐） */
.panel {
    background-color: rgba(255, 255, 255, 0.5);  /* 只有背景变透明 */
}
```

**实际效果对比：**

| 方案 | 背景 | 文字 | 按钮 | 图标 |
|------|------|------|------|------|
| `opacity: 0.5` | 50% 透明 | 50% 透明 ❌ | 50% 透明 ❌ | 50% 透明 ❌ |
| `rgba(..., 0.5)` | 50% 透明 ✅ | 100% 不透明 ✅ | 100% 不透明 ✅ | 100% 不透明 ✅ |

因此，我们选择使用 `rgba()` 的 alpha 通道，只让背景变透明，保持子元素的可读性。

### 颜色转换说明

在暗色模式下，原始颜色定义使用的是 `oklch()` 颜色空间：

```stylus
--card-bg: white oklch(0.23 0.015 var(--hue))
--float-panel-bg: white oklch(0.19 0.015 var(--hue))
```

为了简化实现，我们将 `oklch` 的 lightness 值（0.23 和 0.19）转换为灰度值：

```typescript
const gray = Math.round(0.23 * 255);  // 约等于 59
const grayPanel = Math.round(0.19 * 255);  // 约等于 48
```

然后使用 `rgba()` 格式并应用透明度：

```typescript
rgba(59, 59, 59, opacity)  // card-bg
rgba(48, 48, 48, opacity)  // float-panel-bg
```

> **注意**：这是一个简化的转换。完整的 `oklch` 到 `rgba` 转换需要考虑 chroma（饱和度）和 hue（色相）的影响。如果需要更精确的颜色转换，可以使用专门的颜色转换库。

### 自动同步机制

为了确保透明度设置在不同场景下都能正确应用，我们实现了以下自动同步机制：

1. **主题切换时**：在 `applyThemeToDocument` 中调用 `applyOpacityOnThemeChange()`
2. **色相改变时**：在 `setHue` 中调用 `applyOpacityOnThemeChange()`
3. **页面加载时**：在 `init()` 中调用 `loadOpacity()`

## 使用效果

完成以上步骤后，用户可以在 Theme Color 面板中：

1. **调节透明度滑块**：范围从 0（完全透明）到 1（完全不透明）
2. **查看当前值**：滑块右侧显示百分比（0-100%）
3. **重置为默认值**：点击重置按钮恢复为 100% 不透明
4. **自动保存**：设置会自动保存到 localStorage，刷新页面后仍然有效

## 常见问题解答

### Q1: 滑块拖动时没有反应？

**可能原因：**
1. 响应式语句没有正确绑定
2. `setOpacity` 函数有错误
3. CSS 变量名不正确

**解决方法：**
- 检查浏览器控制台是否有错误
- 确认 `bind:value={opacity}` 正确绑定
- 确认响应式语句 `$: if (opacity !== undefined) { setOpacity(opacity); }` 存在

### Q2: 刷新页面后透明度重置为 100%？

**可能原因：**
1. `loadOpacity()` 没有在 `init()` 中调用
2. `localStorage` 被禁用或清除
3. `getOpacity()` 函数返回默认值

**解决方法：**
- 检查 `Layout.astro` 中的 `init()` 函数
- 检查浏览器是否允许 `localStorage`
- 在控制台执行 `localStorage.getItem('panelOpacity')` 查看是否有值

### Q3: 主题切换后透明度不正确？

**可能原因：**
1. `applyThemeToDocument()` 中没有调用 `applyOpacityOnThemeChange()`
2. 主题检测逻辑有误

**解决方法：**
- 检查 `applyThemeToDocument()` 函数
- 确认 `isDark` 变量正确检测主题模式
- 添加调试日志查看主题切换时的执行流程

### Q4: 暗色模式下的颜色不对？

**可能原因：**
1. 颜色转换计算有误
2. CSS 变量没有被正确覆盖

**解决方法：**
- 检查 `setOpacity()` 中的颜色计算逻辑
- 确认 `r.style.setProperty()` 正确执行
- 使用开发者工具检查 CSS 变量的实际值

### Q5: 重置按钮不显示或不工作？

**可能原因：**
1. 条件类绑定有误
2. `defaultOpacity` 值不正确
3. 按钮点击事件未绑定

**解决方法：**
- 检查 `class:opacity-0={opacity === defaultOpacity}` 是否正确
- 确认 `defaultOpacity` 值为 1.0
- 检查 `on:click={resetOpacity}` 是否正确绑定

### Q6: 如何实现更精确的颜色转换？

如果需要考虑 `oklch` 的完整颜色信息（包括 chroma 和 hue），可以使用颜色转换库：

```bash
npm install culori
```

然后修改 `setOpacity()` 函数：

```typescript
import { oklch, formatRgb } from 'culori';

export function setOpacity(opacity: number): void {
	// ... 保存到 localStorage ...
	
	const hue = getHue();
	const isDark = r.classList.contains("dark");
	
	if (isDark) {
		// 使用 culori 进行精确转换
		const cardColor = oklch({ l: 0.23, c: 0.015, h: hue });
		const rgb = formatRgb(cardColor);
		r.style.setProperty(
			"--card-bg",
			`rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`,
		);
		// ... 类似处理 float-panel-bg ...
	}
}
```

## 注意事项

1. **性能考虑**：
   - 每次透明度改变都会重新计算并设置 CSS 变量
   - 但这对性能影响很小，因为操作频率低（用户拖动滑块）
   - 如果担心性能，可以考虑使用防抖（debounce）限制更新频率

2. **浏览器兼容性**：
   - `rgba()` 颜色格式有良好的浏览器支持（IE9+）
   - `localStorage` 支持所有现代浏览器
   - `CSS.supports()` 可以检测浏览器是否支持特定 CSS 特性

3. **颜色精度**：
   - 当前实现简化了 `oklch` 到 `rgba` 的转换
   - 只使用了 lightness，忽略了 chroma 和 hue
   - 如果需要更精确的颜色，可以使用 `culori` 等颜色转换库

4. **备份文件**：
   - 在修改前建议备份相关文件
   - 可以使用 Git 提交修改，方便回退
   - 或者手动复制文件为 `.backup` 后缀

5. **代码维护**：
   - 添加适当的注释说明代码意图
   - 保持代码风格与项目一致
   - 考虑添加 TypeScript 类型注解提高代码可读性

6. **用户体验**：
   - 滑块步长设置为 0.01（1%）提供精细控制
   - 显示百分比让用户直观了解当前值
   - 重置按钮在默认值时隐藏，避免混淆

## 扩展建议

如果需要更高级的功能，可以考虑：

1. **预设透明度值**：提供几个预设的透明度选项（如 100%、75%、50%、25%）
2. **动画过渡**：在透明度改变时添加平滑的过渡动画
3. **分别控制**：为不同类型的面板（卡片、浮动面板等）提供独立的透明度控制
4. **更精确的颜色转换**：使用颜色转换库实现完整的 `oklch` 到 `rgba` 转换

## 完整代码清单

为了方便参考，这里提供所有修改文件的完整代码片段：

### 1. `src/types/config.ts`（更新类型定义）

```typescript
export type SiteConfig = {
	// ... 其他配置 ...
	themeColor: {
		hue: number;
		fixed: boolean;
	};
	panelOpacity: {
		opacity: number; // 默认面板透明度，范围 0 到 1
	};
	// ... 其他配置 ...
};
```

### 2. `src/config.ts`（添加配置项）

```typescript
export const siteConfig: SiteConfig = {
	// ... 其他配置 ...
	themeColor: {
		hue: 250,
		fixed: false,
	},
	panelOpacity: {
		opacity: 1.0, // 默认面板透明度，范围 0 到 1
	},
	// ... 其他配置 ...
};
```

### 3. `src/components/ConfigCarrier.astro`（传递配置）

```astro
---
import { siteConfig } from "../config";
---

<div id="config-carrier" data-hue={siteConfig.themeColor.hue} data-opacity={siteConfig.panelOpacity.opacity}>
</div>
```

### 4. `src/i18n/i18nKey.ts`

```typescript
// ... 其他代码 ...
themeColor = "themeColor",
panelOpacity = "panelOpacity",  // 新增
lightMode = "lightMode",
// ... 其他代码 ...
```

### 5. `src/i18n/languages/zh_CN.ts`

```typescript
// ... 其他代码 ...
[Key.themeColor]: "主题色",
[Key.panelOpacity]: "面板透明度",  // 新增
[Key.lightMode]: "亮色",
// ... 其他代码 ...
```

### 6. `src/i18n/languages/en.ts`

```typescript
// ... 其他代码 ...
[Key.themeColor]: "Theme Color",
[Key.panelOpacity]: "Panel Opacity",  // 新增
[Key.lightMode]: "Light",
// ... 其他代码 ...
```

### 7. `src/utils/setting-utils.ts`（新增函数）

```typescript
// 在文件末尾添加以下函数

export function getDefaultOpacity(): number {
	const fallback = "1.0";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseFloat(configCarrier?.dataset.opacity || fallback);
}

export function getOpacity(): number {
	const stored = localStorage.getItem("panelOpacity");
	return stored ? Number.parseFloat(stored) : getDefaultOpacity();
}

export function setOpacity(opacity: number): void {
	localStorage.setItem("panelOpacity", String(opacity));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) return;
	
	const isDark = r.classList.contains("dark");
	
	if (isDark) {
		const gray = Math.round(0.23 * 255);
		r.style.setProperty("--card-bg", `rgba(${gray}, ${gray}, ${gray}, ${opacity})`);
		const grayPanel = Math.round(0.19 * 255);
		r.style.setProperty("--float-panel-bg", `rgba(${grayPanel}, ${grayPanel}, ${grayPanel}, ${opacity})`);
	} else {
		r.style.setProperty("--card-bg", `rgba(255, 255, 255, ${opacity})`);
		r.style.setProperty("--float-panel-bg", `rgba(255, 255, 255, ${opacity})`);
	}
}

export function applyOpacityOnThemeChange(): void {
	const opacity = getOpacity();
	setOpacity(opacity);
}
```

### 8. `src/utils/setting-utils.ts`（修改现有函数）

```typescript
// 修改 applyThemeToDocument 函数，在末尾添加：
export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	// ... 现有代码 ...
	applyOpacityOnThemeChange();  // 新增
}

// 修改 setHue 函数，在末尾添加：
export function setHue(hue: number): void {
	// ... 现有代码 ...
	applyOpacityOnThemeChange();  // 新增
}
```

### 9. `src/components/widget/DisplaySettings.svelte`（脚本部分）

```svelte
<script lang="ts">
import I18nKey from "@i18n/i18nKey";
import { i18n } from "@i18n/translation";
import Icon from "@iconify/svelte";
import { 
	getDefaultHue, getHue, setHue, 
	getDefaultOpacity, getOpacity, setOpacity 
} from "@utils/setting-utils";

let hue = getHue();
const defaultHue = getDefaultHue();

let opacity = getOpacity();
const defaultOpacity = getDefaultOpacity();

function resetHue() {
	hue = getDefaultHue();
}

function resetOpacity() {
	opacity = getDefaultOpacity();
}

$: if (hue || hue === 0) {
	setHue(hue);
}

$: if (opacity !== undefined) {
	setOpacity(opacity);
}
</script>
```

### 10. `src/components/widget/DisplaySettings.svelte`（UI 部分）

在主题色滑块后添加：

```svelte
<!-- 透明度部分 -->
<div class="flex flex-row gap-2 mb-3 items-center justify-between">
    <div class="flex gap-2 font-bold text-lg text-neutral-900 dark:text-neutral-100 transition relative ml-3
        before:w-1 before:h-4 before:rounded-md before:bg-[var(--primary)]
        before:absolute before:-left-3 before:top-[0.33rem]">
        {i18n(I18nKey.panelOpacity)}
        <button aria-label="Reset to Default" 
                class="btn-regular w-7 h-7 rounded-md active:scale-90 will-change-transform"
                class:opacity-0={opacity === defaultOpacity} 
                class:pointer-events-none={opacity === defaultOpacity} 
                on:click={resetOpacity}>
            <div class="text-[var(--btn-content)]">
                <Icon icon="fa6-solid:arrow-rotate-left" class="text-[0.875rem]"></Icon>
            </div>
        </button>
    </div>
    <div class="flex gap-1">
        <div id="opacityValue" class="transition bg-[var(--btn-regular-bg)] w-12 h-7 rounded-md flex justify-center
        font-bold text-sm items-center text-[var(--btn-content)]">
            {Math.round(opacity * 100)}%
        </div>
    </div>
</div>
<div class="w-full h-6 px-1 bg-gradient-to-r from-black/10 via-black/50 to-black/90 dark:from-white/10 dark:via-white/50 dark:to-white/90 rounded select-none">
    <input aria-label={i18n(I18nKey.panelOpacity)} 
           type="range" min="0" max="1" bind:value={opacity}
           class="slider opacity-slider" id="opacitySlider" step="0.01" style="width: 100%">
</div>
```

### 8. `src/layouts/Layout.astro`（修改部分）

```typescript
// 更新导入
import {getHue, getStoredTheme, setHue, setTheme, getOpacity, setOpacity} from "../utils/setting-utils";

// 添加加载函数
function loadOpacity() {
	setOpacity(getOpacity())
}

// 在 init() 中调用
function init() {
	loadTheme();
	loadHue();
	loadOpacity();  // 新增
	initCustomScrollbar();
	showBanner();
}
```

## 总结

通过本文的详细教程，我们成功在 Fuwari 主题中添加了面板透明度调节功能。这个实现采用了直接修改背景颜色透明度的方式，避免了使用 CSS `opacity` 属性带来的子元素透明度问题。同时，通过自动同步机制确保了在不同场景下透明度设置都能正确应用。

### 关键要点回顾

1. **技术选型**：使用 `rgba()` alpha 通道而非 `opacity` 属性
2. **核心逻辑**：在 `setting-utils.ts` 中实现透明度的获取、设置和应用
3. **UI 交互**：在 `DisplaySettings.svelte` 中添加滑块和重置按钮
4. **自动同步**：主题切换和色相改变时自动重新应用透明度
5. **持久化**：使用 `localStorage` 保存设置，页面刷新后仍然有效

### 下一步

完成基础功能后，你可以考虑以下扩展：

- 添加预设透明度选项（快速选择常用值）
- 为不同类型的面板提供独立控制
- 添加平滑的过渡动画
- 使用颜色转换库实现更精确的颜色转换
- 添加键盘快捷键支持

希望这篇详细的教程对你有帮助！如果你在实现过程中遇到任何问题，欢迎参考"常见问题解答"部分，或者在评论区讨论。

---

**相关资源：**
- [Fuwari 主题 GitHub](https://github.com/saicaca/fuwari)
- [Astro 官方文档](https://docs.astro.build/)
- [Svelte 官方文档](https://svelte.dev/docs)
- [CSS 变量 MDN 文档](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)

