import fs from "fs";
import path from "path";
import { intro, outro, confirm, text, select, multiselect, group, isCancel, cancel } from "@clack/prompts";

const WEIGHT_MAP = {
	Thin: 100,
	UltraLight: 200,
	ExtraLight: 200,
	Light: 300,
	Regular: 400,
	Normal: 400,
	Medium: 500,
	SemiBold: 600,
	DemiBold: 600,
	Bold: 700,
	ExtraBold: 800,
	UltraBold: 800,
	Black: 900,
	Heavy: 900,
};

/**
 * @description 解析字体文件名，提取字体家族、权重和样式
 * @param {string} filename - 字体文件名
 * @returns {Object} 包含 fontFamily, weight, style 和 originalName 的对象
 */
function parseFileName(filename) {
	// 1. 取纯净文件名（不含目录及扩展名）
	const name = path.basename(filename, path.extname(filename));

	// 2. 判断斜体 - 检查文件名中是否包含Italic或Oblique关键词
	const isItalic = /italic|oblique/i.test(name);
	const style = isItalic ? "italic" : "normal";

	// 3. 判断权重：按权重值从高到低排序，优先匹配最具体的权重词
	let weight = 400; // 默认
	let matchedWeightKey = null;
	
	const weightEntries = Object.entries(WEIGHT_MAP)
		.sort(([,a], [,b]) => b - a) // 按权重值降序排列
		.sort(([a], [b]) => b.length - a.length); // 按长度降序，优先匹配更具体的词
	
	for (const [key, val] of weightEntries) {
		// 在文件名中查找权重关键字，不区分大小写
		const weightRegex = new RegExp(key, 'i');
		if (weightRegex.test(name)) {
			weight = val;
			matchedWeightKey = key;
			break;
		}
	}

	// 4. 生成家族名：从文件名中移除匹配到的权重和样式关键词
	let family = name;
	
	// 移除匹配到的权重词
	if (matchedWeightKey) {
		const weightRegex = new RegExp(matchedWeightKey, 'gi');
		family = family.replace(weightRegex, '');
	}
	
	// 移除样式词
	if (isItalic) {
		family = family.replace(/italic|oblique/gi, '');
	}
	
	// 清理多余的分隔符并格式化家族名
	family = family
		.replace(/[-_\s]+/g, '') // 移除所有分隔符
		.replace(/^[^a-zA-Z]+|[^a-zA-Z0-9]+$/g, ''); // 移除首尾非字母数字字符

	// 处理空字符串情况
	if (!family) {
		family = "UnknownFont";
	}
	
	// 确保首字母大写
	family = family.charAt(0).toUpperCase() + family.slice(1);

	return {
		fontFamily: family,
		weight,
		style,
		originalName: filename,
	};
}

/**
 * @description 生成标准化的字体文件名
 * @param {Object} fontInfo - 包含 fontFamily, weight, style 的对象
 * @param {string} ext - 文件扩展名（如 .ttf, .woff 等）
 * @returns {string} 标准化的字体文件名
 */
function generateStandardFontName(fontInfo, ext) {
	const fontName = fontInfo.fontFamily;
	const weightName = Object.keys(WEIGHT_MAP).find((key) => WEIGHT_MAP[key] === fontInfo.weight) || "Regular";
	const styleName = fontInfo.style === "normal" ? "Regular" : "Italic";
	return `${fontName}-${weightName}${styleName === "Regular" ? "" : "-" + styleName}${ext}`;
}

/**
 * @description 检查文件名是否为字体文件
 * @param {string} filename - 文件名
 * @returns {boolean} 是否为字体文件
 */
function isFontFile(filename) {
	return /\.(ttf|otf|woff|woff2|eot)$/i.test(filename);
}

/**
 * @description 递归扫描目录中的字体文件
 * @param {string} dirPath - 目录路径
 * @returns {string[]} 字体文件列表
 */
function scanFontFiles(dirPath) {
	if (!fs.existsSync(dirPath)) {
		throw new Error(`Directory does not exist: ${dirPath}`);
	}
	
	const files = [];

	function scan(currentPath) {
		try {
			const items = fs.readdirSync(currentPath);

			for (const item of items) {
				const itemPath = path.join(currentPath, item);
				try {
					const stat = fs.statSync(itemPath);

					if (stat.isDirectory()) {
						scan(itemPath); // 递归扫描子目录
					} else if (isFontFile(item)) {
						files.push(itemPath);
					}
				} catch (statError) {
					console.warn(`⚠️  Cannot access file: ${itemPath}, skipping...`);
				}
			}
		} catch (readError) {
			console.warn(`⚠️  Cannot read directory: ${currentPath}, skipping...`);
		}
	}

	scan(dirPath);
	return files;
}

/**
 * @description 批量确认和修改字体属性
 * @param {Array} fontInfos - 字体信息数组
 * @returns {Promise<Array>} 确认后的字体信息数组
 */
async function batchConfirmFontProperties(fontInfos) {
	if (fontInfos.length === 0) return fontInfos;

	console.log(`\n📋 检测到 ${fontInfos.length} 个字体文件的属性：`);
	console.log('='.repeat(60));

	// 显示所有字体的检测结果
	const fontOptions = fontInfos.map((fontInfo, index) => {
		const currentWeight = Object.keys(WEIGHT_MAP).find(key => WEIGHT_MAP[key] === fontInfo.weight) || "Regular";
		const displayText = `${path.basename(fontInfo.originalPath)} → Family: ${fontInfo.fontFamily}, Weight: ${currentWeight}, Style: ${fontInfo.style}`;
		console.log(`${index + 1}. ${displayText}`);
		
		return {
			value: index,
			label: displayText
		};
	});

	console.log('='.repeat(60));

	// 询问是否所有属性都正确
	const allCorrect = await confirm({
		message: "所有字体属性检测是否都正确？",
		initialValue: true,
	});

	if (isCancel(allCorrect)) {
		cancel("操作已取消");
		process.exit(0);
	}

	if (allCorrect) {
		return fontInfos;
	}

	// 让用户选择需要修改的字体
	const fontsToModify = await multiselect({
		message: "选择需要修改属性的字体（使用空格键选择，回车确认）：",
		options: fontOptions,
		required: true,
	});

	if (isCancel(fontsToModify)) {
		cancel("操作已取消");
		process.exit(0);
	}

	// 批量修改选中的字体
	const modifiedFontInfos = [...fontInfos];
	
	for (const fontIndex of fontsToModify) {
		console.log(`\n🔧 修改字体: ${path.basename(fontInfos[fontIndex].originalPath)}`);
		const modifiedFont = await modifySingleFont(fontInfos[fontIndex]);
		modifiedFontInfos[fontIndex] = modifiedFont;
	}

	return modifiedFontInfos;
}

/**
 * @description 修改单个字体属性
 * @param {Object} fontInfo - 字体信息对象
 * @returns {Promise<Object>} 修改后的字体信息
 */
async function modifySingleFont(fontInfo) {
	const weightOptions = Object.keys(WEIGHT_MAP).map(key => ({
		value: key,
		label: `${key} (${WEIGHT_MAP[key]})`
	}));

	const currentWeight = Object.keys(WEIGHT_MAP).find(key => WEIGHT_MAP[key] === fontInfo.weight) || "Regular";

	const corrections = await group({
		fontFamily: () => text({
			message: "字体家族名称:",
			placeholder: fontInfo.fontFamily,
			defaultValue: fontInfo.fontFamily,
			validate: (value) => {
				if (!value || value.trim() === "") {
					return "字体家族名称不能为空";
				}
				if (!/^[a-zA-Z][a-zA-Z0-9]*$/.test(value.trim())) {
					return "字体家族名称必须以字母开头，只能包含字母和数字";
				}
			}
		}),
		weight: () => select({
			message: "选择字体权重:",
			initialValue: currentWeight,
			options: weightOptions,
		}),
		style: () => select({
			message: "选择字体样式:",
			initialValue: fontInfo.style,
			options: [
				{ value: "normal", label: "Normal" },
				{ value: "italic", label: "Italic" }
			],
		})
	}, {
		onCancel: () => {
			cancel("操作已取消");
			process.exit(0);
		}
	});

	return {
		...fontInfo,
		fontFamily: corrections.fontFamily.trim(),
		weight: WEIGHT_MAP[corrections.weight],
		style: corrections.style
	};
}

/**
 * 主函数：添加字体到项目中
 * @async
 * @function addFont
 * @throws {Error} 当字体添加过程中出现错误时抛出
 */
async function addFont() {
	const args = process.argv.slice(2);

	if (args.length < 1) {
		console.log("Usage: npm run font:add <path-to-font-file-or-folder> [customFontName]");
		console.log("");
		console.log("Examples:");
		console.log("  npm run font:add ./Roboto-Regular.ttf");
		console.log("  npm run font:add ./Roboto-Regular.ttf CustomRoboto");
		console.log("  npm run font:add ./poppins-font-family/");
		console.log("  npm run font:add ./fonts-collection/ MyCustomFont");
		console.log("");
		console.log("Supported formats: .ttf, .otf, .woff, .woff2, .eot");
		console.log("Output format: FontName-WeightName-Style (e.g., Poppins-Bold-Italic.ttf)");
		process.exit(1);
	}

	const inputPath = path.resolve(args[0]);
	const customFontName = args[1];

	// 输入验证
	if (!inputPath || inputPath.trim() === "") {
		console.error("❌ Error: Invalid input path");
		process.exit(1);
	}

	if (customFontName && !/^[a-zA-Z][a-zA-Z0-9]*$/.test(customFontName)) {
		console.error("❌ Error: Custom font name must start with a letter and contain only alphanumeric characters");
		process.exit(1);
	}

	if (!fs.existsSync(inputPath)) {
		console.error(`❌ Error: Path not found: ${inputPath}`);
		process.exit(1);
	}

	console.log(`🔍 Scanning: ${inputPath}`);

	let fontFiles = [];
	try {
		const stats = fs.statSync(inputPath);

		if (stats.isDirectory()) {
			// 递归扫描文件夹
			fontFiles = scanFontFiles(inputPath);
			console.log(`📁 Found ${fontFiles.length} font file(s) in directory`);
		} else {
			// 处理单个文件
			if (!isFontFile(inputPath)) {
				console.error("❌ Error: Invalid font file format. Supported: .ttf, .otf, .woff, .woff2, .eot");
				process.exit(1);
			}
			fontFiles = [inputPath];
			console.log(`📄 Processing single font file`);
		}
	} catch (error) {
		console.error(`❌ Error accessing path: ${error.message}`);
		process.exit(1);
	}

	if (fontFiles.length === 0) {
		console.error("❌ Error: No font files found in the specified path");
		process.exit(1);
	}

	console.log(`\n🔧 Processing ${fontFiles.length} font file(s):`);

	// 添加intro提示
	intro("🎨 Font Properties Confirmation");

	// 解析所有字体文件
	const fontInfos = [];
	for (const file of fontFiles) {
		const info = parseFileName(file);
		if (customFontName) {
			info.fontFamily = customFontName;
			console.log(`    -> Renamed family to: ${customFontName}`);
		}
		info.originalPath = file;
		fontInfos.push(info);
	}

	// 批量确认字体属性
	const confirmedFontInfos = await batchConfirmFontProperties(fontInfos);

	// 按字体族分组
	const fontFamilies = {};
	confirmedFontInfos.forEach((info) => {
		if (!fontFamilies[info.fontFamily]) {
			fontFamilies[info.fontFamily] = [];
		}
		fontFamilies[info.fontFamily].push(info);
	});

	console.log(`\n📦 Organized into ${Object.keys(fontFamilies).length} font familie(s):`);
	Object.entries(fontFamilies).forEach(([name, fonts]) => {
		console.log(`  ${name}: ${fonts.length} variant(s)`);
	});

	// 创建public/fonts目录
	const publicFontsDir = path.join(process.cwd(), "public", "fonts");
	try {
		if (!fs.existsSync(publicFontsDir)) {
			fs.mkdirSync(publicFontsDir, { recursive: true });
			console.log(`\n📁 Created directory: public/fonts/`);
		}
	} catch (error) {
		console.error(`❌ Error creating fonts directory: ${error.message}`);
		process.exit(1);
	}

	// 处理每个字体族
	console.log(`\n📋 Copying and renaming files:`);
	for (const [familyName, fonts] of Object.entries(fontFamilies)) {
		console.log(`\n  📝 ${familyName}:`);

		// 创建字体族目录
		const familyDir = path.join(publicFontsDir, familyName);
		try {
			if (!fs.existsSync(familyDir)) {
				fs.mkdirSync(familyDir, { recursive: true });
			}
		} catch (error) {
			console.error(`❌ Error creating font family directory: ${error.message}`);
			continue;
		}

		// 复制并重命名字体文件
		for (const fontInfo of fonts) {
			try {
				const ext = path.extname(fontInfo.originalPath);
				const standardName = generateStandardFontName(fontInfo, ext);
				const targetPath = path.join(familyDir, standardName);

				// 检查文件是否已存在
				if (fs.existsSync(targetPath)) {
					console.log(`    ⚠️  File exists, skipping: ${standardName}`);
					continue;
				}

				fs.copyFileSync(fontInfo.originalPath, targetPath);
				console.log(`    ✅ ${path.basename(fontInfo.originalPath)} -> ${standardName}`);
			} catch (error) {
				console.error(`    ❌ Error copying ${fontInfo.originalPath}: ${error.message}`);
			}
		}
	}

	// 更新fonts.ts配置文件
	console.log(`\n⚙️  Updating fonts configuration...`);
	try {
		updateFontsConfig(fontFamilies);
	} catch (error) {
		console.error(`❌ Error updating fonts configuration: ${error.message}`);
		process.exit(1);
	}

	outro("🎉 Font addition completed successfully!");
	console.log("\nNext steps:");
	console.log('  1. Run "npm run build" to build the project');
	console.log('  2. Run "npm run dev" to start development server');
	console.log("  3. Your new fonts will be available in the font showcase");
}

/**
 * 生成字体变体信息
 * @param {FontInfo[]} fonts - 字体信息数组
 * @returns {Object} 包含变体统计信息的对象
 */
function generateVariantInfo(fonts) {
	const weights = new Set();
	const styles = new Set();
	const variants = [];
	const variantKeys = new Set(); // 添加去重用的键集合
	
	fonts.forEach(font => {
		weights.add(font.weight);
		styles.add(font.style);
		
		// 创建变体的唯一键来避免重复
		const variantKey = `${font.weight}-${font.style}`;
		if (!variantKeys.has(variantKey)) {
			variantKeys.add(variantKey);
			variants.push({
				weight: font.weight,
				style: font.style,
				file: generateStandardFontName(font, path.extname(font.originalPath))
			});
		}
	});
	
	// 按权重和样式排序变体
	variants.sort((a, b) => {
		if (a.weight !== b.weight) return a.weight - b.weight;
		return a.style.localeCompare(b.style);
	});
	
	return {
		totalVariants: variants.length, // 使用去重后的variants长度
		weights: Array.from(weights).sort((a, b) => a - b),
		styles: Array.from(styles).sort(),
		variants: variants
	};
}

/**
 * 更新fonts.ts配置文件
 * @param {Object.<string, FontInfo[]>} fontFamilies - 按字体族分组的字体信息
 * @throws {Error} 当配置文件更新失败时抛出
 */
function updateFontsConfig(fontFamilies) {
	const fontsConfigPath = path.join(process.cwd(), "styles", "fonts.ts");

	// 确保styles目录存在
	const stylesDir = path.dirname(fontsConfigPath);
	if (!fs.existsSync(stylesDir)) {
		fs.mkdirSync(stylesDir, { recursive: true });
	}

	// 读取现有配置
	let existingFonts = [];
	let existingVariants = [];
	let existingFontFamilies = {}; // 添加：存储现有字体族的信息
	let existingConfig = "";

	if (fs.existsSync(fontsConfigPath)) {
		try {
			existingConfig = fs.readFileSync(fontsConfigPath, "utf8");

			// 提取现有字体导出
			const exportMatches = existingConfig.match(/export const (\w+) = localFont\({[\s\S]*?}\);/g);
			if (exportMatches) {
				exportMatches.forEach((match) => {
					const nameMatch = match.match(/export const (\w+)/);
					if (nameMatch) {
						existingFonts.push(nameMatch[1]);
						
						// 解析现有字体的源文件路径来识别字体族
						const srcMatch = match.match(/src:\s*(?:\[[\s\S]*?\]|"[^"]*")/);
						if (srcMatch) {
							const fontName = nameMatch[1];
							existingFontFamilies[fontName] = match;
						}
					}
				});
			}

			// 提取现有字体变体信息导出
			const variantMatches = existingConfig.match(/export const (\w+)Variants: FontVariantInfo = [\s\S]*?};/g);
			if (variantMatches) {
				variantMatches.forEach((match) => {
					const nameMatch = match.match(/export const (\w+)Variants/);
					if (nameMatch) {
						existingVariants.push(nameMatch[1]);
					}
				});
			}
		} catch (error) {
			console.warn(`⚠️  Warning: Could not read existing fonts config: ${error.message}`);
		}
	}

	// 生成变体信息映射
	const fontVariantInfo = {};
	for (const [familyName, fonts] of Object.entries(fontFamilies)) {
		fontVariantInfo[familyName] = generateVariantInfo(fonts);
	}

	let configContent = `import localFont from "next/font/local";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";

// 字体变体信息接口定义
export interface FontVariant {
	weight: number;
	style: string;
	file: string;
}

export interface FontVariantInfo {
	totalVariants: number;
	weights: number[];
	styles: string[];
	variants: FontVariant[];
}

`;

	// 保留现有字体配置和变体信息（只保留与新添加字体不冲突的）
	if (existingConfig) {
		// 保留现有字体定义（不在新添加的字体族中）
		const fontDefinitions = existingConfig.match(/export const (\w+) = localFont\({[\s\S]*?}\);/g);
		if (fontDefinitions) {
			fontDefinitions.forEach((def) => {
				const fontNameMatch = def.match(/export const (\w+)/);
				if (fontNameMatch) {
					const fontName = fontNameMatch[1];
					// 只保留完全不同的字体族
					if (!Object.keys(fontFamilies).includes(fontName)) {
						configContent += def + "\n\n";
					}
				}
			});
		}

		// 保留现有字体变体信息（不在新添加的字体族中）
		const variantDefinitions = existingConfig.match(/export const (\w+)Variants: FontVariantInfo = [\s\S]*?};/g);
		if (variantDefinitions) {
			variantDefinitions.forEach((def) => {
				const variantNameMatch = def.match(/export const (\w+)Variants/);
				if (variantNameMatch) {
					const fontName = variantNameMatch[1];
					// 只保留完全不同的字体族
					if (!Object.keys(fontFamilies).includes(fontName)) {
						configContent += def + "\n\n";
					}
				}
			});
		}
	}

	console.log('\n🔄 Font family processing summary:');
	Object.keys(fontFamilies).forEach(familyName => {
		if (existingFonts.includes(familyName)) {
			console.log(`   ↻ Updating existing font family: ${familyName}`);
		} else {
			console.log(`   ➕ Adding new font family: ${familyName}`);
		}
	});

	// 构建所有字体导出列表（包括保留的现有字体和新添加的字体）
	const allFontExports = [];
	
	// 添加保留的现有字体（不在新字体族中的）
	existingFonts.forEach(fontName => {
		if (!Object.keys(fontFamilies).includes(fontName)) {
			allFontExports.push(fontName);
		}
	});

	// 添加新字体（包括更新的现有字体族）
	Object.keys(fontFamilies).forEach(familyName => {
		if (!allFontExports.includes(familyName)) {
			allFontExports.push(familyName);
		}
	});

	// 为每个新字体族生成配置
	for (const [familyName, fonts] of Object.entries(fontFamilies)) {
		const exportName = familyName;
		const variantInfo = fontVariantInfo[familyName];

		// 注意：不需要再添加到导出列表，已在上面处理了

		if (fonts.length === 1) {
			// 单个字体文件
			const font = fonts[0];
			const ext = path.extname(font.originalPath);
			const standardName = generateStandardFontName(font, ext);

			configContent += `export const ${exportName} = localFont({
	src: "../public/fonts/${familyName}/${standardName}",
	variable: "--font-${familyName.toLowerCase()}",
	display: "swap",
	preload: true,
});

// ${exportName} 字体变体信息
export const ${exportName}Variants: FontVariantInfo = ${JSON.stringify(variantInfo, null, 2)};

`;
		} else {
			// 多个字体文件（包含不同权重/样式）- 按权重和样式排序
			const sortedFonts = fonts.sort((a, b) => {
				if (a.weight !== b.weight) return a.weight - b.weight;
				return a.style.localeCompare(b.style);
			});

			configContent += `export const ${exportName} = localFont({
	src: [
`;

			sortedFonts.forEach((font) => {
				const ext = path.extname(font.originalPath);
				const standardName = generateStandardFontName(font, ext);
				configContent += `		{
			path: "../public/fonts/${familyName}/${standardName}",
			weight: "${font.weight}",
			style: "${font.style}",
		},
`;
			});

			configContent += `	],
	variable: "--font-${familyName.toLowerCase()}",
	display: "swap",
	preload: true,
});

// ${exportName} 字体变体信息
export const ${exportName}Variants: FontVariantInfo = ${JSON.stringify(variantInfo, null, 2)};

`;
		}
	}

	// 生成myFonts导出数组
	configContent += `export const myFonts: NextFontWithVariable[] = [
`;

	// 去重并排序
	const uniqueExports = [...new Set(allFontExports)].sort();
	uniqueExports.forEach((exportName) => {
		configContent += `	${exportName},
`;
	});

	configContent += `];

// 所有字体变体信息映射
export const fontVariantsMap: { [key: string]: FontVariantInfo } = {
`;

	// 添加字体变体映射（包括保留的现有变体和新生成的变体）
	const availableVariants = [];
	
	// 添加保留的现有变体（不在新字体族中的）
	existingVariants.forEach(fontName => {
		if (!Object.keys(fontFamilies).includes(fontName)) {
			availableVariants.push(fontName);
		}
	});
	
	// 添加新字体的变体信息（包括更新的现有字体族）
	Object.keys(fontFamilies).forEach(familyName => {
		if (!availableVariants.includes(familyName)) {
			availableVariants.push(familyName);
		}
	});

	availableVariants.forEach((fontName) => {
		configContent += `	${fontName}: ${fontName}Variants,
`;
	});

	configContent += `};
`;

	// 写入配置文件
	try {
		fs.writeFileSync(fontsConfigPath, configContent);
		console.log(`✅ Updated: ${fontsConfigPath}`);
		console.log(`📊 Total fonts: ${uniqueExports.length}`);
	} catch (error) {
		throw new Error(`Failed to write fonts configuration: ${error.message}`);
	}
}

// 错误处理
process.on("uncaughtException", (error) => {
	console.error("❌ Uncaught Exception:", error.message);
	process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
	console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
	process.exit(1);
});

// 运行主函数
if (import.meta.url === `file://${process.argv[1]}`) {
	addFont().catch((error) => {
		console.error("❌ Error:", error.message);
		process.exit(1);
	});
}

export { addFont, parseFileName, generateStandardFontName, isFontFile };
