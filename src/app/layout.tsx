import React from "react";
import type { Metadata } from "next";
import "./global.css";

export const metadata: Metadata = {
  title: "Fonts",
  description: "Fonts share",
};
export default function RootLayout(props: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<body className="antialiased">{props.children}</body>
		</html>
	);
}
