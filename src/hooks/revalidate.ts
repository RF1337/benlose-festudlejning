import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

// The site is small and richly cross-referenced (bundles -> products -> media,
// gallery images feeding both the homepage hero and /galleri), so revalidating
// the whole tree on any content change is simpler and safer than tracking each
// route's exact data dependencies.
export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, collection, req }) => {
  req.payload.logger.info(`Revalidating site after "${collection.slug}" change`)
  revalidatePath('/', 'layout')
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, collection, req }) => {
  req.payload.logger.info(`Revalidating site after "${collection.slug}" delete`)
  revalidatePath('/', 'layout')
  return doc
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ doc, global, req }) => {
  req.payload.logger.info(`Revalidating site after "${global.slug}" change`)
  revalidatePath('/', 'layout')
  return doc
}
