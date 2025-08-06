// next.config.mjs
const nextConfig = {
	output: "export",
	reactStrictMode: true,
	experimental: {
		optimizeCss: true,
	},
	// 图片优化配置
	images: {
		unoptimized: true, // 静态导出需要
	},
	// 减少预加载资源
	compiler: {
		removeConsole: process.env.NODE_ENV === 'production',
	},
};

export default nextConfig;
