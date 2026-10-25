"use client";

import { Footer, Header } from "@/app/(public)/components";
import { useLanguage } from "@/app/(public)/vcc/components/LanguageProvider";

export default function UnderDevelopmentPage({
	country,
}: {
	country?: string;
}) {
	const { language } = useLanguage();
	const isId = language === "id";
	const subject = country ? `${isId ? "Program" : "Programs in"} ${country}` : null;

	return (
		<div className="min-h-screen bg-white">
			<Header />
			<main className="px-4 py-14 sm:px-6 lg:px-8">
				<div className="mx-auto max-w-6xl">
					<div className="mb-12 text-center">
						<h1 className="mb-4 text-3xl font-extrabold text-slate-900 sm:text-4xl lg:text-5xl">
							{subject || (isId ? "Halaman dalam Pengembangan" : "Page Under Development")}
						</h1>
						<p className="mx-auto max-w-2xl text-lg text-slate-700">
							{isId
								? "Konten pada halaman ini sedang disiapkan. Informasi akan diperbarui secara bertahap."
								: "Content for this page is being prepared. Information will be published progressively."}
						</p>
					</div>
					<div className="flex justify-center">
						<div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center shadow-sm">
							<div className="mb-4 flex justify-center">
								<div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl text-amber-600">
									🚧
								</div>
							</div>
							<h2 className="mb-2 text-2xl font-bold text-slate-900">
								{isId ? "Program dalam Pengembangan" : "Program Under Development"}
							</h2>
							<p className="text-slate-600">
								{isId
									? `Informasi ${country ? `program ${country}` : "program ini"} akan segera tersedia.`
									: `Information about ${country ? `${country} programs` : "this program"} will be available soon.`}
							</p>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	);
}
