'use client'

import { motion } from 'framer-motion'
import {
  Bed, Lamp, Wind, Shirt, BookOpen, Armchair,
  Wifi, Tv, Coffee, Package, Monitor,
  Refrigerator, ShowerHead, Sofa, Sparkles,
  type LucideIcon,
} from 'lucide-react'

interface RoomComponent {
  _id: string
  name: string
  description?: string
}

interface RoomComponentsGridProps {
  components: RoomComponent[]
  title?: string
  subtitle?: string
}

const getComponentIcon = (name: string): LucideIcon => {
  const n = name.toLowerCase()
  if (n.includes('bed') || n.includes('mattress')) return Bed
  if (n.includes('study') || n.includes('desk') || n.includes('table')) return BookOpen
  if (n.includes('chair') || n.includes('seat')) return Armchair
  if (n.includes('sofa') || n.includes('couch')) return Sofa
  if (n.includes('wardrobe') || n.includes('cupboard') || n.includes('closet')) return Shirt
  if (n.includes('fan') || n.includes('ac') || n.includes('air')) return Wind
  if (n.includes('light') || n.includes('lamp')) return Lamp
  if (n.includes('wifi') || n.includes('internet')) return Wifi
  if (n.includes('tv') || n.includes('television')) return Tv
  if (n.includes('coffee') || n.includes('tea')) return Coffee
  if (n.includes('monitor') || n.includes('screen')) return Monitor
  if (n.includes('fridge') || n.includes('refrigerator')) return Refrigerator
  if (n.includes('geyser') || n.includes('heater') || n.includes('shower')) return ShowerHead
  return Sparkles
}

export function RoomComponentsGrid({
  components = [],
  title = "Room Furnishings",
  subtitle = "Thoughtfully equipped with essential high-quality furnishings for your daily comfort.",
}: RoomComponentsGridProps) {
  if (components.length === 0) return null

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

      {/* Card-less, borderless compact grid of items */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-y-5 gap-x-6 max-w-4xl mx-auto px-4">
        {components.map((component, idx) => {
          const Icon = getComponentIcon(component.name)
          return (
            <motion.div
              key={component._id || idx}
              initial={{ opacity: 0, y: 6 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: idx * 0.03 }}
              className="flex items-center gap-3 group cursor-default"
            >
              {/* Minimalist round icon container without box/card */}
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f1f3ff] text-[#3932d8] group-hover:bg-[#3932d8] group-hover:text-white transition-all duration-200">
                <Icon className="h-4 w-4" strokeWidth={1.8} />
              </div>

              {/* Text label */}
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-[#111827] tracking-tight truncate group-hover:text-[#3932d8] transition-colors">
                  {component.name}
                </p>
                {component.description && (
                  <p className="text-[10px] text-gray-400 truncate font-normal">
                    {component.description}
                  </p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

