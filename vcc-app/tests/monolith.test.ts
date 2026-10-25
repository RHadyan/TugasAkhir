import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";
import { SESSION_COOKIE, signSession, verifySession } from "../lib/session";

process.env.JWT_SECRET = "local-test-secret-not-used-by-the-application";
process.env.ADMIN_EMAILS = "admin@example.test";
process.env.SITE_STATUS = "active";
process.env.APP_URL = "http://localhost:3000";
const user = { id: "test-admin", email: "admin@example.test", name: "Admin", picture: "" };
function request(path: string, method = "GET", cookie?: string, origin?: string) {
  const headers = new Headers();
  if (cookie) headers.set("cookie", `${SESSION_COOKIE}=${cookie}`);
  if (origin) headers.set("origin", origin);
  return new NextRequest(`http://localhost:3000${path}`, { method, headers });
}
test("signed admin sessions reject tampering, expired tokens and removed administrators", () => {
  const token = signSession(user);
  assert.deepEqual(verifySession(token), user);
  const [header, payload, signature] = token.split(".");
  assert.equal(verifySession(`${header}.${payload}.${signature[0] === "a" ? "b" : "a"}${signature.slice(1)}`), null);
  assert.equal(verifySession(jwt.sign(user, process.env.JWT_SECRET!, {
    expiresIn: -1, issuer: "vcc-app", audience: "vcc-admin",
  })), null);
  assert.equal(verifySession(signSession({ ...user, email: "other@example.test" })), null);
});
test("admin pages redirect to login while admin APIs reject unauthenticated requests", () => {
  assert.equal(proxy(request("/admin/programs")).headers.get("location"), "http://localhost:3000/login");
  assert.equal(proxy(request("/api/admin/programs")).status, 401);
  assert.equal(proxy(request("/api/admin/programs", "GET", "forged")).status, 401);
  assert.equal(proxy(request("/admin", "GET", signSession(user))).status, 200);
});
test("legacy mutations need a session and reject cross-origin requests", () => {
  assert.equal(proxy(request("/api/programs", "POST")).status, 401);
  assert.equal(proxy(request("/api/countries/id", "DELETE")).status, 401);
  assert.equal(proxy(request("/api/admin/programs", "POST", signSession(user), "https://other.example")).status, 403);
  assert.equal(proxy(request("/api/admin/programs", "POST", signSession(user), "http://localhost:3000")).status, 200);
});
test("locale redirects preserve public routes and leave API/auth routes alone", () => {
  assert.equal(proxy(request("/")).headers.get("location"), "http://localhost:3000/id");
  assert.equal(proxy(request("/programs?page=2")).headers.get("location"), "http://localhost:3000/id/programs?page=2");
  for (const path of ["/api/programs", "/auth/google", "/login", "/en/programs"]) {
    assert.equal(proxy(request(path)).status, 200, path);
  }
});
test("maintenance keeps admin and login available", () => {
  process.env.SITE_STATUS = "maintenance";
  try {
    assert.equal(proxy(request("/en/programs")).headers.get("location"), "http://localhost:3000/maintenance");
    assert.equal(proxy(request("/admin", "GET", signSession(user))).status, 200);
    assert.equal(proxy(request("/login")).status, 200);
  } finally { process.env.SITE_STATUS = "active"; }
});
