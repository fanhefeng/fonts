"use client";

import React from "react";
import { App } from "antd";
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
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import "./global.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className={`
        ${Christmas.variable} 
        ${Iconmoon.variable} 
        ${Music.variable} 
        ${PingFangSC.variable} 
        ${PingFangTC.variable} 
        ${Poppins.variable} 
        ${Pragmata.variable} 
        ${RobotoMono.variable}
        transition-colors duration-300
      `} suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <App>
              {children}
            </App>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}