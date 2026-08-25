'use client'

import { useState } from 'react'

import { AddToCartButton } from '@/app/(frontend)/AddToCartButton'
import type { CartItemType } from '@/app/(frontend)/cart/CartContext'

export type VariantGroup = { label: string; options: string[] }

export function QuantityAddToCart({
  productId,
  type,
  name,
  price,
  variantGroups = [],
}: {
  productId: number
  type: CartItemType
  name: string
  price: number
  variantGroups?: VariantGroup[]
}) {
  const [quantity, setQuantity] = useState(1)
  const [selected, setSelected] = useState<Record<string, string>>(() =>
    Object.fromEntries(variantGroups.map((group) => [group.label, group.options[0]])),
  )

  const stepButtonClass =
    'h-9 w-9 cursor-pointer rounded border border-neutral-200 bg-white text-lg'
  const selectClass =
    'rounded border border-neutral-200 bg-white px-3 py-2 text-sm [font:inherit] cursor-pointer'

  const variants = variantGroups.map((group) => ({ label: group.label, value: selected[group.label] }))

  return (
    <div className="flex flex-col gap-4">
      {variantGroups.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {variantGroups.map((group) => (
            <label className="flex flex-col gap-1 text-sm" key={group.label}>
              {group.label}
              <select
                className={selectClass}
                onChange={(e) => setSelected((prev) => ({ ...prev, [group.label]: e.target.value }))}
                value={selected[group.label]}
              >
                {group.options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
      )}

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
        <AddToCartButton
          name={name}
          price={price}
          productId={productId}
          quantity={quantity}
          type={type}
          variants={variants.length > 0 ? variants : undefined}
        />
      </div>
    </div>
  )
}
