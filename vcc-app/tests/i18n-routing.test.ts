import assert from "node:assert/strict";
import test from "node:test";
import {
	isSupportedLocale,
	localeFromPath,
	localizePath,
	switchPathLocale,
} from "../app/(public)/vcc/i18n/routing.ts";
import {
	createMaintenanceRedirectUrl,
	isInfrastructurePath,
	isMaintenancePath,
	parseSiteStatus,
	shouldRedirectToMaintenance,
} from "../lib/site-status.ts";

test("locale parser only accepts id and en path segments", () => {
	assert.equal(localeFromPath("/id/programs"), "id");
	assert.equal(localeFromPath("/en/programs"), "en");
	assert.equal(localeFromPath("/fr/programs"), null);
	assert.equal(isSupportedLocale("en"), true);
	assert.equal(isSupportedLocale("EN"), false);
});

test("localized path helper prefixes legacy paths and replaces existing locale", () => {
	assert.equal(localizePath("/programs/abc", "id"), "/id/programs/abc");
	assert.equal(localizePath("/id/programs/abc", "en"), "/en/programs/abc");
	assert.equal(localizePath("/", "en"), "/en");
});

test("language switching preserves the active path", () => {
	assert.equal(
		switchPathLocale("/id/programs/abc", "en"),
		"/en/programs/abc",
	);
	assert.equal(
		switchPathLocale("/id/programs/abc?page=2", "en"),
		"/en/programs/abc?page=2",
	);
});

test("site status parser safely defaults to active", () => {
	assert.equal(parseSiteStatus("maintenance"), "maintenance");
	assert.equal(parseSiteStatus(" Maintenance "), "maintenance");
	assert.equal(parseSiteStatus("active"), "active");
	assert.equal(parseSiteStatus("unexpected"), "active");
	assert.equal(parseSiteStatus(undefined), "active");
});

test("maintenance routing excludes its own page and infrastructure paths", () => {
	assert.equal(isMaintenancePath("/maintenance"), true);
	assert.equal(isMaintenancePath("/maintenance/"), true);
	assert.equal(isInfrastructurePath("/api/programs"), true);
	assert.equal(isInfrastructurePath("/_next/static/app.js"), true);
	assert.equal(isInfrastructurePath("/images/logo/vcc-logo-only.jpg"), true);
	assert.equal(isInfrastructurePath("/favicon.ico"), true);
	assert.equal(
		shouldRedirectToMaintenance("maintenance", "/en/programs"),
		true,
	);
	assert.equal(
		shouldRedirectToMaintenance("maintenance", "/maintenance"),
		false,
	);
	assert.equal(
		shouldRedirectToMaintenance("maintenance", "/api/programs"),
		false,
	);
	assert.equal(shouldRedirectToMaintenance("active", "/en/programs"), false);
});

test("maintenance redirect URL removes query strings and fragments", () => {
	const result = createMaintenanceRedirectUrl(
		new URL("https://vcc.sv.ipb.ac.id/en/programs?page=2#gallery"),
	);

	assert.equal(result.toString(), "https://vcc.sv.ipb.ac.id/maintenance");
});
