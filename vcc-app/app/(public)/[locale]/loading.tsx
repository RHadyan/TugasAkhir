"use client";

import { useLanguage } from "@/app/(public)/vcc/components/LanguageProvider";

export default function Loading() {
	const { language } = useLanguage();
	return (
		<div className="flex min-h-[60vh] items-center justify-center bg-slate-50">
			<div className="text-center" role="status" aria-live="polite">
				<div className="mx-auto mb-4 h-11 w-11 animate-spin rounded-full border-4 border-slate-200 border-t-blue-700" />
				<p className="font-medium text-slate-600">
					{language === "id" ? "Memuat…" : "Loading…"}
				</p>
			</div>
		</div>
	);
}
