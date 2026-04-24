import type { Metadata } from "next";
import "./globals.css";
import { AdminProvider } from "@/components/admin/AdminContext";

export const metadata: Metadata = {
  title: "Sankalp Admin Console",
  description: "Secure Admin Management System for Sankalp Constructions.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full flex flex-col bg-gray-50 text-gray-900 font-sans">
        <AdminProvider>{children}</AdminProvider>
      </body>
    </html>
  );
}
