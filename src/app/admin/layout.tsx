"use client";
import React, { useEffect, useState } from "react";
import { useAdmin } from "@/components/admin/AdminContext";
import { useRouter } from "next/navigation";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { Menu, X, Bell, Search, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin } = useAdmin();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Note: In real production, we'd use a server-side redirect or middleware
    // For this mock, we check on the client.
    const auth = sessionStorage.getItem("sankalp_admin_auth");
    if (auth !== "true" && !isAdmin) {
      router.push("/admin/login");
    }
  }, [isAdmin, router]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
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
              className="fixed inset-0 bg-black/50 z-[60] lg:hidden backdrop-blur-sm"
            ></motion.div>
            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              className="fixed left-0 top-0 bottom-0 z-[70] lg:hidden"
            >
              <AdminSidebar />
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="absolute top-6 -right-12 text-white bg-black/20 p-2 rounded-full backdrop-blur"
              >
                <X size={24} />
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:pl-72 min-w-0">
        {/* Header/Navbar */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-[#711113]"
            >
              <Menu size={24} />
            </button>
            <div className="hidden sm:flex items-center bg-gray-50 border border-gray-100 rounded-full px-4 py-2 w-64 lg:w-96">
              <Search size={18} className="text-gray-400" />
              <input 
                type="text" 
                placeholder="Search dashboard..." 
                className="bg-transparent border-none outline-none ml-2 text-sm w-full"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-6">
            <button className="relative text-gray-400 hover:text-[#711113] transition-colors p-2 rounded-xl hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#F5C33C] rounded-full border-2 border-white"></span>
            </button>
            
            <div className="h-10 w-px bg-gray-100 mx-2"></div>
            
            <div className="flex items-center gap-3 group cursor-pointer hover:bg-gray-50 p-2 rounded-xl transition-all">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 group-hover:text-[#711113]">Admin User</p>
                <p className="text-[10px] font-bold text-[#29B1D2] uppercase tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-[#711113] border-2 border-white shadow-sm ring-1 ring-gray-100">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </main>
      </div>
    </div>
  );
}
