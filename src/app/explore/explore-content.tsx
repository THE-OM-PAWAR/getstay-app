"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Filter, Search } from "lucide-react";
import { HostelCard } from "@/components/shared/hostel-card";
import { RoomLandingCard } from "@/components/shared/room-landing-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExploreResults, ExploreParams } from "@/services/explore.service";
import { FilterSidebar } from "@/components/explore/filter-sidebar";
import { ActiveFilters } from "@/components/explore/active-filters";
import { SortDropdown } from "@/components/explore/sort-dropdown";

interface ExploreContentProps {
  initialData: ExploreResults;
  initialParams: ExploreParams;
  isEmbedded?: boolean;
}

export function ExploreContent({ initialData, initialParams, isEmbedded = false }: ExploreContentProps) {
  const router = useRouter();
  
  const [results, setResults] = useState<ExploreResults>(initialData);
  const [filters, setFilters] = useState<ExploreParams>(initialParams);
  const [searchQuery, setSearchQuery] = useState(initialParams.query || '');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const updateURL = useCallback((newFilters: ExploreParams) => {
    const params = new URLSearchParams();
    
    if (newFilters.query) params.set('query', newFilters.query);
    if (newFilters.city && newFilters.city !== 'all') params.set('city', newFilters.city);
    if (newFilters.accommodationType && newFilters.accommodationType !== 'all') {
      params.set('type', newFilters.accommodationType);
    }
    if (newFilters.maxRent) params.set('maxRent', newFilters.maxRent.toString());
    if (newFilters.amenities && newFilters.amenities.length > 0) {
      params.set('amenities', newFilters.amenities.join(','));
    }
    if (newFilters.sortBy && newFilters.sortBy !== 'newest') {
      params.set('sortBy', newFilters.sortBy);
    }
    
    router.push(`/explore?${params.toString()}`);
  }, [router]);

  const fetchResults = async (newFilters: ExploreParams) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      Object.entries(newFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '' && value !== 'all') {
          if (Array.isArray(value)) {
            params.set(key, value.join(','));
          } else {
            params.set(key, value.toString());
          }
        }
      });

      const response = await fetch(`/api/explore?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Error fetching results:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: ExploreParams) => {
    setFilters(newFilters);
    updateURL(newFilters);
    fetchResults(newFilters);
  };

  const handleRemoveFilter = (key: keyof ExploreParams) => {
    const updated = { ...filters };
    if (key === 'amenities') {
      updated.amenities = [];
    } else {
      delete updated[key];
    }
    handleFilterChange(updated);
  };

  const handleClearAll = () => {
    const cleared: ExploreParams = { sortBy: filters.sortBy };
    setSearchQuery('');
    handleFilterChange(cleared);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleFilterChange({ ...filters, query: searchQuery });
  };

  const handleSortChange = (sortBy: string) => {
    handleFilterChange({ ...filters, sortBy: sortBy as ExploreParams['sortBy'] });
  };

  const totalResults = results.total.hostels + results.total.rooms;

  const innerContent = (
    <div className="w-full">
      {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by city, hostel name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 text-base bg-white dark:bg-background"
            />
          </div>
        </form>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  Filters
                  {Object.keys(filters).filter(k => filters[k as keyof ExploreParams]).length > 0 && (
                    <span className="ml-auto bg-brand-primary text-white text-xs rounded-full px-2 py-0.5">
                      {Object.keys(filters).filter(k => filters[k as keyof ExploreParams]).length}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] sm:w-[400px] p-6 overflow-y-auto">
                <FilterSidebar
                  filters={filters}
                  onChange={handleFilterChange}
                  onClose={() => {}}
                />
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Sidebar */}
          <aside className="hidden md:block w-80 shrink-0">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl sticky top-24 shadow-sm h-[calc(100vh-8rem)] flex flex-col">
              <FilterSidebar filters={filters} onChange={handleFilterChange} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Active Filters & Sort */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div className="flex-1">
                <ActiveFilters
                  filters={filters}
                  onRemoveFilter={handleRemoveFilter}
                  onClearAll={handleClearAll}
                />
              </div>
              <SortDropdown
                value={filters.sortBy || 'newest'}
                onChange={handleSortChange}
              />
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">
                {isLoading ? 'Searching...' : `${totalResults} ${totalResults === 1 ? 'Result' : 'Results'} Found`}
              </h2>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
              </div>
            )}

            {/* Results */}
            {!isLoading && totalResults > 0 && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="mb-6">
                  <TabsTrigger value="all">
                    All ({totalResults})
                  </TabsTrigger>
                  <TabsTrigger value="hostels">
                    Hostels ({results.total.hostels})
                  </TabsTrigger>
                  <TabsTrigger value="rooms">
                    Rooms ({results.total.rooms})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-6">
                  {results.hostels.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.hostels.map(hostel => (
                        <HostelCard
                          key={hostel._id}
                          slug={hostel.slug}
                          name={hostel.name}
                          subtitle={hostel.description}
                          city={hostel.city}
                          state={hostel.state}
                          totalRooms={hostel.totalRooms || 0}
                          accommodationType={hostel.accommodationType || 'coed'}
                          mainPhoto={hostel.mainPhoto}
                          minRent={hostel.minRent}
                          roomTypes={hostel.roomTypes || []}
                          amenities={hostel.amenities || []}
                        />
                      ))}
                    </div>
                  )}
                  {results.rooms.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-6 border-t border-border">
                      <div className="col-span-full">
                        <h3 className="text-xl font-bold mb-2">Available Rooms</h3>
                      </div>
                      {results.rooms.map(room => (
                        <RoomLandingCard
                          key={room._id}
                          roomId={room._id}
                          name={room.name}
                          description={room.description}
                          rent={room.rent}
                          coverImage={room.coverImage}
                          components={room.components}
                          hostelName={room.hostelName}
                          hostelCity={room.city}
                          hostelState={room.state}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="hostels">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {results.hostels.map(hostel => (
                      <HostelCard
                        key={hostel._id}
                        slug={hostel.slug}
                        name={hostel.name}
                        subtitle={hostel.description}
                        city={hostel.city}
                        state={hostel.state}
                        totalRooms={hostel.totalRooms || 0}
                        accommodationType={hostel.accommodationType || 'coed'}
                        mainPhoto={hostel.mainPhoto}
                        minRent={hostel.minRent}
                        roomTypes={hostel.roomTypes || []}
                        amenities={hostel.amenities || []}
                      />
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="rooms">
                  {results.rooms.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.rooms.map(room => (
                        <RoomLandingCard
                          key={room._id}
                          roomId={room._id}
                          name={room.name}
                          description={room.description}
                          rent={room.rent}
                          coverImage={room.coverImage}
                          components={room.components}
                          hostelName={room.hostelName}
                          hostelCity={room.city}
                          hostelState={room.state}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No rooms found matching your criteria
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            )}

            {/* No Results */}
            {!isLoading && totalResults === 0 && (
              <div className="bg-white dark:bg-zinc-950 rounded-2xl border p-12 text-center shadow-sm">
                <div className="w-16 h-16 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-brand-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-muted-foreground mb-6">
                  We couldn&apos;t find any accommodations matching your criteria. Try adjusting your filters.
                </p>
                <Button variant="outline" onClick={handleClearAll}>
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
    </div>
  );

  if (isEmbedded) {
    return innerContent;
  }

  return (
    <main className="flex-1 bg-gray-50/50 dark:bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {innerContent}
      </div>
    </main>
  );
}
