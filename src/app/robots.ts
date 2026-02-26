import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: ['/', '/_next/static/'], // Specifically allow static assets
        disallow: ['/api/', '/admin/', '/_next/'], // Block everything else in _next
      },
    ],
    sitemap: 'https://getstay.in/sitemap.xml',
  };
}