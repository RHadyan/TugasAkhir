"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import type { AdminSession } from "./session";

interface AuthContextType {
  user: AdminSession | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}
const AuthContext = createContext<AuthContextType | undefined>(undefined);
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/auth/session", { cache: "no-store", signal: controller.signal })
      .then((res) => res.json()).then((data) => setUser(data.user || null))
      .catch(() => {}).finally(() => setLoading(false));
    return () => controller.abort();
  }, []);
  const login = () => { window.location.href = "/auth/google"; };
  const logout = async () => {
    const result = await Swal.fire({ title: "Keluar dari akun?", icon: "question", showCancelButton: true,
      confirmButtonText: "Keluar", cancelButtonText: "Batal" });
    if (!result.isConfirmed) return;
    const response = await fetch("/api/auth/logout", { method: "POST" });
    if (!response.ok) { await Swal.fire("Gagal keluar", "Silakan coba kembali.", "error"); return; }
    setUser(null);
    router.replace("/login");
    router.refresh();
  };
  return <AuthContext.Provider value={{ user, loading, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
