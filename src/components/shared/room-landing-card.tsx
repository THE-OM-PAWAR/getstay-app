import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, MapPin } from "lucide-react";

interface RoomLandingCardProps {
  roomId: string;
  name: string;
  description: string;
  rent: number;
  coverImage?: string;
  components: Array<{
    name: string;
    description: string;
  }>;
  hostelName: string;
  hostelCity?: string;
  hostelState?: string;
}

export function RoomLandingCard({
  roomId,
  name,
  description,
  rent,
  coverImage,
  components,
  hostelName,
  hostelCity,
  hostelState,
}: RoomLandingCardProps) {
  const location = hostelCity && hostelState 
    ? `${hostelCity}, ${hostelState}`
    : hostelCity || hostelState || '';

  return (
    <Link href={`/room/${roomId}`} className="block h-full">
      <div className="group rounded-[24px] bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.2)] transition-all duration-300 h-full flex flex-col p-3">
        {/* Image section */}
        <div className="relative h-48 md:h-52 w-full overflow-hidden bg-muted rounded-[16px]">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-muted to-muted/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-background/30 backdrop-blur-sm">
                  <svg className="h-8 w-8 text-foreground/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                  </svg>
                </div>
              </div>
            </>
          )}
          
          {/* Price badge - top left (From XXXX) */}
          <div className="absolute top-3 left-3 z-10 rounded-full bg-black/70 backdrop-blur-md px-4 py-1.5 text-sm font-semibold text-white shadow-sm">
            From {rent.toLocaleString('en-IN')}
          </div>

          {/* Heart button - top right */}
          <button
            className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white dark:bg-background shadow-md hover:scale-110 transition-transform"
            aria-label="Add to favorites"
          >
            <svg className="h-4 w-4 text-foreground" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>
        </div>
        
        {/* Card content */}
        <div className="pt-3 pb-2 px-1 flex flex-col gap-2">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-sm md:text-base font-bold text-foreground leading-tight line-clamp-1 mb-0.5">
                {name}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" />
                <span className="text-[10px] truncate">
                  in {hostelName}{location ? `, ${location}` : ''}
                </span>
              </div>
            </div>
            <div className="text-sm md:text-base font-bold text-foreground shrink-0 leading-tight whitespace-nowrap">
              ₹{rent.toLocaleString('en-IN')}
            </div>
          </div>
          
          {/* Components */}
          {components.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {components.slice(0, 3).map((component, idx) => (
                <div
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] font-medium text-gray-700"
                >
                  <CheckCircle2 className="h-3 w-3 text-brand-primary" />
                  <span className="truncate max-w-[80px]">{component.name}</span>
                </div>
              ))}
              {components.length > 3 && (
                <div className="inline-flex items-center gap-1.5 rounded-lg bg-gray-100 px-2.5 py-1.5 text-[11px] font-medium text-gray-700">
                  +{components.length - 3}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

