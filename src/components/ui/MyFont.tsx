"use client";
import { type NextFontWithVariableWithLiked } from "@/types/global";
import { useState, useEffect } from "react";
import { type ColorPickerProps, type GetProp, Card, Button, Slider, Switch, ColorPicker, Space, Row, Col } from "antd";
import { HeartFilled, HeartOutlined, ItalicOutlined } from "@ant-design/icons";
import { AggregationColor } from "antd/es/color-picker/color";

type Color = GetProp<ColorPickerProps, "value">;
type PreviewSettings = {
	fontSize: number;
	fontWeight: number;
	fontColor: Color;
	isItalic: boolean;
};
type MyFontProps = {
	font: NextFontWithVariableWithLiked;
	onToggleLike: (className: string) => void;
	previewSettings: PreviewSettings;
};

export default function MyFont({ font, onToggleLike, previewSettings }: MyFontProps) {
	const fontFamilyName = font.style.fontFamily.split(",")[0].slice(1, -1);
	const [settings, setSettings] = useState<PreviewSettings>(previewSettings);

	useEffect(() => {
		setSettings(previewSettings);
	}, [previewSettings]);

	const handleColorChange = (val: AggregationColor) => {
		const css = val.toCssString();
		setSettings({
			...settings,
			fontColor: css,
		});
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
			<div className="flex justify-between mb-2">
				<span>Font Size:{settings.fontSize}px</span>
			</div>
			<Slider min={12} max={72} value={settings.fontSize} onChange={(val) => setSettings({ ...settings, fontSize: val })} />
		</>
	);
	const fontWeightArea = (
		<>
			<div className="flex items-center mb-2">
				<span>Font Weight:{settings.fontWeight}</span>
			</div>
			<Slider
				min={100}
				max={900}
				step={100}
				value={settings.fontWeight}
				onChange={(val) => setSettings({ ...settings, fontWeight: val })}
			/>
		</>
	);
	const fontStyleArea = (
		<div className="flex">
			<Switch
				checked={settings.isItalic}
				onChange={(val) => setSettings({ ...settings, isItalic: val })}
				checkedChildren={<ItalicOutlined />}
				unCheckedChildren="正常"
			/>
		</div>
	);
	const fontColorArea = (
		<div className="flex">
			<ColorPicker value={settings.fontColor} onChangeComplete={handleColorChange} showText size="small" />
		</div>
	);

	return (
		<div className={font.className}>
			<Card title={fontFamilyName} style={{ fontFamily: "inherit" }} hoverable extra={cardExtra}>
				<Space direction="vertical" size={30} className="w-full">
					{/* 字体控制区 */}
					<Row gutter={[16, 16]}>
						{[fontSizeArea, fontWeightArea, fontStyleArea, fontColorArea].map((item, index) => (
							<Col key={index} xs={24} sm={12} md={6} className="!flex flex-col justify-center">
								{item}
							</Col>
						))}
					</Row>
					<div
						className="transition-all"
						style={{
							color: settings.fontColor.toString(),
							fontSize: `${settings.fontSize}px`,
							fontWeight: settings.fontWeight,
							fontStyle: settings.isItalic ? "italic" : "normal",
							minHeight: "120px",
              wordWrap: "break-word",
						}}
					>
						<div>{fontFamilyName}</div>
						<div>abcdefghijklmnopqrstuvwxyz</div>
						<div>ABCDEFGHIJKLMNOPQRSTUVWXYZ</div>
						<div>0123456789</div>
					</div>
				</Space>
			</Card>
		</div>
	);
}
