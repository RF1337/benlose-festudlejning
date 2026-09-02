import Link from 'next/link'
import React, { Suspense } from 'react'

import { ProductCard } from '@/components/ProductCard'
import { ProductFilters, type FilterCategory } from '@/components/ProductFilters'
import type { Product } from '@/payload-types'

function buildHref(basePath: string, params: Record<string, string | undefined>) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value)
  }
  const qs = search.toString()
  return qs ? `${basePath}?${qs}` : basePath
}

export function ProductListing({
  basePath,
  categories,
  emptyMessage = 'Ingen produkter matcher din søgning.',
  page,
  products,
  q,
  selectedCategorySlug = null,
  sort,
  totalPages,
}: {
  basePath: string
  categories: FilterCategory[]
  emptyMessage?: string
  page: number
  products: Product[]
  q?: string
  selectedCategorySlug?: string | null
  sort?: string
  totalPages: number
}) {
  return (
    <>
      <Suspense>
        <ProductFilters categories={categories} selectedCategorySlug={selectedCategorySlug} />
      </Suspense>

      {products.length === 0 ? (
        <p>{emptyMessage}</p>
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
              href={buildHref(basePath, { q, page: String(page - 1), sort: sort === 'name' ? undefined : sort })}
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
              href={buildHref(basePath, { q, page: String(page + 1), sort: sort === 'name' ? undefined : sort })}
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
    </>
  )
}
