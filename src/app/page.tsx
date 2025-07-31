"use client";

import { myFonts } from "../../styles/fonts";
import MyFont from "@/components/ui/MyFont";
import FontConfig from "@/components/ui/FontConfig";
import { Typography, Spin } from "antd";
import { useFontLikes } from "@/hooks/useFontLikes";
import { useState, useCallback, useMemo } from "react";
import type { Color } from "@/types/global";
import "@ant-design/v5-patch-for-react-19";

const { Title } = Typography;

export default function Home() {
	// 使用新的收藏管理 hook
	const { isLoaded, toggleLike, isLiked, getLikeCount } = useFontLikes();
	
	// 搜索和筛选状态
	const [searchValue, setSearchValue] = useState("");
	const [showOnlyLiked, setShowOnlyLiked] = useState(false);
	
	// 全局样式状态
	const [globalFontSize, setGlobalFontSize] = useState<number>(24);
	const [globalIsItalic, setGlobalIsItalic] = useState<boolean>(false);
	const [globalFontColor, setGlobalFontColor] = useState<Color>("#000000");
	const [globalFontWeight, setGlobalFontWeight] = useState<number>(400);
	const [globalCustomText, setGlobalCustomText] = useState<string>("");

	// 使用 useMemo 优化字体列表处理
	const processedFonts = useMemo(() => {
		return myFonts.map(font => ({
			...font,
			isLiked: isLiked(font.className)
		}));
	}, [isLiked]);

	// 筛选字体
	const filteredFonts = useMemo(() => {
		let result = processedFonts;

		// 搜索过滤
		if (searchValue) {
			const searchLower = searchValue.toLowerCase();
			result = result.filter((font) => {
				const fontFamily = font.style.fontFamily.split(",")[0].slice(1, -1).toLowerCase();
				return fontFamily.includes(searchLower);
			});
		}

		// 收藏过滤
		if (showOnlyLiked) {
			result = result.filter((font) => font.isLiked);
		}

		return result;
	}, [processedFonts, searchValue, showOnlyLiked]);

	// 切换收藏显示
	const toggleShowLiked = useCallback(() => {
		setShowOnlyLiked(!showOnlyLiked);
	}, [showOnlyLiked]);

	// 如果数据还在加载中，显示加载状态
	if (!isLoaded) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
				<div className="text-center">
					<Spin size="large" />
					<p className="mt-4 text-gray-600">正在加载字体数据...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
			{/* Header */}
			<div className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
				<div className="container mx-auto px-6 py-6 max-w-7xl">
					<div className="text-center">
						<Title level={1} className="!mb-2 font-light bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
							Fonts
						</Title>
						<p className="text-gray-500 text-sm max-w-md mx-auto">
							仅供参考，谢绝商用！
						</p>
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
						<span>显示 {filteredFonts.length} 个字体</span>
						<span>已收藏 {getLikeCount()} 个</span>
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
							<h3 className="text-xl font-medium text-gray-600 mb-3">
								{showOnlyLiked ? "还没有收藏的字体" : "没有找到匹配的字体"}
							</h3>
							<p className="text-gray-400 max-w-md mx-auto">
								{showOnlyLiked 
									? "点击字体卡片上的心形图标来收藏您喜欢的字体" 
									: "尝试调整搜索条件或浏览所有可用字体"
								}
							</p>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}