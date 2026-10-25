import { redirect } from "next/navigation";
// Legacy path: session credentials are now set exclusively by the server.
export default function AuthSuccessPage() { redirect("/admin"); }
