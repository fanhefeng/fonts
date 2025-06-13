import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { type GetProp, type ColorPickerProps } from "antd";

export type NextFontWithVariableWithLiked = NextFontWithVariable & { isLiked: boolean };
export type Color = GetProp<ColorPickerProps, "value">;