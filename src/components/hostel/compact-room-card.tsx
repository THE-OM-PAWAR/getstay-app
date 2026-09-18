import Image from "next/image";
import Link from "next/link";
import { BedDouble, Star } from "lucide-react";

interface CompactRoomCardProps {
  roomId: string;
  name: string;
  description: string;
  rent: number;
  coverImage?: string;
  components: Array<{ name: string; description: string }>;
  rating?: number;
}

export function CompactRoomCard({
  roomId,
  name,
  description,
  rent,
  coverImage,
  components,
  rating = 4.5,
}: CompactRoomCardProps) {
  return (
    <Link href={`/room/${roomId}`} className="group block w-full">
      <div className="flex flex-col md:flex-row w-full items-stretch min-h-[230px] sm:min-h-[250px] md:min-h-[270px] overflow-hidden rounded-2xl bg-[#f9fafb] border border-gray-200/80 p-3 sm:p-4 gap-4 sm:gap-5 transition-all duration-200 hover:bg-white hover:border-[#3932d8]/30 hover:shadow-md">

        {/* ── Image with Floating Rating Badge ── */}
        <div className="relative w-full md:w-[270px] lg:w-[300px] h-[210px] sm:h-[230px] md:h-auto shrink-0 overflow-hidden rounded-xl bg-gray-200">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              sizes="(max-width: 768px) 100vw, 300px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
              <BedDouble className="h-10 w-10 text-gray-400" strokeWidth={1.3} />
            </div>
          )}

          {/* Rating Badge (top-right of image) */}
          <div className="absolute top-2.5 right-2.5 bg-black/50 backdrop-blur-md px-2.5 py-0.5 rounded-full text-white text-[11px] font-medium tracking-tight flex items-center gap-1">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{rating}</span>
          </div>
        </div>

        {/* ── Centre: Info ── */}
        <div className="flex flex-1 min-w-0 flex-col justify-between py-1">
          <div>
            <h3 className="text-lg sm:text-xl font-medium text-[#111827] tracking-tight leading-snug line-clamp-1">
              {name}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2">
              {description || "Discover premium, safe, and vibrant accommodations tailored for students and young professionals."}
            </p>
          </div>

          {/* Includes Section */}
          <div className="mt-4">
            <h4 className="text-xs font-medium text-[#111827] mb-2 tracking-tight">
              Includes
            </h4>
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              {components && components.length > 0 ? (
                components.slice(0, 4).map((c, i) => (
                  <span
                    key={i}
                    className="rounded-full bg-white border border-gray-200/80 px-3 py-1 text-[11px] font-medium text-gray-600 shadow-2xs"
                  >
                    {c.name}
                  </span>
                ))
              ) : (
                <>
                  <span className="rounded-full bg-white border border-gray-200/80 px-3 py-1 text-[11px] font-medium text-gray-600 shadow-2xs">
                    Dustbin
                  </span>
                  <span className="rounded-full bg-white border border-gray-200/80 px-3 py-1 text-[11px] font-medium text-gray-600 shadow-2xs">
                    Windows
                  </span>
                  <span className="rounded-full bg-white border border-gray-200/80 px-3 py-1 text-[11px] font-medium text-gray-600 shadow-2xs">
                    Dustbin
                  </span>
                  <span className="rounded-full bg-white border border-gray-200/80 px-3 py-1 text-[11px] font-medium text-gray-600 shadow-2xs">
                    Windows
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── Right: Price + Explore Button ── */}
        <div className="flex flex-col justify-between items-start md:items-end shrink-0 md:text-right pt-2 md:pt-1">
          <div>
            <div className="flex items-baseline gap-1 md:justify-end">
              <span className="text-xl sm:text-2xl font-medium tracking-tight text-[#111827]">
                ₹{rent.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-medium text-gray-500">/month</span>
            </div>
            <span className="text-xs text-gray-400 font-normal mt-0.5 block">Includes all taxes</span>
          </div>

          {/* Explore Button */}
          <span className="mt-4 md:mt-0 inline-flex items-center justify-center rounded-xl border border-gray-300 bg-white px-6 py-2.5 text-xs sm:text-sm font-medium text-[#111827] shadow-2xs transition-all duration-200 group-hover:bg-gray-50 group-hover:border-gray-400 cursor-pointer active:scale-[0.99]">
            Explore
          </span>
        </div>

      </div>
    </Link>
  );
}

