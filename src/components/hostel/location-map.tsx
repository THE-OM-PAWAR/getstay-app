'use client'

import { MapPin, ExternalLink, Navigation } from 'lucide-react'

interface LocationMapProps {
  name: string
  address?: string
  city?: string
  state?: string
  pincode?: string
  landmark?: string
  latitude?: number
  longitude?: number
  googleMapLink?: string
}

export function LocationMap({
  name,
  address,
  city,
  state,
  pincode,
  landmark,
  latitude,
  longitude,
  googleMapLink,
}: LocationMapProps) {
  const fullAddress = [address, landmark ? `Near ${landmark}` : null, city, state, pincode]
    .filter(Boolean)
    .join(', ')

  // Construct iframe embed query
  const query = latitude && longitude
    ? `${latitude},${longitude}`
    : encodeURIComponent(`${name} ${address || ''} ${city || ''} ${state || ''}`)

  const embedUrl = `https://maps.google.com/maps?q=${query}&t=&z=15&ie=UTF8&iwloc=&output=embed`

  const mapsExternalUrl = googleMapLink || `https://www.google.com/maps/search/?api=1&query=${query}`

  return (
    <div className="w-full">
      {/* ── Section Header ── */}
      <div className="text-center mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111827]">
          Where you'll be
        </h2>
        {fullAddress && (
          <p className="mt-2 text-xs sm:text-sm text-gray-500 max-w-xl mx-auto leading-relaxed flex items-center justify-center gap-1.5">
            <MapPin className="h-4 w-4 text-[#3932d8] shrink-0" />
            <span>{fullAddress}</span>
          </p>
        )}
      </div>

      {/* ── Interactive Live Map Container ── */}
      <div className="relative w-full max-w-5xl mx-auto rounded-2xl sm:rounded-3xl overflow-hidden border border-gray-200/80 bg-[#f9fafb] shadow-2xs">
        {/* Map iframe */}
        <div className="relative h-[340px] sm:h-[400px] md:h-[450px] w-full">
          <iframe
            title={`Live Location Map for ${name}`}
            src={embedUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={false}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-full grayscale-[0.1] contrast-[1.02]"
          />
        </div>

        {/* Floating Controls / Map Overlay Info */}
        <div className="absolute bottom-4 right-4 z-10">
          <a
            href={mapsExternalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-white/95 px-4 py-2.5 text-xs sm:text-sm font-medium text-[#111827] border border-gray-200 shadow-md backdrop-blur-md hover:bg-white hover:border-gray-400 transition-all active:scale-[0.99] cursor-pointer"
          >
            <Navigation className="h-4 w-4 text-[#3932d8]" />
            <span>Get Directions</span>
            <ExternalLink className="h-3.5 w-3.5 text-gray-400" />
          </a>
        </div>
      </div>
    </div>
  )
}
