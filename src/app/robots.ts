import type { MetadataRoute } from 'next';
import { BRAND } from '@/lib/constants';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? `https://${BRAND.domain}`;

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      // Applicant-specific portals must never be indexed.
      disallow: ['/verify-bank'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
