import Link from 'next/link'

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-brand-navy text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14 sm:flex-row sm:justify-between sm:px-10">
        <div>
          <h3 className="m-0 font-heading text-brand-gold">Adresse</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Benløse Festudlejning
            <br />
            Byskovvej 9
            <br />
            4100 Ringsted
            <br />
            Denmark
            <br />
            CVR-nr. DK41436565
          </p>
        </div>

        <div>
          <h3 className="m-0 font-heading text-brand-gold">Kontakt</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Mandag - Søndag
            <br />
            09.00 - 18.00
            <br />
            <a
              href="mailto:kontakt@benlose-festudlejning.dk"
              className="no-underline text-brand-gold transition hover:text-white"
            >
              kontakt@benlose-festudlejning.dk
            </a>
            <br />
            <a href="tel:+4541665561" className="no-underline text-brand-gold transition hover:text-white">
              41 66 55 61
            </a>
          </p>
        </div>

        <div>
          <h3 className="m-0 font-heading text-brand-gold">Følg os</h3>
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            <a
              href="https://www.facebook.com/people/Benløse-festudlejning/100057412061116/"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline text-brand-gold transition hover:text-white"
            >
              Facebook
            </a>
            <br />
            <a
              href="https://www.instagram.com/benlosefestudlejning/"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline text-brand-gold transition hover:text-white"
            >
              Instagram
            </a>
          </p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/60 sm:flex-row sm:px-10">
          <p>
            &copy; {year} Benløse Festudlejning. Alle rettigheder forbeholdes.
          </p>
          <p className="flex items-center gap-2">
            <Link href="/privatlivspolitik" className="transition hover:text-brand-gold">
              Privatlivspolitik
            </Link>
            <span aria-hidden="true">|</span>
            <Link href="/lejebetingelser" className="transition hover:text-brand-gold">
              Vilkår og betingelser
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
