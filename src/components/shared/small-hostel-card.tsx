"use client";

import { useState, useEffect, useRef } from "react";
import { MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface RoomType {
  name: string;
  rent: number;
  images?: Array<{
    url: string;
    title: string;
    isCover?: boolean;
  }>;
}

interface SmallHostelCardProps {
  id: string;
  name: string;
  location: string;
  price: number;
  image: string;
  slug: string;
  roomTypes?: RoomType[];
}

export function SmallHostelCard({
  id,
  name,
  location,
  price,
  image,
  slug,
  roomTypes = [],
}: SmallHostelCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const autoScrollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Build slideshow images
  const slideshowImages: Array<{
    url: string;
    label: string;
    price?: number;
    isHostel: boolean;
  }> = [];

  if (image) {
    slideshowImages.push({
      url: image,
      label: 'Hostel',
      price: price,
      isHostel: true,
    });
  }

  // Sort room types by price in ascending order and add their images
  const sortedRoomTypes = [...roomTypes].sort((a, b) => a.rent - b.rent);

  sortedRoomTypes.forEach(roomType => {
    if (roomType.images && roomType.images.length > 0) {
      const coverImage = roomType.images.find(img => img.isCover) || roomType.images[0];
      if (coverImage) {
        slideshowImages.push({
          url: coverImage.url,
          label: roomType.name,
          price: roomType.rent,
          isHostel: false,
        });
      }
    }
  });

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

  return (
    <Link
      href={`/hostel/${slug}`}
      className="group relative flex flex-col overflow-hidden rounded-xl bg-white transition-all duration-300 h-full snap-start cursor-pointer border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:-translate-y-1 p-1.5"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top Image with Slideshow */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
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
                sizes="(max-width: 768px) 100vw, 200px"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Price indicator overlay - top left */}
        {currentImage && currentImage.price && (
          <div className="absolute top-0 left-0 z-10 px-1.5 py-0.5 text-[9px] font-semibold text-white bg-black/80 backdrop-blur-md rounded-br-md rounded-tl-lg shadow-sm max-w-[calc(100%-2rem)] truncate">
            {currentImage.isHostel ? (
              `Starting ₹${currentImage.price}`
            ) : (
              `₹${currentImage.price} for ${currentImage.label}`
            )}
          </div>
        )}

        {/* Dots indicator - bottom center */}
        {slideshowImages.length > 1 && (
          <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-10 flex gap-0.5 bg-black/30 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
            {slideshowImages.map((_, index) => (
              <div
                key={index}
                className={`h-1 rounded-full transition-all duration-300 ${
                  index === currentImageIndex
                    ? 'w-3 bg-white'
                    : 'w-1 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
      </div>

      {/* Content Area */}
      <div className="flex flex-col flex-1 pt-2 px-1 pb-0.5">
        <h3 className="text-xs font-extrabold text-gray-900 leading-tight mb-0.5 truncate group-hover:text-brand-primary transition-colors">
          {name}
        </h3>

        {/* Location & Room Types Section */}
        <div className="mt-auto border-t border-gray-100/80 pt-1.5">
          {/* Location */}
          <div className="flex items-center gap-1">
            <MapPin className="h-2.5 w-2.5 text-gray-400 flex-shrink-0" />
            <span className="text-[10px] text-gray-600 font-medium truncate">
              {location}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
