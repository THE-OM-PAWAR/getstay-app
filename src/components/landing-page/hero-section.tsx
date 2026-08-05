"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapPin, Search } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden w-full min-h-[85vh] md:min-h-[750px] flex items-center justify-center pt-36 pb-20 px-6 bg-brand-dark -mt-20 z-10">
      {/* Background image with parallax effect simulation */}
      <motion.div 
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image
          src="https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=2000&q=80"
          alt="Premium hostel lobby"
          fill
          className="object-cover"
          priority
        />
        {/* Enhanced gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-dark/70 via-brand-dark/40 to-brand-dark/90 backdrop-blur-[2px]" />
      </motion.div>
      
      {/* Content overlay */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mb-4 inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
          Now operating in 15+ cities across India
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6 drop-shadow-lg"
        >
          Elevate Your <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary-light to-white">Hostel Experience</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="text-lg md:text-xl text-brand-light font-medium mb-10 max-w-2xl drop-shadow-md"
        >
          Discover premium, safe, and vibrant accommodations tailored for students and young professionals.
        </motion.p>

        {/* Search Pill Form - Glassmorphism */}
        <motion.form 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
          onSubmit={handleSearch}
          className="flex items-center w-full max-w-2xl bg-white/10 backdrop-blur-lg border border-white/30 rounded-full p-2 shadow-2xl hover:bg-white/20 transition-all duration-300 group"
        >
          <div className="flex items-center gap-3 pl-5 flex-1">
            <MapPin className="h-6 w-6 text-brand-primary-light shrink-0" />
            <input
              type="text"
              placeholder="Search for a city or hostel..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none text-white placeholder-brand-light/70 focus:outline-none focus:ring-0 text-base md:text-lg py-2"
            />
          </div>
          <button
            type="submit"
            className="h-14 w-14 md:h-16 md:w-16 rounded-full bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primary/90 hover:scale-105 transition-all active:scale-95 shadow-[0_0_20px_rgba(57,50,216,0.5)] shrink-0 cursor-pointer"
            aria-label="Search"
          >
            <Search className="h-6 w-6 md:h-7 md:w-7" />
          </button>
        </motion.form>
      </div>
    </section>
  );
}
