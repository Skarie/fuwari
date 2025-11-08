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
	{
		name: "壁纸",
		description: "精美壁纸收藏",
		items: [
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】8k-可爱.png",
				title: "8k-可爱",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】Chris插画-插画.png",
				title: "Chris插画",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】上岸-励志奋斗-考公.png",
				title: "上岸-励志奋斗-考公",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】不想上班-想放假.png",
				title: "不想上班-想放假",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】事事顺心-分区背景.png",
				title: "事事顺心-分区背景",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】云-云团-君之那轮.png",
				title: "云-云团-君之那轮",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】休闲美女-圣诞树.png",
				title: "休闲美女-圣诞树",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】伞-小白.png",
				title: "伞-小白",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】动漫美女-古风艺术.png",
				title: "动漫美女-古风艺术",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】动物-可爱-围栏.png",
				title: "动物-可爱-围栏",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】可爱动物-喵-喵星人.png",
				title: "可爱动物-喵-喵星人",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】大利-大橘.png",
				title: "大利-大橘",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】工资一千八-打工人.png",
				title: "工资一千八-打工人",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】房间-温馨.png",
				title: "房间-温馨",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】机甲-甲.png",
				title: "机甲-甲",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】美-美女.png",
				title: "美-美女",
			},
			{
				type: "image",
				src: "/gallery/images/壁纸/【哲风壁纸】美女-蒙面.png",
				title: "美女-蒙面",
			},
		],
	},
	{
		name: "哲风壁纸",
		description: "WLOP作品及其他精选",
		items: [
			{
				type: "image",
				src: "/gallery/images/images/【哲风壁纸】WLOP-WLOP作品.png",
				title: "WLOP-WLOP作品",
			},
			{
				type: "image",
				src: "/gallery/images/images/【哲风壁纸】个性写真-时尚少女.png",
				title: "个性写真-时尚少女",
			},
			{
				type: "image",
				src: "/gallery/images/images/【哲风壁纸】倒影-宁静水面-山水.png",
				title: "倒影-宁静水面-山水",
			},
		],
	},
	{
		name: "鬼刀",
		description: "鬼刀系列图片",
		items: [
			{
				type: "image",
				src: "/gallery/images/鬼刀/1.jpg",
				title: "鬼刀 1",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/2.jpg",
				title: "鬼刀 2",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/3.jpg",
				title: "鬼刀 3",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/4.jpg",
				title: "鬼刀 4",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/5.jpg",
				title: "鬼刀 5",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/6.jpg",
				title: "鬼刀 6",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/7.jpg",
				title: "鬼刀 7",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/8.jpg",
				title: "鬼刀 8",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/9.jpg",
				title: "鬼刀 9",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/10.jpg",
				title: "鬼刀 10",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/11.jpg",
				title: "鬼刀 11",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/12.jpg",
				title: "鬼刀 12",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/13.jpg",
				title: "鬼刀 13",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/14.jpg",
				title: "鬼刀 14",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/15.jpg",
				title: "鬼刀 15",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/16.jpg",
				title: "鬼刀 16",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/17.jpg",
				title: "鬼刀 17",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/18.jpg",
				title: "鬼刀 18",
			},
			{
				type: "image",
				src: "/gallery/images/鬼刀/19.jpg",
				title: "鬼刀 19",
			},
		],
	},
	{
		name: "视频",
		description: "精选视频",
		items: [
			{
				type: "video",
				src: "/gallery/videos/【哲风壁纸】二次元-动漫女孩.mp4",
				title: "二次元-动漫女孩",
			},
			{
				type: "video",
				src: "/gallery/videos/【哲风壁纸】二次元-梦幻-白发.mp4",
				title: "二次元-梦幻-白发",
			},
		],
	},
];
