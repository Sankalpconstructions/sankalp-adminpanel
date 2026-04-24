"use client";
import React, { useState, useEffect } from "react";
import { Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminRegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/check-admin")
      .then((res) => res.json())
      .then((data) => {
        if (data.exists) {
          window.location.href = "/admin/login";
        } else {
          setIsChecking(false);
        }
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess("Admin created successfully! Redirecting...");
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
      } else {
        setError(data.error || "Registration failed. Please try again.");
        setIsLoading(false);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Checking...</div>;
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-[#711113] p-6 text-center relative overflow-hidden">
            <h1 className="text-white text-lg font-bold uppercase tracking-widest mt-2">Admin Setup</h1>
            <p className="text-white/70 text-xs mt-1">Create Super Admin</p>
          </div>
          <div className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Email</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input required type="email" name="email" className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:bg-white text-sm" placeholder="Enter Admin Email" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input required type={showPassword ? "text" : "password"} name="password" className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:bg-white text-sm" placeholder="Enter Password" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input required type={showPassword ? "text" : "password"} name="confirmPassword" className="w-full pl-10 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:bg-white text-sm" placeholder="Confirm Password" />
                </div>
              </div>
              {error && <p className="text-red-500 text-xs font-semibold text-center bg-red-50 p-2 rounded-xl">{error}</p>}
              {success && <p className="text-green-500 text-xs font-semibold text-center bg-green-50 p-2 rounded-xl">{success}</p>}
              <button type="submit" disabled={isLoading} className="w-full py-3 bg-[#711113] hover:bg-[#520c0d] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-70 mt-2">
                {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Register Admin</>}
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
