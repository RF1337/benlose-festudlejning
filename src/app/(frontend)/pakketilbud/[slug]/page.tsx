import Link from 'next/link'
import { getPayload } from 'payload'
import { notFound } from 'next/navigation'
import { cache } from 'react'
import type { Metadata } from 'next'
import React from 'react'

import config from '@/payload.config'
import { ProductCard } from '@/components/ProductCard'
import { ProductPurchase } from '@/components/ProductPurchase'
import { ProductJsonLd } from '@/components/StructuredData'
import { absoluteUrl, DEFAULT_DESCRIPTION, DEFAULT_OG_IMAGE, SITE_NAME, truncate } from '@/utilities/seo'
import '../../styles.css'

const getBundle = cache(async (slug: string) => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [{ docs }, { docs: otherBundles }] = await Promise.all([
    payload.find({
      collection: 'product-bundles',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    }),
    payload.find({
      collection: 'product-bundles',
      where: { active: { equals: true }, slug: { not_equals: slug } },
      depth: 1,
      limit: 4,
    }),
  ])

  return { bundle: docs[0], otherBundles }
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const { bundle } = await getBundle(slug)
  if (!bundle || !bundle.active) return {}

  const title = bundle.meta?.title || `${bundle.name} | ${SITE_NAME}`
  const description =
    bundle.meta?.description ||
    (bundle.description ? truncate(bundle.description, 155) : DEFAULT_DESCRIPTION)
  const image = typeof bundle.meta?.image === 'object' ? bundle.meta.image : null
  const fallbackImage = typeof bundle.image === 'object' ? bundle.image : null
  const ogImageUrl = image?.url || fallbackImage?.url
  const ogImage = ogImageUrl ? { url: ogImageUrl, alt: bundle.name } : DEFAULT_OG_IMAGE

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/pakketilbud/${bundle.slug}` },
    openGraph: {
      title,
      description,
      url: `/pakketilbud/${bundle.slug}`,
      images: [ogImage],
    },
  }
}

export default async function BundleDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const { bundle, otherBundles } = await getBundle(slug)
  if (!bundle || !bundle.active) notFound()

  const mainImage = typeof bundle.image === 'object' ? bundle.image : null
  const galleryImages = (bundle.gallery ?? [])
    .map((entry) => {
      const image = typeof entry.image === 'object' ? entry.image : null
      if (!image?.url) return null
      return { url: image.url, alt: bundle.name, matchesVariantValue: null }
    })
    .filter((entry) => entry !== null)
  const images = [
    ...(mainImage?.url ? [{ url: mainImage.url, alt: bundle.name, matchesVariantValue: null }] : []),
    ...galleryImages,
  ]

  const items = (bundle.productItems ?? [])
    .map((entry) => {
      const product = typeof entry.product === 'object' ? entry.product : null
      if (!product) return null
      return { product, quantity: entry.quantity }
    })
    .filter((entry) => entry !== null)
  const otherActiveBundles = otherBundles.filter((b) => b.active)

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <ProductJsonLd
        description={bundle.description}
        image={mainImage?.url ? absoluteUrl(mainImage.url) : null}
        name={bundle.name}
        price={bundle.price}
        url={`/pakketilbud/${bundle.slug}`}
      />
      <Link className="no-underline" href="/pakketilbud">
        ← Tilbage til pakketilbud
      </Link>
      <div className="mt-6 grid gap-8 sm:grid-cols-2">
        <ProductPurchase
          description={bundle.description}
          images={images}
          name={bundle.name}
          price={bundle.price}
          productId={bundle.id}
          type="bundle"
        >
          {items.length > 0 && (
            <div>
              <p className="mb-2 font-semibold">Denne pakke indeholder:</p>
              <ul>
                {items.map(({ product, quantity }) => (
                  <li key={product.id}>
                    {quantity} × {product.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </ProductPurchase>
      </div>

      {otherActiveBundles.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6">Andre pakketilbud, du måske kunne lide</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {otherActiveBundles.map((other) => {
              const otherImage = typeof other.image === 'object' ? other.image : null

              return (
                <ProductCard
                  description={other.description}
                  detailsHref={`/pakketilbud/${other.slug}`}
                  image={otherImage?.url ? { url: otherImage.url, alt: otherImage.alt } : null}
                  key={other.id}
                  name={other.name}
                  price={other.price}
                  productId={other.id}
                  type="bundle"
                />
              )
            })}
          </div>
        </section>
      )}
    </div>
  )
}
