"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Plus, Edit2, Trash2, Search, X, Check, Newspaper, Calendar, Tag, RefreshCw, User, Clock, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ImageUpload from "@/components/admin/ImageUpload";

const CATEGORIES = ["Insights", "Market Trends", "Guides"];

export default function BlogsAdminPage() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);

  const fetchBlogs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    category: "Insights",
    image: "",
    summary: "",
    content: "",
    author: "Sankalp Admin",
    readingTime: "5 min read",
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  });

  const filteredBlogs = blogs.filter(b => 
    b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenModal = (blog: any = null) => {
    if (blog) {
      setEditingBlog(blog);
      setFormData({ 
        ...blog,
        author: blog.author || "Sankalp Admin",
        readingTime: blog.readingTime || "5 min read"
      });
    } else {
      setEditingBlog(null);
      setFormData({ 
        title: "", 
        category: "Insights", 
        image: "", 
        summary: "",
        content: "",
        author: "Sankalp Admin",
        readingTime: "5 min read",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) 
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this blog post?")) {
      try {
        const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
        if (res.ok) {
          setBlogs(blogs.filter(b => (b._id || b.id) !== id));
        }
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBlog) {
        const id = editingBlog._id || editingBlog.id;
        const res = await fetch(`/api/blogs/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const updated = await res.json();
          setBlogs(blogs.map(b => (b._id || b.id) === id ? updated : b));
        }
      } else {
        const res = await fetch("/api/blogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          const created = await res.json();
          setBlogs([created, ...blogs]);
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Blog Management</h1>
          <p className="text-gray-500 text-sm">Manage project insights, news, and market updates for your clients.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-6 py-3 bg-[#711113] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:bg-[#520c0d] transition-all shadow-lg shadow-[#711113]/20"
        >
          <Plus size={18} /> New Blog Post
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search blogs by title or category..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] transition-all text-sm"
          />
        </div>
        <div className="flex gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
           Total Posts: {blogs.length}
        </div>
      </div>

      {/* Table View */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-50">
                <th className="px-6 py-5">Post Details</th>
                <th className="px-6 py-5">Category</th>
                <th className="px-6 py-5">Author</th>
                <th className="px-6 py-5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <RefreshCw size={40} className="animate-spin mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Posts...</p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {filteredBlogs.map((blog) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={blog._id || blog.id} 
                        className="hover:bg-gray-50/50 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-16 h-12 rounded-lg overflow-hidden shrink-0 shadow-sm">
                               <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-[#711113] transition-colors">{blog.title}</span>
                              <span className="text-[10px] text-gray-400 font-semibold">{blog.date}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full w-fit">
                            <Tag size={12} className="text-[#29B1D2]" /> {blog.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className="flex items-center gap-2 text-xs font-semibold text-gray-400">
                            <User size={14} /> {blog.author}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => handleOpenModal(blog)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                              title="Edit"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleDelete(blog._id || blog.id)}
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                    {filteredBlogs.length === 0 && (
                      <tr className="p-20 text-center">
                         <td colSpan={4} className="py-20 text-center">
                          <Newspaper size={48} className="mx-auto text-gray-200 mb-4" />
                          <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No matching blog posts found.</p>
                         </td>
                      </tr>
                    )}
                  </>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
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
              className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden relative z-10"
            >
              <div className="bg-[#711113] p-6 text-white flex justify-between items-center">
                <h2 className="font-bold uppercase tracking-widest flex items-center gap-2">
                  {editingBlog ? <Edit2 size={20} /> : <Plus size={20} />}
                  {editingBlog ? 'Edit Blog Post' : 'Compose Blog Post'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="hover:rotate-90 transition-transform">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Article Title</label>
                      <input 
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]"
                        placeholder="Enter post title..."
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Category</label>
                        <select 
                          required
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] text-sm font-semibold"
                        >
                          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Reading Time</label>
                        <input 
                          required
                          value={formData.readingTime}
                          onChange={(e) => setFormData({...formData, readingTime: e.target.value})}
                          className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]"
                          placeholder="e.g. 5 min read"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Author Name</label>
                      <input 
                        required
                        value={formData.author}
                        onChange={(e) => setFormData({...formData, author: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]"
                        placeholder="Author name..."
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    <ImageUpload 
                      label="Banner Image" 
                      value={formData.image} 
                      onChange={(url) => setFormData({ ...formData, image: url as string })} 
                    />
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Short Summary (Preview)</label>
                      <textarea 
                        required
                        rows={3}
                        value={formData.summary}
                        onChange={(e) => setFormData({...formData, summary: e.target.value})}
                        className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] resize-none"
                        placeholder="Brief summary for the listing page..."
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1 flex items-center gap-2">
                    <FileText size={14} /> Full Article Content
                  </label>
                  <textarea 
                    required
                    rows={10}
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    className="w-full p-6 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#29B1D2] text-sm leading-relaxed"
                    placeholder="Write your article here... You can use standard text or paste from a document."
                  />
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
                    <Check size={18} /> {editingBlog ? 'Update Post' : 'Publish Now'}
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
