export type SiteStatus = "active" | "maintenance";

const staticFilePattern = /\.[a-zA-Z0-9]+$/;

export function parseSiteStatus(value: string | undefined): SiteStatus {
	return value?.trim().toLowerCase() === "maintenance"
		? "maintenance"
		: "active";
}

export function isMaintenancePath(pathname: string) {
	return pathname === "/maintenance" || pathname === "/maintenance/";
}

export function isInfrastructurePath(pathname: string) {
	return (
		pathname === "/api" ||
		pathname.startsWith("/api/") ||
		pathname === "/_next" ||
		pathname.startsWith("/_next/") ||
		pathname === "/images" ||
		pathname.startsWith("/images/") ||
		pathname === "/favicon.ico" ||
		staticFilePattern.test(pathname)
	);
}

export function shouldRedirectToMaintenance(
	status: SiteStatus,
	pathname: string,
) {
	return (
		status === "maintenance" &&
		!isMaintenancePath(pathname) &&
		!isInfrastructurePath(pathname)
	);
}

export function createMaintenanceRedirectUrl(
	currentUrl: Pick<URL, "toString">,
) {
	const maintenanceUrl = new URL(currentUrl.toString());
	maintenanceUrl.pathname = "/maintenance";
	maintenanceUrl.search = "";
	maintenanceUrl.hash = "";
	return maintenanceUrl;
}
