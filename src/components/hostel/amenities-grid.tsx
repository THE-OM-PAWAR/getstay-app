'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { LucideIcon } from 'lucide-react'
import {
  Wifi,
  WashingMachine,
  Zap,
  ShowerHead,
  Droplet,
  Dumbbell,
  Sparkles,
  UtensilsCrossed,
  ShieldCheck,
  Wind,
  Tv,
  Refrigerator,
  ParkingSquare,
  BookOpen,
  Sofa,
  Building2,
  BedDouble,
  Coffee,
  Search,
  X,
  Sparkle,
  Flame,
  KeyRound,
  Video,
  UserCheck,
  Headphones,
} from 'lucide-react'

export interface Amenity {
  name: string
  description?: string
  available: boolean
}

interface AmenitiesGridProps {
  amenities?: Amenity[]
  title?: string
  subtitle?: string
}

// Extensive Icon Resolver for Amenities
const getAmenityIcon = (name: string): LucideIcon => {
  const n = name.toLowerCase()
  if (n.includes('wifi') || n.includes('internet') || n.includes('broadband')) return Wifi
  if (n.includes('laundry') || n.includes('washing') || n.includes('washer')) return WashingMachine
  if (n.includes('power') || n.includes('backup') || n.includes('inverter') || n.includes('generator')) return Zap
  if (n.includes('geyser') || n.includes('hot water') || n.includes('shower')) return ShowerHead
  if (n.includes('ro') || n.includes('water') || n.includes('drinking') || n.includes('purifier')) return Droplet
  if (n.includes('gym') || n.includes('fitness') || n.includes('workout')) return Dumbbell
  if (n.includes('housekeeping') || n.includes('cleaning') || n.includes('maid') || n.includes('clean')) return Sparkles
  if (n.includes('kitchen') || n.includes('mess') || n.includes('food') || n.includes('meal') || n.includes('tiffin') || n.includes('dining')) return UtensilsCrossed
  if (n.includes('cctv') || n.includes('camera') || n.includes('surveillance')) return Video
  if (n.includes('guard') || n.includes('warden')) return UserCheck
  if (n.includes('security') || n.includes('lock')) return ShieldCheck
  if (n.includes('ac') || n.includes('air') || n.includes('cool') || n.includes('ventilation')) return Wind
  if (n.includes('tv') || n.includes('television')) return Tv
  if (n.includes('fridge') || n.includes('refrigerator')) return Refrigerator
  if (n.includes('parking') || n.includes('vehicle') || n.includes('bike') || n.includes('car')) return ParkingSquare
  if (n.includes('study') || n.includes('desk') || n.includes('table') || n.includes('library')) return BookOpen
  if (n.includes('lounge') || n.includes('sofa') || n.includes('common room') || n.includes('entertainment')) return Sofa
  if (n.includes('lift') || n.includes('elevator')) return Building2
  if (n.includes('bed') || n.includes('furniture') || n.includes('mattress')) return BedDouble
  if (n.includes('coffee') || n.includes('tea') || n.includes('cafe')) return Coffee
  if (n.includes('fire') || n.includes('extinguisher')) return Flame
  return Sparkle
}

// Categorization Resolver
const getAmenityCategory = (name: string): string => {
  const n = name.toLowerCase()
  if (n.includes('security') || n.includes('cctv') || n.includes('guard') || n.includes('lock') || n.includes('fire')) return 'Safety & Security'
  if (n.includes('kitchen') || n.includes('mess') || n.includes('food') || n.includes('meal') || n.includes('dining') || n.includes('ro') || n.includes('water') || n.includes('fridge') || n.includes('coffee')) return 'Dining & Food'
  if (n.includes('gym') || n.includes('lounge') || n.includes('tv') || n.includes('study') || n.includes('entertainment') || n.includes('sports')) return 'Lifestyle & Wellness'
  return 'Essentials & Comfort'
}

// Default Fallback Amenities if none provided
const DEFAULT_FALLBACK_AMENITIES: Amenity[] = [
  { name: 'High-Speed Wi-Fi', description: 'Unlimited fiber-optic internet connection', available: true },
  { name: 'Laundry Service', description: 'Washing machine & drying facility', available: true },
  { name: 'Hot Water / Geyser', description: '24/7 hot water supply in bathrooms', available: true },
  { name: 'Power Backup', description: '24/7 power backup for uninterrupted stay', available: true },
  { name: 'Fitness Gym', description: 'In-house workout & exercise area', available: true },
  { name: 'Housekeeping', description: 'Regular room and common area cleaning', available: true },
  { name: 'Common Kitchen / Mess', description: 'Hygienic vegetarian food & cooking space', available: true },
  { name: '24/7 Security & CCTV', description: 'Round-the-clock security surveillance', available: true },
]

export function AmenitiesGrid({
  amenities = [],
  title = "What this place offers",
  subtitle = "Everything you need for a comfortable, productive, and secure stay.",
}: AmenitiesGridProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Determine available amenities list
  const availableAmenities = useMemo(() => {
    const filtered = amenities.filter(a => a.available)
    return filtered.length > 0 ? filtered : DEFAULT_FALLBACK_AMENITIES
  }, [amenities])

  // Display initial 8 items in main grid
  const initialItems = availableAmenities.slice(0, 8)
  const hasMore = availableAmenities.length > 8

  // Modal ESC Key Listener & Body Scroll Lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsModalOpen(false)
    }
    if (isModalOpen) {
      document.body.style.overflow = 'hidden'
      window.addEventListener('keydown', handleKeyDown)
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isModalOpen])

  // Group amenities by category for modal
  const categorizedAmenities = useMemo(() => {
    const filtered = availableAmenities.filter(a =>
      a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (a.description && a.description.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    const map: Record<string, Amenity[]> = {}
    filtered.forEach(a => {
      const cat = getAmenityCategory(a.name)
      if (!map[cat]) map[cat] = []
      map[cat].push(a)
    })
    return map
  }, [availableAmenities, searchQuery])

  return (
    <div className="w-full">
      {/* ── Section Header ── */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111827]">
          {title}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* ── Featured Amenities Grid (2-col mobile, 4-col desktop) ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4.5 max-w-5xl mx-auto px-2 sm:px-4">
        {initialItems.map((item, idx) => {
          const Icon = getAmenityIcon(item.name)
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="group flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-[#f9fafb] p-4 sm:p-4.5 transition-all duration-200 hover:bg-white hover:border-[#3932d8]/30 hover:shadow-md cursor-default"
            >
              <div>
                {/* Icon Box */}
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-gray-200/70 text-[#3932d8] shadow-2xs group-hover:scale-105 group-hover:border-[#3932d8]/30 transition-all duration-200">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>

                {/* Amenity Title */}
                <h3 className="text-sm font-medium text-[#111827] tracking-tight leading-snug">
                  {item.name}
                </h3>

                {/* Description if present */}
                {item.description && (
                  <p className="mt-1 text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
              </div>

            </motion.div>
          )
        })}
      </div>

      {/* ── Show All Button ── */}
      {hasMore && (
        <div className="mt-8 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-[#111827] hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer shadow-2xs active:scale-[0.99]"
          >
            Show all {availableAmenities.length} amenities
          </button>
        </div>
      )}

      {/* ── All Amenities Modal ── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            />

            {/* Modal Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="relative z-10 w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-200"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200/80 px-6 py-4">
                <div>
                  <h3 className="text-lg font-medium text-[#111827]">What this place offers</h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {availableAmenities.length} verified amenities available
                  </p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-full p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="border-b border-gray-100 px-6 py-3 bg-[#fafafa]">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search amenities..."
                    className="w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 py-2 text-xs sm:text-sm text-[#111827] placeholder:text-gray-400 focus:border-[#3932d8] focus:outline-none transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Categorized List */}
              <div className="flex-1 overflow-y-auto px-6 py-6 space-y-8">
                {Object.keys(categorizedAmenities).length > 0 ? (
                  Object.entries(categorizedAmenities).map(([category, items]) => (
                    <div key={category} className="space-y-4">
                      <h4 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">
                        {category}
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {items.map((item, idx) => {
                          const Icon = getAmenityIcon(item.name)
                          return (
                            <div
                              key={idx}
                              className="flex items-start gap-3 py-2 border-b border-gray-100/60"
                            >
                              <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[#3932d8]">
                                <Icon className="h-4 w-4" strokeWidth={1.75} />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-[#111827]">{item.name}</p>
                                {item.description && (
                                  <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12 text-gray-500 text-sm">
                    No amenities found matching "{searchQuery}"
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
