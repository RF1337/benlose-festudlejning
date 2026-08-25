export const SITE_URL = 'https://benlose-festudlejning.dk'

export const SITE_NAME = 'Benløse Festudlejning'

export const DEFAULT_TITLE = 'Benløse Festudlejning | Telt- og festudlejning i Ringsted og på Sjælland'

export const DEFAULT_DESCRIPTION =
  'Lej festtelt, borde, stole og festudstyr hos Benløse Festudlejning i Ringsted. Vi leverer og opsætter i hele Sjælland – book din fest i dag.'

export const DEFAULT_OG_IMAGE = { url: '/og-image.jpg', width: 1200, height: 630, alt: SITE_NAME }

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, SITE_URL).toString()
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength - 1).trimEnd()}…`
}
