import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/landing-page/hero-section";
import { FeaturedHostels } from "@/components/landing-page/featured-hostels";
import { RecommendedSection } from "@/components/landing-page/recommended-section";
import { RoomsSection } from "@/components/landing-page/rooms-section";
import { CtaPartner } from "@/components/landing-page/cta-partner";
import { ExploreLinks } from "@/components/shared/explore-links";
import { getHostels } from "@/services/hostel.service";
import { getRoomsForLanding } from "@/services/room-landing.service";

export const metadata: Metadata = {
  title: "GetStay | Student Accommodation, Hostels & PGs in Bhopal",
  description:
    "Discover and compare verified student accommodation, hostels, and PGs in Bhopal. Modern amenities, transparent pricing, safe environment starting at ₹3,999/month.",
  authors: [{ name: "GetStay" }],
  openGraph: {
    title: "GetStay | Student Accommodation, Hostels & PGs in Bhopal",
    description:
      "Discover and compare verified student accommodation, hostels, and PGs in Bhopal. Modern amenities, transparent pricing, safe environment starting at ₹3,999/month.",
    images: [
      {
        url: "https://getstay.in/banners/BANNER1.png",
        width: 1200,
        height: 630,
        alt: "GetStay - Student Accommodation, Hostels & PGs in Bhopal",
      },
    ],
    type: "website",
    url: "https://getstay.in",
    siteName: "GetStay",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetStay | Student Accommodation, Hostels & PGs in Bhopal",
    description:
      "Discover and compare verified student accommodation, hostels, and PGs in Bhopal. Book safe student stays online.",
    images: ["https://getstay.in/banners/BANNER1.png"],
    site: "@GetStay",
  },
  alternates: {
    canonical: "https://getstay.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default async function Home() {
  const hostels = await getHostels();
  const rooms = await getRoomsForLanding("all", 8);

  const exploreLinks = [
    { label: "Hostels in Bhopal", href: "/city/bhopal" },
    { label: "Boys Hostels in Bhopal", href: "/city/bhopal/boys-hostel" },
    { label: "Girls Hostels in Bhopal", href: "/city/bhopal/girls-hostel" },
    { label: "Affordable Hostels in Bhopal", href: "/city/bhopal/affordable" },
    { label: "Best Hostels in Bhopal", href: "/city/bhopal/best" },
  ];

  // JSON-LD structured data for WebSite entity
  const websiteStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "GetStay",
    url: "https://getstay.in",
    description:
      "Student accommodation discovery platform helping students find verified hostels, PGs, and rooms in Bhopal and across India",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://getstay.in/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  // JSON-LD structured data for Organization entity
  const organizationStructuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "GetStay",
    url: "https://getstay.in",
    logo: "https://getstay.in/banners/BANNER1.png",
    description:
      "GetStay is a student accommodation discovery platform operating in Bhopal, Madhya Pradesh, India.",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Bhopal",
    },
  };

  return (
    <div className="min-h-screen bg-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteStructuredData) }}
        id="website-structured-data"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationStructuredData) }}
        id="organization-structured-data"
      />

      <Header />
      <HeroSection />
      <RecommendedSection hostels={hostels.slice(0, 12)} />
      <FeaturedHostels hostels={hostels.slice(0, 9)} />
      <RoomsSection initialRooms={rooms} />
      <CtaPartner />
      <ExploreLinks title="Explore Bhopal Stays" links={exploreLinks} />
      <Footer />
    </div>
  );
}
