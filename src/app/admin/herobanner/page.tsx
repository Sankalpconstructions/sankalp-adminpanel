"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, X, Check, Layers, ToggleLeft, ToggleRight, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "@/components/admin/ImageUpload";
import toast from "react-hot-toast";


type Slide = { id: number; title: string; subtitle: string; description: string; image: string; mobileImage: string; ctaText: string; isActive: boolean; link?: string };
const emptyForm = { title: "Sankalp Hero", subtitle: "Premium Quality", description: "Experience the best living spaces.", image: "", mobileImage: "", ctaText: "Explore Now", isActive: true, link: "" };

export default function HeroBannerAdminPage() {
  const [slides, setSlides] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchSlides = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/herobanners");
      const data = await res.json();
      setSlides(data);
    } catch (error) {
      console.error("Error fetching herobanners:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSlides();
  }, [fetchSlides]);

  const handleOpenModal = (item: Slide | null = null) => {
    setEditingItem(item);
    setFormData(item ? { title: item.title, subtitle: item.subtitle, description: item.description, image: item.image, mobileImage: item.mobileImage || "", ctaText: item.ctaText, isActive: item.isActive, link: item.link || "" } : { ...emptyForm });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this banner slide?")) {
      try {
        const res = await fetch(`/api/herobanners/${id}`, { method: "DELETE" });
        if (res.ok) {
          setSlides(slides.filter(s => (s._id || s.id) !== id));
          toast.success("Banner slide deleted successfully!");
        } else {
          toast.error("Failed to delete banner slide.");
        }
      } catch (error) {
        console.error("Error deleting herobanner:", error);
        toast.error("An error occurred while deleting.");
      }
    }
  };

  const toggleActive = async (id: string) => {
    const slide = slides.find(s => (s._id || s.id) === id);
    if (!slide) return;

    const updatedSlide = { ...slide, isActive: !slide.isActive };
    try {
      const res = await fetch(`/api/herobanners/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedSlide),
      });
      if (res.ok) {
        setSlides(slides.map(s => (s._id || s.id) === id ? updatedSlide : s));
        toast.success("Slide status updated!");
      } else {
        toast.error("Failed to update slide status.");
      }
    } catch (error) {
      console.error("Error toggling active state:", error);
      toast.error("An error occurred while updating status.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image || !formData.mobileImage) {
      toast.error("Please fill in all required fields (including both images).");
      return;
    }
    try {
      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        const res = await fetch(`/api/herobanners/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updated = await res.json();
          setSlides(slides.map(s => (s._id || s.id) === id ? updated : s));
          toast.success("Banner slide updated successfully!");
        } else {
          toast.error("Failed to update banner slide.");
        }
      } else {
        const res = await fetch("/api/herobanners", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const created = await res.json();
          setSlides([...slides, created]);
          toast.success("Banner slide added successfully!");
        } else {
          toast.error("Failed to add banner slide.");
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving herobanner:", error);
      toast.error("An error occurred while saving.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Hero Banner Slides</h1>
          <p className="text-gray-500 text-sm">Manage the homepage carousel slides — title, image, subtitle, and call-to-action.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20">
          <Plus size={18} /> Add Slide
        </button>
      </div>
      <div className="space-y-4">
        <AnimatePresence>
          {isLoading ? (
            <div className="p-20 text-center bg-white rounded-2xl border border-gray-100">
              <RefreshCw size={40} className="animate-spin mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Slides...</p>
            </div>
          ) : (
            <>
              {slides.map((slide, idx) => (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: idx * 0.05 }} key={slide._id || slide.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Image Preview */}
                    <div className="w-full md:w-72 h-48 md:h-auto relative shrink-0 overflow-hidden bg-gray-100 flex">
                      <div className="w-2/3 h-full relative">
                        <img src={slide.image} alt={slide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Desktop</div>
                      </div>
                      <div className="w-1/3 h-full relative border-l border-white/20">
                        <img src={slide.mobileImage || slide.image} alt={slide.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <div className="absolute top-2 left-2 bg-black/60 text-white text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Mobile</div>
                      </div>

                      <div className="absolute top-3 right-3 z-10">
                        <span className="bg-black/40 backdrop-blur text-white text-[10px] px-2 py-1 rounded font-bold">Slide {idx + 1}</span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-4 md:p-6 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="pr-4">
                            <p className="text-[10px] font-bold text-[#29B1D2] uppercase tracking-widest mb-1">{slide.subtitle}</p>
                            <h3 className="text-lg md:text-xl font-bold text-gray-900">{slide.title}</h3>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button onClick={() => toggleActive(slide._id || slide.id)} title={slide.isActive ? "Deactivate" : "Activate"}>
                              {slide.isActive
                                ? <ToggleRight size={28} className="text-green-500" />
                                : <ToggleLeft size={28} className="text-gray-300" />
                              }
                            </button>
                            <span className={`text-[10px] font-bold uppercase ${slide.isActive ? "text-green-500" : "text-gray-400"}`}>
                              {slide.isActive ? "Active" : "Off"}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 md:line-clamp-none">{slide.description}</p>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-2 bg-[#711113]/10 text-[#711113] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            CTA: &ldquo;{slide.ctaText}&rdquo;
                          </span>
                          {slide.link && (
                            <span className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest max-w-[200px] truncate">
                              Link: {slide.link}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex flex-wrap md:flex-nowrap gap-3 mt-5 pt-4 border-t border-gray-50">
                        <button onClick={() => handleOpenModal(slide)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 font-bold text-xs uppercase rounded-xl hover:bg-blue-600 hover:text-white transition-all">
                          <Edit2 size={14} /> Edit Slide
                        </button>
                        <button onClick={() => handleDelete(slide._id || slide.id)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-500 font-bold text-xs uppercase rounded-xl hover:bg-red-500 hover:text-white transition-all">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
              {slides.length === 0 && (
                <div className="p-16 text-center bg-white rounded-2xl border border-gray-100">
                  <Layers size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No banner slides added yet.</p>
                </div>
              )}
            </>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden relative z-10">
              <div className="bg-[#711113] p-6 text-white flex justify-between items-center">
                <h2 className="font-bold uppercase tracking-widest flex items-center gap-2">
                  {editingItem ? <Edit2 size={20} /> : <Plus size={20} />}
                  {editingItem ? "Edit Banner Slide" : "Add Banner Slide"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5 overflow-y-auto chat-scroll max-h-[80vh]">
                {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Main Title</label>
                    <input required value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. Build Your Dream Home" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Subtitle</label>
                    <input value={formData.subtitle} onChange={e => setFormData({ ...formData, subtitle: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. Luxury Living Redefined" />
                  </div>
                </div> 
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Description</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] resize-none" placeholder="Short compelling description for this slide..." />
                </div>*/}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <ImageUpload
                    label="Desktop Image (16:9)"
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url as string })}
                  />
                  <ImageUpload
                    label="Mobile Image (9:16)"
                    value={formData.mobileImage}
                    onChange={(url) => setFormData({ ...formData, mobileImage: url as string })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">CTA Button Text</label>
                    <input value={formData.ctaText} onChange={e => setFormData({ ...formData, ctaText: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. Explore Projects" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Slide Status</label>
                    <button type="button" onClick={() => setFormData({ ...formData, isActive: !formData.isActive })} className={`w-full p-4 rounded-xl font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${formData.isActive ? "bg-green-50 text-green-600 border border-green-100" : "bg-gray-50 text-gray-400 border border-gray-100"}`}>
                      {formData.isActive ? <><ToggleRight size={18} /> Active (Visible)</> : <><ToggleLeft size={18} /> Inactive (Hidden)</>}
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Redirect Link / URL (Optional)</label>
                    <input value={formData.link} onChange={e => setFormData({ ...formData, link: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. /projects or https://..." />
                  </div>
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-gray-500 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-[#711113] text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#520c0d] transition-colors shadow-lg shadow-[#711113]/20 flex items-center justify-center gap-2">
                    <Check size={18} /> {editingItem ? "Save Changes" : "Add Slide"}
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
