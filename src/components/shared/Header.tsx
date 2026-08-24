'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import logo from '@/assets/benlose-festudlejning-logo.png'
import { CartWidget } from '@/app/(frontend)/cart/CartWidget'

const links = [
  { href: '/', label: 'Home' },
  { href: '/udlejning', label: 'Udlejning' },
  { href: '/pakketilbud', label: 'Pakketilbud' },
  { href: '/galleri', label: 'Galleri' },
  { href: '/lejebetingelser', label: 'Lejebetingelser' },
]

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-200 bg-white text-brand-navy shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 sm:px-10">
        <Link href="/" className="shrink-0">
          <Image alt="Benløse Festudlejning" className="h-14 w-auto" priority src={logo} />
        </Link>

        <nav className="hidden items-center gap-6 text-sm sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="no-underline transition hover:text-brand-gold"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:rasmusferst@gmail.com"
            className="rounded bg-brand-navy px-4 py-1.5 font-bold text-white no-underline transition hover:opacity-90"
          >
            Kontakt
          </a>
          <CartWidget />
        </nav>

        <div className="flex items-center gap-4 sm:hidden">
          <CartWidget />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? 'Luk menu' : 'Åbn menu'}
            aria-expanded={menuOpen}
            className="text-brand-navy"
          >
            {menuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M6 6L18 18M18 6L6 18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7H20M4 12H20M4 17H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-neutral-200 px-6 pb-4 text-sm sm:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded px-2 py-2 no-underline transition hover:bg-neutral-100 hover:text-brand-gold"
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:rasmusferst@gmail.com"
            onClick={() => setMenuOpen(false)}
            className="rounded px-2 py-2 no-underline transition hover:bg-neutral-100 hover:text-brand-gold"
          >
            Kontakt
          </a>
        </nav>
      )}
    </header>
  )
}
