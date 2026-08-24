import { getPayload } from 'payload'

import config from '@/payload.config'
import { FAQAccordion } from './FAQAccordion'

export default async function FAQSection() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs } = await payload.find({
    collection: 'faqs',
    where: { active: { equals: true } },
    sort: 'order',
    limit: 100,
  })

  if (docs.length === 0) return null

  const items = docs.map((doc) => ({
    id: doc.id,
    question: doc.question,
    answer: doc.answer,
  }))

  return (
    <section className="mx-auto my-12 max-w-190 px-6 min-[400px]:px-11.25">
      <h2 className="m-0 mb-6 text-center">Ofte stillede spørgsmål</h2>
      <FAQAccordion items={items} />
    </section>
  )
}
