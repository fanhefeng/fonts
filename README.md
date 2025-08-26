# 字体展示库 (Font Showcase)

一个基于 Next.js 15 的现代字体展示应用，支持本地字体集合的预览、搜索、筛选和个性化配置。

> 仅供分享参考，使用前请先了解字体库协议。
> Share fonts for reference. Please read the font license before using.

## 📖 项目简介

这是一个优雅的字体展示平台，让您能够：

- 🎨 实时预览多种字体效果
- 🔍 快速搜索和筛选字体
- ❤️ 收藏您喜欢的字体（基于浏览器本地数据）
- ⚙️ 自定义字体大小、颜色、粗细和样式
- 📱 响应式设计，支持各种设备
- 🌐 支持中英文切换
- 🌓 支持亮色/暗色模式

## 🚀 快速开始

### 环境要求

- Node.js 18.0 或更高版本
- npm 包管理器

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
npm run dev
```

访问 http://localhost:3000 查看应用。

### 构建生产版本

```bash
npm run build
```

### 启动生产服务器

```bash
npm start
```

## 🎯 字体管理

本项目提供了强大的字体管理工具，支持添加、扫描和分析字体文件。

### 🎨 功能概述

字体管理器提供了两个主要功能：
- **添加字体** (`npm run font:add`) - 将字体文件添加到项目中
- **扫描字体** (`npm run font:scan`) - 扫描和分析现有字体

### 📝 命令使用

#### 1. 添加字体

```bash
# 添加单个字体文件
npm run font:add ./path/to/font.ttf

# 添加单个字体文件并指定自定义名称
npm run font:add ./path/to/font.ttf CustomFontName

# 添加整个字体文件夹
npm run font:add ./path/to/font-folder/

# 添加字体文件夹并指定自定义名称
npm run font:add ./path/to/font-folder/ CustomFontName
```

#### 2. 扫描字体

```bash
npm run font:scan
```

### 支持的字体格式

- `.ttf` (TrueType Font)
- `.otf` (OpenType Font)
- `.woff` (Web Open Font Format)
- `.woff2` (Web Open Font Format 2.0)
- `.eot` (Embedded OpenType)

### 🔍 扫描功能详解

扫描功能会检查并报告以下信息：

#### 基本信息
- 字体族数量和名称
- 每个字体族的文件数量
- 字体变体信息（字重、样式）
- 文件列表

#### 问题检测
- **重复变体** - 同一字重和样式的多个文件（如不同格式）
- **非标准命名** - 不符合标准命名规范的文件
- **配置不匹配** - fonts.ts 配置与实际文件的差异

#### 配置验证
- 检查 `styles/fonts.ts` 配置文件是否存在
- 验证配置的字体数量与文件夹数量是否匹配
- 检查 `myFonts` 导出数组的完整性

### 📊 扫描报告示例

```
📊 Found 16 font families:
============================================================
📝 Poppins:
   Files: 18
   Variants: Black italic, Black normal, Bold italic, Bold normal, ...
   Files: Poppins-Black-Italic.ttf, Poppins-Black.ttf, ...

📝 PingFangSC:
   Files: 13
   Variants: Light normal, Medium normal, Regular normal, ...
   ⚠️  Duplicate variants: Light normal, Medium normal, ...
   Files: PingFangSC-Light.ttf, PingFangSC-Light.woff2, ...

============================================================
📈 Summary:
   Total font families: 16
   Total font files: 74
   ⚠️  Duplicate variants found: 9
   📝 Non-standard file names: 1
   Configuration file: ✅ styles/fonts.ts exists
   Configured fonts: 16
   ✅ Configuration matches font folders
   myFonts array: 16 fonts exported
```

### 🛠️ 字体添加流程

1. **文件扫描** - 递归扫描指定路径中的字体文件
2. **属性解析** - 自动解析字体族、字重、样式信息
3. **交互确认** - 允许用户确认或修改字体属性
4. **文件复制** - 将字体文件复制到 `public/fonts/字体名称/` 目录
5. **标准化命名** - 重命名为标准格式（如 `FontName-Bold-Italic.ttf`）
6. **配置更新** - 自动更新 `styles/fonts.ts` 配置文件

### 📁 文件组织结构

```
public/fonts/
├── Poppins/
│   ├── Poppins-Regular.ttf
│   ├── Poppins-Bold.ttf
│   ├── Poppins-Light-Italic.ttf
│   └── ...
├── RobotoMono/
│   ├── RobotoMono-Regular.ttf
│   ├── RobotoMono-Bold.ttf
│   └── ...
└── ...

styles/
└── fonts.ts  # 字体配置文件
```

### 🎨 标准命名规范

字体文件会被重命名为标准格式：
- **格式**: `FontName-WeightName-Style.extension`
- **示例**: 
  - `Poppins-Regular.ttf`
  - `Poppins-Bold-Italic.ttf`
  - `RobotoMono-Light.woff2`

### ⚠️ 常见问题处理

#### 重复变体
当添加字体时遇到重复变体，系统会提供选项：
- **保留现有** - 跳过新文件
- **替换现有** - 用新文件替换
- **重命名新文件** - 手动指定不同的字重/样式

#### 配置不匹配
如果扫描发现配置不匹配：
- 运行 `npm run font:add` 重新生成配置
- 手动检查 `styles/fonts.ts` 文件

#### 文件命名问题
扫描会指出非标准命名的文件，建议：
- 重新运行 `npm run font:add` 来标准化命名
- 或手动重命名文件以符合规范

### 手动添加字体（替代方法）

如果您想手动添加字体，请按照以下步骤操作：

1. 在 `public/fonts/` 目录下创建以字体名称命名的文件夹
2. 将字体文件放入该文件夹
3. 编辑 `styles/fonts.ts` 文件，添加字体定义：

```typescript
import localFont from "next/font/local";

// 添加字体定义
export const YourFontName = localFont({
  src: [
    {
      path: "../public/fonts/YourFontName/YourFontName-Light.woff2",
      weight: "300",
      style: "normal",
    },
    {
      path: "../public/fonts/YourFontName/YourFontName-Regular.woff2", 
      weight: "400",
      style: "normal",
    },
    // 添加更多变体...
  ],
  variable: "--font-yourfontname", // CSS 变量名
  display: "swap", // 字体加载优化
  preload: false, // 非阻塞加载
});

// 添加字体变体信息
export const YourFontNameVariants: FontVariantInfo = {
  totalVariants: 2, // 变体总数
  weights: [300, 400], // 支持的字重
  styles: ["normal"], // 支持的样式
  variants: [
    { weight: 300, style: "normal", file: "YourFontName-Light.woff2" },
    { weight: 400, style: "normal", file: "YourFontName-Regular.woff2" },
  ],
};

// 将字体添加到 myFonts 数组
export const myFonts: NextFontWithVariable[] = [
  // ... 现有字体
  YourFontName, // 添加新字体
];

// 更新字体变体映射
export const fontVariantsMap: { [key: string]: FontVariantInfo } = {
  // ... 现有字体变体
  YourFontName: YourFontNameVariants,
};
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
   - 文件名：`FontName-Weight-Style.format`
   - CSS 变量：`--font-fontfamilyname`（小写连字符）

### 字体管理最佳实践

1. **使用扫描功能** - 定期运行 `npm run font:scan` 检查字体状态
2. **标准化命名** - 让工具自动处理文件命名
3. **格式优先级** - 推荐使用 WOFF2 > WOFF > TTF/OTF > EOT
4. **避免重复** - 同一变体只保留一个最优格式的文件
5. **配置同步** - 添加新字体后及时更新配置文件

## 🛠️ 开发工具

### 可用脚本

- `npm run dev` - 启动开发服务器（使用 Turbopack）
- `npm run build` - 构建生产版本
- `npm start` - 启动生产服务器
- `npm run lint` - 运行 ESLint 检查
- `npm run font:add` - 添加新字体
- `npm run font:scan` - 扫描现有字体

### 技术栈

- **框架**: Next.js 15 with App Router
- **UI 库**: Ant Design v5 + React 19
- **样式**: TailwindCSS v4 + PostCSS
- **字体加载**: Next.js localFont 加载器
- **构建工具**: Turbopack (开发) / SWC (生产)

## 🎨 功能特性

### 字体预览控制

- **搜索**: 按字体名称实时搜索
- **筛选**: 显示全部/仅收藏字体
- **样式设置**:
  - 字体大小：可调整范围
  - 字体粗细：100 - 900，步长 100
  - 字体颜色：颜色选择器 + 预设颜色
  - 字体样式：正常/斜体切换
  - 自定义文本：支持输入自定义预览文本

### 字体管理

- **收藏功能**: 点击心形图标收藏字体
- **本地存储**: 偏好设置自动保存
- **多语言**: 支持中英文切换
- **主题切换**: 支持亮色/暗色模式

## 📋 待办事项

- 添加字体下载功能
- 优化加载速度
- 实现字体列表导出功能
- 支持可变字体（Variable Fonts）

## 📝 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

享受您的字体探索之旅！ 🎉