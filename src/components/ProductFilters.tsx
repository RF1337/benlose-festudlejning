'use client'

import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { Select } from '@/components/Select'
import { PRODUCT_SORT_OPTIONS } from '@/utilities/sort'

export type FilterCategory = { id: number; name: string; slug: string; parentId: number | null }

function chipClass(active: boolean) {
  return `cursor-pointer no-underline rounded border px-4 py-2 text-sm font-medium transition-colors ${
    active
      ? 'border-brand-navy bg-brand-navy text-white'
      : 'border-neutral-200 bg-white text-brand-navy hover:border-brand-gold'
  }`
}

function subChipClass(active: boolean) {
  return `cursor-pointer no-underline rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
    active
      ? 'border-brand-gold bg-brand-gold/10 text-brand-navy'
      : 'border-neutral-200 bg-white text-neutral-500 hover:border-brand-gold hover:text-brand-navy'
  }`
}

export function ProductFilters({
  categories,
  selectedCategorySlug = null,
}: {
  categories: FilterCategory[]
  selectedCategorySlug?: string | null
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [query, setQuery] = useState(searchParams.get('q') ?? '')
  const sort = searchParams.get('sort') ?? 'name'

  const categoryHref = (slug: string | null) => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('page')
    const qs = params.toString()
    const base = slug ? `/udlejning/kategori/${slug}` : '/udlejning'
    return qs ? `${base}?${qs}` : base
  }

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === 'name') params.delete('sort')
    else params.set('sort', value)
    params.delete('page')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }

  useEffect(() => {
    const currentQ = searchParams.get('q') ?? ''
    if (query === currentQ) return

    const timeout = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString())
      if (query) params.set('q', query)
      else params.delete('q')
      params.delete('page')
      const qs = params.toString()
      const base = selectedCategorySlug ? `/udlejning/kategori/${selectedCategorySlug}` : '/udlejning'
      router.push(qs ? `${base}?${qs}` : base)
    }, 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const byId = new Map(categories.map((c) => [c.id, c]))
  const childrenOf = (parentId: number | null) => categories.filter((c) => c.parentId === parentId)

  // Ancestor chain of the selected category, top-level first, ending with the selection itself.
  const chain: FilterCategory[] = []
  for (let node = categories.find((c) => c.slug === selectedCategorySlug) ?? null; node; ) {
    chain.unshift(node)
    node = node.parentId ? (byId.get(node.parentId) ?? null) : null
  }

  // Subcategories only ever show once their parent is selected -- otherwise "Plastik"
  // (Stole > Plastik) reads as a sitewide material filter instead of a chair type.
  const subRows = chain
    .map((node) => ({ parent: node, children: childrenOf(node.id) }))
    .filter((row) => row.children.length > 0)

  return (
    <div className="mb-8 flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          className="w-full rounded border border-neutral-200 px-4 py-2 text-sm [font:inherit] sm:max-w-sm"
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Søg efter produkter..."
          type="search"
          value={query}
        />
        <Select
          aria-label="Sortér produkter"
          className="rounded border border-neutral-200 py-2 pl-4 text-sm [font:inherit]"
          onChange={(e) => handleSortChange(e.target.value)}
          value={sort}
          wrapperClassName="w-full sm:w-56"
        >
          {PRODUCT_SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <Link className={chipClass(!selectedCategorySlug)} href={categoryHref(null)}>
            Alle
          </Link>
          {childrenOf(null).map((category) => (
            <Link
              className={chipClass(chain.some((c) => c.id === category.id))}
              href={categoryHref(category.slug)}
              key={category.id}
            >
              {category.name}
            </Link>
          ))}
        </div>
        {subRows.map(({ children }, i) => (
          <div className="flex flex-wrap items-center gap-1.5" key={i} style={{ paddingLeft: `${i * 1.25}rem` }}>
            <span aria-hidden="true" className="text-neutral-300">
              &rsaquo;
            </span>
            {children.map((category) => (
              <Link
                className={subChipClass(chain.some((c) => c.id === category.id))}
                href={categoryHref(category.slug)}
                key={category.id}
              >
                {category.name}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
