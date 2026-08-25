'use client'

import { ShoppingBasket, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'

import { useCart } from './CartContext'
import { OrderForm } from './OrderForm'
import { formatPrice } from '@/utilities/formatPrice'

export function CartWidget() {
  const { items, itemCount, removeItem, updateQuantity } = useCart()
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const stepButtonClass = 'h-6 w-6 cursor-pointer rounded border border-neutral-200 bg-white'

  useEffect(() => {
    if (!open) return

    document.body.style.overflow = 'hidden'
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="relative">
      <button
        aria-label={`Kurv (${itemCount} varer)`}
        className="relative flex h-10 w-10 cursor-pointer items-center justify-center rounded border-none bg-white text-neutral-900"
        onClick={() => setOpen(true)}
        type="button"
      >
        <ShoppingBasket aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
        {itemCount > 0 && (
          <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-neutral-900 px-1 text-xs font-bold text-white">
            {itemCount}
          </span>
        )}
      </button>

      <div
        aria-hidden="true"
        className={`fixed inset-0 z-90 bg-black/40 transition-opacity ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
      />

      <div
        aria-label="Indkøbskurv"
        aria-modal="true"
        className={`fixed inset-y-0 right-0 z-90 flex w-full flex-col bg-white shadow-lg transition-transform duration-300 sm:w-96 ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 p-4">
          <h2 className="m-0 text-lg">Kurv</h2>
          <button
            aria-label="Luk kurv"
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded border-none bg-transparent text-neutral-900"
            onClick={() => setOpen(false)}
            type="button"
          >
            <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.75} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 && <p className="text-sm">Kurven er tom.</p>}
          {items.map((item) => (
            <div
              className="flex flex-col gap-1.5 border-b border-neutral-200 py-3 text-sm last:border-b-0"
              key={`${item.type}-${item.productId}-${(item.variants ?? []).map((v) => v.value).join('-')}`}
            >
              <span className="font-bold">{item.name}</span>
              {item.variants && item.variants.length > 0 && (
                <span className="text-xs text-neutral-500">
                  {item.variants.map((v) => `${v.label}: ${v.value}`).join(', ')}
                </span>
              )}
              <div className="flex items-center gap-2">
                <button
                  className={stepButtonClass}
                  onClick={() => updateQuantity(item.productId, item.type, item.quantity - 1, item.variants)}
                  type="button"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  className={stepButtonClass}
                  onClick={() => updateQuantity(item.productId, item.type, item.quantity + 1, item.variants)}
                  type="button"
                >
                  +
                </button>
                <button
                  className={`${stepButtonClass} ml-auto w-auto px-2 text-xs`}
                  onClick={() => removeItem(item.productId, item.type, item.variants)}
                  type="button"
                >
                  Fjern
                </button>
              </div>
              <span>{formatPrice(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className="border-t border-neutral-200 p-4">
            <p className="mb-3 font-bold">I alt: {formatPrice(total)}</p>
            <button
              className="w-full cursor-pointer rounded border-none bg-brand-navy py-2.5 font-bold text-white transition-colors hover:bg-brand-gold"
              onClick={() => {
                setShowForm(true)
                setOpen(false)
              }}
              type="button"
            >
              Gennemfør bestilling
            </button>
          </div>
        )}
      </div>

      {showForm && <OrderForm onClose={() => setShowForm(false)} />}
    </div>
  )
}
