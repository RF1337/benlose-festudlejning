import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { ProductCard } from '@/components/ProductCard'
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
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <h1 className="text-center">Udlejning</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => {
          const image = typeof product.image === 'object' ? product.image : null

          return (
            <ProductCard
              description={product.description}
              detailsHref={`/udlejning/${product.slug}`}
              image={image?.url ? { url: image.url, alt: image.alt } : null}
              key={product.id}
              name={product.name}
              price={product.price}
              productId={product.id}
              type="product"
            />
          )
        })}
        {products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  )
}
