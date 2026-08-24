import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'

export default async function PartyGallery() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: images } = await payload.find({
    collection: 'gallery-images',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 10,
    depth: 1,
  })

  if (images.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 min-[400px]:px-11.25">
      <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h2 className="m-0">Events vi har været med til</h2>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {images.map((doc, i) => {
          const image = typeof doc.image === 'object' ? doc.image : null
          if (!image?.url) return null

          const isLarge = i < 2

          return (
            <figure
              className={`relative m-0 overflow-hidden rounded-lg ${
                isLarge ? 'col-span-2 aspect-16/10' : 'col-span-1 aspect-4/3'
              }`}
              key={doc.id}
            >
              <Image
                alt={doc.title}
                className="object-cover"
                fill
                sizes={isLarge ? '(max-width: 768px) 100vw, 50vw' : '(max-width: 768px) 50vw, 25vw'}
                src={image.url}
              />
            </figure>
          )
        })}
      </div>
      <div className="mt-8 text-center">
        <Link
          className="inline-block rounded bg-brand-navy px-6 py-2.5 font-bold text-white no-underline transition-colors hover:bg-brand-gold"
          href="/galleri"
        >
          Vis fulde galleri
        </Link>
      </div>
    </section>
  )
}
