import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RoomDetailView } from "@/components/room/room-detail-view";
import { SimilarRoomsSection } from "@/components/room/similar-rooms-section";
import { OtherHostelsSection } from "@/components/room/other-hostels-section";
import { ExploreLinks } from "@/components/shared/explore-links";
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
    <div className="min-h-screen bg-white selection:bg-[#3932d8] selection:text-white font-sans text-[#111827]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      <Header pageTitle={room.name} showBackButton={true} />

      <main className="overflow-hidden">

        {/* Minimal Breadcrumb Sub-Header */}
        <div className="bg-white border-b border-gray-100 py-3">
          <div className="mx-auto max-w-[1340px] px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 text-xs text-gray-500">
            <nav className="flex items-center gap-1.5" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-gray-900 transition-colors">Home</Link>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <Link href={`/hostel/${room.hostel.slug}`} className="hover:text-gray-900 transition-colors truncate max-w-[160px] sm:max-w-[240px]">
                {room.hostel.name}
              </Link>
              <ChevronRight className="h-3 w-3 text-gray-400" />
              <span className="font-semibold text-gray-900 truncate max-w-[160px] sm:max-w-[220px]">{room.name}</span>
            </nav>

            <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-0.5 text-[11px] font-semibold text-gray-700">
              <Sparkles className="h-3 w-3 text-amber-500" /> GetStay Verified
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════
            MAIN REDESIGNED VIEW MATCHING IMAGE
        ══════════════════════════════════════ */}
        <RoomDetailView room={room} />

        {/* ══════════════════════════════════════
            SIMILAR ROOMS SECTION
        ══════════════════════════════════════ */}
        <SimilarRoomsSection
          rooms={room.similarRooms || []}
          hostelName={room.hostel.name}
          city={room.hostel.city}
        />

        {/* ══════════════════════════════════════
            OTHER HOSTELS SECTION
        ══════════════════════════════════════ */}
        <OtherHostelsSection
          hostels={room.otherHostels || []}
          city={room.hostel.city}
        />

        {/* Explore Links */}
        <ExploreLinks
          title="Explore Accommodation"
          links={[
            { label: `${room.hostel.name}`, href: `/hostel/${room.hostel.slug}` },
            { label: `Hostels in ${room.hostel.city || 'Bhopal'}`, href: `/city/${room.hostel.city ? room.hostel.city.toLowerCase().replace(/\s+/g, '-') : 'bhopal'}` },
            { label: `Boys Hostels in ${room.hostel.city || 'Bhopal'}`, href: `/city/${room.hostel.city ? room.hostel.city.toLowerCase().replace(/\s+/g, '-') : 'bhopal'}/boys-hostel` },
            { label: `Girls Hostels in ${room.hostel.city || 'Bhopal'}`, href: `/city/${room.hostel.city ? room.hostel.city.toLowerCase().replace(/\s+/g, '-') : 'bhopal'}/girls-hostel` },
          ]}
          className="mt-4"
        />
      </main>

      <Footer />
    </div>
  );
}
