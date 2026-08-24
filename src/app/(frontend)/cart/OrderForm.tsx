'use client'

import React, { useState, useTransition } from 'react'

import { submitOrder } from './actions'
import { useCart } from './CartContext'

export function OrderForm({ onClose }: { onClose: () => void }) {
  const { items, clear } = useCart()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [comment, setComment] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        await submitOrder({
          customerName: name,
          customerEmail: email,
          customerPhone: phone || undefined,
          eventDate: eventDate || undefined,
          comment: comment || undefined,
          items: items.map((item) => ({
            productId: item.productId,
            type: item.type,
            quantity: item.quantity,
          })),
        })
        setStatus('sent')
        clear()
      } catch {
        setStatus('error')
      }
    })
  }

  const inputClass = '[font:inherit] rounded border border-neutral-200 p-2'

  return (
    <div
      className="fixed inset-0 z-30 flex items-center justify-center bg-black/40 p-6"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-105 overflow-y-auto rounded-lg bg-white p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="absolute right-4 top-3 cursor-pointer border-none bg-transparent text-2xl leading-none"
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        {status === 'sent' ? (
          <div>
            <h2 className="m-0 mb-3">Tak for din bestilling!</h2>
            <p>Vi har sendt en bekræftelse til {email}.</p>
          </div>
        ) : (
          <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
            <h2 className="m-0">Dine oplysninger</h2>
            <label className="flex flex-col gap-1 text-sm">
              Navn
              <input
                className={inputClass}
                onChange={(e) => setName(e.target.value)}
                required
                type="text"
                value={name}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Email
              <input
                className={inputClass}
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Telefon
              <input
                className={inputClass}
                onChange={(e) => setPhone(e.target.value)}
                type="tel"
                value={phone}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Dato for arrangement
              <input
                className={inputClass}
                onChange={(e) => setEventDate(e.target.value)}
                type="date"
                value={eventDate}
              />
            </label>
            <label className="flex flex-col gap-1 text-sm">
              Kommentar
              <textarea
                className={`${inputClass} min-h-17.5 resize-y`}
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
            </label>
            {status === 'error' && (
              <p className="text-sm text-red-600">Noget gik galt, prøv igen.</p>
            )}
            <button
              className="inline-block cursor-pointer rounded border-none bg-brand-navy px-6 py-2.5 font-bold text-white transition-colors hover:bg-brand-gold disabled:cursor-default disabled:opacity-60 disabled:hover:bg-brand-navy"
              disabled={isPending}
              type="submit"
            >
              {isPending ? 'Sender...' : 'Bekræft bestilling'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
