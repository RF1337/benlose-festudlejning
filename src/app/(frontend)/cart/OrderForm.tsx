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
          items: items.map((item) => ({ productId: item.productId, quantity: item.quantity })),
        })
        setStatus('sent')
        clear()
      } catch {
        setStatus('error')
      }
    })
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} type="button">
          ×
        </button>
        {status === 'sent' ? (
          <div>
            <h2>Tak for din bestilling!</h2>
            <p>Vi har sendt en bekræftelse til {email}.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <h2>Dine oplysninger</h2>
            <label>
              Navn
              <input
                onChange={(e) => setName(e.target.value)}
                required
                type="text"
                value={name}
              />
            </label>
            <label>
              Email
              <input
                onChange={(e) => setEmail(e.target.value)}
                required
                type="email"
                value={email}
              />
            </label>
            <label>
              Telefon
              <input onChange={(e) => setPhone(e.target.value)} type="tel" value={phone} />
            </label>
            <label>
              Dato for arrangement
              <input
                onChange={(e) => setEventDate(e.target.value)}
                type="date"
                value={eventDate}
              />
            </label>
            <label>
              Kommentar
              <textarea onChange={(e) => setComment(e.target.value)} value={comment} />
            </label>
            {status === 'error' && (
              <p className="order-status error">Noget gik galt, prøv igen.</p>
            )}
            <button className="cta" disabled={isPending} type="submit">
              {isPending ? 'Sender...' : 'Bekræft bestilling'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
