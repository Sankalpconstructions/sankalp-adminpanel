"use client";
import React from "react";
import { 
  Building2, 
  Newspaper, 
  Mail, 
  ArrowUpRight, 
  Users, 
  TrendingUp,
  Clock,
  ExternalLink,
  Plus,
  ArrowRight,
  TrendingDown
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { name: "Total Projects", value: "12", icon: Building2, color: "text-blue-600", bg: "bg-blue-50", trend: "+2 this month", trendType: "up" },
  { name: "Blog Posts", value: "24", icon: Newspaper, color: "text-rose-600", bg: "bg-rose-50", trend: "+5 this month", trendType: "up" },
  { name: "New Leads", value: "08", icon: Mail, color: "text-amber-600", bg: "bg-amber-50", trend: "3 urgent", trendType: "neutral" },
  { name: "Total Visitors", value: "1.2k", icon: Users, color: "text-emerald-600", bg: "bg-emerald-50", trend: "+12% vs last week", trendType: "up" },
];

const recentRequests = [
  { id: 1, name: "Rahul Sharma", project: "Sankalp Heights", time: "2 hours ago", status: "New", email: "rahul@example.com" },
  { id: 2, name: "Sneha Patil", project: "Sankalp Oasis", time: "5 hours ago", status: "Follow-up", email: "sneha@example.com" },
  { id: 3, name: "Amit Verma", project: "Sankalp Greens", time: "Yesterday", status: "Contacted", email: "amit@example.com" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function DashboardPage() {
  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8 pb-10"
    >
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-5">
        <motion.div variants={itemVariants}>
          <span className="text-[9px] font-bold text-[#29B1D2] uppercase tracking-[0.3em] mb-1.5 block">Premium Admin Console</span>
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">
            Dashboard <span className="text-[#711113]">Hub</span>
          </h1>
          <p className="text-gray-500 mt-1.5 text-xs md:text-sm max-w-lg">
            Welcome back, Admin. Manage your real estate empire with Sankalp's unified dashboard.
          </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-2.5">
           <button className="flex-1 md:flex-none px-4 py-2 bg-white border border-gray-200 rounded-lg text-[11px] font-bold text-gray-700 hover:bg-gray-50 hover:border-[#29B1D2] transition-all flex items-center justify-center gap-2 shadow-sm">
             <Plus size={16} /> New Project
           </button>
           <button className="flex-1 md:flex-none px-4 py-2 bg-[#711113] text-white rounded-lg text-[11px] font-bold hover:bg-[#5a0d0e] transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#711113]/20">
             Live Site <ExternalLink size={14} />
           </button>
        </motion.div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            variants={itemVariants}
            whileHover={{ y: -4, scale: 1.01 }}
            className="bg-white p-5 rounded-2xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all duration-300 relative overflow-hidden group"
          >
            {/* Decorative background element */}
            <div className={`absolute -right-4 -top-4 w-20 h-20 rounded-full ${stat.bg} opacity-20 group-hover:scale-125 transition-transform duration-500`}></div>
            
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-105 transition-transform duration-300`}>
                <stat.icon size={18} strokeWidth={2.5} />
              </div>
              <div className={`flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                stat.trendType === 'up' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' : 
                stat.trendType === 'down' ? 'text-rose-600 bg-rose-50 border-rose-100' :
                'text-amber-600 bg-amber-50 border-amber-100'
              }`}>
                {stat.trendType === 'up' ? <TrendingUp size={10} /> : stat.trendType === 'down' ? <TrendingDown size={10} /> : null}
                <span>{stat.trend.split(' ')[0]}</span>
              </div>
            </div>
            
            <div className="relative z-10">
              <h3 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-0.5">{stat.name}</h3>
              <p className="text-2xl font-black text-gray-900 group-hover:text-[#711113] transition-colors">{stat.value}</p>
              <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-gray-50">
                <p className="text-[9px] text-gray-400 font-medium italic">{stat.trend}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Inquiries Section */}
        <motion.div 
          variants={itemVariants}
          className="xl:col-span-2 bg-white rounded-2xl border border-gray-200/50 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.06)] transition-all duration-500"
        >
          <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
            <div>
              <h2 className="font-black text-gray-900 text-base flex items-center gap-2">
                Recent <span className="text-[#711113]">Inquiries</span>
              </h2>
              <p className="text-[10px] text-gray-400 mt-0.5">Real-time leads from the website.</p>
            </div>
            <button className="group text-[#29B1D2] text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5 hover:gap-2 transition-all">
              View All Hub <ArrowRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[9px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-6 py-4">Client Profile</th>
                  <th className="px-6 py-4 hidden sm:table-cell">Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#29B1D2]/20 to-[#29B1D2]/5 text-[#29B1D2] flex items-center justify-center text-xs font-black border border-[#29B1D2]/10 transition-transform group-hover:rotate-6">
                            {req.name.charAt(0)}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-900 mb-0.5">{req.name}</p>
                          <p className="text-[9px] text-gray-400 font-medium">{req.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <div className="w-1 h-1 rounded-full bg-[#711113]"></div>
                        <span className="text-[11px] font-bold text-gray-600 transition-colors group-hover:text-[#711113]">{req.project}</span>
                      </div>
                      <p className="text-[8px] text-gray-400 mt-0.5 uppercase font-bold tracking-tight">{req.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                        req.status === 'New' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                        req.status === 'Follow-up' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-emerald-50 text-emerald-600 border border-emerald-100'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-100 text-gray-400 hover:text-[#711113] hover:border-[#711113]/20 hover:shadow-md transition-all">
                        <ArrowUpRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="p-5 md:p-6 bg-gray-50/50 border-t border-gray-100 mt-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-[10px] text-gray-400 font-medium">Showing 3 of 158 new inquiries.</p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-[10px] font-bold text-gray-400 hover:text-gray-900 transition-colors">Previous</button>
                <button className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-[10px] font-bold text-gray-900 shadow-sm">Next</button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Activity Timeline Section */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-2xl border border-gray-200/50 shadow-[0_10px_40px_-5px_rgba(0,0,0,0.04)] p-5 md:p-6 hover:shadow-[0_20px_60px_-10px_rgba(0,0,0,0.06)] transition-all duration-500"
        >
          <div className="mb-6">
            <h2 className="font-black text-gray-900 text-base flex items-center gap-2">
              Updates <span className="text-[#29B1D2]">Feed</span>
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Platform activity log.</p>
          </div>

          <div className="space-y-6 relative before:absolute before:left-[9px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
            {[
              { time: "10:30 AM", msg: "New property 'Sankalp Aura' added to Projects.", type: "Project", color: "bg-[#711113]" },
              { time: "Yesterday", msg: "Blog post 'Market Trends 2025' published.", type: "Blog", color: "bg-[#29B1D2]" },
              { time: "2 days ago", msg: "Updated amenities icon for Yoga Zone.", type: "Amenity", color: "bg-amber-400" },
              { time: "4 days ago", msg: "New team member 'Karthik Raja' joined.", type: "Team", color: "bg-emerald-400" }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 relative group">
                <div className={`w-5 h-5 rounded-full ${item.color} border-4 border-white shadow-sm z-10 shrink-0 mt-0.5 transition-transform group-hover:scale-110`}></div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{item.time}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-gray-200"></span>
                    <span className="text-[8px] font-black text-[#29B1D2] uppercase">{item.type}</span>
                  </div>
                  <p className="text-xs font-bold text-gray-700 leading-relaxed group-hover:text-gray-900 transition-colors">
                    {item.msg}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-8 py-3 bg-gray-50 text-gray-500 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] hover:bg-[#711113] hover:text-white hover:shadow-lg hover:shadow-[#711113]/20 transition-all duration-300">
            Explore Full Log
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
