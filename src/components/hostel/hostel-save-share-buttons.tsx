'use client'

import { useState } from 'react'
import { Share2, Heart, Check } from 'lucide-react'

interface HostelSaveShareButtonsProps {
  hostelName: string
}

export function HostelSaveShareButtons({ hostelName }: HostelSaveShareButtonsProps) {
  const [isSaved, setIsSaved] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: hostelName,
          url: window.location.href,
        })
      } catch {
        // user cancelled share
      }
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-4 text-sm font-semibold text-[#111827]">
      <button
        onClick={handleShare}
        className="flex items-center gap-1.5 hover:underline transition-all cursor-pointer py-1"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Share2 className="h-4 w-4 text-[#111827]" />}
        <span>{copied ? 'Copied' : 'Share'}</span>
      </button>

      <button
        onClick={() => setIsSaved(!isSaved)}
        className="flex items-center gap-1.5 hover:underline transition-all cursor-pointer py-1"
      >
        <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : 'text-[#111827]'}`} />
        <span>{isSaved ? 'Saved' : 'Save'}</span>
      </button>
    </div>
  )
}
