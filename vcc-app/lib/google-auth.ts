import { OAuth2Client } from "google-auth-library";

export function appUrl() { return new URL(process.env.APP_URL || "http://localhost:3000"); }
export function googleAuthClient() {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.JWT_SECRET) {
    throw new Error("Google OAuth configuration is incomplete");
  }
  return new OAuth2Client(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI || new URL("/auth/google/callback", appUrl()).toString());
}
