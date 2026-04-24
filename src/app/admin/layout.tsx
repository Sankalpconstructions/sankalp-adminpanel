"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu, X, Bell, Search, User, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  // Don't render the admin shell for auth pages
  const isAuthPage = ["/admin/login", "/admin/register", "/admin/forgot-password"].includes(pathname);
  if (isAuthPage) {
    return <>{children}</>;
  }

  return (
    <div className="h-screen bg-[#FDFDFD] flex overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 shrink-0 border-r border-gray-100 bg-white h-full overflow-y-auto">
        <AdminSidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 z-[60] lg:hidden backdrop-blur-md"
            ></motion.div>
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-[70] lg:hidden w-72 h-full overflow-y-auto bg-white"
            >
              <AdminSidebar />
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-5 -right-12 text-white bg-black/20 hover:bg-black/40 p-2.5 rounded-full backdrop-blur-xl transition-all"
              >
                <X size={22} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Header/Navbar */}
        <header 
          className={`h-20 shrink-0 flex items-center justify-between px-6 z-40 transition-all duration-300 ${
            scrolled ? "bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm" : "bg-transparent"
          }`}
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#711113] hover:bg-gray-100 rounded-xl transition-all"
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex items-center bg-gray-100/50 border border-gray-100/80 rounded-2xl px-4 py-2 w-64 lg:w-96 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#29B1D2]/20 transition-all group">
              <Search size={18} className="text-gray-400 group-focus-within:text-[#29B1D2]" />
              <input
                type="text"
                placeholder="Find anything..."
                className="bg-transparent border-none outline-none ml-2 text-sm w-full placeholder:text-gray-400"
              />
            </div>
            
            {/* Mobile Logo (only shown when sidebar is closed) */}
            <div className="lg:hidden flex items-center gap-2">
               <div className="w-8 h-8 bg-[#711113] rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
               <span className="font-black text-gray-900 text-xs uppercase tracking-widest sm:block hidden">Sankalp</span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button className="hidden sm:flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-[#711113] transition-colors rounded-xl hover:bg-gray-50">
              <Globe size={18} />
              <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Main Site</span>
            </button>

            <button className="relative text-gray-400 hover:text-[#711113] transition-colors p-2.5 rounded-xl hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#F5C33C] rounded-full border-2 border-white"></span>
            </button>

            <div className="h-8 w-px bg-gray-100 hidden sm:block mx-1"></div>

            <div className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 p-1.5 pr-3 rounded-2xl transition-all">
              <div className="w-10 h-10 bg-gradient-to-tr from-gray-100 to-gray-50 rounded-2xl flex items-center justify-center text-[#711113] border-2 border-white shadow-sm ring-1 ring-gray-100 group-hover:scale-105 transition-transform">
                <User size={20} />
              </div>
              <div className="text-left hidden sm:block">
                <p className="text-xs font-black text-gray-900 group-hover:text-[#711113]">Admin User</p>
                <p className="text-[9px] font-black text-[#29B1D2] uppercase tracking-[0.2em]">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main 
          onScroll={(e) => {
            const isScrolled = e.currentTarget.scrollTop > 20;
            if (isScrolled !== scrolled) setScrolled(isScrolled);
          }}
          className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 lg:p-10 transition-all scroll-smooth"
        >
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
