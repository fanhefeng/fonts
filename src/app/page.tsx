"use client";

// 引入字体数据
import { myFonts } from "@/fonts";
// 引入MyFont组件
import MyFont from "@/components/ui/MyFont";
import FontConfig from "@/components/ui/FontConfig";
import { Space, Typography, Divider } from "antd";
import { useEffect, useState, useCallback, useMemo } from "react";
import type { Color, NextFontWithVariableWithLiked } from "@/types/global";
import "@ant-design/v5-patch-for-react-19";

const { Title } = Typography;

export default function Home() {
	// 初始数据快照
	const [fonts, setFonts] = useState<NextFontWithVariableWithLiked[]>([]);
	// 展示数据
	const [filteredFonts, setFilteredFonts] = useState<NextFontWithVariableWithLiked[]>([]);

	// 搜索和筛选状态
	const [searchValue, setSearchValue] = useState("");
	const [showOnlyLiked, setShowOnlyLiked] = useState(false);

	// 全局字体样式配置
	const [globalFontSize, setGlobalFontSize] = useState<number>(24);
	const [globalIsItalic, setGlobalIsItalic] = useState<boolean>(false);
	const [globalFontColor, setGlobalFontColor] = useState<Color>("#000000");
	const [globalFontWeight, setGlobalFontWeight] = useState<number>(400);

	// 初始化字体数据
	useEffect(() => {
		const storedData = localStorage.getItem("fonts");
		if (storedData) {
			const parsedData: NextFontWithVariableWithLiked[] = JSON.parse(storedData);
			setFonts(parsedData);
		} else {
			// 初始化为默认状态（全部未收藏）
			const initialFonts = myFonts.map((font) => ({
				...font,
				isLiked: false,
			}));
			localStorage.setItem("fonts", JSON.stringify(initialFonts));
			setFonts(initialFonts);
		}
	}, []);

	// 当字体数据或筛选条件变化时，更新显示列表
	useEffect(() => {
		let result = fonts;

		// 应用搜索过滤
		if (searchValue) {
			const searchLower = searchValue.toLowerCase();
			result = result.filter((font) => font.style.fontFamily.split(",")[0].slice(1, -1).toLowerCase().includes(searchLower));
		}

		// 应用收藏过滤
		if (showOnlyLiked) {
			result = result.filter((font) => font.isLiked);
		}

		setFilteredFonts(result);
	}, [fonts, searchValue, showOnlyLiked]);

	// 切换收藏状态
	const toggleLike = useCallback((className: string) => {
		setFonts((prevFonts) => {
			const updatedFonts = prevFonts.map((font) => (font.className === className ? { ...font, isLiked: !font.isLiked } : font));

			// 保存收藏状态
			localStorage.setItem("fonts", JSON.stringify(updatedFonts));
			return updatedFonts;
		});
	}, []);

	// 切换收藏显示
	const toggleShowLiked = () => {
		setShowOnlyLiked(!showOnlyLiked);
	};

	return (
		<div className="container mx-auto p-4">
			<Title level={2} className="mb-6">
				字体库
			</Title>
			{/* 全局预览设置 */}
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
			/>
			<Divider />
			{/* 字体卡片网格 */}
			<Space direction="vertical" className="w-full">
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
						/>
					))
				) : (
					<div className="text-center py-12 text-gray-500">{showOnlyLiked ? "您还没有收藏任何字体" : "没有找到匹配的字体"}</div>
				)}
			</Space>
		</div>
	);
}
