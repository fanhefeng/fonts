import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { type GetProp, type ColorPickerProps } from "antd";

export type NextFontWithVariableWithLiked = NextFontWithVariable & { isLiked: boolean };
export type Color = GetProp<ColorPickerProps, "value">;

// 字体变体信息接口定义
export interface FontVariant {
	weight: number;
	style: string;
	file: string;
}

export interface FontVariantInfo {
	totalVariants: number;
	weights: number[];
	styles: string[];
	variants: FontVariant[];
}