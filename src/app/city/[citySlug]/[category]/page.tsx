import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { MapPin, UserCheck, Tag, Star, ShieldCheck, Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ExploreLinks } from "@/components/shared/explore-links";
import { ExploreContent } from "@/app/explore/explore-content";
import { 
  getCityBySlug, 
  getHostelsByCity, 
  getCityCategoryPaths,
  CategoryType 
} from "@/services/city.service";
import { getExploreResults, ExploreParams } from "@/services/explore.service";

interface CategoryPageProps {
  params: Promise<{
    citySlug: string;
    category: CategoryType;
  }>;
}

// ISR: Revalidate every 24 hours
export const revalidate = 86400;

const categoryInfo: Record<
  CategoryType,
  { title: string; description: string; icon: React.ElementType; color: string }
> = {
  "girls-hostel": {
    title: "Girls Hostels",
    description: "Safe and secure hostels exclusively for girls with modern amenities and 24/7 security",
    icon: ShieldCheck,
    color: "text-purple-600 bg-purple-50 border-purple-100",
  },
  "boys-hostel": {
    title: "Boys Hostels",
    description: "Comfortable and affordable hostels for boys with study facilities and high-speed WiFi",
    icon: UserCheck,
    color: "text-indigo-600 bg-indigo-50 border-indigo-100",
  },
  affordable: {
    title: "Affordable Hostels",
    description: "Budget-friendly hostels and PGs offering great value starting from ₹3,999/month",
    icon: Tag,
    color: "text-emerald-600 bg-emerald-50 border-emerald-100",
  },
  best: {
    title: "Best Hostels",
    description: "Top-rated student accommodation with premium amenities and verified reviews",
    icon: Star,
    color: "text-amber-600 bg-amber-50 border-amber-100",
  },
};

export async function generateStaticParams() {
  const paths = await getCityCategoryPaths();
  
  return paths.map((path) => ({
    citySlug: path.citySlug,
    category: path.category,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { citySlug, category } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    return {
      title: "City Not Found",
    };
  }

  const info = categoryInfo[category];
  const categoryTitle = info.title;
  
  const title = `${categoryTitle} in ${city.name}, ${city.state} | GetStay`;
  const description = `Find the best ${categoryTitle.toLowerCase()} in ${city.name}, ${city.state}. ${info.description}. Book verified student accommodation on GetStay.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `https://getstay.in/city/${citySlug}/${category}`,
      siteName: "GetStay",
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    alternates: {
      canonical: `https://getstay.in/city/${citySlug}/${category}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { citySlug, category } = await params;
  const city = await getCityBySlug(citySlug);

  if (!city) {
    notFound();
  }

  const hostels = await getHostelsByCity(citySlug, category, 50);

  if (hostels.length === 0) {
    notFound();
  }

  const info = categoryInfo[category];
  const IconComponent = info.icon;

  // Map category to explore params
  const categoryParamsMap: Record<CategoryType, ExploreParams> = {
    "girls-hostel": { city: city.name, accommodationType: "girls" },
    "boys-hostel": { city: city.name, accommodationType: "boys" },
    "affordable": { city: city.name, sortBy: "price-low" },
    "best": { city: city.name, sortBy: "newest" },
  };

  const exploreParams = categoryParamsMap[category] || { city: city.name };
  const initialExploreData = await getExploreResults(exploreParams);

  // JSON-LD Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${info.title} in ${city.name}, ${city.state}`,
    description: info.description,
    numberOfItems: hostels.length,
    itemListElement: hostels.slice(0, 10).map((hostel, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "LodgingBusiness",
        name: hostel.name,
        url: `https://getstay.in/hostel/${hostel.slug}`,
        address: {
          "@type": "PostalAddress",
          addressLocality: hostel.city,
          addressRegion: hostel.state,
          addressCountry: "IN",
        },
      },
    })),
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://getstay.in",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: `${city.name} Hostels`,
        item: `https://getstay.in/city/${citySlug}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: info.title,
        item: `https://getstay.in/city/${citySlug}/${category}`,
      },
    ],
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

      <Header pageTitle={`${city.name} - ${info.title}`} showBackButton={true} />
      
      <main className="mx-auto max-w-7xl w-full px-4 py-8 sm:px-6 lg:px-8 flex-1">
        <Breadcrumbs
          items={[
            { label: `${city.name} Hostels`, href: `/city/${citySlug}` },
            { label: info.title },
          ]}
        />

        {/* Sleek Hero Header */}
        <div className="mb-8 p-6 md:p-8 rounded-2xl bg-gray-50/80 border border-gray-100 shadow-xs">
          <div className="flex items-start gap-4">
            <div className={`p-3.5 rounded-2xl border ${info.color} shrink-0`}>
              <IconComponent className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-brand-dark sm:text-4xl tracking-tight">
                {info.title} in <span className="text-brand-primary">{city.name}</span>
              </h1>
              <div className="mt-2 flex items-center gap-2 text-muted-foreground font-medium text-sm">
                <MapPin className="h-4 w-4 text-brand-primary" />
                <span>{city.state}, India</span>
              </div>
              <p className="mt-3 text-sm md:text-base text-gray-600 max-w-3xl leading-relaxed">
                {info.description}
              </p>
            </div>
          </div>
        </div>

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

        {/* Professional SEO Context Card */}
        <Card className="rounded-2xl border border-gray-100 shadow-xs mb-8">
          <CardHeader>
            <CardTitle className="text-lg font-bold text-brand-dark">
              About {info.title} in {city.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 leading-relaxed space-y-3">
            <p>
              Discover top-rated {info.title.toLowerCase()} in {city.name}, {city.state}. We have curated verified listings 
              {category === "girls-hostel" && " featuring round-the-clock security, female wardens, CCTV surveillance, and hygienic mess facilities"}
              {category === "boys-hostel" && " equipped with high-speed WiFi, dedicated study spaces, mess food, and daily housekeeping"}
              {category === "affordable" && " offering budget-friendly room options without compromising on safety, cleanliness, or location"}
              {category === "best" && " recognized for high ratings, premium room configurations, and student satisfaction"}
              .
            </p>
            <p>
              All accommodations listed on GetStay are verified to ensure quality stay experiences for students and young working professionals in {city.name}.
            </p>
          </CardContent>
        </Card>

        {/* Explore Links */}
        <ExploreLinks
          title={`Explore ${city.name} Categories`}
          links={[
            { label: `All ${city.name} Hostels`, href: `/city/${citySlug}` },
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
