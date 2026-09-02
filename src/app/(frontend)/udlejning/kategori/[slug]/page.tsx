import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import type { Where } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'
import { ProductListing } from '@/components/ProductListing'
import { BreadcrumbListJsonLd } from '@/components/StructuredData'
import { categoryChain, descendantIds, parentId } from '@/utilities/categories'
import { DEFAULT_OG_IMAGE, SITE_NAME, truncate } from '@/utilities/seo'
import { parseProductSort } from '@/utilities/sort'
import '../../../styles.css'

const PAGE_SIZE = 12

const getCategories = cache(async () => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    where: { active: { equals: true } },
    depth: 0,
    limit: 0,
    sort: 'name',
  })

  return categories
})

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ q?: string; page?: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { q, page } = await searchParams
  const categories = await getCategories()
  const category = categories.find((c) => c.slug === slug)
  if (!category) return {}

  const canonicalBase = `/udlejning/kategori/${slug}`
  const canonical = page && page !== '1' ? `${canonicalBase}?page=${page}` : canonicalBase

  const title = category.meta?.title || `${category.name} til leje | ${SITE_NAME}`
  const description =
    category.meta?.description ||
    `Lej ${category.name.toLowerCase()} hos Benløse Festudlejning. Levering og opsætning i Ringsted og på hele Sjælland.`
  const image = typeof category.meta?.image === 'object' ? category.meta.image : null
  const ogImage = image?.url ? { url: image.url, alt: category.name } : DEFAULT_OG_IMAGE

  return {
    title: { absolute: truncate(title, 70) },
    description,
    alternates: { canonical },
    openGraph: { title, description, url: canonicalBase, images: [ogImage] },
    robots: q ? { index: false, follow: true } : undefined,
  }
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>
}) {
  const { slug } = await params
  const { q, page: pageParam, sort: sortParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const sort = parseProductSort(sortParam)

  const categories = await getCategories()
  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const where: Where = {
    active: { equals: true },
    categories: { in: descendantIds(category.id, categories) },
  }
  if (q) where.or = [{ name: { contains: q } }, { description: { contains: q } }]

  const { docs: products, totalPages } = await payload.find({
    collection: 'products',
    where,
    limit: PAGE_SIZE,
    page,
    sort,
    depth: 1,
  })

  const byId = new Map(categories.map((c) => [c.id, c]))
  const chain = categoryChain(category.id, byId)

  const breadcrumbs: Crumb[] = [
    { label: 'Forside', href: '/' },
    { label: 'Udlejning', href: '/udlejning' },
    ...chain.map((c, i) => ({
      label: c.name,
      href: i < chain.length - 1 ? `/udlejning/kategori/${c.slug}` : undefined,
    })),
  ]

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <BreadcrumbListJsonLd
        items={[
          { name: 'Forside', url: '/' },
          { name: 'Udlejning', url: '/udlejning' },
          ...chain.map((c) => ({ name: c.name, url: `/udlejning/kategori/${c.slug}` })),
        ]}
      />
      <Breadcrumbs items={breadcrumbs} />
      <h1 className="text-center">{category.name}</h1>

      <ProductListing
        basePath={`/udlejning/kategori/${slug}`}
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, parentId: parentId(c) }))}
        page={page}
        products={products}
        q={q}
        selectedCategorySlug={slug}
        sort={sort}
        totalPages={totalPages}
      />
    </div>
  )
}
