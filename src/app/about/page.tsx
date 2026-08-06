import type { Metadata } from "next";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Building2,
  Users,
  ShieldCheck,
  Star,
  MapPin,
  Zap,
  Heart,
  ArrowRight,
  CheckCircle2,
  Quote,
  Sparkles,
  Award,
  Lock,
  Headphones,
  Compass,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us | GetStay - Redefining Hostel Living",
  description:
    "Discover GetStay — India's premier tech-enabled hostel and PG accommodation platform. Safe, verified, transparent, and built for students and working professionals.",
  keywords: [
    "about GetStay",
    "GetStay story",
    "hostel booking platform Bhopal",
    "GetStay team",
    "GetStay mission",
    "student accommodation platform India",
  ],
  openGraph: {
    title: "About Us | GetStay",
    description:
      "Discover the story behind GetStay — connecting students and professionals with verified, premium hostels.",
    type: "website",
    url: "https://getstay.in/about",
    siteName: "GetStay",
  },
  alternates: {
    canonical: "https://getstay.in/about",
  },
};

const stats = [
  { value: "500+", label: "Verified Hostels", subtext: "Strictly Audited", icon: Building2 },
  { value: "10,000+", label: "Happy Residents", subtext: "Trusted Nationwide", icon: Users },
  { value: "4.8 / 5", label: "Average Resident Rating", subtext: "Over 8,500+ Reviews", icon: Star },
  { value: "99.8%", label: "Verified Occupancy", subtext: "Zero Scam Guarantee", icon: ShieldCheck },
];

const bentoHighlights = [
  {
    icon: ShieldCheck,
    tag: "Security First",
    title: "100% On-Ground Verification",
    description:
      "Our team conducts a rigorous 50-point audit on every property covering biometric security, CCTV surveillance, fire safety, and hygiene standards before any listing goes live.",
    gradient: "from-[#3932d8]/10 via-[#6c63ff]/10 to-transparent",
    badgeColor: "bg-[#3932d8]/10 text-[#3932d8]",
  },
  {
    icon: Zap,
    tag: "Instant Experience",
    title: "2-Minute Zero-Hassle Booking",
    description:
      "No brokers, no surprise deposits, no endless phone calls. Browse verified high-res media, pick your room tier, and lock in your key instantly.",
    gradient: "from-[#0ea5e9]/10 via-[#3932d8]/10 to-transparent",
    badgeColor: "bg-[#0ea5e9]/10 text-[#0ea5e9]",
  },
  {
    icon: Lock,
    tag: "Price Protection",
    title: "Transparent & Best Rate Guaranteed",
    description:
      "What you see is what you pay. Fixed monthly pricing with utility transparency so students and parents can budget with 100% confidence.",
    gradient: "from-[#10b981]/10 via-[#3932d8]/10 to-transparent",
    badgeColor: "bg-[#10b981]/10 text-[#059669]",
  },
  {
    icon: Headphones,
    tag: "Dedicated Support",
    title: "24/7 Resident Care Concierge",
    description:
      "From maintenance requests to emergency assistance, our dedicated resident care team is available around the clock via in-app chat and hotline.",
    gradient: "from-[#f59e0b]/10 via-[#3932d8]/10 to-transparent",
    badgeColor: "bg-[#f59e0b]/10 text-[#d97706]",
  },
];

const team = [
  {
    name: "Arjun Sharma",
    role: "Co-Founder & CEO",
    bio: "Former MANIT alum turned tech entrepreneur. Experienced the chaotic student housing search firsthand and founded GetStay to standardise student living across India.",
    initials: "AS",
    gradient: "from-[#3932d8] via-[#4a44e0] to-[#6c63ff]",
  },
  {
    name: "Priya Verma",
    role: "Co-Founder & COO",
    bio: "Operations leader with a background in hospitality management. Oversees ground operations, partner quality audits, and resident welfare nationwide.",
    initials: "PV",
    gradient: "from-[#6c63ff] via-[#b7b4f0] to-[#3932d8]",
  },
  {
    name: "Rahul Gupta",
    role: "Head of Technology",
    bio: "Ex-tier-1 tech lead architecting GetStay's real-time booking engine, interactive virtual tours, and automated property management suite.",
    initials: "RG",
    gradient: "from-[#3932d8] via-[#0ea5e9] to-[#38bdf8]",
  },
  {
    name: "Sneha Patel",
    role: "Head of Partnerships",
    bio: "Forges alliances with top hostel chains and educational institutes, ensuring GetStay users receive exclusive rates and priority room allocation.",
    initials: "SP",
    gradient: "from-[#10b981] via-[#059669] to-[#3932d8]",
  },
];

const milestones = [
  {
    year: "2023",
    title: "Genesis & Prototype",
    description:
      "Identified critical gaps in student housing transparency in Bhopal. Built the initial pilot matching 100 MANIT students with audited local PGs.",
  },
  {
    year: "2024 Q1",
    title: "City Expansion & 50+ Partners",
    description:
      "Expanded across major student hubs in Bhopal (MP Nagar, Indrapuri, Kolar). Onboarded 50+ verified hostels and 1,000+ active residents.",
  },
  {
    year: "2024 Q4",
    title: "10,000 Residents & Regional Leader",
    description:
      "Crossed 10,000+ successful bookings with a 4.8-star satisfaction rate. Expanded service coverage to Indore & Jabalpur.",
  },
  {
    year: "2025",
    title: "Mobile Platform & National Vision",
    description:
      "Launched the next-gen GetStay iOS/Android ecosystem. Scaling tech-enabled student stays across 10 major academic hubs in India.",
  },
];

const testimonials = [
  {
    quote:
      "Moving to Bhopal for my AIIMS residency was intimidating, but GetStay made finding a quiet, secure PG completely effortless. The virtual tour was 100% accurate.",
    name: "Dr. Kavya R.",
    role: "Medical Resident, AIIMS Bhopal",
    initials: "KR",
    badge: "Verified Resident",
  },
  {
    quote:
      "As a parent living in Delhi, knowing my daughter's hostel was personally audited by GetStay gave us complete peace of mind. The transparent pricing is a game-changer.",
    name: "Rajesh Malhotra",
    role: "Parent of MANIT Student",
    initials: "RM",
    badge: "Verified Parent",
  },
  {
    quote:
      "GetStay isn't just a booking app; it's a living upgrade. Premium amenities, high-speed WiFi, fast maintenance response, and zero broker hassle.",
    name: "Ananya Mukherjee",
    role: "B.Tech Senior, MANIT Bhopal",
    initials: "AM",
    badge: "Verified Resident",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#fffffd] selection:bg-[#3932d8] selection:text-white">
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "AboutPage",
            name: "About GetStay",
            url: "https://getstay.in/about",
            description:
              "Learn about GetStay — India's premier tech-enabled hostel and PG booking platform.",
            mainEntity: {
              "@type": "Organization",
              name: "GetStay",
              foundingDate: "2023",
              foundingLocation: "Bhopal, Madhya Pradesh, India",
              description:
                "Leading hostel and PG accommodation booking platform in Bhopal",
            },
          }),
        }}
        id="about-structured-data"
      />

      <Header />

      <main className="overflow-hidden">
        {/* ─── Hero Section ─── */}
        <section className="pt-8 pb-12 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Banner Card */}
            <div className="relative w-full h-[320px] sm:h-[400px] md:h-[450px] rounded-2xl md:rounded-3xl overflow-hidden shadow-md">
              {/* Background Image */}
              <img
                src="/about-hero-bg.jpg"
                alt="About Us background"
                className="w-full h-full object-cover object-center"
              />

              {/* Dark Overlay for Text Contrast */}
              <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight text-center drop-shadow-md">
                  About Us
                </h1>
              </div>
            </div>

            {/* Sub-header text & watermark row */}
            <div className="mt-8 sm:mt-12 flex flex-col md:flex-row md:items-start justify-between gap-6">
              {/* Description Text */}
              <div className="max-w-2xl">
                <p className="text-gray-800 text-lg sm:text-xl font-normal leading-relaxed">
                  GetStay combines ground-level verification with seamless digital booking to deliver safe, modern, and transparent accommodation across India.
                </p>
              </div>

              {/* GetStay Tag & Divider Line */}
              <div className="flex items-center gap-3 self-end md:self-start pt-2">
                <span className="text-sm font-medium text-gray-700">Getstay</span>
                <div className="w-28 sm:w-36 h-[1.5px] bg-gray-800" />
              </div>
            </div>
          </div>
        </section>

        {/* ─── Our Heritage Section ─── */}
        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              {/* Left Image & Quote Card Column */}
              <div className="lg:col-span-5 relative">
                {/* Main Artisan Image */}
                <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-lg">
                  <img
                    src="/heritage-artisan.jpg"
                    alt="Our Heritage Artisan"
                    className="w-full h-full object-cover object-center"
                  />
                </div>

                {/* Overlapping Floating Quote Card */}
                <div className="absolute -bottom-10 right-0 sm:-right-6 md:right-4 w-[85%] sm:w-[320px] bg-white p-6 rounded-2xl shadow-xl border border-gray-100/80 backdrop-blur-sm">
                  <p className="text-gray-800 italic text-base sm:text-lg font-serif leading-snug">
                    &ldquo;Each stick is a prayer, each scent a journey.&rdquo;
                  </p>
                  <p className="text-gray-500 text-xs sm:text-sm font-medium mt-3">
                    &mdash; Master Artisan, Kanchipuram
                  </p>
                </div>
              </div>

              {/* Right Content Column */}
              <div className="lg:col-span-7 pt-8 lg:pt-0 lg:pl-6">
                <span className="text-xs font-bold tracking-[0.2em] text-gray-700 uppercase">
                  OUR HERITAGE
                </span>

                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.15] mt-4 mb-6">
                  Bridging the gap between housing & trust.
                </h2>

                <p className="text-gray-600 text-base sm:text-lg leading-relaxed mb-10">
                  In most cities, students and young professionals encounter inaccurate listings, undisclosed brokerage fees, unsafe environments, and non-responsive management. GetStay was established to eliminate this friction entirely. We combine verified ground-level auditing with intuitive technology, providing accurate photos, 360&deg; virtual tours, transparent pricing breakdowns, and guaranteed resident support.
                </p>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-8 mb-10">
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      100%
                    </div>
                    <div className="text-xs sm:text-sm font-bold tracking-wider text-gray-700 uppercase mt-1">
                      NATURAL ESSENCE
                    </div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-bold text-gray-900">
                      40+
                    </div>
                    <div className="text-xs sm:text-sm font-bold tracking-wider text-gray-700 uppercase mt-1">
                      MASTER BLENDS
                    </div>
                  </div>
                </div>

                {/* Read Full Story Link */}
                <div>
                  <a
                    href="#full-story"
                    className="inline-block text-xs sm:text-sm font-bold tracking-[0.15em] text-gray-900 uppercase border-b-2 border-gray-900 pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors"
                  >
                    READ OUR FULL STORY
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>



        {/* ─── Why Choose Us Section ─── */}
        <section className="py-20 bg-[#f4f4f4] px-6 md:px-12 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

              {/* Left Column: Heading, Subtitle & Action */}
              <div className="lg:col-span-5 pr-0 lg:pr-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-tight uppercase">
                  WHY CHOOSE US
                </h2>

                <p className="mt-4 text-gray-700 text-base sm:text-lg leading-relaxed max-w-md">
                  Built from the ground up to solve real accommodation problems with technology and human accountability.
                </p>

                <div className="mt-8">
                  <a
                    href="#why-choose-us"
                    className="inline-flex items-center justify-center bg-[#1a1a1a] hover:bg-black text-white text-xs sm:text-sm font-semibold px-6 py-3 rounded-xs transition-colors shadow-sm"
                  >
                    View all
                  </a>
                </div>
              </div>

              {/* Right Column: 2x2 Clean White Quote Cards Grid */}
              <div className="lg:col-span-7">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {bentoHighlights.map((item) => (
                    <div
                      key={item.title}
                      className="bg-white p-7 rounded-none shadow-md border border-gray-100 flex flex-col justify-between"
                    >
                      <p className="text-gray-800 italic text-base sm:text-lg font-serif leading-snug">
                        &ldquo;{item.description}&rdquo;
                      </p>
                      <p className="text-gray-500 text-xs sm:text-sm font-medium mt-4">
                        &mdash; {item.title}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ─── Interactive Journey Timeline ─── */}
        <section className="py-32 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-20">
              <span className="inline-block text-xs font-black tracking-widest text-[#3932d8] uppercase mb-3">
                Our Growth
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-[#010105] tracking-tight">
                The GetStay Journey
              </h2>
            </div>

            <div className="relative">
              {/* Center Line */}
              <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[#3932d8] via-[#b7b4f0] to-transparent transform -translate-x-1/2" />

              <div className="space-y-12">
                {milestones.map((m, i) => (
                  <div
                    key={m.year}
                    className={`relative flex flex-col md:flex-row items-center ${i % 2 === 0 ? "md:flex-row-reverse" : ""
                      }`}
                  >
                    {/* Node Dot */}
                    <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#3932d8] text-white items-center justify-center font-bold text-xs shadow-lg ring-4 ring-white">
                      {i + 1}
                    </div>

                    {/* Content Card */}
                    <div className="w-full md:w-[calc(50%-2.5rem)]">
                      <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-md hover:shadow-lg transition-all">
                        <span className="inline-block text-xs font-black tracking-wider text-[#3932d8] bg-[#3932d8]/10 px-3.5 py-1 rounded-full mb-3">
                          {m.year}
                        </span>
                        <h3 className="text-xl font-extrabold text-[#010105] mb-2">
                          {m.title}
                        </h3>
                        <p className="text-gray-600 text-sm leading-relaxed font-normal">
                          {m.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ─── Team Leadership Section ─── */}
        <section className="py-28 bg-[#010105] text-white px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block text-xs font-black tracking-widest text-[#b7b4f0] uppercase mb-3">
                Leadership
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
                Meet the minds building GetStay
              </h2>
              <p className="mt-4 text-gray-400 text-base">
                A dedicated team combining domain expertise in tech, operations, hospitality, and real estate.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="group relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 hover:border-white/20 transition-all duration-300 hover:-translate-y-1.5 flex flex-col justify-between"
                >
                  <div>
                    {/* Gradient Avatar */}
                    <div
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center text-white font-black text-xl mb-5 shadow-lg group-hover:scale-105 transition-transform duration-300`}
                    >
                      {member.initials}
                    </div>

                    <h3 className="text-xl font-bold text-white mb-0.5">
                      {member.name}
                    </h3>
                    <p className="text-xs font-extrabold text-[#b7b4f0] mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-normal">
                      {member.bio}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Testimonials Ribbon ─── */}
        <section className="py-28 bg-[#f8f9ff] px-6">
          <div className="mx-auto max-w-7xl">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="inline-block text-xs font-black tracking-widest text-[#3932d8] uppercase mb-3">
                Real Feedback
              </span>
              <h2 className="text-4xl sm:text-5xl font-black text-[#010105] tracking-tight">
                Loved by residents & parents
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div
                  key={t.name}
                  className="bg-white rounded-3xl p-8 border border-gray-100 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Quote className="h-8 w-8 text-[#3932d8]/20" />
                      <span className="text-[11px] font-bold bg-[#3932d8]/10 text-[#3932d8] px-2.5 py-0.5 rounded-full">
                        {t.badge}
                      </span>
                    </div>

                    <p className="text-gray-700 text-sm sm:text-base leading-relaxed font-normal mb-6">
                      "{t.quote}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3932d8] to-[#6c63ff] text-white flex items-center justify-center text-xs font-black">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-extrabold text-[#010105]">
                        {t.name}
                      </div>
                      <div className="text-xs text-gray-500 font-medium">
                        {t.role}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── Call To Action ─── */}
        <section className="py-28 px-6">
          <div className="mx-auto max-w-5xl">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-[#010105] via-[#090824] to-[#3932d8] p-10 sm:p-16 text-white text-center shadow-2xl border border-white/10">

              {/* Background Glow */}
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#3932d8]/50 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-[#6c63ff]/40 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 max-w-2xl mx-auto">
                <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                  Ready to experience a better stay?
                </h2>
                <p className="mt-4 text-gray-300 text-base sm:text-lg font-normal">
                  Explore top-rated, verified hostels and PGs in your city today.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    href="/explore"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white text-[#3932d8] hover:bg-gray-100 px-8 py-4 text-sm font-extrabold shadow-lg transition-all"
                  >
                    <span>Browse All Accommodations</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/signup"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-white/10 border border-white/20 text-white hover:bg-white/20 px-8 py-4 text-sm font-semibold backdrop-blur-md transition-all"
                  >
                    Create Account
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
