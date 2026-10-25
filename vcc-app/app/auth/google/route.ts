import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { appUrl, googleAuthClient } from "@/lib/google-auth";

export async function GET() {
  try {
    const client = googleAuthClient();
    const state = randomBytes(32).toString("hex");
    const url = client.generateAuthUrl({ scope: ["openid", "email", "profile"], state });
    const response = NextResponse.redirect(url);
    response.cookies.set("vcc_oauth_state", state, {
      httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "lax", path: "/auth/google", maxAge: 600,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch {
    return NextResponse.redirect(new URL("/login?auth=configuration", appUrl()));
  }
}
