import React from "react";
import Link from "next/link";
import { ArrowRight, Building2, HardHat, Ruler } from "lucide-react";
import { motion } from "framer-motion";

interface BannerProps {
  title?: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  backgroundImage?: string;
}

export default function Banner({
  title = "Building Your Dreams Into Reality",
  subtitle = "Excellence in construction, engineering, and design. We bring over 20 years of experience to every project.",
  ctaText = "Explore Our Projects",
  ctaLink = "/projects",
  backgroundImage = "https://images.unsplash.com/photo-1541888086425-d81bb19240f5?auto=format&fit=crop&q=80&w=2000"
}: BannerProps) {
  return (
    <div className="relative min-h-[600px] md:min-h-[80vh] flex items-center justify-center overflow-hidden w-full pt-28">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        />
        {/* Deep gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/80 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-transparent to-gray-900/30" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20 flex flex-col items-start text-left">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-6"
        >
          <span className="w-2 h-2 rounded-full bg-[#F5C33C] animate-pulse"></span>
          <span className="text-sm font-semibold tracking-wide text-white uppercase">Sankalp Constructions</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl font-extrabold text-white leading-tight mb-6 max-w-3xl"
        >
          {title}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed"
        >
          {subtitle}
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
        >
          <Link 
            href={ctaLink}
            className="px-8 py-4 bg-[#711113] text-white font-bold rounded-lg hover:bg-[#5a0d0f] transition-all shadow-lg flex items-center justify-center gap-3 group"
          >
            {ctaText}
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/contact"
            className="px-8 py-4 bg-white/10 text-white backdrop-blur-md border border-white/20 font-bold rounded-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
          >
            Contact Us
          </Link>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-20 border-t border-white/10 pt-10 w-full max-w-4xl"
        >
          {[
            { icon: Building2, title: "Modern Designs", desc: "Innovative architecture structure" },
            { icon: HardHat, title: "Safety First", desc: "Uncompromised safety standards" },
            { icon: Ruler, title: "Precision", desc: "Excellence in every measurement" }
          ].map((feature, idx) => (
            <div key={idx} className="flex flex-col items-start gap-3">
              <div className="w-12 h-12 rounded-xl bg-[#29B1D2]/20 flex items-center justify-center border border-[#29B1D2]/30 text-[#29B1D2]">
                <feature.icon size={24} />
              </div>
              <div>
                <h3 className="text-white font-bold text-lg">{feature.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{feature.desc}</p>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
