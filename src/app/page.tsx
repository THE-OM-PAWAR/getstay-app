import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PromoBanner } from "@/components/landing-page/promo-banner";
import { HostelsSection } from "@/components/landing-page/hostels-section";
import { RoomsSection } from "@/components/landing-page/rooms-section";
import { WhyChooseSection } from "@/components/landing-page/why-choose-section";
import { CitiesSection } from "@/components/landing-page/cities-section";
import { LocationSection } from "@/components/landing-page/location-section";
import { PopularLinksSection } from "@/components/shared/popular-links-section";
import { getHostels } from "@/services/hostel.service";
import { getRoomsForLanding } from "@/services/room-landing.service";
import { getCitiesWithHostels } from "@/services/city.service";

export const metadata: Metadata = {
  title: "GetStay - Best Hostels & PG in Bhopal | Boys, Girls & Co-ed Accommodation from ₹3,999/month",
  description: "Find verified hostels and PG accommodations in Bhopal with GetStay. 100+ options with WiFi, food, AC, laundry, 24/7 security. Boys hostel, girls hostel, working professionals. Near AIIMS, MANIT, Barkatullah University. Book now and get 20% off with code GETSTAY20!",
  keywords: [
    // High-intent transactional keywords
    "book hostel Bhopal", "hostel booking Bhopal online", "PG booking Bhopal", "reserve hostel Bhopal",
    "hostel near me Bhopal", "find hostel Bhopal", "search PG Bhopal", "hostel availability Bhopal",
    
    // Location + Type combinations
    "hostels in Bhopal", "PG in Bhopal", "paying guest Bhopal", "hostel accommodation Bhopal",
    "boys hostel Bhopal", "girls hostel Bhopal", "ladies hostel Bhopal", "gents hostel Bhopal",
    "male hostel Bhopal", "female hostel Bhopal", "women hostel Bhopal", "men hostel Bhopal",
    
    // Area-specific keywords
    "hostels in Kolar Bhopal", "hostels in Arera Colony Bhopal", "hostels in MP Nagar Bhopal",
    "hostels in New Market Bhopal", "hostels near AIIMS Bhopal", "hostels near MANIT Bhopal",
    "hostels near Barkatullah University Bhopal", "hostels near BHEL Bhopal", "hostels in Hoshangabad Road",
    
    // Quality + Location keywords
    "best hostel Bhopal", "top hostels Bhopal", "verified hostels Bhopal", "safe hostel Bhopal",
    "clean hostel Bhopal", "hygienic hostel Bhopal", "modern hostel Bhopal", "luxury hostel Bhopal",
    
    // Price-based long-tail keywords
    "cheap hostel Bhopal", "affordable hostel Bhopal", "budget hostel Bhopal", "low cost hostel Bhopal",
    "hostel under 5000 Bhopal", "hostel under 4000 Bhopal", "hostel under 3000 Bhopal",
    "economical PG Bhopal", "best price hostel Bhopal", "hostel starting 3999 Bhopal",
    
    // Amenity-focused keywords
    "hostel with WiFi Bhopal", "hostel with food Bhopal", "hostel with mess Bhopal", "AC hostel Bhopal",
    "furnished hostel Bhopal", "hostel with laundry Bhopal", "hostel with parking Bhopal",
    "hostel with gym Bhopal", "hostel with TV Bhopal", "hostel with fridge Bhopal",
    "24/7 security hostel Bhopal", "CCTV hostel Bhopal", "power backup hostel Bhopal",
    
    // Room configuration keywords
    "single room hostel Bhopal", "double sharing hostel Bhopal", "triple sharing hostel Bhopal",
    "private room hostel Bhopal", "shared room hostel Bhopal", "dormitory Bhopal",
    "1 seater hostel Bhopal", "2 seater hostel Bhopal", "3 seater hostel Bhopal",
    
    // Target audience keywords
    "student hostel Bhopal", "college student hostel Bhopal", "working professional hostel Bhopal",
    "bachelor accommodation Bhopal", "office goers hostel Bhopal", "IT professional hostel Bhopal",
    "medical student hostel Bhopal", "engineering student hostel Bhopal",
    
    // Service-related keywords
    "hostel booking online Bhopal", "PG booking online Bhopal", "hostel reservation Bhopal",
    "hostel booking app", "PG finder Bhopal", "hostel search engine", "compare hostels Bhopal",
    
    // Problem-solving keywords
    "hostel for rent Bhopal", "PG for rent Bhopal", "room for rent Bhopal", "accommodation Bhopal",
    "where to stay in Bhopal", "student accommodation Bhopal", "temporary stay Bhopal",
    
    // Brand + Service keywords
    "GetStay", "GetStay Bhopal", "GetStay hostel booking", "GetStay PG", "GetStay app",
    "GetStay discount", "GetStay offers", "GetStay20 code",
    
    // Comparison keywords
    "best PG in Bhopal", "top PG in Bhopal", "hostel vs PG Bhopal", "hostel comparison Bhopal",
    
    // Long-tail conversational keywords
    "which is the best hostel in Bhopal", "how to find hostel in Bhopal", "hostel for boys near me",
    "hostel for girls near me", "safe hostel for girls in Bhopal", "affordable hostel for students"
  ],
  authors: [{ name: "GetStay" }],
  openGraph: {
    title: "GetStay - Best Hostels in Bhopal | Boys & Girls PG Accommodation",
    description: "Find the best hostels and PG accommodations in Bhopal. Modern amenities, safe environment, affordable prices. Book now and get 20% off!",
    images: [{ url: "/banners/BANNER1.png", width: 1200, height: 630, alt: "GetStay - Hostel Booking in Bhopal" }],
    type: "website",
    url: "https://getstay.in",
    siteName: "GetStay",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "GetStay - Best Hostels in Bhopal",
    description: "Find the best hostels and PG accommodations in Bhopal. Book now and get 20% off!",
    images: ["/banners/BANNER1.png"],
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
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: "your-google-verification-code", // Add your Google Search Console verification code
  },
};

export default async function Home() {
  const hostels = await getHostels();
  const rooms = await getRoomsForLanding('all', 8);
  const cities = await getCitiesWithHostels();

  // JSON-LD structured data for homepage
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'GetStay',
    url: 'https://getstay.in',
    description: 'Find the best hostels and PG accommodations in Bhopal and across India',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://getstay.in/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GetStay',
    url: 'https://getstay.in',
    logo: 'https://getstay.in/logo.png',
    description: 'Leading hostel and PG accommodation booking platform in Bhopal',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Bhopal',
      addressRegion: 'Madhya Pradesh',
      addressCountry: 'IN',
    },
    sameAs: [
      'https://facebook.com/getstay',
      'https://twitter.com/getstay',
      'https://instagram.com/getstay',
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />

      <Header />
      <PromoBanner />
      <HostelsSection hostels={hostels} />
      <RoomsSection initialRooms={rooms} />
      <CitiesSection cities={cities} />
      <WhyChooseSection />
      <LocationSection />
      
      {/* Popular Links Section */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PopularLinksSection />
      </div>
      
      <Footer />
    </div>
  );
}
