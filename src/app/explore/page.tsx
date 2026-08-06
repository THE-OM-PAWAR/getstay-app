import { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { ExploreContent } from "./explore-content";
import { getExploreResults, ExploreParams } from "@/services/explore.service";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}): Promise<Metadata> {
  const query = typeof searchParams.query === 'string' ? searchParams.query : '';
  const city = typeof searchParams.city === 'string' ? searchParams.city : '';

  const title = query
    ? `Search: ${query} - GetStay`
    : city
    ? `Hostels in ${city} - GetStay`
    : 'Explore Hostels & PGs - GetStay';

  const description = query
    ? `Find hostels and PGs matching "${query}". Browse verified accommodations with photos, prices, and amenities.`
    : city
    ? `Discover the best hostels and PG accommodations in ${city}. Safe, affordable, and verified stays.`
    : 'Explore and find the perfect hostel or PG accommodation. Filter by city, price, amenities, and more.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
    },
  };
}

function parseSearchParams(searchParams: { [key: string]: string | string[] | undefined }): ExploreParams {
  const query = typeof searchParams.query === 'string' ? searchParams.query : undefined;
  const city = typeof searchParams.city === 'string' ? searchParams.city : undefined;
  const type = typeof searchParams.type === 'string' ? searchParams.type : undefined;
  const maxRentStr = typeof searchParams.maxRent === 'string' ? searchParams.maxRent : undefined;
  const amenitiesStr = typeof searchParams.amenities === 'string' ? searchParams.amenities : undefined;
  const sortBy = typeof searchParams.sortBy === 'string' ? searchParams.sortBy as any : undefined;

  return {
    query,
    city: city && city !== 'all' ? city : undefined,
    accommodationType: type && type !== 'all' ? type : undefined,
    maxRent: maxRentStr ? parseInt(maxRentStr) : undefined,
    amenities: amenitiesStr ? amenitiesStr.split(',').filter(Boolean) : undefined,
    sortBy: sortBy || 'newest',
  };
}

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const params = parseSearchParams(searchParams);
  const initialData = await getExploreResults(params);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <Suspense
        fallback={
          <main className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </main>
        }
      >
        <ExploreContent initialData={initialData} initialParams={params} />
      </Suspense>
      <Footer />
    </div>
  );
}
