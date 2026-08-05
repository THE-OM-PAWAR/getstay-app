"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { HostelCard } from "@/components/shared/hostel-card";
import { RoomLandingCard } from "@/components/shared/room-landing-card";
import { PopularLinksSection } from "@/components/shared/popular-links-section";

interface SearchHostelResult {
  _id: string;
  slug: string;
  name: string;
  description?: string;
  city: string;
  state: string;
  accommodationType?: 'boys' | 'girls' | 'coed' | 'separate';
  totalRooms?: number;
  mainPhoto?: string;
}

interface SearchRoomResult {
  _id: string;
  name: string;
  description: string;
  rent: number;
  coverImage?: string;
  components: Array<{ name: string; description: string }>;
  hostelName: string;
  hostelSlug: string;
  city?: string;
  state?: string;
}

interface SearchResults {
  hostels: SearchHostelResult[];
  rooms: SearchRoomResult[];
  query: string;
  parsedQuery: {
    location?: string;
    roomType?: string;
    accommodationType?: string;
  };
}

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Scroll refs for horizontal scrolling
  let hostelScrollRef = useState<HTMLDivElement | null>(null)[0];

  useEffect(() => {
    if (queryParam) {
      performSearch(queryParam);
    }
  }, [queryParam]);

  const performSearch = async (query: string) => {
    if (!query || query.trim().length < 2) {
      setError('Please enter at least 2 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);

      if (!response.ok) {
        throw new Error('Search failed');
      }

      const data: SearchResults = await response.json();
      setResults(data);
    } catch (err) {
      setError('Failed to search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right', ref: HTMLDivElement | null) => {
    if (ref) {
      const scrollAmount = 400;
      ref.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Error State */}
      {error && (
        <div className="mx-auto max-w-2xl rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
        </div>
      )}

      {/* Results */}
      {results && !isLoading && (
        <div className="space-y-8">
          {/* Search Info */}
          <div>
            <h1 className="mb-2 text-2xl font-bold">
              Search Results for "{results.query}"
            </h1>
            <p className="text-sm font-light text-muted-foreground">
              Found {results.hostels.length} hostels and {results.rooms.length} rooms
              {results.parsedQuery.location && ` in ${results.parsedQuery.location}`}
              {results.parsedQuery.roomType && ` • ${results.parsedQuery.roomType} sharing`}
              {results.parsedQuery.accommodationType && ` • ${results.parsedQuery.accommodationType}`}
            </p>
          </div>

          {/* Hostels Section */}
          {results.hostels.length > 0 && (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-bold">Top Hostels</h2>
                {results.hostels.length > 4 && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => scroll('left', hostelScrollRef)}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => scroll('right', hostelScrollRef)}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              <div
                ref={(el) => {
                  if (el) hostelScrollRef = el;
                }}
                className="flex gap-5 overflow-x-auto pb-4 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {results.hostels.map((hostel) => (
                  <div key={hostel._id} className="w-[280px] shrink-0">
                    <HostelCard
                      slug={hostel.slug}
                      name={hostel.name}
                      subtitle={hostel.description}
                      city={hostel.city}
                      state={hostel.state}
                      totalRooms={hostel.totalRooms || 0}
                      accommodationType={hostel.accommodationType || 'boys'}
                      mainPhoto={hostel.mainPhoto}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Rooms Section */}
          {results.rooms.length > 0 && (
            <div>
              <h2 className="mb-4 text-xl font-bold">Available Rooms</h2>
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {results.rooms.map((room) => (
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
            </div>
          )}

          {/* No Results */}
          {results.hostels.length === 0 && results.rooms.length === 0 && (
            <div className="py-12 text-center">
              <p className="mb-2 text-lg font-medium">No results found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search query or browse our{' '}
                <a href="/" className="text-brand-primary hover:underline">
                  featured hostels
                </a>
              </p>
            </div>
          )}

          {/* Popular Links Section */}
          <PopularLinksSection />
        </div>
      )}

      {/* Initial State */}
      {!results && !isLoading && !error && (
        <>
          <div className="py-12 text-center">
            <p className="mb-2 text-lg font-medium">Start searching</p>
            <p className="text-sm text-muted-foreground">
              Use the search bar above to find hostels and rooms
            </p>
          </div>

          {/* Popular Links Section */}
          <PopularLinksSection />
        </>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background">
        <Header />
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        </main>
        <Footer />
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}

function SearchPageContent() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={
        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-primary" />
          </div>
        </main>
      }>
        <SearchContent />
      </Suspense>
      <Footer />
    </div>
  );
}
