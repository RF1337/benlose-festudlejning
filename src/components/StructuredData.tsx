import { BUSINESS } from '@/utilities/business'
import { absoluteUrl, SITE_NAME, SITE_URL } from '@/utilities/seo'

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
      type="application/ld+json"
    />
  )
}

export function LocalBusinessJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: BUSINESS.name,
    url: SITE_URL,
    image: absoluteUrl('/og-image.jpg'),
    telephone: BUSINESS.telephone,
    email: BUSINESS.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: BUSINESS.address.streetAddress,
      postalCode: BUSINESS.address.postalCode,
      addressLocality: BUSINESS.address.addressLocality,
      addressCountry: BUSINESS.address.addressCountry,
    },
    areaServed: BUSINESS.areaServed,
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: BUSINESS.openingHours.opens,
      closes: BUSINESS.openingHours.closes,
    },
    sameAs: BUSINESS.sameAs,
  }

  return <JsonLd data={data} />
}

export function BreadcrumbListJsonLd({ items }: { items: { name: string; url: string }[] }) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  }

  return <JsonLd data={data} />
}

export function ProductJsonLd({
  name,
  description,
  image,
  price,
  url,
  availability = 'https://schema.org/InStock',
}: {
  availability?: string
  description?: string | null
  image?: string | null
  name: string
  price: number
  url: string
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description: description || undefined,
    image: image ? [image] : undefined,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: absoluteUrl(url),
      priceCurrency: 'DKK',
      price,
      availability,
      seller: { '@type': 'LocalBusiness', name: SITE_NAME },
    },
  }

  return <JsonLd data={data} />
}
