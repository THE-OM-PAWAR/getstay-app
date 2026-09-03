import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Phone, Mail, IndianRupee, Building2,
  ChevronRight, ArrowRight, CheckCircle2, Sparkles, Images,
  Wifi, Droplet, Zap, BedDouble,
  UtensilsCrossed, HeartPulse, Headphones, Wind,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RoomActionButtons } from "@/components/room/room-action-buttons";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ExploreLinks } from "@/components/shared/explore-links";
import { RoomComponentsGrid } from "@/components/room/room-components-grid";
import { AmenitiesGrid } from "@/components/hostel/amenities-grid";
import { getRoomById, getAllRoomIds } from "@/services/room-detail.service";

interface RoomPageProps {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  const roomIds = await getAllRoomIds();
  return roomIds.map((id) => ({ id }));
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoomById(id);
  if (!room) return { title: "Room Not Found" };

  const coverImage = room.images.find(img => img.isCover)?.url || room.images[0]?.url;
  const location = room.hostel.city && room.hostel.state
    ? `${room.hostel.city}, ${room.hostel.state}`
    : room.hostel.city || room.hostel.state || '';

  const title = `${room.name} at ${room.hostel.name} — ₹${room.rent.toLocaleString('en-IN')}/month | GetStay`;
  const description = `${room.description.slice(0, 150)}... View this room at ${room.hostel.name} in ${location}. Monthly rent: ₹${room.rent.toLocaleString('en-IN')}.`;

  return {
    title, description,
    keywords: [room.name, room.hostel.name, `room in ${room.hostel.city}`, 'hostel room', 'pg room', ...room.components.slice(0, 5).map(c => c.name.toLowerCase())].filter(Boolean).join(', '),
    openGraph: { title, description, type: 'website', url: `https://getstay.in/room/${id}`, siteName: 'GetStay', locale: 'en_IN', images: coverImage ? [{ url: coverImage, width: 1200, height: 630, alt: `${room.name} at ${room.hostel.name}` }] : [] },
    twitter: { card: 'summary_large_image', title, description, images: coverImage ? [coverImage] : [] },
    alternates: { canonical: `https://getstay.in/room/${id}` },
    robots: { index: true, follow: true },
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;
  const room = await getRoomById(id);
  if (!room) notFound();

  const coverImage = room.images.find(img => img.isCover);
  const galleryImages = room.images.filter(img => !img.isCover);
  const location = room.hostel.city && room.hostel.state
    ? `${room.hostel.city}, ${room.hostel.state}`
    : room.hostel.city || room.hostel.state || '';

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: room.name,
    description: room.description,
    image: room.images.map(img => img.url),
    offers: {
      '@type': 'Offer',
      price: room.rent,
      priceCurrency: 'INR',
      availability: 'https://schema.org/InStock',
      priceValidUntil: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    },
    brand: {
      '@type': 'Organization',
      name: room.hostel.name,
    },
  };

  const breadcrumbData = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://getstay.in' },
      { '@type': 'ListItem', position: 2, name: room.hostel.name, item: `https://getstay.in/hostel/${room.hostel.slug}` },
      { '@type': 'ListItem', position: 3, name: room.name, item: `https://getstay.in/room/${id}` },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fffffd] selection:bg-[#3932d8] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      <Header pageTitle={room.name} showBackButton={true} />

      <main className="overflow-hidden">

        {/* ══════════════════════════════════════
            § 1  HERO  — Room Details (Clean & Professional)
        ══════════════════════════════════════ */}
        <section className="bg-[#f8f9fa] border-b border-gray-200/80 py-8 sm:py-12">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">

            {/* Breadcrumb row */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
              <nav className="flex items-center gap-1.5 text-xs text-gray-500" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-[#3932d8] transition-colors">Home</Link>
                <ChevronRight className="h-3 w-3 text-gray-400" />
                <Link href={`/hostel/${room.hostel.slug}`} className="hover:text-[#3932d8] transition-colors truncate max-w-[140px] sm:max-w-[220px]">
                  {room.hostel.name}
                </Link>
                <ChevronRight className="h-3 w-3 text-gray-400" />
                <span className="font-bold text-[#111827] truncate max-w-[140px] sm:max-w-[200px]">{room.name}</span>
              </nav>

              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#f1f3ff] border border-[#3932d8]/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#3932d8]">
                <Sparkles className="h-3 w-3" />GetStay Verified
              </span>
            </div>

            {/* Hero Main Grid */}
            <div className="grid items-center gap-8 lg:grid-cols-12">

              {/* Left Column — Title, Trust Tags, Action & Rent */}
              <div className="lg:col-span-7 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/hostel/${room.hostel.slug}`}
                    className="inline-flex items-center gap-1.5 mb-2.5 text-xs font-bold text-[#3932d8] hover:underline"
                  >
                    <Building2 className="h-4 w-4 shrink-0" strokeWidth={1.8} />
                    {room.hostel.name}
                    {location && <span className="text-gray-400 font-normal ml-1">· {location}</span>}
                  </Link>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-[-0.03em] text-[#111827] leading-tight">
                    {room.name}
                  </h1>

                  {/* Trust row */}
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {['Zero Brokerage', 'Verified Room', 'Instant Enquiry'].map(label => (
                      <span key={label} className="inline-flex items-center gap-1.5 rounded-full bg-white border border-gray-200 px-3 py-1 text-[11px] font-bold text-gray-700 shadow-2xs">
                        <CheckCircle2 className="h-3.5 w-3.5 text-[#3932d8] shrink-0" strokeWidth={2} />
                        {label}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Price & Actions Row */}
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  {/* Rent Card */}
                  <div className="rounded-2xl border border-[#3932d8]/20 bg-white p-4 sm:p-5 shadow-xs">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#3932d8]">Monthly Rent</p>
                    <div className="flex items-baseline gap-0.5 mt-1">
                      <IndianRupee className="h-5 w-5 text-[#111827] mt-0.5 shrink-0" strokeWidth={2.2} />
                      <span className="text-3xl sm:text-4xl font-black text-[#111827] leading-none tracking-tight">
                        {room.rent.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-gray-500 font-normal ml-1">/mo</span>
                    </div>
                    <p className="mt-1 text-[10px] text-gray-400 font-medium">all inclusive · zero deposit</p>
                  </div>

                  {/* Action buttons */}
                  <div className="flex-1 min-w-[220px]">
                    <RoomActionButtons
                      roomName={room.name}
                      hostelName={room.hostel.name}
                      hostelSlug={room.hostel.slug}
                      contactNumber={room.hostel.contactNumber}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column — Featured Cover Photo Card */}
              <div className="lg:col-span-5">
                <div className="relative overflow-hidden rounded-[24px] border border-gray-200 bg-white shadow-md group">
                  {coverImage ? (
                    <Image
                      src={coverImage.url}
                      alt={coverImage.title || room.name}
                      width={700}
                      height={480}
                      priority
                      className="h-64 sm:h-80 md:h-96 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex h-64 sm:h-80 md:h-96 w-full items-center justify-center bg-[#f1f3ff]">
                      <BedDouble className="h-16 w-16 text-[#3932d8]/20" strokeWidth={1.2} />
                    </div>
                  )}

                  {/* photo count chip */}
                  {room.images.length > 1 && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-xs font-bold text-white shadow-md">
                      <Images className="h-3.5 w-3.5" strokeWidth={1.8} />
                      {room.images.length} photos
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            § 2  ABOUT THIS ROOM  (Short & Bullet Points)
        ══════════════════════════════════════ */}
        <section className="bg-white py-10 md:py-14">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="grid items-start gap-8 lg:grid-cols-12">

              {/* Left Column — Description */}
              <div className="lg:col-span-7">
                <span className="inline-block text-[11px] font-black uppercase tracking-[0.24em] text-[#3932d8] mb-2">
                  Overview
                </span>
                <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-[#111827]">
                  About This Room
                </h2>
                
                {/* Short concise description */}
                <p className="mt-3 text-xs sm:text-sm leading-relaxed text-gray-600">
                  {room.description}
                </p>
              </div>

              {/* Right Column — Compact Hostel Chip & Key Metrics */}
              <div className="lg:col-span-5 space-y-4">
                <div className="rounded-2xl border border-gray-200/80 bg-[#f8f9fa] p-5 shadow-2xs">
                  <div className="flex items-center gap-3">
                    {room.hostel.banner?.url ? (
                      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-gray-200">
                        <Image src={room.hostel.banner.url} alt={room.hostel.name} width={48} height={48} className="h-full w-full object-cover" />
                      </div>
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#3932d8]/10 text-[#3932d8]">
                        <Building2 className="h-6 w-6" strokeWidth={1.8} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#3932d8]">Part of</p>
                      <p className="text-sm font-black text-[#111827] truncate">{room.hostel.name}</p>
                      {location && <p className="text-xs text-gray-500 truncate">{location}</p>}
                    </div>
                  </div>
                  <Link
                    href={`/hostel/${room.hostel.slug}`}
                    className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-[#3932d8] px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-[#2e28b8] transition-all"
                  >
                    View Hostel Page <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            § 3  ROOM COMPONENTS  (Enhanced Responsive)
        ══════════════════════════════════════ */}
        {room.components.length > 0 && (
          <section className="bg-white py-12 md:py-16 lg:py-20 border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
              <RoomComponentsGrid components={room.components} />
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════
            § 4  AMENITIES  (Enhanced Responsive)
        ══════════════════════════════════════ */}
        <section className="bg-white py-12 md:py-16 lg:py-20 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <AmenitiesGrid
              amenities={room.hostel.amenities ? room.hostel.amenities.map(a => ({ name: a.name, description: a.description, available: a.available })) : []}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════
            § 5  CONTACT  (Enhanced Responsive)
        ══════════════════════════════════════ */}
        <section className="bg-[#f4f4f4] py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10 text-center">
              <span className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.24em] text-[#3932d8] mb-2 sm:mb-3">
                Get in touch
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.04em] text-[#111827]">
                Contact & Book
              </h2>
            </div>

            <div className="grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-3">
              {/* contact card */}
              <div
                data-section="contact"
                className="group rounded-[20px] sm:rounded-[24px] border border-[#111827]/10 bg-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(17,24,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(57,50,216,0.10)]"
              >
                <div className="mb-4 sm:mb-5 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-black text-[#111827]">Contact</h3>
                  <div className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-[#3932d8]/10">
                    <Phone className="h-4 w-4 text-[#3932d8]" strokeWidth={1.7} />
                  </div>
                </div>
                <div className="space-y-2.5 sm:space-y-3.5">
                  <div>
                    <p className="text-xs sm:text-sm font-black text-[#111827]">{room.hostel.name}</p>
                    {room.hostel.address && (
                      <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5">{room.hostel.address}</p>
                    )}
                    {location && (
                      <div className="mt-1 flex items-center gap-1 text-[9px] sm:text-xs text-gray-500">
                        <MapPin className="h-3 w-3 text-[#3932d8]" strokeWidth={1.7} />
                        {location}
                      </div>
                    )}
                  </div>
                  {room.hostel.contactNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-3.5 w-3.5 text-[#3932d8] shrink-0" strokeWidth={1.7} />
                      <a href={`tel:${room.hostel.contactNumber}`}
                        className="text-xs sm:text-sm font-bold text-[#111827] hover:text-[#3932d8] transition-colors">
                        {room.hostel.contactNumber}
                      </a>
                    </div>
                  )}
                  {room.hostel.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-[#3932d8] shrink-0" strokeWidth={1.7} />
                      <a href={`mailto:${room.hostel.email}`}
                        className="text-[9px] sm:text-xs text-gray-600 hover:text-[#3932d8] transition-colors truncate">
                        {room.hostel.email}
                      </a>
                    </div>
                  )}
                </div>
                {room.hostel.contactNumber && (
                  <a href={`tel:${room.hostel.contactNumber}`}
                    className="mt-4 sm:mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#3932d8] px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#3932d8]/20 transition-all hover:-translate-y-0.5 hover:bg-[#2e28b8]">
                    <Phone className="h-4 w-4" strokeWidth={1.8} />Call Now
                  </a>
                )}
              </div>

              {/* rent summary card */}
              <div className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] border border-[#3932d8]/20 bg-white shadow-[0_20px_50px_rgba(57,50,216,0.08)]">
                <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-[#3932d8] via-[#6c63ff] to-[#0ea5e9]" />
                <div className="p-5 sm:p-6">
                  <div className="mb-4 sm:mb-5 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-black text-[#111827]">Pricing</h3>
                    <div className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-[#3932d8]/10">
                      <IndianRupee className="h-4 w-4 text-[#3932d8]" strokeWidth={1.7} />
                    </div>
                  </div>
                  <div className="flex items-baseline gap-1 mb-1">
                    <IndianRupee className="h-4 sm:h-5 w-4 sm:w-5 text-[#3932d8] mt-0.5" strokeWidth={2} />
                    <span className="text-3xl sm:text-4xl font-black text-[#3932d8] leading-none">
                      {room.rent.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-400 ml-1">/month</span>
                  </div>
                  <p className="text-[9px] sm:text-xs text-gray-500 mb-4 sm:mb-6">All inclusive · Zero brokerage</p>
                  <div className="space-y-1.5 sm:space-y-2 text-[9px] sm:text-xs font-bold text-gray-600">
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#3932d8] shrink-0" />No hidden charges</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#3932d8] shrink-0" />Verified by GetStay</div>
                    <div className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5 text-[#3932d8] shrink-0" />Instant enquiry</div>
                  </div>
                </div>
              </div>

              {/* hostel card */}
              <div className="rounded-[20px] sm:rounded-[24px] border border-[#111827]/10 bg-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(17,24,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(57,50,216,0.10)]">
                <div className="mb-4 sm:mb-5 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-black text-[#111827]">Property</h3>
                  <div className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-[#3932d8]/10">
                    <Building2 className="h-4 w-4 text-[#3932d8]" strokeWidth={1.7} />
                  </div>
                </div>
                {room.hostel.banner?.url && (
                  <div className="mb-3 sm:mb-4 overflow-hidden rounded-lg sm:rounded-2xl">
                    <Image src={room.hostel.banner.url} alt={room.hostel.name} width={400} height={160}
                      className="h-24 sm:h-32 w-full object-cover hover:scale-105 transition-transform duration-500" />
                  </div>
                )}
                <p className="text-xs sm:text-sm font-black text-[#111827] mb-1">{room.hostel.name}</p>
                {location && <p className="text-[9px] sm:text-xs text-gray-500 mb-3 sm:mb-4">{location}</p>}
                <Link href={`/hostel/${room.hostel.slug}`}
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-[#111827]/15 bg-white px-4 py-2 sm:py-3 text-xs sm:text-sm font-bold text-[#111827] transition-all hover:border-[#3932d8]/30 hover:text-[#3932d8] hover:shadow-md">
                  View Full Hostel <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            § 6  SIMILAR ROOMS  (Enhanced Responsive)
        ══════════════════════════════════════ */}
        {room.similarRooms && room.similarRooms.length > 0 && (
          <section className="bg-white py-12 md:py-16 lg:py-20">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
              <div className="mb-8 sm:mb-10 text-center">
                <span className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.24em] text-[#3932d8] mb-2 sm:mb-3">
                  Explore more
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.04em] text-[#111827]">
                  Similar Rooms
                </h2>
              </div>
              <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {room.similarRooms.map((r) => (
                  <Link key={r._id} href={`/room/${r._id}`} className="group block">
                    <div className="overflow-hidden rounded-[20px] sm:rounded-[24px] border border-[#111827]/10 bg-white shadow-[0_10px_30px_rgba(17,24,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(57,50,216,0.12)] hover:border-[#3932d8]/20">
                      <div className="relative h-40 sm:h-44 overflow-hidden bg-[#f4f4f4]">
                        {r.coverImage ? (
                          <Image src={r.coverImage} alt={r.name} fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                            sizes="(max-width: 768px) 50vw, 25vw" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Building2 className="h-12 w-12 text-[#3932d8]/15" strokeWidth={1.2} />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                        <div className="absolute bottom-3 left-3 flex items-baseline gap-0.5 rounded-full bg-[#3932d8] px-2.5 sm:px-3 py-0.5 sm:py-1">
                          <IndianRupee className="h-2.5 w-2.5 text-white mt-0.5" strokeWidth={2} />
                          <span className="text-[9px] sm:text-xs font-black text-white">{r.rent.toLocaleString('en-IN')}</span>
                          <span className="text-[8px] sm:text-[10px] text-white/70 ml-0.5">/mo</span>
                        </div>
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-xs sm:text-sm font-black text-[#111827] tracking-tight line-clamp-1">{r.name}</h3>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════
            § 7  OTHER HOSTELS  — #f4f4f4
        ══════════════════════════════════════ */}
        {room.otherHostels && room.otherHostels.length > 0 && (
          <section className="bg-[#f4f4f4] py-16 md:py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <span className="inline-block text-[11px] font-black uppercase tracking-[0.24em] text-[#3932d8] mb-3">
                  Nearby options
                </span>
                <h2 className="text-3xl font-black tracking-[-0.04em] text-[#111827] sm:text-4xl">
                  Other Hostels in {room.hostel.city}
                </h2>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {room.otherHostels.map((h) => (
                  <Link key={h._id} href={`/hostel/${h.slug}`} className="group block">
                    <div className="overflow-hidden rounded-[24px] border border-[#111827]/10 bg-white shadow-[0_10px_30px_rgba(17,24,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(57,50,216,0.12)] hover:border-[#3932d8]/20">
                      <div className="relative h-44 overflow-hidden bg-[#f4f4f4]">
                        {h.coverImage ? (
                          <Image src={h.coverImage} alt={h.name} fill
                            className="object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                            sizes="(max-width: 768px) 50vw, 25vw" />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <Building2 className="h-12 w-12 text-[#3932d8]/15" strokeWidth={1.2} />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-black text-[#111827] tracking-tight line-clamp-1 mb-1">{h.name}</h3>
                        <p className="text-xs text-gray-500">{h.city}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════
            § 8  CTA  — #f7f6f3
        ══════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#f7f6f3] py-20 md:py-28 px-4">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#3932d8]/6 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative mx-auto max-w-5xl z-10">
            <div className="relative overflow-hidden rounded-[32px] border border-[#111827]/10 bg-white p-8 sm:p-12 lg:p-16 shadow-[0_30px_90px_rgba(17,24,39,0.08)]">
              <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-[#3932d8] via-[#6c63ff] to-[#0ea5e9]" />
              <div className="grid items-center gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7 space-y-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#3932d8]/15 bg-[#f1f3ff] px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#3932d8]">
                    <Sparkles className="h-3 w-3" />Interested in this room?
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-black tracking-[-0.04em] text-[#111827] leading-tight">
                    Ready to make this your home?
                  </h2>
                  <div className="flex flex-wrap gap-5 text-xs font-bold text-gray-600">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#3932d8]" />Zero Brokerage</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#3932d8]" />Verified Room</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#3932d8]" />Instant Enquiry</span>
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
                  {room.hostel.contactNumber && (
                    <a href={`tel:${room.hostel.contactNumber}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3932d8] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-[#3932d8]/25 transition-all hover:-translate-y-0.5 hover:bg-[#2e28b8]">
                      <Phone className="h-4 w-4" strokeWidth={1.8} />Call Now
                    </a>
                  )}
                  <Link href={`/hostel/${room.hostel.slug}`}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#111827]/15 bg-white px-7 py-3.5 text-sm font-bold text-[#111827] transition-all hover:border-[#3932d8]/30 hover:text-[#3932d8]">
                    View Full Hostel <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explore Links */}
        <ExploreLinks
          title="Explore Accommodation"
          links={[
            { label: `${room.hostel.name}`, href: `/hostel/${room.hostel.slug}` },
            { label: `Hostels in ${room.hostel.city || 'Bhopal'}`, href: `/city/${room.hostel.city ? room.hostel.city.toLowerCase().replace(/\s+/g, '-') : 'bhopal'}` },
            { label: `Boys Hostels in ${room.hostel.city || 'Bhopal'}`, href: `/city/${room.hostel.city ? room.hostel.city.toLowerCase().replace(/\s+/g, '-') : 'bhopal'}/boys-hostel` },
            { label: `Girls Hostels in ${room.hostel.city || 'Bhopal'}`, href: `/city/${room.hostel.city ? room.hostel.city.toLowerCase().replace(/\s+/g, '-') : 'bhopal'}/girls-hostel` },
          ]}
          className="mt-8"
        />
      </main>

      <Footer />
    </div>
  );
}
