import "./vcc/globals.css";
import { LanguageProvider } from "./vcc/components/LanguageProvider";
import { headers } from "next/headers";
import type { Metadata } from "next";

const siteUrl =
	process.env.NEXT_PUBLIC_SITE_URL || "https://vcc.sv.ipb.ac.id";

export async function generateMetadata(): Promise<Metadata> {
	const requestHeaders = await headers();
	const locale = requestHeaders.get("x-vcc-locale") === "en" ? "en" : "id";
	const currentPath = requestHeaders.get("x-vcc-path") || `/${locale}`;
	const pathWithoutLocale =
		currentPath.replace(/^\/(id|en)(?=\/|$)/, "") || "";
	const pageKey = pathWithoutLocale || "/";
	const pageTitles: Record<string, { id: string; en: string }> = {
		"/": {
			id: "Vocational Collaboration Center SV IPB",
			en: "Vocational Collaboration Center — IPB Vocational School",
		},
		"/about": {
			id: "Tentang Kami — VCC SV IPB",
			en: "About Us — VCC IPB Vocational School",
		},
		"/contacts": {
			id: "Kontak — VCC SV IPB",
			en: "Contact — VCC IPB Vocational School",
		},
		"/programs": {
			id: "Program Kerja Sama — VCC SV IPB",
			en: "Collaboration Programs — VCC IPB Vocational School",
		},
		"/programs/japan/ppbj": {
			id: "Pelatihan Bahasa Jepang PPBJ — SV IPB",
			en: "PPBJ Japanese Language Training — IPB Vocational School",
		},
		"/programs/japan/chuo": {
			id: "Program Chuo 3+2 — SV IPB",
			en: "Chuo 3+2 Program — IPB Vocational School",
		},
		"/pekerjamigranaceh": {
			id: "Program Pekerja Migran Aceh — SV IPB",
			en: "Aceh Migrant Worker Program — IPB Vocational School",
		},
	};
	const title =
		pageTitles[pageKey]?.[locale] ||
		(locale === "id"
			? "Program Internasional — VCC SV IPB"
			: "International Program — VCC IPB Vocational School");
	const description =
		locale === "id"
			? "Pusat informasi program kerja sama internasional Sekolah Vokasi IPB University."
			: "International collaboration program information from IPB Vocational School.";

	return {
		metadataBase: new URL(siteUrl),
		title,
		description,
		icons: { icon: "/images/logo/vcc-logo-only.jpg" },
		alternates: {
			canonical: currentPath,
			languages: {
				"id-ID": `/id${pathWithoutLocale}`,
				en: `/en${pathWithoutLocale}`,
			},
		},
		openGraph: {
			title,
			description,
			locale: locale === "id" ? "id_ID" : "en_US",
			alternateLocale: locale === "id" ? ["en_US"] : ["id_ID"],
			url: currentPath,
			type: "website",
		},
	};
}

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const requestHeaders = await headers();
	const locale = requestHeaders.get("x-vcc-locale") === "en" ? "en" : "id";
	return (
		<html lang={locale}>
			<body className="antialiased">
				<LanguageProvider initialLocale={locale}>{children}</LanguageProvider>
			</body>
		</html>
	);
}
