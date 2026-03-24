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
  Layers
} from "lucide-react";
import { useAdmin } from "./AdminContext";

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard" },
  { name: "Projects", icon: Building2, href: "/admin/projects" },
  { name: "Blog Posts", icon: Newspaper, href: "/admin/blog" },
  { name: "Amenities", icon: Sparkles, href: "/admin/amenities" },
  { name: "Floor Plans", icon: Map, href: "/admin/floorplans" },
  { name: "Contact Hub", icon: Mail, href: "/admin/contacts" },
];

const contentItems = [
  { name: "Hero Banner", icon: Layers, href: "/admin/herobanner" },
  { name: "Testimonials", icon: Quote, href: "/admin/testimonials" },
  { name: "Gallery", icon: ImageIcon, href: "/admin/gallery" },
  { name: "Team", icon: Users, href: "/admin/team" },
  { name: "FAQ", icon: HelpCircle, href: "/admin/faq" },
];

const accountItems = [
  { name: "Admin Profile", icon: UserCircle, href: "/admin/profile" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logout } = useAdmin();

  const NavItem = ({ item }: { item: { name: string; icon: React.ElementType; href: string } }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={`flex items-center justify-between p-3.5 rounded-xl transition-all group ${
          isActive
            ? "bg-[#711113]/5 text-[#711113] shadow-sm"
            : "text-gray-500 hover:bg-gray-50 hover:text-[#29B1D2]"
        }`}
      >
        <div className="flex items-center gap-3">
          <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "text-[#711113]" : "group-hover:text-[#29B1D2]"} />
          <span className={`text-sm tracking-wide font-semibold ${isActive ? "font-bold" : ""}`}>{item.name}</span>
        </div>
        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#711113]"></div>}
        {!isActive && <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />}
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-64 md:w-72 bg-white border-r border-gray-100 flex flex-col z-50 overflow-y-auto">
      {/* Branding */}
      <div className="p-6 border-b border-gray-50 flex items-center gap-3 shrink-0">
        <div className="w-10 h-10 bg-[#711113] rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
          S
        </div>
        <div>
          <h2 className="text-[#711113] font-bold text-lg uppercase tracking-tight">Sankalp</h2>
          <p className="text-[10px] text-[#29B1D2] font-bold uppercase tracking-widest leading-none">Management</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-4">Main Navigation</p>
        {menuItems.map(item => <NavItem key={item.href} item={item} />)}

        <div className="pt-4 pb-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-4">Website Content</p>
          {contentItems.map(item => <NavItem key={item.href} item={item} />)}
        </div>

        <div className="pt-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-3 ml-4">Account</p>
          {accountItems.map(item => <NavItem key={item.href} item={item} />)}
        </div>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-gray-50 shrink-0">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 p-4 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
        >
          <LogOut size={20} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
