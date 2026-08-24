import React from 'react'
import { Instrument_Serif } from 'next/font/google'
import { SpeedInsights } from '@vercel/speed-insights/next'

import { CartProvider } from './cart/CartContext'
import './styles.css'
import './tailwind.css'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-instrument-serif',
})

export const metadata = {
  description: 'Benløse Festudlejning',
  title: 'Benløse Festudlejning',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="da" className={instrumentSerif.variable}>
      <body>
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
