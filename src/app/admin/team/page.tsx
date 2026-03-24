"use client";
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, X, Check, Users } from "lucide-react";
import { initialTeam } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

type TeamMember = { id: number; name: string; role: string; image: string; bio: string };
const emptyForm = { name: "", role: "", image: "", bio: "" };

export default function TeamAdminPage() {
  const [team, setTeam] = useState<TeamMember[]>(initialTeam);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = team.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item: TeamMember | null = null) => {
    setEditingItem(item);
    setFormData(item ? { ...item } : { ...emptyForm });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Remove this team member?")) setTeam(team.filter(t => t.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setTeam(team.map(t => t.id === editingItem.id ? { ...formData, id: t.id } : t));
    } else {
      setTeam([{ ...formData, id: Math.max(...team.map(t => t.id), 0) + 1 }, ...team]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Our Team</h1>
          <p className="text-gray-500 text-sm">Manage the leadership and team members showcased on the website.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20">
          <Plus size={18} /> Add Member
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search by name or role..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" />
        </div>
        <span className="bg-gray-50 text-gray-400 border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold uppercase">Total: {team.length}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filtered.map(item => (
            <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={item.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="h-52 relative overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <p className="text-white font-bold text-lg leading-tight">{item.name}</p>
                  <p className="text-[#29B1D2] text-xs font-bold uppercase tracking-wider">{item.role}</p>
                </div>
                <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                  <button onClick={() => handleOpenModal(item)} className="p-2 bg-white/90 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit2 size={14} /></button>
                  <button onClick={() => handleDelete(item.id)} className="p-2 bg-white/90 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={14} /></button>
                </div>
              </div>
              <div className="p-5">
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{item.bio}</p>
                <button onClick={() => handleOpenModal(item)} className="mt-4 w-full py-2 bg-gray-50 text-gray-500 text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-[#711113] hover:text-white transition-all">
                  Edit Profile
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative z-10">
              <div className="bg-[#711113] p-6 text-white flex justify-between items-center">
                <h2 className="font-bold uppercase tracking-widest flex items-center gap-2">
                  {editingItem ? <Edit2 size={20} /> : <Plus size={20} />}
                  {editingItem ? "Edit Team Member" : "Add Team Member"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
                    <input required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. Rajesh Kumar" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Job Role / Title</label>
                    <input required value={formData.role} onChange={e => setFormData({ ...formData, role: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. Chief Architect" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Profile Image URL</label>
                  <input value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="https://i.pravatar.cc/300?img=68" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Short Bio</label>
                  <textarea required rows={3} value={formData.bio} onChange={e => setFormData({ ...formData, bio: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] resize-none" placeholder="Brief professional bio..." />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-gray-500 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-[#711113] text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#520c0d] transition-colors shadow-lg shadow-[#711113]/20 flex items-center justify-center gap-2">
                    <Check size={18} /> {editingItem ? "Save Changes" : "Add Member"}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
