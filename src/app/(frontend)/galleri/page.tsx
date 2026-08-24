import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import '../styles.css'

export default async function GalleriPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: images } = await payload.find({
    collection: 'gallery-images',
    where: { active: { equals: true } },
    sort: 'order',
    depth: 1,
  })

  return (
    <div className="page">
      <h1>Galleri</h1>
      <div className="gallery-grid">
        {images.map((doc) => {
          const image = typeof doc.image === 'object' ? doc.image : null
          if (!image?.url) return null

          return (
            <figure className="gallery-item" key={doc.id}>
              <Image alt={doc.title} fill sizes="(max-width: 768px) 100vw, 33vw" src={image.url} />
              <figcaption>{doc.title}</figcaption>
            </figure>
          )
        })}
        {images.length === 0 && <p>Der er ingen billeder i galleriet endnu.</p>}
      </div>
    </div>
  )
}
