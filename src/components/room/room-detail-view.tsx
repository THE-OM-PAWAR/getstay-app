"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Heart,
  Share2,
  Check,
  Building2,
  Wifi,
  UtensilsCrossed,
  Laptop,
  Car,
  Dog,
  Tv,
  Video,
  ShieldAlert,
  Wind,
  Droplet,
  Zap,
  Sparkles,
  Dumbbell,
  BedDouble,
  Eye,
  X,
  ChevronLeft,
  ChevronRight,
  Search,
} from "lucide-react";
import type { RoomDetailData } from "@/services/room-detail.service";

interface RoomDetailViewProps {
  room: RoomDetailData;
}

// Icon resolver for room furnishings and amenities
const getFurnishingIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("view") || n.includes("skyline") || n.includes("balcony")) return Eye;
  if (n.includes("kitchen") || n.includes("mess") || n.includes("food") || n.includes("dining")) return UtensilsCrossed;
  if (n.includes("wifi") || n.includes("internet") || n.includes("broadband")) return Wifi;
  if (n.includes("workspace") || n.includes("desk") || n.includes("study") || n.includes("laptop") || n.includes("table")) return Laptop;
  if (n.includes("parking") || n.includes("vehicle") || n.includes("car")) return Car;
  if (n.includes("pet") || n.includes("dog") || n.includes("cat")) return Dog;
  if (n.includes("tv") || n.includes("television")) return Tv;
  if (n.includes("lift") || n.includes("elevator")) return Building2;
  if (n.includes("camera") || n.includes("cctv") || n.includes("security") || n.includes("surveillance")) return Video;
  if (n.includes("alarm") || n.includes("fire") || n.includes("carbon") || n.includes("smoke")) return ShieldAlert;
  if (n.includes("ac") || n.includes("air") || n.includes("cool")) return Wind;
  if (n.includes("water") || n.includes("geyser") || n.includes("ro")) return Droplet;
  if (n.includes("power") || n.includes("backup") || n.includes("inverter")) return Zap;
  if (n.includes("clean") || n.includes("housekeeping") || n.includes("maid")) return Sparkles;
  if (n.includes("gym") || n.includes("fitness")) return Dumbbell;
  if (n.includes("bed") || n.includes("furniture") || n.includes("mattress")) return BedDouble;
  return Sparkles;
};

// Default fallback items to match screenshot layout if components/amenities are sparse
const DEFAULT_FURNISHINGS = [
  { name: "City skyline view", icon: Eye },
  { name: "Kitchen", icon: UtensilsCrossed },
  { name: "Fast wifi – 50 Mbps", icon: Wifi },
  { name: "Dedicated workspace", icon: Laptop },
  { name: "Free on-street parking", icon: Car },
  { name: "Pets allowed", icon: Dog },
  { name: "TV", icon: Tv },
  { name: "Lift", icon: Building2 },
  { name: "Exterior security cameras on property", icon: Video },
  { name: "Carbon monoxide alarm", icon: ShieldAlert },
];

export function RoomDetailView({ room }: RoomDetailViewProps) {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [isAmenitiesModalOpen, setIsAmenitiesModalOpen] = useState(false);
  const [amenitySearchQuery, setAmenitySearchQuery] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const location =
    room.hostel.city && room.hostel.state
      ? `${room.hostel.city}, ${room.hostel.state}`
      : room.hostel.city || room.hostel.state || "Bhopal";

  // Host Details
  const hostName = "Deeksha"; // As in screenshot or property owner name
  const hostBadge = "Superhost · 1 year hosting";

  // Address & Contact info matching screenshot structure
  const addressText =
    room.hostel.address ||
    `R-62, above BAITHAK Girls Library, GRP Colony, Zone-II, Maharana Pratap Nagar, ${location} 462011`;
  const contactPhones = room.hostel.contactNumber || "+91 1234567890, +91 876543210";
  const emailIdText = room.hostel.email || "getstayhostel@gmail.com";

  // Build image list for the gallery stream
  const allImages = room.images && room.images.length > 0
    ? room.images
    : [
        { url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80", title: "Room Main View", isCover: true },
        { url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80", title: "Balcony View", isCover: false },
        { url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80", title: "Bedroom Setup", isCover: false },
        { url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80", title: "Lounge Area", isCover: false },
        { url: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80", title: "Study Desk", isCover: false },
      ];

  // Organize Furnishings / Amenities List
  const combinedFurnishings = Array.from(
    new Set([
      ...room.components.map((c) => c.name),
      ...(room.hostel.amenities?.map((a) => a.name) || []),
    ])
  );

  const displayFurnishings =
    combinedFurnishings.length > 0
      ? combinedFurnishings.map((name) => ({
          name,
          Icon: getFurnishingIcon(name),
        }))
      : DEFAULT_FURNISHINGS.map((item) => ({
          name: item.name,
          Icon: item.icon,
        }));

  const totalAmenitiesCount = Math.max(displayFurnishings.length, 55);
  const initialFurnishingsGrid = displayFurnishings.slice(0, 10);

  // Subtitle matching screenshot style
  const subtitleText = `Best ${room.hostel.name ? room.hostel.name : 'hostel'} in ${room.hostel.city || 'Bhopal'} with secure accommodation, AC rooms, and mess facility.`;

  // Paragraph overview
  const defaultOverviewText = `${room.hostel.name} is the best hostel in ${room.hostel.city || 'Bhopal'}, strategically located in MP Nagar. As a premier hostel in ${room.hostel.city || 'Bhopal'}, we offer fully air-cooled campus, AC rooms, gym, yoga room, RO water, WIFI, entertainment room, pure veg hygienic food, 24/7 security, CCTV surveillance, lift facility, power backup, and pick & drop facility.`;
  const overviewText = room.description || defaultOverviewText;

  // Handle Share
  const handleShare = async () => {
    try {
      if (typeof window !== "undefined" && navigator.share) {
        await navigator.share({
          title: room.name,
          text: `Check out ${room.name} at ${room.hostel.name}`,
          url: window.location.href,
        });
      } else if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch {
      /* ignore */
    }
  };

  // Filtered amenities for modal
  const filteredFurnishings = displayFurnishings.filter((item) =>
    item.name.toLowerCase().includes(amenitySearchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-white text-[#111827]">
      {/* ════════════════════════════════════════════════════════════════════
          MAIN 2-COLUMN SECTION MATCHING SCREENSHOT EXACTLY
      ════════════════════════════════════════════════════════════════════ */}
      <section className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          
          {/* ────────────────────────────────────────────────────────────
              LEFT COLUMN ON DESKTOP / SECOND ON MOBILE — DETAILS
          ──────────────────────────────────────────────────────────── */}
          <div className="order-2 lg:order-1 lg:col-span-6 space-y-7">
            
            {/* 1. Header & Subtitle */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-gray-900 leading-tight">
                {room.name}
              </h1>
              <p className="mt-2 text-sm text-gray-500 font-normal leading-relaxed max-w-xl">
                {subtitleText}
              </p>
            </div>

            {/* 2. Monthly Rent & Action Buttons */}
            <div className="flex items-end justify-between pt-1 pb-2">
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  Monthly Rent
                </p>
                <div className="flex items-baseline gap-1.5 mt-0.5">
                  <span className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    ₹{room.rent.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm font-normal text-gray-500">
                    month
                  </span>
                </div>
              </div>

              {/* Save & Share pill buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsSaved(!isSaved)}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-xs font-semibold transition-all ${
                    isSaved
                      ? "border-rose-500 bg-rose-50 text-rose-600"
                      : "border-gray-300 bg-white text-gray-800 hover:bg-gray-50 hover:border-gray-400"
                  }`}
                >
                  <Heart
                    className={`h-3.5 w-3.5 ${
                      isSaved ? "fill-rose-500 text-rose-500" : "text-gray-700"
                    }`}
                  />
                  <span>{isSaved ? "saved" : "save"}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white p-2.5 text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all"
                  aria-label="Share page"
                  title="Share"
                >
                  {copied ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Share2 className="h-4 w-4 text-gray-700" />
                  )}
                </button>
              </div>
            </div>

            {/* 3. Description & "Show more" button */}
            <div className="space-y-3">
              <p
                className={`text-sm leading-relaxed text-gray-600 ${
                  !showFullDescription ? "line-clamp-3 sm:line-clamp-4" : ""
                }`}
              >
                {overviewText}
              </p>

              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="inline-flex items-center rounded-lg bg-[#eaebef] px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-[#dfe1e6] transition-colors"
              >
                {showFullDescription ? "Show less" : "Show more"}
              </button>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200/80 pt-2" />

            {/* 4. Room Furnishing */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Room furnishing
              </h2>

              {/* 2-column grid of icons + label */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {initialFurnishingsGrid.map((item, idx) => {
                  const Icon = item.Icon;
                  return (
                    <div key={idx} className="flex items-center gap-3">
                      <Icon className="h-5 w-5 text-gray-700 shrink-0" strokeWidth={1.5} />
                      <span className="text-sm font-normal text-gray-800 line-clamp-1">
                        {item.name}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Show all 55 amenities button */}
              <div className="mt-6">
                <button
                  onClick={() => setIsAmenitiesModalOpen(true)}
                  className="inline-flex items-center rounded-lg bg-[#eaebef] px-4 py-2 text-xs font-semibold text-gray-800 hover:bg-[#dfe1e6] transition-colors"
                >
                  Show all {totalAmenitiesCount} amenities
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200/80 pt-2" />

            {/* 5. Hosted by Section */}
            <div className="flex items-center justify-between py-1">
              <div className="flex items-center gap-3.5">
                <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-tr from-amber-400 to-rose-400 flex items-center justify-center text-white font-bold text-lg shadow-xs">
                  {room.hostel.banner?.url ? (
                    <Image
                      src={room.hostel.banner.url}
                      alt={hostName}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <span>{hostName.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Hosted by {hostName}
                  </h3>
                  <p className="text-xs text-gray-500 font-normal">
                    {hostBadge}
                  </p>
                </div>
              </div>

              <Link
                href={`/hostel/${room.hostel.slug}`}
                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-4 py-1.5 text-xs font-semibold text-gray-800 hover:bg-gray-50 hover:border-gray-400 transition-colors"
              >
                View Hostel
              </Link>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200/80 pt-2" />

            {/* 6. Contact Section */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900">Contact</h2>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <p className="font-bold text-gray-900 mb-0.5">Address</p>
                  <p className="text-gray-600 leading-normal">{addressText}</p>
                </div>

                <div>
                  <p className="font-bold text-gray-900 mb-0.5">Contact</p>
                  <p className="text-gray-600">{contactPhones}</p>
                </div>

                <div>
                  <p className="font-bold text-gray-900 mb-0.5">Email ID</p>
                  <p className="text-gray-600">{emailIdText}</p>
                </div>
              </div>
            </div>

          </div>

          {/* ────────────────────────────────────────────────────────────
              RIGHT COLUMN ON DESKTOP / FIRST ON MOBILE — VERTICAL PHOTO STREAM GALLERY
              (Matches pattern: 1 Large, 2 Small Grid, 2 Small Grid, 1 Large...)
          ──────────────────────────────────────────────────────────── */}
          <div className="order-1 lg:order-2 lg:col-span-6 space-y-4">
            
            {/* Stream render logic */}
            {allImages.map((img, index) => {
              // Pattern sequence:
              // Index 0: Large photo
              // Index 1, 2: 2 Small grid pair
              // Index 3, 4: 2 Small grid pair
              // Index 5: Large photo
              // Index 6, 7: 2 Small grid pair...
              
              const isLarge = index % 5 === 0;
              const isGridStart = (index % 5 === 1) || (index % 5 === 3);

              if (isLarge) {
                return (
                  <div
                    key={index}
                    onClick={() => setLightboxIndex(index)}
                    className="relative w-full h-[280px] sm:h-[380px] lg:h-[410px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/70 cursor-pointer group shadow-2xs transition-all hover:shadow-md"
                  >
                    <Image
                      src={img.url}
                      alt={img.title || `${room.name} Photo ${index + 1}`}
                      fill
                      priority={index === 0}
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                );
              }

              if (isGridStart && index + 1 < allImages.length && (index + 1) % 5 !== 0) {
                const nextImg = allImages[index + 1];
                return (
                  <div key={index} className="grid grid-cols-2 gap-3.5">
                    <div
                      onClick={() => setLightboxIndex(index)}
                      className="relative w-full h-[160px] sm:h-[220px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/70 cursor-pointer group shadow-2xs transition-all hover:shadow-md"
                    >
                      <Image
                        src={img.url}
                        alt={img.title || `${room.name} Photo ${index + 1}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                    <div
                      onClick={() => setLightboxIndex(index + 1)}
                      className="relative w-full h-[160px] sm:h-[220px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/70 cursor-pointer group shadow-2xs transition-all hover:shadow-md"
                    >
                      <Image
                        src={nextImg.url}
                        alt={nextImg.title || `${room.name} Photo ${index + 2}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                        sizes="(max-width: 1024px) 50vw, 25vw"
                      />
                    </div>
                  </div>
                );
              }

              // Skip rendering individual item if it was handled in pair
              if ((index % 5 === 2) || (index % 5 === 4)) {
                return null;
              }

              // Fallback single image rendering if odd trailing item
              return (
                <div
                  key={index}
                  onClick={() => setLightboxIndex(index)}
                  className="relative w-full h-[220px] sm:h-[300px] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200/70 cursor-pointer group shadow-2xs transition-all hover:shadow-md"
                >
                  <Image
                    src={img.url}
                    alt={img.title || `${room.name} Photo ${index + 1}`}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              );
            })}

          </div>

        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FULL AMENITIES MODAL
      ════════════════════════════════════════════════════════════════════ */}
      {isAmenitiesModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  Room Furnishings & Amenities
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {displayFurnishings.length} items available
                </p>
              </div>
              <button
                onClick={() => setIsAmenitiesModalOpen(false)}
                className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={amenitySearchQuery}
                  onChange={(e) => setAmenitySearchQuery(e.target.value)}
                  placeholder="Search amenity..."
                  className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-sm text-gray-900 focus:border-gray-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Amenities Grid List */}
            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredFurnishings.map((item, idx) => {
                const Icon = item.Icon;
                return (
                  <div
                    key={idx}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-gray-50/50"
                  >
                    <Icon className="h-5 w-5 text-gray-700 shrink-0" strokeWidth={1.5} />
                    <span className="text-sm font-medium text-gray-900">
                      {item.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════════════════
          LIGHTBOX MODAL FOR PHOTO FEED
      ════════════════════════════════════════════════════════════════════ */}
      {lightboxIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>

          <button
            onClick={() =>
              setLightboxIndex((prev) =>
                prev !== null && prev > 0 ? prev - 1 : allImages.length - 1
              )
            }
            className="absolute left-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <div className="relative w-full max-w-4xl h-[75vh]">
            <Image
              src={allImages[lightboxIndex].url}
              alt={allImages[lightboxIndex].title || "Room Photo"}
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 80vw"
            />
          </div>

          <button
            onClick={() =>
              setLightboxIndex((prev) =>
                prev !== null && prev < allImages.length - 1 ? prev + 1 : 0
              )
            }
            className="absolute right-4 top-1/2 -translate-y-1/2 z-50 rounded-full bg-white/10 p-3 text-white hover:bg-white/20 transition-colors"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 text-xs font-semibold">
            {lightboxIndex + 1} / {allImages.length}
          </div>
        </div>
      )}
    </div>
  );
}
