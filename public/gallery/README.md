# 相册目录

这个目录专门用于存放相册的图片和视频文件，与博客其他图片文件分开管理。

## 目录结构

```
gallery/
├── images/     # 相册图片目录
│   ├── landscape1.jpg
│   ├── portrait1.jpg
│   └── ...
└── videos/     # 相册视频目录
    ├── video1.mp4
    ├── video2.mp4
    └── ...
```

## 使用方法

1. **添加图片**：将图片文件放入 `images/` 目录
2. **添加视频**：将视频文件放入 `videos/` 目录
3. **配置相册**：在 `src/config/gallery.ts` 中添加相应的配置

## 配置示例

在 `src/config/gallery.ts` 中使用以下路径格式：

```typescript
{
  type: 'image',
  src: '/gallery/images/landscape1.jpg', // 指向 public/gallery/images/landscape1.jpg
  title: '风景照片 1',
}
```

```typescript
{
  type: 'video',
  src: '/gallery/videos/video1.mp4', // 指向 public/gallery/videos/video1.mp4
  title: '示例视频',
  thumbnail: '/gallery/images/video-thumb.jpg', // 视频缩略图
}
```

## 注意事项

- 所有相册文件都应放在 `public/gallery/` 目录下
- 图片推荐格式：JPG、PNG、WebP
- 视频推荐格式：MP4、WebM
- 建议对图片进行优化以提升加载速度
- 视频文件可能较大，建议压缩后再上传

