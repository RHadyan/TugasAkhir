"use client";

import Link from "next/link";
import { useLanguage } from "@/app/(public)/vcc/components/LanguageProvider";

export default function NotFound() {
	const { language, localizedPath } = useLanguage();
	const isId = language === "id";

	return (
		<div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
			<div className="max-w-md text-center">
				<p className="mb-3 text-6xl font-black text-blue-700">404</p>
				<h1 className="mb-3 text-3xl font-bold text-slate-900">
					{isId ? "Halaman Tidak Ditemukan" : "Page Not Found"}
				</h1>
				<p className="mb-7 text-slate-600">
					{isId
						? "Alamat yang Anda buka tidak tersedia atau telah dipindahkan."
						: "The address you opened is unavailable or has moved."}
				</p>
				<Link
					href={localizedPath("/")}
					className="inline-flex rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
				>
					{isId ? "Kembali ke Beranda" : "Back to Home"}
				</Link>
			</div>
		</div>
	);
}
