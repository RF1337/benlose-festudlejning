import Image from 'next/image'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import config from '@/payload.config'
import { QuantityAddToCart } from '@/components/QuantityAddToCart'
import { formatPrice } from '@/utilities/formatPrice'
import { Breadcrumbs, type Crumb } from '@/components/Breadcrumbs'
import type { Category } from '@/payload-types'
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
      depth: 1,
    }),
    payload.find({ collection: 'categories', depth: 0, limit: 0 }),
  ])

  const product = docs[0]
  if (!product || !product.active) notFound()

  const image = typeof product.image === 'object' ? product.image : null

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

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <Breadcrumbs items={breadcrumbs} />
      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100">
          {image?.url && (
            <Image
              alt={image.alt}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              src={image.url}
            />
          )}
        </div>
        <div>
          <h1 className="m-0">{product.name}</h1>
          <p className="mb-2 font-bold">{formatPrice(product.price)}</p>
          {product.description && <p>{product.description}</p>}
          <QuantityAddToCart
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
      </div>
    </div>
  )
}
