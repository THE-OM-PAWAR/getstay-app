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
  { value: "50+", label: "Verified Properties", subtext: "Strictly Audited", icon: Building2 },
  { value: "1,000+", label: "Students", subtext: "Trusted Nationwide", icon: Users },
  // { value: "4.8 / 5", label: "Average Resident Rating", subtext: "Over 8,500+ Reviews", icon: Star },
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
        <section className="relative overflow-hidden bg-[#f7f6f3] pt-8 pb-12 md:pb-16">
          <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-[#efeae1] to-transparent" />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
              <div className="space-y-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-[#3932d8]/15 bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.25em] text-[#3932d8] shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  About GetStay
                </span>

                <div className="space-y-4">
                  <h1 className="text-4xl font-black tracking-[-0.04em] text-[#111827] sm:text-5xl lg:text-6xl">
                    A better way to find a place you can call home.
                  </h1>
                  <p className="max-w-xl text-base leading-7 text-gray-700 sm:text-lg ">
                    GetStay makes it easier for students and professionals to find safe, verified, and reliable hostels and PGs. We bring trusted accommodation options together in one place—making the search simpler, safer, and more transparent for residents while helping property owners reach the right audience
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/explore"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3932d8] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#3932d8]/20 transition-transform duration-200 hover:-translate-y-0.5"
                  >
                    Explore stays
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full border border-[#1f2937]/15 bg-white px-6 py-3.5 text-sm font-bold text-[#1f2937] transition-colors hover:border-[#3932d8]/30 hover:text-[#3932d8]"
                  >
                    Create account
                  </Link>
                </div>

                <div className="flex flex-wrap gap-4 pt-2">
                  {stats.slice(0, 3).map(({ value, label, icon: Icon }) => (
                    <div key={label} className="rounded-2xl border border-[#111827]/10 bg-white/80 px-4 py-3 shadow-sm backdrop-blur-sm">
                      <div className="mb-2 flex items-center gap-2 text-[#3932d8]">
                        <Icon className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-gray-600">{label}</span>
                      </div>
                      <div className="text-xl font-black text-[#111827]">{value}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="relative lg:pl-2">
                <div className="relative overflow-hidden rounded-[30px] border border-[#111827]/10 bg-white p-2 shadow-[0_30px_70px_rgba(17,24,39,0.12)]">
                  <img
                    src="https://images.unsplash.com/photo-1730322330871-967267cb819c?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="GetStay hostel exterior"
                    className="h-110 w-full rounded-[24px] object-cover object-center md:h-130 transition-transform duration-700 hover:scale-105"
                  />
                </div>
                <div className="absolute -bottom-5 left-6 rounded-2xl border border-[#111827]/10 bg-white/95 px-4 py-3 shadow-lg backdrop-blur-sm">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#3932d8]">Verified Stays</div>
                  <div className="mt-1 text-2xl font-black text-[#111827]">50+ Hostels</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Our Heritage Section ─── */}
        <section className="bg-white py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
              <div className="lg:col-span-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div className="overflow-hidden rounded-[28px] border border-[#111827]/10 bg-[#f8f8f8] shadow-[0_18px_54px_rgba(17,24,39,0.08)] sm:col-span-2">
                    <img
                      src="/hostel-building.jpg"
                      alt="Modern urban living exterior"
                      className="h-70 w-full object-cover object-center sm:h-85 hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="overflow-hidden rounded-[24px] border border-[#111827]/10 bg-[#f8f8f8] shadow-[0_18px_54px_rgba(17,24,39,0.08)]">
                    <img
                      src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"
                      alt="Comfortable room interior"
                      className="h-56 w-full object-cover object-center"
                    />
                  </div>
                  <div className="flex items-center justify-center rounded-[24px] border border-[#111827]/10 bg-[#f1f3ff] p-6 shadow-[0_18px_54px_rgba(17,24,39,0.08)]">
                    <div className="text-center">
                      <div className="text-3xl font-black text-[#3932d8]">100%</div>
                      <div className="mt-2 text-[10px] font-black uppercase tracking-[0.22em] text-gray-700">Verified</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 lg:pl-2">
                <span className="inline-block text-[11px] font-black uppercase tracking-[0.24em] text-[#3932d8]">
                  Our Heritage
                </span>

                <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#111827] sm:text-4xl lg:text-5xl">
                  Bridging the gap between housing & trust.
                </h2>

                <p className="mt-6 max-w-2xl text-base leading-8 text-gray-700 sm:text-lg">
                  In most cities, students and young professionals encounter inaccurate listings, undisclosed brokerage fees, unsafe environments, and non-responsive management. GetStay was established to eliminate this friction entirely. We combine verified ground-level auditing with intuitive technology, providing accurate photos, 360&deg; virtual tours, transparent pricing breakdowns, and guaranteed resident support.
                </p>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                  <div className="rounded-2xl border border-[#111827]/10 bg-[#f9fafb] p-5">
                    <div className="text-2xl font-black text-[#111827]">15+</div>
                    <div className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">At Locations</div>
                  </div>
                  <div className="rounded-2xl border border-[#111827]/10 bg-[#f9fafb] p-5">
                    <div className="text-2xl font-black text-[#111827]">800+</div>
                    <div className="mt-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-700">Rooms Available</div>
                  </div>
                </div>

                <div className="mt-8">
                 <div className="inline-flex items-center gap-2 rounded-full border border-[#3932d8]/15 bg-[#f1f3ff] px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#3932d8]">Getstay</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Why Choose Us Section ─── */}
        <section className="bg-[#f4f4f4] px-6 py-20 md:px-12 lg:px-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span className="inline-block text-[11px] font-black uppercase tracking-[0.24em] text-[#3932d8]">
                  Why choose us
                </span>
                <h2 className="mt-4 text-3xl font-black tracking-[-0.04em] text-[#111827] sm:text-4xl md:text-5xl">
                  Built for trust, comfort, and convenience.
                </h2>
                <p className="mt-4 max-w-md text-base leading-7 text-gray-700 sm:text-lg">
                  Built from the ground up to solve real accommodation problems with technology and human accountability.
                </p>

              </div>

              <div className="lg:col-span-7">
                <div className="grid gap-5 sm:grid-cols-2">
                  {bentoHighlights.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div
                        key={item.title}
                        className="group flex min-h-55 flex-col justify-between rounded-[24px] border border-[#111827]/10 bg-white p-6 shadow-[0_20px_50px_rgba(17,24,39,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_rgba(57,50,216,0.12)]"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${item.badgeColor}`}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.18em] text-gray-500">{item.tag}</span>
                        </div>

                        <div>
                          <h3 className="mt-5 text-xl font-black text-[#111827]">{item.title}</h3>
                          <p className="mt-3 text-sm leading-6 text-gray-700">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── Team Leadership Section ─── */}
        <section className="relative py-24 md:py-32 bg-[#f4f5fa] text-[#111827] px-6 overflow-hidden">
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#3932d8]/5 blur-[140px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-7xl z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20">
              <span className="inline-flex items-center gap-2 text-xs font-black tracking-[0.25em] text-[#3932d8] uppercase px-4 py-1.5 rounded-full bg-[#3932d8]/10 border border-[#3932d8]/15 mb-4 shadow-xs">
                <Award className="h-3.5 w-3.5" /> Visionaries Behind GetStay
              </span>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#111827] tracking-tight leading-tight">
                Meet Executive Leadership
              </h2>
              <p className="mt-4 text-gray-600 text-base sm:text-lg leading-relaxed font-normal max-w-2xl mx-auto">
                Combining deep expertise across prop-tech, scalable cloud architecture, hospitality excellence, and strategic partnerships.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-7 max-w-6xl mx-auto">
              {team.map((member) => (
                <div
                  key={member.name}
                  className="group relative rounded-3xl border border-[#111827]/10 bg-white p-7 shadow-[0_15px_45px_rgba(17,24,39,0.06)] hover:shadow-[0_25px_60px_rgba(57,50,216,0.15)] hover:border-[#3932d8]/30 transition-all duration-500 hover:-translate-y-2 flex flex-col justify-between overflow-hidden"
                >
                  {/* Decorative Corner Light Gradient */}
                  <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-[#3932d8]/10 to-transparent rounded-tr-3xl rounded-bl-full pointer-events-none group-hover:from-[#3932d8]/20 transition-all duration-500" />

                  <div>
                    {/* Header: Avatar + Status */}
                    <div className="flex items-start justify-between mb-6">
                      <div
                        className={`w-16 h-16 rounded-2xl bg-linear-to-br ${member.gradient} flex items-center justify-center text-white font-black text-xl shadow-lg ring-4 ring-[#f4f5fa] group-hover:scale-105 transition-all duration-300`}
                      >
                        {member.initials}
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Core
                      </span>
                    </div>

                    {/* Info */}
                    <h3 className="text-xl font-black text-[#111827] tracking-tight mb-1 group-hover:text-[#3932d8] transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-xs font-black uppercase tracking-widest text-[#3932d8] mb-4">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-normal">
                      {member.bio}
                    </p>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-8 pt-5 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-500 tracking-wider">GetStay Core</span>
                    <div className="flex items-center gap-2">
                     
                    </div>
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
                    <div className="w-10 h-10 rounded-full bg-linear-to-br from-[#3932d8] to-[#6c63ff] text-white flex items-center justify-center text-xs font-black">
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
        <section className="relative py-24 md:py-32 px-6 bg-[#f7f6f3] overflow-hidden">
          {/* Subtle Ambient Radial Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#3932d8]/8 blur-[140px] rounded-full pointer-events-none" />

          <div className="relative mx-auto max-w-6xl z-10">
            <div className="relative overflow-hidden rounded-[36px] border border-[#111827]/10 bg-white p-8 sm:p-14 lg:p-20 shadow-[0_30px_90px_rgba(17,24,39,0.08)]">
              {/* Decorative Brand Accent Stripe */}
              <div className="absolute top-0 inset-x-0 h-2 bg-linear-to-r from-[#3932d8] via-[#6c63ff] to-[#0ea5e9]" />

              <div className="grid items-center gap-10 lg:grid-cols-12">
                <div className="lg:col-span-7 space-y-6 text-left">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[#3932d8]/15 bg-[#f1f3ff] px-3.5 py-1 text-[11px] font-black uppercase tracking-[0.22em] text-[#3932d8]">
                    <Sparkles className="h-3.5 w-3.5" /> Start Your Stays Journey
                  </span>

                  <h2 className="text-3xl sm:text-5xl lg:text-5xl font-black text-[#111827] tracking-tight leading-[1.15]">
                    Ready to experience a better stay?
                  </h2>

                  <p className="max-w-xl text-base sm:text-lg text-gray-700 leading-relaxed font-normal">
                    Explore top-rated, 100% ground-audited hostels and student PGs in your city today with zero broker fees.
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-6 text-xs font-bold text-gray-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3932d8]" />
                      <span>Zero Brokerage</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3932d8]" />
                      <span>100% Audited Media</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-[#3932d8]" />
                      <span>Instant Booking</span>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col justify-center items-stretch gap-4">
                  <Link
                    href="/explore"
                    className="inline-flex items-center justify-center gap-3 rounded-full bg-[#3932d8] px-8 py-4 text-sm font-black text-white shadow-xl shadow-[#3932d8]/25 transition-all duration-300 hover:-translate-y-1 hover:bg-[#2e28b8]"
                  >
                    <span>Browse All Accommodations</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/signup"
                    className="inline-flex items-center justify-center rounded-full border border-[#111827]/15 bg-white px-8 py-4 text-sm font-bold text-[#111827] transition-all duration-300 hover:border-[#3932d8]/40 hover:text-[#3932d8] hover:shadow-md"
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
