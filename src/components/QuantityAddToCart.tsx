'use client'

import { useState } from 'react'

import { AddToCartButton } from '@/app/(frontend)/AddToCartButton'
import type { CartItemType } from '@/app/(frontend)/cart/CartContext'

export function QuantityAddToCart({
  productId,
  type,
  name,
  price,
}: {
  productId: number
  type: CartItemType
  name: string
  price: number
}) {
  const [quantity, setQuantity] = useState(1)

  const stepButtonClass =
    'h-9 w-9 cursor-pointer rounded border border-neutral-200 bg-white text-lg'

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <button
          aria-label="Reducer antal"
          className={stepButtonClass}
          onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          type="button"
        >
          −
        </button>
        <span className="w-6 text-center">{quantity}</span>
        <button
          aria-label="Øg antal"
          className={stepButtonClass}
          onClick={() => setQuantity((q) => q + 1)}
          type="button"
        >
          +
        </button>
      </div>
      <AddToCartButton name={name} price={price} productId={productId} quantity={quantity} type={type} />
    </div>
  )
}
