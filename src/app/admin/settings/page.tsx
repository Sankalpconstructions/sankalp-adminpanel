"use client";
import React, { useState, useEffect, useCallback } from "react";
import { 
  Layers, Sparkles, Building2, Quote, Users, HelpCircle, 
  Share2, Mail, FileText, Speech, Layout, Star, HeartHandshake, 
  Home, Store, Newspaper, RefreshCw, Check, Settings 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface SettingItem {
  key: string;
  label: string;
  description: string;
  icon: any;
  category: "home" | "about" | "navigation";
}

const SETTINGS_METADATA: SettingItem[] = [
  // Homepage Sections
  { key: "show_hero_banner", label: "Hero Banner", description: "Display the main animated sliding banner at the top of the homepage.", icon: Layers, category: "home" },
  { key: "show_story_section", label: "Brand Story (Home)", description: "Showcase the overview story of the company on the home screen.", icon: Sparkles, category: "home" },
  { key: "show_projects_showcase", label: "Projects Showcase", description: "Display the interactive projects carousel section on the homepage.", icon: Building2, category: "home" },
  { key: "show_testimonials_section", label: "Testimonials Section", description: "Display user testimonials on the homepage.", icon: Quote, category: "home" },
  { key: "show_team_section", label: "Team Section", description: "Introduce the core management team and staff on the home page.", icon: Users, category: "home" },
  { key: "show_faq_section", label: "FAQ Section", description: "Answer standard client questions in a collapsing accordion on the home page.", icon: HelpCircle, category: "home" },
  { key: "show_live_updates_section", label: "Live Social Updates", description: "Show the Instagram/YouTube dynamic updates slider carousel on home.", icon: Share2, category: "home" },
  { key: "show_contact_section", label: "Contact Section", description: "Show the contact details card and form on the homepage footer area.", icon: Mail, category: "home" },
  { key: "show_popup_lead_form", label: "Popup Lead Form", description: "Show a welcoming pop-up lead generation form for new site visits.", icon: FileText, category: "home" },
  { key: "show_chatbot", label: "Floating Chatbot Toggle", description: "Display the floating chat assistant bubble at the bottom right.", icon: Speech, category: "home" },

  // About Page Sections
  { key: "show_about_banner", label: "About Page Banner", description: "Render the top hero banner image on the About Us page.", icon: Layout, category: "about" },
  { key: "show_about_story_section", label: "Legacy of Trust & Quality", description: "Show the detailed legacy story section with stats counter.", icon: Sparkles, category: "about" },
  { key: "show_about_vision_mission", label: "Our Vision & Mission", description: "Render the mission statement cards at the bottom of the About page.", icon: Star, category: "about" },

  // Subpages & Navigation
  { key: "show_csr_page", label: "CSR / Events Page", description: "Show/hide the CSR Events tab and link from the navigation menu.", icon: HeartHandshake, category: "navigation" },
  { key: "show_rental_residential", label: "Rental Residential", description: "Toggle the visibility of residential rental properties links.", icon: Home, category: "navigation" },
  { key: "show_rental_commercial", label: "Rental Commercial", description: "Toggle the visibility of commercial rental properties links.", icon: Store, category: "navigation" },
  { key: "show_blog_page", label: "Blog / News Portal Page", description: "Toggle the visibility of the blog portal page and navigation links.", icon: Newspaper, category: "navigation" }
];

export default function WebSettingsAdminPage() {
  const [configState, setConfigState] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdatingKey, setIsUpdatingKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"home" | "about" | "navigation">("home");

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/config");
      if (res.ok) {
        const data = await res.json();
        // Set all keys based on the API response, defaulting to true if not present
        const state: Record<string, boolean> = {};
        SETTINGS_METADATA.forEach((item) => {
          state[item.key] = data[item.key] !== false; // defaults to true
        });
        setConfigState(state);
      } else {
        toast.error("Failed to load configuration settings.");
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
      toast.error("Failed to load configuration settings.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleToggle = async (key: string) => {
    setIsUpdatingKey(key);
    const currentValue = configState[key] !== false;
    const newValue = !currentValue;

    try {
      const res = await fetch("/api/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key,
          value: newValue,
        }),
      });

      if (res.ok) {
        setConfigState((prev) => ({ ...prev, [key]: newValue }));
        toast.success(`${SETTINGS_METADATA.find(s => s.key === key)?.label} toggled ${newValue ? "ON" : "OFF"} successfully!`);
      } else {
        toast.error("Failed to save configuration change.");
      }
    } catch (error) {
      console.error("Error updating configuration:", error);
      toast.error("Failed to save configuration change.");
    } finally {
      setIsUpdatingKey(null);
    }
  };

  const filteredSettings = SETTINGS_METADATA.filter(
    (item) => item.category === activeTab
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 uppercase tracking-tight flex items-center gap-2">
            <Settings className="text-[#711113]" size={24} /> Website Configurations
          </h1>
          <p className="text-gray-500 text-sm">
            Control the live visibility of all main sections, subpages, and navigation menus across the website.
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100 bg-white p-1.5 rounded-xl shadow-sm gap-2 max-w-lg">
        <button
          onClick={() => setActiveTab("home")}
          className={`flex-1 py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
            activeTab === "home"
              ? "bg-[#711113] text-white shadow-md shadow-[#711113]/10"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          Homepage
        </button>
        <button
          onClick={() => setActiveTab("about")}
          className={`flex-1 py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
            activeTab === "about"
              ? "bg-[#711113] text-white shadow-md shadow-[#711113]/10"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          About Page
        </button>
        <button
          onClick={() => setActiveTab("navigation")}
          className={`flex-1 py-3 px-4 font-bold text-xs uppercase tracking-wider rounded-lg transition-all ${
            activeTab === "navigation"
              ? "bg-[#711113] text-white shadow-md shadow-[#711113]/10"
              : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
          }`}
        >
          Pages & Nav
        </button>
      </div>

      {/* Grid of Toggle Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-gray-400">
              <RefreshCw size={40} className="animate-spin mb-4 opacity-20" />
              <p className="text-xs font-bold uppercase tracking-widest">Loading Settings Panel...</p>
            </div>
          ) : (
            <>
              {filteredSettings.map((item) => {
                const isEnabled = configState[item.key] !== false;
                const IconComponent = item.icon;
                const isUpdating = isUpdatingKey === item.key;

                return (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    key={item.key}
                    className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between gap-5 relative group hover:border-[#29B1D2] hover:shadow-md transition-all h-full"
                  >
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl transition-all flex-shrink-0 ${
                        isEnabled ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"
                      }`}>
                        <IconComponent size={24} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-bold text-sm text-gray-900">{item.label}</h4>
                        <p className="text-xs text-gray-400 leading-normal">{item.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 pt-4 mt-auto">
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${
                        isEnabled ? "text-emerald-600" : "text-gray-400"
                      }`}>
                        {isEnabled ? "Visible / Active" : "Hidden / Inactive"}
                      </span>

                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => handleToggle(item.key)}
                        className={`w-14 h-8 rounded-full transition-all relative outline-none p-1 flex items-center ${
                          isEnabled ? "bg-emerald-500 justify-end" : "bg-gray-200 justify-start"
                        } ${isUpdating ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                      >
                        {isUpdating ? (
                          <RefreshCw size={14} className="animate-spin text-white mx-1.5" />
                        ) : (
                          <motion.div
                            layout
                            className="w-6 h-6 rounded-full bg-white shadow-md"
                          />
                        )}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
