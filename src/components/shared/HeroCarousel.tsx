'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export type HeroSlide = {
  id: number
  url: string
  alt: string
}

const arrowButtonClass =
  'absolute top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-black/30 text-white transition-colors hover:bg-black/50'

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [index, slides.length])

  if (slides.length === 0) return null

  const goTo = (i: number) => setIndex((i + slides.length) % slides.length)

  return (
    <div className="relative h-dvh w-full overflow-hidden bg-neutral-900">
      {slides.map((slide, i) => (
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-1200 ease-in-out"
          key={slide.id}
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image
            alt={slide.alt}
            className="object-cover"
            fill
            priority={i === 0}
            sizes="100vw"
            src={slide.url}
          />
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            aria-label="Forrige billede"
            className={`${arrowButtonClass} left-4`}
            onClick={() => goTo(index - 1)}
            type="button"
          >
            <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
              <path d="M15 6L9 12L15 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>
          <button
            aria-label="Næste billede"
            className={`${arrowButtonClass} right-4`}
            onClick={() => goTo(index + 1)}
            type="button"
          >
            <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
              <path d="M9 6L15 12L9 18" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
            </svg>
          </button>

          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
            {slides.map((slide, i) => (
              <button
                aria-label={`Vis billede ${i + 1}`}
                className={`h-2.5 w-2.5 cursor-pointer rounded-full border border-white p-0 ${
                  i === index ? 'bg-white' : 'bg-white/40'
                }`}
                key={slide.id}
                onClick={() => goTo(i)}
                type="button"
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
