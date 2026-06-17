"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Search, Check, ArrowLeft, RefreshCw, Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "@/components/admin/ImageUpload";
import toast from "react-hot-toast";

export default function RentalResidentialAdminPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any>(null);

  const fetchProperties = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/rentals?type=residential");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProperties(data);
        } else {
          setProperties([]);
          console.error("Expected array from rentals API, got:", data);
        }
      } else {
        setProperties([]);
        console.error("Failed to fetch rentals, status:", res.status);
      }
    } catch (error) {
      console.error("Error fetching residential rentals:", error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    image: "",
    sqft: "",
    facing: "",
    bhk: "",
    phone: "",
    whatsapp: "",
    status: "available",
    propertyType: "residential"
  });

  const filteredProperties = properties.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const handleOpenForm = (property: any = null) => {
    if (property) {
      setEditingProperty(property);
      setFormData({ ...property });
    } else {
      setEditingProperty(null);
      setFormData({
        title: "", location: "", image: "", sqft: "", facing: "", bhk: "", phone: "", whatsapp: "", status: "available", propertyType: "residential"
      });
    }
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this property?")) {
      try {
        const res = await fetch(`/api/rentals/${id}`, { method: "DELETE" });
        if (res.ok) {
          setProperties(properties.filter(p => (p._id || p.id) !== id));
        
          toast.success("Residential property saved successfully!");
        }
      } catch (error) {
        console.error("Error deleting property:", error);
        toast.error("Failed to save changes.");
    }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.location || !formData.sqft || !formData.facing || !formData.bhk || !formData.phone || !formData.whatsapp) {
      toast.error("Please fill in all required fields.");
      return;
    }
    try {
      if (editingProperty) {
        const id = editingProperty._id || editingProperty.id;
        const res = await fetch(`/api/rentals/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updated = await res.json();
          setProperties(properties.map(p => (p._id || p.id) === id ? updated : p));
        
          toast.success("Residential property updated successfully!");
        }
      } else {
        const res = await fetch("/api/rentals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const created = await res.json();
          setProperties([created, ...properties]);
        
          toast.success("Residential property added successfully!");
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving property:", error);
      toast.error("Failed to save changes.");
    }
  };

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isFormOpen ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Residential Rentals</h1>
                <p className="text-gray-500 text-sm">Manage residential properties for rent.</p>
              </div>
              <button 
                onClick={() => handleOpenForm()}
                className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20"
              >
                <Plus size={18} /> Add Property
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/50 shadow-sm flex items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search properties..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full py-20 text-center">
                  <RefreshCw size={40} className="animate-spin mx-auto text-gray-200 mb-4" />
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Properties...</p>
                </div>
              ) : (
                <>
                  {filteredProperties.map((property) => (
                    <motion.div layout key={property._id || property.id} className="bg-white rounded-2xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all">
                      <div className="relative h-48 bg-gray-100 overflow-hidden">
                        <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm">
                          {property.status}
                        </div>
                      </div>
                      <div className="p-6">
                        <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">{property.title}</h3>
                        <p className="text-sm text-gray-500 mb-4 truncate">{property.location}</p>
                        
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenForm(property)} className="flex-1 py-2 bg-gray-50 text-gray-600 rounded-lg text-[10px] tracking-widest uppercase font-bold hover:bg-[#29B1D2] hover:text-white transition-colors">Edit</button>
                          <button onClick={() => handleDelete(property._id || property.id)} className="px-4 py-2 bg-rose-50 text-rose-600 rounded-lg text-xs hover:bg-rose-600 hover:text-white transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {filteredProperties.length === 0 && (
                    <div className="col-span-full py-16 text-center text-gray-400 italic">No properties found.</div>
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
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{editingProperty ? 'Edit Property' : 'Add Property'}</h1>
                  <p className="text-gray-500 text-sm">Enter the details for the residential rental property.</p>
                </div>
              </div>
              <button onClick={handleSubmit} className="flex items-center gap-2 px-6 py-2.5 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-[#711113]/20 hover:bg-[#520c0d]">
                <Check size={16} /> Save Property
              </button>
            </div>

            <section className="bg-white rounded-2xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-8 max-w-4xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-1 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Property Title *</label>
                  <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. Sankalp Residency 3BHK" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Location *</label>
                  <input required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. Madhapur, Hyderabad" />
                </div>
                <div className="col-span-1 md:col-span-2">
                  <ImageUpload 
                    label="Property Image *" 
                    value={formData.image} 
                    onChange={(url) => setFormData({...formData, image: url as string})} 
                    multiple={false}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Area (Sq.ft) *</label>
                  <input required value={formData.sqft} onChange={(e) => setFormData({...formData, sqft: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. 1,850 Sq.ft" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Facing *</label>
                  <input required value={formData.facing} onChange={(e) => setFormData({...formData, facing: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. East" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">BHK Type *</label>
                  <input required value={formData.bhk} onChange={(e) => setFormData({...formData, bhk: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. 3 BHK" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]">
                    <option value="available">Available</option>
                    <option value="rented">Rented</option>
                  </select>
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">Phone *</label>
                  <input required value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. +919876543210" />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest block mb-2">WhatsApp *</label>
                  <input required value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" placeholder="e.g. +919876543210" />
                </div>
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
