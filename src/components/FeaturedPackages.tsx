import Link from 'next/link'
import { getPayload } from 'payload'

import config from '@/payload.config'
import { ProductCard } from '@/components/ProductCard'

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
      <h2 className="m-0 mb-6 text-center">Udvalgte pakketilbud</h2>
      <div className="grid gap-6 sm:grid-cols-3">
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
      </div>
      <div className="mt-8 text-center">
        <Link
          className="inline-block rounded bg-brand-navy px-6 py-2.5 font-bold text-white no-underline transition-colors hover:bg-brand-gold"
          href="/pakketilbud"
        >
          Se alle pakketilbud
        </Link>
      </div>
    </section>
  )
}
