import type { Metadata } from "next";
import "../../../vcc/globals.css";
import { metadata } from "./metadata";

export { metadata };

export default function PPBJLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<div className="min-h-screen bg-white flex flex-col">
			<main className="flex-1">{children}</main>
		</div>
	);
}
