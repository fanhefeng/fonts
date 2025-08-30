"use client";

import { myFonts, DouYinSansBold } from "../../styles/fonts";
import MyFont from "@/components/ui/MyFont";
import FontConfig from "@/components/ui/FontConfig";
import { Typography, Spin, Button, Space } from "antd";
import { BulbOutlined, BulbFilled, GlobalOutlined } from "@ant-design/icons";
import { useFontLikes } from "@/hooks/useFontLikes";
import { useTheme } from "@/contexts/ThemeContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState, useCallback, useMemo } from "react";
import type { Color } from "@/types/global";
import "@ant-design/v5-patch-for-react-19";

const { Title } = Typography;

export default function Home() {
	// Use context hooks
	const { isLoaded, toggleLike, isLiked, getLikeCount } = useFontLikes();
	const { isDark, toggleTheme } = useTheme();
	const { language, setLanguage, t } = useLanguage();

	// Search and filter state
	const [searchValue, setSearchValue] = useState("");
	const [showOnlyLiked, setShowOnlyLiked] = useState(false);

	// Global style state
	const [globalFontSize, setGlobalFontSize] = useState<number>(24);
	const [globalIsItalic, setGlobalIsItalic] = useState<boolean>(false);
	const [globalFontColor, setGlobalFontColor] = useState<Color>("#3498db");
	const [globalFontWeight, setGlobalFontWeight] = useState<number>(400);
	const [globalCustomText, setGlobalCustomText] = useState<string>("");

	// Process fonts with like status
	const processedFonts = useMemo(() => {
		return myFonts.map((font) => {
			// 提取字体名称作为稳定的标识符
			const fontName = font.style.fontFamily.split(",")[0].slice(1, -1);
			return {
				...font,
				isLiked: isLiked(fontName),
			};
		});
	}, [isLiked]);

	// Filter fonts
	const filteredFonts = useMemo(() => {
		let result = processedFonts;

		// Search filter
		if (searchValue) {
			const searchLower = searchValue.toLowerCase();
			result = result.filter((font) => {
				const fontFamily = font.style.fontFamily.split(",")[0].slice(1, -1).toLowerCase();
				return fontFamily.includes(searchLower);
			});
		}

		// Favorites filter
		if (showOnlyLiked) {
			result = result.filter((font) => font.isLiked);
		}
		return result;
	}, [processedFonts, searchValue, showOnlyLiked]);

	// Toggle favorites display
	const toggleShowLiked = useCallback(() => {
		setShowOnlyLiked(!showOnlyLiked);
	}, [showOnlyLiked]);

	// Toggle language
	const toggleLanguage = () => {
		setLanguage(language === "zh" ? "en" : "zh");
	};

	// Loading state
	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: isDark ? "#141414" : "#f5f5f5" }}>
				<div className="text-center">
					<Spin size="large" />
					<p className="mt-4" style={{ color: isDark ? "#8c8c8c" : "rgba(0, 0, 0, 0.65)" }}>
						{t.loading}
					</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen transition-colors duration-300" style={{ backgroundColor: isDark ? "#141414" : "#f5f5f5" }}>
			{/* Header */}
			<div
				className="border-b sticky top-0 z-10 shadow-sm backdrop-blur-sm"
				style={{
					borderColor: isDark ? "#434343" : "#d9d9d9",
					backgroundColor: isDark ? "#1f1f1f" : "#ffffff",
				}}
			>
				<div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 max-w-7xl">
					<div className="flex items-center justify-between">
						{/* Left side - Title */}
						<div className="flex-1">
							<Title
								level={1}
								className={`!mb-0 font-light bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent ${DouYinSansBold.className}`}
							>
								{t.header.title}
							</Title>
						</div>

						{/* Right side - Theme and Language controls */}
						<div className="absolute right-4 sm:right-6 top-4 sm:top-6">
							<Space size="small">
								<Button
									type="text"
									icon={isDark ? <BulbFilled /> : <BulbOutlined />}
									onClick={toggleTheme}
									title={isDark ? t.theme.light : t.theme.dark}
									size="large"
								/>
								<Button
									type="text"
									icon={<GlobalOutlined />}
									onClick={toggleLanguage}
									title={language === "zh" ? "English" : "中文"}
									size="large"
									style={{ minWidth: "48px" }}
								>
									<span style={{ display: "inline-block", minWidth: "20px", textAlign: "center" }}>{language === "zh" ? "EN" : "中"}</span>
								</Button>
							</Space>
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-7xl">
				{/* Global Controls */}
				<div className="mb-6 sm:mb-8">
					<FontConfig
						searchValue={searchValue}
						setSearchValue={setSearchValue}
						showOnlyLiked={showOnlyLiked}
						toggleShowLiked={toggleShowLiked}
						globalFontSize={globalFontSize}
						setGlobalFontSize={setGlobalFontSize}
						globalFontColor={globalFontColor}
						setGlobalFontColor={setGlobalFontColor}
						globalFontWeight={globalFontWeight}
						setGlobalFontWeight={setGlobalFontWeight}
						globalIsItalic={globalIsItalic}
						setGlobalIsItalic={setGlobalIsItalic}
						globalCustomText={globalCustomText}
						setGlobalCustomText={setGlobalCustomText}
					/>
				</div>

				{/* Stats Bar */}
				{filteredFonts.length > 0 && (
					<div
						className="mb-4 sm:mb-6 flex items-center justify-between text-sm rounded-lg px-3 sm:px-4 py-2 border"
						style={{
							color: isDark ? "#8c8c8c" : "rgba(0, 0, 0, 0.65)",
							backgroundColor: isDark ? "#1f1f1f" : "#ffffff",
							borderColor: isDark ? "#434343" : "#d9d9d9",
						}}
					>
						<span>
							{t.stats.showing}{filteredFonts.length}
							{language === "en" && (filteredFonts.length > 1 ? " fonts" : " font")}
							{language === "zh" && "个字体"}
						</span>
						<span>
							{getLikeCount()}
							{language === "zh" && "个"}
							{t.stats.favorited}
						</span>
					</div>
				)}

				{/* Font Display Area */}
				<div className="grid gap-4 sm:gap-6 w-full max-w-none">
					{filteredFonts.length > 0 ? (
						filteredFonts.map((font) => (
							<MyFont
								key={font.className}
								font={font}
								onToggleLike={toggleLike}
								globalFontSize={globalFontSize}
								globalFontWeight={globalFontWeight}
								globalFontColor={globalFontColor}
								globalIsItalic={globalIsItalic}
								globalCustomText={globalCustomText}
							/>
						))
					) : (
						<div className="text-center py-16 sm:py-20">
							<div className="text-5xl sm:text-6xl mb-4 sm:mb-6" style={{ color: isDark ? "#8c8c8c" : "rgba(0, 0, 0, 0.45)" }}>
								🔍
							</div>
							<h3 className="text-lg sm:text-xl font-medium mb-2 sm:mb-3" style={{ color: isDark ? "#8c8c8c" : "rgba(0, 0, 0, 0.65)" }}>
								{showOnlyLiked ? t.empty.noFavorites : t.empty.noResults}
							</h3>
							<p className="max-w-md mx-auto px-4" style={{ color: isDark ? "#8c8c8c" : "rgba(0, 0, 0, 0.45)" }}>
								{showOnlyLiked ? t.empty.noFavoritesDesc : t.empty.noResultsDesc}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
