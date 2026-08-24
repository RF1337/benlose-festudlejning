import { CartWidget } from '@/app/(frontend)/cart/CartWidget'
import Link from 'next/link'


export default async function Header() {
    return(
              <nav className="nav">
                <Link href="/">Home</Link>
                <Link href="/udlejning">Udlejning</Link>
                <Link href="/pakketilbud">Pakketilbud</Link>
                <Link href="/galleri">Galleri</Link>
                <Link href="/lejebetingelser">Lejebetingelser</Link>
                <a href="mailto:rasmusferst@gmail.com">Kontakt</a>
                <CartWidget />
              </nav>
 )
}