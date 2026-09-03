'use client'

import { motion } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Wifi,
  Droplet,
  Zap,
  BedDouble,
  UtensilsCrossed,
  Sparkles,
  HeartPulse,
  Headphones,
  Wind,
  WashingMachine,
  Dumbbell,
  Coffee,
  ShowerHead,
  Refrigerator,
  FlameKindling,
  Tv,
  ParkingSquare,
  Sofa,
  Home,
  Lock,
  Lightbulb,
  MonitorSmartphone,
  Utensils,
  ShieldCheck,
} from 'lucide-react'

interface Amenity {
  name: string
  description?: string
  available: boolean
}

interface AmenitiesGridProps {
  amenities?: Amenity[]
  title?: string
  subtitle?: string
}

// Default 8 reference items matching the reference image layout
const DEFAULT_AMENITIES: Array<{
  match: string[]
  icon: LucideIcon
  label: string
}> = [
  {
    match: ['wifi', 'internet', 'broadband'],
    icon: Wifi,
    label: 'High Speed\nWi-Fi',
  },
  {
    match: ['laundry', 'washing'],
    icon: WashingMachine,
    label: 'Laundry\nService',
  },
  {
    match: ['water', 'ro', 'geyser', 'hot water'],
    icon: Sparkles ,
    label: 'Hot Water',
  },
  {
    match: ['power', 'backup', 'electricity', 'inverter', 'generator'],
    icon: Zap,
    label: 'POWER\nBACKUP',
  },
  {
    match: ['gym', 'fitness'],
    icon: Dumbbell,
    label: 'Gym',
  },
  {
    match: ['house', 'cleaning', 'sweep', 'mop', 'housekeeping'],
    icon: Home,
    label: 'Housekeeping\nService',
  },
  {
    match: ['kitchen', 'mess', 'meal', 'food', 'tiffin', 'cook'],
    icon: UtensilsCrossed,
    label: 'Common\nKitchen',
  },
  {
    match: ['security', 'lock', 'cctv', 'support', 'warden'],
    icon: Lock,
    label: 'Security',
  },
]

// Fallback icon mapping for extra amenities
const getFallbackIcon = (name: string): LucideIcon => {
  const n = name.toLowerCase()
  if (n.includes('ac') || n.includes('air')) return Wind
  if (n.includes('tv')) return Tv
  if (n.includes('parking')) return ParkingSquare
  if (n.includes('gym')) return Dumbbell
  if (n.includes('lounge') || n.includes('common')) return Sofa
  if (n.includes('cafe') || n.includes('coffee')) return Coffee
  if (n.includes('fridge') || n.includes('refrigerator')) return Refrigerator
  if (n.includes('kitchen')) return FlameKindling
  if (n.includes('security') || n.includes('lock') || n.includes('cctv')) return Lock
  if (n.includes('light') || n.includes('lamp')) return Lightbulb
  if (n.includes('utensil')) return Utensils
  if (n.includes('geyser') || n.includes('shower')) return ShowerHead
  if (n.includes('wifi')) return Wifi
  if (n.includes('water')) return Droplet
  if (n.includes('power')) return Zap
  if (n.includes('bed')) return BedDouble
  return Sparkles
}

const matchesFeatured = (amenityName: string, matchList: string[]) =>
  matchList.some(kw => amenityName.toLowerCase().includes(kw))

export function AmenitiesGrid({
  amenities = [],
  title = "Amenities",
  subtitle = "Discover premium, safe, and vibrant accommodations tailored for students and young professionals.",
}: AmenitiesGridProps) {
  const available = amenities.filter(a => a.available)

  // Map the 8 reference items to available items if present, or use standard labels
  const gridItems = DEFAULT_AMENITIES.map(def => {
    const matched = available.find(a => matchesFeatured(a.name, def.match))
    return {
      icon: def.icon,
      label: matched ? matched.name : def.label,
      description: matched?.description,
    }
  })

  // Additional amenities beyond the core 8
  const usedNames = new Set(gridItems.map(g => g.label.toLowerCase()))
  const extraAmenities = available.filter(a => !usedNames.has(a.name.toLowerCase()))

  return (
    <div className="w-full">
      {/* Title & Subtitle section */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
          {title}
        </h2>
        <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* 8-Icon Compact Grid (4 cols on sm/desktop, 2 cols on mobile) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto px-4">
        {gridItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: idx * 0.04 }}
              className="flex flex-col items-center justify-center text-center rounded-2xl border border-gray-200/80 bg-[#f8f9fa] p-4 sm:p-4 hover:bg-white hover:border-[#3932d8]/30 hover:shadow-md transition-all duration-200 group cursor-default"
            >
              {/* Compact Minimalist Line Icon */}
              <div className="mb-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-2xs text-[#3932d8] group-hover:scale-110 transition-all duration-200">
                <Icon className="h-5 w-5" strokeWidth={1.8} />
              </div>

              {/* Label */}
              <p className="text-xs font-bold tracking-tight text-[#111827] uppercase whitespace-pre-line leading-tight">
                {item.label}
              </p>
            </motion.div>
          )
        })}
      </div>

      {/* Additional amenities as subtle pills below grid if available */}
      {extraAmenities.length > 0 && (
        <div className="mt-6 flex flex-wrap justify-center gap-2 max-w-3xl mx-auto px-4">
          {extraAmenities.map((a, idx) => {
            const Icon = getFallbackIcon(a.name)
            return (
              <div
                key={idx}
                className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-[#f9fafb] px-3 py-1 text-[11px] font-semibold text-gray-700 shadow-2xs"
              >
                <Icon className="h-3.5 w-3.5 text-[#3932d8]" strokeWidth={1.8} />
                <span>{a.name}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

