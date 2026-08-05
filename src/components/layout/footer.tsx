import { Globe, Smartphone } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-[#f0f3fd] text-gray-900 border-t border-[#e2e8f5]">
      <div className="mx-auto max-w-7xl px-8 py-16 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-12">
          {/* Brand Column */}
          <div className="md:col-span-6 flex flex-col items-start gap-4">
            <Link href="/" className="text-2xl font-black tracking-tight text-brand-primary">
              getstay
            </Link>
            
            <p className="text-sm text-gray-650 max-w-sm leading-relaxed font-medium">
              Connecting travelers with premium hostels worldwide. Experience the best stays with the coolest people in every corner of the globe.
            </p>

            <div className="flex gap-4 mt-2">
              <a 
                href="#" 
                className="p-2.5 rounded-full bg-white hover:bg-brand-primary hover:text-white transition-all shadow-xs cursor-pointer"
                aria-label="Website"
              >
                <Globe className="h-4.5 w-4.5" />
              </a>
              <a 
                href="#" 
                className="p-2.5 rounded-full bg-white hover:bg-brand-primary hover:text-white transition-all shadow-xs cursor-pointer"
                aria-label="Download Mobile App"
              >
                <Smartphone className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h3 className="text-xs font-black tracking-wider text-brand-primary uppercase">
              Navigation
            </h3>
            <ul className="flex flex-col gap-3 text-sm font-semibold text-gray-650">
              <li>
                <Link href="/" className="hover:text-brand-primary transition-colors">
                  Explore
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-brand-primary transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/hostels" className="hover:text-brand-primary transition-colors">
                  Hostels
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-brand-primary transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <h3 className="text-xs font-black tracking-wider text-brand-primary uppercase">
              Support
            </h3>
            <ul className="flex flex-col gap-3 text-sm font-semibold text-gray-650">
              <li>
                <Link href="/terms" className="hover:text-brand-primary transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-brand-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-brand-primary transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/become-a-host" className="hover:text-brand-primary transition-colors">
                  Become a Host
                </Link>
              </li>
              <li>
                <Link href="/gift-cards" className="hover:text-brand-primary transition-colors">
                  Gift Cards
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <hr className="border-[#d9e2f8] mb-8" />

        {/* Bottom copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between text-xs font-semibold text-gray-500 gap-4">
          <p>© 2026 getstay. All rights reserved. Designed for the global traveler.</p>
        </div>
      </div>
    </footer>
  );
}
