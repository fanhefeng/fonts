import { useState } from "react";
import { Card, Button, Select, Slider, Switch, Space, App, ColorPicker } from "antd";
import { HeartFilled, HeartOutlined, SettingOutlined, ItalicOutlined, DownloadOutlined } from "@ant-design/icons";
import { useLanguage } from "@/contexts/LanguageContext";
import { downloadFontFile } from "@/utils/fontDownload";
import type { Color, NextFontWithVariableWithLiked } from "@/types/global";

type MyFontProps = {
	font: NextFontWithVariableWithLiked;
	onToggleLike: (className: string) => void;
	globalFontSize: number;
	globalFontWeight: number;
	globalFontColor: Color;
	globalIsItalic: boolean;
	globalCustomText: string;
};

export default function MyFont({ font, onToggleLike, globalFontSize, globalFontWeight, globalFontColor, globalIsItalic, globalCustomText }: MyFontProps) {
	const { t, language } = useLanguage();
	const { message } = App.useApp();
	
	// Get font name
	const fontFamilyName = font.style.fontFamily.split(",")[0].slice(1, -1);
	
	// State management
	const [selectedSample, setSelectedSample] = useState('pangram');
	const [customText, setCustomText] = useState('');
	const [showIndividualConfig, setShowIndividualConfig] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	
	// Individual font settings state
	const [individualFontSize, setIndividualFontSize] = useState<number | null>(null);
	const [individualFontWeight, setIndividualFontWeight] = useState<number | null>(null);
	const [individualFontColor, setIndividualFontColor] = useState<Color | null>(null);
	const [individualIsItalic, setIndividualIsItalic] = useState<boolean | null>(null);

	// Text samples with internationalization
	const TEXT_SAMPLES = [
		{
			key: 'pangram',
			label: t.font.testSentence,
			content: language === 'zh' 
				? 'The quick brown fox jumps over the lazy dog.\n敏捷的棕色狐狸跳过懒惰的狗。'
				: 'The quick brown fox jumps over the lazy dog.\nAaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz'
		},
		{
			key: 'alphabet',
			label: t.font.alphabet,
			content: 'abcdefghijklmnopqrstuvwxyz\nABCDEFGHIJKLMNOPQRSTUVWXYZ\n0123456789'
		},
		{
			key: 'chinese',
			label: t.font.chinese,
			content: language === 'zh'
				? '中华人民共和国\n北京上海广州深圳\n汉字书法艺术文化'
				: 'China People\'s Republic\nBeijing Shanghai Guangzhou Shenzhen\nChinese Calligraphy Art Culture'
		}
	];

	const getCurrentSampleText = () => {
		// If there's global custom text, use it first
		if (globalCustomText.trim()) {
			return globalCustomText;
		}
		
		if (selectedSample === 'custom') {
			return customText || t.font.customPlaceholder;
		}
		const sample = TEXT_SAMPLES.find(s => s.key === selectedSample);
		return sample?.content || TEXT_SAMPLES[0].content;
	};

	// Font style object
	const getFontStyle = () => {
		const style = {
			fontFamily: font.style.fontFamily,
			color: (individualFontColor ?? globalFontColor).toString(),
			fontSize: `${individualFontSize ?? globalFontSize}px`,
			fontWeight: individualFontWeight ?? globalFontWeight,
			fontStyle: (individualIsItalic ?? globalIsItalic) ? "italic" : "normal",
			lineHeight: 1.6,
			wordWrap: "break-word" as const,
			whiteSpace: "pre-wrap" as const
		};
		console.log('Font style:', style);
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
	const hasIndividualSettings = individualFontSize !== null || individualFontWeight !== null || individualFontColor !== null || individualIsItalic !== null;

	// Handle font download
	const handleDownload = async () => {
		if (isDownloading) return;
		
		setIsDownloading(true);
		try {
			// Use individual settings if available, otherwise use global settings
			const currentWeight = individualFontWeight ?? globalFontWeight;
			await downloadFontFile(font, 'ttf', currentWeight);
			message.success(language === 'zh' ? `${fontFamilyName} 字体下载成功！` : `${fontFamilyName} font downloaded successfully!`);
		} catch (error) {
			console.error('Download failed:', error);
			message.error(language === 'zh' ? '字体下载失败，请重试' : 'Font download failed, please try again');
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
				styles={{ body: { padding: '16px 20px', minWidth: 0 } }}
			>
				<div className="space-y-3 sm:space-y-4">
					{/* Font name and control buttons */}
					<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
						<div className="flex items-center space-x-2 min-w-0">
							<h3 className="text-base sm:text-lg font-medium text-gray-700 mb-0 truncate">
								{fontFamilyName}
							</h3>
							{hasIndividualSettings && (
								<span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full whitespace-nowrap">
									{language === 'zh' ? '个别设置' : 'Custom'}
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
											...TEXT_SAMPLES.map(sample => ({
												label: sample.label,
												value: sample.key
											})),
											{ label: t.font.custom, value: 'custom' }
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
					<div className={`transition-all duration-300 ease-in-out ${showIndividualConfig ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
						{showIndividualConfig && (
							<div className="bg-gray-50 p-3 sm:p-4 rounded-lg border individual-config-panel">
								<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
									<h4 className="text-xs sm:text-sm font-medium text-gray-700 mb-0">{t.font.individualSettings}</h4>
									<div className="min-w-16 h-6 flex items-center justify-end">
										<Button 
											size="small" 
											type="link" 
											onClick={resetIndividualSettings}
											style={{ 
												padding: 0, 
												minWidth: 'auto',
												opacity: hasIndividualSettings ? 1 : 0,
												visibility: hasIndividualSettings ? 'visible' : 'hidden',
												transition: 'opacity 0.2s ease, visibility 0.2s ease'
											}}
										>
											{t.font.reset}
										</Button>
									</div>
								</div>
								
								<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
									{/* Font size */}
									<div className="bg-white p-3 rounded-lg shadow-sm min-w-0">
										<div className="flex justify-between items-center mb-2">
											<span className="text-xs font-medium text-gray-600 whitespace-nowrap">{t.controls.fontSize}</span>
											<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
												{individualFontSize ?? globalFontSize}px
											</span>
										</div>
										<Slider 
											min={14} 
											max={64} 
											value={individualFontSize ?? globalFontSize} 
											onChange={(value) => setIndividualFontSize(value)}
										/>
									</div>

									{/* Font weight */}
									<div className="bg-white p-3 rounded-lg shadow-sm min-w-0">
										<div className="flex justify-between items-center mb-2">
											<span className="text-xs font-medium text-gray-600 whitespace-nowrap">{t.controls.fontWeight}</span>
											<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
												{individualFontWeight ?? globalFontWeight}
											</span>
										</div>
										<div className="px-2">
											<Slider 
												min={100} 
												max={900} 
												step={100} 
												value={individualFontWeight ?? globalFontWeight} 
												onChange={(value) => setIndividualFontWeight(value)}
												marks={language === 'zh' ? {
													100: '细',
													400: '正常',
													700: '粗',
													900: '超粗'
												} : {
													100: 'Thin',
													400: 'Reg',
													700: 'Bold',
													900: 'Extra'
												}}
											/>
										</div>
									</div>

									{/* Font color */}
									<div className="bg-white p-3 rounded-lg shadow-sm min-w-0">
										<div className="mb-3">
											<span className="text-xs font-medium text-gray-600 block whitespace-nowrap">
												{t.controls.fontColor}
											</span>
										</div>
										<div className="flex justify-center">
											<ColorPicker 
												value={individualFontColor ?? globalFontColor} 
												onChange={(color) => {
													console.log('Individual color onChange:', color);
													const hexColor = color.toHexString();
													console.log('Individual hex color:', hexColor);
													setIndividualFontColor(hexColor);
												}}
												onChangeComplete={(color) => {
													console.log('Individual color onChangeComplete:', color);
													const hexColor = color.toHexString();
													console.log('Individual hex color complete:', hexColor);
													setIndividualFontColor(hexColor);
												}}
												showText 
												size="small"
												presets={[
													{
														label: t.controls.commonColors,
														colors: ['#000000', '#333333', '#666666', '#999999', '#e74c3c', '#3498db', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c', '#34495e', '#7f8c8d'],
													},
												]}
												placement="bottomLeft"
												style={{ zIndex: 9999 }}
											/>
										</div>
									</div>

									{/* Italic style */}
									<div className="bg-white p-3 rounded-lg shadow-sm min-w-0">
										<div className="mb-3">
											<span className="text-xs font-medium text-gray-600 block whitespace-nowrap">{t.controls.fontStyle}</span>
										</div>
										<div className="flex justify-center">
											<Switch
												checked={individualIsItalic ?? globalIsItalic}
												onChange={(checked) => setIndividualIsItalic(checked)}
												checkedChildren={<ItalicOutlined />}
												unCheckedChildren={<span className="text-xs">{language === 'zh' ? '正常' : 'Normal'}</span>}
											/>
										</div>
									</div>
								</div>
							</div>
						)}
					</div>

					{/* Custom text input */}
					{selectedSample === 'custom' && !globalCustomText.trim() && (
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

					{/* Font preview area */}
					<div 
						style={{
							...getFontStyle(),
							minHeight: "100px",
							padding: "16px",
							background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
							borderRadius: "12px",
							border: "2px solid #e2e8f0",
							boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)",
							wordBreak: "break-word",
							overflowWrap: "break-word"
						}}
						className="font-preview-area transition-all duration-300 hover:shadow-md hover:border-blue-200 w-full"
					>
						{getCurrentSampleText()}
					</div>
				</div>
			</Card>
		</div>
	);
}