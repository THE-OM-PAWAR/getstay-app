import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, IndianRupee, Building2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DescriptionCard } from "@/components/shared/description-card";
import { RoomActionButtons } from "@/components/room/room-action-buttons";
import { RoomComponentsGrid } from "@/components/room/room-components-grid";
import { RelatedLinksSection } from "@/components/city/related-links-section";
import { getRoomById, getAllRoomIds } from "@/services/room-detail.service";

interface RoomPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateStaticParams() {
  const roomIds = await getAllRoomIds();

  return roomIds.map((id) => ({
    id,
  }));
}

export async function generateMetadata({ params }: RoomPageProps): Promise<Metadata> {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) {
    return {
      title: "Room Not Found",
    };
  }

  const coverImage = room.images.find(img => img.isCover)?.url || room.images[0]?.url;
  const location = room.hostel.city && room.hostel.state
    ? `${room.hostel.city}, ${room.hostel.state}`
    : room.hostel.city || room.hostel.state || '';

  const title = `${room.name} at ${room.hostel.name} - ₹${room.rent.toLocaleString('en-IN')}/month | GetStay`;
  const description = `${room.description.slice(0, 150)}... Book this room at ${room.hostel.name} in ${location}. Monthly rent: ₹${room.rent.toLocaleString('en-IN')}. Includes: ${room.components.slice(0, 3).map(c => c.name).join(', ')}.`;

  return {
    title,
    description,
    keywords: [
      room.name,
      room.hostel.name,
      `room in ${room.hostel.city}`,
      'hostel room',
      'pg room',
      'accommodation',
      ...room.components.slice(0, 5).map(c => c.name.toLowerCase()),
    ].filter(Boolean).join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://getstay.in/room/${id}`,
      siteName: 'GetStay',
      locale: 'en_IN',
      images: coverImage ? [
        {
          url: coverImage,
          width: 1200,
          height: 630,
          alt: `${room.name} at ${room.hostel.name}`,
        }
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: coverImage ? [coverImage] : [],
    },
    alternates: {
      canonical: `https://getstay.in/room/${id}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function RoomPage({ params }: RoomPageProps) {
  const { id } = await params;
  const room = await getRoomById(id);

  if (!room) {
    notFound();
  }

  const coverImage = room.images.find(img => img.isCover);
  const otherImages = room.images.filter(img => !img.isCover);
  const location = room.hostel.city && room.hostel.state
    ? `${room.hostel.city}, ${room.hostel.state}`
    : room.hostel.city || room.hostel.state || '';

  // JSON-LD Structured Data
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
        name: room.hostel.name,
        item: `https://getstay.in/hostel/${room.hostel.slug}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: room.name,
        item: `https://getstay.in/room/${id}`,
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

      <Header pageTitle={room.name} showBackButton={false} />

      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Hero Section with Room Info */}
        <div className="mb-6 overflow-hidden rounded-xl border border-border hover:border-brand-primary/50 transition-colors">
          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:gap-6 lg:p-6">
            {/* Room Cover Image */}
            {coverImage && (
              <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-lg border border-border sm:w-40 lg:w-56">
                <Image
                  src={coverImage.url}
                  alt={coverImage.title}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            )}

            {/* Room Info */}
            <div className="flex-1 min-w-0">
              <h1 className="mb-2 text-2xl font-light sm:text-3xl lg:text-4xl">
                {room.name}
              </h1>

              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Link
                  href={`/hostel/${room.hostel.slug}`}
                  className="flex items-center gap-1.5 text-sm font-light text-muted-foreground hover:text-brand-primary transition-colors"
                >
                  <Building2 className="h-4 w-4" />
                  <span>{room.hostel.name}</span>
                </Link>
                {location && (
                  <>
                    <span className="text-muted-foreground">•</span>
                    <div className="flex items-center gap-1.5 text-sm font-light text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{location}</span>
                    </div>
                  </>
                )}
              </div>

              {/* Price Badge */}
              <div className="inline-flex items-baseline gap-2 rounded-lg border border-brand-primary bg-brand-primary/5 px-3 py-1.5 mb-2">
                <IndianRupee className="h-4 w-4 text-brand-primary" />
                <span className="text-xl font-bold text-brand-primary">
                  {room.rent.toLocaleString('en-IN')}
                </span>
                <span className="text-xs font-light text-muted-foreground">/month</span>
              </div>

              {/* Action Buttons */}
              <RoomActionButtons
                roomName={room.name}
                hostelName={room.hostel.name}
                hostelSlug={room.hostel.slug}
              />
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        {otherImages.length > 0 && (
          <div className="mb-6 grid gap-2 sm:grid-cols-4">
            {otherImages.slice(0, 4).map((image, idx) => (
              <div key={idx} className="relative h-40 overflow-hidden rounded-lg border border-border hover:border-brand-primary/50 transition-colors">
                <Image
                  src={image.url}
                  alt={image.title}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          {/* Main Content */}
          <div className="space-y-4 lg:col-span-2">
            {/* Description */}
            <DescriptionCard description={room.description} />

            {/* Components/Amenities */}
            {room.components.length > 0 && (
              <RoomComponentsGrid components={room.components} />
            )}

            {/* Hostel Information */}
            {room.hostel.amenities && room.hostel.amenities.length > 0 && (
              <Card className="rounded-xl border border-border hover:border-brand-primary/50 transition-colors overflow-hidden">
                {/* Hostel Banner */}
                {room.hostel.banner && (
                  <div className="relative h-32 w-full overflow-hidden border-b border-border">
                    <Image
                      src={room.hostel.banner.url}
                      alt={`${room.hostel.name} - Banner`}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <h3 className="text-base font-bold text-white sm:text-lg">
                        {room.hostel.name}
                      </h3>
                    </div>
                  </div>
                )}

                <CardHeader className="p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-base font-bold sm:text-lg mb-1">
                        Hostel <span className="text-brand-primary">Amenities</span>
                      </CardTitle>
                      <p className="text-xs font-light text-muted-foreground">
                        Available facilities at this hostel
                      </p>
                    </div>
                    <Link href={`/hostel/${room.hostel.slug}`}>
                      <Button variant="outline" size="sm" className="border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-white font-bold text-xs">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
                  <div className="flex flex-wrap gap-2">
                    {room.hostel.amenities.filter(a => a.available).slice(0, 8).map((amenity, idx) => (
                      <div
                        key={idx}
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-gradient-to-r from-background to-muted/30 px-3 py-1.5 transition-all hover:border-brand-primary/50"
                        title={amenity.description}
                      >
                        <div className="h-1.5 w-1.5 rounded-full bg-brand-primary" />
                        <span className="whitespace-nowrap text-xs font-bold text-foreground">
                          {amenity.name}
                        </span>
                      </div>
                    ))}
                    {room.hostel.amenities.filter(a => a.available).length > 8 && (
                      <Link href={`/hostel/${room.hostel.slug}`}>
                        <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-primary bg-brand-primary/5 px-3 py-1.5 transition-all hover:bg-brand-primary/10">
                          <span className="whitespace-nowrap text-xs font-bold text-brand-primary">
                            +{room.hostel.amenities.filter(a => a.available).length - 8} more
                          </span>
                        </div>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Booking Card */}
            <Card className="rounded-xl border border-border hover:border-brand-primary/50 transition-colors">
              <CardHeader className="p-4">
                <CardTitle className="text-base font-bold sm:text-lg">Book This Room</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <div className="rounded-lg border border-brand-primary/20 bg-brand-primary/5 p-3">
                  <div className="mb-1 flex items-baseline gap-2">
                    <IndianRupee className="h-4 w-4 text-brand-primary" />
                    <span className="text-2xl font-bold text-brand-primary">
                      {room.rent.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs font-light text-muted-foreground">/month</span>
                  </div>
                  <p className="text-xs font-light text-muted-foreground">Inclusive of all taxes</p>
                </div>
                <Button className="w-full bg-brand-primary text-brand-white hover:bg-brand-primary/90 font-bold" size="lg">
                  Book Now
                </Button>
                <Button variant="outline" className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-white font-bold" size="lg">
                  Schedule Visit
                </Button>
              </CardContent>
            </Card>

            {/* Hostel Contact */}
            <Card className="rounded-xl border border-border hover:border-brand-primary/50 transition-colors" data-section="contact">
              <CardHeader className="p-4">
                <CardTitle className="text-base font-bold sm:text-lg">Contact Hostel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 p-4 pt-0">
                <div>
                  <p className="mb-1 font-bold text-sm">{room.hostel.name}</p>
                  {room.hostel.address && (
                    <p className="text-xs font-light text-muted-foreground">{room.hostel.address}</p>
                  )}
                </div>
                {room.hostel.contactNumber && (
                  <div className="flex items-center gap-2">
                    <Phone className="h-3.5 w-3.5 text-brand-primary" />
                    <a href={`tel:${room.hostel.contactNumber}`} className="text-xs font-light hover:text-brand-primary transition-colors">
                      {room.hostel.contactNumber}
                    </a>
                  </div>
                )}
                {room.hostel.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-3.5 w-3.5 text-brand-primary" />
                    <a href={`mailto:${room.hostel.email}`} className="text-xs font-light hover:text-brand-primary transition-colors">
                      {room.hostel.email}
                    </a>
                  </div>
                )}
                <Link href={`/hostel/${room.hostel.slug}`}>
                  <Button variant="outline" className="w-full border-brand-primary text-brand-primary hover:bg-brand-primary hover:text-brand-white font-bold text-sm">
                    View Hostel Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Recommendations Section */}
        {((room.similarRooms && room.similarRooms.length > 0) || (room.otherHostels && room.otherHostels.length > 0)) && (
          <div className="mt-8 space-y-6">
            {/* Similar Rooms */}
            {room.similarRooms && room.similarRooms.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                  Similar <span className="text-brand-primary">Rooms</span>
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {room.similarRooms.map((similarRoom) => (
                    <Link key={similarRoom._id} href={`/room/${similarRoom._id}`}>
                      <Card className="group overflow-hidden rounded-xl border border-border hover:border-brand-primary/50 transition-all">
                        <div className="relative h-40 w-full overflow-hidden bg-muted">
                          {similarRoom.coverImage ? (
                            <Image
                              src={similarRoom.coverImage}
                              alt={similarRoom.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Building2 className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="mb-2 text-sm font-bold line-clamp-1">{similarRoom.name}</h3>
                          <div className="flex items-baseline gap-1">
                            <IndianRupee className="h-3 w-3 text-brand-primary" />
                            <span className="text-base font-bold text-brand-primary">
                              {similarRoom.rent.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs font-light text-muted-foreground">/mo</span>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Other Hostels */}
            {room.otherHostels && room.otherHostels.length > 0 && (
              <div>
                <h2 className="mb-4 text-xl font-bold sm:text-2xl">
                  Other <span className="text-brand-primary">Hostels</span> in {room.hostel.city}
                </h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {room.otherHostels.map((hostel) => (
                    <Link key={hostel._id} href={`/hostel/${hostel.slug}`}>
                      <Card className="group overflow-hidden rounded-xl border border-border hover:border-brand-primary/50 transition-all">
                        <div className="relative h-40 w-full overflow-hidden bg-muted">
                          {hostel.coverImage ? (
                            <Image
                              src={hostel.coverImage}
                              alt={hostel.name}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Building2 className="h-12 w-12 text-muted-foreground/30" />
                            </div>
                          )}
                        </div>
                        <CardContent className="p-3">
                          <h3 className="mb-1 text-sm font-bold line-clamp-1">{hostel.name}</h3>
                          <p className="text-xs font-light text-muted-foreground">{hostel.city}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}


      </main>

      <Footer />
    </div>
  );
}
