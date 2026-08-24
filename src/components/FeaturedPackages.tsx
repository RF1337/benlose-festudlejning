import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'

export default async function FeaturedPackages() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: bundles } = await payload.find({
    collection: 'product-bundles',
    where: { active: { equals: true } },
    limit: 3,
    depth: 1,
  })

  if (bundles.length === 0) return null

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 min-[400px]:px-11.25">
      <h2 className="mb-6 text-center text-[28px]">Udvalgte pakketilbud</h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {bundles.map((bundle) => {
          const image = typeof bundle.image === 'object' ? bundle.image : null

          return (
            <div className="rounded-lg border border-neutral-200 p-4" key={bundle.id}>
              {image?.url && (
                <Image
                  alt={image.alt}
                  className="mx-auto mb-3 rounded"
                  height={220}
                  src={image.url}
                  width={220}
                />
              )}
              <h3 className="mb-2 text-xl leading-6.5">{bundle.name}</h3>
              {bundle.description && (
                <p className="mb-2 text-[15px] leading-5.5">{bundle.description}</p>
              )}
              <p className="font-bold">{bundle.price} kr</p>
            </div>
          )
        })}
      </div>
      <div className="mt-8 text-center">
        <Link
          className="inline-block rounded bg-brand-navy px-6 py-2.5 font-bold text-white no-underline"
          href="/pakketilbud"
        >
          Se alle pakketilbud
        </Link>
      </div>
    </section>
  )
}
