"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft, Share2, Heart, Check, Phone, MapPin, Mail, ChevronRight } from "lucide-react";

interface PhotoItem {
  url: string;
  isMain?: boolean;
}

interface HostelMobileViewProps {
  photos: PhotoItem[];
  name: string;
  location: string;
  accommodationType?: string;
  totalRooms?: number;
  minRent?: number | null;
  hostName?: string;
  description?: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  contactNumber?: string;
  email?: string;
  googleMapLink?: string;
}

export function HostelMobileView({
  photos = [],
  name,
  location,
  accommodationType = "Hostel",
  totalRooms,
  minRent,
  hostName = "Let'Stay - Noida",
  description,
  address,
  city,
  state,
  pincode,
  contactNumber,
  email,
}: HostelMobileViewProps) {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fallback image if no photos provided
  const displayPhotos = photos.length > 0
    ? photos
    : [{ url: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&q=80&w=1200" }];

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const width = scrollRef.current.offsetWidth;
    if (width > 0) {
      const index = Math.round(scrollRef.current.scrollLeft / width);
      setActiveIndex(index);
    }
  };

  const handleShare = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        await navigator.share({
          title: name,
          text: `Check out ${name} in ${location}`,
          url: window.location.href,
        });
      } else if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* ignore user cancel */
    }
  };

  const formattedType = accommodationType === "coed"
    ? "Co-Ed Hostel"
    : accommodationType
    ? `${accommodationType.charAt(0).toUpperCase() + accommodationType.slice(1)} Hostel`
    : "Hostel";

  // Calculated dummy original price if minRent is available
  const currentRent = minRent || 7400;
  const originalRent = Math.round(currentRent * 1.6 / 100) * 100;
  const fullAddress = [address, city, state, pincode].filter(Boolean).join(", ");

  const defaultDescription = description || `${name} is a premier ${formattedType.toLowerCase()} located in ${location || "Noida, India"}. Offering comfortable, fully furnished rooms with AC, high-speed WiFi, 24/7 security, hygienic food, and modern amenities designed for a seamless living experience.`;

  return (
    <div className="block sm:hidden relative bg-white pb-2">
      {/* ══════════════════════════════════════════════
          1. TOP FLOATING ACTION BAR OVER PHOTO
      ══════════════════════════════════════════════ */}
      <div className="absolute top-4 left-0 right-0 z-30 flex items-center justify-between px-4 pointer-events-none">
        {/* Back Arrow */}
        <button
          onClick={() => router.back()}
          className="pointer-events-auto h-9 w-9 rounded-full bg-white/90 hover:bg-white text-gray-900 border border-gray-200/50 backdrop-blur-md flex items-center justify-center shadow-md active:scale-95 transition-transform"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>

        {/* Share & Heart Action Buttons */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            onClick={handleShare}
            className="pointer-events-auto h-9 w-9 rounded-full bg-white/90 hover:bg-white text-gray-900 border border-gray-200/50 backdrop-blur-md flex items-center justify-center shadow-md active:scale-95 transition-transform"
            aria-label="Share listing"
          >
            {copied ? <Check className="h-4.5 w-4.5 text-emerald-600" /> : <Share2 className="h-4.5 w-4.5" />}
          </button>
          <button
            onClick={() => setIsSaved(!isSaved)}
            className="pointer-events-auto h-9 w-9 rounded-full bg-white/90 hover:bg-white text-gray-900 border border-gray-200/50 backdrop-blur-md flex items-center justify-center shadow-md active:scale-95 transition-transform"
            aria-label="Save listing"
          >
            <Heart className={`h-4.5 w-4.5 ${isSaved ? "fill-red-500 text-red-500" : "text-gray-900"}`} />
          </button>
        </div>
      </div>

      {/* ══════════════════════════════════════════════
          2. MOBILE HERO PHOTO CAROUSEL
      ══════════════════════════════════════════════ */}
      <div className="relative w-full h-[340px] bg-gray-100 overflow-hidden">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory scrollbar-hide select-none"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {displayPhotos.map((photo, idx) => (
            <div
              key={idx}
              className="relative w-full h-full shrink-0 snap-start bg-gray-900/5"
            >
              <Image
                src={photo.url}
                alt={`${name} photo ${idx + 1}`}
                fill
                priority={idx === 0}
                className="object-cover"
                sizes="100vw"
              />
            </div>
          ))}
        </div>

        {/* Photo Counter Badge (Bottom Right Overlay) */}
        {displayPhotos.length > 0 && (
          <div className="absolute bottom-9 right-4 z-20 bg-black/75 text-white text-[11px] font-semibold px-3 py-1 rounded-full backdrop-blur-md shadow-sm border border-white/10">
            {activeIndex + 1} / {displayPhotos.length}
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          3. OVERLAPPING SHEET CONTENT CONTAINER
      ══════════════════════════════════════════════ */}
      <div className="relative z-20 -mt-7 rounded-t-[28px] bg-white px-5 pt-6 shadow-[0_-6px_24px_rgba(0,0,0,0.06)] border-t border-gray-100">
        
        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight text-[#111827] leading-tight">
          {name}
        </h1>

        {/* Sub-caption */}
        <p className="mt-1 text-sm font-normal text-gray-600">
          Entire rental unit in {location || "Noida, India"}
        </p>

        {/* Meta Specs Row */}
        <p className="mt-0.5 text-xs text-gray-500 font-normal">
          {totalRooms ? `${totalRooms} guests · ${totalRooms} bedrooms` : "5 guests · 2 bedrooms · 2 beds"} · 2 bathrooms
        </p>

        {/* 3-Column Rating & Badge Card (Matching Reference Screenshot) */}
        <div className="my-5 rounded-2xl border border-gray-200/90 bg-white p-4 shadow-2xs">
          <div className="grid grid-cols-3 divide-x divide-gray-200 text-center items-center">
            
            {/* Col 1: Rating */}
            <div className="flex flex-col items-center justify-center px-1">
              <span className="text-xl font-bold text-[#111827] leading-tight">5.0</span>
              <div className="flex text-black text-[9px] gap-0.5 mt-1">
                ★★★★★
              </div>
            </div>

            {/* Col 2: Guest Favourite Emblem */}
            <div className="flex flex-col items-center justify-center px-1">
              <div className="flex items-center gap-0.5 text-[#111827]">
                <svg className="w-3.5 h-3.5 text-[#c99026] shrink-0" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 2.667c-1.333 4-4 6.667-8 8 4 1.333 6.667 4 8 8 1.333-4 4-6.667 8-8-4-1.333-6.667-4-8-8zM7.333 20c-1 3-3 5-6 6 3 1 5 3 6 6 1-3 3-5 6-6-3-1-5-3-6-6zM24.667 20c-1 3-3 5-6 6 3 1 5 3 6 6 1-3 3-5 6-6-3-1-5-3-6-6z" />
                </svg>
                <div className="text-center leading-none">
                  <span className="block text-[11px] font-bold text-[#111827]">Guest</span>
                  <span className="block text-[11px] font-bold text-[#111827]">favourite</span>
                </div>
                <svg className="w-3.5 h-3.5 text-[#c99026] shrink-0 scale-x-[-1]" viewBox="0 0 32 32" fill="currentColor">
                  <path d="M16 2.667c-1.333 4-4 6.667-8 8 4 1.333 6.667 4 8 8 1.333-4 4-6.667 8-8-4-1.333-6.667-4-8-8zM7.333 20c-1 3-3 5-6 6 3 1 5 3 6 6 1-3 3-5 6-6-3-1-5-3-6-6zM24.667 20c-1 3-3 5-6 6 3 1 5 3 6 6 1-3 3-5 6-6-3-1-5-3-6-6z" />
                </svg>
              </div>
            </div>

            {/* Col 3: Reviews */}
            <div className="flex flex-col items-center justify-center px-1">
              <span className="text-xl font-bold text-[#111827] leading-tight">13</span>
              <span className="text-[11px] text-gray-500 font-medium underline mt-0.5">Reviews</span>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200/80 my-4" />

        {/* Hosted By Row */}
        <div className="flex items-center gap-3.5 py-1">
          <div className="relative h-12 w-12 rounded-full overflow-hidden bg-[#ffcc00] flex items-center justify-center font-bold text-amber-950 text-base shadow-xs shrink-0 border border-amber-300">
            {hostName.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-[#111827] text-base leading-snug">
              Hosted by {hostName}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Superhost · Verified Partner</p>
          </div>
        </div>

        <div className="border-b border-gray-200/80 my-4" />

        {/* Expandable About / Description Section */}
        <div className="py-2">
          <h3 className="font-semibold text-[#111827] text-base mb-2">About this space</h3>
          <p className={`text-sm text-gray-600 leading-relaxed ${isDescExpanded ? "" : "line-clamp-3"}`}>
            {defaultDescription}
          </p>
          <button
            onClick={() => setIsDescExpanded(!isDescExpanded)}
            className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-[#111827] underline cursor-pointer"
          >
            <span>{isDescExpanded ? "Show less" : "Show more"}</span>
            <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isDescExpanded ? "-rotate-90" : "rotate-90"}`} />
          </button>
        </div>

        {/* Contact Info Accordion Card */}
        {(fullAddress || contactNumber || email) && (
          <div className="mt-5 rounded-2xl border border-gray-200/80 bg-[#f9fafb] p-4">
            <h4 className="font-semibold text-[#111827] text-sm mb-3">Host Contact & Address</h4>
            <div className="space-y-3 text-xs text-gray-600">
              {fullAddress && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="h-4 w-4 text-[#3932d8] shrink-0 mt-0.5" />
                  <span>{fullAddress}</span>
                </div>
              )}
              {contactNumber && (
                <div className="flex items-center gap-2.5">
                  <Phone className="h-4 w-4 text-[#3932d8] shrink-0" />
                  <a href={`tel:${contactNumber}`} className="hover:underline font-medium text-gray-900">{contactNumber}</a>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-2.5">
                  <Mail className="h-4 w-4 text-[#3932d8] shrink-0" />
                  <a href={`mailto:${email}`} className="hover:underline text-gray-800 break-all">{email}</a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ══════════════════════════════════════════════
          4. STICKY BOTTOM ACTION BAR (FIXED AT BOTTOM)
      ══════════════════════════════════════════════ */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200/90 px-5 py-3 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1.5">
            <span className="text-xs text-gray-400 line-through font-normal">
              ₹{originalRent.toLocaleString("en-IN")}
            </span>
            <span className="text-lg font-bold text-[#111827] underline">
              ₹{currentRent.toLocaleString("en-IN")}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 font-normal">
            for 1 month · Zero brokerage
          </p>
        </div>

        <a
          href="#rooms"
          className="bg-[#3932d8] hover:bg-[#2e28b8] active:scale-95 text-white font-semibold text-base px-7 py-3 rounded-xl shadow-md shadow-[#3932d8]/25 transition-all text-center shrink-0"
        >
          Reserve
        </a>
      </div>
    </div>
  );
}

