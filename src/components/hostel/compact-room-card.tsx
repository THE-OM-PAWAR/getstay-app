import Image from "next/image";
import Link from "next/link";
import { IndianRupee, BedDouble, ArrowRight } from "lucide-react";

interface CompactRoomCardProps {
  roomId: string;
  name: string;
  description: string;
  rent: number;
  coverImage?: string;
  components: Array<{ name: string; description: string }>;
}

export function CompactRoomCard({
  roomId,
  name,
  description,
  rent,
  coverImage,
  components,
}: CompactRoomCardProps) {
  return (
    <Link href={`/room/${roomId}`} className="group block w-full">
      <div className="flex w-full items-stretch min-h-[175px] sm:min-h-[205px] overflow-hidden rounded-2xl border border-[#e8eaed] bg-white p-3 sm:p-4 gap-4 shadow-[0_2px_16px_rgba(17,24,39,0.07)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(57,50,216,0.13)] hover:-translate-y-0.5">

        {/* ── Image — with distinct outer border ── */}
        <div className="relative w-[140px] sm:w-[220px] shrink-0 overflow-hidden rounded-xl border border-gray-300/90 bg-[#f0f1f5] shadow-2xs">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
              sizes="(max-width: 640px) 140px, 220px"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#f1f3ff] to-[#e8eaff]">
              <BedDouble className="h-10 w-10 text-[#3932d8]/20" strokeWidth={1.3} />
            </div>
          )}
        </div>

        {/* ── Centre: info ── */}
        <div className="flex flex-1 min-w-0 flex-col justify-between py-1">

          {/* Title + description */}
          <div>
            <h3 className="text-base font-black tracking-tight text-[#111827] leading-snug line-clamp-1 sm:text-lg">
              {name}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-gray-500 leading-relaxed line-clamp-2">
              {description}
            </p>
          </div>

          {/* Includes bar */}
          {components.length > 0 && (
            <div className="mt-3 flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-black uppercase tracking-[0.14em] text-gray-400 mr-0.5">
                Includes
              </span>
              {components.slice(0, 4).map((c, i) => (
                <span
                  key={i}
                  className="rounded-full bg-[#f4f5f7] border border-[#e8eaed] px-2.5 py-0.5 text-[10px] font-semibold text-[#4b5563]"
                >
                  {c.name}
                </span>
              ))}
              {components.length > 4 && (
                <span className="rounded-full bg-[#eef0ff] border border-[#3932d8]/15 px-2.5 py-0.5 text-[10px] font-black text-[#3932d8]">
                  +{components.length - 4}
                </span>
              )}
            </div>
          )}
        </div>

        {/* ── Right: price + CTA ── */}
        <div className="flex shrink-0 flex-col items-end justify-between border-l border-[#f0f1f5] pl-4 sm:pl-6 py-1">

          {/* Price */}
          <div className="text-right">
            <div className="flex items-baseline gap-0.5 justify-end">
              <IndianRupee className="h-4 w-4 text-[#111827] mt-0.5 shrink-0" strokeWidth={2.2} />
              <span className="text-lg font-black text-[#111827] leading-none sm:text-2xl">
                {rent.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-[10px] font-medium text-gray-400 mt-1 block">/month</span>
          </div>

          {/* Explore pill */}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#3932d8] px-4 py-2 text-[11px] font-black text-white shadow-sm shadow-[#3932d8]/25 transition-all duration-200 group-hover:bg-[#2e28b8] group-hover:shadow-md group-hover:shadow-[#3932d8]/30">
            Explore
            <ArrowRight className="h-3 w-3" strokeWidth={2.5} />
          </span>
        </div>

      </div>
    </Link>
  );
}
