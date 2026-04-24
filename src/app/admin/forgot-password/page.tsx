"use client";
import React, { useState } from "react";
import { Mail, Lock, KeyRound, ArrowRight, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "otp" | "reset">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("OTP sent to your email.");
        setStep("otp");
      } else {
        setError(data.error || "Failed to send OTP.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("OTP Verified. Please reset your password.");
        setStep("reset");
      } else {
        setError(data.error || "Invalid OTP.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, otp, newPassword }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setSuccess("Password reset successfully. Redirecting to login...");
        setTimeout(() => {
          window.location.href = "/admin/login";
        }, 2000);
      } else {
        setError(data.error || "Failed to reset password.");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-sm w-full">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative">
          <div className="absolute top-4 left-4 z-20">
            <a href="/admin/login" className="text-white/80 hover:text-white transition-colors bg-black/20 hover:bg-black/40 rounded-full p-2 block backdrop-blur-md">
               <ArrowLeft size={16} />
            </a>
          </div>
          <div className="bg-[#711113] p-6 pt-10 text-center relative overflow-hidden">
            <h1 className="text-white text-lg font-bold uppercase tracking-widest mt-2">Reset Password</h1>
          </div>
          <div className="p-6">
            {error && <p className="text-red-500 text-xs font-semibold text-center bg-red-50 p-2 rounded-xl mb-4">{error}</p>}
            {success && <p className="text-green-500 text-xs font-semibold text-center bg-green-50 p-2 rounded-xl mb-4">{success}</p>}

            {step === "email" && (
              <form onSubmit={handleSendOTP} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:bg-white text-sm" placeholder="Enter Admin Email" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-3 bg-[#711113] hover:bg-[#520c0d] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Send OTP</>}
                </button>
              </form>
            )}

            {step === "otp" && (
              <form onSubmit={handleVerifyOTP} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Enter OTP</label>
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:bg-white text-sm tracking-[0.5em] font-bold" placeholder="• • • • • •" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-3 bg-[#711113] hover:bg-[#520c0d] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Verify OTP</>}
                </button>
              </form>
            )}

            {step === "reset" && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:bg-white text-sm" placeholder="New Password" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-2 ml-1">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    <input required type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] focus:bg-white text-sm" placeholder="Confirm Password" />
                  </div>
                </div>
                <button type="submit" disabled={isLoading} className="w-full py-3 bg-[#711113] hover:bg-[#520c0d] text-white text-xs font-bold uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 mt-2 disabled:opacity-70">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <>Update Password</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </motion.div>
    </main>
  );
}
