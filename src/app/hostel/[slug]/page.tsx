import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Phone, Mail, Building2, Users, Calendar, Home } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoomsSection } from "@/components/hostel/rooms-section";
import { AnimatedBanner } from "@/components/hostel/animated-banner";
import { AmenitiesGrid } from "@/components/hostel/amenities-grid";
import { SafetyGrid } from "@/components/hostel/safety-grid";
import { AboutSection } from "@/components/hostel/about-section";
import { GallerySection } from "@/components/hostel/gallery-section";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ExploreLinks } from "@/components/shared/explore-links";
import { getHostelDetailBySlug, getHostelSlugsForSSG } from "@/services/hostel-detail.service";
import { HostelActionButtons } from "@/components/hostel/hostel-action-buttons";

interface HostelPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = await getHostelSlugsForSSG();
  
  return slugs.map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: HostelPageProps): Promise<Metadata> {
  const { slug } = await params;
  const hostel = await getHostelDetailBySlug(slug);

  if (!hostel) {
    return {
      title: "Hostel Not Found",
    };
  }

  const mainPhoto = hostel.media.photos.find(p => p.isMain)?.url || hostel.media.photos[0]?.url;
  const location = hostel.basicInfo.city && hostel.basicInfo.state 
    ? `${hostel.basicInfo.city}, ${hostel.basicInfo.state}`
    : hostel.basicInfo.city || hostel.basicInfo.state || 'India';
  
  const accommodationType = hostel.propertyDetails.accommodationType || 'hostel';
  const minRent = hostel.roomTypes.length > 0 
    ? Math.min(...hostel.roomTypes.map(r => r.rent))
    : null;

  // SEO-optimized title and description
  const title = `${hostel.basicInfo.name} - ${accommodationType.charAt(0).toUpperCase() + accommodationType.slice(1)} in ${location} | GetStay`;
  const description = hostel.basicInfo.description 
    ? `${hostel.basicInfo.description.slice(0, 150)}... Book now on GetStay.`
    : `Book ${hostel.basicInfo.name}, a ${accommodationType} hostel in ${location}. ${hostel.propertyDetails.totalRooms || 'Multiple'} rooms available${minRent ? ` starting from ₹${minRent.toLocaleString('en-IN')}/month` : ''}. Modern amenities, safe environment. Book on GetStay.`;

  // Keywords for SEO
  const keywords = [
    hostel.basicInfo.name,
    `${accommodationType} hostel`,
    `hostel in ${hostel.basicInfo.city}`,
    hostel.basicInfo.state && `hostel in ${hostel.basicInfo.state}`,
    'student accommodation',
    'pg accommodation',
    'hostel booking',
    'affordable hostel',
    ...hostel.amenities.filter(a => a.available).slice(0, 5).map(a => a.name.toLowerCase()),
  ].filter(Boolean);

  return {
    title,
    description,
    keywords: keywords.join(', '),
    authors: [{ name: 'GetStay' }],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://getstay.in/hostel/${slug}`,
      siteName: 'GetStay',
      locale: 'en_IN',
      images: mainPhoto ? [
        {
          url: mainPhoto,
          width: 1200,
          height: 630,
          alt: `${hostel.basicInfo.name} - ${accommodationType} hostel in ${location}`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: mainPhoto ? [mainPhoto] : [],
      site: '@GetStay',
    },
    alternates: {
      canonical: `https://getstay.in/hostel/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

export default async function HostelPage({ params }: HostelPageProps) {
  const { slug } = await params;
  const hostel = await getHostelDetailBySlug(slug);

  if (!hostel) {
    notFound();
  }

  const displayType = hostel.propertyDetails.accommodationType === 'coed' 
    ? 'CO-ED' 
    : hostel.propertyDetails.accommodationType?.toUpperCase() || 'HOSTEL';

  const location = hostel.basicInfo.city && hostel.basicInfo.state 
    ? `${hostel.basicInfo.city}, ${hostel.basicInfo.state}`
    : hostel.basicInfo.city || hostel.basicInfo.state || '';

  // Calculate price range for structured data
  const minRent = hostel.roomTypes.length > 0 
    ? Math.min(...hostel.roomTypes.map(r => r.rent))
    : null;
  const maxRent = hostel.roomTypes.length > 0 
    ? Math.max(...hostel.roomTypes.map(r => r.rent))
    : null;

  // JSON-LD Structured Data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    '@id': `https://getstay.in/hostel/${slug}`,
    name: hostel.basicInfo.name,
    description: hostel.basicInfo.description || `${hostel.basicInfo.name} - Modern hostel accommodation`,
    url: `https://getstay.in/hostel/${slug}`,
    image: hostel.media.photos.map(p => p.url),
    address: {
      '@type': 'PostalAddress',
      streetAddress: hostel.basicInfo.address,
      addressLocality: hostel.basicInfo.city,
      addressRegion: hostel.basicInfo.state,
      postalCode: hostel.basicInfo.pincode,
      addressCountry: 'IN',
    },
    ...(hostel.locationInfo.latitude && hostel.locationInfo.longitude && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: hostel.locationInfo.latitude,
        longitude: hostel.locationInfo.longitude,
      },
    }),
    telephone: hostel.basicInfo.contactNumber,
    email: hostel.basicInfo.email,
    ...(minRent && {
      priceRange: maxRent && minRent !== maxRent 
        ? `₹${minRent.toLocaleString('en-IN')} - ₹${maxRent.toLocaleString('en-IN')}`
        : `₹${minRent.toLocaleString('en-IN')}`,
    }),
    amenityFeature: hostel.amenities
      .filter(a => a.available)
      .map(a => ({
        '@type': 'LocationFeatureSpecification',
        name: a.name,
        value: true,
      })),
    numberOfRooms: hostel.propertyDetails.totalRooms,
    ...(hostel.propertyDetails.establishedYear && {
      foundingDate: hostel.propertyDetails.establishedYear.toString(),
    }),
  };

  // BreadcrumbList structured data
  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://getstay.in',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Hostels',
        item: 'https://getstay.in/#hostels',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: hostel.basicInfo.name,
        item: `https://getstay.in/hostel/${slug}`,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />

      <Header pageTitle={hostel.basicInfo.name} showBackButton={true} />
      
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Breadcrumbs
          items={[
            {
              label: `${hostel.basicInfo.city || 'Bhopal'} Hostels`,
              href: `/city/${hostel.basicInfo.city ? hostel.basicInfo.city.toLowerCase().replace(/\s+/g, '-') : 'bhopal'}`,
            },
            { label: hostel.basicInfo.name },
          ]}
        />

        {/* Banner Section with Hostel Info */}
        <div className="mb-8 overflow-hidden rounded-xl border border-border hover:border-brand-primary/50 transition-colors">
          <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 lg:p-8">
            {/* Banner Image - 1:1 Aspect Ratio */}
            <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg border border-border sm:w-48 lg:w-64">
              {hostel.media.banner?.url ? (
                <Image
                  src={hostel.media.banner.url}
                  alt={`${hostel.basicInfo.name} - Banner`}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <AnimatedBanner
                  hostelName={hostel.basicInfo.name}
                  location={location}
                  totalRooms={hostel.propertyDetails.totalRooms}
                  accommodationType={hostel.propertyDetails.accommodationType}
                />
              )}
            </div>

            {/* Hostel Info */}
            <div className="flex-1 min-w-0">
              <h1 className="mb-3 text-3xl font-light sm:text-4xl lg:text-5xl">
                {hostel.basicInfo.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                {location && (
                  <div className="flex items-center gap-1.5 text-sm font-light text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span itemProp="address">{location}</span>
                  </div>
                )}
                <Badge variant="secondary" className="text-xs font-bold font-mono uppercase">
                  {displayType}
                </Badge>
              </div>
              
              {/* Action Buttons */}
              <HostelActionButtons
                hostelName={hostel.basicInfo.name}
                location={location}
                contactNumber={hostel.basicInfo.contactNumber}
                googleMapLink={hostel.locationInfo.googleMapLink}
              />
            </div>
          </div>
        </div>

        {/* Description */}
        {hostel.basicInfo.description && (
          <AboutSection description={hostel.basicInfo.description} />
        )}

        

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-2">

                        {/* Amenities */}
            {hostel.amenities.length > 0 && (
              <AmenitiesGrid 
                amenities={hostel.amenities.map(a => ({
                  name: a.name,
                  description: a.description,
                  available: a.available
                }))} 
              />
            )}

            
            {/* Available Rooms */}
            {hostel.roomTypes.length > 0 && (
              <RoomsSection 
                rooms={hostel.roomTypes.map(room => ({
                  _id: room._id.toString(),
                  name: room.name,
                  description: room.description,
                  rent: room.rent,
                  images: room.images.map(img => ({
                    url: img.url,
                    isCover: img.isCover
                  })),
                  components: room.components.map(c => ({
                    name: c.name,
                    description: c.description
                  }))
                }))} 
              />
            )}

            {/* Gallery Section */}
            {hostel.media.photos.length > 0 && (
              <GallerySection 
                photos={hostel.media.photos.map(photo => ({
                  url: photo.url,
                  title: photo.title,
                  description: photo.description,
                  type: photo.type,
                  isMain: photo.isMain
                }))} 
              />
            )}






            {/* Safety Features */}
            {hostel.safetyFeatures.length > 0 && (
              <SafetyGrid 
                safetyFeatures={hostel.safetyFeatures.map(s => ({
                  feature: s.feature,
                  details: s.details,
                  available: s.available
                }))} 
              />
            )}

                        {/* Property Details */}
            <Card className="rounded-xl border border-border hover:border-brand-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg font-bold">
                  <Building2 className="h-5 w-5 text-brand-primary" />
                  Property Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {hostel.propertyDetails.totalRooms && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-light">
                        <span className="font-bold">{hostel.propertyDetails.totalRooms}</span> Rooms
                      </span>
                    </div>
                  )}
                  {hostel.propertyDetails.totalFloors && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-light">
                        <span className="font-bold">{hostel.propertyDetails.totalFloors}</span> Floors
                      </span>
                    </div>
                  )}
                  {hostel.propertyDetails.buildingType && (
                    <div className="flex items-center gap-2">
                      <Home className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-light capitalize">{hostel.propertyDetails.buildingType}</span>
                    </div>
                  )}
                  {hostel.propertyDetails.establishedYear && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-light">Est. {hostel.propertyDetails.establishedYear}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Nearby Landmarks */}
            {hostel.locationInfo.nearbyLandmarks.length > 0 && (
              <Card className="rounded-xl border border-border hover:border-brand-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg font-bold">
                    <MapPin className="h-5 w-5 text-brand-primary" />
                    Nearby Landmarks
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {hostel.locationInfo.nearbyLandmarks.map((landmark, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b border-border pb-3 last:border-0 last:pb-0">
                        <div>
                          <p className="text-sm font-bold">{landmark.name}</p>
                          <p className="text-xs font-light capitalize text-muted-foreground">{landmark.type}</p>
                        </div>
                        <Badge variant="outline" className="text-xs font-bold font-mono">{landmark.distance}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information & Map */}
            <Card data-section="contact" className="rounded-xl border border-border hover:border-brand-primary/50 transition-colors">
              <CardHeader>
                <CardTitle className="text-lg font-bold">Contact & Location</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {hostel.basicInfo.address && (
                  <div className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-brand-primary" />
                    <div className="text-sm font-light">
                      <p className="font-bold">{hostel.basicInfo.address}</p>
                      {hostel.basicInfo.landmark && (
                        <p className="text-muted-foreground">Near {hostel.basicInfo.landmark}</p>
                      )}
                      {hostel.basicInfo.pincode && (
                        <p className="text-muted-foreground font-mono">PIN: {hostel.basicInfo.pincode}</p>
                      )}
                    </div>
                  </div>
                )}
                {hostel.basicInfo.contactNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-brand-primary" />
                    <a href={`tel:${hostel.basicInfo.contactNumber}`} className="text-sm font-light hover:text-brand-primary transition-colors">
                      {hostel.basicInfo.contactNumber}
                    </a>
                  </div>
                )}
                {hostel.basicInfo.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-brand-primary" />
                    <a href={`mailto:${hostel.basicInfo.email}`} className="text-sm font-light hover:text-brand-primary transition-colors">
                      {hostel.basicInfo.email}
                    </a>
                  </div>
                )}
                
                {/* Map Link Button */}
                {hostel.locationInfo.googleMapLink && (
                  <div className="pt-2">
                    <a
                      href={hostel.locationInfo.googleMapLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-2 rounded-lg border border-brand-primary bg-brand-primary px-4 py-2.5 text-sm font-bold text-brand-white transition-colors hover:bg-brand-primary/90"
                    >
                      <MapPin className="h-4 w-4" />
                      View on Google Maps
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transport Connectivity */}
            {hostel.locationInfo.transportConnectivity.length > 0 && (
              <Card className="rounded-xl border border-border hover:border-brand-primary/50 transition-colors">
                <CardHeader>
                  <CardTitle className="text-lg font-bold">Transport</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {hostel.locationInfo.transportConnectivity.map((transport, idx) => (
                    <div key={idx} className="border-b border-border pb-3 last:border-0 last:pb-0">
                      <div className="mb-1 flex items-center justify-between">
                        <p className="text-sm font-bold capitalize">{transport.mode}</p>
                        <Badge variant="outline" className="text-xs font-bold font-mono">{transport.distance}</Badge>
                      </div>
                      <p className="text-xs font-light text-muted-foreground">{transport.details}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Explore Links */}
        <ExploreLinks
          title="Explore Bhopal Accommodation"
          links={[
            { label: "Hostels in Bhopal", href: "/city/bhopal" },
            { label: "Boys Hostels in Bhopal", href: "/city/bhopal/boys-hostel" },
            { label: "Girls Hostels in Bhopal", href: "/city/bhopal/girls-hostel" },
            { label: "Affordable Hostels in Bhopal", href: "/city/bhopal/affordable" },
            { label: "Best Hostels in Bhopal", href: "/city/bhopal/best" },
          ]}
          className="mt-8"
        />
      </main>
      
      <Footer />
    </div>
  );
}
