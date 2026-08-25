import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { seoPlugin } from '@payloadcms/plugin-seo'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { resendAdapter } from '@payloadcms/email-resend'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Products } from './collections/Products'
import { ProductBundles } from './collections/ProductBundles'
import { Categories } from './collections/Categories'
import { Pages } from './collections/Pages'
import { Orders } from './collections/Orders'
import { GalleryImages } from './collections/GalleryImages'
import { FAQs } from './collections/FAQs'
import { Home } from './globals/Home'
import { SITE_NAME, truncate } from './utilities/seo'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)


export default buildConfig({
  email: resendAdapter({
    defaultFromAddress: 'onboarding@resend.dev',
    defaultFromName: 'Benløse Festudlejning',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Products, ProductBundles, Categories, Pages, Orders, GalleryImages, FAQs],
  globals: [Home],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
      max: 5,
    },
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
    seoPlugin({
      collections: ['products', 'product-bundles', 'categories', 'pages'],
      globals: ['home'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc, collectionConfig }) => {
        const base = (doc?.name as string) || (doc?.title as string) || SITE_NAME
        if (!collectionConfig) return `${base} | ${SITE_NAME}`
        return `${base} | ${SITE_NAME}`
      },
      generateDescription: ({ doc }) => {
        const source = (doc?.description as string) || ''
        return source ? truncate(source, 155) : ''
      },
      generateURL: ({ doc, collectionConfig }) => {
        const slug = (doc?.slug as string) || ''
        switch (collectionConfig?.slug) {
          case 'products':
            return `/udlejning/${slug}`
          case 'product-bundles':
            return `/pakketilbud/${slug}`
          case 'categories':
            return `/udlejning/kategori/${slug}`
          case 'pages':
            return `/${slug}`
          default:
            return '/'
        }
      },
    }),
  ],
})
