"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";
import { MapPin, UserCheck, ShieldCheck, Tag, Star, Building2, ArrowUpRight } from "lucide-react";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const categories = [
  {
    title: "All Bhopal Student Stays",
    href: "/city/bhopal",
    badge: "Bhopal Hub",
    description: "Explore complete listings of student hostels, PGs, and shared rooms in Bhopal.",
    icon: Building2,
    accent: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    title: "Boys Hostels in Bhopal",
    href: "/city/bhopal/boys-hostel",
    badge: "Boys PG & Stays",
    description: "Find verified boys hostels near major colleges, MANIT, and coaching hubs.",
    icon: UserCheck,
    accent: "bg-indigo-50 text-indigo-600 border-indigo-100",
  },
  {
    title: "Girls Hostels in Bhopal",
    href: "/city/bhopal/girls-hostel",
    badge: "Girls PG & Stays",
    description: "Secure, verified girls hostels with female wardens, 24/7 CCTV, and mess food.",
    icon: ShieldCheck,
    accent: "bg-purple-50 text-purple-600 border-purple-100",
  },
  {
    title: "Affordable Hostels in Bhopal",
    href: "/city/bhopal/affordable",
    badge: "Budget Friendly",
    description: "Quality student accommodation starting from ₹3,999/month with essential amenities.",
    icon: Tag,
    accent: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    title: "Best Hostels & PGs in Bhopal",
    href: "/city/bhopal/best",
    badge: "Top Rated",
    description: "High-rated student properties with premium rooms, high-speed WiFi, and daily housekeeping.",
    icon: Star,
    accent: "bg-amber-50 text-amber-600 border-amber-100",
  },
];

export function BhopalCategoriesSection() {
  return (
    <section className="bg-gradient-to-b from-gray-50 via-white to-gray-50 py-16 md:py-20 border-y border-gray-100">
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
            <div className="flex items-center gap-2 mb-2 text-brand-primary font-semibold text-xs uppercase tracking-wider">
              <MapPin className="h-3.5 w-3.5" />
              <span>Explore Bhopal Market</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-brand-dark tracking-tight">
              Student Accommodation in Bhopal
            </h2>
            <p className="text-gray-600 mt-2 max-w-2xl text-sm md:text-base">
              Browse dedicated category hubs designed to help students and young professionals find verified hostels and PGs across Bhopal.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link
              href="/city/bhopal"
              className="inline-flex items-center gap-1.5 text-brand-primary font-semibold text-sm hover:underline"
            >
              <span>Explore all Bhopal stays</span>
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>

        {/* Categories Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div key={cat.href} variants={cardVariants}>
                <Link
                  href={cat.href}
                  className="group relative flex flex-col justify-between h-full p-6 bg-white rounded-2xl border border-gray-200/80 shadow-xs hover:shadow-lg hover:border-brand-primary/40 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`p-3 rounded-xl border ${cat.accent}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                        {cat.badge}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-brand-dark group-hover:text-brand-primary transition-colors mb-2 flex items-center justify-between">
                      <span>{cat.title}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-brand-primary shrink-0 ml-2" />
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 font-normal leading-relaxed">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
