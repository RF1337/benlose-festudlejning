import type { MetadataRoute } from 'next'

import { SITE_URL } from '@/utilities/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api', '/checkout'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
