'use client'

import { useEffect, useState } from 'react'

import { ProductGallery, type GalleryPhoto } from './ProductGallery'
import { QuantityAddToCart, type VariantGroup } from './QuantityAddToCart'
import type { CartItemType } from '@/app/(frontend)/cart/CartContext'
import { formatPrice } from '@/utilities/formatPrice'

export function ProductPurchase({
  productId,
  type,
  name,
  price,
  description,
  images,
  variantGroups = [],
}: {
  productId: number
  type: CartItemType
  name: string
  price: number
  description?: string | null
  images: GalleryPhoto[]
  variantGroups?: VariantGroup[]
}) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(variantGroups.map((group) => [group.label, group.options[0]])),
  )

  useEffect(() => {
    const values = Object.values(selected)
    const matchIndex = images.findIndex((img) => img.matchesVariantValue && values.includes(img.matchesVariantValue))
    if (matchIndex !== -1) setActiveImageIndex(matchIndex)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(selected)])

  return (
    <>
      <ProductGallery activeIndex={activeImageIndex} images={images} onSelect={setActiveImageIndex} />
      <div>
        <h1 className="m-0">{name}</h1>
        <p className="mb-2 font-bold">{formatPrice(price)}</p>
        {description && <p>{description}</p>}
        <QuantityAddToCart
          name={name}
          onVariantChange={(label, value) => setSelected((prev) => ({ ...prev, [label]: value }))}
          price={price}
          productId={productId}
          selected={selected}
          type={type}
          variantGroups={variantGroups}
        />
      </div>
    </>
  )
}
