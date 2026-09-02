export const PRODUCT_SORT_OPTIONS = [
  { value: 'name', label: 'Alfabetisk (A-Å)' },
  { value: '-createdAt', label: 'Nyeste' },
  { value: '-price', label: 'Pris: Høj til lav' },
  { value: 'price', label: 'Pris: Lav til høj' },
] as const

export type ProductSort = (typeof PRODUCT_SORT_OPTIONS)[number]['value']

const VALID_SORTS = new Set<string>(PRODUCT_SORT_OPTIONS.map((option) => option.value))

export function parseProductSort(sort: string | undefined): ProductSort {
  return sort && VALID_SORTS.has(sort) ? (sort as ProductSort) : 'name'
}
