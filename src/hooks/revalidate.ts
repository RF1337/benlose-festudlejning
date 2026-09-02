import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'
import { revalidatePath } from 'next/cache'

// The site is small and richly cross-referenced (bundles -> products -> media,
// gallery images feeding both the homepage hero and /galleri), so revalidating
// the whole tree on any content change is simpler and safer than tracking each
// route's exact data dependencies.
// revalidatePath requires an active Next.js request context. Content changes made
// outside one (e.g. a standalone script using the local API) would otherwise fail
// the whole operation over a cache side effect, so failures here are logged and swallowed.
function safeRevalidate(path: string, type: 'layout' | 'page') {
  try {
    revalidatePath(path, type)
  } catch {
    // no request context to revalidate against — nothing to do
  }
}

export const revalidateAfterChange: CollectionAfterChangeHook = ({ doc, collection, req }) => {
  req.payload.logger.info(`Revalidating site after "${collection.slug}" change`)
  safeRevalidate('/', 'layout')
  return doc
}

export const revalidateAfterDelete: CollectionAfterDeleteHook = ({ doc, collection, req }) => {
  req.payload.logger.info(`Revalidating site after "${collection.slug}" delete`)
  safeRevalidate('/', 'layout')
  return doc
}

export const revalidateGlobalAfterChange: GlobalAfterChangeHook = ({ doc, global, req }) => {
  req.payload.logger.info(`Revalidating site after "${global.slug}" change`)
  safeRevalidate('/', 'layout')
  return doc
}
