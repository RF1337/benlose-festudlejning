'use server'

import { getPayload } from 'payload'
import { z } from 'zod'

import config from '@/payload.config'
import { formatPrice } from '@/utilities/formatPrice'

const addressSchema = z.object({
  street: z.string().min(1),
  postalCode: z.string().min(1),
  city: z.string().min(1),
  country: z.string().min(1),
})

const orderInputSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  companyName: z.string().optional(),
  customerEmail: z.email(),
  customerPhone: z.string().min(1),
  deliveryMethod: z.enum(['pickup', 'delivery']),
  deliveryAddress: addressSchema,
  billingSameAsDelivery: z.boolean(),
  billingAddress: z
    .object({
      companyName: z.string().optional(),
      name: z.string().min(1),
      street: z.string().min(1),
      postalCode: z.string().min(1),
      city: z.string().min(1),
      country: z.string().min(1),
    })
    .optional(),
  comment: z.string().min(1),
  termsAccepted: z.literal(true),
  items: z
    .object({
      productId: z.number(),
      type: z.enum(['product', 'bundle']),
      quantity: z.number().min(1),
      variants: z.array(z.object({ label: z.string(), value: z.string() })).optional(),
    })
    .array()
    .min(1),
})

export type OrderInput = z.infer<typeof orderInputSchema>

const formatVariants = (variants?: { label: string; value: string }[]) =>
  variants && variants.length > 0 ? variants.map((v) => `${v.label}: ${v.value}`).join(', ') : undefined

const BUSINESS_EMAIL = 'kontakt@benlose-festudlejning.dk'

// TEST MODE: while the site is still in development, route every order email to a single
// test inbox instead of the real customer/business addresses. Set to false to go live.
const TEST_MODE = true
const TEST_EMAIL = 'rasmusferst@gmail.com'

const collectionForType = (type: 'product' | 'bundle') =>
  type === 'bundle' ? ('product-bundles' as const) : ('products' as const)

export async function submitOrder(rawInput: OrderInput) {
  const input = orderInputSchema.parse(rawInput)

  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const entries = await Promise.all(
    input.items.map((item) =>
      payload.findByID({ collection: collectionForType(item.type), id: item.productId }),
    ),
  )

  const customerName = `${input.firstName} ${input.lastName}`.trim()

  await payload.create({
    collection: 'orders',
    data: {
      customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      companyName: input.companyName,
      deliveryMethod: input.deliveryMethod,
      deliveryAddress: input.deliveryAddress,
      billingSameAsDelivery: input.billingSameAsDelivery,
      billingAddress: input.billingSameAsDelivery ? undefined : input.billingAddress,
      termsAccepted: input.termsAccepted,
      comment: input.comment,
      items: input.items.map((item) => ({
        item: { relationTo: collectionForType(item.type), value: item.productId },
        quantity: item.quantity,
        selectedOptions: formatVariants(item.variants),
      })),
    },
  })

  const lines = entries
    .map((entry, i) => {
      const variantText = formatVariants(input.items[i].variants)
      return `${entry.name}${variantText ? ` (${variantText})` : ''} x${input.items[i].quantity} — ${formatPrice(entry.price * input.items[i].quantity)}`
    })
    .join('<br>')
  const total = entries.reduce(
    (sum, entry, i) => sum + entry.price * input.items[i].quantity,
    0,
  )
  const deliveryLine =
    input.deliveryMethod === 'pickup'
      ? 'Afhentning i butikken (Byskovvej 9, Ringsted, 4100)'
      : `Levering til: ${input.deliveryAddress.street}, ${input.deliveryAddress.postalCode} ${input.deliveryAddress.city}`
  const details = `
    <p>${lines}</p>
    <p><strong>I alt: ${formatPrice(total)}</strong></p>
    <p>Levering: ${deliveryLine}</p>
    <p>Kommentar: ${input.comment}</p>
  `

  const testNote = (realTo: string) =>
    TEST_MODE ? `<p><strong>[TEST] Ville normalt være sendt til: ${realTo}</strong></p>` : ''

  await payload.sendEmail({
    to: TEST_MODE ? TEST_EMAIL : input.customerEmail,
    subject: `${TEST_MODE ? '[TEST] ' : ''}Din bestilling hos Benløse Festudlejning`,
    html: `${testNote(input.customerEmail)}<p>Tak for din bestilling, ${customerName}!</p>${details}`,
  })

  try {
    await payload.sendEmail({
      to: TEST_MODE ? TEST_EMAIL : BUSINESS_EMAIL,
      subject: `${TEST_MODE ? '[TEST] ' : ''}Ny bestilling fra ${customerName}`,
      html: `${testNote(BUSINESS_EMAIL)}<p>${customerName} (${input.customerEmail}, ${input.customerPhone}) har bestilt:</p>${details}`,
    })
  } catch (err) {
    console.error('Failed to send order notification to business email:', err)
  }
}
