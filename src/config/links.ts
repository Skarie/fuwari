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
		name: "七夏浅笑",
		url: "https://www.julydate.com/",
		description: "七月之约，夏末浅笑",
		avatar: "assets/images/head.jpg",
	},
	{
		name: "伍拾柒",
		url: "https://blog.efu.me/",
		description: "只有迎风，风筝才能飞得更高。",
		avatar: "https://cdn.lightxi.com/cloudreve/uploads/2025/02/14/yY8tgUJU_891fe376065dc8b9eacecfde3b6b6e8f.jpg",
	},
	// 在这里添加更多友链
	// 示例：使用外部链接
	// {
	// 	name: "示例友链1",
	// 	url: "https://example.com",
	// 	description: "这是一个示例友链",
	// 	avatar: "https://example.com/avatar.jpg",
	// },
	// 示例：使用 public 目录下的图片
	// {
	// 	name: "示例友链2",
	// 	url: "https://example.com",
	// 	description: "这是一个示例友链",
	// 	avatar: "/images/avatar.jpg", // 指向 public/images/avatar.jpg
	// },
	// 示例：使用本地路径（相对于 src 目录）
	// {
	// 	name: "示例友链3",
	// 	url: "https://example.com",
	// 	description: "这是一个示例友链",
	// 	avatar: "assets/images/avatar.jpg", // 指向 src/assets/images/avatar.jpg
	// },
];

