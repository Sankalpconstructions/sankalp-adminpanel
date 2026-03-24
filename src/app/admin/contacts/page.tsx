"use client";
import React, { useState } from "react";
import { Trash2, Search, Mail, Phone, User, Calendar, MessageSquare, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { initialLeads } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";

export default function ContactsAdminPage() {
  const [leads, setLeads] = useState(initialLeads);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLead, setSelectedLead] = useState<any>(null);

  const filteredLeads = leads.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = (id: number) => {
    if (confirm("Permanently delete this inquiry?")) {
      setLeads(leads.filter(l => l.id !== id));
      if (selectedLead?.id === id) setSelectedLead(null);
    }
  };

  const updateStatus = (id: number, newStatus: string) => {
    setLeads(leads.map(l => l.id === id ? { ...l, status: newStatus } : l));
    if (selectedLead?.id === id) {
      setSelectedLead({ ...selectedLead, status: newStatus });
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

        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email or project..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] transition-all text-sm"
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase tracking-[0.2em] font-bold border-b border-gray-50">
                <th className="px-6 py-5">Client Name</th>
                <th className="px-6 py-5">Interested Project</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              <AnimatePresence mode="popLayout">
                {filteredLeads.map((lead) => (
                  <motion.tr 
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    key={lead.id} 
                    onClick={() => setSelectedLead(lead)}
                    className={`cursor-pointer transition-colors group ${selectedLead?.id === lead.id ? "bg-[#711113]/5" : "hover:bg-gray-50/50"}`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-gray-900">{lead.name}</span>
                        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{lead.date}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-semibold text-gray-600 group-hover:text-[#711113] transition-colors">{lead.project}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${
                          lead.status === 'New' ? 'bg-yellow-400 animate-pulse' :
                          lead.status === 'Follow-up' ? 'bg-blue-400' :
                          'bg-green-400'
                        }`}></div>
                        <span className="text-[10px] font-bold uppercase text-gray-500 tracking-widest">{lead.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(lead.id); }}
                        className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                       >
                         <Trash2 size={18} />
                       </button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredLeads.length === 0 && (
             <div className="p-20 text-center text-gray-400 text-xs font-bold uppercase tracking-widest">No inquiries match your search.</div>
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
              key={selectedLead.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-8 space-y-8"
            >
              <div className="flex flex-col items-center text-center">
                 <div className="w-20 h-20 bg-[#711113]/10 text-[#711113] rounded-3xl flex items-center justify-center text-3xl font-bold mb-4">
                   {selectedLead.name.charAt(0)}
                 </div>
                 <h3 className="text-xl font-bold text-gray-900">{selectedLead.name}</h3>
                 <p className="text-xs font-bold text-[#29B1D2] uppercase tracking-[0.2em]">{selectedLead.project}</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                   <div className="p-2 bg-white rounded-lg text-gray-400 group-hover:text-[#711113] shadow-sm"><Mail size={16} /></div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Email Address</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedLead.email}</span>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                   <div className="p-2 bg-white rounded-lg text-gray-400 shadow-sm"><Phone size={16} /></div>
                   <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Phone Number</span>
                      <span className="text-sm font-semibold text-gray-800">{selectedLead.phone}</span>
                   </div>
                </div>
              </div>

              <div className="space-y-3">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Client Message</span>
                 <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 text-sm text-gray-600 leading-relaxed italic">
                    &quot;{selectedLead.message}&quot;
                 </div>
              </div>

              <div className="space-y-3">
                 <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Action Progress</span>
                 <div className="flex gap-2">
                    <button 
                      onClick={() => updateStatus(selectedLead.id, 'New')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedLead.status === 'New' ? 'bg-yellow-400 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      <Clock size={14} className="mx-auto mb-1" /> New
                    </button>
                    <button 
                      onClick={() => updateStatus(selectedLead.id, 'Follow-up')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedLead.status === 'Follow-up' ? 'bg-blue-400 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      <AlertCircle size={14} className="mx-auto mb-1" /> Follow
                    </button>
                    <button 
                      onClick={() => updateStatus(selectedLead.id, 'Completed')}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${selectedLead.status === 'Completed' ? 'bg-green-400 text-white shadow-lg' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      <CheckCircle size={14} className="mx-auto mb-1" /> Close
                    </button>
                 </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-12 text-center text-gray-400">
               <User size={48} strokeWidth={1} className="mx-auto mb-4 opacity-20" />
               <p className="text-xs font-bold uppercase tracking-widest">Select a lead to view details and update status.</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
