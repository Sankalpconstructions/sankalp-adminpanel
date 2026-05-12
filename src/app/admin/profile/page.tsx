"use client";
import React, { useState, useEffect } from "react";
import { User, Shield, Globe, Edit3, Check, Layout, Palette, Save } from "lucide-react";
import { useAdmin } from "@/components/admin/AdminContext";
import ImageUpload from "@/components/admin/ImageUpload";
import toast from "react-hot-toast";

export default function AdminProfilePage() {
  const { logout } = useAdmin();
  const [profile, setProfile] = useState<any>({
    name: "",
    email: "",
    role: "System Administrator",
    lastLogin: "",
    avatar: "",
    region: ""
  });

  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/auth/profile');
        if (res.ok) {
          const data = await res.json();
          const a = data.admin;
          setProfile({
            name: a.name || '',
            email: a.email || '',
            role: 'System Administrator',
            lastLogin: a.lastLogin ? new Date(a.lastLogin).toLocaleString() : '',
            avatar: a.photo || '',
            region: a.region || ''
          });
        }
      } catch (err) {
        console.error('Failed to load profile', err);
      }
    };
    load();
  }, []);

  const onSave = async () => {
    try {
      const payload = { name: profile.name, photo: profile.avatar, email: profile.email, region: profile.region };
      const res = await fetch('/api/auth/profile', { method: 'PUT', body: JSON.stringify(payload), headers: { 'Content-Type': 'application/json' } });
      if (res.ok) {
        const data = await res.json();
        const a = data.admin;
        setProfile((p:any) => ({ ...p, name: a.name || '', email: a.email || '', avatar: a.photo || '', region: a.region || '' }));
        toast.success('Profile updated');
      } else {
        const err = await res.json();
        toast.error(err?.error || 'Update failed');
      }
    } catch (err) {
      console.error('Save profile failed', err);
      toast.error('Save failed');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight">Admin Profile</h1>
          <p className="text-gray-500 text-sm">Manage your account settings and regional preferences.</p>
        </div>
        <button
          onClick={async () => {
            if (isEditing) await onSave();
            setIsEditing(!isEditing);
          }}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${isEditing ? "bg-green-500 text-white shadow-lg shadow-green-500/20" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
        >
          {isEditing ? <><Save size={18} /> Save Changes</> : <><Edit3 size={18} /> Edit Profile</>}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar & Quick Info */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-[#711113] to-[#29B1D2]"></div>
            <div className="relative z-10">
              <div className="w-32 h-32 bg-white rounded-3xl mx-auto flex items-center justify-center text-[#711113] shadow-xl border-4 border-white overflow-hidden mb-4 group-hover:scale-105 transition-transform duration-500">
                {profile.avatar ? <img src={profile.avatar} className="w-full h-full object-cover" alt="avatar" /> : <User size={48} strokeWidth={1} />}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{profile.name || 'Admin'}</h2>
              <p className="text-xs font-bold text-[#29B1D2] uppercase tracking-widest mb-6">{profile.role}</p>

              <div className="w-full px-6">
                <ImageUpload
                  value={profile.avatar}
                  onChange={(val) => setProfile((p:any) => ({ ...p, avatar: val }))}
                  label="Profile Photo"
                  multiple={false}
                />
              </div>
              <div className="flex gap-2 justify-center mt-4">
                <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase rounded-full border border-green-100 flex items-center gap-1">
                  <Shield size={10} /> Active
                </span>
                <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-bold uppercase rounded-full border border-gray-100 flex items-center gap-1">
                  <Globe size={10} /> {profile.region || 'Pune HQ'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest border-b border-gray-50 pb-3">Session Log</h3>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Last Login</span>
              <span className="font-bold text-gray-900">{profile.lastLogin}</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Region</span>
              <span className="font-bold text-gray-900 italic">{profile.region || 'Hyderabad, India'}</span>
            </div>
            <button
              onClick={logout}
              className="w-full mt-4 py-3 bg-red-50 text-red-500 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              Sign Out from Dashboard
            </button>
          </div>
        </div>

        {/* Right Column: Detailed Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
              <Layout size={20} className="text-[#711113]" />
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs">Security & Personal Information</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Full Name</label>
                  <input
                    disabled={!isEditing}
                    value={profile.name}
                    onChange={(e) => setProfile((p:any) => ({ ...p, name: e.target.value }))}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] disabled:opacity-60"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Email Address</label>
                  <input
                    // Allow editing email directly
                    value={profile.email}
                    onChange={(e) => setProfile((p:any) => ({ ...p, email: e.target.value }))}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Admin ID (Internal)</label>
                  <input
                    disabled
                    value="SANKALP_MNG_001"
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl opacity-60 italic"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Security Level</label>
                  <div className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Level 5 (Super User)</span>
                    <Check size={18} className="text-green-500" />
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Last Login</label>
                  <input disabled value={profile.lastLogin} className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl opacity-60 italic" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase text-gray-400 tracking-widest ml-1">Region</label>
                  <input
                    disabled={!isEditing}
                    value={profile.region}
                    onChange={(e) => setProfile((p:any) => ({ ...p, region: e.target.value }))}
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-xl outline-none focus:border-[#29B1D2] disabled:opacity-60"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-50 flex items-center gap-3 bg-gray-50/50">
              <Palette size={20} className="text-[#29B1D2]" />
              <h3 className="font-bold text-gray-900 uppercase tracking-widest text-xs">System & Branding Preferences</h3>
            </div>
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#711113] rounded-lg"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">Primary Brand Color</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">#711113 - Ruby Deep Red</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-[#711113] uppercase tracking-widest hover:underline">Customize</button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-[#29B1D2] rounded-lg"></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-none mb-1">Secondary Brand Color</p>
                    <p className="text-[10px] text-gray-400 font-semibold uppercase">#29B1D2 - Sky Azure Blue</p>
                  </div>
                </div>
                <button className="text-[10px] font-bold text-[#29B1D2] uppercase tracking-widest hover:underline">Customize</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
