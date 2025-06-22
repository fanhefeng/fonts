// next.config.ts
const nextConfig = {
	output: "export",
	reactStrictMode: true,
	experimental: {
		optimizeCss: true,
	},
	// 字体加载器配置
	fontLoaders: [
		{
			loader: "next/font/local", // 使用Next.js内置的本地字体加载器
			options: {
				url: true, // 启用URL模式，允许通过URL加载字体文件
			},
		},
	],
	// 启用SWC编译器的代码压缩功能
	// SWC是由Rust编写的高性能JavaScript/TypeScript编译器
	// 比默认的Terser压缩器性能更好
	swcMinify: true,
};

export default nextConfig;
