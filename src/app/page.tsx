"use client";

import { myFonts } from "../../styles/fonts";
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
	const [globalFontColor, setGlobalFontColor] = useState<Color>("#000000");
	const [globalFontWeight, setGlobalFontWeight] = useState<number>(400);
	const [globalCustomText, setGlobalCustomText] = useState<string>("");

	// Process fonts with like status
	const processedFonts = useMemo(() => {
		return myFonts.map((font) => ({
			...font,
			isLiked: isLiked(font.className),
		}));
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
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
				<div className="text-center">
					<Spin size="large" />
					<p className="mt-4 text-gray-600">{t.loading}</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 transition-colors duration-300">
			{/* Header */}
			<div className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
				<div className="container mx-auto px-6 py-6 max-w-7xl">
					<div className="flex items-center justify-between">
						{/* Left side - Title */}
						<div className="text-center flex-1">
							<Title level={1} className="!mb-2 font-light bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
								{t.header.title}
							</Title>
							<p className="text-gray-500 text-sm max-w-md mx-auto">{t.header.subtitle}</p>
						</div>

						{/* Right side - Theme and Language controls */}
						<div className="absolute right-6 top-6">
							<Space>
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
			<div className="container mx-auto px-6 py-8 max-w-7xl">
				{/* Global Controls */}
				<div className="mb-8">
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
					<div className="mb-6 flex items-center justify-between text-sm text-gray-600 bg-white/60 backdrop-blur-sm rounded-lg px-4 py-2 border border-gray-100">
						<span>
							{t.stats.showing} {filteredFonts.length} {t.stats.fonts}
						</span>
						<span>
							{t.stats.favorited} {getLikeCount()} {language === "zh" ? "个" : ""}
						</span>
					</div>
				)}

				{/* Font Display Area */}
				<div className="grid gap-6">
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
						<div className="text-center py-20">
							<div className="text-gray-300 text-6xl mb-6">🔍</div>
							<h3 className="text-xl font-medium text-gray-600 mb-3">{showOnlyLiked ? t.empty.noFavorites : t.empty.noResults}</h3>
							<p className="text-gray-400 max-w-md mx-auto">{showOnlyLiked ? t.empty.noFavoritesDesc : t.empty.noResultsDesc}</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
