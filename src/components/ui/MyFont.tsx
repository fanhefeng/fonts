"use client";

import { useState, useEffect } from "react";
import { Card, Button, Slider, Switch, ColorPicker, Space, Row, Col } from "antd";
import { HeartFilled, HeartOutlined, ItalicOutlined } from "@ant-design/icons";
import { AggregationColor } from "antd/es/color-picker/color";
import type { Color, NextFontWithVariableWithLiked } from "@/types/global";

type MyFontProps = {
	font: NextFontWithVariableWithLiked;
	onToggleLike: (className: string) => void;
	globalFontSize: number;
	globalFontWeight: number;
	globalFontColor: Color;
	globalIsItalic: boolean;
};

export default function MyFont({ font, onToggleLike, globalFontSize, globalFontWeight, globalFontColor, globalIsItalic }: MyFontProps) {
	const fontFamilyName = font.style.fontFamily.split(",")[0].slice(1, -1);
	const [fontSize, setFontSize] = useState(globalFontSize);
	const [fontWeight, setFontWeight] = useState(globalFontWeight);
	const [fontColor, setFontColor] = useState(globalFontColor);
	const [isItalic, setIsItalic] = useState(globalIsItalic);

	useEffect(() => {
		setFontSize(globalFontSize);
	}, [globalFontSize]);
	useEffect(() => {
		setFontWeight(globalFontWeight);
	}, [globalFontWeight]);
	useEffect(() => {
		setFontColor(globalFontColor);
	}, [globalFontColor]);
	useEffect(() => {
		setIsItalic(globalIsItalic);
	}, [globalIsItalic]);

	const handleColorChange = (val: AggregationColor) => {
		const css = val.toCssString();
		setFontColor(css);
	};

	const cardExtra = (
		<Button
			type="text"
			icon={font.isLiked ? <HeartFilled style={{ color: "#d63838" }} /> : <HeartOutlined />}
			onClick={() => onToggleLike(font.className)}
			aria-label={font.isLiked ? "取消收藏" : "收藏"}
		/>
	);

	const fontSizeArea = (
		<>
			<div className="flex mb-2">
				<span>Font Size:{fontSize}px</span>
			</div>
			<Slider min={12} max={72} value={fontSize} onChange={(val) => setFontSize(val)} />
		</>
	);
	const fontWeightArea = (
		<>
			<div className="flex mb-2">
				<span>Font Weight:{fontWeight}</span>
			</div>
			<Slider min={100} max={900} step={100} value={fontWeight} onChange={(val) => setFontWeight(val)} />
		</>
	);
	const fontStyleArea = (
		<div className="flex">
			<Switch checked={isItalic} onChange={(val) => setIsItalic(val)} checkedChildren={<ItalicOutlined />} unCheckedChildren="正常" />
		</div>
	);
	const fontColorArea = (
		<div className="flex">
			<ColorPicker value={fontColor} onChangeComplete={handleColorChange} showText size="small" />
		</div>
	);

	return (
		<div className={font.className}>
			<Card title={fontFamilyName} style={{ fontFamily: "inherit" }} hoverable extra={cardExtra}>
				<Space direction="vertical" size={30} className="w-full">
					{/* 字体配置区 */}
					<Row gutter={[16, 16]}>
						{[fontSizeArea, fontWeightArea, fontStyleArea, fontColorArea].map((item, index) => (
							<Col key={index} xs={24} sm={12} md={6} className="!flex flex-col justify-center">
								{item}
							</Col>
						))}
					</Row>
					{/* 字体展示区 */}
					<div
						className="transition-all"
						style={{
							color: fontColor.toString(),
							fontSize: `${fontSize}px`,
							fontWeight: fontWeight,
							fontStyle: isItalic ? "italic" : "normal",
							minHeight: "120px",
							wordWrap: "break-word",
						}}
					>
						<div>{fontFamilyName}</div>
						<div className="w-full">
							<div className="border border-dashed rounded-lg p-4 hover:border-gray-400 transition-colors">
								<div 
									className="leading-relaxed"
									contentEditable="plaintext-only"
									suppressContentEditableWarning
									onPaste={(e) => {
										e.preventDefault();
										// 只允许纯文本粘贴
										const text = e.clipboardData.getData('text/plain');
										// 过滤掉所有HTML标签和脚本
										const sanitizedText = text
											.replace(/<[^>]*>/g, '') // 移除HTML标签
											.replace(/javascript:/gi, '') // 移除javascript:协议
											.replace(/on\w+=/gi, '') // 移除事件处理程序
											.replace(/data:/gi, ''); // 移除data:协议
										// 使用 Selection API 插入文本
										const selection = window.getSelection();
										const range = selection?.getRangeAt(0);
										if (range) {
											range.deleteContents();
											range.insertNode(document.createTextNode(sanitizedText));
										}
									}}
									onDrop={(e) => e.preventDefault()} // 禁止拖拽
									onKeyDown={(e) => {
										// 禁止输入尖括号，防止HTML注入
										if (e.key === '<' || e.key === '>') {
											e.preventDefault();
										}
									}}
									onBlur={(e) => {
										const content = e.target.textContent?.trim();
										if (!content) {
											e.target.textContent = 'abcdefghijklmnopqrstuvwxyz\nABCDEFGHIJKLMNOPQRSTUVWXYZ\n0123456789';
										} else {
											// 严格的XSS防护
											e.target.textContent = content
												.replace(/<[^>]*>/g, '')
												.replace(/javascript:/gi, '')
												.replace(/on\w+=/gi, '')
												.replace(/data:/gi, '')
												.replace(/&/g, '&amp;')
												.replace(/"/g, '&quot;')
												.replace(/'/g, '&#x27;')
												.replace(/</g, '&lt;')
												.replace(/>/g, '&gt;');
										}
									}}
									style={{
										whiteSpace: "pre-wrap",
										outline: "none",
										cursor: "text",
										minHeight: "100px",
										fontSize: "inherit",
										fontWeight: "inherit",
										fontStyle: "inherit",
										color: "inherit"
									}}
								>
									abcdefghijklmnopqrstuvwxyz
									{'\n'}ABCDEFGHIJKLMNOPQRSTUVWXYZ
									{'\n'}0123456789
								</div>
							</div>
						</div>
					</div>
				</Space>
			</Card>
		</div>
	);
}
