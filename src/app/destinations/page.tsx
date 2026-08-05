import { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { getFilteredHostels, FilterOptions } from "@/services/hostel.service";
import { HostelCard } from "@/components/shared/hostel-card";
import { ExploreFilters } from "@/components/explore/explore-filters";
import { Suspense } from "react";
import { Loader2, Filter } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";


export const metadata: Metadata = {
  title: "Explore Accommodations - GetStay",
  description: "Find and filter the best hostels and PGs in Bhopal, Indore, and more.",
};

export default async function DestinationsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const city = typeof searchParams.city === "string" ? searchParams.city : undefined;
  const type = typeof searchParams.type === "string" ? searchParams.type : undefined;
  const maxRentStr = typeof searchParams.maxRent === "string" ? searchParams.maxRent : undefined;
  const amenitiesStr = typeof searchParams.amenities === "string" ? searchParams.amenities : undefined;

  const filters: FilterOptions = {
    city: city && city !== "all" ? city : undefined,
    accommodationType: type && type !== "all" ? type : undefined,
    maxRent: maxRentStr ? parseInt(maxRentStr) : undefined,
    amenities: amenitiesStr ? amenitiesStr.split(",").filter(Boolean) : undefined,
  };

  const hostels = await getFilteredHostels(filters);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 bg-gray-50/50 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">

          {/* Mobile Filter Button */}
          <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-xl border shadow-sm">
            <span className="font-medium">{hostels.length} Results Found</span>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" /> Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6 overflow-y-auto">
                <Suspense fallback={<div>Loading filters...</div>}>
                  <ExploreFilters />
                </Suspense>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-80 shrink-0">
            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl p-8 rounded-3xl    sticky top-28">
              <Suspense fallback={<div>Loading filters...</div>}>
                <ExploreFilters />
              </Suspense>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            <div className="hidden md:flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{hostels.length} Accommodations Found</h2>
            </div>

            {hostels.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {hostels.map((hostel) => (
                  <HostelCard
                    key={hostel._id}
                    slug={hostel.slug || ""}
                    name={hostel.name}
                    subtitle={hostel.description}
                    city={hostel.profile?.basicInfo.city || ""}
                    state={hostel.profile?.basicInfo.state || ""}
                    totalRooms={hostel.profile?.propertyDetails.totalRooms || 0}
                    accommodationType={hostel.profile?.propertyDetails.accommodationType || "boys"}
                    mainPhoto={hostel.profile?.media.photos.find(p => p.isMain)?.url || hostel.profile?.media.photos[0]?.url}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-zinc-950 rounded-2xl border p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">No accommodations found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn't find any stays matching your current filters. Try adjusting them to see more results.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    // This is handled by a link reset or client side in filters, but since we are in a server component we can just link to /destinations
                  }}
                  asChild
                >
                  <a href="/destinations">Clear All Filters</a>
                </Button>
              </div>
            )}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
