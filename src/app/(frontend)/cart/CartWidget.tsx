'use client'

import React, { useState } from 'react'

import { useCart } from './CartContext'
import { OrderForm } from './OrderForm'

export function CartWidget() {
  const { items, itemCount, removeItem, updateQuantity } = useCart()
  const [open, setOpen] = useState(false)
  const [showForm, setShowForm] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="cart-widget">
      <button className="cart-toggle" onClick={() => setOpen((o) => !o)} type="button">
        Kurv ({itemCount})
      </button>
      {open && (
        <div className="cart-panel">
          {items.length === 0 && <p>Kurven er tom.</p>}
          {items.map((item) => (
            <div className="cart-item" key={item.productId}>
              <span className="cart-item-name">{item.name}</span>
              <div className="cart-item-controls">
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                  type="button"
                >
                  −
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                  type="button"
                >
                  +
                </button>
                <button
                  className="remove"
                  onClick={() => removeItem(item.productId)}
                  type="button"
                >
                  Fjern
                </button>
              </div>
              <span>{item.price * item.quantity} kr</span>
            </div>
          ))}
          {items.length > 0 && (
            <>
              <p className="cart-total">I alt: {total} kr</p>
              <button
                className="cart-checkout"
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
