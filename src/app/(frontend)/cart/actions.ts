'use server'

import { getPayload } from 'payload'

import config from '@/payload.config'

type CartItemType = 'product' | 'bundle'

type OrderInput = {
  customerName: string
  customerEmail: string
  customerPhone?: string
  eventDate?: string
  comment?: string
  items: { productId: number; type: CartItemType; quantity: number }[]
}

const BUSINESS_EMAIL = 'kontakt@benlose-festudlejning.dk'

const collectionForType = (type: CartItemType) =>
  type === 'bundle' ? ('product-bundles' as const) : ('products' as const)

export async function submitOrder(input: OrderInput) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const entries = await Promise.all(
    input.items.map((item) =>
      payload.findByID({ collection: collectionForType(item.type), id: item.productId }),
    ),
  )

  await payload.create({
    collection: 'orders',
    data: {
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      eventDate: input.eventDate,
      comment: input.comment,
      items: input.items.map((item) => ({
        item: { relationTo: collectionForType(item.type), value: item.productId },
        quantity: item.quantity,
      })),
    },
  })

  const lines = entries
    .map(
      (entry, i) =>
        `${entry.name} x${input.items[i].quantity} — ${entry.price * input.items[i].quantity} kr`,
    )
    .join('<br>')
  const total = entries.reduce(
    (sum, entry, i) => sum + entry.price * input.items[i].quantity,
    0,
  )
  const details = `
    <p>${lines}</p>
    <p><strong>I alt: ${total} kr</strong></p>
    ${input.eventDate ? `<p>Dato for arrangement: ${input.eventDate}</p>` : ''}
    ${input.comment ? `<p>Kommentar: ${input.comment}</p>` : ''}
  `

  await payload.sendEmail({
    to: input.customerEmail,
    subject: 'Din bestilling hos Benløse Festudlejning',
    html: `<p>Tak for din bestilling, ${input.customerName}!</p>${details}`,
  })

  try {
    await payload.sendEmail({
      to: BUSINESS_EMAIL,
      subject: `Ny bestilling fra ${input.customerName}`,
      html: `<p>${input.customerName} (${input.customerEmail}${
        input.customerPhone ? `, ${input.customerPhone}` : ''
      }) har bestilt:</p>${details}`,
    })
  } catch (err) {
    console.error('Failed to send order notification to business email:', err)
  }
}
