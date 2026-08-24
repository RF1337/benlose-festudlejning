import Image from 'next/image'
import Link from 'next/link'

import { AddToCartButton } from '@/app/(frontend)/AddToCartButton'
import type { CartItemType } from '@/app/(frontend)/cart/CartContext'
import { formatPrice } from '@/utilities/formatPrice'

export function ProductCard({
  productId,
  type,
  name,
  price,
  description,
  image,
  detailsHref,
}: {
  productId: number
  type: CartItemType
  name: string
  price: number
  description?: string | null
  image?: { url: string; alt: string } | null
  detailsHref: string
}) {
  const buttonClass =
    'pointer-events-auto w-full cursor-pointer rounded border border-brand-navy bg-brand-navy px-3 py-2 text-center text-sm font-bold text-white no-underline disabled:cursor-default disabled:opacity-60'

  return (
    <div className="relative flex flex-col overflow-hidden rounded-lg border border-neutral-200">
      <Link aria-label={name} className="absolute inset-0" href={detailsHref} />
      <div className="pointer-events-none relative aspect-square w-full bg-neutral-100">
        {image?.url && (
          <Image
            alt={image.alt}
            className="object-cover"
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            src={image.url}
          />
        )}
      </div>
      <div className="pointer-events-none relative flex flex-1 flex-col gap-2 bg-white p-4">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="m-0 min-w-0 text-xl">{name}</h2>
          <span className="shrink-0 whitespace-nowrap font-bold">{formatPrice(price)}</span>
        </div>
        {description && <p className="m-0 text-sm">{description}</p>}
        <div className="mt-auto pt-3">
          <AddToCartButton className={buttonClass} name={name} price={price} productId={productId} type={type} />
        </div>
      </div>
    </div>
  )
}
