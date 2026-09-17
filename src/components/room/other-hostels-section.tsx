"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  MapPin,
  ChevronRight,
  ArrowRight,
  ShieldCheck,
  Heart,
} from "lucide-react";

interface OtherHostelItem {
  _id: string;
  slug: string;
  name: string;
  city?: string;
  accommodationType?: string;
  coverImage?: string;
}

interface OtherHostelsSectionProps {
  hostels: OtherHostelItem[];
  city?: string;
}

export function OtherHostelsSection({
  hostels,
  city = "Bhopal",
}: OtherHostelsSectionProps) {
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  if (!hostels || hostels.length === 0) return null;

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const getGenderBadge = (type?: string) => {
    const t = (type || "").toLowerCase();
    if (t === "girls") {
      return { label: "Girls Hostel", bg: "bg-pink-50 text-pink-700 border-pink-200" };
    }
    if (t === "coed" || t === "separate") {
      return { label: "Co-Ed Hostel", bg: "bg-purple-50 text-purple-700 border-purple-200" };
    }
    return { label: "Boys Hostel", bg: "bg-blue-50 text-blue-700 border-blue-200" };
  };

  return (
    <section className="bg-white border-t border-gray-200/80 py-14 sm:py-18">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 border border-gray-200/60 px-3 py-1 text-[11px] font-bold text-gray-700 tracking-wider uppercase mb-2.5">
              <Building2 className="h-3 w-3 text-gray-500" /> Nearby Accommodations
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              Other Hostels in {city}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              Discover top-rated, verified student hostels and stay spaces in {city}.
            </p>
          </div>

          <Link
            href={`/city/${city.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-gray-900 hover:text-indigo-600 hover:underline shrink-0 transition-colors"
          >
            Browse all hostels in {city} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 4-Column Card Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {hostels.map((hostel) => {
            const isSaved = Boolean(savedIds[hostel._id]);
            const badge = getGenderBadge(hostel.accommodationType);

            return (
              <Link
                key={hostel._id}
                href={`/hostel/${hostel.slug}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-gray-300"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                    {hostel.coverImage ? (
                      <Image
                        src={hostel.coverImage}
                        alt={hostel.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
                        <Building2 className="h-10 w-10" strokeWidth={1.5} />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />

                    {/* Top Left Gender Badge */}
                    <span
                      className={`absolute top-3 left-3 z-10 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold shadow-xs backdrop-blur-md ${badge.bg}`}
                    >
                      {badge.label}
                    </span>

                    {/* Top Right Heart Save Button */}
                    <button
                      onClick={(e) => toggleSave(e, hostel._id)}
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-gray-700 shadow-sm transition-all hover:bg-white hover:scale-110"
                      aria-label="Save hostel"
                    >
                      <Heart
                        className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-gray-700"
                          }`}
                      />
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="p-4 sm:p-5 space-y-2">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {hostel.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5 text-rose-500 shrink-0" />
                      <span className="truncate">{hostel.city || city}</span>
                    </div>

                    {/* Highlights */}
                    <div className="flex items-center gap-2 pt-1 text-[11px] font-medium text-gray-600">
                      <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                        <ShieldCheck className="h-3.5 w-3.5" /> Verified Hostel
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer CTA */}
                <div className="border-t border-gray-100 px-4 py-3 sm:px-5 flex items-center justify-between bg-gray-50/50 group-hover:bg-gray-100/60 transition-colors">
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-gray-900">
                    View Full Hostel
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
