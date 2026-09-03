import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Phone, Mail, Building2, Users,
  ChevronRight, IndianRupee, Clock, ArrowRight,
  CheckCircle2, Sparkles,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RoomsSection } from "@/components/hostel/rooms-section";
import { AnimatedBanner } from "@/components/hostel/animated-banner";
import { AmenitiesGrid } from "@/components/hostel/amenities-grid";
import { SafetyGrid } from "@/components/hostel/safety-grid";
import { GallerySection } from "@/components/hostel/gallery-section";
import { HostelActionButtons } from "@/components/hostel/hostel-action-buttons";
import { AboutSection } from "@/components/hostel/about-section";
import { getHostelDetailBySlug, getHostelSlugsForSSG } from "@/services/hostel-detail.service";

interface HostelPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const slugs = await getHostelSlugsForSSG();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: HostelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hostel = await getHostelDetailBySlug(slug);
  if (!hostel) return { title: "Hostel Not Found" };

  const mainPhoto = hostel.media.photos.find(p => p.isMain)?.url || hostel.media.photos[0]?.url;
  const location = hostel.basicInfo.city && hostel.basicInfo.state
    ? `${hostel.basicInfo.city}, ${hostel.basicInfo.state}`
    : hostel.basicInfo.city || hostel.basicInfo.state || 'India';
  const accommodationType = hostel.propertyDetails.accommodationType || 'hostel';
  const minRent = hostel.roomTypes.length > 0 ? Math.min(...hostel.roomTypes.map(r => r.rent)) : null;

  const title = `${hostel.basicInfo.name} — ${accommodationType.charAt(0).toUpperCase() + accommodationType.slice(1)} in ${location} | GetStay`;
  const description = hostel.basicInfo.description
    ? `${hostel.basicInfo.description.slice(0, 150)}... Book now on GetStay.`
    : `Book ${hostel.basicInfo.name}, a verified ${accommodationType} in ${location}. ${hostel.propertyDetails.totalRooms || 'Multiple'} rooms${minRent ? ` from ₹${minRent.toLocaleString('en-IN')}/month` : ''}. Modern amenities, zero brokerage.`;

  const keywords = [
    hostel.basicInfo.name, `${accommodationType} hostel`,
    `hostel in ${hostel.basicInfo.city}`,
    hostel.basicInfo.state && `hostel in ${hostel.basicInfo.state}`,
    'student accommodation', 'pg accommodation', 'hostel booking', 'affordable hostel',
    ...hostel.amenities.filter(a => a.available).slice(0, 5).map(a => a.name.toLowerCase()),
  ].filter(Boolean);

  return {
    title, description, keywords: keywords.join(', '),
    authors: [{ name: 'GetStay' }],
    openGraph: { title, description, type: 'website', url: `https://getstay.in/hostel/${slug}`, siteName: 'GetStay', locale: 'en_IN', images: mainPhoto ? [{ url: mainPhoto, width: 1200, height: 630, alt: hostel.basicInfo.name }] : [] },
    twitter: { card: 'summary_large_image', title, description, images: mainPhoto ? [mainPhoto] : [], site: '@GetStay' },
    alternates: { canonical: `https://getstay.in/hostel/${slug}` },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 } },
  };
}

export default async function HostelPage({ params }: HostelPageProps) {
  const { slug } = await params;
  const hostel = await getHostelDetailBySlug(slug);
  if (!hostel) notFound();

  const displayType = hostel.propertyDetails.accommodationType === 'coed'
    ? 'Co-Ed' : hostel.propertyDetails.accommodationType
      ? hostel.propertyDetails.accommodationType.charAt(0).toUpperCase() + hostel.propertyDetails.accommodationType.slice(1)
      : 'Hostel';

  const location = hostel.basicInfo.city && hostel.basicInfo.state
    ? `${hostel.basicInfo.city}, ${hostel.basicInfo.state}`
    : hostel.basicInfo.city || hostel.basicInfo.state || '';

  const minRent = hostel.roomTypes.length > 0 ? Math.min(...hostel.roomTypes.map(r => r.rent)) : null;
  const maxRent = hostel.roomTypes.length > 0 ? Math.max(...hostel.roomTypes.map(r => r.rent)) : null;

  const sortedPhotos = [
    ...hostel.media.photos.filter(p => p.isMain),
    ...hostel.media.photos.filter(p => !p.isMain),
  ];
  const heroPhotos = sortedPhotos.slice(0, 5);
  const hasHeroImages = heroPhotos.length > 0;

  const structuredData = {
    '@context': 'https://schema.org', '@type': 'LodgingBusiness',
    '@id': `https://getstay.in/hostel/${slug}`,
    name: hostel.basicInfo.name,
    description: hostel.basicInfo.description || `${hostel.basicInfo.name} — Modern hostel accommodation`,
    url: `https://getstay.in/hostel/${slug}`,
    image: hostel.media.photos.map(p => p.url),
    address: { '@type': 'PostalAddress', streetAddress: hostel.basicInfo.address, addressLocality: hostel.basicInfo.city, addressRegion: hostel.basicInfo.state, postalCode: hostel.basicInfo.pincode, addressCountry: 'IN' },
    ...(hostel.locationInfo.latitude && hostel.locationInfo.longitude && { geo: { '@type': 'GeoCoordinates', latitude: hostel.locationInfo.latitude, longitude: hostel.locationInfo.longitude } }),
    telephone: hostel.basicInfo.contactNumber, email: hostel.basicInfo.email,
    ...(minRent && { priceRange: maxRent && minRent !== maxRent ? `₹${minRent.toLocaleString('en-IN')} - ₹${maxRent.toLocaleString('en-IN')}` : `₹${minRent.toLocaleString('en-IN')}` }),
    amenityFeature: hostel.amenities.filter(a => a.available).map(a => ({ '@type': 'LocationFeatureSpecification', name: a.name, value: true })),
    numberOfRooms: hostel.propertyDetails.totalRooms,
    ...(hostel.propertyDetails.establishedYear && { foundingDate: hostel.propertyDetails.establishedYear.toString() }),
  };

  const breadcrumbData = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://getstay.in' },
      { '@type': 'ListItem', position: 2, name: 'Explore', item: 'https://getstay.in/explore' },
      { '@type': 'ListItem', position: 3, name: hostel.basicInfo.name, item: `https://getstay.in/hostel/${slug}` },
    ],
  };

  return (
    <div className="min-h-screen bg-[#fffffd] selection:bg-[#3932d8] selection:text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      <Header pageTitle={hostel.basicInfo.name} showBackButton={true} />

      <main className="overflow-hidden">

        {/* ══════════════════════════════════════════════
            § 1  HERO — image mosaic + title overlay
        ══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#f7f6f3] pt-0">

          {/* ── Image mosaic ── */}
          <div className="relative h-[380px] sm:h-[460px] lg:h-[560px] w-full overflow-hidden">
            {hasHeroImages ? (
              <>
                {/* ≥5 photos: Airbnb mosaic (desktop) */}
                {heroPhotos.length >= 5 && (
                  <div className="hidden lg:flex h-full gap-1 group">
                    <div className="relative flex-[2.2] overflow-hidden">
                      <Image src={heroPhotos[0].url} alt={hostel.basicInfo.name} fill priority className="object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                    <div className="grid flex-1 grid-cols-2 gap-1">
                      {heroPhotos.slice(1, 5).map((p, i) => (
                        <div key={i} className="relative overflow-hidden">
                          <Image src={p.url} alt={hostel.basicInfo.name} fill className="object-cover transition-transform duration-700 hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* 4 photos: large left + 3 stacked */}
                {heroPhotos.length === 4 && (
                  <div className="hidden sm:flex h-full gap-1 group">
                    <div className="relative flex-[2] overflow-hidden">
                      <Image src={heroPhotos[0].url} alt={hostel.basicInfo.name} fill priority className="object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      {heroPhotos.slice(1).map((p, i) => (
                        <div key={i} className="relative flex-1 overflow-hidden">
                          <Image src={p.url} alt={hostel.basicInfo.name} fill className="object-cover transition-transform duration-700 hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* 3 photos: large left + 2 stacked */}
                {heroPhotos.length === 3 && (
                  <div className="hidden sm:flex h-full gap-1 group">
                    <div className="relative flex-[2] overflow-hidden">
                      <Image src={heroPhotos[0].url} alt={hostel.basicInfo.name} fill priority className="object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                    <div className="flex flex-1 flex-col gap-1">
                      {heroPhotos.slice(1).map((p, i) => (
                        <div key={i} className="relative flex-1 overflow-hidden">
                          <Image src={p.url} alt={hostel.basicInfo.name} fill className="object-cover transition-transform duration-700 hover:scale-105" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* 2 photos: 60/40 split */}
                {heroPhotos.length === 2 && (
                  <div className="hidden sm:flex h-full gap-1 group">
                    <div className="relative flex-[3] overflow-hidden">
                      <Image src={heroPhotos[0].url} alt={hostel.basicInfo.name} fill priority className="object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                    <div className="relative flex-[2] overflow-hidden">
                      <Image src={heroPhotos[1].url} alt={hostel.basicInfo.name} fill className="object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                  </div>
                )}
                {/* Mobile / single fallback */}
                <div className={`${heroPhotos.length > 1 ? 'sm:hidden' : ''} relative h-full`}>
                  <Image src={heroPhotos[0].url} alt={hostel.basicInfo.name} fill priority className="object-cover" />
                </div>
              </>
            ) : (
              <AnimatedBanner
                hostelName={hostel.basicInfo.name} location={location}
                totalRooms={hostel.propertyDetails.totalRooms}
                accommodationType={hostel.propertyDetails.accommodationType}
              />
            )}

            {/* deep gradient for text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

            {/* photo count chip / gallery scroll trigger */}
            {hostel.media.photos.length > 0 && (
              <a
                href="#gallery"
                className="absolute bottom-5 right-5 z-20 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-xs font-bold text-white backdrop-blur-md border border-white/15 shadow-lg transition-all hover:bg-black/80 hover:scale-105 active:scale-95"
              >
                <span>View All Photos</span>
                <span className="rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-extrabold">{hostel.media.photos.length}</span>
              </a>
            )}
          </div>

          {/* ── Title / meta overlay ── */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-7 sm:px-8 sm:pb-10 lg:px-10 lg:pb-12">
            <div className="mx-auto max-w-7xl">
              {/* breadcrumb */}
              <nav className="mb-3 flex items-center gap-1 text-[11px] text-white/55" aria-label="Breadcrumb">
                <Link href="/" className="hover:text-white/90 transition-colors">Home</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/explore" className="hover:text-white/90 transition-colors">Explore</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-white/90 line-clamp-1 max-w-[160px]">{hostel.basicInfo.name}</span>
              </nav>

              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                {/* left */}
                <div className="min-w-0 flex-1">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3932d8] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white shadow-md">
                      {displayType}
                    </span>
                    {hostel.propertyDetails.totalRooms && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                        <Users className="h-3 w-3" />{hostel.propertyDetails.totalRooms} Rooms
                      </span>
                    )}
                    {hostel.propertyDetails.establishedYear && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 border border-white/15 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-sm">
                        <Clock className="h-3 w-3" />Est. {hostel.propertyDetails.establishedYear}
                      </span>
                    )}
                  </div>
                  <h1 className="text-3xl font-black tracking-[-0.03em] text-white sm:text-4xl lg:text-5xl leading-[1.08] drop-shadow-lg">
                    {hostel.basicInfo.name}
                  </h1>
                  {location && (
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-white/75">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 shrink-0" />{location}
                      </span>
                      {hostel.basicInfo.address && (
                        <span className="hidden sm:block text-white/50 text-xs truncate max-w-[260px]">· {hostel.basicInfo.address}</span>
                      )}
                    </div>
                  )}
                </div>

                {/* right — price card */}
                {minRent && (
                  <div className="shrink-0 rounded-[20px] bg-white/10 backdrop-blur-xl border border-white/20 px-5 py-4 text-white shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white/55 mb-1">Starts from</p>
                    <div className="flex items-baseline gap-0.5">
                      <IndianRupee className="h-4 w-4 mt-0.5" />
                      <span className="text-3xl font-black leading-none">{minRent.toLocaleString('en-IN')}</span>
                      <span className="text-sm text-white/55 ml-1">/mo</span>
                    </div>
                    {maxRent && maxRent !== minRent && (
                      <p className="text-[10px] text-white/45 mt-1">up to ₹{maxRent.toLocaleString('en-IN')}/mo</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            § 2  STICKY ACTION BAR (Enhanced Responsive)
        ══════════════════════════════════════════════ */}
        <div className="sticky top-[80px] z-30 border-b border-[#111827]/8 bg-white/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <MapPin className="h-3.5 w-3.5 text-[#3932d8] shrink-0" />
              <span className="truncate text-sm font-black text-[#111827]">{hostel.basicInfo.name}</span>
              {location && <span className="hidden md:block text-xs text-gray-500 truncate">· {location}</span>}
            </div>
            <div className="w-full sm:w-auto">
              <HostelActionButtons
                hostelName={hostel.basicInfo.name} location={location}
                contactNumber={hostel.basicInfo.contactNumber}
                googleMapLink={hostel.locationInfo.googleMapLink}
              />
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════
            § 3  ABOUT HOSTEL  (Clean & Professional)
        ══════════════════════════════════════════════ */}
        {hostel.basicInfo.description && (
          <section id="about" className="bg-white py-12 md:py-16">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
              <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12 xl:gap-16">

                {/* Left Column — Featured Hero Photo with Verified Overlay */}
                <div className="lg:col-span-5">
                  <div className="relative overflow-hidden rounded-[24px] border border-gray-200/80 bg-[#f8f8f8] shadow-md group">
                    {heroPhotos[0]?.url ? (
                      <Image
                        src={heroPhotos[0].url} alt={hostel.basicInfo.name}
                        width={800} height={520}
                        className="h-64 sm:h-80 md:h-96 w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="h-64 sm:h-80 md:h-96 w-full">
                        <AnimatedBanner
                          hostelName={hostel.basicInfo.name} location={location}
                          totalRooms={hostel.propertyDetails.totalRooms}
                          accommodationType={hostel.propertyDetails.accommodationType}
                        />
                      </div>
                    )}

                    {/* Floating Verified Chip */}
                    <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/40 px-3 py-1 text-[10px] font-black uppercase tracking-[0.22em] text-[#3932d8] shadow-sm">
                      <Sparkles className="h-3 w-3" />GetStay Verified
                    </div>
                  </div>
                </div>

                {/* Right Column — Content & Compact Highlights */}
                <div className="lg:col-span-7">
                  <span className="inline-block text-[11px] font-black uppercase tracking-[0.24em] text-[#3932d8] mb-2">
                    About this hostel
                  </span>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.03em] text-[#111827] leading-tight">
                    {hostel.basicInfo.name}
                  </h2>

                  <AboutSection description={hostel.basicInfo.description} />

                  {/* Clean Horizontal Highlights Row */}
                  <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-4 text-xs font-semibold text-gray-700">
                    {hostel.propertyDetails.totalRooms && (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#3932d8]" />
                        <span><strong>{hostel.propertyDetails.totalRooms}</strong> Total Rooms</span>
                      </div>
                    )}
                    {hostel.propertyDetails.buildingType && (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#3932d8]" />
                        <span className="capitalize"><strong>{hostel.propertyDetails.buildingType}</strong> Property</span>
                      </div>
                    )}
                    {hostel.propertyDetails.totalFloors && (
                      <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#3932d8]" />
                        <span><strong>{hostel.propertyDetails.totalFloors}</strong> Floors</span>
                      </div>
                    )}
                    {minRent && (
                      <div className="flex items-center gap-2 text-[#3932d8]">
                        <span className="h-2 w-2 rounded-full bg-[#3932d8]" />
                        <span>Starts at <strong>₹{minRent.toLocaleString('en-IN')}/mo</strong></span>
                      </div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════
            § 4  AMENITIES  (Enhanced Responsive)
        ══════════════════════════════════════════════ */}
        {hostel.amenities.filter(a => a.available).length > 0 && (
          <section id="amenities" className="bg-white py-12 md:py-16 lg:py-20 border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
              <AmenitiesGrid
                amenities={hostel.amenities.map(a => ({ name: a.name, description: a.description, available: a.available }))}
              />
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════
            § 5  ROOMS  (Enhanced Responsive)
        ══════════════════════════════════════════════ */}
        {hostel.roomTypes.length > 0 && (
          <section id="rooms" className="bg-[#f8f9fa] py-12 md:py-16 lg:py-20 border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
              <div className="mb-8 sm:mb-10 text-center">
                <span className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.24em] text-[#3932d8] mb-2 sm:mb-3">
                  Choose your space
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.04em] text-[#111827]">
                  Available Rooms
                </h2>
                <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-gray-600 mx-auto">
                  {hostel.roomTypes.length} room type{hostel.roomTypes.length !== 1 ? 's' : ''} · Click any room to see full details
                </p>
              </div>
              <RoomsSection
                rooms={hostel.roomTypes.map(room => ({
                  _id: room._id.toString(), name: room.name, description: room.description, rent: room.rent,
                  images: room.images.map(img => ({ url: img.url, isCover: img.isCover })),
                  components: room.components.map(c => ({ name: c.name, description: c.description })),
                }))}
              />
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════
            § 6  GALLERY  (Enhanced Responsive)
        ══════════════════════════════════════════════ */}
        {hostel.media.photos.length > 0 && (
          <section id="gallery" className="bg-white py-12 md:py-16 lg:py-20 border-t border-gray-100">
            <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
              <GallerySection
                photos={hostel.media.photos.map(photo => ({
                  url: photo.url, title: photo.title, description: photo.description,
                  type: photo.type, isMain: photo.isMain,
                }))}
              />
            </div>
          </section>
        )}

        {/* ══════════════════════════════════════════════
            § 7  SAFETY  (Enhanced Responsive)
        ══════════════════════════════════════════════ */}
        <section id="safety" className="bg-white py-12 md:py-16 lg:py-20 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <SafetyGrid
              safetyFeatures={hostel.safetyFeatures ? hostel.safetyFeatures.map(s => ({ feature: s.feature, details: s.details, available: s.available })) : []}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            § 8  LOCATION + CONTACT  (Enhanced Responsive)
        ══════════════════════════════════════════════ */}
        <section id="location" className="bg-[#f4f4f4] py-12 md:py-16 lg:py-20">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <div className="mb-8 sm:mb-10">
              <span className="inline-block text-[10px] sm:text-[11px] font-black uppercase tracking-[0.24em] text-[#3932d8] mb-2 sm:mb-3">
                Find us
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-[-0.04em] text-[#111827]">
                Location & Contact
              </h2>
            </div>

            <div className="grid gap-4 sm:gap-5 lg:gap-6 lg:grid-cols-3">
              {/* Contact card */}
              <div
                data-section="contact"
                className="group rounded-[20px] sm:rounded-[24px] border border-[#111827]/10 bg-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(17,24,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(57,50,216,0.10)]"
              >
                <div className="mb-4 sm:mb-5 flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-black text-[#111827]">Contact</h3>
                  <div className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-[#3932d8]/10">
                    <Phone className="h-4 w-4 text-[#3932d8]" />
                  </div>
                </div>
                <div className="space-y-3 sm:space-y-4">
                  {hostel.basicInfo.address && (
                    <div className="flex items-start gap-2 sm:gap-3">
                      <MapPin className="h-4 w-4 text-[#3932d8] mt-0.5 shrink-0" />
                      <div className="text-xs sm:text-sm text-gray-700 leading-relaxed">
                        <p className="font-bold text-[#111827]">{hostel.basicInfo.address}</p>
                        {hostel.basicInfo.landmark && <p className="mt-0.5">Near {hostel.basicInfo.landmark}</p>}
                        {hostel.basicInfo.pincode && <p className="font-mono text-[10px] mt-0.5 text-gray-500">PIN {hostel.basicInfo.pincode}</p>}
                      </div>
                    </div>
                  )}
                  {hostel.basicInfo.contactNumber && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Phone className="h-4 w-4 text-[#3932d8] shrink-0" />
                      <a href={`tel:${hostel.basicInfo.contactNumber}`}
                        className="text-xs sm:text-sm font-bold text-[#111827] hover:text-[#3932d8] transition-colors">
                        {hostel.basicInfo.contactNumber}
                      </a>
                    </div>
                  )}
                  {hostel.basicInfo.email && (
                    <div className="flex items-center gap-2 sm:gap-3">
                      <Mail className="h-4 w-4 text-[#3932d8] shrink-0" />
                      <a href={`mailto:${hostel.basicInfo.email}`}
                        className="text-xs sm:text-sm text-gray-600 hover:text-[#3932d8] transition-colors truncate">
                        {hostel.basicInfo.email}
                      </a>
                    </div>
                  )}
                </div>
                {hostel.locationInfo.googleMapLink && (
                  <a href={hostel.locationInfo.googleMapLink} target="_blank" rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[#3932d8] px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-[#3932d8]/20 transition-all hover:-translate-y-0.5 hover:bg-[#2e28b8]">
                    <MapPin className="h-4 w-4" />Open in Google Maps
                  </a>
                )}
              </div>

              {/* Nearby landmarks */}
              {hostel.locationInfo.nearbyLandmarks.length > 0 && (
                <div className="rounded-[20px] sm:rounded-[24px] border border-[#111827]/10 bg-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(17,24,39,0.06)]">
                  <div className="mb-4 sm:mb-5 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-black text-[#111827]">Nearby</h3>
                    <div className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-[#3932d8]/10">
                      <MapPin className="h-4 w-4 text-[#3932d8]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {hostel.locationInfo.nearbyLandmarks.map((lm, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg sm:rounded-xl bg-[#f9fafb] px-3 sm:px-3.5 py-2 sm:py-2.5 border border-[#111827]/6">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#111827]">{lm.name}</p>
                          <p className="text-[9px] sm:text-xs text-gray-500 capitalize mt-0.5">{lm.type}</p>
                        </div>
                        <span className="ml-2 shrink-0 rounded-lg bg-white border border-[#111827]/10 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-xs font-black font-mono text-gray-600">
                          {lm.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Transport */}
              {hostel.locationInfo.transportConnectivity.length > 0 && (
                <div className="rounded-[20px] sm:rounded-[24px] border border-[#111827]/10 bg-white p-5 sm:p-6 shadow-[0_20px_50px_rgba(17,24,39,0.06)]">
                  <div className="mb-4 sm:mb-5 flex items-center justify-between">
                    <h3 className="text-base sm:text-lg font-black text-[#111827]">Transport</h3>
                    <div className="flex h-8 sm:h-9 w-8 sm:w-9 items-center justify-center rounded-lg sm:rounded-xl bg-[#3932d8]/10">
                      <Building2 className="h-4 w-4 text-[#3932d8]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    {hostel.locationInfo.transportConnectivity.map((t, idx) => (
                      <div key={idx} className="flex items-center justify-between rounded-lg sm:rounded-xl bg-[#f9fafb] px-3 sm:px-3.5 py-2 sm:py-2.5 border border-[#111827]/6">
                        <div>
                          <p className="text-xs sm:text-sm font-bold text-[#111827] capitalize">{t.mode}</p>
                          {t.details && <p className="text-[9px] sm:text-xs text-gray-500 mt-0.5 line-clamp-1">{t.details}</p>}
                        </div>
                        <span className="ml-2 shrink-0 rounded-lg bg-white border border-[#111827]/10 px-2 sm:px-2.5 py-0.5 sm:py-1 text-[9px] sm:text-xs font-black font-mono text-gray-600">
                          {t.distance}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            § 9  CTA  (Enhanced Responsive)
        ══════════════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-[#f7f6f3] py-14 md:py-20 lg:py-24 px-3 sm:px-4">
          {/* ambient glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[600px] h-[200px] sm:h-[300px] bg-[#3932d8]/6 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-5xl z-10">
            <div className="relative overflow-hidden rounded-[24px] sm:rounded-[32px] border border-[#111827]/10 bg-white p-6 sm:p-10 lg:p-12 shadow-[0_30px_90px_rgba(17,24,39,0.08)]">
              {/* brand stripe */}
              <div className="absolute top-0 inset-x-0 h-1 sm:h-1.5 bg-gradient-to-r from-[#3932d8] via-[#6c63ff] to-[#0ea5e9]" />

              <div className="grid items-center gap-6 sm:gap-8 lg:grid-cols-12">
                <div className="lg:col-span-7 space-y-3 sm:space-y-4 lg:space-y-5">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#3932d8]/15 bg-[#f1f3ff] px-3 sm:px-3.5 py-0.5 sm:py-1 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.22em] text-[#3932d8]">
                    <Sparkles className="h-3 w-3" />Interested in staying here?
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-[-0.04em] text-[#111827] leading-tight">
                    Ready to make this your home?
                  </h2>
                  <div className="flex flex-col xs:flex-row xs:flex-wrap gap-3 text-[9px] sm:text-xs font-bold text-gray-600">
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#3932d8] shrink-0" />Zero Brokerage</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#3932d8] shrink-0" />Verified Property</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-[#3932d8] shrink-0" />Instant Enquiry</span>
                  </div>
                </div>
                <div className="lg:col-span-5 flex flex-col gap-2.5 sm:gap-3">
                  {hostel.basicInfo.contactNumber && (
                    <a href={`tel:${hostel.basicInfo.contactNumber}`}
                      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3932d8] px-5 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-black text-white shadow-lg shadow-[#3932d8]/25 transition-all hover:-translate-y-0.5 hover:bg-[#2e28b8] active:translate-y-0">
                      <Phone className="h-4 w-4" />Call Now
                    </a>
                  )}
                  <Link href="/explore"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-[#111827]/15 bg-white px-5 sm:px-7 py-2.5 sm:py-3.5 text-xs sm:text-sm font-bold text-[#111827] transition-all hover:border-[#3932d8]/30 hover:text-[#3932d8]">
                    Browse more stays <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
