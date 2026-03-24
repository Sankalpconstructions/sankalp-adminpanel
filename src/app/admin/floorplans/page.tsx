"use client";
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, X, Check, Map, Maximize, Building } from "lucide-react";
import { initialFloorPlans } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

export default function FloorPlansAdminPage() {
  const [floorPlans, setFloorPlans] = useState(initialFloorPlans);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<any>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    type: "",
    area: "",
    project: "",
    img: ""
  });

  const filteredPlans = floorPlans.filter(p => 
    p.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (plan: any = null) => {
    if (plan) {
      setEditingPlan(plan);
      setFormData({ ...plan });
    } else {
      setEditingPlan(null);
      setFormData({ type: "", area: "", project: "", img: "" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this floor plan?")) {
      setFloorPlans(floorPlans.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPlan) {
      setFloorPlans(floorPlans.map(p => p.id === editingPlan.id ? { ...formData, id: p.id } : p));
    } else {
      const newPlan = {
        ...formData,
        id: Math.max(...floorPlans.map(p => p.id), 0) + 1
      };
      setFloorPlans([newPlan, ...floorPlans]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Floor Plan Manager</h1>
          <p className="text-gray-500 text-sm">Upload and configure layouts for various project configurations.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20"
        >
          <Plus size={18} /> Add Floor Plan
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by plan type or project..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] transition-all text-sm"
          />
        </div>
      </div>

      {/* Plans List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredPlans.map((plan) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={plan.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
            >
              <div className="h-40 bg-gray-50 relative overflow-hidden flex items-center justify-center p-4">
                 <img src={plan.img} alt={plan.type} className="max-h-full max-w-full object-contain mix-blend-multiply opacity-80" />
                 <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleOpenModal(plan)}
                      className="p-2 bg-white/90 backdrop-blur text-blue-600 rounded-lg shadow-sm hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => handleDelete(plan.id)}
                      className="p-2 bg-white/90 backdrop-blur text-red-500 rounded-lg shadow-sm hover:bg-red-500 hover:text-white transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                 </div>
              </div>
              <div className="p-6">
                 <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">{plan.type}</h3>
                      <div className="flex items-center gap-1 text-gray-400 text-xs mt-0.5">
                         <Building size={14} /> {plan.project}
                      </div>
                    </div>
                    <span className="bg-[#29B1D2]/10 text-[#29B1D2] px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                       <Maximize size={12} /> {plan.area}
                    </span>
                 </div>
                 <button 
                  onClick={() => handleOpenModal(plan)}
                  className="w-full py-2 bg-gray-50 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-[#711113] hover:text-white transition-all"
                 >
                   Manage Layout
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* CRUD Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            ></motion.div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-xl overflow-hidden relative z-10"
            >
              <div className="bg-[#711113] p-6 text-white flex justify-between items-center">
                <h2 className="font-bold uppercase tracking-widest flex items-center gap-2">
                  {editingPlan ? <Edit2 size={20} /> : <Plus size={20} />}
                  {editingPlan ? 'Edit Floor Plan' : 'Add Floor Plan'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Plan Type</label>
                    <input 
                      required
                      value={formData.type}
                      onChange={(e) => setFormData({...formData, type: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]"
                      placeholder="e.g. 3BHK Royal"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Total Area</label>
                    <input 
                      required
                      value={formData.area}
                      onChange={(e) => setFormData({...formData, area: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]"
                      placeholder="e.g. 1,850 sq.ft."
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Associated Project</label>
                    <input 
                      required
                      value={formData.project}
                      onChange={(e) => setFormData({...formData, project: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]"
                      placeholder="e.g. Sankalp Heights"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Layout Image URL</label>
                    <input 
                      required
                      value={formData.img}
                      onChange={(e) => setFormData({...formData, img: e.target.value})}
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]"
                      placeholder="https://images.unsplash.com/..."
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-gray-50 text-gray-500 font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    type="submit"
                    className="flex-1 py-4 bg-[#711113] text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#520c0d] transition-colors shadow-lg shadow-[#711113]/20 flex items-center justify-center gap-2"
                  >
                    <Check size={18} /> {editingPlan ? 'Save Changes' : 'Create Plan'}
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
