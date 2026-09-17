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
}

const DEFAULT_SAFETY_ITEMS = [
  {
    feature: '24/7 CCTV Surveillance',
    details: 'Round-the-clock video monitoring across common areas and entry points.',
    icon: Video,
  },
  {
    feature: 'Security Guard & Warden',
    details: 'On-duty personnel ensuring resident safety and emergency preparedness.',
    icon: UserCheck,
  },
  {
    feature: 'Fire Safety Equipment',
    details: 'Certified fire extinguishers and safety equipment installed on every floor.',
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
  subtitle = "Multi-layered protection protocols ensuring complete safety and peace of mind.",
}: SafetyGridProps) {
  const available = safetyFeatures.filter(s => s.available)

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
      {/* ── Minimal Section Header ── */}
      <div className="text-center mb-8 sm:mb-10">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111827]">
          {title}
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
          {subtitle}
        </p>
      </div>

      {/* ── Minimal Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 max-w-5xl mx-auto px-4">
        {displayItems.map((item, idx) => {
          const Icon = item.icon
          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: idx * 0.04 }}
              className="flex items-start gap-4 p-5 rounded-2xl border border-gray-200/70 bg-white hover:border-gray-300 hover:shadow-2xs transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-[#111827]">
                <Icon className="h-5 w-5" strokeWidth={1.75} />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-medium text-[#111827] tracking-tight">
                  {item.feature}
                </h3>
                <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                  {item.details}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}


