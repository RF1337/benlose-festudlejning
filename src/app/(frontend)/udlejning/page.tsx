import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { AddToCartButton } from '../AddToCartButton'
import '../styles.css'

export default async function UdlejningPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: products } = await payload.find({
    collection: 'products',
    where: { active: { equals: true } },
    depth: 1,
  })

  return (
    <div className="mx-auto max-w-5xl p-6 min-[400px]:p-11.25">
      <h1 className="text-center">Udlejning</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-6">
        {products.map((product) => {
          const image = typeof product.image === 'object' ? product.image : null

          return (
            <div className="rounded-lg border border-neutral-200 p-4" key={product.id}>
              {image?.url && (
                <Image
                  alt={image.alt}
                  className="mx-auto mb-3 rounded"
                  height={220}
                  src={image.url}
                  width={220}
                />
              )}
              <h2 className="mb-2 text-xl leading-6.5">{product.name}</h2>
              {product.description && (
                <p className="mb-2 text-[15px] leading-5.5">{product.description}</p>
              )}
              <p className="font-bold">{product.price} kr</p>
              <AddToCartButton name={product.name} price={product.price} productId={product.id} />
            </div>
          )
        })}
        {products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  )
}
