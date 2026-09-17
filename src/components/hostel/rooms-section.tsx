'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CompactRoomCard } from './compact-room-card'

interface RoomType {
  _id: string
  name: string
  description: string
  rent: number
  images: Array<{ url: string; isCover?: boolean }>
  components: Array<{ name: string; description: string }>
}

interface RoomsSectionProps {
  rooms: RoomType[]
  title?: string
  subtitle?: string
}

export function RoomsSection({ rooms, title, subtitle }: RoomsSectionProps) {
  const [activeTab, setActiveTab] = useState<string>('AC Room')

  if (!rooms || rooms.length === 0) return null

  // Filter tabs matching reference image
  const tabs = ['AC Room', 'Non AC', 'Double', 'Triple']

  // Filter rooms based on active tab
  const filteredRooms = rooms.filter(room => {
    const nameLower = room.name.toLowerCase()
    if (activeTab === 'AC Room') {
      return nameLower.includes('ac') && !nameLower.includes('non ac') && !nameLower.includes('non-ac')
    }
    if (activeTab === 'Non AC') {
      return nameLower.includes('non ac') || nameLower.includes('non-ac')
    }
    if (activeTab === 'Double') {
      return nameLower.includes('double') || nameLower.includes('two') || nameLower.includes('2')
    }
    if (activeTab === 'Triple') {
      return nameLower.includes('triple') || nameLower.includes('three') || nameLower.includes('3')
    }
    return true
  })

  const displayRooms = filteredRooms.length > 0 ? filteredRooms : rooms

  return (
    <div className="w-full">
      {/* ── Section Header (Optional) ── */}
      {title && (
        <div className="text-center mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111827]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* ── Filter Tabs Bar (Refined Aesthetics & Typography) ── */}
      <div className="mb-6 sm:mb-8 bg-[#f9fafb] border border-gray-200/80 rounded-2xl p-1.5 flex items-center justify-between gap-1.5 w-full overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 min-w-[90px] py-2.5 px-4 text-xs sm:text-sm font-medium rounded-xl transition-all cursor-pointer text-center ${
                isActive
                  ? 'bg-white text-[#111827] shadow-2xs border border-gray-200/80'
                  : 'text-gray-500 hover:text-[#111827]'
              }`}
            >
              {tab}
            </button>
          )
        })}
      </div>

      {/* ── Room Cards Stack ── */}
      <div className="flex flex-col gap-4 sm:gap-5">
        {displayRooms.map((room, idx) => (
          <motion.div
            key={room._id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.28, delay: idx * 0.07 }}
          >
            <CompactRoomCard
              roomId={room._id}
              name={room.name}
              description={room.description}
              rent={room.rent}
              coverImage={room.images.find(img => img.isCover)?.url || room.images[0]?.url}
              components={room.components}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}

