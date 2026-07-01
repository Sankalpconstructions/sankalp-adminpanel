"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X, Check } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmModal({ isOpen, message, onConfirm, onCancel }: ConfirmModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          />
          <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md pointer-events-auto border border-gray-100"
            >
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-2xl flex items-center justify-center shrink-0">
                    <AlertCircle size={24} />
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg font-black text-gray-900 tracking-tight">Are you sure?</h3>
                    <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                      {message}
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  onClick={onCancel}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-gray-600 bg-white border border-gray-200 hover:bg-gray-100 hover:text-gray-900 transition-all flex items-center justify-center gap-2"
                >
                  <X size={16} /> <span className="pt-[2px]">Cancel</span>
                </button>
                <button
                  onClick={onConfirm}
                  className="px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest text-white bg-[#711113] hover:bg-[#520c0d] shadow-lg shadow-[#711113]/20 transition-all flex items-center justify-center gap-2"
                >
                  <Check size={16} /> <span className="pt-[2px]">Confirm</span>
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
