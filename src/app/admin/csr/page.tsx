"use client";
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, Check, ArrowLeft, HeartHandshake } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CSRAdminPage() {
  const [entries, setEntries] = useState([
    { id: "1", title: "Education for All", content: "We built a school in...", status: "Published" },
    { id: "2", title: "Green Energy Initiative", content: "Solar panels installed...", status: "Published" },
  ]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "Published"
  });

  const filteredEntries = entries.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenForm = (entry: any = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({ ...entry });
    } else {
      setEditingEntry(null);
      setFormData({ title: "", content: "", status: "Draft" });
    }
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this CSR initiative?")) {
      setEntries(entries.filter(e => e.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEntry) {
      setEntries(entries.map(e => e.id === editingEntry.id ? { ...formData, id: e.id } : e));
    } else {
      setEntries([{ ...formData, id: Math.random().toString(36).substr(2, 9) }, ...entries]);
    }
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isFormOpen ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">CSR Initiatives</h1>
                <p className="text-gray-500 text-sm">Manage Corporate Social Responsibility programs.</p>
              </div>
              <button 
                onClick={() => handleOpenForm()}
                className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20"
              >
                <Plus size={18} /> Add Initiative
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/50 shadow-sm flex items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search initiatives..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEntries.map((entry) => (
                <motion.div layout key={entry.id} className="bg-white rounded-2xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-[#29B1D2]/10 text-[#29B1D2] rounded-xl"><HeartHandshake size={20} /></div>
                    <span className="bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded">
                      {entry.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 truncate">{entry.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-6">{entry.content}</p>
                  
                  <div className="flex gap-2">
                    <button onClick={() => handleOpenForm(entry)} className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-[10px] tracking-widest uppercase font-bold hover:bg-[#29B1D2] hover:text-white transition-colors">Edit</button>
                    <button onClick={() => handleDelete(entry.id)} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-xs hover:bg-rose-600 hover:text-white transition-colors"><Trash2 size={16}/></button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsFormOpen(false)} className="p-2 bg-white border border-gray-200/50 rounded-xl text-gray-500 hover:text-[#711113] hover:bg-gray-50 shadow-sm"><ArrowLeft size={20} /></button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{editingEntry ? 'Edit Initiative' : 'Create Initiative'}</h1>
                  <p className="text-gray-500 text-sm">Write comprehensive details for the CSR campaign.</p>
                </div>
              </div>
              <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2.5 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#711113]/20 hover:bg-[#520c0d]">
                <Check size={16} /> Save Changes
              </button>
            </div>

            <section className="bg-white rounded-2xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 max-w-4xl">
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Initiative Title *</label>
                  <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. Tree Plantation Drive" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Content Editor *</label>
                  <textarea required rows={10} value={formData.content} onChange={(e) => setFormData({...formData, content: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] resize-none" placeholder="Write paragraphs here..."></textarea>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]">
                    <option value="Draft">Draft</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
