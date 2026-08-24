const formatter = new Intl.NumberFormat('da-DK')

export function formatPrice(amount: number): string {
  return `${formatter.format(amount)} kr`
}
