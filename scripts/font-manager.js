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
		.sort(([, a], [, b]) => b - a) // 按权重值降序排列
		.sort(([a], [b]) => b.length - a.length); // 按长度降序，优先匹配更具体的词

	for (const [key, val] of weightEntries) {
		// 在文件名中查找权重关键字，不区分大小写
		const weightRegex = new RegExp(key, "i");
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
		const weightRegex = new RegExp(matchedWeightKey, "gi");
		family = family.replace(weightRegex, "");
	}

	// 移除样式词
	if (isItalic) {
		family = family.replace(/italic|oblique/gi, "");
	}

	// 清理多余的分隔符并格式化家族名
	family = family
		.replace(/[-_\s]+/g, "") // 移除所有分隔符
		.replace(/^[^a-zA-Z]+|[^a-zA-Z0-9]+$/g, ""); // 移除首尾非字母数字字符

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
	console.log("=".repeat(60));

	// 显示所有字体的检测结果
	const fontOptions = fontInfos.map((fontInfo, index) => {
		const currentWeight = Object.keys(WEIGHT_MAP).find((key) => WEIGHT_MAP[key] === fontInfo.weight) || "Regular";
		const displayText = `${path.basename(fontInfo.originalPath)} → Family: ${fontInfo.fontFamily}, Weight: ${currentWeight}, Style: ${
			fontInfo.style
		}`;
		console.log(`${index + 1}. ${displayText}`);

		return {
			value: index,
			label: displayText,
		};
	});

	console.log("=".repeat(60));

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
	const weightOptions = Object.keys(WEIGHT_MAP).map((key) => ({
		value: key,
		label: `${key} (${WEIGHT_MAP[key]})`,
	}));

	const currentWeight = Object.keys(WEIGHT_MAP).find((key) => WEIGHT_MAP[key] === fontInfo.weight) || "Regular";

	const corrections = await group(
		{
			fontFamily: () =>
				text({
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
					},
				}),
			weight: () =>
				select({
					message: "选择字体权重:",
					initialValue: currentWeight,
					options: weightOptions,
				}),
			style: () =>
				select({
					message: "选择字体样式:",
					initialValue: fontInfo.style,
					options: [
						{ value: "normal", label: "Normal" },
						{ value: "italic", label: "Italic" },
					],
				}),
		},
		{
			onCancel: () => {
				cancel("操作已取消");
				process.exit(0);
			},
		}
	);

	return {
		...fontInfo,
		fontFamily: corrections.fontFamily.trim(),
		weight: WEIGHT_MAP[corrections.weight],
		style: corrections.style,
	};
}

/**
 * 扫描现有字体文件
 * @async
 * @function scanFonts
 */
async function scanFonts() {
	intro("🔍 Font Scanner");
	
	const publicFontsDir = path.join(process.cwd(), "public", "fonts");
	
	if (!fs.existsSync(publicFontsDir)) {
		console.log("❌ No fonts directory found at public/fonts/");
		console.log("💡 Use 'npm run font:add <path>' to add fonts first");
		outro("Scan completed");
		return;
	}

	console.log(`📁 Scanning fonts directory: ${publicFontsDir}`);
	
	try {
		const fontFamilies = fs.readdirSync(publicFontsDir, { withFileTypes: true })
			.filter(dirent => dirent.isDirectory())
			.map(dirent => dirent.name);

		if (fontFamilies.length === 0) {
			console.log("📭 No font families found in public/fonts/");
			outro("Scan completed");
			return;
		}

		console.log(`\n📊 Found ${fontFamilies.length} font families:`);
		console.log("=".repeat(60));

		let totalFiles = 0;
		const familyDetails = [];

		for (const family of fontFamilies) {
			const familyDir = path.join(publicFontsDir, family);
			const files = fs.readdirSync(familyDir)
				.filter(file => isFontFile(file));
			
			totalFiles += files.length;
			
			const variants = [];
			const variantKeys = new Set();
			const duplicateVariants = [];
			const nonStandardNames = [];

			files.forEach(file => {
				const info = parseFileName(file);
				const weightName = Object.keys(WEIGHT_MAP).find(key => WEIGHT_MAP[key] === info.weight) || "Regular";
				const variantKey = `${info.weight}-${info.style}`;
				
				// 检查重复变体
				if (variantKeys.has(variantKey)) {
					duplicateVariants.push(`${weightName} ${info.style}`);
				} else {
					variantKeys.add(variantKey);
					variants.push(`${weightName} ${info.style}`);
				}
				
				// 检查文件命名是否标准
				const expectedName = generateStandardFontName(info, path.extname(file));
				if (file !== expectedName) {
					nonStandardNames.push({
						current: file,
						expected: expectedName
					});
				}
			});

			familyDetails.push({
				name: family,
				fileCount: files.length,
				variants: variants,
				files: files,
				duplicateVariants: duplicateVariants,
				nonStandardNames: nonStandardNames
			});

			console.log(`📝 ${family}:`);
			console.log(`   Files: ${files.length}`);
			console.log(`   Variants: ${variants.join(", ")}`);
			
			// 显示问题
			if (duplicateVariants.length > 0) {
				console.log(`   ⚠️  Duplicate variants: ${duplicateVariants.join(", ")}`);
			}
			if (nonStandardNames.length > 0) {
				console.log(`   📝 Non-standard names: ${nonStandardNames.length} files`);
				nonStandardNames.forEach(item => {
					console.log(`      ${item.current} → ${item.expected}`);
				});
			}
			
			console.log(`   Files: ${files.join(", ")}`);
			console.log("");
		}

		console.log("=".repeat(60));
		console.log(`📈 Summary:`);
		console.log(`   Total font families: ${fontFamilies.length}`);
		console.log(`   Total font files: ${totalFiles}`);
		
		// 统计问题
		const totalDuplicates = familyDetails.reduce((sum, family) => sum + family.duplicateVariants.length, 0);
		const totalNonStandard = familyDetails.reduce((sum, family) => sum + family.nonStandardNames.length, 0);
		
		if (totalDuplicates > 0) {
			console.log(`   ⚠️  Duplicate variants found: ${totalDuplicates}`);
		}
		if (totalNonStandard > 0) {
			console.log(`   📝 Non-standard file names: ${totalNonStandard}`);
		}
		if (totalDuplicates === 0 && totalNonStandard === 0) {
			console.log(`   ✅ All files are properly organized`);
		}
		
		// 检查fonts.ts配置文件
		const fontsConfigPath = path.join(process.cwd(), "styles", "fonts.ts");
		if (fs.existsSync(fontsConfigPath)) {
			console.log(`   Configuration file: ✅ styles/fonts.ts exists`);
			
			// 详细检查配置文件中的字体
			const configContent = fs.readFileSync(fontsConfigPath, "utf8");
			const configuredFonts = configContent.match(/export const (\w+) = localFont/g);
			const configCount = configuredFonts ? configuredFonts.length : 0;
			
			console.log(`   Configured fonts: ${configCount}`);
			
			if (configCount !== fontFamilies.length) {
				console.log(`   ⚠️  Mismatch: ${fontFamilies.length} folders vs ${configCount} configured fonts`);
				
				// 找出缺失的字体
				const configuredFontNames = configuredFonts ? 
					configuredFonts.map(match => match.match(/export const (\w+)/)[1]) : [];
				
				const missingInConfig = fontFamilies.filter(family => !configuredFontNames.includes(family));
				const missingInFiles = configuredFontNames.filter(name => !fontFamilies.includes(name));
				
				if (missingInConfig.length > 0) {
					console.log(`   📁 Folders not in config: ${missingInConfig.join(", ")}`);
				}
				if (missingInFiles.length > 0) {
					console.log(`   ⚙️  Configured but no folder: ${missingInFiles.join(", ")}`);
				}
				
				console.log(`   💡 Consider running 'npm run font:add' to update configuration`);
			} else {
				console.log(`   ✅ Configuration matches font folders`);
			}
			
			// 检查myFonts数组
			const myFontsMatch = configContent.match(/export const myFonts: NextFontWithVariable\[\] = \[([\s\S]*?)\];/);
			if (myFontsMatch) {
				const myFontsContent = myFontsMatch[1];
				const myFontsCount = (myFontsContent.match(/\w+,/g) || []).length;
				console.log(`   myFonts array: ${myFontsCount} fonts exported`);
				
				if (myFontsCount !== configCount) {
					console.log(`   ⚠️  myFonts array mismatch: ${configCount} defined vs ${myFontsCount} exported`);
				}
			}
			
		} else {
			console.log(`   Configuration file: ❌ styles/fonts.ts missing`);
			console.log(`   💡 Run 'npm run font:add <path>' to generate configuration`);
		}

		outro("🎉 Font scan completed!");
		
	} catch (error) {
		console.error(`❌ Error scanning fonts: ${error.message}`);
		process.exit(1);
	}
}

/**
 * 主函数：添加字体到项目中
 * @async
 * @function addFont
 * @throws {Error} 当字体添加过程中出现错误时抛出
 */
async function addFont() {
	const args = process.argv.slice(2);

	// 检查是否是scan命令
	if (args[0] === "scan") {
		await scanFonts();
		return;
	}

	if (args.length < 1) {
		console.log("Usage:");
		console.log("  npm run font:add <path-to-font-file-or-folder> [customFontName]");
		console.log("  npm run font:scan");
		console.log("");
		console.log("Examples:");
		console.log("  npm run font:add ./Roboto-Regular.ttf");
		console.log("  npm run font:add ./Roboto-Regular.ttf CustomRoboto");
		console.log("  npm run font:add ./poppins-font-family/");
		console.log("  npm run font:add ./fonts-collection/ MyCustomFont");
		console.log("  npm run font:scan");
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
		await updateFontsConfig(fontFamilies);
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

	fonts.forEach((font) => {
		weights.add(font.weight);
		styles.add(font.style);

		// 创建变体的唯一键来避免重复
		const variantKey = `${font.weight}-${font.style}`;
		if (!variantKeys.has(variantKey)) {
			variantKeys.add(variantKey);

			let fileName;
			if (font.isExisting && font.file) {
				// 使用现有变体的文件名
				fileName = font.file;
			} else {
				// 生成新变体的标准文件名
				const ext = path.extname(font.originalPath);
				fileName = generateStandardFontName(font, ext);
			}

			variants.push({
				weight: font.weight,
				style: font.style,
				file: fileName,
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
		variants: variants,
	};
}

/**
 * 解析现有字体配置中的变体信息
 * @param {string} fontName - 字体名称
 * @param {string} existingConfig - 现有配置内容
 * @returns {Array} 现有变体信息数组
 */
function parseExistingFontVariants(fontName, existingConfig) {
	const variants = [];

	// 查找字体定义
	const fontDefRegex = new RegExp(`export const ${fontName} = localFont\\({[\\s\\S]*?}\\);`, "g");
	const fontDefMatch = existingConfig.match(fontDefRegex);

	if (!fontDefMatch) return variants;

	const fontDef = fontDefMatch[0];

	// 检查是否是数组形式的src（多变体）
	const srcArrayMatch = fontDef.match(/src:\s*\[([\s\S]*?)\]/);
	if (srcArrayMatch) {
		// 解析数组中的每个变体
		const srcContent = srcArrayMatch[1];
		const variantMatches = srcContent.match(/{\s*path:\s*"([^"]+)",\s*weight:\s*"([^"]+)",\s*style:\s*"([^"]+)",?\s*}/g);

		if (variantMatches) {
			variantMatches.forEach((match) => {
				const pathMatch = match.match(/path:\s*"([^"]+)"/);
				const weightMatch = match.match(/weight:\s*"([^"]+)"/);
				const styleMatch = match.match(/style:\s*"([^"]+)"/);

				if (pathMatch && weightMatch && styleMatch) {
					const fileName = path.basename(pathMatch[1]);
					variants.push({
						weight: parseInt(weightMatch[1]),
						style: styleMatch[1],
						file: fileName,
						path: pathMatch[1],
					});
				}
			});
		}
	} else {
		// 单个字体文件
		const srcMatch = fontDef.match(/src:\s*"([^"]+)"/);
		if (srcMatch) {
			const fileName = path.basename(srcMatch[1]);
			// 从文件名解析权重和样式
			const parsedInfo = parseFileName(fileName);
			variants.push({
				weight: parsedInfo.weight,
				style: parsedInfo.style,
				file: fileName,
				path: srcMatch[1],
			});
		}
	}

	return variants;
}

/**
 * 合并现有字体变体和新变体
 * @param {Array} existingVariants - 现有变体
 * @param {Array} newFonts - 新字体信息
 * @param {string} familyName - 字体族名称
 * @returns {Promise<Array>} 合并后的字体信息
 */
async function mergeExistingAndNewVariants(existingVariants, newFonts, familyName) {
	const mergedFonts = [];
	const variantKeys = new Set();
	const duplicateVariants = [];

	// 添加现有变体（转换为字体信息格式）
	existingVariants.forEach((variant) => {
		const variantKey = `${variant.weight}-${variant.style}`;
		if (!variantKeys.has(variantKey)) {
			variantKeys.add(variantKey);
			mergedFonts.push({
				fontFamily: familyName,
				weight: variant.weight,
				style: variant.style,
				originalPath: variant.path, // 使用现有路径
				isExisting: true, // 标记为现有变体
				file: variant.file, // 添加文件名信息
			});
		}
	});

	// 检查新变体中的重复项
	newFonts.forEach((font) => {
		const variantKey = `${font.weight}-${font.style}`;
		if (variantKeys.has(variantKey)) {
			// 找到重复的现有变体
			const existingVariant = mergedFonts.find((f) => f.weight === font.weight && f.style === font.style && f.isExisting);
			duplicateVariants.push({
				existing: existingVariant,
				new: font,
				variantKey,
			});
		}
	});

	// 如果有重复变体，询问用户处理方式
	if (duplicateVariants.length > 0) {
		console.log(`\n⚠️  检测到 ${duplicateVariants.length} 个重复的字体变体:`);
		console.log("=".repeat(60));

		for (const duplicate of duplicateVariants) {
			const weightName = Object.keys(WEIGHT_MAP).find((key) => WEIGHT_MAP[key] === duplicate.existing.weight) || "Regular";
			console.log(`字体族: ${familyName}`);
			console.log(`变体: ${weightName} ${duplicate.existing.style}`);
			console.log(`现有文件: ${duplicate.existing.file || path.basename(duplicate.existing.originalPath)}`);
			console.log(`新文件: ${path.basename(duplicate.new.originalPath)}`);

			const action = await select({
				message: "如何处理这个重复的变体？",
				options: [
					{ value: "keep", label: "保留现有文件，跳过新文件" },
					{ value: "replace", label: "用新文件替换现有文件" },
					{ value: "rename", label: "重命名新文件（手动指定权重/样式）" },
				],
			});

			if (isCancel(action)) {
				cancel("操作已取消");
				process.exit(0);
			}

			switch (action) {
				case "keep":
					console.log(`    ✅ 保留现有变体，跳过新文件`);
					break;

				case "replace":
					// 移除现有变体，添加新变体
					const existingIndex = mergedFonts.findIndex(
						(f) => f.weight === duplicate.existing.weight && f.style === duplicate.existing.style && f.isExisting
					);
					if (existingIndex !== -1) {
						mergedFonts.splice(existingIndex, 1);
						variantKeys.delete(duplicate.variantKey);
					}
					mergedFonts.push({
						...duplicate.new,
						isExisting: false,
					});
					variantKeys.add(duplicate.variantKey);
					console.log(`    ✅ 已替换为新文件`);
					break;

				case "rename":
					// 让用户重新指定权重和样式
					console.log(`\n🔧 重新配置新文件的属性:`);
					const modifiedFont = await modifySingleFont(duplicate.new);
					const newVariantKey = `${modifiedFont.weight}-${modifiedFont.style}`;

					if (variantKeys.has(newVariantKey)) {
						console.log(`    ⚠️  修改后的变体仍然重复，跳过该文件`);
					} else {
						mergedFonts.push({
							...modifiedFont,
							isExisting: false,
						});
						variantKeys.add(newVariantKey);
						console.log(`    ✅ 已添加重命名后的变体`);
					}
					break;
			}
			console.log("-".repeat(40));
		}
	}

	// 添加非重复的新变体
	newFonts.forEach((font) => {
		const variantKey = `${font.weight}-${font.style}`;
		if (!variantKeys.has(variantKey)) {
			variantKeys.add(variantKey);
			mergedFonts.push({
				...font,
				isExisting: false, // 标记为新变体
			});
		}
	});

	return mergedFonts;
}

/**
 * 更新fonts.ts配置文件
 * @param {Object.<string, FontInfo[]>} fontFamilies - 按字体族分组的字体信息
 * @throws {Error} 当配置文件更新失败时抛出
 */
async function updateFontsConfig(fontFamilies) {
	const fontsConfigPath = path.join(process.cwd(), "styles", "fonts.ts");

	// 确保styles目录存在
	const stylesDir = path.dirname(fontsConfigPath);
	if (!fs.existsSync(stylesDir)) {
		fs.mkdirSync(stylesDir, { recursive: true });
	}

	// 读取现有配置
	let existingFonts = [];
	let existingVariants = [];
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

	// 合并现有字体变体和新变体
	const mergedFontFamilies = {};

	for (const [familyName, newFonts] of Object.entries(fontFamilies)) {
		if (existingFonts.includes(familyName)) {
			// 字体族已存在，需要合并变体
			console.log(`   🔄 检查现有字体族的变体: ${familyName}`);
			const existingVariants = parseExistingFontVariants(familyName, existingConfig);
			const mergedFonts = await mergeExistingAndNewVariants(existingVariants, newFonts, familyName);
			mergedFontFamilies[familyName] = mergedFonts;
		} else {
			// 新字体族
			console.log(`   ➕ 添加新字体族: ${familyName}`);
			mergedFontFamilies[familyName] = newFonts;
		}
	}

	// 生成变体信息映射（使用合并后的字体族）
	const fontVariantInfo = {};
	for (const [familyName, fonts] of Object.entries(mergedFontFamilies)) {
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
					// 只保留完全不同的字体族（不在原始新增列表中的）
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
					// 只保留完全不同的字体族（不在原始新增列表中的）
					if (!Object.keys(fontFamilies).includes(fontName)) {
						configContent += def + "\n\n";
					}
				}
			});
		}
	}

	// 构建所有字体导出列表（包括保留的现有字体和新添加的字体）
	const allFontExports = [];

	// 添加保留的现有字体（不在新字体族中的）
	existingFonts.forEach((fontName) => {
		if (!Object.keys(fontFamilies).includes(fontName)) {
			allFontExports.push(fontName);
		}
	});

	// 添加新字体（包括更新的现有字体族）
	Object.keys(mergedFontFamilies).forEach((familyName) => {
		if (!allFontExports.includes(familyName)) {
			allFontExports.push(familyName);
		}
	});

	// 为每个字体族生成配置（使用合并后的字体族）
	for (const [familyName, fonts] of Object.entries(mergedFontFamilies)) {
		const exportName = familyName;
		const variantInfo = fontVariantInfo[familyName];

		// 注意：不需要再添加到导出列表，已在上面处理了

		if (fonts.length === 1) {
			// 单个字体文件
			const font = fonts[0];
			let fontPath;

			if (font.isExisting) {
				// 使用现有字体的原始路径，确保有正确的../前缀
				fontPath = font.originalPath;
				if (!fontPath.startsWith("../")) {
					fontPath = "../" + fontPath;
				}
			} else {
				// 新字体文件
				const ext = path.extname(font.originalPath);
				const standardName = generateStandardFontName(font, ext);
				fontPath = `../public/fonts/${familyName}/${standardName}`;
			}

			configContent += `export const ${exportName} = localFont({
	src: "${fontPath}",
	variable: "--font-${familyName.toLowerCase()}",
	display: "swap",
	preload: false, // 非阻塞加载优化
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
				let fontPath;

				if (font.isExisting) {
					// 使用现有字体的原始路径，确保有正确的../前缀
					fontPath = font.originalPath;
					if (!fontPath.startsWith("../")) {
						fontPath = "../" + fontPath;
					}
				} else {
					// 新字体文件
					const ext = path.extname(font.originalPath);
					const standardName = generateStandardFontName(font, ext);
					fontPath = `../public/fonts/${familyName}/${standardName}`;
				}

				configContent += `		{
			path: "${fontPath}",
			weight: "${font.weight}",
			style: "${font.style}",
		},
`;
			});

			configContent += `	],
	variable: "--font-${familyName.toLowerCase()}",
	display: "swap",
	preload: false, // 非阻塞加载优化
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
	existingVariants.forEach((fontName) => {
		if (!Object.keys(fontFamilies).includes(fontName)) {
			availableVariants.push(fontName);
		}
	});

	// 添加所有字体的变体信息（包括合并后的字体族）
	Object.keys(mergedFontFamilies).forEach((familyName) => {
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
