"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Search, X, Check, Sparkles, Home, Droplets, Dumbbell, Gamepad, Wind, Timer, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const iconMap: any = {
  Home: Home,
  Droplets: Droplets,
  Dumbbell: Dumbbell,
  Gamepad: Gamepad,
  Wind: Wind,
  Timer: Timer
};

export default function AmenitiesAdminPage() {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAmenities = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/amenities");
      const data = await res.json();
      setAmenities(data);
    } catch (error) {
      console.error("Error fetching amenities:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAmenities();
  }, [fetchAmenities]);
  
  // Form State
  const [formData, setFormData] = useState({
    name: "",
    icon: "Home"
  });

  const filteredAmenities = amenities.filter(a => 
    a.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (confirm("Remove this amenity from the website?")) {
      try {
        const res = await fetch(`/api/amenities/${id}`, { method: "DELETE" });
        if (res.ok) {
          setAmenities(amenities.filter(a => (a._id || a.id) !== id));
        }
      } catch (error) {
        console.error("Error deleting amenity:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/amenities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        const created = await res.json();
        setAmenities([...amenities, created]);
        setIsModalOpen(false);
        setFormData({ name: "", icon: "Home" });
      }
    } catch (error) {
      console.error("Error saving amenity:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Amenities Portal</h1>
          <p className="text-gray-500 text-sm">Update the list of lifestyle features offered across Sankalp projects.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20"
        >
          <Plus size={18} /> Add Amenity
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search amenities..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] transition-all text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw size={40} className="animate-spin mb-4 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-widest">Loading Amenities...</p>
            </div>
          ) : (
            <>
              {filteredAmenities.map((amenity) => {
                const IconComponent = iconMap[amenity.icon] || Home;
                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    key={amenity._id || amenity.id}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-3 relative group hover:border-[#29B1D2] transition-all"
                  >
                    <button 
                      onClick={() => handleDelete(amenity._id || amenity.id)}
                      className="absolute top-2 right-2 p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="w-12 h-12 bg-gray-50 text-[#711113] rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:bg-[#711113] group-hover:text-white transition-all">
                       <IconComponent size={24} />
                    </div>
                    <span className="text-xs font-bold text-gray-900 text-center uppercase tracking-wider">{amenity.name}</span>
                  </motion.div>
                );
              })}
            </>
          )}
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden relative z-10"
            >
              <div className="bg-[#711113] p-6 text-white flex justify-between items-center">
                <h2 className="font-bold uppercase tracking-widest flex items-center gap-2">
                  <Plus size={20} /> Add New Amenity
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Amenity Name</label>
                  <input 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]"
                    placeholder="e.g. Zen Garden"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Choose Icon Category</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.keys(iconMap).map(iconName => (
                      <button
                        key={iconName}
                        type="button"
                        onClick={() => setFormData({...formData, icon: iconName})}
                        className={`p-4 border rounded-xl flex flex-col items-center gap-2 transition-all ${
                          formData.icon === iconName 
                            ? "bg-[#29B1D2]/10 border-[#29B1D2] text-[#29B1D2]" 
                            : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-gray-100"
                        }`}
                      >
                         {React.createElement(iconMap[iconName], { size: 20 })}
                         <span className="text-[10px] font-bold">{iconName}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full py-4 bg-[#711113] text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#520c0d] transition-colors shadow-lg shadow-[#711113]/20 flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Add Amenity
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
