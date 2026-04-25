"use client";
import React, { useState, useEffect } from "react";
import { Check, Info, Image as ImageIcon, Plus, Trash2, RefreshCw, Sparkles, Layout } from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "@/components/admin/ImageUpload";

export default function BrandStoryAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "Brand Story",
    description: "",
    image: "",
    yearsOfExcellence: "25+",
    stats: [] as { label: string; value: string }[]
  });

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await fetch("/api/brand-story");
        if (res.ok) {
          const data = await res.json();
          setFormData({
            ...data,
            stats: data.stats || []
          });
        }
      } catch (error) {
        console.error("Error fetching brand story:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStory();
  }, []);

  const addStat = () => {
    setFormData({
      ...formData,
      stats: [...formData.stats, { label: "", value: "" }]
    });
  };

  const removeStat = (index: number) => {
    setFormData({
      ...formData,
      stats: formData.stats.filter((_, i) => i !== index)
    });
  };

  const handleStatChange = (index: number, field: "label" | "value", val: string) => {
    const newStats = [...formData.stats];
    newStats[index][field] = val;
    setFormData({ ...formData, stats: newStats });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch("/api/brand-story", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        toast.success("Brand Story updated successfully!");
      }
    } catch (error) {
      console.error("Error saving brand story:", error);
      toast.error("Failed to save brand story.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-gray-400">
        <RefreshCw size={40} className="animate-spin mb-4 opacity-20" />
        <p className="text-xs font-bold uppercase tracking-widest">Loading Brand Story...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Brand Story Manager</h1>
          <p className="text-gray-500 text-sm">Update your company legacy, mission, and milestones.</p>
        </div>
        <button 
          onClick={handleSubmit}
          disabled={isSaving}
          className="flex items-center gap-2 px-8 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw size={16} className="animate-spin" /> : <Check size={18} />}
          {isSaving ? "Saving..." : "Save Brand Story"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border border-gray-200/50 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
              <div className="p-2.5 bg-[#711113]/10 text-[#711113] rounded-xl"><Info size={20} /></div>
              <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Story Content</h2>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Section Subtitle</label>
                  <input value={formData.subtitle} onChange={(e) => setFormData({...formData, subtitle: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" placeholder="Brand Story" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Years of Excellence Badge</label>
                  <input value={formData.yearsOfExcellence} onChange={(e) => setFormData({...formData, yearsOfExcellence: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" placeholder="25+" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Main Title</label>
                <input value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm font-bold" placeholder="A Legacy of Trust & Quality" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Full Story Description</label>
                <textarea rows={8} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] resize-none text-sm leading-relaxed" placeholder="Tell your company story here..."></textarea>
              </div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="bg-white rounded-2xl border border-gray-200/50 shadow-sm p-8">
            <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><Sparkles size={20} /></div>
                <h2 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Milestones & Stats</h2>
              </div>
              <button onClick={addStat} className="text-xs font-bold uppercase tracking-widest text-[#29B1D2] flex items-center gap-1 hover:text-[#1a8da9] transition-colors">
                <Plus size={14} /> Add New Stat
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formData.stats.map((stat, idx) => (
                <div key={idx} className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex gap-3 group relative">
                  <div className="flex-1 space-y-3">
                    <input 
                      placeholder="Stat Value (e.g. 10,000+)" 
                      value={stat.value} 
                      onChange={(e) => handleStatChange(idx, "value", e.target.value)}
                      className="w-full bg-transparent border-b border-gray-200 focus:border-[#29B1D2] outline-none text-sm font-bold py-1" 
                    />
                    <input 
                      placeholder="Stat Label (e.g. Happy Families)" 
                      value={stat.label} 
                      onChange={(e) => handleStatChange(idx, "label", e.target.value)}
                      className="w-full bg-transparent border-b border-gray-200 focus:border-[#29B1D2] outline-none text-[10px] uppercase tracking-widest font-medium py-1" 
                    />
                  </div>
                  <button 
                    onClick={() => removeStat(idx)}
                    className="p-2 text-gray-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              {formData.stats.length === 0 && (
                <div className="col-span-2 py-10 text-center border-2 border-dashed border-gray-100 rounded-2xl">
                  <p className="text-[10px] font-bold uppercase text-gray-300 tracking-[0.2em]">No stats added yet.</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <section className="bg-white rounded-2xl border border-gray-200/50 shadow-sm p-8">
            <h4 className="text-[10px] font-bold uppercase text-gray-900 tracking-[0.2em] mb-6 flex items-center gap-2 border-b border-gray-100 pb-3">
              <ImageIcon size={14} className="text-[#711113]" /> Featured Image
            </h4>
            <ImageUpload 
              label="Brand Story Photo" 
              value={formData.image} 
              onChange={(url) => setFormData({...formData, image: url as string})} 
            />
            <p className="text-[9px] text-gray-400 mt-4 leading-relaxed uppercase tracking-wider">This photo appears on the left side of the Brand Story section on your homepage.</p>
          </section>

          <section className="bg-[#050505] rounded-2xl p-8 text-white">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#F5C33C]/20 text-[#F5C33C] rounded-lg"><Layout size={18} /></div>
              <h4 className="text-sm font-bold uppercase tracking-widest">Live Preview</h4>
            </div>
            <div className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-4">
              <div className="w-full h-32 bg-gray-800 rounded-lg overflow-hidden relative">
                {formData.image ? <img src={formData.image} className="w-full h-full object-cover opacity-50" /> : <div className="w-full h-full flex items-center justify-center"><ImageIcon className="opacity-20" /></div>}
                <div className="absolute top-2 left-2 bg-[#F5C33C] text-[8px] font-bold text-black px-1.5 py-0.5 rounded">{formData.yearsOfExcellence}</div>
              </div>
              <div>
                <div className="text-[#F5C33C] text-[8px] font-bold uppercase tracking-widest">{formData.subtitle}</div>
                <div className="text-xs font-bold line-clamp-1 mt-1">{formData.title}</div>
                <div className="text-[9px] text-white/40 line-clamp-3 mt-2 leading-relaxed">{formData.description}</div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
