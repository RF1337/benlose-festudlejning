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
    limit: 0,
    depth: 1,
  })

  return (
    <div className="mx-auto max-w-5xl p-6 min-[400px]:p-11.25">
      <h1 className="text-center">Galleri</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {images.map((doc) => {
          const image = typeof doc.image === 'object' ? doc.image : null
          if (!image?.url) return null

          return (
            <figure className="relative m-0 aspect-4/3 overflow-hidden rounded-lg" key={doc.id}>
              <Image
                alt={doc.title}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                src={image.url}
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/60 to-transparent px-3 py-2 text-xs text-white">
                {doc.title}
              </figcaption>
            </figure>
          )
        })}
        {images.length === 0 && <p>Der er ingen billeder i galleriet endnu.</p>}
      </div>
    </div>
  )
}
