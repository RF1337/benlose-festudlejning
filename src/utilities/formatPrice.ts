const formatter = new Intl.NumberFormat('da-DK')

export function formatPrice(amount: number): string {
  return `${formatter.format(amount)} kr`
}

// The lowest price a product can be bought for once you account for variant
// options that override the base price (e.g. tent sizes priced differently),
// and whether that makes it a range worth labelling "Fra" (from) on listings.
export function getPriceRange(
  basePrice: number,
  variants?: { options: { priceOverride?: number | null }[] }[] | null,
): { min: number; hasRange: boolean } {
  const prices = [basePrice]
  for (const group of variants ?? []) {
    for (const option of group.options) {
      if (option.priceOverride != null) prices.push(option.priceOverride)
    }
  }
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  return { min, hasRange: min !== max }
}
