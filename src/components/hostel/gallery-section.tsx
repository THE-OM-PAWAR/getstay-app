'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Images } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

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

export function GallerySection({ photos }: GallerySectionProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0, 1, 2, 3, 4]))

  if (!photos || photos.length === 0) {
    return null
  }

  // Show only first 5 images in preview
  const previewPhotos = photos.slice(0, 5)
  const hasMorePhotos = photos.length > 5

  const openLightbox = (index: number) => {
    setSelectedImage(index)
    // Preload adjacent images
    loadAdjacentImages(index)
  }

  const closeLightbox = () => {
    setSelectedImage(null)
  }

  const goToPrevious = useCallback(() => {
    if (selectedImage !== null) {
      const newIndex = selectedImage === 0 ? photos.length - 1 : selectedImage - 1
      setSelectedImage(newIndex)
      loadAdjacentImages(newIndex)
    }
  }, [selectedImage, photos.length])

  const goToNext = useCallback(() => {
    if (selectedImage !== null) {
      const newIndex = selectedImage === photos.length - 1 ? 0 : selectedImage + 1
      setSelectedImage(newIndex)
      loadAdjacentImages(newIndex)
    }
  }, [selectedImage, photos.length])

  // Lazy load adjacent images
  const loadAdjacentImages = (index: number) => {
    const toLoad = new Set(loadedImages)
    // Load current, previous, and next images
    toLoad.add(index)
    toLoad.add(index === 0 ? photos.length - 1 : index - 1)
    toLoad.add(index === photos.length - 1 ? 0 : index + 1)
    setLoadedImages(toLoad)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedImage === null) return
      
      if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      } else if (e.key === 'Escape') {
        closeLightbox()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedImage, goToPrevious, goToNext])

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      boys: 'Boys',
      girls: 'Girls',
      common: 'Common Area',
      exterior: 'Exterior',
      interior: 'Interior',
      amenities: 'Amenities',
    }
    return labels[type] || type
  }

  return (
    <>
      <section className="overflow-hidden rounded-2xl border border-border bg-card">
        <div className="p-6 sm:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <h2 className="mb-2 flex items-center gap-2 text-2xl font-bold sm:text-3xl">
              <Images className="h-6 w-6 text-brand-primary" />
              Photo <span className="text-brand-primary">Gallery</span>
            </h2>
            <p className="text-sm text-muted-foreground sm:text-base">
              {photos.length} {photos.length === 1 ? 'photo' : 'photos'} • Click to view all
            </p>
          </motion.div>

          {/* Grid Layout - 2 rows with 4-5 images */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {previewPhotos.map((photo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ scale: 1.03 }}
                className={`group relative cursor-pointer overflow-hidden rounded-xl shadow-md transition-shadow hover:shadow-xl ${
                  idx === 0 ? 'col-span-2 row-span-2 aspect-square md:col-span-2 md:row-span-2' : 'aspect-square'
                }`}
                onClick={() => openLightbox(idx)}
              >
                <Image
                  src={photo.url}
                  alt={photo.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes={idx === 0 ? "(max-width: 768px) 50vw, 33vw" : "(max-width: 768px) 25vw, 16vw"}
                />
                <div className="absolute inset-0 bg-linear-to-t from-brand-dark/80 via-brand-dark/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:from-brand-primary-light/80 dark:via-brand-primary-light/30">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <Badge variant="secondary" className="mb-1 bg-brand-primary text-brand-white dark:bg-brand-white dark:text-brand-dark text-xs">
                      {getTypeLabel(photo.type)}
                    </Badge>
                    <p className="text-xs font-medium text-brand-white dark:text-brand-dark line-clamp-1">{photo.title}</p>
                  </div>
                </div>
                
                {/* Show "View All" overlay on last image if there are more photos */}
                {idx === previewPhotos.length - 1 && hasMorePhotos && (
                  <div className="absolute inset-0 flex items-center justify-center bg-brand-dark/70 dark:bg-brand-primary-light/70">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-brand-white dark:text-brand-dark">+{photos.length - 5}</p>
                      <p className="text-sm text-brand-white dark:text-brand-dark">More Photos</p>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-brand-white/95 dark:bg-brand-dark/95 p-4 backdrop-blur-sm sm:p-6 lg:p-8"
            onClick={closeLightbox}
          >
            <div className="relative mx-auto w-full max-w-6xl flex h-[90%]">
              {/* Close Button */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="absolute -right-2 -top-2 z-10 sm:right-0 sm:top-0"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full bg-brand-primary text-brand-white shadow-lg hover:bg-brand-primary/90 dark:bg-brand-primary-light dark:text-brand-dark dark:hover:bg-brand-primary-light/90"
                  onClick={closeLightbox}
                >
                  <X className="h-5 w-5" />
                </Button>
              </motion.div>

              {/* Navigation Buttons */}
              {photos.length > 1 && (
                <>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="absolute -left-2 top-1/2 z-10 -translate-y-1/2 sm:-left-16"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-brand-primary text-brand-white shadow-lg hover:bg-brand-primary/90 dark:bg-brand-primary-light dark:text-brand-dark dark:hover:bg-brand-primary-light/90 sm:h-12 sm:w-12"
                      onClick={(e) => {
                        e.stopPropagation()
                        goToPrevious()
                      }}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="absolute -right-2 top-1/2 z-10 -translate-y-1/2 sm:-right-16"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-full bg-brand-primary text-brand-white shadow-lg hover:bg-brand-primary/90 dark:bg-brand-primary-light dark:text-brand-dark dark:hover:bg-brand-primary-light/90 sm:h-12 sm:w-12"
                      onClick={(e) => {
                        e.stopPropagation()
                        goToNext()
                      }}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </motion.div>
                </>
              )}

              {/* Image Container */}
              <motion.div
                key={selectedImage}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative flex flex-col mb-20 items-end justify-end"
                onClick={(e: React.MouseEvent<HTMLDivElement>) => e.stopPropagation()}
              >
                {/* Image - Lazy loaded */}
                <div className="relative w-full overflow-hidden rounded-xl bg-brand-light dark:bg-brand-dark p-1 shadow-2xl flex border border-border">
                  <div className="relative w-full aspect-3/5">
                    {loadedImages.has(selectedImage) ? (
                      <Image
                        src={photos[selectedImage].url}
                        alt={photos[selectedImage].title}
                        fill
                        className="object-contain"
                        priority={selectedImage < 5}
                        onLoad={() => {
                          // Mark image as loaded
                          setLoadedImages(prev => new Set(prev).add(selectedImage))
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-muted">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-primary border-t-transparent" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Image Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-4 w-full rounded-xl bg-card border border-border p-4 shadow-lg backdrop-blur-sm sm:mt-6 sm:p-6"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground sm:text-xl">
                        {photos[selectedImage].title}
                      </h3>
                      {photos[selectedImage].description && (
                        <p className="mt-1 text-sm text-muted-foreground sm:text-base">
                          {photos[selectedImage].description}
                        </p>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Badge variant="secondary" className="whitespace-nowrap bg-brand-primary text-brand-white dark:bg-brand-primary-light dark:text-brand-dark">
                        {getTypeLabel(photos[selectedImage].type)}
                      </Badge>
                      <span className="text-sm font-medium text-muted-foreground">
                        {selectedImage + 1} / {photos.length}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
