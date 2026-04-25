"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Search, Check, ArrowLeft, HelpCircle, RefreshCw, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQAdminPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<any>(null);

  const fetchFaqs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/faq");
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
  
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    category: "General",
    order: 0
  });

  const filteredFaqs = faqs.filter(f => f.question.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenForm = (faq: any = null) => {
    if (faq) {
      setEditingFaq(faq);
      setFormData({ ...faq });
    } else {
      setEditingFaq(null);
      setFormData({ question: "", answer: "", category: "General", order: faqs.length });
    }
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this FAQ?")) {
      try {
        const res = await fetch(`/api/faq/${id}`, { method: "DELETE" });
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
      if (editingFaq) {
        const id = editingFaq._id || editingFaq.id;
        const res = await fetch(`/api/faq/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updated = await res.json();
          setFaqs(faqs.map(f => (f._id || f.id) === id ? updated : f));
        }
      } else {
        const res = await fetch("/api/faq", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const created = await res.json();
          setFaqs([...faqs, created]);
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving FAQ:", error);
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isFormOpen ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">FAQ Manager</h1>
                <p className="text-gray-500 text-sm">Organize and answer frequently asked questions.</p>
              </div>
              <button 
                onClick={() => handleOpenForm()}
                className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20"
              >
                <Plus size={18} /> New Question
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/50 shadow-sm flex items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search questions..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm"
                />
              </div>
            </div>

            <div className="space-y-4">
              {isLoading ? (
                <div className="py-20 flex flex-col items-center justify-center text-gray-400">
                  <RefreshCw size={40} className="animate-spin mb-4 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Loading FAQs...</p>
                </div>
              ) : (
                <>
                  {filteredFaqs.map((faq) => (
                    <motion.div layout key={faq._id || faq.id} className="bg-white rounded-2xl border border-gray-200/50 shadow-sm p-6 hover:border-[#711113]/20 transition-all group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                             <span className="px-2 py-0.5 bg-[#29B1D2]/10 text-[#29B1D2] text-[9px] font-bold uppercase tracking-widest rounded">{faq.category}</span>
                             <span className="text-[9px] text-gray-400 font-bold uppercase">Order: {faq.order}</span>
                          </div>
                          <h3 className="text-base font-bold text-gray-900 group-hover:text-[#711113] transition-colors">{faq.question}</h3>
                          <p className="text-sm text-gray-500 mt-2 leading-relaxed">{faq.answer}</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenForm(faq)} className="p-2 bg-gray-50 text-gray-500 rounded-lg hover:bg-[#711113] hover:text-white transition-all"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(faq._id || faq.id)} className="p-2 bg-rose-50 text-rose-500 rounded-lg hover:bg-rose-600 hover:text-white transition-all"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {filteredFaqs.length === 0 && (
                    <div className="py-16 text-center text-gray-400">
                      <HelpCircle size={48} className="mx-auto mb-4 opacity-20" />
                      <p className="font-bold uppercase tracking-widest text-[10px]">No questions found.</p>
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
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{editingFaq ? 'Edit FAQ' : 'New Question'}</h1>
                <p className="text-gray-500 text-sm">Provide a clear question and a helpful answer.</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-200/50 shadow-xl p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm">
                    <option value="General">General</option>
                    <option value="Project">Project Related</option>
                    <option value="Policy">Company Policy</option>
                    <option value="Sales">Sales & Pricing</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Display Order</label>
                  <input type="number" value={formData.order} onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">The Question *</label>
                <input required value={formData.question} onChange={(e) => setFormData({...formData, question: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm font-bold" placeholder="e.g. What are the possession timelines?" />
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">The Answer *</label>
                <textarea required rows={6} value={formData.answer} onChange={(e) => setFormData({...formData, answer: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] resize-none text-sm leading-relaxed" placeholder="Write the detailed answer here..."></textarea>
              </div>

              <button type="submit" className="w-full py-4 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#711113]/20 hover:bg-[#520c0d] transition-all flex items-center justify-center gap-2">
                <Check size={18} /> {editingFaq ? 'Update Question' : 'Publish Question'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
