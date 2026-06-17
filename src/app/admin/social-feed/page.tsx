"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Search, X, Check, Share2, Instagram, Youtube, Globe, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const getYoutubeEmbedUrl = (url: string) => {
  let videoId = "";
  try {
    if (url.includes("youtube.com/watch")) {
      const urlObj = new URL(url);
      videoId = urlObj.searchParams.get("v") || "";
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1]?.split("?")[0] || "";
    } else if (url.includes("youtube.com/embed/")) {
      videoId = url.split("youtube.com/embed/")[1]?.split("?")[0] || "";
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("youtube.com/shorts/")[1]?.split("?")[0] || "";
    }
  } catch (e) {
    console.error("Error parsing YouTube URL", e);
  }
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
};

const detectPlatform = (url: string): string => {
  const cleanUrl = url.toLowerCase();
  if (cleanUrl.includes("instagram.com")) return "instagram";
  if (cleanUrl.includes("youtube.com") || cleanUrl.includes("youtu.be")) return "youtube";
  if (cleanUrl.includes("facebook.com")) return "facebook";
  if (cleanUrl.includes("twitter.com") || cleanUrl.includes("x.com")) return "twitter";
  return "other";
};

export default function SocialFeedAdminPage() {
  const [feeds, setFeeds] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  // Form State
  const [formData, setFormData] = useState({
    embedUrl: "",
    title: "",
  });

  const fetchFeeds = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/social-feeds");
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setFeeds(data);
        } else {
          setFeeds([]);
          console.error("Expected array from social-feeds API, got:", data);
        }
      } else {
        setFeeds([]);
        toast.error("Failed to load feed items.");
      }
    } catch (error) {
      console.error("Error fetching social feeds:", error);
      setFeeds([]);
      toast.error("Failed to load feed items.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  // Load Instagram embed script for previews
  useEffect(() => {
    if (isModalOpen || feeds.some(f => f.platform === "instagram")) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      document.body.appendChild(script);
      
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [isModalOpen, feeds]);

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to remove this social feed item from the website?")) {
      try {
        const res = await fetch(`/api/social-feeds/${id}`, { method: "DELETE" });
        if (res.ok) {
          setFeeds(feeds.filter(f => (f._id || f.id) !== id));
          toast.success("Social feed item deleted successfully!");
        } else {
          toast.error("Failed to delete the item.");
        }
      } catch (error) {
        console.error("Error deleting social feed item:", error);
        toast.error("Failed to delete the item.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = formData.embedUrl.trim();
    if (!url) {
      toast.error("Please enter a valid URL.");
      return;
    }

    const platform = detectPlatform(url);

    try {
      const res = await fetch("/api/social-feeds", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          embedUrl: url,
          title: formData.title.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setFeeds([data, ...feeds]);
        setIsModalOpen(false);
        setFormData({ embedUrl: "", title: "" });
        toast.success("Feed item added successfully!");
      } else {
        toast.error(data.error || "Failed to add feed item.");
      }
    } catch (error) {
      console.error("Error saving social feed item:", error);
      toast.error("Failed to save changes.");
    }
  };

  const filteredFeeds = feeds.filter(f => 
    (f.title || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.embedUrl || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.platform || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Social Media Feed</h1>
          <p className="text-gray-500 text-sm">Add and manage Live Updates (Instagram posts, Reels, or YouTube videos) for the homepage carousel.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20"
        >
          <Plus size={18} /> Add Feed URL
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by title, platform or URL..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] transition-all text-sm"
          />
        </div>
        <div className="flex gap-2">
          <span className="bg-gray-50 text-gray-500 border border-gray-100 px-4 py-2 rounded-xl text-xs font-bold uppercase">Total Items: {filteredFeeds.length}</span>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw size={40} className="animate-spin mb-4 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-widest">Loading Live Feed...</p>
            </div>
          ) : (
            <>
              {filteredFeeds.map((feed) => {
                const isInstagram = feed.platform === "instagram";
                const isYoutube = feed.platform === "youtube";
                const ytEmbed = isYoutube ? getYoutubeEmbedUrl(feed.embedUrl) : null;

                return (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={feed._id || feed.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col overflow-hidden relative group hover:border-[#29B1D2] transition-all"
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-50 shrink-0 bg-gray-50/50">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
                          isInstagram ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600" :
                          isYoutube ? "bg-red-600" : "bg-gray-500"
                        }`}>
                          {isInstagram && <Instagram size={16} />}
                          {isYoutube && <Youtube size={16} />}
                          {!isInstagram && !isYoutube && <Globe size={16} />}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs capitalize text-gray-900">{feed.platform} Update</h4>
                          {feed.title && <p className="text-[10px] text-gray-400 font-semibold line-clamp-1">{feed.title}</p>}
                        </div>
                      </div>
                      <button 
                        onClick={() => handleDelete(feed._id || feed.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 bg-gray-50 flex flex-col justify-center items-center min-h-[300px] overflow-y-auto max-h-[400px] p-2 chat-scroll">
                      {isYoutube && ytEmbed ? (
                        <iframe
                          src={ytEmbed}
                          className="w-full h-full min-h-[280px] rounded-xl border-0 aspect-video"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      ) : isInstagram ? (
                        <div className="w-full bg-white flex flex-col scale-[0.8] origin-top my-1">
                          <blockquote
                            className="instagram-media"
                            data-instgrm-permalink={feed.embedUrl}
                            data-instgrm-version="14"
                            style={{ width: "100%", margin: 0, padding: 0 }}
                          />
                        </div>
                      ) : (
                        <div className="text-center p-6 text-gray-400">
                          <Globe size={32} className="mx-auto mb-2 opacity-30" />
                          <p className="text-xs font-bold uppercase tracking-wider mb-2">Direct Link Feed</p>
                          <a href={feed.embedUrl} target="_blank" rel="noreferrer" className="text-xs text-[#29B1D2] font-semibold break-all underline line-clamp-2">
                            {feed.embedUrl}
                          </a>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
          
          {!isLoading && filteredFeeds.length === 0 && (
            <div className="col-span-full py-16 text-center text-gray-400 bg-white rounded-2xl border border-gray-100 shadow-sm">
              <Share2 size={48} className="mx-auto mb-4 opacity-20 animate-pulse" />
              <p className="font-semibold text-sm">No feed items found. Try adding a social media link!</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add Feed Item Modal */}
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
                  <Plus size={20} /> Add Live Feed URL
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Social Feed URL</label>
                  <input 
                    required
                    type="url"
                    value={formData.embedUrl}
                    onChange={(e) => setFormData({...formData, embedUrl: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm"
                    placeholder="e.g. https://www.instagram.com/p/..."
                  />
                  <p className="text-[10px] text-gray-400 italic">Supports Instagram posts/reels and YouTube videos/Shorts.</p>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Description / Title (Optional)</label>
                  <input 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm"
                    placeholder="e.g. Wakad Project Site Update"
                  />
                </div>

                {formData.embedUrl && (
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 flex items-center gap-3">
                    <span className="text-[10px] font-bold uppercase text-gray-400">Detected:</span>
                    <span className={`text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full ${
                      detectPlatform(formData.embedUrl) === "instagram" ? "bg-pink-50 text-pink-700 border border-pink-100" :
                      detectPlatform(formData.embedUrl) === "youtube" ? "bg-red-50 text-red-700 border border-red-100" :
                      "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}>
                      {detectPlatform(formData.embedUrl)}
                    </span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-4 bg-[#711113] text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-[#520c0d] transition-colors shadow-lg shadow-[#711113]/20 flex items-center justify-center gap-2"
                >
                  <Check size={18} /> Save Feed Item
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
