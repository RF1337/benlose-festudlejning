import type { Category } from '@/payload-types'

export function categoryChain(categoryId: number, byId: Map<number, Category>): Category[] {
  const category = byId.get(categoryId)
  if (!category) return []
  const parentId = category.parent
    ? typeof category.parent === 'object'
      ? category.parent.id
      : category.parent
    : null
  const parents = parentId ? categoryChain(parentId, byId) : []
  return [...parents, category]
}

export function parentId(category: Category): number | null {
  if (!category.parent) return null
  return typeof category.parent === 'object' ? category.parent.id : category.parent
}

// Selecting "Stole" should include products tagged directly with a descendant like
// Stole > Plastik, not just products tagged with "Stole" itself.
export function descendantIds(categoryId: number, categories: Category[]): number[] {
  const children = categories.filter((c) => parentId(c) === categoryId)
  return [categoryId, ...children.flatMap((c) => descendantIds(c.id, categories))]
}
