'use client'

import { motion } from 'framer-motion'
import {
  Video,
  UserCheck,
  Flame,
  Bell,
  KeyRound,
  DoorClosed,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

interface SafetyFeature {
  feature: string
  details?: string
  available: boolean
}

interface SafetyGridProps {
  safetyFeatures?: SafetyFeature[]
  title?: string
  subtitle?: string
  tagline?: string
}

// 3 Default reference safety cards matching the user reference image
const DEFAULT_SAFETY_ITEMS = [
  {
    feature: 'CCTV Surveillance',
    details: 'Implemented to ensure resident security and emergency preparedness.',
    icon: Video,
  },
  {
    feature: 'Security Guard',
    details: 'Implemented to ensure resident security and emergency preparedness.',
    icon: UserCheck,
  },
  {
    feature: 'Fire Safety Equipment',
    details: 'Implemented to ensure resident security and emergency preparedness.',
    icon: Flame,
  },
]

const getSafetyIcon = (featureName: string): LucideIcon => {
  const f = featureName.toLowerCase()
  if (f.includes('cctv') || f.includes('camera') || f.includes('surveillance') || f.includes('video')) return Video
  if (f.includes('guard') || f.includes('personnel') || f.includes('staff') || f.includes('warden')) return UserCheck
  if (f.includes('fire') || f.includes('smoke') || f.includes('extinguish')) return Flame
  if (f.includes('alarm') || f.includes('siren') || f.includes('alert') || f.includes('bell')) return Bell
  if (f.includes('key') || f.includes('biometric') || f.includes('card') || f.includes('lock')) return KeyRound
  if (f.includes('door') || f.includes('gate') || f.includes('entry')) return DoorClosed
  return ShieldCheck
}

export function SafetyGrid({
  safetyFeatures = [],
  title = "Safety & Security",
  subtitle = "Multi-layered protection protocols and round-the-clock monitoring ensuring a safe and reassuring environment.",
  tagline = "DESIGNED FOR COMPLETE PEACE OF MIND",
}: SafetyGridProps) {
  const available = safetyFeatures.filter(s => s.available)

  // Map real safety features or use the 3 reference items if empty
  const displayItems = available.length >= 3
    ? available.map(s => ({
        feature: s.feature,
        details: s.details || 'Implemented to ensure resident security and emergency preparedness.',
        icon: getSafetyIcon(s.feature),
      }))
    : DEFAULT_SAFETY_ITEMS.map((def, idx) => {
        const match = available[idx]
        return {
          feature: match ? match.feature : def.feature,
          details: match?.details || def.details,
          icon: match ? getSafetyIcon(match.feature) : def.icon,
        }
      })

  return (
    <div className="w-full">
      {/* Header section matching reference image */}
      <div className="text-center mb-6 sm:mb-8">
        <span className="text-[10px] font-mono font-bold tracking-[0.24em] text-[#3932d8] uppercase">
          {tagline}
        </span>
        <h2 className="mt-1.5 text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
          {title}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* Cards grid matching reference image (3-column compact layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto px-4">
        {displayItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.25, delay: idx * 0.06 }}
              className="flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-2xs hover:border-[#3932d8]/30 hover:shadow-md transition-all duration-200 group cursor-default"
            >
              <div>
                {/* Soft rounded icon box */}
                <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#f4f4f6] text-[#3932d8] group-hover:scale-105 transition-transform duration-200">
                  <Icon className="h-5 w-5" strokeWidth={1.8} />
                </div>

                {/* Feature Title */}
                <h3 className="text-base font-bold text-[#111827] tracking-tight">
                  {item.feature}
                </h3>

                {/* Feature Details */}
                <p className="mt-1.5 text-xs text-gray-500 leading-relaxed font-normal">
                  {item.details}
                </p>
              </div>

              {/* Card Footer Divider */}
              <div className="mt-4 border-t border-gray-100 pt-3 flex items-center justify-between text-[10px] font-mono">
                <span className="text-gray-400 font-medium">Standard Protocol</span>
                <span className="inline-flex items-center gap-1 text-[#10b981] font-bold">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" /> Active
                </span>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
