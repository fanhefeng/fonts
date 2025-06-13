// next.config.ts
const nextConfig = {
  output: "export",
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    optimizeCss: true,
    fontLoaders: [
      { loader: "next/font/local", options: {} }, // 确保本地字体加载器已启用
    ],
  },
};

export default nextConfig;