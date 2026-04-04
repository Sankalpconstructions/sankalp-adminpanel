"use client";
import React, { useState } from "react";
import { Plus, Edit2, Trash2, Search, Check, AlertCircle, Image as ImageIcon, MapPin, AlignLeft, Layers, ArrowLeft, Building2, ChevronRight, ChevronLeft, List, IndianRupee, Sparkles, Map, Navigation, X } from "lucide-react";
import { initialProjects } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Tabs State
  const [activeTab, setActiveTab] = useState(0);
  const tabNames = [
    { name: "Overview", icon: AlignLeft },
    { name: "Key Highlights", icon: List },
    { name: "Pricing", icon: IndianRupee },
    { name: "Amenities", icon: Sparkles },
    { name: "Plans & Gallery", icon: Layers },
    { name: "Location", icon: MapPin }
  ];
  
  // Comprehensive Form State
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    type: "",
    description: "",
    status: "Upcoming",
    amenitiesCount: "",
    priceStarting: "",
    banners: [""] as string[],
    highlights: [""] as string[],
    priceConfigurations: [{ configuration: "", carpetArea: "", price: "" }],
    amenities: [] as string[],
    landmarks: [] as { type: string; text: string }[],
    brochures: [] as {name: string, url: string}[],
    floorPlans: [] as string[],
    gallery: [] as string[]
  });

  const [customAmenityText, setCustomAmenityText] = useState("");
  const [landmarkType, setLandmarkType] = useState("School/College");
  const [landmarkText, setLandmarkText] = useState("");

  const filteredProjects = projects.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const paginatedProjects = filteredProjects.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleOpenForm = (project: any = null) => {
    setActiveTab(0);
    setCustomAmenityText("");
    setLandmarkText("");
    if (project) {
      setEditingProject(project);
      setFormData({ 
        ...project, 
        banners: project.banners || [project.image || ""],
        highlights: project.highlights || [""],
        priceConfigurations: project.priceConfigurations || [{ configuration: "", carpetArea: "", price: "" }],
        amenities: project.amenities || [],
        landmarks: project.landmarks || [],
        brochures: project.brochures || [],
        floorPlans: project.floorPlans || [],
        gallery: project.gallery || [],
        status: project.status || "Ongoing", 
        amenitiesCount: "10+", 
        priceStarting: project.priceStarting || "Price on Request" 
      });
    } else {
      setEditingProject(null);
      setFormData({ 
        title: "", location: "", type: "", description: "", 
        status: "Upcoming", amenitiesCount: "", priceStarting: "",
        banners: [""],
        highlights: [""],
        priceConfigurations: [{ configuration: "", carpetArea: "", price: "" }],
        amenities: [],
        landmarks: [],
        brochures: [],
        floorPlans: [],
        gallery: []
      });
    }
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!validateCurrentTab()) return;

    if (editingProject) {
      setProjects(projects.map(p => p.id === editingProject.id ? { ...formData, image: formData.banners[0] || "", id: p.id } as any : p));
    } else {
      const newProject = {
        ...formData,
        image: formData.banners[0] || "",
        id: Math.random().toString(36).substr(2, 9)
      };
      setProjects([newProject as any, ...projects]);
    }
    setIsFormOpen(false);
  };

  const validateCurrentTab = (): boolean => {
    if (activeTab === 0) {
      const validBanners = formData.banners.filter(b => b.trim() !== "");
      if (!formData.title || !formData.location || !formData.type || !formData.description || validBanners.length === 0) {
        alert("Please fill out all required fields (Title, Location, Type, Description) and provide at least 1 Banner Image before continuing.");
        return false;
      }
    }
    if (activeTab === 1) {
      const validHighlights = formData.highlights.filter(h => h.trim() !== "");
      if (validHighlights.length === 0) {
        alert("Please add at least one highlight.");
        return false;
      }
    }
    if (activeTab === 2) {
      const validConfigs = formData.priceConfigurations.filter(c => c.configuration && c.carpetArea && c.price);
      if (formData.priceConfigurations.length === 0 || validConfigs.length !== formData.priceConfigurations.length) {
         alert("Please ensure all added pricing configuration rows are completely filled, or remove any empty rows. Minimum 1 valid configuration is required.");
         return false;
      }
    }
    if (activeTab === 3) {
      if (formData.amenities.length === 0) {
        alert("Please select or add at least one amenity.");
        return false;
      }
    }
    return true;
  };

  const nextTab = () => {
    if (!validateCurrentTab()) return;
    if (activeTab < tabNames.length - 1) setActiveTab(prev => prev + 1);
  };

  const prevTab = () => {
    if (activeTab > 0) setActiveTab(prev => prev - 1);
  };

  // Helper bindings for arrays
  const handleHighlightChange = (idx: number, val: string) => {
    const newH = [...formData.highlights];
    newH[idx] = val;
    setFormData({...formData, highlights: newH});
  };
  const addHighlight = () => setFormData({...formData, highlights: [...formData.highlights, ""]});

  const handlePriceConfigChange = (idx: number, field: string, val: string) => {
    const newC = [...formData.priceConfigurations];
    newC[idx] = { ...newC[idx], [field]: val };
    setFormData({...formData, priceConfigurations: newC});
  };
  const addPriceConfig = () => setFormData({...formData, priceConfigurations: [...formData.priceConfigurations, { configuration: "", carpetArea: "", price: "" }]});
  const removePriceConfig = (idx: number) => {
    const newC = formData.priceConfigurations.filter((_, i) => i !== idx);
    setFormData({...formData, priceConfigurations: newC});
  };

  const toggleAmenity = (amenity: string) => {
    const exists = formData.amenities.includes(amenity);
    if (exists) {
      setFormData({...formData, amenities: formData.amenities.filter(a => a !== amenity)});
    } else {
      setFormData({...formData, amenities: [...formData.amenities, amenity]});
    }
  };

  const addCustomAmenity = () => {
    if (customAmenityText.trim()) {
      if (!formData.amenities.includes(customAmenityText.trim())) {
        setFormData({...formData, amenities: [...formData.amenities, customAmenityText.trim()]});
      }
      setCustomAmenityText("");
    }
  };

  const addLandmark = () => {
    if (landmarkText.trim()) {
      setFormData({...formData, landmarks: [...formData.landmarks, { type: landmarkType, text: landmarkText.trim() }]});
      setLandmarkText("");
    }
  };
  const removeLandmark = (idx: number) => {
    const newL = formData.landmarks.filter((_, i) => i !== idx);
    setFormData({...formData, landmarks: newL});
  };

  const standardAmenitiesList = ['Clubhouse', 'Swimming Pool', 'Gymnasium', 'Kids Play Area', 'Yoga Deck', 'Jogging Track', 'Security 24x7', 'Power Backup'];

  return (
    <div className="space-y-6">
      <AnimatePresence mode="wait">
        {!isFormOpen ? (
          <motion.div key="list" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Project Management</h1>
                <p className="text-gray-500 text-sm">Create, edit and manage all property listings shown on the website.</p>
              </div>
              <button onClick={() => handleOpenForm()} className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20">
                <Plus size={18} /> Add New Project
              </button>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-gray-200/50 shadow-sm flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search by name or location..." 
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] transition-all text-sm"
                />
              </div>
              <div className="flex gap-2">
                 <span className="bg-gray-50 text-gray-400 border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold uppercase">Total: {filteredProjects.length}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedProjects.map((project) => (
                <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={project.id} className="bg-white rounded-2xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all flex flex-col">
                  <div className="h-48 relative overflow-hidden shrink-0">
                    <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute top-4 right-4 flex gap-2">
                       <button onClick={() => handleOpenForm(project)} className="p-2 bg-white/90 backdrop-blur text-blue-600 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                         <Edit2 size={16} />
                       </button>
                       <button onClick={() => handleDelete(project.id)} className="p-2 bg-white/90 backdrop-blur text-red-600 rounded-lg shadow-lg hover:bg-red-600 hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-75">
                         <Trash2 size={16} />
                       </button>
                    </div>
                    <div className="absolute bottom-4 left-4 flex gap-2">
                      <span className="bg-[#29B1D2] text-white text-[10px] font-bold uppercase px-3 py-1 rounded shadow-lg">{project.type}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#711113] transition-colors line-clamp-1">{project.title}</h3>
                    <div className="flex items-center gap-1 text-gray-400 text-xs mt-1 mb-4">
                       <MapPin size={14} /> {project.location}
                    </div>
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed mb-6 flex-1">{project.description}</p>
                    <div className="pt-4 border-t border-gray-50 flex gap-2 mt-auto">
                       <button onClick={() => handleOpenForm(project)} className="flex-1 py-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-600 font-bold text-[10px] tracking-widest uppercase hover:bg-[#711113] hover:text-white hover:border-[#711113] transition-all">
                         Manage Details
                       </button>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {paginatedProjects.length === 0 && (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-16 text-center text-gray-400">
                  <Building2 size={48} className="mx-auto mb-4 opacity-20" />
                  <p>No projects found matching your search.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
              <div className="flex items-center justify-between bg-white px-6 py-4 rounded-2xl border border-gray-200/50 shadow-sm">
                <p className="text-xs text-gray-400 font-medium">
                  Showing <span className="font-bold text-gray-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-bold text-gray-900">{Math.min(currentPage * itemsPerPage, filteredProjects.length)}</span> of <span className="font-bold text-gray-900">{filteredProjects.length}</span> projects
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage(prev => prev - 1)} disabled={currentPage === 1} className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-600 border border-gray-100 disabled:opacity-30 hover:bg-[#711113] hover:text-white hover:border-[#711113] transition-all"><ChevronLeft size={16} /></button>
                  <div className="flex items-center gap-1 mx-2">
                    {Array.from({ length: totalPages }).map((_, i) => (
                      <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-all ${currentPage === i + 1 ? 'bg-[#711113] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}>{i + 1}</button>
                    ))}
                  </div>
                  <button onClick={() => setCurrentPage(prev => prev + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center w-8 h-8 rounded-lg bg-gray-50 text-gray-600 border border-gray-100 disabled:opacity-30 hover:bg-[#711113] hover:text-white hover:border-[#711113] transition-all"><ChevronRight size={16} /></button>
                </div>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-6 pb-20 max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-2">
              <button 
                onClick={() => {
                  if(confirm("Are you sure you want to go back? Unsaved progress will be lost.")) setIsFormOpen(false)
                }}
                className="p-2 bg-white border border-gray-200/50 rounded-xl text-gray-500 hover:text-[#711113] hover:bg-rose-50 transition-all shadow-sm shrink-0"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-xl font-black text-gray-900 tracking-tight">{editingProject ? 'Edit Project Details' : 'Create New Project'}</h1>
                <p className="text-gray-500 text-xs mt-0.5">Please complete all steps to publish this property.</p>
              </div>
            </div>

            {/* Horizontal Stepper */}
            <div className="bg-white rounded-2xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 relative overflow-hidden mb-8 hidden sm:block">
              <div className="absolute top-[38px] left-0 right-0 h-0.5 bg-gray-100 w-[85%] mx-auto z-0"></div>
              <div className="flex justify-between relative z-10 w-full max-w-4xl mx-auto">
                {tabNames.map((tab, idx) => {
                  const isActive = activeTab === idx;
                  const isCompleted = activeTab > idx;
                  return (
                    <div key={idx} className="flex flex-col items-center bg-white px-2 cursor-default">
                       <button
                         onClick={() => {
                           if(isCompleted) setActiveTab(idx);
                         }}
                         className={`w-10 h-10 pos-relative rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                           isActive ? 'bg-[#711113] text-white shadow-lg shadow-[#711113]/30 scale-110' 
                           : isCompleted ? 'bg-emerald-500 text-white border-2 border-white cursor-pointer hover:bg-emerald-600' 
                           : 'bg-white border-2 border-gray-200 text-gray-400 cursor-not-allowed'
                         }`}
                       >
                         {isCompleted ? <Check size={16}/> : idx + 1}
                       </button>
                       <span className={`text-[9px] font-bold uppercase tracking-widest mt-3 transition-colors ${isActive ? 'text-[#711113]' : 'text-gray-400'}`}>
                         {tab.name}
                       </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="sm:hidden bg-white p-4 rounded-xl border border-gray-200/50 mb-4 flex justify-between items-center text-xs font-bold uppercase tracking-widest">
               <span className="text-gray-400">Step {activeTab + 1} of {tabNames.length}</span>
               <span className="text-[#711113]">{tabNames[activeTab].name}</span>
            </div>

            <div className="space-y-6">
              <form className="bg-white rounded-2xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 md:p-10 min-h-[400px]">
                
                {/* TAB 1: OVERVIEW */}
                {activeTab === 0 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                      <div className="p-2.5 bg-[#711113]/10 text-[#711113] rounded-xl"><AlignLeft size={20} /></div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Project Overview</h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Basic Property Information</p>
                      </div>
                    </div>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Project Title *</label>
                        <input required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:ring-1 focus:ring-[#29B1D2]/20 transition-all font-bold text-gray-900" placeholder="e.g. Sankalp Heights Premium" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Location *</label>
                          <input required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:ring-1 focus:ring-[#29B1D2]/20 transition-all" placeholder="e.g. Wakad, Pune" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Property Type *</label>
                          <select required value={formData.type} onChange={(e) => setFormData({...formData, type: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:ring-1 focus:ring-[#29B1D2]/20 transition-all text-gray-700 font-bold">
                            <option value="">Select Type...</option>
                            <option value="Residential">Residential</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Mixed Use">Mixed Use</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Project Status *</label>
                          <select value={formData.status} onChange={(e) => setFormData({...formData, status: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:ring-1 focus:ring-[#29B1D2]/20 transition-all text-gray-700">
                            <option value="Upcoming">Upcoming (Coming Soon)</option>
                            <option value="Ongoing">Ongoing (Under Construction)</option>
                            <option value="Completed">Completed (Ready to Move)</option>
                          </select>
                        </div>
                      </div>
                      <div className="w-full">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Banner Images (Max 3) *</label>
                        <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center gap-3 hover:border-[#29B1D2] transition-colors group">
                          <div className="p-3 bg-white rounded-full shadow-sm text-[#29B1D2] group-hover:scale-110 transition-transform">
                            <ImageIcon size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-700">Upload Banner Images</p>
                            <p className="text-[10px] text-gray-400 mt-1">Supported: JPG, PNG, WEBP (Up to 3 images)</p>
                          </div>
                          <input type="file" accept="image/*" multiple className="hidden" id="banner-upload" onChange={(e) => {
                              if (e.target.files) {
                                  const files = Array.from(e.target.files);
                                  const existingBanners = formData.banners.filter(b => b.trim() !== "");
                                  const availableSlots = 3 - existingBanners.length;
                                  const toAdd = files.slice(0, availableSlots).map(f => URL.createObjectURL(f));
                                  setFormData({...formData, banners: [...existingBanners, ...toAdd]});
                              }
                          }} />
                          <label htmlFor="banner-upload" className="mt-1 px-4 py-1.5 bg-white border border-gray-200 font-bold uppercase text-[10px] tracking-widest text-gray-600 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                            Browse Files
                          </label>
                        </div>
                        
                        {formData.banners.filter(b => b.trim() !== "").length > 0 && (
                          <div className="flex flex-wrap gap-4 mt-4">
                            {formData.banners.filter(b => b.trim() !== "").map((banner, idx) => (
                              <div key={idx} className="relative w-32 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                 <img src={banner} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <button type="button" onClick={() => {
                                      const newBanners = formData.banners.filter(b => b.trim() !== "").filter((_, i) => i !== idx);
                                      if (newBanners.length === 0) newBanners.push("");
                                      setFormData({...formData, banners: newBanners});
                                   }} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors">
                                      <Trash2 size={14} />
                                   </button>
                                 </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Full Description *</label>
                        <textarea required rows={4} value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:ring-1 focus:ring-[#29B1D2]/20 resize-none transition-all leading-relaxed" placeholder="Write a comprehensive description of the property..."></textarea>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 2: KEY HIGHLIGHTS */}
                {activeTab === 1 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                      <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl"><List size={20} /></div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Key Highlights</h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Unique Selling Points</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      {formData.highlights.map((highlight, idx) => (
                        <div key={idx} className="flex gap-4">
                          <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold shrink-0">{idx + 1}</div>
                          <input type="text" value={highlight} onChange={(e) => handleHighlightChange(idx, e.target.value)} className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-[#29B1D2]" placeholder={`Enter highlight feature ${idx + 1}...`} />
                        </div>
                      ))}
                      <button type="button" onClick={addHighlight} className="text-[#29B1D2] font-bold text-xs uppercase tracking-widest flex items-center gap-1 mt-4 hover:text-[#1a8da9]">
                        <Plus size={14} /> Add Another Highlight
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* TAB 3: PRICING CONFIGURATION */}
                {activeTab === 2 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                      <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl"><IndianRupee size={20} /></div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Pricing Configuration</h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Cost & Configurations (Minimum 1 Required)</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-xs font-bold text-gray-900 uppercase tracking-widest mb-4">Detailed Price Layout</h3>
                        <div className="overflow-x-auto rounded-xl border border-gray-200">
                          <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                              <tr>
                                <th className="p-4">Configuration</th>
                                <th className="p-4">Carpet Area</th>
                                <th className="p-4">Price</th>
                                <th className="p-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {formData.priceConfigurations.map((config, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                  <td className="p-4"><input value={config.configuration} onChange={e => handlePriceConfigChange(idx, 'configuration', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-gray-700 font-medium placeholder:text-gray-300" placeholder="e.g. 2 BHK Premium" /></td>
                                  <td className="p-4"><input value={config.carpetArea} onChange={e => handlePriceConfigChange(idx, 'carpetArea', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-gray-700 font-medium placeholder:text-gray-300" placeholder="e.g. 750 sq.ft." /></td>
                                  <td className="p-4"><input value={config.price} onChange={e => handlePriceConfigChange(idx, 'price', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-gray-700 font-medium placeholder:text-gray-300" placeholder="e.g. ₹ 65 L" /></td>
                                  <td className="p-4 text-right">
                                    <button type="button" onClick={() => removePriceConfig(idx)} className="text-rose-500 hover:bg-rose-50 p-2.5 rounded-lg ml-auto block transition-colors border border-transparent hover:border-rose-100">
                                      <Trash2 size={16} />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        <button type="button" onClick={addPriceConfig} className="text-emerald-600 font-bold text-xs uppercase tracking-widest flex items-center gap-1 mt-4 hover:text-emerald-700">
                          <Plus size={14} /> Add Configuration
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 4: AMENITIES */}
                {activeTab === 3 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                      <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl"><Sparkles size={20} /></div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">World-Class Amenities</h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Select Lifestyle Facilities</p>
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 block">Standard Amenities</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {standardAmenitiesList.map((amenity, i) => (
                             <label key={i} className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-all ${formData.amenities.includes(amenity) ? 'border-[#29B1D2] bg-[#29B1D2]/5 text-[#29B1D2]' : 'border-gray-200 hover:border-[#29B1D2] text-gray-700'}`}>
                               <input type="checkbox" checked={formData.amenities.includes(amenity)} onChange={() => toggleAmenity(amenity)} className="hidden" />
                               <span className="text-xs font-bold">{amenity}</span>
                             </label>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 block">Custom Amenities</h3>
                        <div className="flex gap-4 mb-4">
                          <input type="text" value={customAmenityText} onChange={e => setCustomAmenityText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addCustomAmenity())} className="w-full md:w-1/2 p-3 bg-white border border-gray-200 rounded-xl outline-none focus:border-purple-500 text-sm" placeholder="e.g. Open Air Theatre" />
                          <button type="button" onClick={addCustomAmenity} className="px-6 bg-purple-100 text-purple-700 font-bold uppercase tracking-widest text-xs rounded-xl shadow-sm hover:bg-purple-200">Add</button>
                        </div>

                        {formData.amenities.filter(a => !standardAmenitiesList.includes(a)).length > 0 && (
                          <div className="flex flex-wrap gap-2">
                             {formData.amenities.filter(a => !standardAmenitiesList.includes(a)).map((customAmenity, i) => (
                               <div key={i} className="flex items-center gap-2 bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg">
                                 <span className="text-xs font-bold text-gray-700">{customAmenity}</span>
                                 <button type="button" onClick={() => toggleAmenity(customAmenity)} className="text-gray-400 hover:text-rose-500"><X size={14} /></button>
                               </div>
                             ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 5: PLANS & GALLERY */}
                {activeTab === 4 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                      <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl"><Layers size={20} /></div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Plans & Visual Tour</h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Floor Plans, Brochures & Gallery Uploads</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* PDF Brochure Upload */}
                      <div className="md:col-span-1">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 block">Project Details (PDF)</h3>
                        <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center gap-3 hover:border-indigo-300 transition-colors group">
                          <div className="p-3 bg-white rounded-full shadow-sm text-indigo-500 group-hover:scale-110 transition-transform">
                            <AlignLeft size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-700">Upload PDF Brochure</p>
                          </div>
                          <input type="file" accept=".pdf" className="hidden" id="brochure-upload" onChange={(e) => {
                             if (e.target.files) {
                               const file = e.target.files[0];
                               if (file) {
                                 setFormData({...formData, brochures: [{name: file.name, url: URL.createObjectURL(file)}]});
                               }
                             }
                          }} />
                          <label htmlFor="brochure-upload" className="mt-1 px-4 py-1.5 bg-white border border-gray-200 font-bold uppercase text-[10px] tracking-widest text-gray-600 rounded-lg shadow-sm cursor-pointer hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-all">
                            Browse File
                          </label>
                        </div>
                        {formData.brochures.length > 0 && (
                          <div className="mt-4 flex flex-col gap-2">
                             {formData.brochures.map((doc, idx) => (
                               <div key={idx} className="flex justify-between items-center bg-indigo-50 border border-indigo-100 p-3 rounded-lg shadow-sm">
                                 <span className="text-xs font-bold text-indigo-700 truncate w-3/4">{doc.name}</span>
                                 <button type="button" onClick={() => {
                                    setFormData({...formData, brochures: formData.brochures.filter((_, i) => i !== idx)});
                                 }} className="text-indigo-400 hover:text-red-500 transition-colors"><Trash2 size={14}/></button>
                               </div>
                             ))}
                          </div>
                        )}
                      </div>

                      {/* Floor Plans Upload */}
                      <div className="md:col-span-1">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 block">Project Floor Plans</h3>
                        <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center gap-3 hover:border-blue-300 transition-colors group">
                          <div className="p-3 bg-white rounded-full shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                            <Map size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-700">Upload Plans (Images)</p>
                          </div>
                          <input type="file" accept="image/*" multiple className="hidden" id="plan-upload" onChange={(e) => {
                             if (e.target.files) {
                               const files = Array.from(e.target.files);
                               const toAdd = files.map(f => URL.createObjectURL(f));
                               setFormData({...formData, floorPlans: [...formData.floorPlans, ...toAdd]});
                             }
                          }} />
                          <label htmlFor="plan-upload" className="mt-1 px-4 py-1.5 bg-white border border-gray-200 font-bold uppercase text-[10px] tracking-widest text-gray-600 rounded-lg shadow-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all">
                            Browse Files
                          </label>
                        </div>
                        {formData.floorPlans.length > 0 && (
                          <div className="flex flex-wrap gap-3 mt-4">
                            {formData.floorPlans.map((plan, idx) => (
                              <div key={idx} className="relative w-[calc(50%-6px)] aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                 <img src={plan} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <button type="button" onClick={() => {
                                      setFormData({...formData, floorPlans: formData.floorPlans.filter((_, i) => i !== idx)});
                                   }} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"><Trash2 size={14} /></button>
                                 </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Gallery Upload */}
                      <div className="md:col-span-1">
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 block">Visual Tour Images</h3>
                        <div className="p-6 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex flex-col items-center justify-center text-center gap-3 hover:border-rose-300 transition-colors group">
                          <div className="p-3 bg-white rounded-full shadow-sm text-rose-500 group-hover:scale-110 transition-transform">
                            <ImageIcon size={20} />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-gray-700">Upload Gallery Images</p>
                          </div>
                          <input type="file" accept="image/*" multiple className="hidden" id="gallery-upload" onChange={(e) => {
                             if (e.target.files) {
                               const files = Array.from(e.target.files);
                               const toAdd = files.map(f => URL.createObjectURL(f));
                               setFormData({...formData, gallery: [...formData.gallery, ...toAdd]});
                             }
                          }} />
                          <label htmlFor="gallery-upload" className="mt-1 px-4 py-1.5 bg-white border border-gray-200 font-bold uppercase text-[10px] tracking-widest text-gray-600 rounded-lg shadow-sm cursor-pointer hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 transition-all">
                            Browse Files
                          </label>
                        </div>
                        {formData.gallery.length > 0 && (
                          <div className="flex flex-wrap gap-3 mt-4">
                            {formData.gallery.map((img, idx) => (
                              <div key={idx} className="relative w-[calc(50%-6px)] aspect-[4/3] rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                 <img src={img} className="w-full h-full object-cover" />
                                 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                   <button type="button" onClick={() => {
                                      setFormData({...formData, gallery: formData.gallery.filter((_, i) => i !== idx)});
                                   }} className="p-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"><Trash2 size={14} /></button>
                                 </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* TAB 6: LOCATION */}
                {activeTab === 5 && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-8 border-b border-gray-100 pb-4">
                      <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl"><Navigation size={20} /></div>
                      <div>
                        <h2 className="text-xl font-bold text-gray-900">Nearby Landmarks & Map</h2>
                        <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Location intelligence</p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div>
                         <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Google Maps Embed URL</label>
                         <input className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm font-mono" placeholder="<iframe src='...' />" />
                      </div>

                      <div>
                        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1 block">Add Nearby Landmarks</h3>
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                          <select value={landmarkType} onChange={e => setLandmarkType(e.target.value)} className="md:w-1/3 p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm text-gray-600 focus:border-blue-500">
                            <option>School/College</option>
                            <option>Hospital</option>
                            <option>Mall/Market</option>
                            <option>Transit Hub</option>
                          </select>
                          <input type="text" value={landmarkText} onChange={e => setLandmarkText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLandmark())} className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500 text-sm" placeholder="e.g. Global International School - 2km" />
                          <button type="button" onClick={addLandmark} className="px-6 py-4 bg-blue-600 text-white rounded-xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors w-full md:w-auto">Add Landmark</button>
                        </div>
                        
                        {formData.landmarks.length > 0 && (
                          <div className="border border-gray-100 rounded-xl bg-gray-50/50 p-2 space-y-2">
                             {formData.landmarks.map((lm, i) => (
                               <div key={i} className="flex justify-between items-center bg-white border border-gray-200 p-3 rounded-lg shadow-sm">
                                 <div className="flex flex-col">
                                   <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{lm.type}</span>
                                   <span className="text-sm font-bold text-gray-800">{lm.text}</span>
                                 </div>
                                 <button type="button" onClick={() => removeLandmark(i)} className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"><Trash2 size={16}/></button>
                               </div>
                             ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </form>

              {/* Bottom Action Bar */}
              <div className="flex justify-between items-center pt-2">
                <button type="button" onClick={prevTab} disabled={activeTab === 0} className="flex items-center gap-2 px-6 py-3.5 bg-white border border-gray-200/50 rounded-xl font-bold uppercase tracking-widest text-[#711113] hover:bg-gray-50 disabled:opacity-0 transition-opacity shadow-sm">
                  <ArrowLeft size={16} /> <span className="hidden sm:inline">Back</span>
                </button>
                
                {activeTab < tabNames.length - 1 ? (
                  <button type="button" onClick={nextTab} className="flex items-center gap-2 px-8 py-3.5 bg-emerald-600 text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 ml-auto">
                    Save & Continue <ChevronRight size={16} />
                  </button>
                ) : (
                  <button type="button" onClick={handleSubmit} className="flex items-center gap-2 px-8 py-3.5 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/30">
                    <Check size={18} /> {editingProject ? 'Update Project' : 'Publish Project'}
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
