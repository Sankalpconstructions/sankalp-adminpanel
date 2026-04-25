"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Search, Check, ArrowLeft, Users, RefreshCw, UserCircle, Layout } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "@/components/admin/ImageUpload";
import toast from "react-hot-toast";
import { deleteFromImageKit } from "@/lib/imagekit-client";

export default function TeamAdminPage() {
  const [members, setMembers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<any>(null);

  const fetchMembers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/team");
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      console.error("Error fetching team members:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembers();
  }, [fetchMembers]);
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    image: "",
    order: 0
  });

  const filteredMembers = members.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenForm = (member: any = null) => {
    if (member) {
      setEditingMember(member);
      setFormData({ ...member });
    } else {
      setEditingMember(null);
      setFormData({ name: "", role: "", image: "", order: members.length });
    }
    setIsFormOpen(true);
  };

  const handleDelete = async (member: any) => {
    if (confirm(`Are you sure you want to remove ${member.name}?`)) {
      try {
        if (member.image) deleteFromImageKit(member.image);
        const res = await fetch(`/api/team/${member._id || member.id}`, { method: "DELETE" });
        if (res.ok) {
          setMembers(members.filter(m => (m._id || m.id) !== (member._id || member.id)));
        }
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image) {
      toast.error("Please upload a profile photo.");
      return;
    }

    try {
      if (editingMember) {
        const id = editingMember._id || editingMember.id;
        const res = await fetch(`/api/team/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updated = await res.json();
          setMembers(members.map(m => (m._id || m.id) === id ? updated : m));
        }
      } else {
        const res = await fetch("/api/team", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const created = await res.json();
          setMembers([...members, created]);
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving member:", error);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isFormOpen ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Our Team</h1>
                <p className="text-gray-500 text-sm">Manage the leadership and experts at Sankalp Constructions.</p>
              </div>
              <button 
                onClick={() => handleOpenForm()}
                className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20"
              >
                <Plus size={18} /> Add Team Member
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/50 shadow-sm flex items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
                  <RefreshCw size={40} className="animate-spin mb-4 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Loading Team...</p>
                </div>
              ) : (
                <>
                  {filteredMembers.map((member) => (
                    <motion.div layout key={member._id || member.id} className="bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col">
                      <div className="aspect-[4/5] relative">
                        <img src={member.image} alt={member.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute bottom-4 left-4 right-4 flex gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                          <button onClick={() => handleOpenForm(member)} className="flex-1 py-2 bg-white text-gray-900 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-[#711113] hover:text-white transition-colors">Edit</button>
                          <button onClick={() => handleDelete(member)} className="p-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </div>
                      <div className="p-4 text-center">
                        <h3 className="text-base font-bold text-gray-900 truncate uppercase tracking-tight">{member.name}</h3>
                        <p className="text-[10px] text-[#29B1D2] font-black uppercase tracking-widest mt-1">{member.role}</p>
                      </div>
                    </motion.div>
                  ))}
                  {filteredMembers.length === 0 && (
                    <div className="col-span-full py-16 text-center text-gray-400">
                      <UserCircle size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="font-bold uppercase tracking-widest text-[10px]">No team members found.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, y: -20 }} className="max-w-2xl mx-auto space-y-6 pb-20">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsFormOpen(false)} className="p-2 bg-white border border-gray-200/50 rounded-xl text-gray-500 hover:text-[#711113] hover:bg-gray-50 shadow-sm"><ArrowLeft size={20} /></button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{editingMember ? 'Edit Profile' : 'New Team Member'}</h1>
                <p className="text-gray-500 text-sm">Fill in the professional details and upload a photo.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200/50 shadow-xl p-8 space-y-8">
              <div className="flex flex-col items-center">
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-4 w-full">Profile Photo *</label>
                <div className="w-full">
                  <ImageUpload 
                    value={formData.image} 
                    onChange={(url) => setFormData({...formData, image: url as string})} 
                  />
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Full Name *</label>
                  <input required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" placeholder="e.g. Rahul Sharma" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Designation / Role *</label>
                  <input required value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" placeholder="e.g. Managing Director" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Display Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" />
                  <p className="text-[9px] text-gray-400 mt-2 uppercase tracking-wider italic">Lower numbers appear first on the website.</p>
                </div>
              </div>

              <button type="submit" className="w-full py-4 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#711113]/20 hover:bg-[#520c0d] transition-all flex items-center justify-center gap-2">
                <Check size={18} /> {editingMember ? 'Update Profile' : 'Add to Team'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
