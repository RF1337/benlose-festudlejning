import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import '../styles.css'

export default async function PakketilbudPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: bundles } = await payload.find({
    collection: 'product-bundles',
    where: { active: { equals: true } },
    depth: 1,
  })

  return (
    <div className="shop">
      <h1>Pakketilbud</h1>
      <div className="product-grid">
        {bundles.map((bundle) => {
          const image = typeof bundle.image === 'object' ? bundle.image : null
          const products = bundle.products?.filter((p) => typeof p === 'object') ?? []

          return (
            <div className="product-card" key={bundle.id}>
              {image?.url && (
                <Image alt={image.alt} height={220} src={image.url} width={220} />
              )}
              <h2>{bundle.name}</h2>
              {bundle.description && <p>{bundle.description}</p>}
              {products.length > 0 && (
                <ul>
                  {products.map((product) => (
                    <li key={product.id}>{product.name}</li>
                  ))}
                </ul>
              )}
              <p className="price">{bundle.price} kr</p>
            </div>
          )
        })}
        {bundles.length === 0 && <p>No package deals found.</p>}
      </div>
    </div>
  )
}
