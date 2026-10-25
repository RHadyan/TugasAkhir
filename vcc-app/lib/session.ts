import jwt from "jsonwebtoken";

export const SESSION_COOKIE = "vcc_session";
export const SESSION_MAX_AGE = 60 * 60 * 24;
export interface AdminSession { id: string; email: string; name: string; picture: string; }

export function allowedAdmin(email: string) {
  return (process.env.ADMIN_EMAILS || "").split(",").map((s) => s.trim().toLowerCase())
    .filter(Boolean).includes(email.toLowerCase());
}
export function verifySession(token?: string): AdminSession | null {
  if (!token || !process.env.JWT_SECRET) return null;
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET, {
      algorithms: ["HS256"], issuer: "vcc-app", audience: "vcc-admin",
    });
    if (typeof payload === "string" || typeof payload.email !== "string" ||
        typeof payload.id !== "string" || !allowedAdmin(payload.email)) return null;
    return { id: payload.id, email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
      picture: typeof payload.picture === "string" ? payload.picture : "" };
  } catch { return null; }
}
export function signSession(user: AdminSession) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is required");
  return jwt.sign(user, process.env.JWT_SECRET, {
    algorithm: "HS256", expiresIn: SESSION_MAX_AGE, issuer: "vcc-app", audience: "vcc-admin",
  });
}
export const sessionCookieOptions = {
  httpOnly: true, secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const, path: "/", maxAge: SESSION_MAX_AGE,
};
