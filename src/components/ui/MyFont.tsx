"use client";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";
import { useState } from "react";

export default function MyFont({ font }: { font: NextFontWithVariable }) {
	console.log("MyFont =>", font);
	const [fontSize, setFontSize] = useState(16);
	const [isItalic, setIsItalic] = useState(false);
	const [fontWeight, setFontWeight] = useState(400);
	const [fontColor, setFontColor] = useState("black");
	return (
		<div className={font.className}>
			<h2>{font.style.fontFamily.split(",")[0].slice(1, -1)}</h2>
			<div style={{ fontSize, fontWeight, fontStyle: isItalic ? "italic" : "normal", color: fontColor }}>test</div>
		</div>
	);
}
