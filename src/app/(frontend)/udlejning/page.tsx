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
    <div className="shop">
      <h1>Udlejning</h1>
      <div className="product-grid">
        {products.map((product) => {
          const image = typeof product.image === 'object' ? product.image : null

          return (
            <div className="product-card" key={product.id}>
              {image?.url && (
                <Image alt={image.alt} height={220} src={image.url} width={220} />
              )}
              <h2>{product.name}</h2>
              {product.description && <p>{product.description}</p>}
              <p className="price">{product.price} kr</p>
              <AddToCartButton name={product.name} price={product.price} productId={product.id} />
            </div>
          )
        })}
        {products.length === 0 && <p>No products found.</p>}
      </div>
    </div>
  )
}
