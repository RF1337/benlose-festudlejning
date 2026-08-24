'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export type HeroSlide = {
  id: number
  url: string
  alt: string
}

export function HeroCarousel({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return

    const timer = setInterval(() => {
      setIndex((current) => (current + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) return null

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
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2.5">
          {slides.map((slide, i) => (
            <button
              aria-label={`Vis billede ${i + 1}`}
              className={`h-2.5 w-2.5 cursor-pointer rounded-full border border-white p-0 ${
                i === index ? 'bg-white' : 'bg-white/40'
              }`}
              key={slide.id}
              onClick={() => setIndex(i)}
              type="button"
            />
          ))}
        </div>
      )}
    </div>
  )
}
