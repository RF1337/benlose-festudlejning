'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

export type FilterCategory = { id: number; name: string }

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

  const selectedCategory = searchParams.get('category')
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

  return (
    <div className="mb-8 flex flex-col gap-4">
      <input
        className="w-full rounded border border-neutral-200 px-4 py-2 text-sm [font:inherit] sm:max-w-sm"
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Søg efter produkter..."
        type="search"
        value={query}
      />
      <div className="flex flex-wrap gap-2">
        <button className={chipClass(!selectedCategory)} onClick={() => updateParams({ category: null })} type="button">
          Alle
        </button>
        {categories.map((category) => {
          const isSelected = selectedCategory === String(category.id)
          return (
            <button
              className={chipClass(isSelected)}
              key={category.id}
              onClick={() => updateParams({ category: isSelected ? null : String(category.id) })}
              type="button"
            >
              {category.name}
            </button>
          )
        })}
      </div>
    </div>
  )
}
