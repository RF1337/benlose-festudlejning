'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'

export type GalleryImage = {
  id: number | string
  url: string
  alt: string
}

const iconButtonClass =
  'z-10 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border border-white/40 bg-black/30 text-white transition-colors hover:bg-black/50'

function ChevronIcon({ direction }: { direction: 'left' | 'right' }) {
  const d = direction === 'left' ? 'M15 6L9 12L15 18' : 'M9 6L15 12L9 18'
  return (
    <svg aria-hidden="true" fill="none" height="20" viewBox="0 0 24 24" width="20">
      <path d={d} stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
      <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

export function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const close = () => setOpenIndex(null)
  const goTo = (i: number) => setOpenIndex((i + images.length) % images.length)

  useEffect(() => {
    if (openIndex === null) return

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowLeft') goTo(openIndex - 1)
      if (e.key === 'ArrowRight') goTo(openIndex + 1)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openIndex, images.length])

  const current = openIndex !== null ? images[openIndex] : null

  return (
    <>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(260px,1fr))] gap-4">
        {images.map((image, i) => (
          <button
            className="group relative m-0 aspect-4/3 cursor-pointer overflow-hidden rounded-lg border-none p-0"
            key={image.id}
            onClick={() => setOpenIndex(i)}
            type="button"
          >
            <Image
              alt={image.alt}
              className="object-cover transition-transform duration-200 group-hover:scale-105"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              src={image.url}
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-6"
          onClick={close}
        >
          <button
            aria-label="Luk"
            className={`${iconButtonClass} absolute right-4 top-4`}
            onClick={close}
            type="button"
          >
            <CloseIcon />
          </button>

          <div
            className="flex h-full max-h-[85vh] w-full max-w-6xl items-center gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            {images.length > 1 && (
              <button
                aria-label="Forrige billede"
                className={`${iconButtonClass} shrink-0`}
                onClick={() => goTo(openIndex! - 1)}
                type="button"
              >
                <ChevronIcon direction="left" />
              </button>
            )}

            <div className="relative h-full min-w-0 flex-1">
              <Image
                alt={current.alt}
                className="object-contain"
                fill
                priority
                sizes="90vw"
                src={current.url}
              />
            </div>

            {images.length > 1 && (
              <button
                aria-label="Næste billede"
                className={`${iconButtonClass} shrink-0`}
                onClick={() => goTo(openIndex! + 1)}
                type="button"
              >
                <ChevronIcon direction="right" />
              </button>
            )}
          </div>

          {images.length > 1 && (
            <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/80">
              {openIndex! + 1} / {images.length}
            </p>
          )}
        </div>
      )}
    </>
  )
}
