"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin, Users, Wifi, Wind, Utensils, Dumbbell, Coffee, Gamepad2, Trees, Shield, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface RoomTypeBasic {
  _id: string;
  name: string;
  rent: number;
  images: Array<{
    url: string;
    title: string;
    isCover?: boolean;
  }>;
}

interface HostelCardProps {
  slug?: string;
  name: string;
  subtitle?: string;
  city: string;
  state?: string;
  totalRooms: number;
  accommodationType: 'boys' | 'girls' | 'coed' | 'separate';
  mainPhoto?: string;
  minRent?: number;
  roomTypes?: RoomTypeBasic[];
  amenities?: string[];
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
  if (n.includes("security") || n.includes("cctv") || n.includes("guard")) return <Shield className="h-3 w-3" />;
  return <Star className="h-3 w-3" />;
};

export function HostelCard({
  slug,
  name,
  subtitle,
  city,
  state,
  totalRooms,
  accommodationType,
  mainPhoto,
  minRent,
  roomTypes = [],
  amenities = [],
}: HostelCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const displayType = accommodationType === 'coed' ? 'CO-ED' : accommodationType.toUpperCase();
  const location = state ? `${city}, ${state}` : city;

  // Select top amenities to display (max 4)
  const topAmenities = amenities.slice(0, 4);

  // Build slideshow images
  const slideshowImages: Array<{
    url: string;
    label: string;
    price?: number;
    isHostel: boolean;
  }> = [];

  if (mainPhoto) {
    slideshowImages.push({
      url: mainPhoto,
      label: 'Hostel',
      price: minRent,
      isHostel: true,
    });
  }

  // Sort room types by price in ascending order
  const sortedRoomTypes = [...roomTypes].sort((a, b) => a.rent - b.rent);

  sortedRoomTypes.forEach(roomType => {
    const coverImage = roomType.images.find(img => img.isCover) || roomType.images[0];
    if (coverImage) {
      slideshowImages.push({
        url: coverImage.url,
        label: roomType.name,
        price: roomType.rent,
        isHostel: false,
      });
    }
  });

  const hasImages = slideshowImages.length > 0;

  // Detect if mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (autoScrollIntervalRef.current) {
      clearInterval(autoScrollIntervalRef.current);
      autoScrollIntervalRef.current = null;
    }

    if (slideshowImages.length > 1 && (isMobile || isHovered)) {
      autoScrollIntervalRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % slideshowImages.length);
      }, 2000);
    }

    return () => {
      if (autoScrollIntervalRef.current) {
        clearInterval(autoScrollIntervalRef.current);
        autoScrollIntervalRef.current = null;
      }
    };
  }, [isHovered, isMobile, slideshowImages.length]);

  const currentImage = slideshowImages[currentImageIndex];

  const cardContent = (
    <Card 
      className="group overflow-hidden rounded-3xl border-0 bg-background shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image section with slideshow */}
      <div className="relative h-64 md:h-72 overflow-hidden bg-muted rounded-3xl">
        {hasImages ? (
          <>
            {/* Image with fade animation */}
            <div className="relative w-full h-full">
              {slideshowImages.map((img, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                    index === currentImageIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.label}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                  />
                </div>
              ))}
            </div>

            {/* Dots indicator - bottom center */}
            {slideshowImages.length > 1 && (
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-full">
                {slideshowImages.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      index === currentImageIndex
                        ? 'w-4 bg-white'
                        : 'w-1.5 bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Price indicator overlay - bottom right style */}
            {currentImage.price && (
              <div className="absolute bottom-3 right-3 z-10 flex flex-col items-end rounded-xl bg-white dark:bg-background px-2.5 py-1.5 shadow-md">
                {currentImage.isHostel ? (
                  <>
                    <span className="text-[9px] text-muted-foreground font-medium uppercase tracking-wide mb-0.5">
                      Starting from
                    </span>
                    <span className="text-base md:text-lg font-black text-foreground">₹{currentImage.price.toLocaleString()}</span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] text-foreground font-semibold mb-0.5 line-clamp-1">
                      {currentImage.label}
                    </span>
                    <span className="text-xs text-muted-foreground font-medium">
                      at <span className="text-base font-black text-foreground">₹{currentImage.price.toLocaleString()}</span>
                    </span>
                  </>
                )}
              </div>
            )}

            {/* Type badge - top left */}
            <Badge
              className="absolute top-3 left-3 z-10 rounded-xl bg-white dark:bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground shadow-md"
              variant="secondary"
            >
              {displayType}
            </Badge>

            {/* Heart button - top right */}
            <button
              className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white dark:bg-background shadow-md hover:scale-110 transition-transform"
              aria-label="Add to favorites"
            >
              <svg className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm">
                <svg className="h-10 w-10 text-foreground/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
              </div>
            </div>

            {/* Type badge */}
            <Badge
              className="absolute top-3 left-3 z-10 rounded-xl bg-white dark:bg-background px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-foreground shadow-md"
              variant="secondary"
            >
              {displayType}
            </Badge>
          </>
        )}
      </div>

      {/* Card content */}
      <CardContent className="p-3.5 flex flex-col gap-2.5">
        {/* Title */}
        <div>
          <h3 className="text-base md:text-lg font-bold text-foreground leading-tight mb-1 line-clamp-1">
            {name}
          </h3>
          {/* Location */}
          <div className="flex items-center gap-1.5 text-muted-foreground mb-1">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="text-xs truncate">{location}</span>
          </div>
          {/* Description */}
          {subtitle && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {/* Amenities */}
        {topAmenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {topAmenities.map((amenity, idx) => (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-lg bg-muted/60 px-2.5 py-1.5 text-xs font-medium text-foreground"
              >
                {getAmenityIcon(amenity)}
                <span className="truncate max-w-[100px]">{amenity}</span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (slug) {
    return (
      <Link href={`/hostel/${slug}`} className="block h-full">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
