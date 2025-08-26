import localFont from "next/font/local";
import { NextFontWithVariable } from "next/dist/compiled/@next/font";

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

export const YiQiShengDanTi = localFont({
	src: "../public/fonts/YiQiShengDanTi/YiQiShengDanTi-Regular.ttf",
	variable: "--font-yiqishengdanti",
	display: "swap",
	preload: false, // 非阻塞加载
});

export const HanChanYuanTi = localFont({
	src: [
		{
			path: "../public/fonts/HanChanYuanTi/HanChanYuanTi-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/HanChanYuanTi/HanChanYuanTi-Bold.ttf",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-hanchanyuanti",
	display: "swap",
	preload: false,
});

export const HanChanYuanTiRound = localFont({
	src: "../public/fonts/HanChanYuanTiRound/HanChanYuanTiRound-Regular.otf",
	variable: "--font-hanchanyuantiround",
	display: "swap",
	preload: false,
});

export const HanChanYuanTiSans = localFont({
	src: "../public/fonts/HanChanYuanTiSans/HanChanYuanTiSans-Regular.otf",
	variable: "--font-hanchanyuantisans",
	display: "swap",
	preload: false,
});

export const HarmonyOSSans = localFont({
	src: [
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Thin-Italic.ttf",
			weight: "100",
			style: "italic",
		},
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Thin-Italic.ttf",
			weight: "100",
			style: "italic",
		},
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Light-Italic.ttf",
			weight: "300",
			style: "italic",
		},
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Light-Italic.ttf",
			weight: "300",
			style: "italic",
		},
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Regular-Italic.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Regular-Italic.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Medium-Italic.ttf",
			weight: "500",
			style: "italic",
		},
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Medium-Italic.ttf",
			weight: "500",
			style: "italic",
		},
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Bold-Italic.ttf",
			weight: "700",
			style: "italic",
		},
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Bold-Italic.ttf",
			weight: "700",
			style: "italic",
		},
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Black-Italic.ttf",
			weight: "900",
			style: "italic",
		},
		{
			path: "../public/fonts/HarmonyOSSans/HarmonyOSSans-Black-Italic.ttf",
			weight: "900",
			style: "italic",
		},
	],
	variable: "--font-harmonyossans",
	display: "swap",
	preload: false,
});

export const Icomoon = localFont({
	src: [
		{
			path: "../public/fonts/Icomoon/Icomoon-Regular.eot",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/Icomoon/Icomoon-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/Icomoon/Icomoon-Regular.woff",
			weight: "400",
			style: "normal",
		},
	],
	variable: "--font-icomoon",
	display: "swap",
	preload: false,
});

export const ZhuLangYinYueFuHaoGePuTi = localFont({
	src: "../public/fonts/ZhuLangYinYueFuHaoGePuTi/ZhuLangYinYueFuHaoGePuTi-Regular.otf",
	variable: "--font-zhulangyinyuefuhaogeputi",
	display: "swap",
	preload: false, // 非阻塞加载
});

export const PingFangSC = localFont({
	src: [
		{
			path: "../public/fonts/PingFangSC/PingFangSC-Thin.ttf",
			weight: "100",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-Thin.woff2",
			weight: "100",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-UltraLight.ttf",
			weight: "200",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-Light.woff2",
			weight: "300",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-Regular.eot",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-Regular.woff",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-Regular.woff2",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-Medium.woff2",
			weight: "500",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangSC/PingFangSC-SemiBold.woff2",
			weight: "600",
			style: "normal",
		},
	],
	variable: "--font-pingfangsc",
	display: "swap",
	preload: false,
});

export const PingFangTC = localFont({
	src: [
		{
			path: "../public/fonts/PingFangTC/PingFangTC-Thin.ttf",
			weight: "100",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangTC/PingFangTC-UltraLight.ttf",
			weight: "200",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangTC/PingFangTC-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangTC/PingFangTC-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangTC/PingFangTC-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../public/fonts/PingFangTC/PingFangTC-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
	],
	variable: "--font-pingfangtc",
	display: "swap",
	preload: false,
});

export const Poppins = localFont({
	src: [
		{
			path: "../public/fonts/Poppins/Poppins-Thin-Italic.ttf",
			weight: "100",
			style: "italic",
		},
		{
			path: "../public/fonts/Poppins/Poppins-Thin.ttf",
			weight: "100",
			style: "normal",
		},
		{
			path: "../public/fonts/Poppins/Poppins-UltraLight-Italic.ttf",
			weight: "200",
			style: "italic",
		},
		{
			path: "../public/fonts/Poppins/Poppins-UltraLight.ttf",
			weight: "200",
			style: "normal",
		},
		{
			path: "../public/fonts/Poppins/Poppins-Light-Italic.ttf",
			weight: "300",
			style: "italic",
		},
		{
			path: "../public/fonts/Poppins/Poppins-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../public/fonts/Poppins/Poppins-Regular-Italic.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "../public/fonts/Poppins/Poppins-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/Poppins/Poppins-Medium-Italic.ttf",
			weight: "500",
			style: "italic",
		},
		{
			path: "../public/fonts/Poppins/Poppins-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../public/fonts/Poppins/Poppins-SemiBold-Italic.ttf",
			weight: "600",
			style: "italic",
		},
		{
			path: "../public/fonts/Poppins/Poppins-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "../public/fonts/Poppins/Poppins-Bold-Italic.ttf",
			weight: "700",
			style: "italic",
		},
		{
			path: "../public/fonts/Poppins/Poppins-Bold.ttf",
			weight: "700",
			style: "normal",
		},
		{
			path: "../public/fonts/Poppins/Poppins-ExtraBold-Italic.ttf",
			weight: "800",
			style: "italic",
		},
		{
			path: "../public/fonts/Poppins/Poppins-ExtraBold.ttf",
			weight: "800",
			style: "normal",
		},
		{
			path: "../public/fonts/Poppins/Poppins-Black-Italic.ttf",
			weight: "900",
			style: "italic",
		},
		{
			path: "../public/fonts/Poppins/Poppins-Black.ttf",
			weight: "900",
			style: "normal",
		},
	],
	variable: "--font-poppins",
	display: "swap",
	preload: false,
});

export const Pragmata = localFont({
	src: "../public/fonts/Pragmata/Pragmata-Regular.ttf",
	variable: "--font-pragmata",
	display: "swap",
	preload: false, // 非阻塞加载
});

export const RobotoMono = localFont({
	src: [
		{
			path: "../public/fonts/RobotoMono/RobotoMono-Thin-Italic.ttf",
			weight: "100",
			style: "italic",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-Thin.ttf",
			weight: "100",
			style: "normal",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-UltraLight-Italic.ttf",
			weight: "200",
			style: "italic",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-UltraLight.ttf",
			weight: "200",
			style: "normal",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-Light-Italic.ttf",
			weight: "300",
			style: "italic",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-Light.ttf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-Regular-Italic.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-Regular.ttf",
			weight: "400",
			style: "normal",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-Medium-Italic.ttf",
			weight: "500",
			style: "italic",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-Medium.ttf",
			weight: "500",
			style: "normal",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-SemiBold-Italic.ttf",
			weight: "600",
			style: "italic",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-SemiBold.ttf",
			weight: "600",
			style: "normal",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-Bold-Italic.ttf",
			weight: "700",
			style: "italic",
		},
		{
			path: "../public/fonts/RobotoMono/RobotoMono-Bold.ttf",
			weight: "700",
			style: "normal",
		},
	],
	variable: "--font-robotomono",
	display: "swap",
	preload: false,
});

export const RobotoMonoVariableFontwght = localFont({
	src: [
		{
			path: "../public/fonts/RobotoMonoVariableFontwght/RobotoMonoVariableFontwght-Regular-Italic.ttf",
			weight: "400",
			style: "italic",
		},
		{
			path: "../public/fonts/RobotoMonoVariableFontwght/RobotoMonoVariableFontwght-Regular.ttf",
			weight: "400",
			style: "normal",
		},
	],
	variable: "--font-robotomonovariablefontwght",
	display: "swap",
	preload: false,
});

export const DouYinSansBold = localFont({
	src: "../public/fonts/DouYinSansBold/DouYinSansBold-Bold.otf",
	variable: "--font-douyinsansbold",
	display: "swap",
	preload: false,
});

export const Cubic = localFont({
	src: "../public/fonts/Cubic/Cubic-Regular.ttf",
	variable: "--font-cubic",
	display: "swap",
	preload: false,
});

export const YiQiShengDanTiVariants: FontVariantInfo = {
  "totalVariants": 1,
  "weights": [
    400
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 400,
      "style": "normal",
      "file": "YiQiShengDanTi-Regular.ttf"
    }
  ]
};

export const HanChanYuanTiVariants: FontVariantInfo = {
  "totalVariants": 2,
  "weights": [
    400,
    700
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 400,
      "style": "normal",
      "file": "HanChanYuanTi-Regular.ttf"
    },
    {
      "weight": 700,
      "style": "normal",
      "file": "HanChanYuanTi-Bold.ttf"
    }
  ]
};

export const HanChanYuanTiRoundVariants: FontVariantInfo = {
  "totalVariants": 1,
  "weights": [
    400
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 400,
      "style": "normal",
      "file": "HanChanYuanTiRound-Regular.otf"
    }
  ]
};

export const HanChanYuanTiSansVariants: FontVariantInfo = {
  "totalVariants": 1,
  "weights": [
    400
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 400,
      "style": "normal",
      "file": "HanChanYuanTiSans-Regular.otf"
    }
  ]
};

export const HarmonyOSSansVariants: FontVariantInfo = {
  "totalVariants": 6,
  "weights": [
    100,
    300,
    400,
    500,
    700,
    900
  ],
  "styles": [
    "italic"
  ],
  "variants": [
    {
      "weight": 100,
      "style": "italic",
      "file": "HarmonyOSSans-Thin-Italic.ttf"
    },
    {
      "weight": 300,
      "style": "italic",
      "file": "HarmonyOSSans-Light-Italic.ttf"
    },
    {
      "weight": 400,
      "style": "italic",
      "file": "HarmonyOSSans-Regular-Italic.ttf"
    },
    {
      "weight": 500,
      "style": "italic",
      "file": "HarmonyOSSans-Medium-Italic.ttf"
    },
    {
      "weight": 700,
      "style": "italic",
      "file": "HarmonyOSSans-Bold-Italic.ttf"
    },
    {
      "weight": 900,
      "style": "italic",
      "file": "HarmonyOSSans-Black-Italic.ttf"
    }
  ]
};

export const IcomoonVariants: FontVariantInfo = {
  "totalVariants": 1,
  "weights": [
    400
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 400,
      "style": "normal",
      "file": "Icomoon-Regular.eot"
    }
  ]
};

export const ZhuLangYinYueFuHaoGePuTiVariants: FontVariantInfo = {
  "totalVariants": 1,
  "weights": [
    400
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 400,
      "style": "normal",
      "file": "ZhuLangYinYueFuHaoGePuTi-Regular.otf"
    }
  ]
};

export const PingFangSCVariants: FontVariantInfo = {
  "totalVariants": 6,
  "weights": [
    100,
    200,
    300,
    400,
    500,
    600
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 100,
      "style": "normal",
      "file": "PingFangSC-Thin.ttf"
    },
    {
      "weight": 200,
      "style": "normal",
      "file": "PingFangSC-UltraLight.ttf"
    },
    {
      "weight": 300,
      "style": "normal",
      "file": "PingFangSC-Light.ttf"
    },
    {
      "weight": 400,
      "style": "normal",
      "file": "PingFangSC-Regular.eot"
    },
    {
      "weight": 500,
      "style": "normal",
      "file": "PingFangSC-Medium.ttf"
    },
    {
      "weight": 600,
      "style": "normal",
      "file": "PingFangSC-SemiBold.ttf"
    }
  ]
};

export const PingFangTCVariants: FontVariantInfo = {
  "totalVariants": 6,
  "weights": [
    100,
    200,
    300,
    400,
    500,
    600
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 100,
      "style": "normal",
      "file": "PingFangTC-Thin.ttf"
    },
    {
      "weight": 200,
      "style": "normal",
      "file": "PingFangTC-UltraLight.ttf"
    },
    {
      "weight": 300,
      "style": "normal",
      "file": "PingFangTC-Light.ttf"
    },
    {
      "weight": 400,
      "style": "normal",
      "file": "PingFangTC-Regular.ttf"
    },
    {
      "weight": 500,
      "style": "normal",
      "file": "PingFangTC-Medium.ttf"
    },
    {
      "weight": 600,
      "style": "normal",
      "file": "PingFangTC-SemiBold.ttf"
    }
  ]
};

export const PoppinsVariants: FontVariantInfo = {
  "totalVariants": 18,
  "weights": [
    100,
    200,
    300,
    400,
    500,
    600,
    700,
    800,
    900
  ],
  "styles": [
    "italic",
    "normal"
  ],
  "variants": [
    {
      "weight": 100,
      "style": "italic",
      "file": "Poppins-Thin-Italic.ttf"
    },
    {
      "weight": 100,
      "style": "normal",
      "file": "Poppins-Thin.ttf"
    },
    {
      "weight": 200,
      "style": "italic",
      "file": "Poppins-UltraLight-Italic.ttf"
    },
    {
      "weight": 200,
      "style": "normal",
      "file": "Poppins-UltraLight.ttf"
    },
    {
      "weight": 300,
      "style": "italic",
      "file": "Poppins-Light-Italic.ttf"
    },
    {
      "weight": 300,
      "style": "normal",
      "file": "Poppins-Light.ttf"
    },
    {
      "weight": 400,
      "style": "italic",
      "file": "Poppins-Regular-Italic.ttf"
    },
    {
      "weight": 400,
      "style": "normal",
      "file": "Poppins-Regular.ttf"
    },
    {
      "weight": 500,
      "style": "italic",
      "file": "Poppins-Medium-Italic.ttf"
    },
    {
      "weight": 500,
      "style": "normal",
      "file": "Poppins-Medium.ttf"
    },
    {
      "weight": 600,
      "style": "italic",
      "file": "Poppins-SemiBold-Italic.ttf"
    },
    {
      "weight": 600,
      "style": "normal",
      "file": "Poppins-SemiBold.ttf"
    },
    {
      "weight": 700,
      "style": "italic",
      "file": "Poppins-Bold-Italic.ttf"
    },
    {
      "weight": 700,
      "style": "normal",
      "file": "Poppins-Bold.ttf"
    },
    {
      "weight": 800,
      "style": "italic",
      "file": "Poppins-ExtraBold-Italic.ttf"
    },
    {
      "weight": 800,
      "style": "normal",
      "file": "Poppins-ExtraBold.ttf"
    },
    {
      "weight": 900,
      "style": "italic",
      "file": "Poppins-Black-Italic.ttf"
    },
    {
      "weight": 900,
      "style": "normal",
      "file": "Poppins-Black.ttf"
    }
  ]
};

export const PragmataVariants: FontVariantInfo = {
  "totalVariants": 1,
  "weights": [
    400
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 400,
      "style": "normal",
      "file": "Pragmata-Regular.ttf"
    }
  ]
};

export const RobotoMonoVariants: FontVariantInfo = {
  "totalVariants": 14,
  "weights": [
    100,
    200,
    300,
    400,
    500,
    600,
    700
  ],
  "styles": [
    "italic",
    "normal"
  ],
  "variants": [
    {
      "weight": 100,
      "style": "italic",
      "file": "RobotoMono-Thin-Italic.ttf"
    },
    {
      "weight": 100,
      "style": "normal",
      "file": "RobotoMono-Thin.ttf"
    },
    {
      "weight": 200,
      "style": "italic",
      "file": "RobotoMono-UltraLight-Italic.ttf"
    },
    {
      "weight": 200,
      "style": "normal",
      "file": "RobotoMono-UltraLight.ttf"
    },
    {
      "weight": 300,
      "style": "italic",
      "file": "RobotoMono-Light-Italic.ttf"
    },
    {
      "weight": 300,
      "style": "normal",
      "file": "RobotoMono-Light.ttf"
    },
    {
      "weight": 400,
      "style": "italic",
      "file": "RobotoMono-Regular-Italic.ttf"
    },
    {
      "weight": 400,
      "style": "normal",
      "file": "RobotoMono-Regular.ttf"
    },
    {
      "weight": 500,
      "style": "italic",
      "file": "RobotoMono-Medium-Italic.ttf"
    },
    {
      "weight": 500,
      "style": "normal",
      "file": "RobotoMono-Medium.ttf"
    },
    {
      "weight": 600,
      "style": "italic",
      "file": "RobotoMono-SemiBold-Italic.ttf"
    },
    {
      "weight": 600,
      "style": "normal",
      "file": "RobotoMono-SemiBold.ttf"
    },
    {
      "weight": 700,
      "style": "italic",
      "file": "RobotoMono-Bold-Italic.ttf"
    },
    {
      "weight": 700,
      "style": "normal",
      "file": "RobotoMono-Bold.ttf"
    }
  ]
};

export const RobotoMonoVariableFontwghtVariants: FontVariantInfo = {
  "totalVariants": 2,
  "weights": [
    400
  ],
  "styles": [
    "italic",
    "normal"
  ],
  "variants": [
    {
      "weight": 400,
      "style": "italic",
      "file": "RobotoMonoVariableFontwght-Regular-Italic.ttf"
    },
    {
      "weight": 400,
      "style": "normal",
      "file": "RobotoMonoVariableFontwght-Regular.ttf"
    }
  ]
};

export const DouYinSansBoldVariants: FontVariantInfo = {
  "totalVariants": 1,
  "weights": [
    700
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 700,
      "style": "normal",
      "file": "DouYinSansBold-Bold.otf"
    }
  ]
};

export const CubicVariants: FontVariantInfo = {
  "totalVariants": 1,
  "weights": [
    400
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 400,
      "style": "normal",
      "file": "Cubic-Regular.ttf"
    }
  ]
};

export const WenYueHouXianDaiTi = localFont({
	src: [
		{
			path: "../public/fonts/WenYueHouXianDaiTi/WenYueHouXianDaiTi-UltraLight.otf",
			weight: "200",
			style: "normal",
		},
		{
			path: "../public/fonts/WenYueHouXianDaiTi/WenYueHouXianDaiTi-Light.otf",
			weight: "300",
			style: "normal",
		},
		{
			path: "../public/fonts/WenYueHouXianDaiTi/WenYueHouXianDaiTi-Regular.otf",
			weight: "400",
			style: "normal",
		},
	],
	variable: "--font-wenyuehouxiandaiti",
	display: "swap",
	preload: false, // 非阻塞加载优化
});

// WenYueHouXianDaiTi 字体变体信息
export const WenYueHouXianDaiTiVariants: FontVariantInfo = {
  "totalVariants": 3,
  "weights": [
    200,
    300,
    400
  ],
  "styles": [
    "normal"
  ],
  "variants": [
    {
      "weight": 200,
      "style": "normal",
      "file": "WenYueHouXianDaiTi-UltraLight.otf"
    },
    {
      "weight": 300,
      "style": "normal",
      "file": "WenYueHouXianDaiTi-Light.otf"
    },
    {
      "weight": 400,
      "style": "normal",
      "file": "WenYueHouXianDaiTi-Regular.otf"
    }
  ]
};

export const myFonts: NextFontWithVariable[] = [
	Cubic,
	DouYinSansBold,
	HanChanYuanTi,
	HanChanYuanTiRound,
	HanChanYuanTiSans,
	HarmonyOSSans,
	Icomoon,
	PingFangSC,
	PingFangTC,
	Poppins,
	Pragmata,
	RobotoMono,
	RobotoMonoVariableFontwght,
	WenYueHouXianDaiTi,
	YiQiShengDanTi,
	ZhuLangYinYueFuHaoGePuTi,
];

// 所有字体变体信息映射
export const fontVariantsMap: { [key: string]: FontVariantInfo } = {
	YiQiShengDanTi: YiQiShengDanTiVariants,
	HanChanYuanTi: HanChanYuanTiVariants,
	HanChanYuanTiRound: HanChanYuanTiRoundVariants,
	HanChanYuanTiSans: HanChanYuanTiSansVariants,
	HarmonyOSSans: HarmonyOSSansVariants,
	Icomoon: IcomoonVariants,
	ZhuLangYinYueFuHaoGePuTi: ZhuLangYinYueFuHaoGePuTiVariants,
	PingFangSC: PingFangSCVariants,
	PingFangTC: PingFangTCVariants,
	Poppins: PoppinsVariants,
	Pragmata: PragmataVariants,
	RobotoMono: RobotoMonoVariants,
	RobotoMonoVariableFontwght: RobotoMonoVariableFontwghtVariants,
	DouYinSansBold: DouYinSansBoldVariants,
	Cubic: CubicVariants,
	WenYueHouXianDaiTi: WenYueHouXianDaiTiVariants,
};
