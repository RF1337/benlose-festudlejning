import React from 'react'
import type { Metadata } from 'next'
import { Instrument_Serif } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { CartProvider } from './cart/CartContext'
import './styles.css'
import './tailwind.css'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'
import { LocalBusinessJsonLd } from '@/components/StructuredData'
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, SITE_NAME, SITE_URL } from '@/utilities/seo'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'da_DK',
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: '/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: 'summary_large_image',
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="da" className={instrumentSerif.variable}>
      <body>
        <LocalBusinessJsonLd />
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
        <SpeedInsights />
      </body>
    </html>
  )
}
