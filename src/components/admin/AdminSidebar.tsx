"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Newspaper,
  Sparkles,
  Map,
  Mail,
  UserCircle,
  LogOut,
  ChevronRight,
  Quote,
  Users,
  HelpCircle,
  ImageIcon,
  Layers,
  Info,
  HeartHandshake,
  Layout,
  Star
} from "lucide-react";
import { useAdmin } from "./AdminContext";
import { motion } from "framer-motion";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "About", icon: Info, href: "/admin/about" },
  { name: "Projects", icon: Building2, href: "/admin/projects" },
  { name: "CSR", icon: HeartHandshake, href: "/admin/csr" },
  { name: "Blog Posts", icon: Newspaper, href: "/admin/blog" },
  { name: "Contact Hub", icon: Mail, href: "/admin/contacts" },
];

const contentItems = [
  { name: "Hero Banner", icon: Layers, href: "/admin/herobanner" },
  { name: "Testimonials", icon: Quote, href: "/admin/testimonials" },
  { name: "Gallery", icon: ImageIcon, href: "/admin/gallery" },
  { name: "Team", icon: Users, href: "/admin/team" },
  { name: "FAQ", icon: HelpCircle, href: "/admin/faq" },
  { name: "Floor Plans", icon: Layout, href: "/admin/floorplans" },
  { name: "Amenities", icon: Star, href: "/admin/amenities" },
];

const accountItems = [
  { name: "Admin Profile", icon: UserCircle, href: "/admin/profile" },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdmin();

  const sidebarVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 }
  };

  const NavItem = ({ item }: { item: { name: string; icon: React.ElementType; href: string } }) => {
    const isActive = pathname === item.href;
    return (
      <motion.div variants={itemVariants}>
        <Link
          href={item.href}
          className={`flex items-center justify-between p-2.5 rounded-xl transition-all group relative overflow-hidden ${
            isActive
              ? "bg-[#711113] text-white shadow-lg shadow-[#711113]/20"
              : "text-gray-500 hover:bg-gray-50 hover:text-[#711113]"
          }`}
        >
          {isActive && (
            <motion.div 
              layoutId="activeNav"
              className="absolute inset-0 bg-[#711113] z-0"
            />
          )}
          <div className="flex items-center gap-3 relative z-10">
            <item.icon size={16} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-white" : "group-hover:text-[#711113] transition-colors"} />
            <span className={`text-[12px] tracking-wide font-black ${isActive ? "" : "font-semibold"}`}>{item.name}</span>
          </div>
          {isActive && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-1 h-1 rounded-full bg-white relative z-10 shadow-sm"
            ></motion.div>
          )}
          {!isActive && <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all relative z-10" />}
        </Link>
      </motion.div>
    );
  };

  return (
    <aside className="w-full h-full bg-white border-r border-gray-200/50 shadow-sm flex flex-col z-50 overflow-y-auto overflow-x-hidden">
      {/* Branding */}
      <div className="p-6 pb-8 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1.5 shadow-md shadow-gray-200/50 border border-gray-100 transition-transform hover:scale-105 shrink-0">
          <img src="/sankal.png" alt="Sankalp" className="w-full h-full object-contain" />
        </div>
        <div>
          <h2 className="text-[#711113] font-black text-lg uppercase tracking-tighter leading-none mb-1">SANKALP</h2>
          <p className="text-[9px] text-[#29B1D2] font-black uppercase tracking-[0.3em] leading-none">Console</p>
        </div>
      </div>

      {/* Navigation */}
      <motion.nav 
        variants={sidebarVariants}
        initial="hidden"
        animate="visible"
        className="flex-1 px-3 space-y-1"
      >
        <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-3 ml-3">Main Interface</p>
        {menuItems.map(item => <NavItem key={item.href} item={item} />)}

        <div className="pt-6 pb-2">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-3 ml-3">Web Content</p>
          {contentItems.map(item => <NavItem key={item.href} item={item} />)}
        </div>

        <div className="pt-2">
          <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.3em] mb-3 ml-3">User Settings</p>
          {accountItems.map(item => <NavItem key={item.href} item={item} />)}
        </div>
      </motion.nav>

      {/* Logout */}
      <div className="p-5 mt-6 border-t border-gray-50 shrink-0">
        <motion.button
          whileHover={{ x: 5 }}
          onClick={logout}
          className="w-full flex items-center gap-3 p-3.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all font-black text-[11px] uppercase tracking-widest border border-transparent hover:border-rose-100"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </motion.button>
      </div>
    </aside>
  );
}

export default React.memo(AdminSidebar);
