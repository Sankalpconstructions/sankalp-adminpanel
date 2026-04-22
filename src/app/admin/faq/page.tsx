"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Search, X, Check, HelpCircle, ChevronDown, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type FAQ = { id: number; question: string; answer: string };
const emptyForm = { question: "", answer: "" };

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/faqs");
      const data = await res.json();
      setFaqs(data);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const filtered = faqs.filter(f =>
    f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (item: FAQ | null = null) => {
    setEditingItem(item);
    setFormData(item ? { question: item.question, answer: item.answer } : { ...emptyForm });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Delete this FAQ?")) {
      try {
        const res = await fetch(`/api/faqs/${id}`, { method: "DELETE" });
        if (res.ok) {
          setFaqs(faqs.filter(f => (f._id || f.id) !== id));
        }
      } catch (error) {
        console.error("Error deleting FAQ:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const id = editingItem._id || editingItem.id;
        const res = await fetch(`/api/faqs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updated = await res.json();
          setFaqs(faqs.map(f => (f._id || f.id) === id ? updated : f));
        }
      } else {
        const res = await fetch("/api/faqs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const created = await res.json();
          setFaqs([...faqs, created]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">FAQ Manager</h1>
          <p className="text-gray-500 text-sm">Manage frequently asked questions displayed to visitors on the website.</p>
        </div>
        <button onClick={() => handleOpenModal()} className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20">
          <Plus size={18} /> Add FAQ
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input type="text" placeholder="Search FAQs..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" />
        </div>
        <span className="bg-gray-50 text-gray-400 border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold uppercase">Total: {faqs.length}</span>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {isLoading ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-gray-100">
              <RefreshCw size={40} className="animate-spin mx-auto text-gray-200 mb-4" />
              <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading FAQs...</p>
            </div>
          ) : (
            <>
              {filtered.map((faq, idx) => (
                <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ delay: idx * 0.03 }} key={faq._id || faq.id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-6 cursor-pointer group hover:bg-gray-50/50 transition-colors"
                    onClick={() => setExpandedId(expandedId === (faq._id || faq.id) ? null : (faq._id || faq.id))}
                  >
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-8 h-8 bg-[#711113]/10 rounded-lg flex items-center justify-center shrink-0">
                        <HelpCircle size={16} className="text-[#711113]" />
                      </div>
                      <p className="text-sm font-bold text-gray-900 group-hover:text-[#711113] transition-colors leading-snug">{faq.question}</p>
                    </div>
                    <div className="flex items-center gap-3 ml-4">
                      <button onClick={(e) => { e.stopPropagation(); handleOpenModal(faq); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Edit2 size={15} /></button>
                      <button onClick={(e) => { e.stopPropagation(); handleDelete(faq._id || faq.id); }} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"><Trash2 size={15} /></button>
                      <ChevronDown size={18} className={`text-gray-400 transition-transform ${expandedId === (faq._id || faq.id) ? "rotate-180" : ""}`} />
                    </div>
                  </div>
                  <AnimatePresence>
                    {expandedId === (faq._id || faq.id) && (
                      <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="px-6 pb-6 pl-[4.5rem]">
                          <p className="text-gray-500 text-sm leading-relaxed border-l-2 border-[#29B1D2] pl-4">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <div className="p-16 text-center bg-white rounded-2xl border border-gray-100">
                  <HelpCircle size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No FAQs found.</p>
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
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative z-10">
              <div className="bg-[#711113] p-6 text-white flex justify-between items-center">
                <h2 className="font-bold uppercase tracking-widest flex items-center gap-2">
                  {editingItem ? <Edit2 size={20} /> : <Plus size={20} />}
                  {editingItem ? "Edit FAQ" : "Add New FAQ"}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform"><X size={24} /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-8 space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Question</label>
                  <input required value={formData.question} onChange={e => setFormData({ ...formData, question: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="Enter the question..." />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Answer</label>
                  <textarea required rows={5} value={formData.answer} onChange={e => setFormData({ ...formData, answer: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] resize-none" placeholder="Enter the detailed answer..." />
                </div>
                <div className="flex gap-4 pt-2">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 py-4 bg-gray-50 text-gray-500 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-100 transition-colors">Cancel</button>
                  <button type="submit" className="flex-1 py-4 bg-[#711113] text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#520c0d] transition-colors shadow-lg shadow-[#711113]/20 flex items-center justify-center gap-2">
                    <Check size={18} /> {editingItem ? "Save Changes" : "Add FAQ"}
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
