import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { GalleryLightbox } from '@/components/GalleryLightbox'
import '../styles.css'

export default async function GalleriPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'gallery-images',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 0,
    depth: 1,
  })

  const images = docs
    .map((doc) => {
      const image = typeof doc.image === 'object' ? doc.image : null
      if (!image?.url) return null
      return { id: doc.id, url: image.url, alt: doc.title }
    })
    .filter((image) => image !== null)

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <h1 className="text-center">Galleri</h1>
      {images.length > 0 ? (
        <GalleryLightbox images={images} />
      ) : (
        <p>Der er ingen billeder i galleriet endnu.</p>
      )}
    </div>
  )
}
