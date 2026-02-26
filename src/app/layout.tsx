import type { Metadata } from "next";
import { Poppins, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: "GetStay - Best Hostels & PG Accommodation in Bhopal | Boys & Girls Hostel Booking",
    template: "%s | GetStay"
  },
  description: "Book the best hostels and PG accommodations in Bhopal with GetStay. Modern amenities, WiFi, food, safe environment for boys, girls, and working professionals. Affordable prices starting from ₹3,999/month. Book now!",
  keywords: [
    // Location-based keywords
    "hostels in Bhopal", "PG in Bhopal", "hostel near me Bhopal", "best hostel Bhopal", "cheap hostel Bhopal",
    "Bhopal hostel booking", "hostel accommodation Bhopal", "Bhopal PG accommodation", "hostels near AIIMS Bhopal",
    "hostels near Barkatullah University", "hostels near MANIT Bhopal", "hostels in Kolar Bhopal", "hostels in Arera Colony",
    
    // Gender-specific keywords
    "boys hostel Bhopal", "girls hostel Bhopal", "boys PG Bhopal", "girls PG Bhopal", "ladies hostel Bhopal",
    "gents hostel Bhopal", "male hostel Bhopal", "female hostel Bhopal", "women hostel Bhopal", "men hostel Bhopal",
    
    // Target audience keywords
    "student hostel Bhopal", "working professional hostel Bhopal", "bachelor accommodation Bhopal",
    "college student hostel Bhopal", "office goers hostel Bhopal", "IT professional hostel Bhopal",
    
    // Amenity-based keywords
    "hostel with WiFi Bhopal", "hostel with food Bhopal", "AC hostel Bhopal", "furnished hostel Bhopal",
    "hostel with laundry Bhopal", "hostel with parking Bhopal", "hostel with gym Bhopal", "hostel with mess Bhopal",
    "24/7 security hostel Bhopal", "CCTV hostel Bhopal", "safe hostel Bhopal",
    
    // Room type keywords
    "single room hostel Bhopal", "double sharing hostel Bhopal", "triple sharing hostel Bhopal",
    "private room hostel Bhopal", "shared room hostel Bhopal", "dormitory Bhopal",
    
    // Price-based keywords
    "affordable hostel Bhopal", "budget hostel Bhopal", "cheap PG Bhopal", "low cost hostel Bhopal",
    "hostel under 5000 Bhopal", "hostel under 4000 Bhopal", "economical hostel Bhopal",
    
    // Service keywords
    "hostel booking online", "PG booking online", "hostel reservation Bhopal", "book hostel Bhopal",
    "hostel booking app", "PG finder Bhopal", "hostel search Bhopal",
    
    // General keywords
    "paying guest Bhopal", "PG accommodation", "student accommodation", "hostel rooms", "hostel facilities",
    "hostel near me", "best PG in Bhopal", "top hostels Bhopal", "verified hostels Bhopal",
    
    // Brand keywords
    "GetStay", "GetStay Bhopal", "GetStay hostel booking", "GetStay PG"
  ],
  authors: [{ name: "GetStay" }],
  creator: "GetStay",
  publisher: "GetStay",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://getstay.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "GetStay",
    title: "GetStay - Modern Hostel Booking",
    description: "Book hostels with a modern, minimal experience. Find the perfect stay for students and travelers.",
    images: [
      {
        url: "/banners/BANNER1.png",
        width: 1200,
        height: 630,
        alt: "GetStay - Modern Hostel Booking",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GetStay - Modern Hostel Booking",
    description: "Book hostels with a modern, minimal experience",
    images: ["/banners/BANNER1.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "mask-icon",
        url: "/safari-pinned-tab.svg",
        color: "#3932d8",
      },
    ],
  },
  manifest: "/site.webmanifest",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffffd" },
    { media: "(prefers-color-scheme: dark)", color: "#010105" },
  ],
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode; 
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${poppins.variable} ${spaceMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
