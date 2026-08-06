"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { HostelWithProfile } from "@/services/hostel.service";
import { motion, Variants } from "framer-motion";
import { SmallHostelCard } from "@/components/shared/small-hostel-card";

interface RecommendedSectionProps {
  hostels: HostelWithProfile[];
}

interface RoomType {
  name: string;
  rent: number;
}

interface RoomType {
  name: string;
  rent: number;
  images?: Array<{
    url: string;
    title: string;
    isCover?: boolean;
  }>;
}

interface HostelCardData {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  slug: string;
  roomTypes: RoomType[];
}



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

export function RecommendedSection({ hostels }: RecommendedSectionProps) {
  // Map database hostels - render all without filtering
  const displayHostels: HostelCardData[] = (hostels || []).map((hostel) => {
    // Location
    const city = hostel.profile?.basicInfo?.city || "";
    const state = hostel.profile?.basicInfo?.state || "";
    const address = hostel.profile?.basicInfo?.address || "";
    const location = address 
      ? `${address.split(",")[0]}, ${city}`
      : city && state ? `${city}, ${state}` : city || "Location";

    // Price
    const price = hostel.profile?.minRent || 0;

    // Image
    const image = hostel.profile?.media?.photos?.find(p => p.isMain)?.url ||
                  hostel.profile?.media?.photos?.[0]?.url ||
                  "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80";

    // Room types
    const roomTypes: RoomType[] = (hostel.profile?.roomTypes || [])
      .map((rt: any) => ({
        name: rt.name,
        rent: rt.rent,
        images: (rt.images || []).map((img: any) => ({
          url: img.url,
          title: img.title,
          isCover: img.isCover || false,
        })),
      }))
      .sort((a: RoomType, b: RoomType) => a.rent - b.rent)
      .slice(0, 2);

    return {
      id: hostel._id,
      name: hostel.name,
      location,
      price,
      image,
      slug: hostel.slug || "",
      roomTypes,
    };
  });

  return (
    <section className="bg-gray-50 py-10 md:py-14 border-y border-gray-100">
      <div className="mx-auto max-w-7xl px-4 lg:px-6">
        
        {/* Section Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-8 md:mb-10"
        >
          <div>
            <div className="flex items-center gap-2 mb-1.5 text-brand-primary font-semibold text-xs uppercase tracking-wider">
              <Star className="h-3.5 w-3.5" />
              <span>Handpicked</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark tracking-tight">
              Recommended For You
            </h2>
          </div>
          <Link
            href="/search?q=all"
            className="text-brand-primary text-sm font-semibold hover:text-brand-primary-light transition-colors group flex items-center gap-1"
          >
            <span className="hidden sm:inline">View all</span>
            <span className="sm:hidden">All</span>
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </Link>
        </motion.div>

        {/* 2-Row Horizontal Scroll Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-flow-col auto-cols-[220px] sm:auto-cols-[240px] gap-3 md:gap-4 overflow-x-auto pb-4 scrollbar-hide -mx-6 px-6 lg:-mx-8 lg:px-8 grid-rows-2"
        >
          {displayHostels.map((hostel) => (
            <motion.div 
              variants={cardVariants} 
              key={hostel.id}
            >
              <SmallHostelCard
                id={hostel.id}
                name={hostel.name}
                location={hostel.location}
                price={hostel.price}
                image={hostel.image}
                slug={hostel.slug}
                roomTypes={hostel.roomTypes}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
