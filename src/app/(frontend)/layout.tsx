import React from 'react'
import { Playfair_Display } from 'next/font/google'

import { CartProvider } from './cart/CartContext'
import './styles.css'
import './tailwind.css'
import Header from '@/components/shared/Header'
import Footer from '@/components/shared/Footer'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata = {
  description: 'Benløse Festudlejning',
  title: 'Benløse Festudlejning',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="da" className={playfairDisplay.variable}>
      <body>
        <CartProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
