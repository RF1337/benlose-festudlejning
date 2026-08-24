import { getPayload } from 'payload'
import Link from 'next/link'
import React from 'react'

import config from '@/payload.config'
import { HeroCarousel } from '@/components/shared/HeroCarousel'
import './styles.css'

const facebookPageUrl = 'https://www.facebook.com/people/Benløse-festudlejning/100057412061116/'
const facebookEmbedSrc = `https://www.facebook.com/plugins/page.php?href=${encodeURIComponent(
  facebookPageUrl,
)}&tabs=timeline&width=500&height=600&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true`

const features = [
  {
    title: 'Lej et flot, hvidt festtelt',
    text: 'Vi har certificerede, hvide festtelte i mange forskellige størrelser og i en kraftig, professionel kvalitet. Teltene føres i 5 eller 6 m bredde og i lige den længde, du har brug for.',
  },
  {
    title: 'Vi leverer og sætter op',
    text: 'Vi ved, at man altid har rigtig meget at tænke på, når man skal holde fest. Så hos os bestiller du bare dit festtelt, så kommer vi og sætter op. Du skal kun tænke på at dække bord og pynte op i teltet.',
  },
  {
    title: 'Er din have ikke så stor?',
    text: 'Vi klarer selv de lidt mere kringlede opgaver. Har du en lille eller kringlet have, finder vi altid en løsning, så festen kan holdes hos jer. Ring og få en uforpligtende snak.',
  },
]

const testimonials = [
  {
    name: 'Henrik Værum Høgh',
    quote: 'Super service. Kun glad for vores brug af dem.',
  },
  {
    name: 'Torben Bøgede Sørensen',
    quote:
      'Super standard. Alt leveret, og til tiden, fantastisk service. Stor anbefaling herfra. 😊',
  },
  {
    name: 'Stine Storkegård',
    quote:
      'Fantastisk firma som overholder aftaler - og endda støtter Stafet for Livet Ringsted 🌻💛',
  },
]

export default async function HomePage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const { docs: heroImages } = await payload.find({
    collection: 'gallery-images',
    where: {
      and: [{ showInHero: { equals: true } }, { active: { equals: true } }],
    },
    sort: 'order',
    depth: 1,
  })

  const heroSlides = heroImages
    .map((doc) => {
      const image = typeof doc.image === 'object' ? doc.image : null
      if (!image?.url) return null
      return { id: doc.id, url: image.url, alt: doc.title }
    })
    .filter((slide) => slide !== null)

  return (
    <>
      <HeroCarousel slides={heroSlides} />
      <div className="home">
        <section className="hero">
          <h1>Benløse Festudlejning</h1>
          <p>
            Vi har sat os for at blive lokalbefolkningens foretrukne samarbejdspartner, når det
            gælder leje af festtelt, teltgulv, borde, stole, service etc. til hygge og fest.
          </p>
          <p>
            Vi leverer gratis i 4100 Ringsted ved bestillinger over 1.500 kr, og ellers til en fast
            lav leveringspris på 150 kr i 4100 Ringsted. Vi leverer selvfølgelig også gerne på
            resten af Sjælland – se vores fragtpriser under{' '}
            <Link href="/lejebetingelser">Lejebetingelser</Link>.
          </p>
          <p>
            Vi har nogle af branchens allerbedste priser og leverer kun materiel, vi kan stå inde
            for. Vores certificerede telte leveres fra Lund Telte i Kibæk, som producerer
            partytelte i høj europæisk kvalitet.
          </p>
          <p>
            Som noget nyt udlejer vi nu også scenemoduler – perfekt når der skal være plads til
            musikere eller anden underholdning. Du finder dem i{' '}
            <Link href="/udlejning">Udlejningen</Link>.
          </p>
          <p>
            Har du nogle spørgsmål, står vi gerne parat til at råde og vejlede dig, og vi bestræber
            os på at svare inden for 24 timer.
          </p>
          <p className="signature">Hilsen Morten og Heidi</p>
          <p className="note">
            Skriv dato for dit arrangement i kommentarfeltet, hvis du bestiller online. 🙂
          </p>
          <Link className="cta" href="/udlejning">
            Se udvalget
          </Link>
        </section>

        <section className="features">
          {features.map((feature) => (
            <div className="feature-card" key={feature.title}>
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
            </div>
          ))}
        </section>

        <section className="contact-info">
          <div>
            <h3>Adresse</h3>
            <p>
              Benløse Festudlejning
              <br />
              Byskovvej 9
              <br />
              4100 Ringsted
              <br />
              CVR-nr. DK41436565
            </p>
          </div>
          <div>
            <h3>Telefon</h3>
            <p>
              41 66 55 61
              <br />
              Mandag - Søndag
              <br />
              09.00 - 18.00
            </p>
          </div>
          <div>
            <h3>E-mail</h3>
            <p>
              <a href="mailto:kontakt@benlose-festudlejning.dk">kontakt@benlose-festudlejning.dk</a>
            </p>
          </div>
        </section>

        <section className="testimonials">
          <h2>Det siger vores kunder</h2>
          <div className="testimonial-grid">
            {testimonials.map((testimonial) => (
              <div className="testimonial-card" key={testimonial.name}>
                <p>&ldquo;{testimonial.quote}&rdquo;</p>
                <p className="testimonial-name">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="facebook-feed">
          <h2>Følg os på Facebook</h2>
          <div className="facebook-embed">
            <iframe
              allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
              frameBorder="0"
              height="600"
              scrolling="no"
              src={facebookEmbedSrc}
              style={{ border: 'none', overflow: 'hidden', width: '100%' }}
              width="500"
            />
          </div>
        </section>
      </div>
    </>
  )
}
