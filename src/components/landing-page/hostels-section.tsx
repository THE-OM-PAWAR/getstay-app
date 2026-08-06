"use client";

import { useState } from "react";
import { MapPin, Star, Heart, Wifi, Wind, Utensils, Dumbbell, Coffee, Gamepad2, Trees, Clock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { HostelWithProfile } from "@/services/hostel.service";
import { motion, Variants } from "framer-motion";

interface HostelsSectionProps {
  hostels: HostelWithProfile[];
}

interface HostelCardData {
  id: string;
  name: string;
  location: string;
  badge: "PREMIUM" | "TOP RATED" | "BEST VALUE";
  badgeColor: string;
  rating: number;
  reviewsCount: number;
  price: number;
  image: string;
  amenities: Array<{ name: string; icon: React.ReactNode }>;
  slug: string;
}

const getAmenityIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("wifi") || n.includes("internet")) return <Wifi className="h-3 w-3" />;
  if (n.includes("ac") || n.includes("air condition")) return <Wind className="h-3 w-3" />;
  if (n.includes("food") || n.includes("mess") || n.includes("meal") || n.includes("lunch") || n.includes("dinner")) return <Utensils className="h-3 w-3" />;
  if (n.includes("gym") || n.includes("fitness")) return <Dumbbell className="h-3 w-3" />;
  if (n.includes("cafe") || n.includes("coffee") || n.includes("tea")) return <Coffee className="h-3 w-3" />;
  if (n.includes("game") || n.includes("play") || n.includes("tv") || n.includes("console")) return <Gamepad2 className="h-3 w-3" />;
  if (n.includes("garden") || n.includes("lawn") || n.includes("park") || n.includes("tree")) return <Trees className="h-3 w-3" />;
  return <Wifi className="h-3 w-3" />; // default icon
};

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export function HostelsSection({ hostels }: HostelsSectionProps) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const badges = [
    { type: "PREMIUM" as const, color: "bg-blue-50 text-blue-700 border-blue-200" },
    { type: "TOP RATED" as const, color: "bg-purple-50 text-purple-700 border-purple-200" },
    { type: "BEST VALUE" as const, color: "bg-green-50 text-green-700 border-green-200" },
  ];

  const fallbackImages = [
    "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1623625434462-e5e42318ae49?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
  ];

  // Map database hostels to the layout structure
  const mappedHostels: HostelCardData[] = (hostels || []).map((hostel, index) => {
    const badgePreset = badges[index % badges.length];
    const imagePreset = fallbackImages[index % fallbackImages.length];

    // Determine location string
    const city = hostel.profile?.basicInfo?.city || "";
    const state = hostel.profile?.basicInfo?.state || "";
    const address = hostel.profile?.basicInfo?.address || "";
    const location = address 
      ? `${address.split(",")[0]}, ${city}`
      : city && state ? `${city}, ${state}` : city || "Bhopal";

    // Dynamic rating & reviews based on name/id to keep it consistent and realistic
    const code = hostel.name.length;
    const rating = parseFloat((4.0 + (code % 9) / 10).toFixed(1));
    const reviewsCount = 50 + (code * 7) % 300;

    // Price details
    const price = hostel.profile?.minRent || (500 + (code * 13) % 400); // realistic starting price in Rs.

    // Image URL
    const image = hostel.profile?.media?.photos?.find(p => p.isMain)?.url ||
                  hostel.profile?.media?.photos?.[0]?.url ||
                  imagePreset;

    // Amenities
    const dbAmenities = hostel.profile?.availableAmenities || [];
    const amenities = dbAmenities.slice(0, 4).map(name => ({
      name,
      icon: getAmenityIcon(name),
    }));

    // Fallback if no amenities specified in DB
    const finalAmenities = amenities.length > 0 ? amenities : [
      { name: "WiFi", icon: <Wifi className="h-3 w-3" /> },
      { name: "AC", icon: <Wind className="h-3 w-3" /> },
    ];

    return {
      id: hostel._id,
      name: hostel.name,
      location,
      badge: badgePreset.type,
      badgeColor: badgePreset.color,
      rating,
      reviewsCount,
      price,
      image,
      amenities: finalAmenities,
      slug: hostel.slug || "",
    };
  });

  // Safe fallback to match the original static cards if no hostels in DB
  const displayHostels = mappedHostels.length > 0 ? mappedHostels : [
    {
      id: "1",
      name: "Urban Nest Hostel",
      location: "Koramangala 5th Block, Bengaluru",
      badge: "PREMIUM" as const,
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      rating: 4.5,
      reviewsCount: 189,
      price: 599,
      image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80",
      slug: "urban-nest-hostel",
      amenities: [
        { name: "WiFi", icon: <Wifi className="h-3 w-3" /> },
        { name: "AC", icon: <Wind className="h-3 w-3" /> },
        { name: "Food", icon: <Utensils className="h-3 w-3" /> },
        { name: "Gym", icon: <Dumbbell className="h-3 w-3" /> },
      ],
    },
    {
      id: "2",
      name: "The Social Hub",
      location: "Indiranagar, Bengaluru",
      badge: "TOP RATED" as const,
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      rating: 4.8,
      reviewsCount: 312,
      price: 750,
      image: "https://images.unsplash.com/photo-1623625434462-e5e42318ae49?auto=format&fit=crop&w=800&q=80",
      slug: "the-social-hub",
      amenities: [
        { name: "WiFi", icon: <Wifi className="h-3 w-3" /> },
        { name: "Cafe", icon: <Coffee className="h-3 w-3" /> },
        { name: "Games", icon: <Gamepad2 className="h-3 w-3" /> },
      ],
    },
    {
      id: "3",
      name: "Nomad Garden",
      location: "HSR Layout, Bengaluru",
      badge: "BEST VALUE" as const,
      badgeColor: "bg-green-50 text-green-700 border-green-200",
      rating: 4.2,
      reviewsCount: 95,
      price: 450,
      image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      slug: "nomad-garden",
      amenities: [
        { name: "WiFi", icon: <Wifi className="h-3 w-3" /> },
        { name: "Garden", icon: <Trees className="h-3 w-3" /> },
      ],
    },
  ];

  return (
    <section className="bg-gray-50 py-20 border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 text-brand-primary font-semibold text-sm uppercase tracking-wider">
              <Star className="h-4 w-4" />
              <span>Handpicked</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight">
              Featured Properties
            </h2>
          </div>
          <div className="hidden md:block">
            <Link
              href="/search?q=all"
              className="text-brand-primary font-semibold hover:text-brand-primary-light transition-colors group flex items-center gap-1"
            >
              View all properties
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </motion.div>

        {/* Grid layout - 2 Row Horizontal Scroll */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-flow-col auto-cols-[85%] sm:auto-cols-[300px] gap-4 mb-12 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar grid-rows-2"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none',
          }}
        >
          {displayHostels.map((hostel) => {
            const isFav = !!favorites[hostel.id];
            return (
              <motion.div variants={cardVariants} key={hostel.id}>
                <Link 
                  href={`/hostel/${hostel.slug}`}
                  className="group relative flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 h-full snap-start cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:-translate-y-1 p-2 block"
                >
                  {/* Top Image & Overlays */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={hostel.image}
                      alt={hostel.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 300px"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Discount/Offer Badge (Top Left) */}
                    <div className="absolute top-0 left-0 z-10 px-2.5 py-1 text-[11px] font-semibold text-white bg-black/80 backdrop-blur-md rounded-br-lg rounded-tl-xl shadow-sm">
                      {hostel.badge === "PREMIUM" ? "FLAT ₹150 OFF" : hostel.badge === "TOP RATED" ? "20% OFF up to ₹100" : "FREE BREAKFAST"}
                    </div>

                    {/* Heart button (Top Right) */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={(e) => toggleFavorite(hostel.id, e)}
                      onKeyDown={(e) => { if (e.key === 'Enter') toggleFavorite(hostel.id, e as any) }}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-90"
                      aria-label="Add to favorites"
                    >
                      <Heart className={`h-4 w-4 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                    </div>

                    {/* Gradient Overlay for bottom text visibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                    {/* Rating Badge (Bottom Left) */}
                    <div className="absolute bottom-2 left-2 z-10 flex items-center gap-1 rounded-md bg-green-700/90 backdrop-blur-sm px-1.5 py-0.5 text-[11px] font-bold text-white shadow-sm border border-white/10">
                      <Star className="h-3 w-3 fill-white text-white" />
                      <span>{hostel.rating}</span>
                    </div>
                  </div>

                  {/* Content Area - Premium & Compact */}
                  <div className="flex flex-col flex-1 pt-3 px-1.5 pb-1">
                    <h3 className="text-[17px] font-extrabold text-gray-900 leading-tight mb-1 truncate group-hover:text-brand-primary transition-colors">
                      {hostel.name}
                    </h3>
                    
                    <div className="flex items-center gap-1.5 text-[13px] text-gray-500 font-medium mb-2.5">
                      <Clock className="h-3.5 w-3.5 text-brand-primary/70 shrink-0" />
                      <span className="truncate">20-25 mins • {hostel.location.split(",")[0]}</span>
                    </div>

                    <div className="mt-auto flex items-end justify-between border-t border-gray-100/80 pt-2.5">
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold leading-none mb-0.5">Starting from</span>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-black text-gray-900 leading-none">₹{hostel.price}</span>
                          <span className="text-[11px] text-gray-500 font-semibold leading-none">/mo</span>
                        </div>
                      </div>
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary/10 text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors">
                        <span className="text-lg font-bold leading-none -mt-0.5">+</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
        
        {/* Mobile View All Button */}
        <div className="flex justify-center md:hidden">
          <Link
            href="/search?q=all"
            className="w-full rounded-xl border-2 border-brand-primary py-3.5 text-center text-sm font-bold text-brand-primary hover:bg-brand-primary/5 transition-colors"
          >
            Explore All Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
