"use client";

import { Phone, Navigation, Share2, Check } from "lucide-react";
import { useState } from "react";

interface HostelActionButtonsProps {
  hostelName: string;
  location?: string;
  contactNumber?: string;
  googleMapLink?: string;
}

export function HostelActionButtons({
  hostelName, location, contactNumber, googleMapLink,
}: HostelActionButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleContact = () =>
    document.querySelector('[data-section="contact"]')?.scrollIntoView({ behavior: 'smooth', block: 'start' });

  const handleLocation = () => {
    if (googleMapLink) window.open(googleMapLink, '_blank', 'noopener,noreferrer');
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: hostelName, text: `Check out ${hostelName}${location ? ` in ${location}` : ''}`, url: window.location.href });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch { /* ignore */ }
  };

  return (
    <div className="flex items-center gap-2">
      {contactNumber && (
        <button
          onClick={handleContact}
          className="inline-flex items-center gap-1.5 rounded-full bg-[#3932d8] px-4 py-2 text-xs font-black text-white shadow-md shadow-[#3932d8]/20 transition-all hover:-translate-y-0.5 hover:bg-[#2e28b8] active:scale-[0.97]"
          aria-label="Contact"
        >
          <Phone className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Contact</span>
        </button>
      )}
      {googleMapLink && (
        <button
          onClick={handleLocation}
          className="inline-flex items-center gap-1.5 rounded-full border border-[#111827]/15 bg-white px-4 py-2 text-xs font-bold text-[#111827] transition-all hover:border-[#3932d8]/30 hover:text-[#3932d8] hover:-translate-y-0.5 active:scale-[0.97]"
          aria-label="Directions"
        >
          <Navigation className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Directions</span>
        </button>
      )}
      <button
        onClick={handleShare}
        className="inline-flex items-center gap-1.5 rounded-full border border-[#111827]/15 bg-white px-4 py-2 text-xs font-bold text-[#111827] transition-all hover:border-[#3932d8]/30 hover:text-[#3932d8] hover:-translate-y-0.5 active:scale-[0.97]"
        aria-label="Share"
      >
        {copied
          ? <><Check className="h-3.5 w-3.5 text-[#10b981]" /><span className="hidden sm:inline text-[#10b981]">Copied!</span></>
          : <><Share2 className="h-3.5 w-3.5" /><span className="hidden sm:inline">Share</span></>
        }
      </button>
    </div>
  );
}
