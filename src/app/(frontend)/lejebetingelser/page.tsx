import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { cache } from 'react'
import type { Metadata } from 'next'
import React from 'react'

import config from '@/payload.config'
import { DEFAULT_OG_IMAGE, SITE_NAME } from '@/utilities/seo'
import '../styles.css'

const getPage = cache(async () => {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'lejebetingelser' } },
    limit: 1,
  })
  return docs[0]
})

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage()
  const title = page?.meta?.title || `Lejebetingelser | ${SITE_NAME}`
  const description =
    page?.meta?.description ||
    'Læs vores lejebetingelser for udlejning af festtelt, borde, stole og festudstyr.'

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: '/lejebetingelser' },
    openGraph: { title, description, url: '/lejebetingelser', images: [DEFAULT_OG_IMAGE] },
  }
}

export default async function LejebetingelserPage() {
  const page = await getPage()

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <h1 className="text-center">{page?.title || 'Lejebetingelser'}</h1>
      {page?.content ? (
        <RichText data={page.content} />
      ) : (
        <p>
          Ingen lejebetingelser er tilføjet endnu. Opret en side med slug &quot;lejebetingelser&quot;
          i admin-panelet.
        </p>
      )}
    </div>
  )
}
