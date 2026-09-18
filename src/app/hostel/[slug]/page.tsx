import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  MapPin, Phone, Mail, Building2, Users,
  ChevronRight, IndianRupee, Clock, ArrowRight,
  CheckCircle2, Sparkles, LayoutGrid,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RoomsSection } from "@/components/hostel/rooms-section";
import { AnimatedBanner } from "@/components/hostel/animated-banner";
import { AmenitiesGrid } from "@/components/hostel/amenities-grid";
import { SafetyGrid } from "@/components/hostel/safety-grid";
import { LocationMap } from "@/components/hostel/location-map";
import { HostelActionButtons } from "@/components/hostel/hostel-action-buttons";
import { AboutSection } from "@/components/hostel/about-section";
import { HostelSaveShareButtons } from "@/components/hostel/hostel-save-share-buttons";
import { HostelDetailsOverview } from "@/components/hostel/hostel-details-overview";
import { HostelMobileView } from "@/components/hostel/hostel-mobile-view";
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
  ].map(p => ({
    url: p.url,
    isMain: p.isMain,
    title: p.title,
    description: p.description,
    type: p.type,
  }));
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

      {/* Header - Hidden on mobile in favor of floating overlay bar */}
      <div className="hidden sm:block">
        <Header pageTitle={hostel.basicInfo.name} showBackButton={true} />
      </div>

      <main className="overflow-hidden pb-20 sm:pb-0">
        {/* ══════════════════════════════════════════════
            MOBILE VIEW (Airbnb Mobile UI Matching Screenshot)
        ══════════════════════════════════════════════ */}
        <HostelMobileView
          photos={sortedPhotos}
          name={hostel.basicInfo.name}
          location={location}
          accommodationType={hostel.propertyDetails.accommodationType}
          totalRooms={hostel.propertyDetails.totalRooms}
          minRent={minRent}
          hostName="Let'Stay - Noida"
          description={hostel.basicInfo.description}
          address={hostel.basicInfo.address}
          city={hostel.basicInfo.city}
          state={hostel.basicInfo.state}
          pincode={hostel.basicInfo.pincode}
          contactNumber={hostel.basicInfo.contactNumber}
          email={hostel.basicInfo.email}
          googleMapLink={hostel.locationInfo?.googleMapLink}
        />

        {/* ══════════════════════════════════════════════
            DESKTOP HERO & OVERVIEW (Clean Airbnb Layout)
        ══════════════════════════════════════════════ */}
        <div className="hidden sm:block">
          <section className="bg-white pt-6 pb-6 sm:pt-8 sm:pb-8">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
              {/* Header: Title + Subtitle on Left, Save + Share on Right */}
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5 sm:mb-6">
                <div className="min-w-0 flex-1">
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-medium tracking-tight text-[#111827] truncate line-clamp-1">
                    {hostel.basicInfo.name}{location ? ` | ${location}` : ''}
                  </h1>
                </div>

                {/* Save & Share Action Buttons */}
                <div className="shrink-0 pt-1">
                  <HostelSaveShareButtons hostelName={hostel.basicInfo.name} />
                </div>
              </div>

              {/* 5-Photo Grid Layout (Airbnb Style — outer corners rounded, inner zero radius) */}
              {hasHeroImages ? (
                <div className="relative rounded-2xl overflow-hidden shadow-xs border border-gray-200/60 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2 lg:gap-2.5">
                    {/* Left Column — 1 Large Photo */}
                    <div className="relative h-[240px] sm:h-[320px] md:h-[360px] lg:h-[400px] w-full overflow-hidden md:rounded-l-2xl rounded-t-2xl md:rounded-r-none group">
                      <Image
                        src={heroPhotos[0].url}
                        alt={hostel.basicInfo.name}
                        fill
                        priority
                        className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>

                    {/* Right Column — 2x2 Grid of 4 Photos */}
                    <div className="grid grid-cols-2 gap-2 sm:gap-2 lg:gap-2.5 h-[240px] sm:h-[320px] md:h-[360px] lg:h-[400px] w-full">
                      {Array.from({ length: 4 }).map((_, i) => {
                        const photo = heroPhotos[i + 1] || heroPhotos[i % Math.max(1, heroPhotos.length)];
                        let cornerClass = "rounded-none";
                        if (i === 1) cornerClass = "md:rounded-tr-2xl rounded-none";
                        if (i === 3) cornerClass = "md:rounded-br-2xl rounded-b-2xl md:rounded-bl-none";

                        return (
                          <div
                            key={i}
                            className={`relative h-full w-full overflow-hidden ${cornerClass} group bg-[#f4f4f5]`}
                          >
                            {photo ? (
                              <Image
                                src={photo.url}
                                alt={`${hostel.basicInfo.name} photo ${i + 2}`}
                                fill
                                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                                sizes="(max-width: 768px) 50vw, 25vw"
                              />
                            ) : null}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Floating "Show all photos" Button */}
                  {hostel.media.photos.length > 0 && (
                    <a
                      href="#gallery"
                      className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 inline-flex items-center gap-2 rounded-sm bg-white/95 px-3.5 py-1.5 text-xs font-semibold text-[#111827] border border-gray-900/10 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:shadow-md active:scale-95"
                    >
                      <LayoutGrid className="h-3.5 w-3.5 text-[#111827]" />
                      <span>Show all photos</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="rounded-2xl overflow-hidden">
                  <AnimatedBanner
                    hostelName={hostel.basicInfo.name}
                    location={location}
                    totalRooms={hostel.propertyDetails.totalRooms}
                    accommodationType={hostel.propertyDetails.accommodationType}
                  />
                </div>
              )}
            </div>
          </section>

          {/* § 2 OVERVIEW & CONTACT */}
          <HostelDetailsOverview
            description={hostel.basicInfo.description}
            hostName="Deeksha"
            minRent={minRent}
            accommodationType={hostel.propertyDetails.accommodationType}
            messAvailable={true}
            securityDeposit="10,000/-"
            address={hostel.basicInfo.address}
            city={hostel.basicInfo.city}
            state={hostel.basicInfo.state}
            pincode={hostel.basicInfo.pincode}
            contactNumber={hostel.basicInfo.contactNumber}
            email={hostel.basicInfo.email}
          />
        </div>




        {/* ══════════════════════════════════════════════
            § 5  ROOMS  (Matching Reference Image)
        ══════════════════════════════════════════════ */}
        {hostel.roomTypes.length > 0 && (
          <section id="rooms" className="bg-white py-6 sm:py-10 border-t border-gray-200/80">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-5 sm:mb-8">
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111827]">
                  Rooms
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
                  Choose from our verified, comfortable room options tailored for your stay.
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
            § 4  AMENITIES  (Enhanced Airbnb-Style Layout)
        ══════════════════════════════════════════════ */}
        <section id="amenities" className="bg-white py-6 sm:py-12 border-t border-gray-200/80">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
            <AmenitiesGrid
              amenities={hostel.amenities.map(a => ({ name: a.name, description: a.description, available: a.available }))}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            § 7  SAFETY  (Enhanced Responsive)
        ══════════════════════════════════════════════ */}
        <section id="safety" className="bg-white py-6 sm:py-16 lg:py-20 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
            <SafetyGrid
              safetyFeatures={hostel.safetyFeatures ? hostel.safetyFeatures.map(s => ({ feature: s.feature, details: s.details, available: s.available })) : []}
            />
          </div>
        </section>

        {/* ══════════════════════════════════════════════
            § 8  NEARBY & TRANSIT
        ══════════════════════════════════════════════ */}
        {(hostel.locationInfo.nearbyLandmarks.length > 0 || hostel.locationInfo.transportConnectivity.length > 0) && (
          <section id="location" className="bg-white py-6 sm:py-12 border-t border-gray-200/80">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
              {/* Section Header */}
              <div className="text-center mb-6 sm:mb-10">
                <h2 className="text-2xl sm:text-3xl font-medium tracking-tight text-[#111827]">
                  Neighborhood & Transit
                </h2>
                <p className="mt-1.5 text-xs sm:text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
                  Key landmarks, essential hubs, and transit options surrounding this property.
                </p>
              </div>

              {/* 2-Column Grid for Nearby & Transport */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {/* Nearby Landmarks Card */}
                {hostel.locationInfo.nearbyLandmarks.length > 0 && (
                  <div className="rounded-2xl border border-gray-200/80 bg-[#f9fafb] p-5 sm:p-6">
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200/60">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200/70 text-[#3932d8] shadow-2xs">
                        <MapPin className="h-4.5 w-4.5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-[#111827] tracking-tight">Nearby Places</h3>
                        <p className="text-xs text-gray-500">Popular hubs and essential landmarks</p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {hostel.locationInfo.nearbyLandmarks.map((lm, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl bg-white p-3 border border-gray-200/70 shadow-2xs"
                        >
                          <div className="min-w-0 flex-1 pr-3">
                            <p className="text-xs sm:text-sm font-medium text-[#111827] truncate">{lm.name}</p>
                            <p className="text-[11px] text-gray-500 capitalize mt-0.5">{lm.type}</p>
                          </div>
                          <span className="shrink-0 rounded-full bg-[#f4f4f6] px-2.5 py-1 text-xs font-medium text-gray-600">
                            {lm.distance}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Transport Connectivity Card */}
                {hostel.locationInfo.transportConnectivity.length > 0 && (
                  <div className="rounded-2xl border border-gray-200/80 bg-[#f9fafb] p-5 sm:p-6">
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200/60">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white border border-gray-200/70 text-[#3932d8] shadow-2xs">
                        <Building2 className="h-4.5 w-4.5" strokeWidth={1.75} />
                      </div>
                      <div>
                        <h3 className="text-base font-medium text-[#111827] tracking-tight">Transport & Transit</h3>
                        <p className="text-xs text-gray-500">Bus stops, stations & connectivity</p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {hostel.locationInfo.transportConnectivity.map((t, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-xl bg-white p-3 border border-gray-200/70 shadow-2xs"
                        >
                          <div className="min-w-0 flex-1 pr-3">
                            <p className="text-xs sm:text-sm font-medium text-[#111827] capitalize">{t.mode}</p>
                            {t.details && <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-1">{t.details}</p>}
                          </div>
                          <span className="shrink-0 rounded-full bg-[#f4f4f6] px-2.5 py-1 text-xs font-medium text-gray-600">
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
        )}

        {/* ══════════════════════════════════════════════
            § 9  LIVE GOOGLE MAP
        ══════════════════════════════════════════════ */}
        <section id="map" className="bg-white py-6 sm:py-12 border-t border-gray-200/80">
          <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-8">
            <LocationMap
              name={hostel.basicInfo.name}
              address={hostel.basicInfo.address}
              city={hostel.basicInfo.city}
              state={hostel.basicInfo.state}
              pincode={hostel.basicInfo.pincode}
              landmark={hostel.basicInfo.landmark}
              latitude={hostel.locationInfo?.latitude}
              longitude={hostel.locationInfo?.longitude}
              googleMapLink={hostel.locationInfo?.googleMapLink}
            />
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
