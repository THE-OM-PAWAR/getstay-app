'use client'

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface AboutSectionProps {
  description: string
}

const PREVIEW_CHARS = 280

export function AboutSection({ description }: AboutSectionProps) {
  const [expanded, setExpanded] = useState(false)

  const needsTruncation = description.length > PREVIEW_CHARS
  const displayed = expanded || !needsTruncation
    ? description
    : description.slice(0, PREVIEW_CHARS).trimEnd()

  return (
    <div className="mt-5">
      <p className="text-base leading-8 text-gray-700">
        {displayed}
        {!expanded && needsTruncation && (
          <span className="text-gray-400">…</span>
        )}
      </p>

      {needsTruncation && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#3932d8]/20 bg-[#f1f3ff] px-4 py-1.5 text-[11px] font-black uppercase tracking-[0.18em] text-[#3932d8] transition-all hover:bg-[#e8eaff] hover:border-[#3932d8]/40"
        >
          {expanded ? (
            <><ChevronUp className="h-3 w-3" />Show less</>
          ) : (
            <><ChevronDown className="h-3 w-3" />Read more</>
          )}
        </button>
      )}
    </div>
  )
}
