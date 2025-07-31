import React from "react";
import type { Metadata } from "next";
import { 
  Christmas, 
  Iconmoon, 
  Music, 
  PingFangSC, 
  PingFangTC, 
  Poppins, 
  Pragmata, 
  RobotoMono 
} from "../../styles/fonts";
import "./global.css";

export const metadata: Metadata = {
  title: "字体展示库 - Font Showcase",
  description: "发现和预览精美的字体集合，支持实时预览和个性化配置。",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body className={`
        ${Christmas.variable} 
        ${Iconmoon.variable} 
        ${Music.variable} 
        ${PingFangSC.variable} 
        ${PingFangTC.variable} 
        ${Poppins.variable} 
        ${Pragmata.variable} 
        ${RobotoMono.variable}
        bg-gray-50 min-h-screen
      `}>
        {children}
      </body>
    </html>
  );
}