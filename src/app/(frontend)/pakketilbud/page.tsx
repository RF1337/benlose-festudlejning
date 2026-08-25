import { getPayload } from 'payload'
import type { Metadata } from 'next'
import React from 'react'

import config from '@/payload.config'
import { ProductCard } from '@/components/ProductCard'
import { DEFAULT_OG_IMAGE } from '@/utilities/seo'
import '../styles.css'

const title = 'Pakketilbud til fest og fejring'
const description =
  'Se vores pakketilbud med festtelt, borde, stole og udstyr samlet i én løsning. Levering og opsætning i Ringsted og på hele Sjælland.'

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: '/pakketilbud' },
  openGraph: { title, description, url: '/pakketilbud', images: [DEFAULT_OG_IMAGE] },
}

export default async function PakketilbudPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: bundles } = await payload.find({
    collection: 'product-bundles',
    where: { active: { equals: true } },
    depth: 1,
  })

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <h1 className="text-center">Pakketilbud</h1>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {bundles.map((bundle) => {
          const image = typeof bundle.image === 'object' ? bundle.image : null

          return (
            <ProductCard
              description={bundle.description}
              detailsHref={`/pakketilbud/${bundle.slug}`}
              image={image?.url ? { url: image.url, alt: image.alt } : null}
              key={bundle.id}
              name={bundle.name}
              price={bundle.price}
              productId={bundle.id}
              type="bundle"
            />
          )
        })}
        {bundles.length === 0 && <p>No package deals found.</p>}
      </div>
    </div>
  )
}
