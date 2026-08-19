export const SITE_CONFIG = {
  name: "GetStay",
  domain: "getstay.in",
  baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://getstay.in",
  defaultOgImage: "/banners/BANNER1.png",
  twitterHandle: "@GetStay",
  description:
    "Discover and compare verified student accommodation, hostels, and PGs in Bhopal. Modern amenities, transparent pricing, safe environment starting at ₹3,999/month.",
  primaryMarket: "Bhopal",
  primaryState: "Madhya Pradesh",
  country: "IN",
};

export function getFullUrl(path: string = ""): string {
  const base = SITE_CONFIG.baseUrl.replace(/\/$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${base}${cleanPath === "/" ? "" : cleanPath}`;
}
