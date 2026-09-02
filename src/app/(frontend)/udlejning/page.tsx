import { getPayload } from 'payload'
import type { Metadata } from 'next'
import React from 'react'
import type { Where } from 'payload'

import config from '@/payload.config'
import { ProductListing } from '@/components/ProductListing'
import { parentId } from '@/utilities/categories'
import { DEFAULT_OG_IMAGE } from '@/utilities/seo'
import { parseProductSort } from '@/utilities/sort'
import '../styles.css'

const PAGE_SIZE = 12

const title = 'Udlejning af festtelt, borde, stole og festudstyr'
const description =
  'Udlej festtelt, borde, stole, service og andet festudstyr hos Benløse Festudlejning. Stort udvalg, levering og opsætning i Ringsted og på Sjælland.'

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>
}): Promise<Metadata> {
  const { q, page } = await searchParams
  const canonical = page && page !== '1' ? `/udlejning?page=${page}` : '/udlejning'

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, url: '/udlejning', images: [DEFAULT_OG_IMAGE] },
    // Søgeresultater er tyndt/duplikeret indhold og skal ikke indekseres, men links følges stadig.
    robots: q ? { index: false, follow: true } : undefined,
  }
}

export default async function UdlejningPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string; sort?: string }>
}) {
  const { q, page: pageParam, sort: sortParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)
  const sort = parseProductSort(sortParam)

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: categories } = await payload.find({
    collection: 'categories',
    where: { active: { equals: true } },
    depth: 0,
    limit: 0,
    sort: 'name',
  })

  const where: Where = { active: { equals: true } }
  if (q) where.or = [{ name: { contains: q } }, { description: { contains: q } }]

  const { docs: products, totalPages } = await payload.find({
    collection: 'products',
    where,
    limit: PAGE_SIZE,
    page,
    sort,
    depth: 1,
  })

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <h1 className="text-center">Udlejning</h1>

      <ProductListing
        basePath="/udlejning"
        categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, parentId: parentId(c) }))}
        page={page}
        products={products}
        q={q}
        sort={sort}
        totalPages={totalPages}
      />
    </div>
  )
}
