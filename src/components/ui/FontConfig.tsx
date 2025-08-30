import { ColorPicker, Row, Col, Slider, Switch, Card, Input, Button, Divider } from "antd";
import { HeartFilled, HeartOutlined, ItalicOutlined, ReloadOutlined } from "@ant-design/icons";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { Color } from "@/types/global";
import styles from './FontConfig.module.css';

type FontConfigProps = {
  searchValue: string;
  setSearchValue: React.Dispatch<React.SetStateAction<string>>;
  showOnlyLiked: boolean;
  toggleShowLiked: () => void;
  globalFontSize: number;
  setGlobalFontSize: React.Dispatch<React.SetStateAction<number>>;
  globalIsItalic: boolean;
  setGlobalIsItalic: React.Dispatch<React.SetStateAction<boolean>>;
  globalFontColor: Color;
  setGlobalFontColor: React.Dispatch<React.SetStateAction<Color>>;
  globalFontWeight: number;
  setGlobalFontWeight: React.Dispatch<React.SetStateAction<number>>;
  globalCustomText: string;
  setGlobalCustomText: React.Dispatch<React.SetStateAction<string>>;
};

const PRESET_COLORS = [
  '#3498db', '#000000', '#333333', '#666666', '#999999',
  '#e74c3c', '#2ecc71', '#f39c12',
  '#9b59b6', '#1abc9c', '#34495e', '#7f8c8d'
];

export default function FontConfig({
  searchValue,
  setSearchValue,
  showOnlyLiked,
  toggleShowLiked,
  globalFontSize,
  setGlobalFontSize,
  globalIsItalic,
  setGlobalIsItalic,
  globalFontColor,
  setGlobalFontColor,
  globalFontWeight,
  setGlobalFontWeight,
  globalCustomText,
  setGlobalCustomText,
}: FontConfigProps) {
	const { t, language } = useLanguage();
	const { isDark } = useTheme();

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const handleClearSearch = () => {
		setSearchValue("");
	};

	const resetSettings = () => {
		setGlobalFontSize(24);
		setGlobalFontWeight(400);
		setGlobalFontColor('#3498db');
		setGlobalIsItalic(false);
		setGlobalCustomText('');
	};

	return (
		<Card 
			className="border-0 shadow-md backdrop-blur-sm w-full" 
			style={{
				backgroundColor: isDark ? 'rgba(31, 31, 31, 0.9)' : 'rgba(255, 255, 255, 0.9)',
				borderColor: isDark ? '#434343' : '#d9d9d9'
			}}
		>
			<div className="space-y-4 sm:space-y-6 w-full">
				{/* Search and filter */}
				<Row gutter={[16, 16]} align="middle">
					<Col xs={24} sm={16} lg={14} xl={12}>
						<Input
							placeholder={t.search.placeholder}
							allowClear
							value={searchValue}
							onChange={handleSearchChange}
							onClear={handleClearSearch}
							size="large"
							className="font-search-input"
						/>
					</Col>
					
					<Col xs={12} sm={8} lg={5} xl={6}>
						<Button 
							type={showOnlyLiked ? "primary" : "default"} 
							onClick={toggleShowLiked} 
							icon={showOnlyLiked ? <HeartFilled /> : <HeartOutlined />}
							size="large"
							block
							className={`font-control-button ${showOnlyLiked ? 'active' : ''}`}
						>
							<span className="hidden sm:inline">
								{showOnlyLiked ? t.search.showAll : t.search.favorites}
							</span>
							<span className="sm:hidden">
								{showOnlyLiked ? "全部" : "收藏"}
							</span>
						</Button>
					</Col>

					<Col xs={12} sm={8} lg={5} xl={6}>
						<Button 
							onClick={resetSettings}
							icon={<ReloadOutlined />}
							size="large"
							block
							className="font-control-button"
						>
							<span className="hidden sm:inline">{t.search.reset}</span>
							<span className="sm:hidden">重置</span>
						</Button>
					</Col>
				</Row>

				<Divider className="!my-3 sm:!my-4" />

				{/* Global text input */}
				<div className="font-global-text-section">
					<h4 
						className="mb-3 sm:mb-4 font-medium flex items-center text-sm sm:text-base" 
						style={{ color: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.88)" }}
					>
						{t.controls.globalText}
					</h4>
					<Input.TextArea
						value={globalCustomText}
						onChange={(e) => setGlobalCustomText(e.target.value)}
						placeholder={t.controls.globalTextPlaceholder}
						rows={3}
						className="font-global-textarea"
					/>
				</div>

				<Divider className="!my-3 sm:!my-4" />

				{/* Style controls - Improved responsive layout */}
				<div className={`font-global-controls-section ${styles.fontConfigPanel}`}>
					<h4 
						className="mb-3 sm:mb-4 font-medium flex items-center text-sm sm:text-base" 
						style={{ color: isDark ? "#ffffff" : "rgba(0, 0, 0, 0.88)" }}
					>
						{t.controls.globalSettings}
					</h4>
					
					{/* Mobile: Single column, Tablet: 2 columns, Desktop: 4 columns */}
					<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 sm:gap-4">
						{/* Font size */}
						<div className={styles.controlItem}>
							<div className="flex justify-between items-center mb-2">
								<span 
									className="font-medium text-xs sm:text-sm whitespace-nowrap" 
									style={{ color: isDark ? "#d9d9d9" : "rgba(0, 0, 0, 0.65)" }}
								>
									{t.controls.fontSize}
								</span>
								<span className="text-xs text-white bg-gradient-to-r from-blue-400 to-blue-600 px-2 py-1 rounded-full font-medium">
									{globalFontSize}px
								</span>
							</div>
							<div className={`${styles.sliderContainer} ${styles.globalFontSizeSlider}`}>
								<Slider 
									min={14} 
									max={64} 
									value={globalFontSize} 
									onChange={setGlobalFontSize}
								/>
							</div>
						</div>

						{/* Font weight */}
						<div className={styles.controlItem}>
							<div className="flex justify-between items-center mb-2">
								<span 
									className="font-medium text-xs sm:text-sm whitespace-nowrap" 
									style={{ color: isDark ? "#d9d9d9" : "rgba(0, 0, 0, 0.65)" }}
								>
									{t.controls.fontWeight}
								</span>
								<span className="text-xs text-white bg-gradient-to-r from-purple-400 to-purple-600 px-2 py-1 rounded-full font-medium">
									{globalFontWeight}
								</span>
							</div>
							<div className={`${styles.sliderContainer} ${styles.globalWeightSlider}`}>
								<Slider 
									min={100} 
									max={900} 
									step={100} 
									value={globalFontWeight} 
									onChange={setGlobalFontWeight}
									marks={language === 'zh' ? {
										100: '极细',
										200: '特细',
										300: '细体',
										400: '常规',
										500: '中等',
										600: '半粗',
										700: '粗体',
										800: '特粗',
										900: '超粗'
									} : {
										100: 'Thin',
										200: 'XLight',     // 缩短 Extra Light
										300: 'Light',
										400: 'Reg',        // 缩短 Regular
										500: 'Med',        // 缩短 Medium
										600: 'SBold',      // 缩短 Semi Bold
										700: 'Bold',
										800: 'XBold',      // 缩短 Extra Bold
										900: 'Black'
									}}
									tooltip={{
										formatter: (value) => {
											const weightNames = language === 'zh' ? {
												100: '极细', 200: '特细', 300: '细体', 400: '常规',
												500: '中等', 600: '半粗', 700: '粗体', 800: '特粗', 900: '超粗'
											} : {
												100: 'Thin', 200: 'Extra Light', 300: 'Light', 400: 'Regular',
												500: 'Medium', 600: 'Semi Bold', 700: 'Bold', 800: 'Extra Bold', 900: 'Black'
											};
											return weightNames[value as keyof typeof weightNames] || value?.toString();
										}
									}}
								/>
							</div>
						</div>

						{/* Font color */}
						<div className={styles.controlItem}>
							<div className="mb-3">
								<span 
									className="font-medium text-xs sm:text-sm block whitespace-nowrap" 
									style={{ color: isDark ? "#d9d9d9" : "rgba(0, 0, 0, 0.65)" }}
								>
									{t.controls.fontColor}
								</span>
							</div>
							<div className={styles.centerContainer}>
								<ColorPicker 
									value={globalFontColor} 
									onChange={(color) => {
										const hexColor = color.toHexString();
										setGlobalFontColor(hexColor);
									}}
									onChangeComplete={(color) => {
										const hexColor = color.toHexString();
										setGlobalFontColor(hexColor);
									}}
									showText 
									size="small"
									presets={[
										{
											label: t.controls.commonColors,
											colors: PRESET_COLORS,
										},
									]}
									placement="bottomLeft"
									style={{ zIndex: 9999 }}
								/>
							</div>
						</div>

						{/* Font style */}
						<div className={styles.controlItem}>
							<div className="mb-3">
								<span 
									className="font-medium text-xs sm:text-sm block whitespace-nowrap" 
									style={{ color: isDark ? "#d9d9d9" : "rgba(0, 0, 0, 0.65)" }}
								>
									{t.controls.fontStyle}
								</span>
							</div>
							<div className={styles.centerContainer}>
								<Switch
									checked={globalIsItalic}
									onChange={setGlobalIsItalic}
									checkedChildren={<ItalicOutlined />}
									unCheckedChildren={<span className="text-xs">{language === 'zh' ? '正常' : 'Normal'}</span>}
									size="default"
								/>
							</div>
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}