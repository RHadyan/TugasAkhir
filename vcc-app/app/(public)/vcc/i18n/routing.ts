export const supportedLocales = ["id", "en"] as const;
export type SupportedLocale = (typeof supportedLocales)[number];

export function isSupportedLocale(value: string): value is SupportedLocale {
	return supportedLocales.includes(value as SupportedLocale);
}

export function localeFromPath(path: string): SupportedLocale | null {
	const candidate = path.split("/")[1];
	return isSupportedLocale(candidate) ? candidate : null;
}

export function localizePath(path: string, locale: SupportedLocale) {
	const normalized = path.startsWith("/") ? path : `/${path}`;
	const withoutLocale = normalized.replace(/^\/(id|en)(?=\/|$)/, "");
	const suffix = withoutLocale === "/" ? "" : withoutLocale;
	return `/${locale}${suffix || ""}`;
}

export function switchPathLocale(path: string, locale: SupportedLocale) {
	return localizePath(path, locale);
}
