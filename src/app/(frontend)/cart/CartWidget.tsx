'use client'

import { ShoppingBasket } from 'lucide-react'
import React, { useState } from 'react'

import { useCart } from './CartContext'
import { OrderForm } from './OrderForm'
import { formatPrice } from '@/utilities/formatPrice'

export function CartWidget() {
  const { items, itemCount, removeItem, updateQuantity } = useCart()
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const buttonClass = 'h-6 w-6 cursor-pointer rounded border border-neutral-200 bg-white'

  return (
    <div className="relative">
      <button
        aria-label={`Kurv (${itemCount} varer)`}
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded border-none bg-white text-neutral-900"
        onClick={() => setOpen((o) => !o)}
        type="button"
      >
        <ShoppingBasket aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
        {itemCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-xs font-bold text-white">
            {itemCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-75 rounded-lg border border-neutral-200 bg-white p-4 shadow-lg">
          {items.length === 0 && <p className="mb-3 text-sm">Kurven er tom.</p>}
          {items.map((item) => (
            <div
              className="flex flex-col gap-1.5 border-b border-neutral-200 py-2.5 text-sm last:border-b-0"
              key={`${item.type}-${item.productId}`}
            >
              <span className="font-bold">{item.name}</span>
              <div className="flex items-center gap-2">
                <button
                  className={buttonClass}
                  onClick={() => updateQuantity(item.productId, item.type, item.quantity - 1)}
                  type="button"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  className={buttonClass}
                  onClick={() => updateQuantity(item.productId, item.type, item.quantity + 1)}
                  type="button"
                >
                  +
                </button>
                <button
                  className={`${buttonClass} ml-auto w-auto px-2 text-xs`}
                  onClick={() => removeItem(item.productId, item.type)}
                  type="button"
                >
                  Fjern
                </button>
              </div>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
          {items.length > 0 && (
            <>
              <p className="mt-3 font-bold">I alt: {formatPrice(total)}</p>
              <button
                className="w-full cursor-pointer rounded border-none bg-brand-navy py-2.5 font-bold text-white"
                onClick={() => {
                  setShowForm(true)
                  setOpen(false)
                }}
                type="button"
              >
                Gennemfør bestilling
              </button>
            </>
          )}
        </div>
      )}
      {showForm && <OrderForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
