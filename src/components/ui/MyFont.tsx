import { useState, useEffect } from "react";
import { Card, Button, Select, Slider, Switch, Space, App, ColorPicker } from "antd";
import { HeartFilled, HeartOutlined, SettingOutlined, ItalicOutlined, DownloadOutlined } from "@ant-design/icons";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadFontFile } from "@/utils/fontDownload";
import { fontVariantsMap } from "../../../styles/fonts";
import { 
	findClosestWeight, 
	findAvailableStyle, 
	getAvailableWeightMarks, 
	supportsItalic,
	supportsNormal,
	getOnlyAvailableStyle,
	createWeightSliderConfig 
} from "@/utils/fontVariants";
import type { Color, NextFontWithVariableWithLiked, FontVariantInfo } from "@/types/global";
import styles from './MyFont.module.css';

type MyFontProps = {
	font: NextFontWithVariableWithLiked;
	onToggleLike: (className: string) => void;
	globalFontSize: number;
	globalFontWeight: number;
	globalFontColor: Color;
	globalIsItalic: boolean;
	globalCustomText: string;
};

export default function MyFont({
	font,
	onToggleLike,
	globalFontSize,
	globalFontWeight,
	globalFontColor,
	globalIsItalic,
	globalCustomText,
}: MyFontProps) {
	const { t, language } = useLanguage();
	const { message } = App.useApp();

	// Get font name and variant info
	const fontFamilyName = font.style.fontFamily.split(",")[0].slice(1, -1);
	const fontVariants: FontVariantInfo | undefined = fontVariantsMap[fontFamilyName];

	// State management
	const [selectedSample, setSelectedSample] = useState("pangram");
	const [customText, setCustomText] = useState("");
	const [showIndividualConfig, setShowIndividualConfig] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);

	// Individual font settings state
	const [individualFontSize, setIndividualFontSize] = useState<number | null>(null);
	const [individualFontWeight, setIndividualFontWeight] = useState<number | null>(null);
	const [individualFontColor, setIndividualFontColor] = useState<Color | null>(null);
	const [individualIsItalic, setIndividualIsItalic] = useState<boolean | null>(null);

	// Adjusted values based on font variants
	const [adjustedGlobalWeight, setAdjustedGlobalWeight] = useState<number>(globalFontWeight);
	const [adjustedGlobalStyle, setAdjustedGlobalStyle] = useState<boolean>(globalIsItalic);

	// Effect to adjust global settings when they change
	useEffect(() => {
		if (fontVariants) {
			// Auto-adjust global weight to closest available
			const closestWeight = findClosestWeight(fontVariants.weights, globalFontWeight);
			setAdjustedGlobalWeight(closestWeight);

			// If this font only supports one style, force that style
			const onlyStyle = getOnlyAvailableStyle(fontVariants);
			if (onlyStyle) {
				setAdjustedGlobalStyle(onlyStyle === 'italic');
			} else {
				// Auto-adjust global italic style if not supported
				const availableStyle = findAvailableStyle(fontVariants.styles, globalIsItalic ? 'italic' : 'normal');
				setAdjustedGlobalStyle(availableStyle === 'italic');
			}
		} else {
			// If no variant info, use global values as-is
			setAdjustedGlobalWeight(globalFontWeight);
			setAdjustedGlobalStyle(globalIsItalic);
		}
	}, [globalFontWeight, globalIsItalic, fontVariants]);

	// Get weight configuration for this font
	const weightConfig = fontVariants 
		? createWeightSliderConfig(fontVariants.weights, individualFontWeight ?? adjustedGlobalWeight, language)
		: getAvailableWeightMarks(undefined, language);

	// Check if different styles are supported
	const italicSupported = supportsItalic(fontVariants);
	const normalSupported = supportsNormal(fontVariants);
	const onlyAvailableStyle = getOnlyAvailableStyle(fontVariants);

	// Text samples with internationalization
	const TEXT_SAMPLES = [
		{
			key: "pangram",
			label: t.font.testSentence,
			content: language === "zh" ? "Hello world!\n你好，世界！" : "Hello world!\nAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz",
		},
		{
			key: "alphabet",
			label: t.font.alphabet,
			content: "abcdefghijklmnopqrstuvwxyz\nABCDEFGHIJKLMNOPQRSTUVWXYZ\n0123456789",
		},
		{
			key: "chinese",
			label: t.font.chinese,
			content: "人之初\n性本善\n性相近\n习相远",
		},
	];

	const getCurrentSampleText = () => {
		// If there's global custom text, use it first
		if (globalCustomText.trim()) {
			return globalCustomText;
		}

		if (selectedSample === "custom") {
			return customText || t.font.customPlaceholder;
		}
		const sample = TEXT_SAMPLES.find((s) => s.key === selectedSample);
		return sample?.content || TEXT_SAMPLES[0].content;
	};

	// Font style object
	const getFontStyle = () => {
		const finalWeight = individualFontWeight ?? adjustedGlobalWeight;
		const finalStyle = individualIsItalic ?? adjustedGlobalStyle;
		
		// Ensure the final weight is available for this font
		const adjustedWeight = fontVariants 
			? findClosestWeight(fontVariants.weights, finalWeight)
			: finalWeight;

		// Ensure the final style is available for this font  
		const adjustedStyle = fontVariants
			? findAvailableStyle(fontVariants.styles, finalStyle ? 'italic' : 'normal') === 'italic'
			: finalStyle;

		const style = {
			fontFamily: font.style.fontFamily,
			color: (individualFontColor ?? globalFontColor).toString(),
			fontSize: `${individualFontSize ?? globalFontSize}px`,
			fontWeight: adjustedWeight,
			fontStyle: adjustedStyle ? "italic" : "normal",
			lineHeight: 1.6,
			wordWrap: "break-word" as const,
			whiteSpace: "pre-wrap" as const,
		};
		return style;
	};

	// Reset individual settings
	const resetIndividualSettings = () => {
		setIndividualFontSize(null);
		setIndividualFontWeight(null);
		setIndividualFontColor(null);
		setIndividualIsItalic(null);
	};

	// Check if has individual settings
	const hasIndividualSettings =
		individualFontSize !== null || individualFontWeight !== null || individualFontColor !== null || individualIsItalic !== null;

	// Handle font download
	const handleDownload = async () => {
		if (isDownloading) return;

		setIsDownloading(true);
		try {
			// Use individual settings if available, otherwise use adjusted global settings
			const currentWeight = individualFontWeight ?? adjustedGlobalWeight;
			const currentStyle = individualIsItalic ?? adjustedGlobalStyle;
			
			// Ensure we use available weight and style for this font
			const finalWeight = fontVariants 
				? findClosestWeight(fontVariants.weights, currentWeight)
				: currentWeight;
			const finalStyle = fontVariants
				? findAvailableStyle(fontVariants.styles, currentStyle ? 'italic' : 'normal')
				: (currentStyle ? 'italic' : 'normal');
			
			await downloadFontFile(
				font, 
				"ttf", 
				finalWeight, 
				finalStyle as 'normal' | 'italic',
				fontVariants
			);
			
			message.success(
				language === "zh" 
					? `${fontFamilyName} 字体下载成功！(${finalWeight} ${finalStyle === 'italic' ? '斜体' : '正常'})` 
					: `${fontFamilyName} font downloaded successfully! (${finalWeight} ${finalStyle})`
			);
		} catch (error) {
			console.error("Download failed:", error);
			message.error(language === "zh" ? "字体下载失败，请重试" : "Font download failed, please try again");
		} finally {
			setIsDownloading(false);
		}
	};

	const cardExtra = (
		<Space>
			<Button
				type="text"
				icon={<DownloadOutlined />}
				onClick={handleDownload}
				loading={isDownloading}
				aria-label={t.font.download}
				size="large"
				title={t.font.download}
			/>
			<Button
				type="text"
				icon={<SettingOutlined />}
				onClick={() => setShowIndividualConfig(!showIndividualConfig)}
				aria-label="Individual settings"
				size="large"
				style={{ color: hasIndividualSettings ? "#1890ff" : undefined }}
			/>
			<Button
				type="text"
				icon={font.isLiked ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
				onClick={() => onToggleLike(font.className)}
				aria-label={font.isLiked ? t.font.unfavorite : t.font.favorite}
				size="large"
			/>
		</Space>
	);

	return (
		<div className={`${font.className} ${font.variable} w-full`}>
			<Card
				hoverable
				extra={cardExtra}
				className="border-0 shadow-sm hover:shadow-md transition-all duration-200 w-full"
				styles={{ body: { padding: "16px 20px", minWidth: 0 } }}
			>
				<div className="space-y-3 sm:space-y-4">
					{/* Font name and control buttons */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div className="flex items-center space-x-2 min-w-0">
							<h3 className="text-base sm:text-lg font-medium text-gray-700 mb-0 truncate">{fontFamilyName}</h3>
							{hasIndividualSettings && (
								<span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap">
									{language === "zh" ? "个别设置" : "Custom"}
								</span>
							)}
							{fontVariants && (
								<span className="text-xs bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200 px-2 py-1 rounded-full whitespace-nowrap">
									{fontVariants.totalVariants} {language === "zh" ? "变体" : "variants"}
								</span>
							)}
						</div>
						<div className="flex items-center justify-end gap-2 flex-wrap">
							{!globalCustomText.trim() && (
								<>
									<span className="text-xs sm:text-sm text-gray-500 hidden md:inline whitespace-nowrap">{t.font.textSamples}</span>
									<Select
										value={selectedSample}
										onChange={setSelectedSample}
										options={[
											...TEXT_SAMPLES.map((sample) => ({
												label: sample.label,
												value: sample.key,
											})),
											{ label: t.font.custom, value: "custom" },
										]}
										size="small"
										style={{ minWidth: 80, maxWidth: 120 }}
									/>
								</>
							)}
							{globalCustomText.trim() && (
								<span className="text-xs sm:text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded whitespace-nowrap">{t.font.globalTextUsed}</span>
							)}
						</div>
					</div>

					{/* Individual font settings panel */}
					<div
						className={`transition-all duration-300 ease-in-out ${
							showIndividualConfig ? "max-h-screen sm:max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
						}`}
					>
						{showIndividualConfig && (
							<div className={`${styles.individualConfigPanel} individual-config-panel`}>
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
									<h4 className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 mb-0">{t.font.individualSettings}</h4>
									<div className="min-w-16 h-6 flex items-center justify-end">
										<Button
											size="small"
											type="link"
											onClick={resetIndividualSettings}
											style={{
												padding: 0,
												minWidth: "auto",
												opacity: hasIndividualSettings ? 1 : 0,
												visibility: hasIndividualSettings ? "visible" : "hidden",
												transition: "opacity 0.2s ease, visibility 0.2s ease",
											}}
										>
											{t.font.reset}
										</Button>
									</div>
								</div>

								{/* 移动端: 垂直堆叠, 桌面端: 网格布局 */}
								<div className="flex flex-col sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
									{/* Font size */}
									<div className={`${styles.individualConfigItem} min-w-0 flex-shrink-0`}>
										<div className="flex justify-between items-center mb-2">
											<span className="text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">{t.controls.fontSize}</span>
											<span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded whitespace-nowrap">
												{individualFontSize ?? globalFontSize}px
											</span>
										</div>
										<Slider min={14} max={64} value={individualFontSize ?? globalFontSize} onChange={(value) => setIndividualFontSize(value)} />
									</div>

									{/* Font weight */}
									<div className={`${styles.individualConfigItem} min-w-0 flex-shrink-0`}>
										<div className="flex justify-between items-center mb-2">
											<span className="text-xs font-medium text-gray-600 dark:text-gray-300 whitespace-nowrap">{t.controls.fontWeight}</span>
											<span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded whitespace-nowrap">
												{individualFontWeight ?? adjustedGlobalWeight}
											</span>
										</div>
										<div className={`px-1 sm:px-2 ${styles.weightSliderContainer}`}>
											<div className={`${styles.sliderWrapper} ${'useShortMarks' in weightConfig && weightConfig.useShortMarks ? styles.shortMarks : styles.fullMarks}`}>
												<Slider
													min={weightConfig.min}
													max={weightConfig.max}
													step={weightConfig.step}
													value={individualFontWeight ?? adjustedGlobalWeight}
													onChange={(value) => {
														// If we have font variants, ensure the selected weight is available
														const adjustedValue = fontVariants 
															? findClosestWeight(fontVariants.weights, value)
															: value;
														setIndividualFontWeight(adjustedValue);
													}}
													marks={weightConfig.marks}
													tooltip={{
														formatter: (value) => {
															const weightNames = language === 'zh' ? {
																100: '极细', 200: '特细', 300: '细', 400: '正常',
																500: '中等', 600: '中粗', 700: '粗', 800: '特粗', 900: '超粗'
															} : {
																100: 'Thin', 200: 'ExtraLight', 300: 'Light', 400: 'Regular',
																500: 'Medium', 600: 'SemiBold', 700: 'Bold', 800: 'ExtraBold', 900: 'Black'
															};
															return weightNames[value as keyof typeof weightNames] || value?.toString();
														}
													}}
												/>
											</div>
										</div>
										{fontVariants && (
											<div className="mt-1 text-xs text-blue-600 hidden sm:block">
												{language === 'zh' 
													? `可用权重: ${fontVariants.weights.join(', ')}`
													: `Available weights: ${fontVariants.weights.join(', ')}`
												}
											</div>
										)}
									</div>

									{/* Font color */}
									<div className={`${styles.individualConfigItem} min-w-0 flex-shrink-0`}>
										<div className="mb-2 sm:mb-3">
											<span className="text-xs font-medium text-gray-600 dark:text-gray-300 block whitespace-nowrap">{t.controls.fontColor}</span>
										</div>
										<div className="flex justify-center">
											<ColorPicker
												value={individualFontColor ?? globalFontColor}
												onChange={(color) => {
													const hexColor = color.toHexString();
													setIndividualFontColor(hexColor);
												}}
												onChangeComplete={(color) => {
													const hexColor = color.toHexString();
													setIndividualFontColor(hexColor);
												}}
												showText
												size="small"
												presets={[
													{
														label: t.controls.commonColors,
														colors: [
															"#000000",
															"#333333",
															"#666666",
															"#999999",
															"#e74c3c",
															"#3498db",
															"#2ecc71",
															"#f39c12",
															"#9b59b6",
															"#1abc9c",
															"#34495e",
															"#7f8c8d",
														],
													},
												]}
												placement="bottomLeft"
												style={{ zIndex: 9999 }}
											/>
										</div>
									</div>

									{/* Italic style */}
									<div className={`${styles.individualConfigItem} min-w-0 flex-shrink-0`}>
										<div className="mb-2 sm:mb-3">
											<span className="text-xs font-medium text-gray-600 dark:text-gray-300 block whitespace-nowrap">{t.controls.fontStyle}</span>
										</div>
										<div className="flex justify-center">
											<Switch
												checked={individualIsItalic ?? adjustedGlobalStyle}
												onChange={(checked) => {
													// If font only supports one style, don't allow changes
													if (onlyAvailableStyle) {
														return; // Do nothing if only one style is available
													}
													// Only allow the change if the font supports the target style
													const finalValue = checked ? 
														(italicSupported ? true : false) : 
														(normalSupported ? false : true);
													setIndividualIsItalic(finalValue);
												}}
												disabled={onlyAvailableStyle !== null || (!italicSupported && !normalSupported)}
												checkedChildren={<ItalicOutlined />}
												unCheckedChildren={<span className="text-xs">{language === "zh" ? "正常" : "Normal"}</span>}
											/>
										</div>
										{fontVariants && (
											<div className="mt-1 text-xs text-center">
												{onlyAvailableStyle ? (
													<span className={onlyAvailableStyle === 'italic' ? "text-blue-600" : "text-green-600"}>
														{language === 'zh' ? 
															(onlyAvailableStyle === 'italic' ? '仅斜体' : '仅正常') : 
															(onlyAvailableStyle === 'italic' ? 'Italic only' : 'Normal only')
														}
													</span>
												) : italicSupported && normalSupported ? (
													<span className="text-green-600 hidden sm:inline">
														{language === 'zh' ? '正常+斜体' : 'Both styles'}
													</span>
												) : italicSupported ? (
													<span className="text-green-600 hidden sm:inline">
														{language === 'zh' ? '支持斜体' : 'Italic supported'}
													</span>
												) : normalSupported ? (
													<span className="text-green-600 hidden sm:inline">
														{language === 'zh' ? '支持正常' : 'Normal supported'}  
													</span>
												) : (
													<span className="text-gray-400 hidden sm:inline">
														{language === 'zh' ? '样式不可用' : 'Style unavailable'}
													</span>
												)}
											</div>
										)}
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Custom text input */}
					{selectedSample === "custom" && !globalCustomText.trim() && (
						<div className="w-full">
							<textarea
								value={customText}
								onChange={(e) => setCustomText(e.target.value)}
								placeholder={t.font.customPlaceholder}
								className="w-full p-2 sm:p-3 border border-gray-200 rounded-lg resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors text-sm"
								rows={2}
							/>
						</div>
					)}

					{/* Font preview area - 确保在移动设备上始终可见 */}
					<div
						style={{
							...getFontStyle(),
							minHeight: showIndividualConfig ? "80px" : "100px", // 设置面板展开时减小最小高度
							padding: showIndividualConfig ? "12px" : "16px", // 设置面板展开时减小内边距
							background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
							borderRadius: "12px",
							border: "2px solid #e2e8f0",
							boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)",
							wordBreak: "break-word",
							overflowWrap: "break-word",
						}}
						className={`font-preview-area transition-all duration-300 hover:shadow-md hover:border-blue-200 w-full flex-shrink-0 ${
							showIndividualConfig ? 'mt-2' : ''
						}`}
					>
						{getCurrentSampleText()}
					</div>
				</div>
			</Card>
		</div>
	);
}
