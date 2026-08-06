"use client";

import { Award } from "lucide-react";
import Link from "next/link";
import { HostelWithProfile } from "@/services/hostel.service";
import { HostelCard } from "@/components/shared/hostel-card";
import { motion, Variants } from "framer-motion";

interface FeaturedHostelsProps {
  hostels: HostelWithProfile[];
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function FeaturedHostels({ hostels }: FeaturedHostelsProps) {
  // Display 9 hostels (3x3 grid on desktop)
  const displayHostels = hostels.slice(0, 9);

  return (
    <section className="bg-white py-20 border-y border-gray-100">
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
              <Award className="h-4 w-4" />
              <span>Featured Selection</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight">
              Exclusive Picks for You
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl">
              Curated accommodations offering exceptional experiences and premium amenities
            </p>
          </div>
          <div className="hidden md:block">
            <Link
              href="/search?q=featured"
              className="text-brand-primary font-semibold hover:text-brand-primary-light transition-colors group flex items-center gap-1"
            >
              View all featured
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </motion.div>

        {/* Grid layout - 3 cards per row on desktop */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12"
        >
          {displayHostels.map((hostel) => (
            <motion.div variants={cardVariants} key={hostel._id}>
              <HostelCard
                slug={hostel.slug}
                name={hostel.name}
                subtitle={hostel.profile?.basicInfo?.description}
                city={hostel.profile?.basicInfo?.city || "Bhopal"}
                state={hostel.profile?.basicInfo?.state}
                totalRooms={hostel.profile?.propertyDetails?.totalRooms || 0}
                accommodationType={hostel.profile?.propertyDetails?.accommodationType || "coed"}
                mainPhoto={
                  hostel.profile?.media?.photos?.find(p => p.isMain)?.url ||
                  hostel.profile?.media?.photos?.[0]?.url
                }
                minRent={hostel.profile?.minRent}
                roomTypes={hostel.profile?.roomTypes || []}
                amenities={hostel.profile?.availableAmenities || []}
              />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Mobile View All Button */}
        <div className="flex justify-center md:hidden">
          <Link
            href="/search?q=featured"
            className="w-full rounded-xl border-2 border-brand-primary py-3.5 text-center text-sm font-bold text-brand-primary hover:bg-brand-primary/5 transition-colors"
          >
            View All Featured Properties
          </Link>
        </div>
      </div>
    </section>
  );
}
