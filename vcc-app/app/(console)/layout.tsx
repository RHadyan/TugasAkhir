import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./admin/globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth-context";

const manrope = Manrope({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "VCC Admin - Content Management System",
  description: "Admin dashboard for managing international programs and countries",
  icons: {
    icon: "/images/logo/vcc-logo-only.jpg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${manrope.className}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
