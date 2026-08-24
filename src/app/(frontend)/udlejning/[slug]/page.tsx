import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import config from '@/payload.config'
import { QuantityAddToCart } from '@/components/QuantityAddToCart'
import '../../styles.css'

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'products',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const product = docs[0]
  if (!product || !product.active) notFound()

  const image = typeof product.image === 'object' ? product.image : null

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <Link className="no-underline" href="/udlejning">
        ← Tilbage til udlejning
      </Link>
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
          <p className="mb-2 font-bold">{product.price} kr</p>
          {product.description && <p>{product.description}</p>}
          <QuantityAddToCart
            name={product.name}
            price={product.price}
            productId={product.id}
            type="product"
          />
        </div>
      </div>
    </div>
  )
}
