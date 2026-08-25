import { getPayload } from 'payload'
import Link from 'next/link'
import React, { Suspense } from 'react'
import type { Where } from 'payload'

import config from '@/payload.config'
import { ProductCard } from '@/components/ProductCard'
import { ProductFilters } from '@/components/ProductFilters'
import type { Category } from '@/payload-types'
import '../styles.css'

const PAGE_SIZE = 12

function buildHref(params: Record<string, string | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value)
  }
  const qs = search.toString()
  return qs ? `/udlejning?${qs}` : '/udlejning'
}

function parentId(category: Category): number | null {
  if (!category.parent) return null
  return typeof category.parent === 'object' ? category.parent.id : category.parent
}

// Selecting "Stole" should include products tagged directly with a descendant like
// Stole > Plastik, not just products tagged with "Stole" itself.
function descendantIds(categoryId: number, categories: Category[]): number[] {
  const children = categories.filter((c) => parentId(c) === categoryId)
  return [categoryId, ...children.flatMap((c) => descendantIds(c.id, categories))]
}

export default async function UdlejningPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string; page?: string }>
}) {
  const { category, q, page: pageParam } = await searchParams
  const page = Math.max(1, Number(pageParam) || 1)

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
  const selectedCategory = category ? categories.find((c) => c.slug === category) : undefined
  if (selectedCategory) where.categories = { in: descendantIds(selectedCategory.id, categories) }
  if (q) where.or = [{ name: { contains: q } }, { description: { contains: q } }]

  const { docs: products, totalPages } = await payload.find({
    collection: 'products',
    where,
    limit: PAGE_SIZE,
    page,
    sort: 'name',
    depth: 1,
  })

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <h1 className="text-center">Udlejning</h1>

      <Suspense>
        <ProductFilters
          categories={categories.map((c) => ({ id: c.id, name: c.name, slug: c.slug, parentId: parentId(c) }))}
        />
      </Suspense>

      {products.length === 0 ? (
        <p>Ingen produkter matcher din søgning.</p>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => {
            const image = typeof product.image === 'object' ? product.image : null

            return (
              <ProductCard
                description={product.description}
                detailsHref={`/udlejning/${product.slug}`}
                hasVariants={Boolean(product.variants?.length)}
                image={image?.url ? { url: image.url, alt: image.alt } : null}
                key={product.id}
                name={product.name}
                price={product.price}
                productId={product.id}
                type="product"
              />
            )
          })}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Sidenavigation" className="mt-10 flex items-center justify-center gap-4">
          {page > 1 ? (
            <Link
              className="rounded border border-neutral-200 px-4 py-2 text-sm font-medium no-underline transition-colors hover:border-brand-gold"
              href={buildHref({ category, q, page: String(page - 1) })}
            >
              Forrige
            </Link>
          ) : (
            <span className="rounded border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-300">
              Forrige
            </span>
          )}
          <span className="text-sm">
            Side {page} af {totalPages}
          </span>
          {page < totalPages ? (
            <Link
              className="rounded border border-neutral-200 px-4 py-2 text-sm font-medium no-underline transition-colors hover:border-brand-gold"
              href={buildHref({ category, q, page: String(page + 1) })}
            >
              Næste
            </Link>
          ) : (
            <span className="rounded border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-300">
              Næste
            </span>
          )}
        </nav>
      )}
    </div>
  )
}
