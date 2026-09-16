import type { CollectionBeforeDeleteHook } from 'payload'
import { APIError } from 'payload'

// Deleting a product that's still referenced elsewhere fails at the database
// level with an opaque "unknown error" (a foreign key constraint), since
// Payload doesn't check other collections before deleting. This gives a
// clear, actionable message instead, and quietly cleans up the harmless
// cross-sell references so those don't block deletion unnecessarily.
export const preventProductDeleteIfInUse: CollectionBeforeDeleteHook = async ({ id, req }) => {
  // Querying into productItems.product via `where` doesn't reliably match on
  // Postgres for this nested array-relationship shape, so filter in JS instead.
  const { docs: allBundles } = await req.payload.find({
    collection: 'product-bundles',
    depth: 0,
    limit: 0,
    req,
  })
  const bundles = allBundles.filter((b) =>
    (b.productItems ?? []).some((item) => (typeof item.product === 'object' ? item.product.id : item.product) === id),
  )

  if (bundles.length > 0) {
    throw new APIError(
      `Kan ikke slette – produktet indgår i følgende pakketilbud: ${bundles.map((b) => b.name).join(', ')}. Fjern det fra pakken/pakkerne (eller slet pakken) først.`,
      400,
    )
  }

  // Same story here: `where: { relatedProducts: { equals: id } } }` doesn't
  // reliably match either, so filter in JS.
  const { docs: allProducts } = await req.payload.find({
    collection: 'products',
    depth: 0,
    limit: 0,
    req,
  })
  const relatedFrom = allProducts.filter((p) =>
    (p.relatedProducts ?? []).some((r) => (typeof r === 'object' ? r.id : r) === id),
  )

  for (const doc of relatedFrom) {
    const remaining = (doc.relatedProducts ?? []).filter((r) => (typeof r === 'object' ? r.id : r) !== id)
    await req.payload.update({
      collection: 'products',
      id: doc.id,
      data: { relatedProducts: remaining },
      req,
    })
  }
}
