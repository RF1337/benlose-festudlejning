import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import config from '@/payload.config'
import { ProductPurchase } from '@/components/ProductPurchase'
import { ProductCard } from '@/components/ProductCard'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'
import type { Category, Product } from '@/payload-types'
import '../../styles.css'

function categoryChain(categoryId: number, byId: Map<number, Category>): Category[] {
  const category = byId.get(categoryId)
  if (!category) return []
  const parentId = category.parent ? (typeof category.parent === 'object' ? category.parent.id : category.parent) : null
  const parents = parentId ? categoryChain(parentId, byId) : []
  return [...parents, category]
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [{ docs }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'products',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 2,
    }),
    payload.find({ collection: 'categories', depth: 0, limit: 0 }),
  ])

  const product = docs[0]
  if (!product || !product.active) notFound()

  const mainImage = typeof product.image === 'object' ? product.image : null
  const galleryImages = (product.gallery ?? [])
    .map((entry) => {
      const image = typeof entry.image === 'object' ? entry.image : null
      if (!image?.url) return null
      return { url: image.url, alt: product.name, matchesVariantValue: entry.matchesVariantValue }
    })
    .filter((entry) => entry !== null)
  const images = [
    ...(mainImage?.url ? [{ url: mainImage.url, alt: product.name, matchesVariantValue: null }] : []),
    ...galleryImages,
  ]

  const categoriesById = new Map(categories.map((c) => [c.id, c]))
  const firstCategoryId = product.categories?.[0]
    ? typeof product.categories[0] === 'object'
      ? product.categories[0].id
      : product.categories[0]
    : null
  const chain = firstCategoryId ? categoryChain(firstCategoryId, categoriesById) : []

  const breadcrumbs: Crumb[] = [
    { label: 'Forside', href: '/' },
    { label: 'Udlejning', href: '/udlejning' },
    ...chain.map((c) => ({ label: c.name, href: `/udlejning?category=${c.slug}` })),
    { label: product.name },
  ]

  const relatedProducts = (product.relatedProducts ?? []).filter(
    (p): p is Product => typeof p === 'object' && Boolean(p.active),
  )

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <ProductPurchase
          description={product.description}
          images={images}
          name={product.name}
          price={product.price}
          productId={product.id}
          type="product"
          variantGroups={(product.variants ?? []).map((v) => ({
            label: v.label,
            options: v.options.map((o) => o.value),
          }))}
        />
      </div>

      {relatedProducts.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6">Måske synes du også om</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {relatedProducts.map((related) => {
              const relatedImage = typeof related.image === 'object' ? related.image : null

              return (
                <ProductCard
                  description={related.description}
                  detailsHref={`/udlejning/${related.slug}`}
                  hasVariants={Boolean(related.variants?.length)}
                  image={relatedImage?.url ? { url: relatedImage.url, alt: related.name } : null}
                  key={related.id}
                  name={related.name}
                  price={related.price}
                  productId={related.id}
                  type="product"
                />
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
