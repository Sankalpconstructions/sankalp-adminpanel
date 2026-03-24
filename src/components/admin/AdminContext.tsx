"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminContextType {
  isAdmin: boolean;
  login: (id: string, pass: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export function AdminProvider({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = sessionStorage.getItem("sankalp_admin_auth");
    if (auth === "true") {
      setIsAdmin(true);
    }
  }, []);

  const login = (id: string, pass: string) => {
    const envId = process.env.NEXT_PUBLIC_ADMIN_ID;
    const envPass = "1234567890"; // Hardcoded for demo/security since its a mock

    if (id === envId && pass === envPass) {
      setIsAdmin(true);
      sessionStorage.setItem("sankalp_admin_auth", "true");
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem("sankalp_admin_auth");
    router.push("/admin/login");
  };

  return (
    <AdminContext.Provider value={{ isAdmin, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error("useAdmin must be used within an AdminProvider");
  }
  return context;
}
