import type { Metadata, Viewport } from "next";
import { Poppins, Space_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Toaster } from "@/components/ui/sonner";

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

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fffffd" },
    { media: "(prefers-color-scheme: dark)", color: "#010105" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default: "GetStay | Student Accommodation, Hostels & PGs in Bhopal",
    template: "%s | GetStay",
  },
  description:
    "Discover and compare verified student accommodation, hostels, and PGs in Bhopal. Modern amenities, transparent pricing, safe environment starting at ₹3,999/month.",
  authors: [{ name: "GetStay" }],
  creator: "GetStay",
  publisher: "GetStay",
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://getstay.in"),
  alternates: {
    canonical: "https://getstay.in",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://getstay.in",
    siteName: "GetStay",
    title: "GetStay | Student Accommodation, Hostels & PGs in Bhopal",
    description:
      "Discover and compare verified student accommodation, hostels, and PGs in Bhopal. Modern amenities, transparent pricing, safe environment starting at ₹3,999/month.",
    images: [
      {
        url: "https://getstay.in/banners/BANNER1.png",
        width: 1200,
        height: 630,
        alt: "GetStay - Student Accommodation, Hostels & PGs in Bhopal",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "GetStay | Student Accommodation, Hostels & PGs in Bhopal",
    description:
      "Discover and compare verified student accommodation, hostels, and PGs in Bhopal. Book safe student stays online.",
    images: ["https://getstay.in/banners/BANNER1.png"],
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
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
