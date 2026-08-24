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
      className="buy-button"
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
