"use client";

import { useState } from "react";
import { Card, Button, Select, Slider, Switch, Space } from "antd";
import { HeartFilled, HeartOutlined, SettingOutlined, ItalicOutlined } from "@ant-design/icons";
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

// 预设文本样本
const TEXT_SAMPLES = [
	{
		key: 'pangram',
		label: '测试句',
		content: 'The quick brown fox jumps over the lazy dog.\n敏捷的棕色狐狸跳过懒惰的狗。'
	},
	{
		key: 'alphabet',
		label: '字母表',
		content: 'abcdefghijklmnopqrstuvwxyz\nABCDEFGHIJKLMNOPQRSTUVWXYZ\n0123456789'
	},
	{
		key: 'chinese',
		label: '中文',
		content: '中华人民共和国\n北京上海广州深圳\n汉字书法艺术文化'
	}
];

export default function MyFont({ font, onToggleLike, globalFontSize, globalFontWeight, globalFontColor, globalIsItalic, globalCustomText }: MyFontProps) {
	// 获取字体名称
	const fontFamilyName = font.style.fontFamily.split(",")[0].slice(1, -1);
	
	// 状态管理
	const [selectedSample, setSelectedSample] = useState('pangram');
	const [customText, setCustomText] = useState('');
	const [showIndividualConfig, setShowIndividualConfig] = useState(false);
	
	// 个别字体设置状态
	const [individualFontSize, setIndividualFontSize] = useState<number | null>(null);
	const [individualFontWeight, setIndividualFontWeight] = useState<number | null>(null);
	const [individualIsItalic, setIndividualIsItalic] = useState<boolean | null>(null);

	const getCurrentSampleText = () => {
		// 如果有全局自定义文本，优先使用全局文本
		if (globalCustomText.trim()) {
			return globalCustomText;
		}
		
		if (selectedSample === 'custom') {
			return customText || '输入您想要预览的文本...';
		}
		const sample = TEXT_SAMPLES.find(s => s.key === selectedSample);
		return sample?.content || TEXT_SAMPLES[0].content;
	};

	// 字体样式对象
	const getFontStyle = () => ({
		fontFamily: font.style.fontFamily,
		color: globalFontColor.toString(),
		fontSize: `${individualFontSize ?? globalFontSize}px`,
		fontWeight: individualFontWeight ?? globalFontWeight,
		fontStyle: (individualIsItalic ?? globalIsItalic) ? "italic" : "normal",
		lineHeight: 1.6,
		wordWrap: "break-word" as const,
		whiteSpace: "pre-wrap" as const
	});

	// 重置个别设置
	const resetIndividualSettings = () => {
		setIndividualFontSize(null);
		setIndividualFontWeight(null);
		setIndividualIsItalic(null);
	};

	// 检查是否有个别设置
	const hasIndividualSettings = individualFontSize !== null || individualFontWeight !== null || individualIsItalic !== null;

	const cardExtra = (
		<Space>
			<Button
				type="text"
				icon={<SettingOutlined />}
				onClick={() => setShowIndividualConfig(!showIndividualConfig)}
				aria-label="个别设置"
				size="large"
				style={{ color: hasIndividualSettings ? "#1890ff" : undefined }}
			/>
			<Button
				type="text"
				icon={font.isLiked ? <HeartFilled style={{ color: "#ff4d4f" }} /> : <HeartOutlined />}
				onClick={() => onToggleLike(font.className)}
				aria-label={font.isLiked ? "取消收藏" : "收藏"}
				size="large"
			/>
		</Space>
	);

	return (
		<div className={`${font.className} ${font.variable}`}>
			<Card 
				hoverable 
				extra={cardExtra}
				className="border-0 shadow-sm hover:shadow-md transition-all duration-200"
				styles={{ body: { padding: '24px' } }}
			>
				<div className="space-y-4">
					{/* 字体名称和控制按钮 */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-2">
							<h3 className="text-lg font-medium text-gray-700 mb-0">
								{fontFamilyName}
							</h3>
							{hasIndividualSettings && (
								<span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
									个别设置
								</span>
							)}
						</div>
						<div className="flex items-center space-x-3">
							{!globalCustomText.trim() && (
								<>
									<span className="text-sm text-gray-500">文本样式:</span>
									<Select
										value={selectedSample}
										onChange={setSelectedSample}
										options={[
											...TEXT_SAMPLES.map(sample => ({
												label: sample.label,
												value: sample.key
											})),
											{ label: '自定义', value: 'custom' }
										]}
										size="small"
										style={{ minWidth: 100 }}
									/>
								</>
							)}
							{globalCustomText.trim() && (
								<span className="text-sm text-blue-600 bg-blue-50 px-2 py-1 rounded">使用全局文本</span>
							)}
						</div>
					</div>

					{/* 个别字体设置面板 */}
					{showIndividualConfig && (
						<div className="bg-gray-50 p-4 rounded-lg border">
							<div className="flex items-center justify-between mb-3">
								<h4 className="text-sm font-medium text-gray-700 mb-0">个别字体设置</h4>
								{hasIndividualSettings && (
									<Button 
										size="small" 
										type="link" 
										onClick={resetIndividualSettings}
										style={{ padding: 0 }}
									>
										重置
									</Button>
								)}
							</div>
							
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
								{/* 字体大小 */}
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="text-xs font-medium text-gray-600">字体大小</span>
										<span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
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

								{/* 字体粗细 */}
								<div className="space-y-2">
									<div className="flex justify-between items-center">
										<span className="text-xs font-medium text-gray-600">字体粗细</span>
										<span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
											{individualFontWeight ?? globalFontWeight}
										</span>
									</div>
									<Slider 
										min={100} 
										max={900} 
										step={100} 
										value={individualFontWeight ?? globalFontWeight} 
										onChange={(value) => setIndividualFontWeight(value)}
									/>
								</div>

								{/* 斜体样式 */}
								<div className="space-y-2">
									<span className="text-xs font-medium text-gray-600 block">字体样式</span>
									<Switch
										checked={individualIsItalic ?? globalIsItalic}
										onChange={(checked) => setIndividualIsItalic(checked)}
										checkedChildren={<ItalicOutlined />}
										unCheckedChildren="正常"
									/>
								</div>
							</div>
						</div>
					)}

					{/* 自定义文本输入 */}
					{selectedSample === 'custom' && !globalCustomText.trim() && (
						<div>
							<textarea
								value={customText}
								onChange={(e) => setCustomText(e.target.value)}
								placeholder="输入您想要预览的文本..."
								className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-colors"
								rows={2}
							/>
						</div>
					)}

					{/* 字体预览区 */}
					<div 
						style={{
							...getFontStyle(),
							minHeight: "120px",
							padding: "24px",
							background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
							borderRadius: "12px",
							border: "2px solid #e2e8f0",
							boxShadow: "inset 0 2px 4px rgba(0,0,0,0.04)"
						}}
						className="transition-all duration-300 hover:shadow-md hover:border-blue-200"
					>
						{getCurrentSampleText()}
					</div>
				</div>
			</Card>
		</div>
	);
}