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
    <div className="hero-carousel">
      {slides.map((slide, i) => (
        <div
          className="hero-carousel-slide"
          key={slide.id}
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <Image alt={slide.alt} fill priority={i === 0} sizes="100vw" src={slide.url} />
        </div>
      ))}

      {slides.length > 1 && (
        <div className="hero-carousel-dots">
          {slides.map((slide, i) => (
            <button
              aria-label={`Vis billede ${i + 1}`}
              className={i === index ? 'active' : ''}
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
