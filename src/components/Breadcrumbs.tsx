import Link from 'next/link'

export type Crumb = { label: string; href?: string }

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Brødkrumme" className="mb-6 text-sm text-neutral-600">
      {items.map((item, i) => (
        <span key={i}>
          {item.href ? (
            <Link className="text-neutral-600 no-underline hover:text-brand-gold hover:underline" href={item.href}>
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="text-brand-navy">
              {item.label}
            </span>
          )}
          {i < items.length - 1 && <span className="mx-2 text-neutral-400">/</span>}
        </span>
      ))}
    </nav>
  )
}
