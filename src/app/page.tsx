"use client";

// 引入字体数据
import { myFonts } from "@/fonts";
// 引入MyFont组件
import MyFont from "@/components/ui/MyFont";
import { type GetProp, type ColorPickerProps, Space, Input, Button, Typography, Slider, Switch, ColorPicker, Row, Col, Card } from "antd";
import { useEffect, useState, useCallback } from "react";
import { type NextFontWithVariableWithLiked } from "@/types/global";
import "@ant-design/v5-patch-for-react-19";
import { ItalicOutlined, HeartFilled, HeartOutlined } from "@ant-design/icons";

const { Title } = Typography;
type Color = GetProp<ColorPickerProps, "value">;
export default function Home() {
  // 初始数据快照
	const [fonts, setFonts] = useState<NextFontWithVariableWithLiked[]>([]);
  // 展示数据
	const [filteredFonts, setFilteredFonts] = useState<NextFontWithVariableWithLiked[]>([]);

	// 搜索和筛选状态
	const [searchValue, setSearchValue] = useState("");
	const [showOnlyLiked, setShowOnlyLiked] = useState(false);

	// 全局字体样式配置
	const [globalSettings, setGlobalSettings] = useState<{
		fontSize: number;
		isItalic: boolean;
		fontColor: Color;
		fontWeight: number;
	}>({
		fontSize: 24,
		isItalic: false,
		fontColor: "#000000",
		fontWeight: 400,
	});

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

	// 处理搜索输入变化
	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		console.log("handleSearchChange");
		setSearchValue(e.target.value);
	};

	// 清空搜索
	const handleClearSearch = () => {
		console.log("handleClearSearch");
		setSearchValue("");
	};

	// 切换收藏显示
	const toggleShowLiked = () => {
		setShowOnlyLiked(!showOnlyLiked);
	};
	{
		/* 搜索和筛选 */
	}
	const globalExtra = (
		<Space className="">
			<Input
				placeholder="搜索字体..."
				allowClear
				value={searchValue}
				onChange={handleSearchChange}
				onClear={handleClearSearch}
				className="max-w-md flex-grow"
			/>

			<Button type={showOnlyLiked ? "primary" : "default"} onClick={toggleShowLiked} icon={showOnlyLiked ? <HeartFilled /> : <HeartOutlined />}>
				{showOnlyLiked ? "显示所有字体" : "显示收藏"}
			</Button>
		</Space>
	);

	return (
		<div className="container mx-auto p-4">
			<Title level={2} className="mb-6">
				字体库
			</Title>

			{/* 全局预览设置 */}
			<Card title="全局预览设置" extra={globalExtra}>
				<Row gutter={[16, 16]}>
					<Col xs={24} sm={12} md={6} className="!flex flex-col justify-center">
						<div className="flex justify-between mb-2">
							<span>Font Size:{globalSettings.fontSize}px</span>
						</div>
						<Slider
							min={12}
							max={72}
							value={globalSettings.fontSize}
							onChange={(val) => setGlobalSettings(prev => ({ ...prev, fontSize: val }))}
						/>
					</Col>

					<Col xs={24} sm={12} md={6} className="!flex flex-col justify-center">
						<div className="flex justify-between items-center mb-2">
							<span>Font Weight:{globalSettings.fontWeight}</span>
						</div>
						<Slider
							min={100}
							max={900}
							step={100}
							value={globalSettings.fontWeight}
							onChange={(val) => setGlobalSettings(prev => ({ ...prev, fontWeight: val }))}
						/>
					</Col>

					<Col xs={24} sm={12} md={6} className="!flex flex-col justify-center">
						<div className="flex justify-between mb-2">
							<Switch
								checked={globalSettings.isItalic}
								onChange={(val) => setGlobalSettings(prev => ({ ...prev, isItalic: val }))}
								checkedChildren={<ItalicOutlined />}
								unCheckedChildren="正常"
							/>
						</div>
					</Col>

					<Col xs={24} sm={12} md={6} className="!flex flex-col justify-center">
						<div className="flex justify-between mb-2">
							<ColorPicker
								value={globalSettings.fontColor}
								onChange={(val) => setGlobalSettings(prev => ({ ...prev, fontColor: val.toCssString() }))}
								showText
								size="small"
							/>
						</div>
					</Col>
				</Row>
			</Card>

			{/* 字体卡片网格 */}
			<Space direction="vertical" className="w-full">
				{filteredFonts.length > 0 ? (
					filteredFonts.map((font) => <MyFont key={font.className} font={font} onToggleLike={toggleLike} previewSettings={globalSettings} />)
				) : (
					<div className="text-center py-12 text-gray-500">{showOnlyLiked ? "您还没有收藏任何字体" : "没有找到匹配的字体"}</div>
				)}
			</Space>
		</div>
	);
}
