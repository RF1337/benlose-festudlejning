'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

export type CartItemType = 'product' | 'bundle'

export type CartItem = {
  productId: number
  type: CartItemType
  name: string
  price: number
  quantity: number
}

type CartContextValue = {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>, quantity?: number) => void
  removeItem: (productId: number, type: CartItemType) => void
  updateQuantity: (productId: number, type: CartItemType, quantity: number) => void
  clear: () => void
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

const STORAGE_KEY = 'benlose-cart'

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) setItems(JSON.parse(stored))
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (hydrated) localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items, hydrated])

  const addItem: CartContextValue['addItem'] = (item, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId && i.type === item.type)
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId && i.type === item.type
            ? { ...i, quantity: i.quantity + quantity }
            : i,
        )
      }
      return [...prev, { ...item, quantity }]
    })
  }

  const removeItem: CartContextValue['removeItem'] = (productId, type) => {
    setItems((prev) => prev.filter((i) => !(i.productId === productId && i.type === type)))
  }

  const updateQuantity: CartContextValue['updateQuantity'] = (productId, type, quantity) => {
    setItems((prev) =>
      quantity <= 0
        ? prev.filter((i) => !(i.productId === productId && i.type === type))
        : prev.map((i) =>
            i.productId === productId && i.type === type ? { ...i, quantity } : i,
          ),
    )
  }

  const clear = () => setItems([])

  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clear, itemCount }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
