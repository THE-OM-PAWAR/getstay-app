'use client'

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
}

export function RoomsSection({ rooms }: RoomsSectionProps) {
  if (!rooms || rooms.length === 0) return null

  return (
    /* Single-column stack — each card is full-width horizontal */
    <div className="flex flex-col gap-3">
      {rooms.map((room, idx) => (
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
  )
}
