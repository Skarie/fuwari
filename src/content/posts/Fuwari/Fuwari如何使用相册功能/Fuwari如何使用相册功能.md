---
title: Fuwari 如何使用相册功能
published: 2025-11-08
description: 详细教程：如何在 Fuwari 博客中使用相册功能，添加图片和视频，管理相册内容
tags:
  - Fuwari
  - 相册
  - 教程
  - Astro
category: Fuwari
draft: false
---

# Fuwari 如何使用相册功能

本教程将详细讲解如何在 Fuwari 博客中使用相册功能，包括如何添加图片和视频、配置相册内容、管理分类等。

> **注意**：如果你还没有安装相册功能，请先查看 [Fuwari 从零开始添加相册功能](/posts/fuwari/fuwari从零开始添加相册功能/) 教程。

## 📋 目录

- [快速开始](#快速开始)
- [相册结构说明](#相册结构说明)
- [添加图片到相册](#添加图片到相册)
- [添加视频到相册](#添加视频到相册)
- [配置相册分类](#配置相册分类)
- [使用外部链接](#使用外部链接)
- [批量添加内容](#批量添加内容)
- [管理相册内容](#管理相册内容)
- [常见问题](#常见问题)
- [最佳实践](#最佳实践)

## 快速开始

如果你已经完成了相册功能的安装，现在只需要：

1. **添加图片/视频文件**到 `public/gallery/images/` 或 `public/gallery/videos/` 目录
2. **编辑配置文件** `src/config/gallery.ts`，添加你的内容配置
3. **刷新页面**，查看效果

## 相册结构说明

### 目录结构

相册使用以下目录结构：

```
public/
└── gallery/              # 相册根目录
    ├── images/           # 相册图片目录
    │   ├── 壁纸/        # 分类目录（可选）
    │   ├── 风景/        # 分类目录（可选）
    │   └── ...          # 其他分类或图片
    └── videos/           # 相册视频目录
        └── ...          # 视频文件
```

### 配置文件位置

相册配置位于 `src/config/gallery.ts` 文件。

## 添加图片到相册

### 方法一：直接添加到根目录

#### 步骤 1：复制图片文件

将图片文件复制到 `public/gallery/images/` 目录：

```bash
# Windows
copy "C:\Users\YourName\Pictures\photo.jpg" "public\gallery\images\photo.jpg"

# Mac/Linux
cp ~/Pictures/photo.jpg public/gallery/images/photo.jpg
```

或者手动操作：
1. 打开文件管理器
2. 找到你的图片文件
3. 复制图片
4. 粘贴到 `public/gallery/images/` 目录

#### 步骤 2：在配置文件中添加

打开 `src/config/gallery.ts` 文件，在相应的分类中添加配置：

```typescript
export const galleryCategories: GalleryCategory[] = [
	{
		name: "我的照片",
		description: "我的摄影作品",
		items: [
			{
				type: "image",
				src: "/gallery/images/photo.jpg", // 图片路径
				title: "照片标题", // 可选
				description: "照片描述", // 可选
			},
		],
	},
];
```

### 方法二：使用分类目录

#### 步骤 1：创建分类目录（可选）

```bash
# Windows
mkdir public\gallery\images\风景

# Mac/Linux
mkdir -p public/gallery/images/风景
```

#### 步骤 2：复制图片到分类目录

```bash
# Windows
copy "photo.jpg" "public\gallery\images\风景\photo.jpg"
```

#### 步骤 3：在配置文件中添加

```typescript
{
	name: "风景",
	description: "风景摄影",
	items: [
		{
			type: "image",
			src: "/gallery/images/风景/photo.jpg", // 注意路径包含分类目录
			title: "风景照片",
		},
	],
}
```

### 图片路径规则

**重要**：配置中的路径必须遵循以下规则：

1. **本地文件路径**：以 `/` 开头，相对于 `public/` 目录
   - ✅ 正确：`/gallery/images/photo.jpg`
   - ✅ 正确：`/gallery/images/风景/photo.jpg`
   - ❌ 错误：`gallery/images/photo.jpg`（缺少开头的 `/`）
   - ❌ 错误：`public/gallery/images/photo.jpg`（不需要 `public/`）

2. **文件路径大小写**：在某些系统上路径是大小写敏感的，确保路径大小写正确

3. **文件名**：建议使用英文文件名，避免特殊字符

## 添加视频到相册

### 步骤 1：复制视频文件

将视频文件复制到 `public/gallery/videos/` 目录：

```bash
# Windows
copy "C:\Users\YourName\Videos\video.mp4" "public\gallery\videos\video.mp4"

# Mac/Linux
cp ~/Videos/video.mp4 public/gallery/videos/video.mp4
```

### 步骤 2：在配置文件中添加

打开 `src/config/gallery.ts` 文件，添加视频配置：

```typescript
{
	name: "视频",
	description: "精选视频",
	items: [
		{
			type: "video",
			src: "/gallery/videos/video.mp4", // 视频路径
			title: "视频标题",
			description: "视频描述",
			thumbnail: "/gallery/images/video-thumb.jpg", // 可选：视频缩略图
			width: 1920,  // 可选：视频宽度
			height: 1080, // 可选：视频高度
		},
	],
}
```

### 视频缩略图

可以为视频添加缩略图，提升用户体验：

1. **创建缩略图**：从视频中截取一帧作为缩略图
2. **保存缩略图**：将缩略图保存到 `public/gallery/images/` 目录
3. **配置缩略图**：在视频配置中添加 `thumbnail` 属性

```typescript
{
	type: "video",
	src: "/gallery/videos/video.mp4",
	title: "视频标题",
	thumbnail: "/gallery/images/video-thumb.jpg", // 缩略图路径
}
```

## 配置相册分类

### 创建新分类

在 `src/config/gallery.ts` 文件中添加新的分类：

```typescript
export const galleryCategories: GalleryCategory[] = [
	// 现有分类...
	{
		name: "新分类", // 分类名称（显示在分类按钮上）
		description: "分类描述", // 可选：分类描述
		items: [
			// 分类下的图片和视频
			{
				type: "image",
				src: "/gallery/images/photo1.jpg",
				title: "图片 1",
			},
			{
				type: "image",
				src: "/gallery/images/photo2.jpg",
				title: "图片 2",
			},
		],
	},
];
```

### 分类配置说明

- **name**：分类名称，会显示在分类按钮上
- **description**：分类描述（可选），用于说明分类内容
- **items**：该分类下的所有媒体项（图片和视频）

### 分类示例

```typescript
export const galleryCategories: GalleryCategory[] = [
	{
		name: "壁纸",
		description: "精美壁纸收藏",
		items: [
			// 壁纸图片...
		],
	},
	{
		name: "风景",
		description: "风景摄影作品",
		items: [
			// 风景图片...
		],
	},
	{
		name: "视频",
		description: "精选视频",
		items: [
			// 视频...
		],
	},
];
```

## 使用外部链接

### 添加外部图片

如果你使用图床或 CDN，可以使用外部链接：

```typescript
{
	type: "image",
	src: "https://example.com/image.jpg", // 外部图片链接
	title: "外部图片",
}
```

### 添加外部视频

```typescript
{
	type: "video",
	src: "https://example.com/video.mp4", // 外部视频链接
	title: "外部视频",
}
```

### 外部链接的优势

- ✅ 不占用服务器存储空间
- ✅ 可以享受 CDN 加速
- ✅ 便于管理大量媒体文件

### 注意事项

- 确保外部链接可访问
- 注意外部服务的稳定性
- 考虑加载速度和带宽

## 批量添加内容

### 使用脚本批量生成配置

如果你有很多图片需要添加，可以编写脚本自动生成配置：

#### Node.js 脚本示例

创建 `scripts/generate-gallery-config.js` 文件：

```javascript
const fs = require('fs');
const path = require('path');

// 配置：相册分类目录
const categoryDir = path.join(__dirname, '../public/gallery/images/壁纸');
const categoryName = '壁纸';
const categoryDescription = '精美壁纸收藏';

// 读取目录中的所有文件
const files = fs.readdirSync(categoryDir);

// 过滤出图片文件
const imageFiles = files.filter(file => 
	/\.(jpg|jpeg|png|webp|gif)$/i.test(file)
);

// 生成配置项
const items = imageFiles.map(file => ({
	type: 'image',
	src: `/gallery/images/${categoryName}/${file}`,
	title: file.replace(/\.[^/.]+$/, ''), // 使用文件名作为标题（去掉扩展名）
}));

// 生成分类配置
const category = {
	name: categoryName,
	description: categoryDescription,
	items: items,
};

// 输出配置（可以直接复制到 gallery.ts）
console.log(JSON.stringify(category, null, 2));

// 或者输出为可以直接使用的 TypeScript 代码
console.log('\n// TypeScript 配置：');
console.log(`{
	name: "${categoryName}",
	description: "${categoryDescription}",
	items: [`);
items.forEach(item => {
	console.log(`		{
			type: "${item.type}",
			src: "${item.src}",
			title: "${item.title}",
		},`);
});
console.log('	],\n},');
```

#### 运行脚本

```bash
node scripts/generate-gallery-config.js
```

然后将输出的配置复制到 `src/config/gallery.ts` 文件中。

### 批量添加多个分类

如果你有多个分类目录，可以修改脚本：

```javascript
const categories = [
	{ dir: '壁纸', name: '壁纸', description: '精美壁纸收藏' },
	{ dir: '风景', name: '风景', description: '风景摄影作品' },
	{ dir: '人物', name: '人物', description: '人物摄影' },
];

categories.forEach(({ dir, name, description }) => {
	const categoryDir = path.join(__dirname, `../public/gallery/images/${dir}`);
	// ... 生成配置
});
```

## 管理相册内容

### 添加新内容

1. **复制文件**：将图片/视频复制到相应目录
2. **更新配置**：在 `src/config/gallery.ts` 中添加配置项
3. **刷新页面**：重新加载页面查看效果

### 删除内容

1. **删除文件**：从 `public/gallery/` 目录删除文件
2. **更新配置**：从 `src/config/gallery.ts` 中删除对应配置项

### 修改内容

1. **修改文件**：替换 `public/gallery/` 目录中的文件（保持文件名相同）
2. **更新配置**：在 `src/config/gallery.ts` 中修改配置（如标题、描述等）

### 重新组织分类

1. **移动文件**：将文件移动到新的分类目录
2. **更新配置**：在 `src/config/gallery.ts` 中更新路径和分类

## 配置项详细说明

### GalleryItem 配置项

```typescript
{
	type: "image" | "video",  // 媒体类型：必填
	src: string,              // 媒体源路径：必填
	thumbnail?: string,       // 缩略图（主要用于视频）：可选
	title?: string,           // 标题：可选
	description?: string,     // 描述：可选
	width?: number,           // 宽度（主要用于视频）：可选
	height?: number,          // 高度（主要用于视频）：可选
}
```

### 配置示例

#### 图片配置

```typescript
{
	type: "image",
	src: "/gallery/images/photo.jpg",
	title: "照片标题",
	description: "照片描述",
}
```

#### 视频配置（完整）

```typescript
{
	type: "video",
	src: "/gallery/videos/video.mp4",
	title: "视频标题",
	description: "视频描述",
	thumbnail: "/gallery/images/video-thumb.jpg",
	width: 1920,
	height: 1080,
}
```

#### 视频配置（简化）

```typescript
{
	type: "video",
	src: "/gallery/videos/video.mp4",
	title: "视频标题",
}
```

## 完整配置示例

以下是一个完整的相册配置示例：

```typescript
export const galleryCategories: GalleryCategory[] = [
	{
		name: "壁纸",
		description: "精美壁纸收藏",
		items: [
			{
				type: "image",
				src: "/gallery/images/壁纸/wallpaper1.jpg",
				title: "壁纸 1",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/wallpaper2.jpg",
				title: "壁纸 2",
			},
		],
	},
	{
		name: "风景",
		description: "风景摄影作品",
		items: [
			{
				type: "image",
				src: "/gallery/images/风景/landscape1.jpg",
				title: "风景 1",
				description: "美丽的风景照片",
			},
		],
	},
	{
		name: "视频",
		description: "精选视频",
		items: [
			{
				type: "video",
				src: "/gallery/videos/video1.mp4",
				title: "视频 1",
				thumbnail: "/gallery/images/video1-thumb.jpg",
			},
		],
	},
];
```

## 常见问题

### Q1: 图片无法显示

**问题**：配置了图片但页面显示 broken image 或无法加载

**解决方法**：
1. 检查文件路径是否正确（注意开头的 `/`）
2. 确认文件是否存在于 `public/gallery/images/` 目录
3. 检查文件名大小写是否正确
4. 查看浏览器控制台是否有 404 错误

### Q2: 路径配置错误

**问题**：配置了路径但图片无法加载

**常见错误**：
- ❌ `gallery/images/photo.jpg`（缺少开头的 `/`）
- ❌ `public/gallery/images/photo.jpg`（不应该包含 `public/`）
- ✅ `/gallery/images/photo.jpg`（正确）

### Q3: 图片显示但无法放大

**问题**：图片可以显示，但点击无法放大查看

**解决方法**：
1. 检查浏览器控制台是否有 JavaScript 错误
2. 确认 PhotoSwipe 库是否正确加载
3. 尝试刷新页面
4. 检查图片是否完全加载

### Q4: 视频无法播放

**问题**：视频无法播放或显示错误

**解决方法**：
1. 检查视频格式是否支持（推荐 MP4）
2. 确认视频文件路径正确
3. 检查视频文件是否损坏
4. 确认浏览器支持 HTML5 视频播放

### Q5: 分类切换不工作

**问题**：点击分类按钮没有反应

**解决方法**：
1. 检查浏览器控制台是否有 JavaScript 错误
2. 确认配置文件中的分类名称是否正确
3. 检查 HTML 元素是否正确渲染
4. 尝试刷新页面

### Q6: 添加新内容后看不到

**问题**：添加了新图片/视频，但页面没有显示

**解决方法**：
1. 确认文件已正确复制到目录
2. 检查配置文件是否正确更新
3. 确认配置文件语法正确（没有拼写错误）
4. 重启开发服务器
5. 清除浏览器缓存

## 最佳实践

### 1. 文件组织

- **使用分类目录**：将相关图片放在同一分类目录下
- **规范文件名**：使用有意义的文件名，避免特殊字符
- **优化图片大小**：压缩图片以减少加载时间

### 2. 配置管理

- **添加注释**：在配置文件中添加注释说明
- **保持结构清晰**：按分类组织配置
- **定期备份**：备份配置文件

### 3. 性能优化

- **图片优化**：使用 WebP 格式或压缩图片
- **懒加载**：相册已自动启用懒加载
- **使用 CDN**：对于大量图片，考虑使用 CDN

### 4. 内容管理

- **定期整理**：定期清理不需要的图片
- **分类管理**：合理组织分类，便于管理
- **添加描述**：为图片添加标题和描述，提升用户体验

### 5. 路径规范

- **统一使用相册目录**：所有相册文件放在 `/gallery/` 目录下
- **路径格式统一**：使用 `/gallery/images/...` 格式
- **避免路径错误**：注意路径大小写和特殊字符

## 配置模板

### 图片配置模板

```typescript
{
	type: "image",
	src: "/gallery/images/分类/文件名.jpg",
	title: "图片标题",
	description: "图片描述（可选）",
}
```

### 视频配置模板

```typescript
{
	type: "video",
	src: "/gallery/videos/文件名.mp4",
	title: "视频标题",
	description: "视频描述（可选）",
	thumbnail: "/gallery/images/缩略图.jpg", // 可选
	width: 1920,  // 可选
	height: 1080, // 可选
}
```

### 分类配置模板

```typescript
{
	name: "分类名称",
	description: "分类描述（可选）",
	items: [
		// 图片和视频配置项...
	],
}
```

## 使用技巧

### 技巧 1：快速添加多张图片

1. 将图片复制到分类目录
2. 使用脚本生成配置
3. 复制配置到 `gallery.ts` 文件

### 技巧 2：使用外部链接

对于大量图片，可以使用图床或 CDN：

```typescript
{
	type: "image",
	src: "https://your-cdn.com/images/photo.jpg",
	title: "图片标题",
}
```

### 技巧 3：添加视频缩略图

提升视频展示效果：

```typescript
{
	type: "video",
	src: "/gallery/videos/video.mp4",
	title: "视频标题",
	thumbnail: "/gallery/images/video-thumb.jpg",
}
```

### 技巧 4：组织分类

合理组织分类，便于管理：

- 按主题分类：风景、人物、建筑等
- 按时间分类：2024年、2025年等
- 按来源分类：摄影、设计、收藏等

## 总结

现在你已经学会了如何：

- ✅ 添加图片到相册
- ✅ 添加视频到相册
- ✅ 配置相册分类
- ✅ 使用外部链接
- ✅ 批量添加内容
- ✅ 管理相册内容

开始使用相册功能，展示你的照片和视频吧！

## 相关教程

- [Fuwari 从零开始添加相册功能](/posts/fuwari/fuwari从零开始添加相册功能/) - 详细的安装教程

## 参考资源

- [PhotoSwipe 官方文档](https://photoswipe.com/)
- [Astro 官方文档](https://docs.astro.build/)
- [Fuwari 主题仓库](https://github.com/saicaca/fuwari)

---

**祝你使用愉快！** 🎉

如有问题，请查看浏览器控制台的错误信息，或参考本文档的"常见问题"部分。

