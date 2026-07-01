"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useConfirm } from "@/context/ConfirmContext";
import { Plus, Edit2, Trash2, Search, Check, AlertCircle, Image as ImageIcon, MapPin, AlignLeft, Layers, ArrowLeft, Building2, ChevronRight, ChevronLeft, List, IndianRupee, Sparkles, Map, Navigation, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "@/components/admin/ImageUpload";
import { deleteFromImageKit, uploadToImageKit } from "@/lib/imagekit-client";
import toast from "react-hot-toast";


export default function ProjectsAdminPage() {
  const { confirm } = useConfirm();

  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<any>(null);


  const fetchProjects = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setProjects(data);
        } else {
          setProjects([]);
          console.error("Expected array from projects API, got:", data);
        }
      } else {
        setProjects([]);
        console.error("Failed to fetch projects, server returned status:", res.status);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      setProjects([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);
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
    possessionDate: "",
    totalFloors: "",
    totalUnits: "",
    rera: "",
    status: "Upcoming",
    amenitiesCount: "",
    priceStarting: "",
    banners: [] as string[],
    mobileBanners: [] as string[],
    highlights: [""] as string[],
    priceConfigurations: [{ configuration: "", carpetArea: "", superBuiltUpArea: "", udsSqYards: "", price: "" }],
    amenities: [] as string[],
    landmarks: [] as { type: string; text: string }[],
    brochures: [] as { name: string, url: string }[],
    floorPlans: [] as string[],
    gallery: [] as { desktop: string; mobile: string }[],
    mapSrc: ""
  });

  const [customAmenityText, setCustomAmenityText] = useState("");
  const [landmarkType, setLandmarkType] = useState("School/College");
  const [landmarkText, setLandmarkText] = useState("");
  const [brochureUploading, setBrochureUploading] = useState(false);

  const filteredProjects = projects.filter(p =>
    (p.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    (p.location?.toLowerCase() || "").includes(searchTerm.toLowerCase())
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
        mobileBanners: project.mobileBanners || [],
        highlights: project.highlights || [""],
        priceConfigurations: (project.priceConfigurations && project.priceConfigurations.length > 0)
          ? project.priceConfigurations
          : [{ configuration: "", carpetArea: "", superBuiltUpArea: "", udsSqYards: "", price: "" }],
        amenities: project.amenities || [],
        landmarks: project.landmarks || [],
        brochures: project.brochures || [],
        floorPlans: project.floorPlans || [],
        gallery: (project.gallery || []).map((img: any) => {
          if (typeof img === 'string') {
            return { desktop: img, mobile: img };
          }
          return {
            desktop: img.desktop || "",
            mobile: img.mobile || ""
          };
        }),
        mapSrc: project.mapSrc || "",
        status: project.status || "Ongoing",
        amenitiesCount: "10+",
        priceStarting: project.priceStarting || "Price on Request"
      });
    } else {
      setEditingProject(null);
      setFormData({
        title: "", location: "", type: "", description: "",
        possessionDate: "",
        totalFloors: "",
        totalUnits: "",
        rera: "",
        status: "Upcoming", amenitiesCount: "", priceStarting: "",
        banners: [],
        mobileBanners: [],
        highlights: [""],
        priceConfigurations: [{ configuration: "", carpetArea: "", superBuiltUpArea: "", udsSqYards: "", price: "" }],
        amenities: [],
        landmarks: [],
        brochures: [],
        floorPlans: [],
        gallery: [] as { desktop: string; mobile: string }[],
        mapSrc: ""
      });
    }
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (await confirm("Are you sure you want to delete this project?")) {
      try {
        const res = await fetch(`/api/projects/${id}`, { method: "DELETE" });
        if (res.ok) {
          setProjects(projects.filter(p => (p._id || p.id) !== id));
          toast.success("Project deleted successfully");
        } else {
          toast.error("Failed to delete project");
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!formData.title) {
      toast.error("Please provide a project title in the Overview tab.");
      setActiveTab(0);
      return;
    }

    // Filter out completely empty configuration rows
    const cleanedPriceConfigurations = (formData.priceConfigurations || []).filter(config =>
      config.configuration?.trim() ||
      config.carpetArea?.trim() ||
      config.superBuiltUpArea?.trim() ||
      config.udsSqYards?.trim() ||
      config.price?.trim()
    );

    // Filter out completely empty highlights
    const cleanedHighlights = (formData.highlights || []).map(h => h.trim()).filter(Boolean);

    // Filter out completely empty gallery entries
    const cleanedGallery = (formData.gallery || []).filter(item => item.desktop?.trim() || item.mobile?.trim());

    // Validate that remaining entries have BOTH desktop and mobile images
    const hasIncompleteGallery = cleanedGallery.some(item => !item.desktop?.trim() || !item.mobile?.trim());
    if (hasIncompleteGallery) {
      toast.error("Both Desktop (Big Screen) and Mobile (Small Screen) images are mandatory for all Visual Tour items.");
      setActiveTab(4); // Switch to Plans & Gallery tab
      return;
    }

    try {
      const projectData = {
        ...formData,
        priceConfigurations: cleanedPriceConfigurations,
        highlights: cleanedHighlights,
        gallery: cleanedGallery,
        image: formData.banners.filter(Boolean)[0] || "",
        mobileBanners: formData.mobileBanners.filter(Boolean),
      };

      if (editingProject) {
        const id = editingProject._id || editingProject.id;
        const res = await fetch(`/api/projects/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
        if (res.ok) {
          const updated = await res.json();
          setProjects(projects.map(p => (p._id || p.id) === id ? updated : p));
          toast.success("Project updated successfully!");
        }
      } else {
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(projectData),
        });
        if (res.ok) {
          const created = await res.json();
          setProjects([created, ...projects]);
          toast.success("Project published successfully!");
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Failed to save project");
    }
  };

  const validateCurrentTab = (): boolean => {
    if (activeTab === 0) {
      if (!formData.title) {
        toast.error("Please at least provide a project title.");
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
    setFormData({ ...formData, highlights: newH });
  };
  const addHighlight = () => setFormData({ ...formData, highlights: [...formData.highlights, ""] });

  const handlePriceConfigChange = (idx: number, field: string, val: string) => {
    const newC = [...formData.priceConfigurations];
    newC[idx] = { ...newC[idx], [field]: val };
    setFormData({ ...formData, priceConfigurations: newC });
  };
  const addPriceConfig = () => setFormData({ ...formData, priceConfigurations: [...formData.priceConfigurations, { configuration: "", carpetArea: "", superBuiltUpArea: "", udsSqYards: "", price: "" }] });
  const removePriceConfig = (idx: number) => {
    const newC = formData.priceConfigurations.filter((_, i) => i !== idx);
    setFormData({ ...formData, priceConfigurations: newC });
  };

  const toggleAmenity = (amenity: string) => {
    const exists = formData.amenities.includes(amenity);
    if (exists) {
      setFormData({ ...formData, amenities: formData.amenities.filter(a => a !== amenity) });
    } else {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  const addCustomAmenity = () => {
    if (customAmenityText.trim()) {
      if (!formData.amenities.includes(customAmenityText.trim())) {
        setFormData({ ...formData, amenities: [...formData.amenities, customAmenityText.trim()] });
      }
      setCustomAmenityText("");
    }
  };

  const addLandmark = () => {
    if (landmarkText.trim()) {
      setFormData({ ...formData, landmarks: [...formData.landmarks, { type: landmarkType, text: landmarkText.trim() }] });
      setLandmarkText("");
    }
  };
  const removeLandmark = (idx: number) => {
    const newL = formData.landmarks.filter((_, i) => i !== idx);
    setFormData({ ...formData, landmarks: newL });
  };

  const standardAmenitiesList = [
    'Automatic Lift',
    '24×7 CCTV Surveillance',
    'Manjeera Water Supply',
    'Automatic Water Control System',
    'Partial Power Backup',
    'Power Backup for Common Areas',
    'Sundeck',
    'Terrace Party Area',
    'Rainwater Harvesting',
    'Landscaped Setback Areas'
  ];


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
              {isLoading ? (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 py-20 flex flex-col items-center justify-center text-gray-400">
                  <RefreshCw size={40} className="animate-spin mb-4 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">Loading Projects...</p>
                </div>
              ) : (
                <>
                  {paginatedProjects.map((project) => (
                    <motion.div layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} key={project._id || project.id} className="bg-white rounded-2xl border border-gray-200/50 shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden group hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] transition-all flex flex-col">
                      <div className="h-48 relative overflow-hidden shrink-0">
                        <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-4 left-4 flex gap-2">
                          <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-full ${project.status === 'Ongoing' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : project.status === 'Completed' ? 'bg-gray-100 text-gray-700 border border-gray-200' : 'bg-amber-50 text-amber-700 border border-amber-100'}`}>
                            {project.status || 'N/A'}
                          </span>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2">
                          <button onClick={() => handleOpenForm(project)} className="p-2 bg-white/90 backdrop-blur text-blue-600 rounded-lg shadow-lg hover:bg-blue-600 hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">
                            <Edit2 size={16} />
                          </button>
                          <button onClick={() => handleDelete(project._id || project.id)} className="p-2 bg-white/90 backdrop-blur text-red-600 rounded-lg shadow-lg hover:bg-red-600 hover:text-white transition-all transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 delay-75">
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
                </>
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
                onClick={async () => {
                  if (await confirm("Are you sure you want to go back? Unsaved progress will be lost.")) setIsFormOpen(false)
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
                  return (
                    <div key={idx} className="flex flex-col items-center bg-white px-2 cursor-default">
                      <button
                        onClick={() => {
                          setActiveTab(idx);
                        }}
                        className={`w-10 h-10 pos-relative rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isActive 
                            ? 'bg-[#711113] text-white shadow-lg shadow-[#711113]/30 scale-110'
                            : 'bg-white border-2 border-gray-200 text-gray-600 cursor-pointer hover:bg-rose-50 hover:border-[#711113]/30 hover:text-[#711113]'
                          }`}
                      >
                        {idx + 1}
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
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-[#711113]/10 text-[#711113] rounded-xl"><AlignLeft size={20} /></div>
                        <div>
                          <h2 className="text-xl font-bold text-gray-900">Project Overview</h2>
                          <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">Basic Property Information</p>
                        </div>
                      </div>
                      {editingProject && (
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-mono text-gray-600">
                          <span className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Project ID:</span>
                          <span>{editingProject._id || editingProject.id}</span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(editingProject._id || editingProject.id);
                              toast.success("Project ID copied to clipboard!");
                            }}
                            className="p-1 hover:bg-gray-200 rounded text-gray-400 hover:text-gray-800 transition-colors"
                            title="Copy ID"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"></path>
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Project Title *</label>
                        <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:ring-1 focus:ring-[#29B1D2]/20 transition-all font-bold text-gray-900" placeholder="e.g. Sankalp Heights Premium" />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Location *</label>
                          <input value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:ring-1 focus:ring-[#29B1D2]/20 transition-all" placeholder="e.g. Wakad, Pune" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Property Type *</label>
                          <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:ring-1 focus:ring-[#29B1D2]/20 transition-all text-gray-700 font-bold">
                            <option value="">Select Type...</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Villa">Villa</option>
                          </select>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Project Status *</label>
                          <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:ring-1 focus:ring-[#29B1D2]/20 transition-all text-gray-700">
                            <option value="Upcoming">Upcoming (Coming Soon)</option>
                            <option value="Ongoing">Ongoing (Under Construction)</option>
                            <option value="Completed">Completed (Ready to Move)</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Possession</label>
                          <input value={formData.possessionDate} onChange={(e) => setFormData({ ...formData, possessionDate: e.target.value })} placeholder="e.g. Dec 2026 / Q4 2026" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Total Floors</label>
                          <input value={formData.totalFloors} onChange={(e) => setFormData({ ...formData, totalFloors: e.target.value })} placeholder="e.g. 12" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Total Units</label>
                          <input value={formData.totalUnits} onChange={(e) => setFormData({ ...formData, totalUnits: e.target.value })} placeholder="e.g. 96" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">RERA ID</label>
                          <input value={formData.rera} onChange={(e) => setFormData({ ...formData, rera: e.target.value })} placeholder="e.g. P52100000000" className="w-full p-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]" />
                        </div>
                      </div>
                      <ImageUpload
                        label="Banner Images (Max 3) *"
                        value={formData.banners}
                        onChange={(urls) => setFormData({
                          ...formData,
                          banners: (Array.isArray(urls) ? urls : [urls]).filter(Boolean)
                        })}
                        multiple={true}
                        maxFiles={3}
                      />

                      <ImageUpload
                        label="Mobile Banner Images (Max 3)"
                        value={formData.mobileBanners}
                        onChange={(urls) => setFormData({
                          ...formData,
                          mobileBanners: (Array.isArray(urls) ? urls : [urls]).filter(Boolean)
                        })}
                        multiple={true}
                        maxFiles={3}
                      />

                      <div>
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 block mb-2">Full Description *</label>
                        <textarea rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:ring-1 focus:ring-[#29B1D2]/20 resize-none transition-all leading-relaxed" placeholder="Write a comprehensive description of the property..."></textarea>
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
                        <div className="overflow-x-auto chat-scroll rounded-xl border border-gray-200">
                          <table className="w-full text-left text-sm min-w-[800px]">
                            <thead className="bg-gray-50 text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                              <tr>
                                <th className="p-4 whitespace-nowrap">Configuration</th>
                                <th className="p-4 whitespace-nowrap">Carpet Area</th>
                                <th className="p-4 whitespace-nowrap">Super Built-up Area</th>
                                <th className="p-4 whitespace-nowrap">UDS Sq.Yards</th>
                                <th className="p-4 whitespace-nowrap">Price</th>
                                <th className="p-4 text-right whitespace-nowrap">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {formData.priceConfigurations.map((config, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50">
                                  <td className="p-4 min-w-[160px]"><input value={config.configuration} onChange={e => handlePriceConfigChange(idx, 'configuration', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-gray-700 font-medium placeholder:text-gray-300" placeholder="e.g. 2 BHK Premium" /></td>
                                  <td className="p-4 min-w-[120px]"><input value={config.carpetArea} onChange={e => handlePriceConfigChange(idx, 'carpetArea', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-gray-700 font-medium placeholder:text-gray-300" placeholder="e.g. 750 sq.ft." /></td>
                                  <td className="p-4 min-w-[140px]"><input value={config.superBuiltUpArea} onChange={e => handlePriceConfigChange(idx, 'superBuiltUpArea', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-gray-700 font-medium placeholder:text-gray-300" placeholder="e.g. 1050 sq.ft." /></td>
                                  <td className="p-4 min-w-[120px]"><input value={config.udsSqYards} onChange={e => handlePriceConfigChange(idx, 'udsSqYards', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-gray-700 font-medium placeholder:text-gray-300" placeholder="e.g. 40 Sq.Yds" /></td>
                                  <td className="p-4 min-w-[120px]"><input value={config.price} onChange={e => handlePriceConfigChange(idx, 'price', e.target.value)} className="w-full p-2.5 bg-white border border-gray-200 rounded-lg outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 transition-all text-gray-700 font-medium placeholder:text-gray-300" placeholder="e.g. ₹ 65 L" /></td>
                                  <td className="p-4 text-right min-w-[60px]">
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
                          <input type="file" accept=".pdf" className="hidden" id="brochure-upload" disabled={brochureUploading} onChange={async (e) => {
                            if (e.target.files && e.target.files[0]) {
                              const file = e.target.files[0];
                              setBrochureUploading(true);
                              try {
                                const url = await uploadToImageKit(file);
                                console.log('Brochure uploaded, url:', url);
                                if (!url) {
                                  toast.error('Brochure upload returned empty URL');
                                } else {
                                  toast.success('Brochure uploaded');
                                }
                                setFormData({ ...formData, brochures: [{ name: file.name, url }] });
                              } catch (err: unknown) {
                                console.error('Brochure upload failed:', err);

                                const message =
                                  err instanceof Error
                                    ? err.message
                                    : 'network error';

                                toast.error("Failed to upload brochure: " + message);
                              } finally {
                                setBrochureUploading(false);
                              }
                            }
                          }} />
                          <label htmlFor="brochure-upload" className={`mt-1 px-4 py-1.5 ${brochureUploading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-600 cursor-pointer'} border border-gray-200 font-bold uppercase text-[10px] tracking-widest rounded-lg shadow-sm hover:${brochureUploading ? '' : 'bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'} transition-all`}>
                            {brochureUploading ? 'Uploading...' : 'Browse File'}
                          </label>
                          {brochureUploading && <div className="mt-3 text-xs text-gray-500">Uploading brochure, please wait...</div>}
                        </div>
                        {formData.brochures.length > 0 && (
                          <div className="mt-4 flex flex-col gap-2">
                            {formData.brochures.map((doc, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-indigo-50 border border-indigo-100 p-3 rounded-lg shadow-sm">
                                <span className="text-xs font-bold text-indigo-700 truncate w-3/4">{doc.name}</span>
                                <button type="button" onClick={() => {
                                  if (doc.url) deleteFromImageKit(doc.url);
                                  setFormData({ ...formData, brochures: formData.brochures.filter((_, i) => i !== idx) });
                                }} className="text-indigo-400 hover:text-red-500 transition-colors"><Trash2 size={14} /></button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Floor Plans Upload */}
                      <div className="md:col-span-1">
                        <ImageUpload
                          label="Project Floor Plans"
                          value={formData.floorPlans}
                          onChange={(urls) => setFormData({ ...formData, floorPlans: urls as string[] })}
                          multiple={true}
                          maxFiles={10}
                        />
                      </div>

                      {/* Visual Tour / Gallery Editor */}
                      <div className="md:col-span-3 border-t border-gray-100 pt-6 mt-2">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest ml-1">Visual Tour Images (Gallery)</h3>
                            <p className="text-[10px] text-gray-400 mt-1 ml-1">Upload both Desktop and Mobile views. Both are mandatory.</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => setFormData({
                              ...formData,
                              gallery: [...formData.gallery, { desktop: "", mobile: "" }]
                            })}
                            className="flex items-center gap-1.5 px-4 py-2 bg-[#711113]/5 hover:bg-[#711113]/10 text-[#711113] rounded-lg font-bold text-[10px] uppercase tracking-wider transition-colors"
                          >
                            + Add Image Pair
                          </button>
                        </div>

                        {formData.gallery.length === 0 ? (
                          <div className="p-10 text-center bg-gray-50 border border-gray-200 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2">
                            <ImageIcon size={32} className="text-gray-300" />
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">No visual tour images added yet.</p>
                            <p className="text-[10px] text-gray-400">Click the button above to add your first image pair.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {formData.gallery.map((item, idx) => (
                              <div key={idx} className="relative p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-shadow group/card">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setFormData({
                                      ...formData,
                                      gallery: formData.gallery.filter((_, i) => i !== idx)
                                    });
                                  }}
                                  className="absolute top-4 right-4 p-2 bg-rose-50 hover:bg-[#711113] text-[#711113] hover:text-white rounded-lg transition-all z-10 shadow-sm"
                                >
                                  <Trash2 size={13} />
                                </button>
                                
                                <div className="text-xs font-bold text-[#711113] border-b border-gray-50 pb-2">
                                  Visual Tour Entry #{idx + 1}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <ImageUpload
                                      label="Desktop Image"
                                      value={item.desktop}
                                      onChange={(url) => {
                                        const newG = [...formData.gallery];
                                        newG[idx] = { ...newG[idx], desktop: url as string };
                                        setFormData({ ...formData, gallery: newG });
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <ImageUpload
                                      label="Mobile Image"
                                      value={item.mobile}
                                      onChange={(url) => {
                                        const newG = [...formData.gallery];
                                        newG[idx] = { ...newG[idx], mobile: url as string };
                                        setFormData({ ...formData, gallery: newG });
                                      }}
                                    />
                                  </div>
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
                        <input
                          value={formData.mapSrc || ""}
                          onChange={(e) => setFormData({ ...formData, mapSrc: e.target.value })}
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-sm font-mono"
                          placeholder="&lt;iframe src='...' /&gt;"
                        />
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
                                <button type="button" onClick={() => removeLandmark(i)} className="text-gray-400 hover:text-rose-500 hover:bg-rose-50 p-2 rounded-lg transition-colors"><Trash2 size={16} /></button>
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
