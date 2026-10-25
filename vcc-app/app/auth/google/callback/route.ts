import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { appUrl, googleAuthClient } from "@/lib/google-auth";
import { allowedAdmin, SESSION_COOKIE, sessionCookieOptions, signSession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const fail = () => NextResponse.redirect(new URL("/login?auth=gagal", appUrl()));
  let response: NextResponse;
  try {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const savedState = request.cookies.get("vcc_oauth_state")?.value;
    if (!code || !state || !savedState || Buffer.byteLength(state) !== Buffer.byteLength(savedState) ||
        !timingSafeEqual(Buffer.from(state), Buffer.from(savedState))) {
      response = fail();
    } else {
      const client = googleAuthClient();
      const { tokens } = await client.getToken(code);
      if (!tokens.id_token) throw new Error("Missing ID token");
      const ticket = await client.verifyIdToken({ idToken: tokens.id_token, audience: process.env.GOOGLE_CLIENT_ID });
      const user = ticket.getPayload();
      if (!user?.email || !user.email_verified || !allowedAdmin(user.email)) {
        response = fail();
      } else {
        const token = signSession({ id: user.sub, email: user.email, name: user.name || "", picture: user.picture || "" });
        response = NextResponse.redirect(new URL("/admin", appUrl()));
        response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
      }
    }
  } catch { response = fail(); }
  response.cookies.set("vcc_oauth_state", "", { path: "/auth/google", maxAge: 0 });
  response.headers.set("Cache-Control", "no-store");
  return response;
}
