"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Trash2, Search, Mail, Phone, User, Calendar, MessageSquare, CheckCircle, Clock, AlertCircle, RefreshCw, Filter, X, Save, History as HistoryIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

export default function ContactsAdminPage() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);
  
  // Filtering & Pagination State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [projectFilter, setProjectFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Remarks Modal State
  const [showRemarksModal, setShowRemarksModal] = useState(false);
  const [pendingStatus, setPendingStatus] = useState("");
  const [remarkText, setRemarkText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  const fetchLeads = useCallback(async () => {
    setIsLoading(true);
    try {
      // We fetch all for now, but apply local filtering for speed in the UI
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data);
    } catch (error) {
      console.error("Error fetching leads:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeads();
  }, [fetchLeads]);

  // Derived Data
  const projects = ["All", ...Array.from(new Set(leads.map(l => l.project)))];
  const statuses = ["All", "New", "Follow-up", "Completed", "Lost"];

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         l.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         l.phone.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || l.status === statusFilter;
    const matchesProject = projectFilter === "All" || l.project === projectFilter;
    return matchesSearch && matchesStatus && matchesProject;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDelete = async (id: string) => {
    if (confirm("Permanently delete this inquiry?")) {
      try {
        const res = await fetch(`/api/leads/${id}`, { method: "DELETE" });
        if (res.ok) {
          setLeads(leads.filter(l => (l._id || l.id) !== id));
          if ((selectedLead?._id || selectedLead?.id) === id) setSelectedLead(null);
          toast.success("Inquiry deleted successfully!");
        } else {
          toast.error("Failed to delete inquiry.");
        }
      } catch (error) {
        console.error("Error deleting lead:", error);
        toast.error("An error occurred while deleting.");
      }
    }
  };

  const handleStatusClick = (status: string) => {
    setPendingStatus(status);
    setRemarkText("");
    setShowRemarksModal(true);
  };

  const submitStatusUpdate = async () => {
    if (!selectedLead || !remarkText.trim()) return;

    setIsUpdating(true);
    const leadId = selectedLead._id || selectedLead.id;
    
    // We only send the new status and remark. The server handles $push.
    const updatePayload = {
      status: pendingStatus,
      remark: remarkText
    };

    try {
      const res = await fetch(`/api/leads/${leadId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });
      
      if (res.ok) {
        const result = await res.json();
        // The server returns the updated lead with the full history
        setLeads(leads.map(l => (l._id || l.id) === leadId ? result : l));
        setSelectedLead(result);
        setShowRemarksModal(false);
        setRemarkText("");
        toast.success("Status updated successfully!");
      } else {
        toast.error("Failed to update status.");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleReset = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedLead) return;
    
    if (confirm("Reset this lead? This will permanently clear all history and set status back to 'New'.")) {
      setIsUpdating(true);
      const leadId = selectedLead._id || selectedLead.id;
      
      try {
        const res = await fetch(`/api/leads/${leadId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reset: true }),
        });
        
        if (res.ok) {
          const result = await res.json();
          setLeads(leads.map(l => (l._id || l.id) === leadId ? result : l));
          setSelectedLead(result);
          toast.success("Lead reset successfully!");
        } else {
          toast.error("Failed to reset lead.");
        }
      } catch (error) {
        console.error("Error resetting lead:", error);
        toast.error("Failed to reset lead.");
      } finally {
        setIsUpdating(false);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* Leads List */}
      <div className="xl:col-span-2 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Lead Management</h1>
            <p className="text-gray-500 text-sm">Monitor and respond to prospective client inquiries.</p>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or phone..." 
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] transition-all text-sm"
            />
          </div>
          
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Status Filter</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select 
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] transition-all text-xs font-semibold appearance-none"
                >
                  {statuses.map(s => <option key={s} value={s}>{s === "All" ? "All Statuses" : s}</option>)}
                </select>
              </div>
            </div>
            
            <div className="flex-1 min-w-[200px]">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5 block ml-1">Project Filter</label>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <select 
                  value={projectFilter}
                  onChange={(e) => { setProjectFilter(e.target.value); setCurrentPage(1); }}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] transition-all text-xs font-semibold appearance-none"
                >
                  {projects.map(p => <option key={p} value={p}>{p === "All" ? "All Projects" : p}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-50">
                <th className="px-6 py-5">Client Name</th>
                <th className="px-6 py-5">Project</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  <tr>
                    <td colSpan={4} className="py-20 text-center">
                      <RefreshCw size={40} className="animate-spin mx-auto text-gray-200 mb-4" />
                      <p className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Loading Inquiries...</p>
                    </td>
                  </tr>
                ) : (
                  <>
                    {paginatedLeads.map((lead) => (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={lead._id || lead.id} 
                        onClick={() => setSelectedLead(lead)}
                        className={`cursor-pointer transition-colors group ${ (selectedLead?._id || selectedLead?.id) === (lead._id || lead.id) ? "bg-[#711113]/5" : "hover:bg-gray-50/50"}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-gray-900">{lead.name}</span>
                            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{lead.date}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-bold text-[#29B1D2] uppercase tracking-wider">{lead.project}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${
                              lead.status === 'New' ? 'bg-yellow-400 animate-pulse' :
                              lead.status === 'Follow-up' ? 'bg-blue-400' :
                              lead.status === 'Lost' ? 'bg-red-400' :
                              'bg-green-400'
                            }`}></div>
                            <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">{lead.status}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                           <button 
                            onClick={(e) => { e.stopPropagation(); handleDelete(lead._id || lead.id); }}
                            className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                           >
                             <Trash2 size={18} />
                           </button>
                        </td>
                      </motion.tr>
                    ))}
                  </>
                )}
              </AnimatePresence>
            </tbody>
          </table>
          
          {/* Pagination Controls */}
          <div className="p-4 bg-gray-50/50 border-t border-gray-50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Showing {paginatedLeads.length} of {filteredLeads.length} leads
            </span>
            <div className="flex gap-2">
              <button 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
                className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-600 disabled:opacity-50"
              >
                Prev
              </button>
              <button 
                disabled={currentPage === totalPages || totalPages === 0}
                onClick={() => setCurrentPage(p => p + 1)}
                className="px-4 py-2 bg-white border border-gray-100 rounded-lg text-[10px] font-bold uppercase tracking-widest text-gray-600 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>

          {filteredLeads.length === 0 && !isLoading && (
             <div className="p-20 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No inquiries match your filters.</div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden h-fit sticky top-24">
        <div className="p-6 border-b border-gray-50 bg-gray-50/50">
          <h2 className="font-bold text-gray-900 uppercase tracking-widest text-xs flex items-center gap-2">
            <MessageSquare size={16} className="text-[#711113]" /> Inquiry Details
          </h2>
        </div>
        
        <AnimatePresence mode="wait">
          {selectedLead ? (
            <motion.div 
              key={selectedLead._id || selectedLead.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar"
            >
              <div className="flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-[#711113]/10 text-[#711113] rounded-2xl flex items-center justify-center text-2xl font-bold mb-3">
                   {selectedLead.name.charAt(0)}
                 </div>
                 <h3 className="text-lg font-bold text-gray-900">{selectedLead.name}</h3>
                 <p className="text-[10px] font-bold text-[#29B1D2] uppercase tracking-[0.2em]">{selectedLead.project}</p>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                   <div className="p-2 bg-white rounded-lg text-gray-400 shadow-sm"><Mail size={14} /></div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Email</span>
                      <span className="text-xs font-semibold text-gray-800 truncate max-w-[150px]">{selectedLead.email}</span>
                   </div>
                </div>
                <div className="flex items-center gap-3 p-2.5 bg-gray-50 rounded-xl">
                   <div className="p-2 bg-white rounded-lg text-gray-400 shadow-sm"><Phone size={14} /></div>
                   <div className="flex flex-col">
                      <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Phone</span>
                      <span className="text-xs font-semibold text-gray-800">{selectedLead.phone}</span>
                   </div>
                </div>
              </div>

              <div className="space-y-2">
                 <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Original Inquiry</span>
                 <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-xs text-gray-600 leading-relaxed italic">
                    &quot;{selectedLead.message}&quot;
                 </div>
              </div>

              {/* Action Progress */}
              <div className="space-y-3 pt-2">
                 <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest ml-1">Update Status</span>
                 <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleStatusClick('Follow-up')}
                      className={`py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedLead.status === 'Follow-up' ? 'bg-blue-400 text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      <Clock size={12} /> Follow
                    </button>
                    <button 
                      onClick={() => handleStatusClick('Completed')}
                      className={`py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedLead.status === 'Completed' ? 'bg-green-400 text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      <CheckCircle size={12} /> Closed
                    </button>
                    <button 
                      onClick={() => handleStatusClick('Lost')}
                      className={`py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedLead.status === 'Lost' ? 'bg-red-400 text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      <X size={12} /> Lost
                    </button>
                    <button 
                      onClick={handleReset}
                      className={`py-2.5 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedLead.status === 'New' && (!selectedLead.history || selectedLead.history.length === 0) ? 'bg-yellow-400 text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      <RefreshCw size={12} className={isUpdating ? 'animate-spin' : ''} /> Reset
                    </button>
                 </div>
              </div>

              {/* Remark History Timeline */}
              <div className="space-y-4 pt-4 border-t border-gray-50">
                 <h4 className="text-[10px] font-extrabold text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
                   <HistoryIcon size={14} className="text-[#29B1D2]" /> Activity Timeline
                 </h4>
                 
                 <div className="space-y-6 relative ml-2">
                   <div className="absolute left-0 top-2 bottom-2 w-px bg-gray-100"></div>
                   
                   {/* If history is empty, show the initial creation as the first event */}
                   {(!selectedLead.history || selectedLead.history.length === 0) && (
                     <div className="relative pl-6">
                       <div className="absolute left-[-4px] top-1.5 w-2 h-2 rounded-full border-2 border-white bg-yellow-400"></div>
                       <div className="flex flex-col">
                          <div className="flex items-center justify-between gap-2 mb-1">
                             <span className="text-[9px] font-bold uppercase text-gray-900">Lead Received</span>
                             <span className="text-[8px] font-semibold text-gray-400">{selectedLead.date || new Date(selectedLead.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-50 italic">
                             &quot;Lead generated from website inquiry.&quot;
                          </p>
                       </div>
                     </div>
                   )}

                   {selectedLead.history && selectedLead.history.length > 0 && 
                     selectedLead.history.slice().reverse().map((item: any, idx: number) => {
                       const itemDate = item.date ? new Date(item.date) : new Date();
                       return (
                         <div key={idx} className="relative pl-6">
                           <div className={`absolute left-[-4px] top-1.5 w-2 h-2 rounded-full border-2 border-white ${
                             item.status === 'New' ? 'bg-yellow-400' :
                             item.status === 'Follow-up' ? 'bg-blue-400' :
                             item.status === 'Lost' ? 'bg-red-400' :
                             'bg-green-400'
                           }`}></div>
                           <div className="flex flex-col">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                 <span className="text-[9px] font-bold uppercase text-gray-900">{item.status}</span>
                                 <span className="text-[8px] font-semibold text-gray-400">
                                   {itemDate.toLocaleDateString()} {itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                 </span>
                              </div>
                              <p className="text-[11px] text-gray-600 bg-gray-50 p-2.5 rounded-lg border border-gray-50 italic">
                                 &quot;{item.remark}&quot;
                              </p>
                           </div>
                         </div>
                       );
                     })
                   }
                 </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-12 text-center text-gray-400">
               <User size={48} strokeWidth={1} className="mx-auto mb-4 opacity-20" />
               <p className="text-xs font-bold uppercase tracking-widest">Select a lead to view history and update status.</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Remarks Modal */}
      <AnimatePresence>
        {showRemarksModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRemarksModal(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
                 <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-widest flex items-center gap-2">
                   <Save size={16} className="text-[#29B1D2]" /> Log Client Response
                 </h3>
                 <button onClick={() => setShowRemarksModal(false)} className="text-gray-400 hover:text-gray-900"><X size={20} /></button>
              </div>
              
              <div className="p-8 space-y-6">
                 <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1">New Status</label>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[10px] font-bold uppercase tracking-widest ${
                      pendingStatus === 'Follow-up' ? 'bg-blue-50 border-blue-100 text-blue-600' :
                      pendingStatus === 'Completed' ? 'bg-green-50 border-green-100 text-green-600' :
                      pendingStatus === 'Lost' ? 'bg-red-50 border-red-100 text-red-600' :
                      'bg-yellow-50 border-yellow-100 text-yellow-600'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        pendingStatus === 'Follow-up' ? 'bg-blue-400' :
                        pendingStatus === 'Completed' ? 'bg-green-400' :
                        pendingStatus === 'Lost' ? 'bg-red-400' :
                        'bg-yellow-400'
                      }`}></div>
                      {pendingStatus}
                    </div>
                 </div>

                 <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 block ml-1">Response Remarks</label>
                    <textarea 
                      autoFocus
                      rows={4}
                      value={remarkText}
                      onChange={(e) => setRemarkText(e.target.value)}
                      placeholder="What was the client's response? E.g., 'Will visit site on Sunday', 'Interested in 3BHK', etc."
                      className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl outline-none focus:border-[#29B1D2] text-sm text-gray-700 transition-all resize-none"
                    />
                 </div>

                 <button 
                  onClick={submitStatusUpdate}
                  disabled={!remarkText.trim() || isUpdating}
                  className="w-full py-4 bg-[#711113] hover:bg-[#520c0d] text-white font-bold uppercase tracking-widest text-xs rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                 >
                   {isUpdating ? <RefreshCw size={16} className="animate-spin" /> : <Save size={16} />}
                   {isUpdating ? "Saving..." : "Save Remark & Update Status"}
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #e5e7eb;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #d1d5db;
        }
      `}</style>
    </div>
  );
}
