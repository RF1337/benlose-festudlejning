import { getPayload } from 'payload'
import { RichText } from '@payloadcms/richtext-lexical/react'
import React from 'react'

import config from '@/payload.config'
import '../styles.css'

export default async function LejebetingelserPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'pages',
    where: { slug: { equals: 'lejebetingelser' } },
    limit: 1,
  })
  const page = docs[0]

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
