'use client'

import { useState } from 'react'

interface HostelDetailsOverviewProps {
  description?: string
  hostName?: string
  minRent?: number | null
  accommodationType?: string
  messAvailable?: boolean
  securityDeposit?: number | string
  address?: string
  city?: string
  state?: string
  pincode?: string
  contactNumber?: string
  email?: string
}

export function HostelDetailsOverview({
  description,
  hostName = 'Deeksha',
  minRent,
  accommodationType = 'boys',
  messAvailable = true,
  securityDeposit = '10,000/-',
  address,
  city,
  state,
  pincode,
  contactNumber,
  email,
}: HostelDetailsOverviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const fullAddress = [address, city, state, pincode].filter(Boolean).join(', ')

  const displayType = accommodationType === 'coed'
    ? 'Co-Ed hostel'
    : accommodationType
      ? `${accommodationType.charAt(0).toUpperCase() + accommodationType.slice(1)} hostel`
      : 'Boys hostel'

  return (
    <section className="bg-white py-6 sm:py-8">
      <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* ── Left Column (Content & Guest Favourite) ── */}
          <div className="lg:col-span-7 space-y-6">

            {/* Guest Favourite Top Banner */}
            <div className="border border-gray-200/90 rounded-2xl p-4 sm:p-5 flex items-center justify-between gap-4 bg-white shadow-2xs">
              <div className="flex items-center gap-3">
                {/* Laurel wreath leaves icon matching Airbnb guest favourite */}
                <div className="flex items-center justify-center text-[#c99026]">
                  <svg className="w-8 h-8" viewBox="0 0 32 32" fill="currentColor">
                    <path d="M16 2.667c-1.333 4-4 6.667-8 8 4 1.333 6.667 4 8 8 1.333-4 4-6.667 8-8-4-1.333-6.667-4-8-8zM7.333 20c-1 3-3 5-6 6 3 1 5 3 6 6 1-3 3-5 6-6-3-1-5-3-6-6zM24.667 20c-1 3-3 5-6 6 3 1 5 3 6 6 1-3 3-5 6-6-3-1-5-3-6-6z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium text-[#111827] text-base sm:text-lg leading-tight">
                    Guest favourite
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 mt-0.5 max-w-xs">
                    One of the most loved homes on Airbnb, according to guests
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-l border-gray-200/90 pl-4 shrink-0">
                <div className="text-center">
                  <span className="text-lg font-medium text-[#111827]">5.0</span>
                  <div className="flex text-black text-[10px] gap-0.5 mt-0.5 justify-center">
                    ★★★★★
                  </div>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div className="text-center">
                  <span className="text-lg font-medium text-[#111827]">21</span>
                  <p className="text-[11px] font-medium text-gray-500 underline">Reviews</p>
                </div>
              </div>
            </div>

            {/* Host Row */}
            <div className="flex items-center gap-3 py-2 border-b border-gray-200/80 pb-6">
              <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gradient-to-tr from-amber-200 to-amber-400 flex items-center justify-center font-medium text-amber-900 text-lg shadow-inner shrink-0">
                {hostName.charAt(0).toUpperCase()}
              </div>
              <div>
                <h4 className="font-medium text-[#111827] text-base">Hosted by {hostName}</h4>
                <p className="text-xs text-gray-500">Superhost · 1 year hosting</p>
              </div>
            </div>

            {/* Description Text */}
            <div className="space-y-4 pt-1">
              <div className={`text-sm text-gray-600 leading-relaxed transition-all ${isExpanded ? '' : 'line-clamp-4'}`}>
                <p>
                  {description || `Jain boys Stay is the best boys hostel in Bhopal, strategically located in MP Nagar. As a premier boys hostel Bhopal, we offer fully air-cooled campus, AC rooms, gym, yoga room, RO water, WiFi, entertainment room, pure veg hygienic food, 24/7 security, CCTV surveillance, lift facility, power backup, and pick & drop facility.`}
                </p>
                {!isExpanded && (
                  <p className="mt-3">
                    Jain boys Stay is the best boys hostel in Bhopal, strategically located in MP Nagar. As a premier boys hostel Bhopal, we offer fully air-cooled campus, AC rooms, gym, yoga room, RO water, WiFi, entertainment room, pure veg hygienic food, 24/7 security, CCTV surveillance, lift facility, power backup, and pick & drop facility
                  </p>
                )}
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 inline-flex items-center justify-center bg-[#d8d8d8] hover:bg-[#cccccc] text-gray-800 text-xs font-medium px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            </div>

            <div className="border-b border-gray-200/80 pt-4" />
          </div>

          {/* ── Right Column (Cards) ── */}
          <div className="lg:col-span-5 space-y-5">

            {/* Card 1: Pricing & Key Info */}
            <div className="border border-gray-200/90 rounded-2xl p-5 sm:p-6 bg-white shadow-xs">
              <span className="text-xs font-medium text-gray-400">Starts From</span>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl sm:text-3xl font-medium text-[#111827]">
                  ₹{minRent ? minRent.toLocaleString('en-IN') : '14,199'}
                </span>
                <span className="text-xs font-medium text-gray-500">/month</span>
              </div>

              <div className="mt-4 space-y-3 text-sm border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Type :</span>
                  <span className="font-medium text-gray-800">{displayType}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Food :</span>
                  <span className="font-medium text-gray-800">{messAvailable ? 'Available' : 'Not Available'}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-gray-600 font-medium">Security deposit :</span>
                  <span className="font-medium text-gray-800">
                    {typeof securityDeposit === 'number' ? `${securityDeposit.toLocaleString('en-IN')}/-` : securityDeposit}
                  </span>
                </div>
              </div>

              <a
                href="#rooms"
                className="mt-5 block w-full text-center py-2.5 px-4 rounded-xl border border-[#3932d8] text-[#3932d8] hover:bg-[#3932d8] hover:text-white font-semibold text-sm transition-all"
              >
                View Rooms
              </a>
            </div>

            {/* Card 2: Contact Info */}
            <div className="border border-gray-200/90 rounded-2xl p-5 sm:p-6 bg-white shadow-xs">
              <h3 className="text-xl font-medium text-[#111827] mb-4">Contact</h3>

              <div className="space-y-4 text-xs sm:text-sm">
                {/* Address */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Address</h4>
                  <p className="text-gray-500 leading-relaxed">
                    {fullAddress || 'R-62, above BAITHAK Girls Library, GRP Colony, Zone-II, Maharana Pratap Nagar, Bhopal, Madhya Pradesh 462016'}
                  </p>
                </div>

                <div className="border-b border-gray-100" />

                {/* Contact */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Contact</h4>
                  <p className="text-gray-500">
                    {contactNumber || '+91 12345667890, +91 8765433257'}
                  </p>
                </div>

                <div className="border-b border-gray-100" />

                {/* Email ID */}
                <div>
                  <h4 className="font-medium text-gray-700 mb-1">Email ID</h4>
                  <p className="text-gray-500 break-all">
                    {email || 'getstayhostel@gmail.com'}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  )
}
