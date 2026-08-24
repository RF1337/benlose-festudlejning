'use client'

import React, { useState } from 'react'

import { CartItemType, useCart } from './cart/CartContext'

export function AddToCartButton({
  productId,
  type = 'product',
  name,
  price,
  quantity = 1,
  className,
}: {
  productId: number
  type?: CartItemType
  name: string
  price: number
  quantity?: number
  className?: string
}) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  return (
    <button
      className={
        className ??
        'cursor-pointer rounded border border-brand-navy bg-brand-navy px-4 py-2 text-sm text-white transition-colors hover:border-brand-gold hover:bg-brand-gold disabled:cursor-default disabled:opacity-60 disabled:hover:border-brand-navy disabled:hover:bg-brand-navy'
      }
      onClick={() => {
        addItem({ productId, type, name, price }, quantity)
        setAdded(true)
        setTimeout(() => setAdded(false), 1500)
      }}
      type="button"
    >
      {added ? 'Tilføjet!' : 'Læg i kurv'}
    </button>
  )
}
