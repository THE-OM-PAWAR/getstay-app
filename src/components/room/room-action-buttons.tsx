"use client";

import Link from "next/link";
import { Building2, Share2, Check, Phone } from "lucide-react";
import { useState } from "react";

interface RoomActionButtonsProps {
  roomName: string;
  hostelName: string;
  hostelSlug: string;
  contactNumber?: string;
}

export function RoomActionButtons({
  roomName,
  hostelName,
  hostelSlug,
  contactNumber,
}: RoomActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: roomName, text: `Check out ${roomName} at ${hostelName}`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch { /* ignore */ }
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mt-1">
      {/* Primary CTA — call if available, otherwise view hostel */}
      {contactNumber ? (
        <a
          href={`tel:${contactNumber}`}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#3932d8] px-5 py-2.5 text-xs font-black text-white shadow-md shadow-[#3932d8]/20 transition-all hover:-translate-y-0.5 hover:bg-[#2e28b8] active:scale-[0.97]"
        >
          <Phone className="h-3.5 w-3.5" strokeWidth={1.8} />
          <span>Call Now</span>
        </a>
      ) : null}

      <Link href={`/hostel/${hostelSlug}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#111827]/15 bg-white px-5 py-2.5 text-xs font-bold text-[#111827] transition-all hover:border-[#3932d8]/30 hover:text-[#3932d8] hover:-translate-y-0.5 active:scale-[0.97]"
      >
        <Building2 className="h-3.5 w-3.5" strokeWidth={1.7} />
        <span>View Hostel</span>
      </Link>

      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#111827]/15 bg-white px-5 py-2.5 text-xs font-bold text-[#111827] transition-all hover:border-[#3932d8]/30 hover:text-[#3932d8] hover:-translate-y-0.5 active:scale-[0.97]"
        aria-label="Share"
      >
        {copied ? (
          <><Check className="h-3.5 w-3.5 text-[#10b981]" /><span className="text-[#10b981]">Copied!</span></>
        ) : (
          <><Share2 className="h-3.5 w-3.5" /><span>Share</span></>
        )}
      </button>
    </div>
  );
}
