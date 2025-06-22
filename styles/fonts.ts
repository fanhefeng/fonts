import localFont from "next/font/local";

// 这里定义的变量名称将来会被获取并处理展示在页面上作为字体名称
export const Pragmata = localFont({
	src: "./fonts/Pragmata/Pragmata.ttf",
	variable: "--font-pragmata",
	display: "swap", // 优化字体加载体验
});

export const Music = localFont({
	src: "./fonts/Music/ZhuLangYinYueFuHaoGePuTi.otf",
	variable: "--font-music",
	display: "swap",
});

export const Poppins = localFont({
	src: [
		{
			path: "./fonts/Poppins/Poppins-Black.ttf",
			weight: "900",
			style: "normal",
		},
		{
			path: "./fonts/Poppins/Poppins-BlackItalic.ttf",
			weight: "900",
			style: "italic",
		},
		{
			path: "./fonts/Poppins/Poppins-Bold.ttf",
			weight: "700",
			style: "normal",
		},
		{
			path: "./fonts/Poppins/Poppins-BoldItalic.ttf",
			weight: "700",
			style: "italic",
		},
		{
			path: "./fonts/Poppins/Poppins-ExtraBold.ttf",
			weight: "800",
			style: "normal",
		},
		{
			path: "./fonts/Poppins/Poppins-ExtraBoldItalic.ttf",
			weight: "800",
			style: "italic",
		},
		{
			path: "./fonts/Poppins/Poppins-ExtraLight.ttf",
			weight: "200",
			style: "normal",
		},
		{
			path: "./fonts/Poppins/Poppins-ExtraLightItalic.ttf",
			weight: "200",
			style: "italic",
		},
		{
			path: "./fonts/Poppins/Poppins-Italic.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "./fonts/Poppins/Poppins-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "./fonts/Poppins/Poppins-LightItalic.ttf",
			weight: "300",
			style: "italic",
		},
		{
			path: "./fonts/Poppins/Poppins-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/Poppins/Poppins-MediumItalic.ttf",
			weight: "500",
			style: "italic",
		},
		{
			path: "./fonts/Poppins/Poppins-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/Poppins/Poppins-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "./fonts/Poppins/Poppins-SemiBoldItalic.ttf",
			weight: "600",
			style: "italic",
		},
		{
			path: "./fonts/Poppins/Poppins-Thin.ttf",
			weight: "100",
			style: "normal",
		},
		{
			path: "./fonts/Poppins/Poppins-ThinItalic.ttf",
			weight: "100",
			style: "italic",
		},
	],
	variable: "--font-poppins",
	display: "swap",
});

export const RobotoMono = localFont({
	src: [
		{
			path: "./fonts/RobotoMono/RobotoMono-Bold.ttf",
			weight: "700",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-BoldItalic.ttf",
			weight: "700",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-ExtraLight.ttf",
			weight: "200",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-ExtraLightItalic.ttf",
			weight: "200",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-Italic.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-LightItalic.ttf",
			weight: "300",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-MediumItalic.ttf",
			weight: "500",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-SemiBoldItalic.ttf",
			weight: "600",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-Thin.ttf",
			weight: "100",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/RobotoMono-ThinItalic.ttf",
			weight: "100",
			style: "italic",
		},
	],
	variable: "--font-roboto-mono",
	display: "swap",
});
export const myFonts = [Pragmata, Music, Poppins, RobotoMono];
