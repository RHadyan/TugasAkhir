"use client";

import { useLanguage } from "@/app/(public)/vcc/components/LanguageProvider";

export default function ErrorPage({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	const { language } = useLanguage();
	const isId = language === "id";

	return (
		<div className="flex min-h-[60vh] items-center justify-center bg-slate-50 px-4">
			<div className="max-w-md text-center">
				<p className="mb-2 text-sm font-bold uppercase tracking-widest text-blue-700">
					{isId ? "Terjadi Kesalahan" : "Something Went Wrong"}
				</p>
				<h1 className="mb-5 text-3xl font-bold text-slate-900">
					{isId
						? "Halaman belum dapat ditampilkan"
						: "The page could not be displayed"}
				</h1>
				<button
					type="button"
					onClick={reset}
					className="rounded-xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800"
				>
					{isId ? "Coba Lagi" : "Try Again"}
				</button>
			</div>
		</div>
	);
}
