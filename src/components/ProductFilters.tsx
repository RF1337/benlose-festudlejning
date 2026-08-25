'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export type FilterCategory = { id: number; name: string; slug: string; parentId: number | null }

function chipClass(active: boolean) {
  return `cursor-pointer rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
    active
      ? 'border-brand-navy bg-brand-navy text-white'
      : 'border-neutral-200 bg-white text-brand-navy hover:border-brand-gold'
  }`
}

export function ProductFilters({ categories }: { categories: FilterCategory[] }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const selectedSlug = searchParams.get('category')
  const [query, setQuery] = useState(searchParams.get('q') ?? '')

  const updateParams = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value) params.set(key, value)
      else params.delete(key)
    }
    params.delete('page')
    router.push(params.size > 0 ? `${pathname}?${params.toString()}` : pathname)
  }

  useEffect(() => {
    const currentQ = searchParams.get('q') ?? ''
    if (query === currentQ) return

    const timeout = setTimeout(() => updateParams({ q: query || null }), 400)
    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query])

  const byId = new Map(categories.map((c) => [c.id, c]))
  const childrenOf = (parentId: number | null) => categories.filter((c) => c.parentId === parentId)

  // Ancestor chain of the selected category, top-level first, ending with the selection itself.
  const chain: FilterCategory[] = []
  for (let node = categories.find((c) => c.slug === selectedSlug) ?? null; node; ) {
    chain.unshift(node)
    node = node.parentId ? (byId.get(node.parentId) ?? null) : null
  }

  // Subcategories only ever show once their parent is selected -- otherwise "Plastik"
  // (Stole > Plastik) reads as a sitewide material filter instead of a chair type.
  const rows = [childrenOf(null), ...chain.map((node) => childrenOf(node.id)).filter((row) => row.length > 0)]

  const selectCategory = (slug: string) => updateParams({ category: slug === selectedSlug ? null : slug })

  return (
    <div className="mb-8 flex flex-col gap-4">
      <input
        className="w-full rounded border border-neutral-200 px-4 py-2 text-sm [font:inherit] sm:max-w-sm"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Søg efter produkter..."
        type="search"
        value={query}
      />
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-2">
          <button className={chipClass(!selectedSlug)} onClick={() => updateParams({ category: null })} type="button">
            Alle
          </button>
          {rows[0].map((category) => (
            <button
              className={chipClass(chain.some((c) => c.id === category.id))}
              key={category.id}
              onClick={() => selectCategory(category.slug)}
              type="button"
            >
              {category.name}
            </button>
          ))}
        </div>
        {rows.slice(1).map((row, i) => (
          <div className="flex flex-wrap gap-2" key={i} style={{ paddingLeft: `${(i + 1) * 1.5}rem` }}>
            {row.map((category) => (
              <button
                className={chipClass(chain.some((c) => c.id === category.id))}
                key={category.id}
                onClick={() => selectCategory(category.slug)}
                type="button"
              >
                {category.name}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
