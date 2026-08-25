'use client'

import React, { useEffect, useRef, useState } from 'react'

export type AddressResult = { street: string; postalCode: string; city: string }

type Suggestion = AddressResult & { tekst: string }

type DawaResponse = {
  tekst: string
  adresse: { vejnavn: string; husnr: string; postnr: string; postnrnavn: string }
}[]

const inputClass = 'w-full [font:inherit] rounded border border-neutral-200 p-2'

export function AddressAutocomplete({
  id,
  value,
  onChange,
  onSelect,
  required,
}: {
  id?: string
  value: string
  onChange: (value: string) => void
  onSelect: (result: AddressResult) => void
  required?: boolean
}) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const skipFetchRef = useRef(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (skipFetchRef.current) {
      skipFetchRef.current = false
      return
    }
    if (value.trim().length < 3) {
      setSuggestions([])
      setOpen(false)
      return
    }

    const controller = new AbortController()
    const timeout = setTimeout(() => {
      fetch(
        `https://api.dataforsyningen.dk/adresser/autocomplete?q=${encodeURIComponent(value)}&per_side=6`,
        { signal: controller.signal },
      )
        .then((res) => (res.ok ? (res.json() as Promise<DawaResponse>) : []))
        .then((data) => {
          setSuggestions(
            data.map((d) => ({
              tekst: d.tekst,
              street: `${d.adresse.vejnavn} ${d.adresse.husnr}`,
              postalCode: d.adresse.postnr,
              city: d.adresse.postnrnavn,
            })),
          )
          setOpen(true)
          setActiveIndex(-1)
        })
        .catch(() => {})
    }, 250)

    return () => {
      clearTimeout(timeout)
      controller.abort()
    }
  }, [value])

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const pick = (s: Suggestion) => {
    skipFetchRef.current = true
    onChange(s.street)
    onSelect({ street: s.street, postalCode: s.postalCode, city: s.city })
    setOpen(false)
    setSuggestions([])
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault()
      pick(suggestions[activeIndex])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        aria-autocomplete="list"
        aria-expanded={open}
        autoComplete="off"
        className={inputClass}
        id={id}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => suggestions.length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        required={required}
        role="combobox"
        type="text"
        value={value}
      />
      {open && suggestions.length > 0 && (
        <ul
          className="absolute z-10 mt-1 max-h-60 w-full list-none divide-y divide-neutral-100 overflow-y-auto rounded-lg border border-neutral-200 bg-white p-0 m-0 shadow-lg"
          role="listbox"
        >
          {suggestions.map((s, i) => (
            <li key={s.tekst} role="option" aria-selected={i === activeIndex}>
              <button
                className={`block w-full cursor-pointer border-none px-3 py-2 text-left text-sm transition-colors ${
                  i === activeIndex ? 'bg-brand-navy/5' : 'bg-white'
                }`}
                onClick={() => pick(s)}
                onMouseEnter={() => setActiveIndex(i)}
                type="button"
              >
                {s.tekst}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
