"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Search, Check, ArrowLeft, HeartHandshake, RefreshCw, Calendar, Clock, Image as ImageIcon, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "@/components/admin/ImageUpload";
import toast from "react-hot-toast";
import { deleteFromImageKit } from "@/lib/imagekit-client";

export default function CSRAdminPage() {
  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  const fetchEntries = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/csr");
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error("Error fetching CSR entries:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);
  
  const [formData, setFormData] = useState({
    title: "",
    date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
    time: "10:00 AM - 5:00 PM",
    shortDesc: "",
    longDesc: "",
    images: [] as string[]
  });

  const filteredEntries = entries.filter(e => e.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenForm = (entry: any = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({ 
        ...entry,
        images: entry.images || []
      });
    } else {
      setEditingEntry(null);
      setFormData({ 
        title: "", 
        date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
        time: "10:00 AM - 5:00 PM",
        shortDesc: "",
        longDesc: "",
        images: []
      });
    }
    setIsFormOpen(true);
  };

  const handleAddImage = (url: string) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, url]
    }));
  };

  const removeImage = (index: number) => {
    const urlToRemove = formData.images[index];
    if (urlToRemove) {
      deleteFromImageKit(urlToRemove);
    }
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this event highlight?")) {
      try {
        const res = await fetch(`/api/csr/${id}`, { method: "DELETE" });
        if (res.ok) {
          setEntries(entries.filter(e => (e._id || e.id) !== id));
          toast.success("Event deleted successfully");
        } else {
          toast.error("Failed to delete event");
        }
      } catch (error) {
        console.error("Error deleting CSR entry:", error);
        toast.error("Failed to delete event");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.images.length === 0) {
      toast.error("Please upload at least one image for the event highlight.");
      return;
    }

    try {
      if (editingEntry) {
        const id = editingEntry._id || editingEntry.id;
        const res = await fetch(`/api/csr/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updated = await res.json();
          setEntries(entries.map(e => (e._id || e.id) === id ? updated : e));
          toast.success("Event updated successfully!");
        }
      } else {
        const res = await fetch("/api/csr", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const created = await res.json();
          setEntries([created, ...entries]);
          toast.success("Event added successfully!");
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving CSR entry:", error);
      toast.error("Failed to save event");
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isFormOpen ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Event Highlights (CSR)</h1>
                <p className="text-gray-500 text-sm">Manage company events, activities, and social initiatives.</p>
              </div>
              <button 
                onClick={() => handleOpenForm()}
                className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20"
              >
                <Plus size={18} /> New Event Highlight
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/50 shadow-sm flex items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search events..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 flex flex-col items-center justify-center text-gray-400">
                  <RefreshCw size={40} className="animate-spin mb-4 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Loading Events...</p>
                </div>
              ) : (
                <>
                  {filteredEntries.map((entry) => (
                    <motion.div layout key={entry._id || entry.id} className="bg-white rounded-2xl border border-gray-200/50 shadow-sm overflow-hidden group hover:shadow-xl transition-all h-full flex flex-col">
                      <div className="h-40 relative">
                        <img src={entry.images[0]} alt={entry.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded text-[9px] font-bold text-[#711113] uppercase tracking-widest">{entry.date}</div>
                        <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur-sm px-2 py-1 rounded text-[9px] font-bold text-white uppercase tracking-widest flex items-center gap-1">
                          <ImageIcon size={10} /> {entry.images.length} Photos
                        </div>
                      </div>
                      <div className="p-5 flex-1 flex flex-col">
                        <h3 className="text-base font-bold text-gray-900 mb-2 truncate uppercase tracking-tight">{entry.title}</h3>
                        <p className="text-xs text-gray-500 line-clamp-2 mb-6 flex-1 italic">&quot;{entry.shortDesc}&quot;</p>
                        
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenForm(entry)} className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-[10px] tracking-widest uppercase font-bold hover:bg-[#711113] hover:text-white transition-colors">Edit Event</button>
                          <button onClick={() => handleDelete(entry._id || entry.id)} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-xs hover:bg-rose-600 hover:text-white transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {filteredEntries.length === 0 && (
                    <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center text-gray-400">
                      <HeartHandshake size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="font-bold uppercase tracking-widest text-[10px]">No event highlights found.</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 pb-20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button onClick={() => setIsFormOpen(false)} className="p-2 bg-white border border-gray-200/50 rounded-xl text-gray-500 hover:text-[#711113] hover:bg-gray-50 shadow-sm"><ArrowLeft size={20} /></button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{editingEntry ? 'Edit Event Highlight' : 'Create Event Highlight'}</h1>
                  <p className="text-gray-500 text-sm">Configure the event card and detailed gallery view.</p>
                </div>
              </div>
              <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2.5 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#711113]/20 hover:bg-[#520c0d]">
                <Check size={16} /> {editingEntry ? 'Update Highlight' : 'Publish Highlight'}
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2 space-y-6">
                <section className="bg-white rounded-2xl border border-gray-200/50 shadow-sm p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Event Title *</label>
                      <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" placeholder="e.g. Annual Strategy Meet 2025" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Event Date</label>
                        <input value={formData.date} onChange={(e) => setFormData({...formData, date: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" placeholder="Oct 24, 2025" />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Event Time</label>
                        <input value={formData.time} onChange={(e) => setFormData({...formData, time: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" placeholder="10 AM - 5 PM" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Short Description (Card Summary) *</label>
                      <textarea required rows={2} value={formData.shortDesc} onChange={(e) => setFormData({...formData, shortDesc: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] resize-none text-sm" placeholder="A brief summary for the grid card..."></textarea>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Detailed Story (Modal Content) *</label>
                      <textarea required rows={8} value={formData.longDesc} onChange={(e) => setFormData({...formData, longDesc: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] resize-none text-sm leading-relaxed" placeholder="Tell the full story of the event here..."></textarea>
                    </div>
                  </div>
                </section>
              </div>

              {/* Multi-Image Upload */}
              <div className="space-y-6">
                <section className="bg-white rounded-2xl border border-gray-200/50 shadow-sm p-8">
                  <h4 className="text-[10px] font-bold uppercase text-gray-900 tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
                    <ImageIcon size={14} className="text-[#711113]" /> Event Gallery
                  </h4>
                  
                  <ImageUpload 
                    label="Add New Photo" 
                    value="" 
                    onChange={(url) => handleAddImage(url as string)} 
                  />

                  <div className="mt-8 grid grid-cols-2 gap-4">
                    {formData.images.map((img, idx) => (
                      <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-100 aspect-square">
                        <img src={img} alt="Event" className="w-full h-full object-cover" />
                        <button 
                          onClick={() => removeImage(idx)}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {formData.images.length === 0 && (
                    <div className="mt-4 p-8 border-2 border-dashed border-gray-100 rounded-xl text-center">
                      <p className="text-[10px] font-bold uppercase text-gray-300 tracking-widest leading-loose">No photos uploaded yet.<br/>Upload at least one thumbnail.</p>
                    </div>
                  )}
                </section>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
