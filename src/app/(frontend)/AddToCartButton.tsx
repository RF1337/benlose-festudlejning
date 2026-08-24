'use client'

import React, { useState } from 'react'

import { useCart } from './cart/CartContext'

export function AddToCartButton({
  productId,
  name,
  price,
}: {
  productId: number
  name: string
  price: number
}) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  return (
    <button
      className="cursor-pointer rounded border border-brand-navy bg-brand-navy px-4 py-2 text-sm text-white disabled:cursor-default disabled:opacity-60"
      onClick={() => {
        addItem({ productId, name, price })
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
      }}
      type="button"
    >
      {added ? 'Tilføjet!' : 'Læg i kurv'}
    </button>
  )
}
