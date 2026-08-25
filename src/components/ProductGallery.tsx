'use client'

import Image from 'next/image'

export type GalleryPhoto = { url: string; alt: string; matchesVariantValue?: string | null }

export function ProductGallery({
  images,
  activeIndex,
  onSelect,
}: {
  images: GalleryPhoto[]
  activeIndex: number
  onSelect: (index: number) => void
}) {
  const active = images[activeIndex] ?? images[0]

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-neutral-100">
        {active && (
          <Image
            alt={active.alt}
            className="object-cover"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            src={active.url}
          />
        )}
      </div>
      {images.length > 1 && (
        <div className="flex flex-wrap gap-2">
          {images.map((image, i) => (
            <button
              aria-label={`Vis billede ${i + 1}`}
              className={`relative h-16 w-16 shrink-0 cursor-pointer overflow-hidden rounded border-2 transition-colors ${
                i === activeIndex ? 'border-brand-gold' : 'border-transparent hover:border-neutral-200'
              }`}
              key={i}
              onClick={() => onSelect(i)}
              type="button"
            >
              <Image alt={image.alt} className="object-cover" fill sizes="64px" src={image.url} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
