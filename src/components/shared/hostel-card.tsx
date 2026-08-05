import { MapPin, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";

interface HostelCardProps {
  slug?: string;
  name: string;
  subtitle?: string;
  city: string;
  state?: string;
  totalRooms: number;
  accommodationType: 'boys' | 'girls' | 'coed' | 'separate';
  mainPhoto?: string;
}

export function HostelCard({
  slug,
  name,
  subtitle,
  city,
  state,
  totalRooms,
  accommodationType,
  mainPhoto,
}: HostelCardProps) {
  const displayType = accommodationType === 'coed' ? 'CO-ED' : accommodationType.toUpperCase();
  const location = state ? `${city}, ${state}` : city;

  const cardContent = (
    <Card className="group overflow-hidden rounded-2xl border border-border bg-background transition-all hover:border-brand-primary/50 hover:shadow-sm">
      {/* Image section */}
      <div className="relative h-44 overflow-hidden bg-muted">
        {mainPhoto ? (
          <Image
            src={mainPhoto}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm">
                <svg className="h-10 w-10 text-foreground/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819" />
                </svg>
              </div>
            </div>
          </>
        )}

        {/* Type badge */}
        <Badge
          className="absolute bottom-3 left-3 rounded-lg bg-background/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-foreground backdrop-blur-sm"
          variant="secondary"
        >
          {displayType}
        </Badge>
      </div>

      {/* Card content */}
      <CardContent className="p-4">
        <h3 className="mb-1 truncate text-base font-bold text-foreground">
          {name}
        </h3>
        <p className="mb-3 truncate text-xs font-light text-muted-foreground">
          {subtitle || 'Modern hostel with great amenities'}
        </p>

        {/* Info row */}
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            <span className="font-light">{location}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Users className="h-3.5 w-3.5" />
            <span className="font-medium">{totalRooms}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (slug) {
    return (
      <Link href={`/hostel/${slug}`} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}
