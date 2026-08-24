import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import React from 'react'

import config from '@/payload.config'
import { QuantityAddToCart } from '@/components/QuantityAddToCart'
import '../../styles.css'

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'product-bundles',
    where: { slug: { equals: slug } },
    limit: 1,
    depth: 1,
  })

  const bundle = docs[0]
  if (!bundle || !bundle.active) notFound()

  const image = typeof bundle.image === 'object' ? bundle.image : null
  const products = bundle.products?.filter((p) => typeof p === 'object') ?? []

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <Link className="no-underline" href="/pakketilbud">
        ← Tilbage til pakketilbud
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
          <h1 className="m-0">{bundle.name}</h1>
          <p className="mb-2 font-bold">{bundle.price} kr</p>
          {bundle.description && <p>{bundle.description}</p>}
          {products.length > 0 && (
            <ul>
              {products.map((product) => (
                <li key={product.id}>{product.name}</li>
              ))}
            </ul>
          )}
          <QuantityAddToCart
            name={bundle.name}
            price={bundle.price}
            productId={bundle.id}
            type="bundle"
          />
        </div>
      </div>
    </div>
  )
}
