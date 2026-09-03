'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ZoomIn, LayoutGrid } from 'lucide-react'

interface HostelPhoto {
  url: string
  title: string
  description?: string
  type: 'boys' | 'girls' | 'common' | 'exterior' | 'interior' | 'amenities'
  isMain?: boolean
}

interface GallerySectionProps {
  photos: HostelPhoto[]
}

const TYPE_LABELS: Record<string, string> = {
  boys: 'Boys',
  girls: 'Girls',
  common: 'Common Area',
  exterior: 'Exterior',
  interior: 'Interior',
  amenities: 'Amenities',
}

// Subtle per-type tint for filter pills
const TYPE_PILL = 'border border-[#111827]/10 bg-white text-gray-600 hover:border-[#3932d8]/20 hover:text-[#3932d8]'
const TYPE_PILL_ACTIVE = 'bg-[#3932d8] text-white shadow-md shadow-[#3932d8]/25 border-transparent'

const BATCH = 12 // photos shown per "load more" click

export function GallerySection({ photos }: GallerySectionProps) {
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [visible, setVisible] = useState(BATCH)

  if (!photos || photos.length === 0) return null

  // Always show main photo first
  const sorted = [...photos.filter(p => p.isMain), ...photos.filter(p => !p.isMain)]

  const open = (idx: number) => setLightboxIdx(idx)
  const close = () => setLightboxIdx(null)

  const prev = useCallback(() => {
    if (lightboxIdx === null) return
    setLightboxIdx(lightboxIdx === 0 ? sorted.length - 1 : lightboxIdx - 1)
  }, [lightboxIdx, sorted.length])

  const next = useCallback(() => {
    if (lightboxIdx === null) return
    setLightboxIdx(lightboxIdx === sorted.length - 1 ? 0 : lightboxIdx + 1)
  }, [lightboxIdx, sorted.length])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIdx, prev, next])

  // Map 4 images for the layout matching Image 1
  const img1 = sorted[0] || photos[0]
  const img2 = sorted[1] || sorted[0] || photos[0]
  const img3 = sorted[2] || sorted[0] || photos[0]
  const img4 = sorted[3] || sorted[0] || photos[0]

  return (
    <>
      {/* ── Main Gallery Layout matching Reference Image 1 ── */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6 items-stretch">

          {/* Left Column: Tall image card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="relative h-[340px] md:h-[460px] rounded-[28px] md:rounded-[32px] overflow-hidden bg-gray-100 border border-gray-200/80 shadow-xs cursor-pointer group"
            onClick={() => open(0)}
          >
            {img1?.url && (
              <Image
                src={img1.url}
                alt={img1.title || 'Hostel image'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

          {/* Middle Area: 2 Columns wide */}
          <div className="md:col-span-2 flex flex-col justify-between gap-6">

            {/* Top row: 2 cards side by side */}
            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="relative h-[160px] md:h-[230px] rounded-[24px] md:rounded-[28px] overflow-hidden bg-gray-100 border border-gray-200/80 shadow-xs cursor-pointer group"
                onClick={() => open(1 % sorted.length)}
              >
                {img2?.url && (
                  <Image
                    src={img2.url}
                    alt={img2.title || 'Hostel image'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="relative h-[160px] md:h-[230px] rounded-[24px] md:rounded-[28px] overflow-hidden bg-gray-100 border border-gray-200/80 shadow-xs cursor-pointer group"
                onClick={() => open(2 % sorted.length)}
              >
                {img3?.url && (
                  <Image
                    src={img3.url}
                    alt={img3.title || 'Hostel image'}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                )}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            </div>

            {/* Bottom row: Gallery Title, Subtitle, and View All button */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="flex flex-col items-center justify-center text-center px-4 py-2"
            >
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#111827]">
                Gallery
              </h2>
              <p className="mt-3 text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
                Discover premium, safe, and vibrant accommodations tailored for students and young professionals.
              </p>
              <button
                onClick={() => open(0)}
                className="mt-5 inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-7 py-2 text-xs sm:text-sm font-medium text-gray-800 shadow-2xs hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
              >
                View all
              </button>
            </motion.div>

          </div>

          {/* Right Column: Tall image card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="relative h-[340px] md:h-[460px] rounded-[28px] md:rounded-[32px] overflow-hidden bg-gray-100 border border-gray-200/80 shadow-xs cursor-pointer group"
            onClick={() => open(3 % sorted.length)}
          >
            {img4?.url && (
              <Image
                src={img4.url}
                alt={img4.title || 'Hostel image'}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, 25vw"
              />
            )}
            <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </motion.div>

        </div>
      </div>

      {/* ══════════════════════════════════════════
          LIGHTBOX
      ══════════════════════════════════════════ */}
      <AnimatePresence>
        {lightboxIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-[9999] flex flex-col bg-[#080808]"
            onClick={close}
          >
            {/* ── Top bar ── */}
            <div
              className="flex h-13 shrink-0 items-center justify-between border-b border-white/[0.07] px-5 sm:px-8"
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 min-w-0">
                <span className="rounded-full bg-[#3932d8]/80 px-3 py-0.5 text-[10px] font-black uppercase tracking-[0.18em] text-white">
                  {TYPE_LABELS[sorted[lightboxIdx]?.type] || sorted[lightboxIdx]?.type}
                </span>
                <p className="hidden sm:block text-sm font-semibold text-white/70 truncate">
                  {sorted[lightboxIdx]?.title}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <span className="text-[11px] font-bold tabular-nums text-white/30">
                  {lightboxIdx + 1} / {sorted.length}
                </span>
                <button
                  onClick={close}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/[0.08] text-white hover:bg-white/[0.18] transition-colors"
                  aria-label="Close"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* ── Main image ── */}
            <div className="relative flex flex-1 items-center justify-center overflow-hidden">
              {/* prev / next */}
              {sorted.length > 1 && (
                <>
                  <button
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); prev() }}
                    className="absolute left-3 sm:left-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-white backdrop-blur-sm transition-all hover:bg-white/[0.18] hover:scale-105"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={(e: React.MouseEvent) => { e.stopPropagation(); next() }}
                    className="absolute right-3 sm:right-6 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/[0.08] text-white backdrop-blur-sm transition-all hover:bg-white/[0.18] hover:scale-105"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={lightboxIdx}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.16 }}
                  className="relative h-full w-full max-h-[calc(100vh-168px)] px-16"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                >
                  <Image
                    src={sorted[lightboxIdx]?.url}
                    alt={sorted[lightboxIdx]?.title || 'Hostel image'}
                    fill
                    className="object-contain"
                    priority
                    sizes="100vw"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* ── Caption ── */}
            {sorted[lightboxIdx]?.description && (
              <div
                className="shrink-0 border-t border-white/[0.06] px-5 py-2 text-center"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <p className="text-xs text-white/40">{sorted[lightboxIdx].description}</p>
              </div>
            )}

            {/* ── Filmstrip ── */}
            {sorted.length > 1 && (
              <div
                className="shrink-0 border-t border-white/[0.06] px-4 py-2.5"
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
              >
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide justify-center">
                  {sorted.map((photo, idx) => (
                    <button
                      key={idx}
                      onClick={() => setLightboxIdx(idx)}
                      className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg transition-all duration-200 ${
                        idx === lightboxIdx
                          ? 'ring-2 ring-[#3932d8] ring-offset-1 ring-offset-[#080808] opacity-100 scale-[1.06]'
                          : 'opacity-30 hover:opacity-60'
                      }`}
                    >
                      <Image src={photo.url} alt={photo.title} fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
