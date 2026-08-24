import { getPayload } from 'payload'
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
    <div className="page">
      <h1>{page?.title || 'Lejebetingelser'}</h1>
      {page?.content ? (
        page.content.split('\n').map((paragraph, i) => <p key={i}>{paragraph}</p>)
      ) : (
        <p>
          Ingen lejebetingelser er tilføjet endnu. Opret en side med slug &quot;lejebetingelser&quot;
          i admin-panelet.
        </p>
      )}
    </div>
  )
}
