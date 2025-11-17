import { useState, useEffect, useCallback, useRef } from "react";
import { Card, Button, Select, Slider, Switch, Space, App, ColorPicker } from "antd";
import { HeartFilled, HeartOutlined, SettingOutlined, ItalicOutlined, DownloadOutlined } from "@ant-design/icons";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { downloadFontFile } from "@/utils/fontDownload";
import { fontVariantsMap } from "../../../styles/fonts";

import {
	findClosestWeight,
	findAvailableStyle,
	getAvailableWeightMarks,
	supportsItalic,
	supportsNormal,
	getOnlyAvailableStyle,
	createWeightSliderConfig,
} from "@/utils/fontVariants";
import type { Color, NextFontWithVariableWithLiked, FontVariantInfo } from "@/types/global";
import styles from "./MyFont.module.css";

type MyFontProps = {
	font: NextFontWithVariableWithLiked;
	onToggleLike: (fontName: string) => void;
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
	const { isDark } = useTheme();

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

	// Font loading state - 单向状态机
	const [fontLoadingStatus, setFontLoadingStatus] = useState<"loading" | "loaded" | "failed" | "not-started">("not-started");
	const [allVariantsLoaded, setAllVariantsLoaded] = useState(false);
	const [hasStartedLoad, setHasStartedLoad] = useState(false);
	const [isVisible, setIsVisible] = useState(false);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const DEBUG = process.env.NODE_ENV !== "production";

	// Adjusted values based on font variants
	const [adjustedGlobalWeight, setAdjustedGlobalWeight] = useState<number>(globalFontWeight);
	const [adjustedGlobalStyle, setAdjustedGlobalStyle] = useState<boolean>(globalIsItalic);

	// 视窗懒加载 + 变体按需加载
	useEffect(() => {
		if (!containerRef.current) return;
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						setIsVisible(true);
					} else {
						setIsVisible(false);
					}
				});
			},
			{ root: null, threshold: 0.1 }
		);
		observer.observe(containerRef.current);
		return () => observer.disconnect();
	}, []);

	useEffect(() => {
		let isMounted = true;
		const startTs = performance.now();

		const dispatchStart = () => {
			try {
				document.dispatchEvent(
					new CustomEvent("fontLoadStart", { detail: { fontClassName: font.className, fontFamily: fontFamilyName } })
				);
			} catch {}
		};
		const dispatchSuccess = () => {
			try {
				const loadTime = Math.round(performance.now() - startTs);
				document.dispatchEvent(
					new CustomEvent("fontLoaded", { detail: { fontClassName: font.className, loadTime } })
				);
			} catch {}
		};
		const dispatchError = (error: unknown) => {
			try {
				document.dispatchEvent(
					new CustomEvent("fontError", { detail: { fontClassName: font.className, error: String(error) } })
				);
			} catch {}
		};

		const loadDescriptor = async (weight: number, style: "normal" | "italic") => {
			const fontDescriptor = `${style === "italic" ? "italic " : ""}${weight} 16px "${fontFamilyName}"`;
			if (document.fonts && document.fonts.load) {
				return document.fonts.load(fontDescriptor).then((res) => res[0] as FontFace);
			}
			// 兼容降级
			return new Promise<FontFace>((resolve, reject) => {
				const testElement = document.createElement("div");
				testElement.style.fontFamily = `"${fontFamilyName}", serif`;
				testElement.style.fontWeight = String(weight);
				testElement.style.fontStyle = style;
				testElement.style.fontSize = "16px";
				testElement.style.position = "absolute";
				testElement.style.left = "-9999px";
				testElement.style.opacity = "0";
				testElement.textContent = "Font loading test";
				document.body.appendChild(testElement);
				let attempts = 0;
				const maxAttempts = 100;
				const checkFont = () => {
					attempts++;
					const computed = window.getComputedStyle(testElement);
					const actualFamily = computed.fontFamily;
					if (actualFamily.includes(fontFamilyName) || attempts >= maxAttempts) {
						document.body.removeChild(testElement);
						if (attempts >= maxAttempts) {
							reject(new Error(`字体加载超时: ${fontFamilyName} ${weight} ${style}`));
						} else {
							resolve({ family: fontFamilyName } as FontFace);
						}
					} else {
						setTimeout(checkFont, 100);
					}
				};
				setTimeout(checkFont, 100);
			});
		};

		const startLoad = async () => {
			if (hasStartedLoad || !isVisible) return;
			setHasStartedLoad(true);
			if (!fontVariants || !fontVariants.variants || fontVariants.variants.length === 0) {
				setAllVariantsLoaded(true);
				setFontLoadingStatus("loaded");
				return;
			}

			setFontLoadingStatus("loading");
			dispatchStart();
			try {
				// 优先加载当前展示所需权重/样式
				const desiredWeight = fontVariants ? findClosestWeight(fontVariants.weights, individualFontWeight ?? adjustedGlobalWeight) : individualFontWeight ?? adjustedGlobalWeight;
				const desiredStyleName = fontVariants ? findAvailableStyle(fontVariants.styles, (individualIsItalic ?? adjustedGlobalStyle) ? "italic" : "normal") : (individualIsItalic ?? adjustedGlobalStyle) ? "italic" : "normal";
				await loadDescriptor(desiredWeight, desiredStyleName === "italic" ? "italic" : "normal");
				// 后台分批加载其他变体
				const rest = fontVariants.variants.filter(v => !(v.weight === desiredWeight && v.style === desiredStyleName));
				for (let i = 0; i < rest.length; i++) {
					const v = rest[i];
					try {
						await loadDescriptor(v.weight, v.style === "italic" ? "italic" : "normal");
					} catch (e) {
						if (DEBUG) console.warn("变体加载失败", v, e);
					}
					if (i % 2 === 1) await new Promise(r => setTimeout(r, 80));
				}
				if (isMounted) {
					setAllVariantsLoaded(true);
					setFontLoadingStatus("loaded");
					dispatchSuccess();
				}
			} catch (error) {
				if (DEBUG) console.error("字体加载出错", error);
				if (isMounted) {
					setAllVariantsLoaded(false);
					setFontLoadingStatus("failed");
					dispatchError(error);
				}
			}
		};

		startLoad();
		return () => {
			isMounted = false;
		};
	}, [isVisible, fontVariants, fontFamilyName, font.className, individualFontWeight, adjustedGlobalWeight, individualIsItalic, adjustedGlobalStyle]);

	// Effect to adjust global settings when they change
	useEffect(() => {
		if (fontVariants) {
			// Auto-adjust global weight to closest available
			const closestWeight = findClosestWeight(fontVariants.weights, globalFontWeight);
			setAdjustedGlobalWeight(closestWeight);

			// If this font only supports one style, force that style
			const onlyStyle = getOnlyAvailableStyle(fontVariants);
			if (onlyStyle) {
				setAdjustedGlobalStyle(onlyStyle === "italic");
			} else {
				// Auto-adjust global italic style if not supported
				const availableStyle = findAvailableStyle(fontVariants.styles, globalIsItalic ? "italic" : "normal");
				setAdjustedGlobalStyle(availableStyle === "italic");
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

	// Font style object with dynamic font switching
	const getFontStyle = () => {
		const finalWeight = individualFontWeight ?? adjustedGlobalWeight;
		const finalStyle = individualIsItalic ?? adjustedGlobalStyle;

		// Ensure the final weight is available for this font
		const adjustedWeight = fontVariants ? findClosestWeight(fontVariants.weights, finalWeight) : finalWeight;

		// Ensure the final style is available for this font
		const adjustedStyle = fontVariants ? findAvailableStyle(fontVariants.styles, finalStyle ? "italic" : "normal") === "italic" : finalStyle;

		// 根据字体加载状态决定使用的字体
		const fontFamily = allVariantsLoaded ? `${font.style.fontFamily}, var(--font-chinese-fallback)` : "var(--font-chinese-fallback)";

		const style = {
			fontFamily,
			color: (individualFontColor ?? globalFontColor).toString(),
			fontSize: `${individualFontSize ?? globalFontSize}px`,
			fontWeight: adjustedWeight,
			fontStyle: adjustedStyle ? "italic" : "normal",
			lineHeight: 1.6,
			wordWrap: "break-word" as const,
			whiteSpace: "pre-wrap" as const,
			// 添加过渡效果使字体切换更平滑
			transition: "font-family 0.3s ease-in-out",
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
			const finalWeight = fontVariants ? findClosestWeight(fontVariants.weights, currentWeight) : currentWeight;
			const finalStyle = fontVariants
				? findAvailableStyle(fontVariants.styles, currentStyle ? "italic" : "normal")
				: currentStyle
				? "italic"
				: "normal";

			await downloadFontFile(font, "ttf", finalWeight, finalStyle as "normal" | "italic", fontVariants);

			message.success(
				language === "zh"
					? `${fontFamilyName} 字体下载成功！(${finalWeight} ${finalStyle === "italic" ? "斜体" : "正常"})`
					: `${fontFamilyName} font downloaded successfully! (${finalWeight} ${finalStyle})`
			);
		} catch (error) {
			console.error("Download failed:", error);
			message.error(language === "zh" ? "字体下载失败，请重试" : "Font download failed, please try again");
		} finally {
			setIsDownloading(false);
		}
	};

	// Memoize tooltip formatter to prevent infinite re-renders
	const tooltipFormatter = useCallback(
		(value: number) => {
			const weightNames =
				language === "zh"
					? {
							100: "极细",
							200: "特细",
							300: "细",
							400: "正常",
							500: "中等",
							600: "中粗",
							700: "粗",
							800: "特粗",
							900: "超粗",
					  }
					: {
							100: "Thin",
							200: "ExtraLight",
							300: "Light",
							400: "Regular",
							500: "Medium",
							600: "SemiBold",
							700: "Bold",
							800: "ExtraBold",
							900: "Black",
					  };
			return weightNames[value as keyof typeof weightNames] || value?.toString();
		},
		[language]
	);

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
				onClick={() => onToggleLike(fontFamilyName)}
				aria-label={font.isLiked ? t.font.unfavorite : t.font.favorite}
				size="large"
			/>
		</Space>
	);

	return (
		<Card
			hoverable
			extra={cardExtra}
			className="border-0 shadow-sm hover:shadow-md transition-all duration-200 w-full"
			styles={{ body: { padding: "18px 24px", minWidth: 0, width: "100%" } }}
			style={{
				backgroundColor: isDark ? 'rgba(31, 31, 31, 0.9)' : 'rgba(255, 255, 255, 0.95)',
				borderColor: isDark ? '#434343' : '#d9d9d9'
			}}
		>
			<div ref={containerRef} className="space-y-4 sm:space-y-5">
				{/* Font name and control buttons */}
				<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
					<div className="flex items-center space-x-2 min-w-0">
						<h3 className="text-base sm:text-lg font-medium mb-0 truncate" style={{ color: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.88)" }}>
							{fontFamilyName}
						</h3>

						{/* 字体加载状态指示器 - 准确显示加载状态 */}
						{fontLoadingStatus === "loading" && (
							<span
								className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
								style={{
									backgroundColor: isDark ? "rgba(103, 153, 254, 0.12)" : "rgba(24, 144, 255, 0.12)",
									color: isDark ? "#6799FE" : "#1677ff",
								}}
							>
								⏳ {language === "zh" ? "加载中" : "Loading"}
							</span>
						)}
						{fontLoadingStatus === "loaded" && (
							<span
								className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
								style={{
									backgroundColor: isDark ? "rgba(82, 196, 26, 0.12)" : "rgba(82, 196, 26, 0.12)",
									color: isDark ? "#52c41a" : "#52c41a",
								}}
							>
								✅ {language === "zh" ? "已加载" : "Loaded"}
							</span>
						)}
						{fontLoadingStatus === "failed" && (
							<span
								className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
								style={{
									backgroundColor: isDark ? "rgba(255, 77, 79, 0.12)" : "rgba(255, 77, 79, 0.12)",
									color: isDark ? "#ff4d4f" : "#ff4d4f",
								}}
							>
								❌ {language === "zh" ? "加载失败" : "Failed"}
							</span>
						)}

						{hasIndividualSettings && (
							<span
								className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
								style={{
									backgroundColor: isDark ? "rgba(103, 153, 254, 0.12)" : "rgba(24, 144, 255, 0.12)",
									color: isDark ? "#6799FE" : "#1677ff",
								}}
							>
								{language === "zh" ? "个别设置" : "Custom"}
							</span>
						)}
						{fontVariants && (
							<span
								className="text-xs px-2 py-1 rounded-full whitespace-nowrap"
								style={{
									backgroundColor: isDark ? "#292929" : "#f5f5f5",
									color: isDark ? "#8E9094" : "rgba(0, 0, 0, 0.65)",
									border: isDark ? "1px solid #404040" : "1px solid #d9d9d9",
								}}
							>
								{fontVariants.totalVariants} {language === "zh" ? "变体" : "variants"}
							</span>
						)}
					</div>
					<div className="flex flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-end min-w-0">
						{/* 移动端：堆叠显示，桌面端：横向排列 */}
						{!globalCustomText.trim() && (
							<div className="flex items-center gap-2 order-2 sm:order-1 min-w-0">
								<span className="text-xs font-medium whitespace-nowrap flex-shrink-0" style={{ color: isDark ? "#d9d9d9" : "rgba(0, 0, 0, 0.65)" }}>
									{t.font.textSamples}
								</span>
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
									style={{ minWidth: "70px", maxWidth: "100%", width: "140px", flexShrink: 1 }}
									getPopupContainer={(triggerNode) => triggerNode.parentElement || document.body}
								/>
							</div>
						)}
						{globalCustomText.trim() && (
							<div
								className="px-3 py-2 rounded-md border order-2 sm:order-1"
								style={{
									backgroundColor: isDark ? "rgba(24, 144, 255, 0.08)" : "rgba(24, 144, 255, 0.08)",
									borderColor: isDark ? "rgba(24, 144, 255, 0.2)" : "rgba(24, 144, 255, 0.2)",
								}}
							>
								<span className="text-xs font-medium whitespace-nowrap" style={{ color: isDark ? "#1890ff" : "#1677ff" }}>
									{t.font.globalTextUsed}
								</span>
							</div>
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
							<div className="flex items-center justify-between mb-4">
								<h4 className="text-sm sm:text-base font-medium mb-0 flex-1 min-w-0" style={{ color: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.88)" }}>
									{t.font.individualSettings}
								</h4>
								<div className="flex-shrink-0 ml-3">
									{hasIndividualSettings && (
										<Button
											size="small"
											type="link"
											onClick={resetIndividualSettings}
											style={{
												padding: "0 8px",
												minWidth: "auto",
												height: "24px",
												fontSize: "12px",
												color: isDark ? "#1890ff" : "#1677ff",
											}}
										>
											{t.font.reset}
										</Button>
									)}
								</div>
							</div>

							{/* 移动端: 垂直堆叠, 桌面端: 网格布局 */}
							<div className="flex flex-col sm:grid sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
								{/* Font size */}
								<div className={`${styles.individualConfigItem} min-w-0 flex-shrink-0`}>
									<div className="flex justify-between items-center mb-2">
										<span className="font-medium text-xs sm:text-sm whitespace-nowrap" style={{ color: isDark ? "#d9d9d9" : "rgba(0, 0, 0, 0.65)" }}>
											{t.controls.fontSize}
										</span>
										<span
											className="text-xs text-white px-2 py-1 rounded-full font-medium"
											style={{
												backgroundColor: isDark ? "rgba(103, 153, 254, 0.8)" : "rgba(24, 144, 255, 0.8)",
											}}
										>
											{individualFontSize ?? globalFontSize}px
										</span>
									</div>
									<div className={styles.sliderContainer}>
										<Slider min={14} max={64} value={individualFontSize ?? globalFontSize} onChange={(value) => setIndividualFontSize(value)} />
									</div>
								</div>

								{/* Font weight */}
								<div className={`${styles.individualConfigItem} min-w-0 flex-shrink-0`}>
									<div className="flex justify-between items-center mb-2">
										<span className="font-medium text-xs sm:text-sm whitespace-nowrap" style={{ color: isDark ? "#d9d9d9" : "rgba(0, 0, 0, 0.65)" }}>
											{t.controls.fontWeight}
										</span>
										<span
											className="text-xs text-white px-2 py-1 rounded-full font-medium"
											style={{
												backgroundColor: isDark ? "rgba(114, 46, 209, 0.8)" : "rgba(114, 46, 209, 0.8)",
											}}
										>
											{individualFontWeight ?? adjustedGlobalWeight}
										</span>
									</div>
									<div className={`px-1 sm:px-2 ${styles.weightSliderContainer}`}>
										<div
											className={`${styles.sliderWrapper} ${
												"useShortMarks" in weightConfig && weightConfig.useShortMarks ? styles.shortMarks : styles.fullMarks
											}`}
										>
											{weightConfig.max > weightConfig.min && (
												<Slider
													min={weightConfig.min}
													max={weightConfig.max}
													step={weightConfig.step}
													value={individualFontWeight ?? adjustedGlobalWeight}
													onChange={(value) => {
														// If we have font variants, ensure the selected weight is available
														const adjustedValue = fontVariants ? findClosestWeight(fontVariants.weights, value) : value;
														setIndividualFontWeight(adjustedValue);
													}}
													marks={weightConfig.marks}
													tooltip={{
														formatter: (value?: number) => (value ? tooltipFormatter(value) : ""),
													}}
												/>
											)}
										</div>
									</div>
									{fontVariants && (
										<div className="mt-1 text-xs hidden sm:block" style={{ color: isDark ? "#1890ff" : "#1677ff" }}>
											{language === "zh" ? `可用权重: ${fontVariants.weights.join(", ")}` : `Available weights: ${fontVariants.weights.join(", ")}`}
										</div>
									)}
								</div>

								{/* Font color */}
								<div className={`${styles.individualConfigItem} min-w-0 flex-shrink-0`}>
									<div className="mb-2 sm:mb-3">
										<span
											className="font-medium text-xs sm:text-sm block whitespace-nowrap"
											style={{ color: isDark ? "#d9d9d9" : "rgba(0, 0, 0, 0.65)" }}
										>
											{t.controls.fontColor}
										</span>
									</div>
									<div className={styles.centerContainer}>
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
														"#3498db",
														"#000000",
														"#333333",
														"#666666",
														"#999999",
														"#e74c3c",
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
										<span
											className="font-medium text-xs sm:text-sm block whitespace-nowrap"
											style={{ color: isDark ? "#d9d9d9" : "rgba(0, 0, 0, 0.65)" }}
										>
											{t.controls.fontStyle}
										</span>
									</div>
									<div className={styles.centerContainer}>
										<Switch
											checked={individualIsItalic ?? adjustedGlobalStyle}
											onChange={(checked) => {
												// If font only supports one style, don't allow changes
												if (onlyAvailableStyle) {
													return; // Do nothing if only one style is available
												}
												// Only allow the change if the font supports the target style
												const finalValue = checked ? (italicSupported ? true : false) : normalSupported ? false : true;
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
												<span style={{ color: onlyAvailableStyle === "italic" ? (isDark ? "#1890ff" : "#1677ff") : "#52c41a" }}>
													{language === "zh"
														? onlyAvailableStyle === "italic"
															? "仅斜体"
															: "仅正常"
														: onlyAvailableStyle === "italic"
														? "Italic only"
														: "Normal only"}
												</span>
											) : italicSupported && normalSupported ? (
												<span className="hidden sm:inline" style={{ color: "#52c41a" }}>
													{language === "zh" ? "正常+斜体" : "Both styles"}
												</span>
											) : italicSupported ? (
												<span className="hidden sm:inline" style={{ color: "#52c41a" }}>
													{language === "zh" ? "支持斜体" : "Italic supported"}
												</span>
											) : normalSupported ? (
												<span className="hidden sm:inline" style={{ color: "#52c41a" }}>
													{language === "zh" ? "支持正常" : "Normal supported"}
												</span>
											) : (
												<span className="hidden sm:inline" style={{ color: isDark ? "#8c8c8c" : "rgba(0, 0, 0, 0.45)" }}>
													{language === "zh" ? "样式不可用" : "Style unavailable"}
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
							className="font-preview-textarea w-full resize-none focus:outline-none"
							rows={2}
						/>
					</div>
				)}

				{/* Font preview area - 确保在移动设备上始终可见 */}
				<div
					style={{
						...getFontStyle(),
						minHeight: showIndividualConfig ? "80px" : "100px", // 设置面板展开时减小最小高度
						padding: showIndividualConfig ? "16px 20px" : "20px 24px", // 设置面板展开时减小内边距
						backgroundColor: isDark ? "#1f1f1f" : "#ffffff",
						borderRadius: "6px",
						border: isDark ? "1px solid #434343" : "1px solid #d9d9d9",
						boxShadow: "0 2px 0 rgba(0, 0, 0, 0.02)",
						wordBreak: "break-word",
						overflowWrap: "break-word",
					}}
					className={`font-preview-area transition-all duration-300 w-full flex-shrink-0 ${showIndividualConfig ? "mt-2 sm:mt-3" : ""}`}
				>
					{getCurrentSampleText()}
				</div>
			</div>
		</Card>
	);
}
