import { MetadataRoute } from 'next';
import { getHostelSlugsForSSG } from '@/services/hostel-detail.service';
import { getCitiesWithHostels, getCityCategoryPaths } from '@/services/city.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://www.getstay.in';
  const cleanBaseUrl = baseUrl.replace(/\/$/, '');

  const slugs = await getHostelSlugsForSSG();
  const cities = await getCitiesWithHostels();
  const cityCategories = await getCityCategoryPaths();

  const cityPages = cities.map((city) => ({
    url: `${cleanBaseUrl}/city/${city.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const categoryPages = cityCategories.map((path) => ({
    url: `${cleanBaseUrl}/city/${path.citySlug}/${path.category}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.85,
  }));

  const hostelPages = slugs.map((slug) => ({
    url: `${cleanBaseUrl}/hostel/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: cleanBaseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${cleanBaseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    },
    ...cityPages,
    ...categoryPages,
    ...hostelPages,
  ];
}
