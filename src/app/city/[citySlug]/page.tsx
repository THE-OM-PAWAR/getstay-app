import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MapPin, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { WhyChooseCity } from "@/components/city/why-choose-city";
import { CityFAQSection } from "@/components/city/city-faq-section";
import { AreaSection } from "@/components/city/area-section";
import { ExploreLinks } from "@/components/shared/explore-links";
import { BhopalExploreLinks } from "@/components/city/bhopal-explore-links";
import { ExploreContent } from "@/app/explore/explore-content";
import { getCityBySlug, getHostelsByCity, getCitiesWithHostels } from "@/services/city.service";
import { getExploreResults, ExploreParams } from "@/services/explore.service";
import { getCityFAQs } from "@/lib/constants/city-faqs";

interface CityPageProps {
  params: Promise<{
    citySlug: string;
  }>;
}

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

export async function generateStaticParams() {
  const cities = await getCitiesWithHostels();
  
  return cities.map((city) => ({
    citySlug: city.slug,
  }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const { citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    return {
      title: "City Not Found",
    };
  }

  const isBhopal = city.name.toLowerCase() === 'bhopal';
  const title = isBhopal 
    ? `Best Hostels in Bhopal, MP - ${city.hostelCount}+ Boys & Girls PG | GetStay`
    : `Hostels in ${city.name}, ${city.state} - ${city.hostelCount}+ Options | GetStay`;
  
  const description = isBhopal
    ? `Discover the best hostels and PG accommodations in Bhopal, Madhya Pradesh. ${city.hostelCount}+ verified hostels including ${city.boysHostelCount} boys hostels and ${city.girlsHostelCount} girls hostels. Modern amenities, WiFi, food, safe environment. Book affordable student and working professional accommodation in Bhopal with GetStay.`
    : `Find the best hostels in ${city.name}, ${city.state}. ${city.hostelCount}+ verified hostels with ${city.boysHostelCount} boys hostels and ${city.girlsHostelCount} girls hostels. Book affordable PG accommodation on GetStay.`;

  return {
    title,
    description,
    authors: [{ name: "GetStay" }],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://getstay.in/city/${citySlug}`,
      siteName: 'GetStay',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: "@GetStay",
    },
    alternates: {
      canonical: `https://getstay.in/city/${citySlug}`,
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

export default async function CityPage({ params }: CityPageProps) {
  const { citySlug } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const hostels = await getHostelsByCity(citySlug, undefined, 50);
  const faqs = getCityFAQs(city.name);
  const isBhopal = city.name.toLowerCase() === 'bhopal';

  // Initial params and results for the Explore Experience
  const exploreParams: ExploreParams = { city: city.name };
  const initialExploreData = await getExploreResults(exploreParams);

  // Group hostels by area for Bhopal
  const areaHostels = isBhopal ? {
    'MP Nagar': hostels.filter(h => h.name.toLowerCase().includes('mp nagar') || h.description?.toLowerCase().includes('mp nagar')),
    'Near MANIT': hostels.filter(h => h.name.toLowerCase().includes('manit') || h.description?.toLowerCase().includes('manit')),
    'Kolar Road': hostels.filter(h => h.name.toLowerCase().includes('kolar') || h.description?.toLowerCase().includes('kolar')),
    'Near Railway Station': hostels.filter(h => h.name.toLowerCase().includes('railway') || h.description?.toLowerCase().includes('railway station')),
    'Near LNCT': hostels.filter(h => h.name.toLowerCase().includes('lnct') || h.description?.toLowerCase().includes('lnct')),
  } : {
    'MP Nagar': [],
    'Near MANIT': [],
    'Kolar Road': [],
    'Near Railway Station': [],
    'Near LNCT': [],
  };

  // JSON-LD Structured Data
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `Hostels in ${city.name}, ${city.state}`,
    description: `List of hostels and PG accommodations in ${city.name}`,
    numberOfItems: hostels.length,
    itemListElement: hostels.slice(0, 10).map((hostel, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'LodgingBusiness',
        name: hostel.name,
        url: `https://getstay.in/hostel/${hostel.slug}`,
        address: {
          '@type': 'PostalAddress',
          addressLocality: hostel.city,
          addressRegion: hostel.state,
          addressCountry: 'IN',
        },
      },
    })),
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
        name: `${city.name} Hostels`,
        item: `https://getstay.in/city/${citySlug}`,
      },
    ],
  };

  // FAQ Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <Header pageTitle={`${city.name} Hostels`} showBackButton={true} />
      
      <main className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 flex-1">
        {/* Hero Section */}
        <div className="mb-4">
          <h1 className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
            Hostels in <span className="text-brand-primary">{city.name}</span>
          </h1>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs md:text-sm font-medium text-gray-500">
            <span className="inline-flex items-center gap-1 text-gray-700 dark:text-zinc-300 font-semibold">
              <MapPin className="h-4 w-4 text-brand-primary shrink-0" />
              {city.state}, India
            </span>
            <span className="text-gray-300 select-none">•</span>
            <span>{city.hostelCount}+ verified hostels</span>
            <span className="text-gray-300 select-none">•</span>
            <span>{city.boysHostelCount} boys hostels</span>
            <span className="text-gray-300 select-none">•</span>
            <span>{city.girlsHostelCount} girls hostels</span>
          </div>
        </div>

        {/* Compact Internal-Link Section */}
        <BhopalExploreLinks cityName={city.name} citySlug={citySlug} isBhopal={isBhopal} />

        {/* Explore Experience */}
        <div className="mb-12">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              </div>
            }
          >
            <ExploreContent initialData={initialExploreData} initialParams={exploreParams} />
          </Suspense>
        </div>

        {/* Why Choose City Section */}
        <WhyChooseCity cityName={city.name} />

        {/* Area-Based Sections for Bhopal */}
        {isBhopal && (
          <div className="mb-8 mt-12">
            <h2 className="mb-6 text-2xl font-bold sm:text-3xl">
              Hostels by <span className="text-brand-primary">Area</span> in Bhopal
            </h2>
            
            {areaHostels['MP Nagar'].length > 0 && (
              <AreaSection
                areaName="MP Nagar"
                description="MP Nagar is the commercial and business hub of Bhopal, offering excellent connectivity, shopping centers, restaurants, and entertainment options. Ideal for working professionals and students who prefer a vibrant urban lifestyle."
                hostels={areaHostels['MP Nagar']}
                citySlug={citySlug}
              />
            )}

            {areaHostels['Near MANIT'].length > 0 && (
              <AreaSection
                areaName="Near MANIT"
                description="Perfect for MANIT (Maulana Azad National Institute of Technology) students, these hostels offer easy access to the campus with good connectivity to other parts of the city. The area has essential facilities like shops, medical stores, and eateries."
                hostels={areaHostels['Near MANIT']}
                citySlug={citySlug}
              />
            )}

            {areaHostels['Kolar Road'].length > 0 && (
              <AreaSection
                areaName="Kolar Road"
                description="Kolar Road is known for affordable hostel options with good transport connectivity. The area has a mix of residential and commercial establishments, making it convenient for daily needs. Popular among students and budget-conscious individuals."
                hostels={areaHostels['Kolar Road']}
                citySlug={citySlug}
              />
            )}

            {areaHostels['Near Railway Station'].length > 0 && (
              <AreaSection
                areaName="Near Railway Station"
                description="Hostels near Bhopal Railway Station offer excellent connectivity for students and professionals who travel frequently. The area is well-connected to all parts of the city via local transport and has good availability of essential services."
                hostels={areaHostels['Near Railway Station']}
                citySlug={citySlug}
              />
            )}

            {areaHostels['Near LNCT'].length > 0 && (
              <AreaSection
                areaName="Near LNCT"
                description="Located near LNCT (Lakshmi Narain College of Technology), these hostels are popular among engineering students. The area offers a peaceful environment conducive to studies with easy access to the college campus and basic amenities."
                hostels={areaHostels['Near LNCT']}
                citySlug={citySlug}
              />
            )}
          </div>
        )}

        {/* FAQ Section */}
        <CityFAQSection cityName={city.name} faqs={faqs} />

        {/* SEO Context */}
        <Card className="rounded-xl border border-border mt-8">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              About Hostels in <span className="text-brand-primary">{city.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="prose prose-sm max-w-none">
            <p className="text-sm font-light leading-relaxed text-muted-foreground mb-3">
              Looking for quality hostel accommodation in {city.name}, {city.state}? GetStay offers {city.hostelCount}+ verified hostels 
              and PG options to choose from. Whether you&apos;re a student, working professional, or someone looking for affordable 
              accommodation, we have the perfect place for you.
            </p>
            <p className="text-sm font-light leading-relaxed text-muted-foreground">
              Our listings include {city.boysHostelCount} boys hostels and {city.girlsHostelCount} girls hostels, all verified 
              and equipped with modern amenities like WiFi, food, security, and more. Find hostels near your college, workplace, 
              or preferred location in {city.name}. Book with confidence on GetStay - your trusted hostel booking platform.
            </p>
          </CardContent>
        </Card>

        {/* Explore Links */}
        <ExploreLinks
          title={`Explore ${city.name}`}
          links={[
            { label: `Hostels in ${city.name}`, href: `/city/${citySlug}` },
            { label: `Boys Hostels in ${city.name}`, href: `/city/${citySlug}/boys-hostel` },
            { label: `Girls Hostels in ${city.name}`, href: `/city/${citySlug}/girls-hostel` },
            { label: `Affordable Hostels in ${city.name}`, href: `/city/${citySlug}/affordable` },
            { label: `Best Hostels in ${city.name}`, href: `/city/${citySlug}/best` },
          ]}
          className="mt-8"
        />
      </main>
      
      <Footer />
    </div>
  );
}
