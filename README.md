# 字体展示库 - Font Showcase

一个基于 Next.js 15 的现代字体展示应用，支持本地字体集合的预览、搜索、筛选和个性化配置。

> 仅供分享参考，使用前请先了解字体库协议。  
> Share fonts for reference. Please read the font license before using.

## 📖 项目简介

这是一个优雅的字体展示平台，让您能够：

- 🎨 实时预览多种字体效果
- 🔍 快速搜索和筛选字体
- ❤️ 收藏您喜欢的字体
- ⚙️ 自定义字体大小、颜色、粗细和样式
- 📱 响应式设计，支持各种设备

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 或 yarn 包管理器

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 开发模式

```bash
npm run dev
# 或
yarn dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

### 构建生产版本

```bash
npm run build
# 或
yarn build
```

### 启动生产服务器

```bash
npm start
# 或
yarn start
```

## 📁 项目结构

```
├── src/
│   ├── app/                    # Next.js 13+ App Router
│   │   ├── layout.tsx         # 根布局组件
│   │   ├── page.tsx           # 主页面
│   │   └── global.css         # 全局样式
│   ├── components/            # React 组件
│   │   └── ui/
│   │       ├── FontConfig.tsx # 字体配置控制面板
│   │       └── MyFont.tsx     # 单个字体展示组件
│   └── types/
│       └── global.d.ts        # TypeScript 类型定义
├── styles/
│   ├── fonts.ts               # 字体定义和导出
│   └── fonts/                 # 字体文件存储目录
│       ├── Christmas/         # 示例：Christmas 字体文件夹
│       ├── Poppins/          # 示例：Poppins 字体文件夹
│       └── ...               # 其他字体文件夹
├── next.config.ts             # Next.js 配置
├── package.json              # 项目依赖
└── README.md                 # 项目文档
```

## 🎯 如何添加新字体

### 第一步：准备字体文件

1. 创建字体文件夹

在 `styles/fonts/` 目录下创建以字体名称命名的文件夹：

```bash
mkdir styles/fonts/YourFontName
```

2. 添加字体文件

将字体文件放入该文件夹中。支持的格式：
- `.woff2` (推荐，现代浏览器支持)
- `.woff` (广泛兼容)
- `.ttf` (True Type Font)
- `.otf` (Open Type Font)
- `.eot` (Internet Explorer 支持)

示例目录结构：
```
styles/fonts/YourFontName/
├── YourFontName-Regular.woff2
├── YourFontName-Bold.woff2
├── YourFontName-Light.woff2
└── YourFontName-Medium.woff2
```

### 第二步：配置字体定义

编辑 `styles/fonts.ts` 文件：

```typescript
import localFont from "next/font/local";

// 1. 添加字体定义
export const YourFontName = localFont({
  src: [
    {
      path: "./fonts/YourFontName/YourFontName-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/YourFontName/YourFontName-Regular.woff2", 
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/YourFontName/YourFontName-Medium.woff2",
      weight: "500", 
      style: "normal",
    },
    {
      path: "./fonts/YourFontName/YourFontName-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-your-font-name", // CSS 变量名
  display: "swap", // 字体加载优化
});

// 2. 将字体添加到 myFonts 数组
export const myFonts = [
  // ... 现有字体
  YourFontName, // 添加新字体
];
```

### 第三步：更新布局文件

编辑 `src/app/layout.tsx`，在 body 的 className 中添加新字体：

```typescript
import { 
  // ... 现有导入
  YourFontName  // 添加新字体导入
} from "../../styles/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`
        ${/* ... 现有字体变量 */}
        ${YourFontName.variable}  // 添加新字体变量
        bg-gray-50 min-h-screen
      `}>
        {children}
      </body>
    </html>
  );
}
```

### 完整示例：添加 "Roboto" 字体

1. **文件结构**：
```
styles/fonts/Roboto/
├── Roboto-Light.woff2
├── Roboto-Regular.woff2
├── Roboto-Medium.woff2
└── Roboto-Bold.woff2
```

2. **fonts.ts 配置**：
```typescript
export const Roboto = localFont({
  src: [
    {
      path: "./fonts/Roboto/Roboto-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "./fonts/Roboto/Roboto-Regular.woff2",
      weight: "400", 
      style: "normal",
    },
    {
      path: "./fonts/Roboto/Roboto-Medium.woff2",
      weight: "500",
      style: "normal", 
    },
    {
      path: "./fonts/Roboto/Roboto-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-roboto",
  display: "swap",
});

export const myFonts = [
  Christmas,
  Iconmoon,
  Music,
  PingFangSC,
  PingFangTC,
  Poppins,
  Pragmata,
  RobotoMono,
  Roboto, // 新增
];
```

3. **layout.tsx 更新**：
```typescript
import { 
  Christmas, 
  Iconmoon, 
  Music, 
  PingFangSC, 
  PingFangTC, 
  Poppins, 
  Pragmata, 
  RobotoMono,
  Roboto // 新增导入
} from "../../styles/fonts";

// 在 body className 中添加
${Roboto.variable}
```

## 💡 最佳实践

### 字体文件优化

1. **推荐格式优先级**：
   - WOFF2 > WOFF > TTF/OTF > EOT

2. **文件大小优化**：
   - 仅包含必要的字符集
   - 使用字体子集化工具
   - 优先使用 WOFF2 格式

3. **命名规范**：
   - 文件夹名：`FontFamilyName`（帕斯卡命名法）
   - 文件名：`FontName-Weight.format`
   - CSS 变量：`--font-family-name`（kebab-case）

### 性能优化

1. **字体加载**：
   - 使用 `display: "swap"` 避免字体加载阻塞
   - 按需加载字体文件

2. **文件组织**：
   - 将相关字重放在同一定义中
   - 合理设置字体回退方案

## 🛠️ 开发工具

### 可用脚本

- `npm run dev` - 启动开发服务器（使用 Turbopack）
- `npm run build` - 构建生产版本（静态导出）
- `npm start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查

### 技术栈

- **框架**: Next.js 15 with App Router
- **UI 库**: Ant Design v5 + React 19 兼容补丁
- **样式**: TailwindCSS v4 + PostCSS
- **字体加载**: Next.js `localFont` 加载器
- **构建**: SWC 编译器 + 静态导出

## 🎨 功能特性

### 字体预览控制

- **搜索**: 按字体名称实时搜索
- **筛选**: 显示全部/仅收藏字体
- **样式设置**:
  - 字体大小：12px - 72px，支持预设快捷选项
  - 字体粗细：100 - 900，步长 100
  - 字体颜色：颜色选择器 + 预设颜色
  - 字体样式：正常/斜体切换

### 字体管理

- **收藏功能**: 点击心形图标收藏字体
- **本地存储**: 偏好设置自动保存（待实现）
- **导出功能**: 字体列表导出（待实现）

## 📋 待办事项

- [ ] 适配 Dark 模式
- [ ] 添加下载功能
- [ ] 优化加载速度
- [ ] 实现字体列表导出功能
- [ ] 添加字体详细信息展示
- [ ] 支持字体预览文本自定义

## 📝 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如果您在使用过程中遇到问题，请：

1. 查看本文档的故障排除部分
2. 搜索现有的 GitHub Issues
3. 创建新的 Issue 详细描述问题

---

**享受您的字体探索之旅！** 🎉