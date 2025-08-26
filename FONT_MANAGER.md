# 字体管理器使用指南

## 🎯 功能概述

字体管理器提供了两个主要功能：

- **添加字体** (`npm run font:add`) - 将字体文件添加到项目中
- **扫描字体** (`npm run font:scan`) - 扫描和分析现有字体

## 📝 命令使用

### 1. 添加字体

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

**支持的字体格式：**

- `.ttf` (TrueType Font)
- `.otf` (OpenType Font)
- `.woff` (Web Open Font Format)
- `.woff2` (Web Open Font Format 2.0)
- `.eot` (Embedded OpenType)

### 2. 扫描字体

```bash
npm run font:scan
```

## 🔍 扫描功能详解

扫描功能会检查并报告以下信息：

### 基本信息

- 字体族数量和名称
- 每个字体族的文件数量
- 字体变体信息（字重、样式）
- 文件列表

### 问题检测

- **重复变体** - 同一字重和样式的多个文件（如不同格式）
- **非标准命名** - 不符合标准命名规范的文件
- **配置不匹配** - fonts.ts 配置与实际文件的差异

### 配置验证

- 检查 `styles/fonts.ts` 配置文件是否存在
- 验证配置的字体数量与文件夹数量是否匹配
- 检查 `myFonts` 导出数组的完整性

## 📊 扫描报告示例

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

## 🛠️ 字体添加流程

1. **文件扫描** - 递归扫描指定路径中的字体文件
2. **属性解析** - 自动解析字体族、字重、样式信息
3. **交互确认** - 允许用户确认或修改字体属性
4. **文件复制** - 将字体文件复制到 `public/fonts/字体名称/` 目录
5. **标准化命名** - 重命名为标准格式（如 `FontName-Bold-Italic.ttf`）
6. **配置更新** - 自动更新 `styles/fonts.ts` 配置文件

## 📁 文件组织结构

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

## 🎨 标准命名规范

字体文件会被重命名为标准格式：

- **格式**: `FontName-WeightName-Style.extension`
- **示例**:
  - `Poppins-Regular.ttf`
  - `Poppins-Bold-Italic.ttf`
  - `RobotoMono-Light.woff2`

## ⚠️ 常见问题处理

### 重复变体

当添加字体时遇到重复变体，系统会提供选项：

- **保留现有** - 跳过新文件
- **替换现有** - 用新文件替换
- **重命名新文件** - 手动指定不同的字重/样式

### 配置不匹配

如果扫描发现配置不匹配：

- 运行 `npm run font:add` 重新生成配置
- 手动检查 `styles/fonts.ts` 文件

### 文件命名问题

扫描会指出非标准命名的文件，建议：

- 重新运行 `npm run font:add` 来标准化命名
- 或手动重命名文件以符合规范

## 🚀 最佳实践

1. **使用扫描功能** - 定期运行 `npm run font:scan` 检查字体状态
2. **标准化命名** - 让工具自动处理文件命名
3. **格式优先级** - 推荐使用 WOFF2 > WOFF > TTF/OTF > EOT
4. **避免重复** - 同一变体只保留一个最优格式的文件
5. **配置同步** - 添加新字体后及时更新配置文件
