import { NextRequest, NextResponse } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/session";

export async function GET(request: NextRequest) {
  const user = verifySession(request.cookies.get(SESSION_COOKIE)?.value);
  return NextResponse.json({ user }, { status: user ? 200 : 401, headers: { "Cache-Control": "no-store" } });
}
