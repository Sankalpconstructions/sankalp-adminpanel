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
  ExternalLink
} from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { name: "Total Projects", value: "12", icon: Building2, color: "bg-blue-500", trend: "+2 this month" },
  { name: "Blog Posts", value: "24", icon: Newspaper, color: "bg-[#711113]", trend: "+5 this month" },
  { name: "New Leads", value: "8", icon: Mail, color: "bg-yellow-500", trend: "3 urgent" },
  { name: "Total Site Visitors", value: "1.2k", icon: Users, color: "bg-[#29B1D2]", trend: "+12% vs last week" },
];

const recentRequests = [
  { id: 1, name: "Rahul Sharma", project: "Sankalp Heights", time: "2 hours ago", status: "New" },
  { id: 2, name: "Sneha Patil", project: "Sankalp Oasis", time: "5 hours ago", status: "Follow-up" },
  { id: 3, name: "Amit Verma", project: "Sankalp Greens", time: "Yesterday", status: "Contacted" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 text-sm">Welcome back, Admin. Here&apos;s what&apos;s happening with Sankalp Constructions.</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-2">
             Generate Report
           </button>
           <button className="px-4 py-2 bg-[#711113] text-white rounded-lg text-sm font-bold hover:bg-[#520c0d] flex items-center gap-2 shadow-lg shadow-[#711113]/20">
             View Main Website <ExternalLink size={16} />
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={stat.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color} text-white shadow-lg`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-green-500 text-xs font-bold bg-green-50 px-2 py-1 rounded-full">
                <TrendingUp size={12} />
                <span>{stat.trend.split(' ')[0]}</span>
              </div>
            </div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{stat.name}</h3>
            <p className="text-3xl font-extrabold text-gray-900">{stat.value}</p>
            <p className="text-[10px] text-gray-400 mt-2 italic">{stat.trend}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Recent Lead Requests Table */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-gray-900 uppercase tracking-wider text-sm flex items-center gap-2">
              <Mail size={18} className="text-[#711113]" /> Recent Inquiries
            </h2>
            <button className="text-[#29B1D2] text-xs font-bold uppercase hover:underline">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left bg-white">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold">
                  <th className="px-6 py-4">S.No</th>
                  <th className="px-6 py-4">Client Name</th>
                  <th className="px-6 py-4">Interested Project</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentRequests.map((req, idx) => (
                  <tr key={req.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="px-6 py-4 text-sm font-bold text-gray-600">{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#29B1D2]/10 text-[#29B1D2] flex items-center justify-center text-xs font-bold">
                          {req.name.charAt(0)}
                        </div>
                        <span className="text-sm font-bold text-gray-900">{req.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-600 group-hover:text-[#711113] transition-colors">{req.project}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-full ${
                        req.status === 'New' ? 'bg-yellow-50 text-yellow-600 border border-yellow-100' :
                        req.status === 'Follow-up' ? 'bg-blue-50 text-blue-600 border border-blue-100' :
                        'bg-green-50 text-green-600 border border-green-100'
                      }`}>
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                        <ArrowUpRight size={18} className="text-gray-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Dashboard Timeline / Quick View */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 uppercase tracking-wider text-sm mb-6 flex items-center gap-2 border-b border-gray-50 pb-4">
            <Clock size={18} className="text-[#29B1D2]" /> Platform Updates
          </h2>
          <div className="space-y-6">
            {[
              { time: "10:30 AM", msg: "New property 'Sankalp Aura' added to Projects.", type: "Project" },
              { time: "Yesterday", msg: "Blog post 'Market Trends 2025' published.", type: "Blog" },
              { time: "2 days ago", msg: "Updated amenities icon for Yoga Zone.", type: "Amenity" }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 relative">
                {idx !== 2 && <div className="absolute left-2.5 top-8 bottom-[-24px] w-px bg-gray-100"></div>}
                <div className="w-5 h-5 rounded-full border-2 border-[#711113] bg-white z-10 shrink-0 mt-1"></div>
                <div>
                  <p className="text-xs font-bold text-gray-400 mb-1">{item.time}</p>
                  <p className="text-sm font-semibold text-gray-800 leading-snug">{item.msg}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 bg-gray-50 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#711113] hover:text-white transition-all">
            View All Activity
          </button>
        </div>
      </div>
    </div>
  );
}
