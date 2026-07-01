"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useConfirm } from "@/context/ConfirmContext";
import {
  Plus,
  Trash2,
  Search,
  Check,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutAdminPage() {
  const { confirm } = useConfirm();

  const [entries, setEntries] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<any>(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    status: "Published",
  });

  const fetchAbout = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/about");
      const data = await res.json();
      setEntries(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  const filteredEntries = entries.filter((e) =>
    e.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenForm = (entry: any = null) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        title: entry.title,
        content: entry.content,
        status: entry.status,
      });
    } else {
      setEditingEntry(null);
      setFormData({
        title: "",
        content: "",
        status: "Published",
      });
    }

    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!(await confirm("Delete this section?"))) return;

    await fetch(`/api/about/${id}`, {
      method: "DELETE",
    });

    fetchAbout();
  };

  const handleSubmit = async () => {
    const method = editingEntry ? "PUT" : "POST";
    const url = editingEntry
      ? `/api/about/${editingEntry._id}`
      : "/api/about";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    setIsFormOpen(false);
    fetchAbout();
  };

  return (
    <div className="space-y-6">
      <motion.div
  key="list"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="space-y-8"
>
  {/* Header */}
  <div className="flex items-center justify-between">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">
        About Content
      </h1>
      <p className="text-gray-500 mt-1">
        Manage mission, vision, target and company sections
      </p>
    </div>

    <button
      onClick={() => handleOpenForm()}
      className="px-6 py-3 bg-[#711113] text-white rounded-xl font-semibold hover:bg-[#5b0d0f] transition"
    >
      + Add Section
    </button>
  </div>

  {/* Search */}
  <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
    <input
      type="text"
      placeholder="Search sections..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="w-full px-5 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#711113]"
    />
  </div>

  {/* Cards */}
  {isLoading ? (
    <div className="py-20 text-center">
      Loading...
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filteredEntries.map((entry) => (
        <motion.div
          key={entry._id}
          layout
          whileHover={{ y: -4 }}
          className="bg-white rounded-2xl border border-gray-200 p-7 shadow-sm hover:shadow-xl transition-all"
        >
          {/* Status */}
          <div className="flex justify-between items-center mb-5">
            <span
              className={`px-3 py-1 text-xs rounded-full font-semibold ${
                entry.status === "Published"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {entry.status}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            {entry.title}
          </h3>

          {/* Content */}
          <p className="text-gray-600 leading-7 line-clamp-5">
            {entry.content}
          </p>

          {/* Actions */}
          <div className="flex gap-3 mt-8">
            <button
              onClick={() => handleOpenForm(entry)}
              className="flex-1 py-3 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition"
            >
              Edit
            </button>

            <button
              onClick={() => handleDelete(entry._id)}
              className="px-5 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition"
            >
              Delete
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  )}
</motion.div>
    </div>
  );
}