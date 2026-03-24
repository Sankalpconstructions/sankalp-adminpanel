"use client";
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, X, Check, ImageIcon, Tag } from "lucide-react";
import { initialGallery } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

type GalleryItem = { id: number; title: string; category: string; image: string; project: string };
const categories = ["Interior", "Exterior", "Amenities", "Construction", "Events"];
const emptyForm = { title: "", category: "Interior", image: "", project: "" };

export default function GalleryAdminPage() {
  const [gallery, setGallery] = useState<GalleryItem[]>(initialGallery);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const filtered = gallery.filter(g => {
    const matchesSearch = g.title.toLowerCase().includes(searchTerm.toLowerCase()) || g.project.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === "All" || g.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleOpenModal = (item: GalleryItem | null = null) => {
    setEditingItem(item);
    setFormData(item ? { title: item.title, category: item.category, image: item.image, project: item.project } : { ...emptyForm });
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this gallery image?")) setGallery(gallery.filter(g => g.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      setGallery(gallery.map(g => g.id === editingItem.id ? { ...formData, id: g.id } : g));
    } else {
      setGallery([{ ...formData, id: Math.max(...gallery.map(g => g.id), 0) + 1 }, ...gallery]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Gallery Manager</h1>
          <p className="text-gray-500 text-sm">Manage photos and visual content showcased across the website.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20">
          <Plus size={18} /> Upload Photo
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="Search by title or project..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" />
          </div>
          <span className="bg-gray-50 text-gray-400 border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold uppercase whitespace-nowrap">Total: {gallery.length}</span>
        </div>
        <div className="flex gap-2 flex-wrap">
          {["All", ...categories].map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${activeCategory === cat ? "bg-[#711113] text-white shadow-md" : "bg-gray-50 text-gray-400 hover:bg-gray-100 border border-gray-100"}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map(item => (
            <motion.div layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} key={item.id}
              className="group relative rounded-2xl overflow-hidden aspect-square border border-gray-100 shadow-sm hover:shadow-md transition-all bg-gray-100"
            >
              <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <p className="text-white text-xs font-bold line-clamp-1">{item.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Tag size={10} className="text-[#29B1D2]" />
                  <span className="text-[#29B1D2] text-[10px] font-bold uppercase">{item.category}</span>
                </div>
              </div>
              <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => handleOpenModal(item)} className="p-1.5 bg-white/90 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all"><Edit2 size={13} /></button>
                <button onClick={() => handleDelete(item.id)} className="p-1.5 bg-white/90 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all"><Trash2 size={13} /></button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {filtered.length === 0 && (
        <div className="p-16 text-center bg-white rounded-2xl border border-gray-100">
          <ImageIcon size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No images found for this filter.</p>
        </div>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative z-10">
              <div className="bg-[#711113] p-6 text-white flex justify-between items-center">
                <h2 className="font-bold uppercase tracking-widest flex items-center gap-2">
                  {editingItem ? <Edit2 size={20} /> : <Plus size={20} />}
                  {editingItem ? "Edit Gallery Photo" : "Add Gallery Photo"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Photo Title</label>
                    <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. Lobby Interior" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Category</label>
                    <select value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm">
                      {categories.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Image URL</label>
                  <input required value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="https://images.unsplash.com/..." />
                  {formData.image && <img src={formData.image} alt="preview" className="w-full h-32 object-cover rounded-xl mt-2" />}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Associated Project</label>
                  <input value={formData.project} onChange={e => setFormData({ ...formData, project: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. Sankalp Heights" />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-gray-500 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-[#711113] text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#520c0d] transition-colors shadow-lg shadow-[#711113]/20 flex items-center justify-center gap-2">
                    <Check size={18} /> {editingItem ? "Save Changes" : "Add Photo"}
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
