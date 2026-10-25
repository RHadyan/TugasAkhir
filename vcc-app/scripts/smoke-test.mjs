import "dotenv/config";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";

// Read-only integration checks. Does not create, update, delete, or migrate records.
const base = process.env.SMOKE_BASE_URL || "http://127.0.0.1:3000";
const results = [];
async function check(path, expected, options = {}) {
  const response = await fetch(new URL(path, base), { redirect: "manual", ...options });
  assert.equal(response.status, expected, `${path}: expected ${expected}, got ${response.status}`);
  results.push({ path, status: response.status });
  return response;
}
await check("/", 307);
await check("/id", 200);
await check("/en", 200);
await check("/login", 200);
await check("/admin", 307);
await check("/api/auth/session", 401);
await check("/api/admin/programs", 401);
await check("/api/programs", 401, { method: "POST" });
await check("/auth/google/callback?code=invalid&state=invalid", 307);

if (process.argv.includes("--database")) {
  await check("/api/health-check", 200);
  const programs = await (await check("/api/programs?limit=2&locale=id", 200)).json();
  assert.equal(programs.success, true);
  assert.ok(programs.data.every((p) => p.isPublished));
  await check("/api/countries?limit=2&locale=en", 200);
  const email = process.env.ADMIN_EMAILS?.split(",")[0]?.trim();
  assert.ok(email && process.env.JWT_SECRET, "Local admin configuration is required");
  const token = jwt.sign({ id: "local-read-only-smoke-check", email, name: "Smoke check", picture: "" },
    process.env.JWT_SECRET, { algorithm: "HS256", issuer: "vcc-app", audience: "vcc-admin", expiresIn: 60 });
  const headers = { cookie: `vcc_session=${token}` };
  await check("/admin", 200, { headers });
  await check("/admin/countries", 200, { headers });
  await check("/admin/programs", 200, { headers });
  await check("/api/admin/programs?limit=2", 200, { headers });
  await check("/api/admin/countries?limit=2", 200, { headers });
}
console.log(JSON.stringify({ passed: results.length, results }, null, 2));
