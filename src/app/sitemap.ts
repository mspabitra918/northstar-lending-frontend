import type { MetadataRoute } from 'next';
import { BRAND } from '@/lib/constants';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${BRAND.domain}`;

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['', '/how-it-works', '/reviews', '/apply', '/status'];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    changeFrequency: 'weekly',
    priority: path === '' ? 1 : path === '/apply' ? 0.9 : 0.7,
  }));
}
