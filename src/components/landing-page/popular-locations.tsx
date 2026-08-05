"use client";

import Link from "next/link";
import Image from "next/image";
import { SlidersHorizontal, Wifi, Coffee, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion, Variants } from "framer-motion";

export interface CityData {
  slug: string;
  name: string;
  state: string;
  hostelCount: number;
}

interface PopularLocationsProps {
  cities: CityData[];
}

const popularCitiesPreset = [
  {
    name: "Delhi",
    slug: "delhi",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bhopal",
    slug: "bhopal",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Mumbai",
    slug: "mumbai",
    image: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Bengaluru",
    slug: "bengaluru",
    image: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Jaipur",
    slug: "jaipur",
    image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80",
  },
  {
    name: "Goa",
    slug: "goa",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

export function PopularLocations({ cities }: PopularLocationsProps) {
  const router = useRouter();

  const cityImages: Record<string, string> = {
    delhi: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80",
    bhopal: "https://images.unsplash.com/photo-1626248967926-d64e1c7fdf31?auto=format&fit=crop&w=400&q=80",
    mumbai: "https://images.unsplash.com/photo-1566552881560-0be862a7c445?auto=format&fit=crop&w=400&q=80",
    bengaluru: "https://images.unsplash.com/photo-1596176530529-78163a4f7af2?auto=format&fit=crop&w=400&q=80",
    jaipur: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80",
    goa: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80",
    dhar: "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?auto=format&fit=crop&w=400&q=80",
  };

  const defaultImage = "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=400&q=80";

  // Map real database cities
  const dbCities = (cities || []).map((c) => ({
    name: c.name,
    slug: c.slug,
    image: cityImages[c.slug.toLowerCase()] || defaultImage,
  }));

  const dbSlugs = new Set(dbCities.map((c) => c.slug.toLowerCase()));
  const staticCities = popularCitiesPreset.filter((sc) => !dbSlugs.has(sc.slug.toLowerCase()));

  const displayCities = [...dbCities, ...staticCities].slice(0, 6);

  const handleFilterClick = (filterType: string, value: string) => {
    router.push(`/search?${filterType}=${encodeURIComponent(value)}`);
  };

  return (
    <section className="bg-brand-white py-16 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

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
              <MapPin className="h-4 w-4" />
              <span>Explore</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-brand-dark tracking-tight">
              Popular Destinations
            </h2>
          </div>
          <p className="text-gray-500 mt-4 md:mt-0 max-w-sm md:text-right font-medium">
            Find the perfect stay in India's most vibrant student & professional hubs.
          </p>
        </motion.div>

        {/* Cities Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-10"
        >
          {displayCities.map((city) => (
            <motion.div key={city.slug} variants={itemVariants}>
              <Link
                href={`/city/${city.slug}`}
                className="group relative block h-48 md:h-56 overflow-hidden rounded-2xl bg-gray-100 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl cursor-pointer"
              >
                <Image
                  src={city.image}
                  alt={`Hostels in ${city.name}`}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 16vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-brand-dark/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <span className="block text-lg font-bold text-white tracking-wide group-hover:text-brand-primary-light transition-colors">
                    {city.name}
                  </span>
                  <span className="block text-xs text-white/70 mt-1 opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Explore stays →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Filter Pills Row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="flex flex-wrap gap-3 items-center overflow-x-auto pb-4 scrollbar-hide pt-2"
        >
          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-brand-dark bg-white hover:border-brand-primary hover:text-brand-primary hover:shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <SlidersHorizontal className="h-4 w-4" />
            All Filters
          </button>

          <button
            onClick={() => handleFilterClick("maxRent", "5000")}
            className="rounded-full bg-brand-primary hover:bg-brand-primary/90 text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
          >
            Under ₹5,000
          </button>

          <button
            onClick={() => handleFilterClick("maxRent", "10000")}
            className="rounded-full bg-brand-primary hover:bg-brand-primary/90 text-white px-5 py-2.5 text-sm font-semibold shadow-sm hover:shadow active:scale-95 transition-all cursor-pointer"
          >
            Under ₹10,000
          </button>

          <button
            onClick={() => handleFilterClick("amenity", "wifi")}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-brand-dark bg-white hover:border-brand-primary hover:text-brand-primary hover:shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Wifi className="h-4 w-4" />
            Free WiFi
          </button>

          <button
            onClick={() => handleFilterClick("amenity", "breakfast")}
            className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-brand-dark bg-white hover:border-brand-primary hover:text-brand-primary hover:shadow-sm active:scale-95 transition-all cursor-pointer"
          >
            <Coffee className="h-4 w-4" />
            Meals Included
          </button>
        </motion.div>
      </div>
    </section>
  );
}
