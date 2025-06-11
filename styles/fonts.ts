import localFont from "next/font/local";

// 这里定义的变量名称将来会被获取并处理展示在页面上作为字体名称
const Pragmata = localFont({ src: "./fonts/Pragmata/Pragmata.ttf", variable: "--font-pragmata" });
const Music = localFont({ src: "./fonts/Music/ZhuLangYinYueFuHaoGePuTi.otf", variable: "--font-music" });
const Poppins = localFont({
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
});
const RobotoMono = localFont({
	src: [
		{
			path: "./fonts/RobotoMono/static/RobotoMono-Bold.ttf",
			weight: "700",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-BoldItalic.ttf",
			weight: "700",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-ExtraLight.ttf",
			weight: "200",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-ExtraLightItalic.ttf",
			weight: "200",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-Italic.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-LightItalic.ttf",
			weight: "300",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-MediumItalic.ttf",
			weight: "500",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-SemiBoldItalic.ttf",
			weight: "600",
			style: "italic",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-Thin.ttf",
			weight: "100",
			style: "normal",
		},
		{
			path: "./fonts/RobotoMono/static/RobotoMono-ThinItalic.ttf",
			weight: "100",
			style: "italic",
		},
	],
	variable: "--font-roboto-mono",
});
export const myFonts = [Pragmata, Music, Poppins, RobotoMono];
