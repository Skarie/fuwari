---
title: Fuwari 分页组件样式修改教程 - 将页码改为独立圆角方块
published: 2025-11-07
tags:
  - Fuwari
  - Astro
  - 教程
  - CSS
  - Tailwind
category: Fuwari
description: 超详细教程：如何修改 Fuwari 博客的分页组件样式，将原本连接在一起的页码改为独立的圆角方块，让每个页码按钮清晰分离。
draft: false
---

# Fuwari 分页组件样式修改教程 - 将页码改为独立圆角方块

本教程将详细讲解如何修改 Fuwari 博客的分页组件样式，将原本连接在一起的页码改为独立的圆角方块。每个页码按钮将显示为独立的、带有圆角的方块，彼此之间有清晰的间距。

## 📋 目录

- [问题背景](#问题背景)
- [解决方案概述](#解决方案概述)
- [步骤一：定位分页组件文件](#步骤一定位分页组件文件)
- [步骤二：理解原始代码结构](#步骤二理解原始代码结构)
- [步骤三：修改分页组件样式](#步骤三修改分页组件样式)
- [步骤四：详细代码对比分析](#步骤四详细代码对比分析)
- [步骤五：样式效果详解](#步骤五样式效果详解)
- [步骤六：进一步自定义（可选）](#步骤六进一步自定义可选)
- [技术原理深度解析](#技术原理深度解析)
- [常见问题解答](#常见问题解答)
- [完整代码参考](#完整代码参考)
- [总结](#总结)

---

## 问题背景

### 原始样式问题

在 Fuwari 博客的默认分页组件中，页码按钮（1, 2, 3, 4, 5, 6）显示为一个**连接在一起的矩形块**，具体表现为：

1. **视觉连接**：所有页码按钮被包裹在一个带背景色的容器中
2. **无间距**：页码按钮之间没有明显的间距
3. **共享圆角**：只有外层容器有圆角，内部按钮之间没有分离
4. **视觉混淆**：用户难以区分每个独立的页码按钮

### 期望效果

我们希望实现以下效果：

1. ✅ **独立显示**：每个页码按钮都是独立的元素
2. ✅ **圆角方块**：每个按钮都有独立的圆角（`rounded-lg`）
3. ✅ **清晰间距**：按钮之间有明显的间距（使用 `gap` 属性）
4. ✅ **美观设计**：保持原有的悬停效果和交互功能

---

## 解决方案概述

### 核心思路

**移除外层容器的背景和圆角，添加按钮间距**，让每个页码按钮独立显示。

### 关键修改点

1. **移除外层背景**：删除 `bg-[var(--card-bg)]` 类
2. **移除外层圆角**：删除 `rounded-lg` 类
3. **添加间距**：使用 `gap-2` 或 `gap-3` 类添加按钮间距
4. **保持按钮样式**：每个按钮本身已有 `rounded-lg` 和 `btn-card` 类

---

## 步骤一：定位分页组件文件

### 1.1 文件位置

分页组件的文件位于：

```
src/components/control/Pagination.astro
```

### 1.2 如何找到文件

1. 打开项目根目录
2. 进入 `src/components/control/` 目录
3. 找到 `Pagination.astro` 文件

### 1.3 文件说明

- **文件类型**：Astro 组件文件（`.astro`）
- **组件用途**：显示博客文章列表的分页导航
- **使用位置**：博客首页和归档页面

---

## 步骤二：理解原始代码结构

### 2.1 完整代码结构

让我们先看看原始代码的完整结构：

```astro
---
// 前端脚本部分（Frontmatter）
import type { Page } from "astro";
import { Icon } from "astro-icon/components";
import { url } from "../../utils/url-utils";

// Props 接口定义
interface Props {
	page: Page;
	class?: string;
	style?: string;
}

// 组件逻辑
const { page, style } = Astro.props;
// ... 页码计算逻辑
---

<!-- 模板部分 -->
<div class="flex flex-row gap-3 justify-center">
    <!-- 上一页按钮 -->
    <a href={page.url.prev || ""}>...</a>
    
    <!-- 页码容器（需要修改的部分） -->
    <div class="bg-[var(--card-bg)] flex flex-row rounded-lg items-center ...">
        {pages.map((p) => {
            // 页码按钮渲染逻辑
        })}
    </div>
    
    <!-- 下一页按钮 -->
    <a href={page.url.next || ""}>...</a>
</div>
```

### 2.2 关键部分解析

#### 外层容器

```astro
<div class="flex flex-row gap-3 justify-center">
```

- `flex`：使用 Flexbox 布局
- `flex-row`：水平排列
- `gap-3`：元素间距为 0.75rem（12px）
- `justify-center`：水平居中对齐

#### 页码容器（问题所在）

```astro
<div class="bg-[var(--card-bg)] flex flex-row rounded-lg items-center text-neutral-700 dark:text-neutral-300 font-bold">
```

**问题分析**：

1. `bg-[var(--card-bg)]`：给容器添加了背景色，导致所有页码看起来在一个背景块中
2. `rounded-lg`：只给外层容器添加了圆角，内部按钮没有独立圆角
3. **没有 `gap` 类**：按钮之间没有间距

#### 页码按钮

```astro
<!-- 当前页 -->
<div class="h-11 w-11 rounded-lg bg-[var(--primary)] ...">
    {p}
</div>

<!-- 其他页 -->
<a href={...} class="btn-card w-11 h-11 rounded-lg ...">
    {p}
</a>
```

**按钮特点**：

- 每个按钮已经有 `rounded-lg` 类（圆角）
- 每个按钮已经有 `btn-card` 类（样式定义）
- 宽度和高度都是 `w-11 h-11`（44px × 44px）

---

## 步骤三：修改分页组件样式

### 3.1 打开文件

使用您喜欢的代码编辑器打开 `src/components/control/Pagination.astro` 文件。

### 3.2 定位需要修改的代码

找到第 62 行的页码容器 `<div>` 标签：

```astro
<div class="bg-[var(--card-bg)] flex flex-row rounded-lg items-center text-neutral-700 dark:text-neutral-300 font-bold">
```

### 3.3 执行修改

**修改前**（原始代码）：

```astro
<div class="bg-[var(--card-bg)] flex flex-row rounded-lg items-center text-neutral-700 dark:text-neutral-300 font-bold">
```

**修改后**（新代码）：

```astro
<div class="flex flex-row gap-2 items-center text-neutral-700 dark:text-neutral-300 font-bold">
```

### 3.4 修改说明

#### 删除的类

1. **`bg-[var(--card-bg)]`**
   - **作用**：设置容器背景色
   - **删除原因**：移除背景后，每个按钮的背景会单独显示

2. **`rounded-lg`**
   - **作用**：给容器添加圆角
   - **删除原因**：容器不再需要圆角，每个按钮已有独立圆角

#### 添加的类

1. **`gap-2`**
   - **作用**：在 Flexbox 容器中，子元素之间添加间距
   - **间距大小**：`0.5rem`（8px）
   - **可选值**：
     - `gap-1`：4px（间距较小）
     - `gap-2`：8px（推荐，适中）
     - `gap-3`：12px（间距较大）
     - `gap-4`：16px（间距很大）

---

## 步骤四：详细代码对比分析

### 4.1 完整代码对比

#### 修改前的代码

```astro
<div class:list={[className, "flex flex-row gap-3 justify-center"]} style={style}>
    <!-- 上一页按钮 -->
    <a href={page.url.prev || ""} aria-label={page.url.prev ? "Previous Page" : null}
       class:list={["btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11",
           {"disabled": page.url.prev == undefined}
       ]}
    >
        <Icon name="material-symbols:chevron-left-rounded" class="text-[1.75rem]"></Icon>
    </a>
    
    <!-- 页码容器：有背景和圆角 -->
    <div class="bg-[var(--card-bg)] flex flex-row rounded-lg items-center text-neutral-700 dark:text-neutral-300 font-bold">
        {pages.map((p) => {
            if (p == HIDDEN)
                return <Icon name="material-symbols:more-horiz" class="mx-1"/>;
            if (p == page.currentPage)
                return <div class="h-11 w-11 rounded-lg bg-[var(--primary)] flex items-center justify-center
                    font-bold text-white dark:text-black/70"
                >
                    {p}
                </div>
            return <a href={url(getPageUrl(p))} aria-label={`Page ${p}`}
                class="btn-card w-11 h-11 rounded-lg overflow-hidden active:scale-[0.85]"
            >{p}</a>
        })}
    </div>
    
    <!-- 下一页按钮 -->
    <a href={page.url.next || ""} aria-label={page.url.next ? "Next Page" : null}
       class:list={["btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11",
           {"disabled": page.url.next == undefined}
       ]}
    >
        <Icon name="material-symbols:chevron-right-rounded" class="text-[1.75rem]"></Icon>
    </a>
</div>
```

#### 修改后的代码

```astro
<div class:list={[className, "flex flex-row gap-3 justify-center"]} style={style}>
    <!-- 上一页按钮（不变） -->
    <a href={page.url.prev || ""} aria-label={page.url.prev ? "Previous Page" : null}
       class:list={["btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11",
           {"disabled": page.url.prev == undefined}
       ]}
    >
        <Icon name="material-symbols:chevron-left-rounded" class="text-[1.75rem]"></Icon>
    </a>
    
    <!-- 页码容器：移除背景和圆角，添加间距 -->
    <div class="flex flex-row gap-2 items-center text-neutral-700 dark:text-neutral-300 font-bold">
        {pages.map((p) => {
            if (p == HIDDEN)
                return <Icon name="material-symbols:more-horiz" class="mx-1"/>;
            if (p == page.currentPage)
                return <div class="h-11 w-11 rounded-lg bg-[var(--primary)] flex items-center justify-center
                    font-bold text-white dark:text-black/70"
                >
                    {p}
                </div>
            return <a href={url(getPageUrl(p))} aria-label={`Page ${p}`}
                class="btn-card w-11 h-11 rounded-lg overflow-hidden active:scale-[0.85]"
            >{p}</a>
        })}
    </div>
    
    <!-- 下一页按钮（不变） -->
    <a href={page.url.next || ""} aria-label={page.url.next ? "Next Page" : null}
       class:list={["btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11",
           {"disabled": page.url.next == undefined}
       ]}
    >
        <Icon name="material-symbols:chevron-right-rounded" class="text-[1.75rem]"></Icon>
    </a>
</div>
```

### 4.2 关键差异对比表

| 属性 | 修改前 | 修改后 | 影响 |
|------|--------|--------|------|
| 背景色 | `bg-[var(--card-bg)]` | 无 | 移除背景，按钮独立显示 |
| 圆角 | `rounded-lg` | 无 | 移除容器圆角，按钮保留独立圆角 |
| 间距 | 无 | `gap-2` | 添加按钮间距，视觉分离 |
| 按钮样式 | 继承容器背景 | 独立 `btn-card` 背景 | 每个按钮独立显示 |

---

## 步骤五：样式效果详解

### 5.1 视觉效果对比

#### 修改前

```
┌─────────────────────────────────────────┐
│  <  │  1  2  3  4  5  6  │  >  │
│     └─────────────────────┘            │
│      (连接在一起的矩形块)                │
└─────────────────────────────────────────┘
```

**特点**：
- 所有页码在一个带背景的容器中
- 按钮之间无间距
- 只有外层有圆角

#### 修改后

```
┌─────────────────────────────────────────┐
│  <  │  ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐ ┌─┐  │  >  │
│     │  │1│ │2│ │3│ │4│ │5│ │6│  │     │
│     │  └─┘ └─┘ └─┘ └─┘ └─┘ └─┘  │     │
│     └───┬───┬───┬───┬───┬───┘     │
│        (独立的圆角方块，有间距)        │
└─────────────────────────────────────────┘
```

**特点**：
- 每个页码都是独立的圆角方块
- 按钮之间有清晰间距
- 每个按钮都有独立圆角

### 5.2 CSS 类详解

#### `btn-card` 类

定义在 `src/styles/main.css` 中：

```css
.btn-card {
    @apply transition flex items-center justify-center 
    bg-[var(--card-bg)] 
    hover:bg-[var(--btn-card-bg-hover)]
    active:bg-[var(--btn-card-bg-active)]
}
```

**作用**：
- 设置按钮背景色
- 添加悬停效果（`hover:bg-[var(--btn-card-bg-hover)]`）
- 添加点击效果（`active:bg-[var(--btn-card-bg-active)]`）
- 添加过渡动画（`transition`）

#### `rounded-lg` 类

Tailwind CSS 工具类：

```css
.rounded-lg {
    border-radius: 0.5rem; /* 8px */
}
```

**作用**：
- 给元素添加 8px 的圆角
- 使按钮呈现圆角方块外观

#### `gap-2` 类

Tailwind CSS Flexbox 间距类：

```css
.gap-2 {
    gap: 0.5rem; /* 8px */
}
```

**作用**：
- 在 Flexbox 容器中，子元素之间添加 8px 的间距
- 可以是水平间距（`flex-row`）或垂直间距（`flex-col`）

### 5.3 当前页样式

当前页（激活状态）使用不同的样式：

```astro
<div class="h-11 w-11 rounded-lg bg-[var(--primary)] flex items-center justify-center
    font-bold text-white dark:text-black/70"
>
    {p}
</div>
```

**样式特点**：
- `bg-[var(--primary)]`：使用主题色作为背景
- `text-white`：白色文字（浅色模式）
- `dark:text-black/70`：深色文字（深色模式）
- `rounded-lg`：圆角方块

---

## 步骤六：进一步自定义（可选）

### 6.1 调整间距大小

如果您想调整页码按钮之间的间距，可以修改 `gap-2` 的值：

```astro
<!-- 较小间距（4px） -->
<div class="flex flex-row gap-1 items-center ...">

<!-- 适中间距（8px，推荐） -->
<div class="flex flex-row gap-2 items-center ...">

<!-- 较大间距（12px） -->
<div class="flex flex-row gap-3 items-center ...">

<!-- 很大间距（16px） -->
<div class="flex flex-row gap-4 items-center ...">
```

### 6.2 调整按钮大小

如果您想调整页码按钮的大小，可以修改 `w-11 h-11`：

```astro
<!-- 小按钮（36px × 36px） -->
<div class="h-9 w-9 rounded-lg ...">

<!-- 默认按钮（44px × 44px） -->
<div class="h-11 w-11 rounded-lg ...">

<!-- 大按钮（52px × 52px） -->
<div class="h-13 w-13 rounded-lg ...">
```

**注意**：需要同时修改当前页和普通页的按钮大小。

### 6.3 调整圆角大小

如果您想调整圆角的大小，可以修改 `rounded-lg`：

```astro
<!-- 小圆角（4px） -->
<div class="h-11 w-11 rounded-md ...">

<!-- 默认圆角（8px） -->
<div class="h-11 w-11 rounded-lg ...">

<!-- 大圆角（12px） -->
<div class="h-11 w-11 rounded-xl ...">

<!-- 超大圆角（16px） -->
<div class="h-11 w-11 rounded-2xl ...">
```

### 6.4 添加边框（可选）

如果您想给每个按钮添加边框，可以在按钮上添加边框类：

```astro
<!-- 普通页码按钮，添加边框 -->
<a href={url(getPageUrl(p))} aria-label={`Page ${p}`}
    class="btn-card w-11 h-11 rounded-lg overflow-hidden active:scale-[0.85] border border-black/10 dark:border-white/20"
>{p}</a>
```

### 6.5 自定义颜色（高级）

如果您想自定义按钮的颜色，可以修改 CSS 变量或直接使用颜色类：

```astro
<!-- 使用自定义背景色 -->
<a href={url(getPageUrl(p))} aria-label={`Page ${p}`}
    class="btn-card w-11 h-11 rounded-lg overflow-hidden active:scale-[0.85] bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
>{p}</a>
```

---

## 技术原理深度解析

### 7.1 Flexbox 布局原理

分页组件使用 Flexbox 布局来排列按钮：

```css
display: flex;
flex-direction: row; /* 水平排列 */
gap: 0.5rem; /* 子元素间距 */
```

**Flexbox 优势**：
- 自动处理元素对齐
- 轻松控制间距
- 响应式友好

### 7.2 CSS 变量系统

Fuwari 使用 CSS 变量来管理主题颜色：

```css
:root {
    --card-bg: white; /* 浅色模式背景 */
    --primary: oklch(0.70 0.14 var(--hue)); /* 主题色 */
}

:root.dark {
    --card-bg: oklch(0.23 0.015 var(--hue)); /* 深色模式背景 */
    --primary: oklch(0.75 0.14 var(--hue)); /* 深色模式主题色 */
}
```

**变量优势**：
- 统一管理颜色
- 支持深色模式
- 易于主题切换

### 7.3 Tailwind CSS 工具类

Fuwari 使用 Tailwind CSS 来快速构建样式：

**间距系统**：
- `gap-1` = 0.25rem = 4px
- `gap-2` = 0.5rem = 8px
- `gap-3` = 0.75rem = 12px
- `gap-4` = 1rem = 16px

**圆角系统**：
- `rounded-md` = 0.375rem = 6px
- `rounded-lg` = 0.5rem = 8px
- `rounded-xl` = 0.75rem = 12px
- `rounded-2xl` = 1rem = 16px

### 7.4 为什么移除外层背景有效？

**原始问题**：
- 外层容器有背景色，视觉上将所有按钮包裹在一起
- 只有外层有圆角，内部按钮没有独立视觉边界

**解决方案**：
- 移除外层背景，每个按钮的背景独立显示
- 移除外层圆角，每个按钮的圆角独立显示
- 添加间距，在视觉上明确分离每个按钮

### 7.5 响应式设计考虑

修改后的样式在不同屏幕尺寸下都能正常工作：

**桌面端**：
- 所有按钮水平排列
- 间距清晰可见

**移动端**：
- 按钮自动换行（如果需要）
- 间距保持一致性

---

## 常见问题解答

### Q1: 修改后页码按钮没有间距怎么办？

**A:** 请检查以下几点：

1. **确认 `gap-2` 类已添加**：
   ```astro
   <div class="flex flex-row gap-2 items-center ...">
   ```

2. **确认父容器使用 Flexbox**：
   ```astro
   <div class="flex flex-row ...">
   ```

3. **检查是否有其他 CSS 覆盖**：
   - 打开浏览器开发者工具
   - 检查 `gap` 属性是否生效

### Q2: 按钮之间的间距太大或太小怎么办？

**A:** 调整 `gap` 的值：

```astro
<!-- 较小间距 -->
<div class="flex flex-row gap-1 ...">

<!-- 较大间距 -->
<div class="flex flex-row gap-3 ...">
```

### Q3: 如何恢复原来的连接样式？

**A:** 将代码改回：

```astro
<div class="bg-[var(--card-bg)] flex flex-row rounded-lg items-center text-neutral-700 dark:text-neutral-300 font-bold">
```

### Q4: 修改后按钮样式不统一怎么办？

**A:** 确保所有按钮都使用相同的类：

- 普通页按钮：`btn-card w-11 h-11 rounded-lg`
- 当前页按钮：`h-11 w-11 rounded-lg bg-[var(--primary)]`

### Q5: 在深色模式下样式正常吗？

**A:** 是的，修改后的样式完全支持深色模式：

- `btn-card` 类自动适配深色模式
- `text-neutral-700 dark:text-neutral-300` 自动切换文字颜色
- CSS 变量系统自动处理主题切换

### Q6: 可以给按钮添加阴影效果吗？

**A:** 可以，添加 Tailwind 的阴影类：

```astro
<a href={url(getPageUrl(p))} aria-label={`Page ${p}`}
    class="btn-card w-11 h-11 rounded-lg overflow-hidden active:scale-[0.85] shadow-md hover:shadow-lg"
>{p}</a>
```

### Q7: 如何让按钮在移动端更大？

**A:** 使用响应式类：

```astro
<a href={url(getPageUrl(p))} aria-label={`Page ${p}`}
    class="btn-card w-12 h-12 md:w-11 md:h-11 rounded-lg ..."
>{p}</a>
```

这样在移动端按钮是 48px × 48px，桌面端是 44px × 44px。

---

## 完整代码参考

### 修改后的完整组件代码

```astro
---
import type { Page } from "astro";
import { Icon } from "astro-icon/components";
import { url } from "../../utils/url-utils";

interface Props {
	page: Page;
	class?: string;
	style?: string;
}

const { page, style } = Astro.props;

const HIDDEN = -1;

const className = Astro.props.class;

const ADJ_DIST = 2;
const VISIBLE = ADJ_DIST * 2 + 1;

// 计算显示的页码范围
let count = 1;
let l = page.currentPage;
let r = page.currentPage;
while (0 < l - 1 && r + 1 <= page.lastPage && count + 2 <= VISIBLE) {
	count += 2;
	l--;
	r++;
}
while (0 < l - 1 && count < VISIBLE) {
	count++;
	l--;
}
while (r + 1 <= page.lastPage && count < VISIBLE) {
	count++;
	r++;
}

let pages: number[] = [];
if (l > 1) pages.push(1);
if (l === 3) pages.push(2);
if (l > 3) pages.push(HIDDEN);
for (let i = l; i <= r; i++) pages.push(i);
if (r < page.lastPage - 2) pages.push(HIDDEN);
if (r === page.lastPage - 2) pages.push(page.lastPage - 1);
if (r < page.lastPage) pages.push(page.lastPage);

const getPageUrl = (p: number) => {
	if (p === 1) return "/";
	return `/${p}/`;
};
---

<div class:list={[className, "flex flex-row gap-3 justify-center"]} style={style}>
    <!-- 上一页按钮 -->
    <a href={page.url.prev || ""} aria-label={page.url.prev ? "Previous Page" : null}
       class:list={["btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11",
           {"disabled": page.url.prev == undefined}
       ]}
    >
        <Icon name="material-symbols:chevron-left-rounded" class="text-[1.75rem]"></Icon>
    </a>
    
    <!-- 页码容器：独立圆角方块样式 -->
    <div class="flex flex-row gap-2 items-center text-neutral-700 dark:text-neutral-300 font-bold">
        {pages.map((p) => {
            if (p == HIDDEN)
                return <Icon name="material-symbols:more-horiz" class="mx-1"/>;
            if (p == page.currentPage)
                return <div class="h-11 w-11 rounded-lg bg-[var(--primary)] flex items-center justify-center
                    font-bold text-white dark:text-black/70"
                >
                    {p}
                </div>
            return <a href={url(getPageUrl(p))} aria-label={`Page ${p}`}
                class="btn-card w-11 h-11 rounded-lg overflow-hidden active:scale-[0.85]"
            >{p}</a>
        })}
    </div>
    
    <!-- 下一页按钮 -->
    <a href={page.url.next || ""} aria-label={page.url.next ? "Next Page" : null}
       class:list={["btn-card overflow-hidden rounded-lg text-[var(--primary)] w-11 h-11",
           {"disabled": page.url.next == undefined}
       ]}
    >
        <Icon name="material-symbols:chevron-right-rounded" class="text-[1.75rem]"></Icon>
    </a>
</div>
```

### 关键修改点总结

| 行号 | 修改前 | 修改后 |
|------|--------|--------|
| 62 | `class="bg-[var(--card-bg)] flex flex-row rounded-lg items-center ..."` | `class="flex flex-row gap-2 items-center ..."` |

---

## 总结

通过本教程，您已经成功将 Fuwari 博客的分页组件从"连接在一起的矩形块"样式改为"独立的圆角方块"样式。主要修改包括：

### ✅ 完成的修改

1. **移除外层背景**：删除 `bg-[var(--card-bg)]` 类
2. **移除外层圆角**：删除 `rounded-lg` 类
3. **添加按钮间距**：添加 `gap-2` 类（8px 间距）

### 🎨 实现的效果

1. ✅ **独立显示**：每个页码按钮都是独立的元素
2. ✅ **圆角方块**：每个按钮都有独立的圆角（`rounded-lg`）
3. ✅ **清晰间距**：按钮之间有 8px 的间距
4. ✅ **保持功能**：所有交互功能（悬停、点击）完全正常
5. ✅ **深色模式**：完美支持深色模式

### 📝 核心知识点

1. **Flexbox 布局**：使用 `flex` 和 `gap` 控制元素排列和间距
2. **Tailwind CSS**：使用工具类快速构建样式
3. **CSS 变量**：使用 CSS 变量管理主题颜色
4. **组件结构**：理解 Astro 组件的结构和逻辑

### 🔧 进一步自定义

如果您想进一步自定义样式，可以：

- 调整间距：修改 `gap-2` 的值
- 调整按钮大小：修改 `w-11 h-11`
- 调整圆角：修改 `rounded-lg`
- 添加边框：添加 `border` 类
- 自定义颜色：使用自定义 CSS 变量或颜色类

### 💡 最佳实践

1. **保持一致性**：确保所有按钮使用相同的样式类
2. **响应式设计**：在不同屏幕尺寸下测试效果
3. **可访问性**：保留 `aria-label` 等无障碍属性
4. **性能考虑**：使用 CSS 类而不是内联样式

---

**相关文章**：
- [Fuwari Banner 全屏显示教程](/posts/fuwari/fuwari-banner全屏显示教程/fuwari-banner全屏显示教程/)
- [Fuwari 添加友链页面详细教程](/posts/fuwari/fuwari添加友链页面/fuwari添加友链页面/)
- [Fuwari 文章内跳转方法与注意事项](/posts/fuwari/fuwari文章内跳转方法与注意事项/fuwari文章内跳转方法与注意事项/)

---

**最后更新**：2025年1月15日

**教程版本**：v1.0

**适用版本**：Fuwari 最新版本

---

## 附录：相关文件清单

### 修改的文件

- ✅ `src/components/control/Pagination.astro`

### 参考的文件

- 📄 `src/styles/main.css` - 样式定义
- 📄 `src/styles/variables.styl` - CSS 变量定义
- 📄 `src/pages/[...page].astro` - 使用分页组件的页面

### 相关 CSS 类

- `.btn-card` - 按钮卡片样式
- `.rounded-lg` - 大圆角
- `.gap-2` - Flexbox 间距

---

**希望本教程对您有帮助！如有任何问题，欢迎反馈。** 🎉

