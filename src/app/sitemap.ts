import type { MetadataRoute } from 'next'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { SITE_URL } from '@/utilities/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [{ docs: products }, { docs: bundles }, { docs: pages }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'products',
      where: { active: { equals: true } },
      depth: 0,
      limit: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'product-bundles',
      where: { active: { equals: true } },
      depth: 0,
      limit: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'pages',
      depth: 0,
      limit: 0,
      select: { slug: true, updatedAt: true },
    }),
    payload.find({
      collection: 'categories',
      where: { active: { equals: true } },
      depth: 0,
      limit: 0,
      select: { slug: true, updatedAt: true },
    }),
  ])

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/udlejning`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/pakketilbud`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/galleri`, changeFrequency: 'monthly', priority: 0.5 },
  ]

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${SITE_URL}/udlejning/${product.slug}`,
    lastModified: product.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const bundleRoutes: MetadataRoute.Sitemap = bundles.map((bundle) => ({
    url: `${SITE_URL}/pakketilbud/${bundle.slug}`,
    lastModified: bundle.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${SITE_URL}/udlejning/kategori/${category.slug}`,
    lastModified: category.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Only "lejebetingelser" currently has a live route (src/app/(frontend)/lejebetingelser).
  // Other Pages entries have no renderer yet, so they're excluded to avoid 404s in the sitemap.
  const routedPageSlugs = new Set(['lejebetingelser'])
  const pageRoutes: MetadataRoute.Sitemap = pages
    .filter((page) => routedPageSlugs.has(page.slug))
    .map((page) => ({
      url: `${SITE_URL}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'yearly',
      priority: 0.3,
    }))

  return [...staticRoutes, ...productRoutes, ...bundleRoutes, ...categoryRoutes, ...pageRoutes]
}
