'use client'

import Link from 'next/link'
import React, { useState, useTransition } from 'react'

import { submitOrder } from '../cart/actions'
import { useCart } from '../cart/CartContext'
import { AddressAutocomplete } from '@/components/AddressAutocomplete'
import { formatPrice } from '@/utilities/formatPrice'

const inputClass = '[font:inherit] rounded border border-neutral-200 p-2'
const labelClass = 'flex flex-col gap-1 text-sm'

function Section({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-lg border border-neutral-200 p-6">
      <h2 className="mb-4 flex items-center gap-3 font-sans text-lg font-bold text-brand-navy">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-navy text-sm font-bold text-white">
          {number}
        </span>
        {title}
      </h2>
      {children}
    </section>
  )
}

export default function CheckoutPage() {
  const { items, clear } = useCart()
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<'idle' | 'sent' | 'error'>('idle')

  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [street, setStreet] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [city, setCity] = useState('')
  const [phone, setPhone] = useState('')

  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery'>('pickup')

  const [billingSame, setBillingSame] = useState(true)
  const [billingCompanyName, setBillingCompanyName] = useState('')
  const [billingName, setBillingName] = useState('')
  const [billingStreet, setBillingStreet] = useState('')
  const [billingPostalCode, setBillingPostalCode] = useState('')
  const [billingCity, setBillingCity] = useState('')

  const [comment, setComment] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    startTransition(async () => {
      try {
        await submitOrder({
          firstName,
          lastName,
          companyName: companyName || undefined,
          customerEmail: email,
          customerPhone: phone,
          deliveryMethod,
          deliveryAddress: { street, postalCode, city, country: 'DK' },
          billingSameAsDelivery: billingSame,
          billingAddress: billingSame
            ? undefined
            : {
                companyName: billingCompanyName || undefined,
                name: billingName,
                street: billingStreet,
                postalCode: billingPostalCode,
                city: billingCity,
                country: 'DK',
              },
          comment,
          termsAccepted: true,
          items: items.map((item) => ({
            productId: item.productId,
            type: item.type,
            quantity: item.quantity,
            variants: item.variants,
          })),
        })
        setStatus('sent')
        clear()
      } catch {
        setStatus('error')
      }
    })
  }

  if (status === 'sent') {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center min-[400px]:p-11.25">
        <h1>Tak for din bestilling!</h1>
        <p>Vi har sendt en bekræftelse til {email}.</p>
        <Link
          className="inline-block rounded bg-brand-navy px-6 py-2.5 font-bold text-white no-underline transition-colors hover:bg-brand-gold"
          href="/"
        >
          Til forsiden
        </Link>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl p-6 text-center min-[400px]:p-11.25">
        <h1>Kurven er tom</h1>
        <p>Du skal lægge varer i kurven, før du kan gennemføre en bestilling.</p>
        <Link
          className="inline-block rounded bg-brand-navy px-6 py-2.5 font-bold text-white no-underline transition-colors hover:bg-brand-gold"
          href="/udlejning"
        >
          Se udlejning
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <h1>Kassen</h1>
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
          <Section number={1} title="Leveringsadresse">
            <div className="flex flex-col gap-4">
              <label className={labelClass}>
                E-mail
                <input
                  className={inputClass}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  type="email"
                  value={email}
                />
              </label>
              <div className="flex flex-col gap-1 text-sm">
                <span>Land</span>
                <span className={`${inputClass} bg-neutral-50 text-neutral-600`}>Danmark</span>
              </div>
              <label className={labelClass}>
                Firmanavn (valgfrit)
                <input
                  className={inputClass}
                  onChange={(e) => setCompanyName(e.target.value)}
                  type="text"
                  value={companyName}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Fornavn
                  <input
                    className={inputClass}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    type="text"
                    value={firstName}
                  />
                </label>
                <label className={labelClass}>
                  Efternavn
                  <input
                    className={inputClass}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                    type="text"
                    value={lastName}
                  />
                </label>
              </div>
              <label className={labelClass}>
                Gade/vej og nummer
                <AddressAutocomplete
                  onChange={setStreet}
                  onSelect={(result) => {
                    setStreet(result.street)
                    setPostalCode(result.postalCode)
                    setCity(result.city)
                  }}
                  required
                  value={street}
                />
                <span className="text-xs font-normal text-neutral-500">
                  Postnummer og by udfyldes automatisk, når du vælger en adresse.
                </span>
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className={labelClass}>
                  Postnummer
                  <input
                    className={inputClass}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                    type="text"
                    value={postalCode}
                  />
                </label>
                <label className={labelClass}>
                  By
                  <input
                    className={inputClass}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    type="text"
                    value={city}
                  />
                </label>
              </div>
              <label className={labelClass}>
                Telefonnummer
                <input
                  className={inputClass}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  type="tel"
                  value={phone}
                />
              </label>
            </div>
          </Section>

          <Section number={2} title="Levering">
            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-start gap-3 rounded border border-neutral-200 p-3 has-checked:border-brand-gold">
                <input
                  checked={deliveryMethod === 'pickup'}
                  className="mt-1"
                  name="deliveryMethod"
                  onChange={() => setDeliveryMethod('pickup')}
                  type="radio"
                  value="pickup"
                />
                <span className="flex flex-1 flex-col gap-0.5 text-sm">
                  <span className="flex items-center justify-between font-bold">
                    <span>Afhentning i butikken</span>
                    <span>Gratis</span>
                  </span>
                  <span className="text-neutral-600">
                    Afhentning i vores butik: Byskovvej 9, Ringsted, 4100, Sjælland
                  </span>
                </span>
              </label>
              <label className="flex cursor-pointer items-start gap-3 rounded border border-neutral-200 p-3 has-checked:border-brand-gold">
                <input
                  checked={deliveryMethod === 'delivery'}
                  className="mt-1"
                  name="deliveryMethod"
                  onChange={() => setDeliveryMethod('delivery')}
                  type="radio"
                  value="delivery"
                />
                <span className="flex flex-1 flex-col gap-0.5 text-sm">
                  <span className="flex items-center justify-between font-bold">
                    <span>Levering til adresse</span>
                    <span>Beregnes senere</span>
                  </span>
                  <span className="text-neutral-600">
                    Vi kører varerne ud til leveringsadressen ovenfor. Prisen på leveringen vil
                    fremgå af din endelige ordrebekræftelse/faktura.
                  </span>
                </span>
              </label>
            </div>
          </Section>

          <Section number={3} title="Faktureringsadresse">
            <div className="flex flex-col gap-3">
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  checked={billingSame}
                  onChange={() => setBillingSame(true)}
                  name="billingSame"
                  type="radio"
                />
                Samme som leveringsadressen
              </label>
              <label className="flex cursor-pointer items-center gap-3 text-sm">
                <input
                  checked={!billingSame}
                  onChange={() => setBillingSame(false)}
                  name="billingSame"
                  type="radio"
                />
                Brug en anden faktureringsadresse
              </label>

              {!billingSame && (
                <div className="mt-2 flex flex-col gap-4 border-t border-neutral-200 pt-4">
                  <label className={labelClass}>
                    Firmanavn (valgfrit)
                    <input
                      className={inputClass}
                      onChange={(e) => setBillingCompanyName(e.target.value)}
                      type="text"
                      value={billingCompanyName}
                    />
                  </label>
                  <label className={labelClass}>
                    Navn
                    <input
                      className={inputClass}
                      onChange={(e) => setBillingName(e.target.value)}
                      required={!billingSame}
                      type="text"
                      value={billingName}
                    />
                  </label>
                  <label className={labelClass}>
                    Gade/vej og nummer
                    <AddressAutocomplete
                      onChange={setBillingStreet}
                      onSelect={(result) => {
                        setBillingStreet(result.street)
                        setBillingPostalCode(result.postalCode)
                        setBillingCity(result.city)
                      }}
                      required={!billingSame}
                      value={billingStreet}
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className={labelClass}>
                      Postnummer
                      <input
                        className={inputClass}
                        onChange={(e) => setBillingPostalCode(e.target.value)}
                        required={!billingSame}
                        type="text"
                        value={billingPostalCode}
                      />
                    </label>
                    <label className={labelClass}>
                      By
                      <input
                        className={inputClass}
                        onChange={(e) => setBillingCity(e.target.value)}
                        required={!billingSame}
                        type="text"
                        value={billingCity}
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </Section>

          <Section number={4} title="Betaling">
            <p className="m-0 text-sm text-neutral-600">
              Betalingsinformationer vil fremgå af din faktura.
            </p>
          </Section>

          <Section number={5} title="Kommentar">
            <label className={labelClass}>
              Har du noget at tilføje?
              <textarea
                className={`${inputClass} min-h-24 resize-y`}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Husk at skrive datoen for dit arrangement."
                required
                value={comment}
              />
            </label>
          </Section>

          <label className="flex items-start gap-3 text-sm">
            <input
              checked={termsAccepted}
              className="mt-1"
              onChange={(e) => setTermsAccepted(e.target.checked)}
              required
              type="checkbox"
            />
            <span>
              Jeg har læst og er enig i{' '}
              <Link className="text-brand-navy underline hover:text-brand-gold" href="/lejebetingelser">
                Vilkår og betingelser
              </Link>
            </span>
          </label>

          {status === 'error' && (
            <p className="text-sm text-red-600">Noget gik galt, prøv igen.</p>
          )}

          <button
            className="inline-block cursor-pointer rounded border-none bg-brand-navy px-6 py-3 font-bold text-white transition-colors hover:bg-brand-gold disabled:cursor-default disabled:opacity-60 disabled:hover:bg-brand-navy"
            disabled={isPending}
            type="submit"
          >
            {isPending ? 'Sender...' : 'Bekræft bestilling'}
          </button>
        </form>

        <aside className="h-fit rounded-lg border border-neutral-200 p-6">
          <h2 className="mb-4 font-sans text-lg font-bold text-brand-navy">Din bestilling</h2>
          <div className="flex flex-col gap-4">
            {items.map((item) => (
              <div
                className="flex items-start justify-between gap-4 text-sm"
                key={`${item.type}-${item.productId}-${(item.variants ?? []).map((v) => v.value).join('-')}`}
              >
                <div>
                  <p className="m-0 font-bold">
                    {item.name} <span className="font-normal text-neutral-500">× {item.quantity}</span>
                  </p>
                  {item.variants && item.variants.length > 0 && (
                    <p className="m-0 text-xs text-neutral-500">
                      {item.variants.map((v) => `${v.label}: ${v.value}`).join(', ')}
                    </p>
                  )}
                </div>
                <span className="shrink-0">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-col gap-2 border-t border-neutral-200 pt-4 text-sm">
            <div className="flex justify-between">
              <span>Levering</span>
              <span>{deliveryMethod === 'pickup' ? 'Gratis' : 'Beregnes senere'}</span>
            </div>
            <div className="flex justify-between font-bold">
              <span>I alt</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
