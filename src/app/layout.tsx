import React from "react";
import type { Metadata } from "next";
import "./global.css";
import { Pragmata, Music, Poppins, RobotoMono } from "@/fonts";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${Pragmata.variable} ${Music.variable} ${Poppins.variable} ${RobotoMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
