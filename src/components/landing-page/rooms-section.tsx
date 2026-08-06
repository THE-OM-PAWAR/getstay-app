"use client";

import { useState } from "react";
import { RoomLandingCard } from "@/components/shared/room-landing-card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star, Heart, Package, Shield, Calendar, Bed, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

export type RoomCategory = 'all' | 'single' | 'double' | 'triple' | 'sharing';

interface RoomData {
  _id: string;
  name: string;
  description: string;
  rent: number;
  coverImage?: string;
  components: Array<{
    name: string;
    description: string;
  }>;
  hostel: {
    name: string;
    slug: string;
    city?: string;
    state?: string;
  };
}

interface RoomsSectionProps {
  initialRooms: RoomData[];
}

const categories: Array<{ value: RoomCategory; label: string }> = [
  { value: 'all', label: 'All Rooms' },
  { value: 'single', label: 'Single Sharing' },
  { value: 'double', label: 'Double Sharing' },
  { value: 'triple', label: 'Triple Sharing' },
  { value: 'sharing', label: 'Sharing' },
];

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

export function RoomsSection({ initialRooms }: RoomsSectionProps) {
  const [selectedCategory, setSelectedCategory] = useState<RoomCategory>('all');
  const [rooms, setRooms] = useState<RoomData[]>(initialRooms);
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCategoryChange = async (category: RoomCategory) => {
    setSelectedCategory(category);
    setIsLoading(true);

    try {
      const response = await fetch(`/api/rooms?category=${category}`);
      if (response.ok) {
        const data = await response.json();
        setRooms(data.rooms || []);
      }
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fallbackImages = [
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80",
  ];

  const badgeStyles = [
    { text: "DELUXE", style: "bg-orange-50 text-orange-700 border-orange-200" },
    { text: "COZY STAY", style: "bg-emerald-50 text-emerald-700 border-emerald-200" },
    { text: "POPULAR", style: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  ];

  return (
    <section className="bg-brand-white py-20 relative">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-2 text-brand-primary font-semibold text-sm uppercase tracking-wider">
              <Bed className="h-4 w-4" />
              <span>Comfort</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight">
              Premium Rooms
            </h2>
          </div>
          <p className="text-gray-500 mt-4 md:mt-0 max-w-sm md:text-right font-medium">
            Find the perfect room configuration that suits your needs.
          </p>
        </motion.div>

        {/* Category Pills */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-12 flex flex-wrap gap-3 items-center overflow-x-auto pb-4 scrollbar-hide"
        >
          {categories.map((category) => {
            const isActive = selectedCategory === category.value;
            return (
              <button
                key={category.value}
                onClick={() => handleCategoryChange(category.value)}
                className={`rounded-full px-6 py-3 text-sm font-semibold transition-all active:scale-95 cursor-pointer shadow-sm hover:shadow ${
                  isActive
                    ? "bg-brand-primary text-white border border-brand-primary"
                    : "border border-gray-200 bg-white text-gray-700 hover:border-brand-primary hover:text-brand-primary"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </motion.div>

        {/* Grid layout matching hostels section */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
        >
          {isLoading ? (
            // Skeleton loader matching size of cards
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="h-[420px] animate-pulse rounded-[1.5rem] bg-gray-100 border border-gray-100"
              />
            ))
          ) : rooms.length > 0 ? (
            rooms.map((room, idx) => {
              const isFav = !!favorites[room._id];
              const badgePreset = badgeStyles[idx % badgeStyles.length];
              const imagePreset = fallbackImages[idx % fallbackImages.length];

              const city = room.hostel.city || "";
              const state = room.hostel.state || "";
              const location = city && state ? `${city}, ${state}` : city || "Bhopal";

              return (
                <motion.div variants={cardVariants} key={room._id}>
                  <div
                    className="group relative flex flex-col overflow-hidden rounded-[1.5rem] bg-white border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 h-full"
                  >
                    {/* Top Image & Overlays */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      <Image
                        src={room.coverImage || imagePreset}
                        alt={room.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                      />

                      {/* Heart button */}
                      <button
                        onClick={(e) => toggleFavorite(room._id, e)}
                        className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-gray-500 hover:text-red-500 backdrop-blur-md transition-all cursor-pointer shadow-sm active:scale-90"
                        aria-label="Add to favorites"
                      >
                        <Heart className={`h-5 w-5 ${isFav ? "fill-red-500 text-red-500" : ""}`} />
                      </button>

                      {/* Custom badge tag */}
                      <span className={`absolute top-4 left-4 z-10 px-3 py-1.5 text-[10px] font-bold tracking-wider border rounded-lg uppercase shadow-sm backdrop-blur-md ${badgePreset.style} bg-opacity-90`}>
                        {badgePreset.text}
                      </span>
                      
                      {/* Gradient Overlay for Text Visibility */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />

                      {/* Price Overlay */}
                      <div className="absolute bottom-4 right-4 z-10 flex flex-col items-end rounded-lg bg-white/95 backdrop-blur-md px-3 py-1.5 text-brand-dark shadow-sm">
                        <span className="text-[9px] uppercase tracking-wider text-gray-500 font-bold leading-none mb-0.5">Monthly Rent</span>
                        <span className="text-base font-black leading-none">₹{room.rent}</span>
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex flex-col flex-1 p-6">
                      <h3 className="text-xl font-bold text-brand-dark mb-1 group-hover:text-brand-primary transition-colors line-clamp-1">
                        {room.name}
                      </h3>
                      <p className="text-sm font-semibold text-brand-primary/80 mb-3 truncate">
                        {room.hostel.name}
                      </p>

                      <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-5">
                        <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                        <span className="truncate">{location}</span>
                      </div>

                      {/* Components Row */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {room.components.slice(0, 3).map((comp, compIdx) => (
                          <span
                            key={compIdx}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors"
                          >
                            <Package className="h-3.5 w-3.5 text-gray-400" />
                            {comp.name}
                          </span>
                        ))}
                        {room.components.length > 3 && (
                          <span className="inline-flex items-center rounded-lg border border-gray-100 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-600">
                            +{room.components.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Action button */}
                      <Link
                        href={`/room/${room._id}`}
                        className="mt-auto w-full rounded-xl bg-brand-dark py-3.5 text-center text-sm font-bold text-white hover:bg-brand-primary transition-colors shadow-sm cursor-pointer"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-gray-200 rounded-3xl bg-gray-50">
              <p className="text-base font-medium text-gray-500">
                No rooms available in this category
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
