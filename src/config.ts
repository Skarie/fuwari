import type {
	ExpressiveCodeConfig,
	LicenseConfig,
	NavBarConfig,
	ProfileConfig,
	SiteConfig,
} from "./types/config";
import { LinkPreset } from "./types/config";

export const siteConfig: SiteConfig = {
	title: "翊羽不会飞",
	subtitle: "记录生活点滴，分享技术与创作",
	lang: "zh_CN", // 语言代码，例如：'en', 'zh_CN', 'zh_TW', 'ja', 'ko' 等
	themeColor: {
		hue: 250, // 默认主题色，范围 0 到 360。例如：0=红色，200=青色，250=青色，345=粉色
		fixed: true, // 是否隐藏主题色选择器（访客无法修改主题色）
	},
	panelOpacity: {
		opacity: 0.75, // 默认面板透明度，范围 0 到 1。例如：0=完全透明，1=完全不透明
	},
	banner: {
		enable: false,
		src: "assets/images/demo-banner.png", // Banner 图片路径。相对于 /src 目录，如果以 '/' 开头则相对于 /public 目录
		position: "center", // Banner 图片位置，等同于 object-position，仅支持 'top', 'center', 'bottom'，默认为 'center'
		credit: {
			enable: false, // 是否显示 Banner 图片的版权信息
			text: "", // 版权文本内容
			url: "", // （可选）原作品或艺术家页面的链接
		},
	},
	toc: {
		enable: true, // 是否在文章右侧显示目录
		depth: 2, // 目录中显示的最大标题层级，范围 1 到 3
	},
	favicon: [
		// 留空数组以使用默认 favicon
		// {
		//   src: '/favicon/icon.png',    // Favicon 路径，相对于 /public 目录
		//   theme: 'light',              // （可选）'light' 或 'dark'，仅在为亮色和暗色模式设置不同 favicon 时使用
		//   sizes: '32x32',              // （可选）Favicon 尺寸，仅在拥有不同尺寸的 favicon 时使用
		// }
	],
};

export const navBarConfig: NavBarConfig = {
	links: [
		LinkPreset.Home,
		LinkPreset.Archive,
		LinkPreset.About,
		{
			name: "相册",
			url: "/gallery/", // 相册页面路径
			external: false,
		},
		{
			name: "友链",
			url: "/links/", // 友链页面路径
			external: false,
		},
		{
			name: "GitHub",
			url: "https://github.com/saicaca/fuwari", // 内部链接不应包含基础路径，因为会自动添加
			external: true, // 显示外部链接图标，并在新标签页中打开
		},
	],
};

export const profileConfig: ProfileConfig = {
	avatar: "assets/images/avatar.png", // 头像路径。相对于 /src 目录，如果以 '/' 开头则相对于 /public 目录
	name: "李翊羽",
	bio: "红衣佳人白衣友,朝与同歌暮同酒世人谓我恋长安,其实只恋长安某",
	links: [
		{
			name: "Twitter",
			icon: "fa6-brands:twitter", // 图标代码，访问 https://icones.js.org/ 查找图标
			// 如果图标集未安装，需要安装对应的图标集
			// `pnpm add @iconify-json/<icon-set-name>`
			url: "https://twitter.com",
		},
		{
			name: "Steam",
			icon: "fa6-brands:steam",
			url: "https://store.steampowered.com",
		},
		{
			name: "GitHub",
			icon: "fa6-brands:github",
			url: "https://github.com/Skarie",
		},
	],
};

export const licenseConfig: LicenseConfig = {
	enable: true,
	name: "CC BY-NC-SA 4.0",
	url: "https://creativecommons.org/licenses/by-nc-sa/4.0/",
};

export const expressiveCodeConfig: ExpressiveCodeConfig = {
	// 注意：某些样式（如背景颜色）会被覆盖，详见 astro.config.mjs 文件
	// 请选择暗色主题，因为此博客主题目前仅支持暗色背景
	theme: "github-dark",
};
