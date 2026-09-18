"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building2,
  IndianRupee,
  ArrowRight,
  Heart,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

interface SimilarRoomItem {
  _id: string;
  name: string;
  rent: number;
  coverImage?: string;
}

interface SimilarRoomsSectionProps {
  rooms: SimilarRoomItem[];
  hostelName: string;
  city?: string;
}

export function SimilarRoomsSection({
  rooms,
  hostelName,
  city = "Bhopal",
}: SimilarRoomsSectionProps) {
  const [savedIds, setSavedIds] = useState<Record<string, boolean>>({});

  if (!rooms || rooms.length === 0) return null;

  const toggleSave = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSavedIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="bg-gray-50/70 border-t border-gray-200/80 py-14 sm:py-18">
      <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-100 px-3 py-1 text-[11px] font-bold text-indigo-600 tracking-wider uppercase mb-2.5">
              <Sparkles className="h-3 w-3" /> More Options
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-gray-900">
              Similar Rooms at {hostelName}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
              Compare other room configurations, occupancy types, and stay packages available in this property.
            </p>
          </div>

          <Link
            href={`/city/${city.toLowerCase().replace(/\s+/g, "-")}`}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-indigo-600 hover:text-indigo-700 hover:underline shrink-0"
          >
            Explore all in {city} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* 4-Column Card Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {rooms.map((room) => {
            const isSaved = Boolean(savedIds[room._id]);
            return (
              <Link
                key={room._id}
                href={`/room/${room._id}`}
                className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-gray-200/90 bg-white shadow-2xs transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-indigo-200/80"
              >
                <div>
                  {/* Image Container with Badges */}
                  <div className="relative h-48 sm:h-52 w-full overflow-hidden bg-gray-100">
                    {room.coverImage ? (
                      <Image
                        src={room.coverImage}
                        alt={room.name}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                        <Building2 className="h-10 w-10 text-gray-300" strokeWidth={1.5} />
                      </div>
                    )}

                    {/* Gradient Overlay for Text Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Top Right Save Button */}
                    <button
                      onClick={(e) => toggleSave(e, room._id)}
                      className="absolute top-3 right-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur-md text-gray-700 shadow-sm transition-all hover:bg-white hover:scale-110"
                      aria-label="Save room"
                    >
                      <Heart
                        className={`h-4 w-4 ${isSaved ? "fill-rose-500 text-rose-500" : "text-gray-700"
                          }`}
                      />
                    </button>

                    {/* Top Left Verified Chip */}
                    <span className="absolute top-3 left-3 z-10 inline-flex items-center gap-1 rounded-full bg-black/60 backdrop-blur-md px-2.5 py-1 text-[10px] font-semibold text-white">
                      <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Verified
                    </span>

                    {/* Bottom Left Price Pill */}
                    <div className="absolute bottom-3 left-3 z-10 flex items-baseline gap-1 rounded-xl bg-white/95 backdrop-blur-md px-3 py-1.5 text-gray-900 shadow-md">
                      <IndianRupee className="h-3.5 w-3.5 text-gray-900 stroke-[2.5]" />
                      <span className="text-sm font-bold tracking-tight">
                        {room.rent.toLocaleString("en-IN")}
                      </span>
                      <span className="text-[10px] font-medium text-gray-500">/mo</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    <h3 className="text-base font-bold text-gray-900 line-clamp-1 group-hover:text-indigo-600 transition-colors">
                      {room.name}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Building2 className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
                      <span className="truncate">{hostelName}</span>
                      {city && (
                        <span className="text-gray-400">· {city}</span>
                      )}
                    </div>


                  </div>
                </div>

                {/* Card Footer CTA */}
                <div className="border-t border-gray-100 px-4 py-3 sm:px-5 flex items-center justify-between bg-gray-50/50 group-hover:bg-indigo-50/40 transition-colors">
                  <span className="text-xs font-semibold text-gray-700 group-hover:text-indigo-700">
                    View Room Details
                  </span>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-indigo-600 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
