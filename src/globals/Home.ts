import type { GlobalConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateGlobalAfterChange } from '../hooks/revalidate'

export const Home: GlobalConfig = {
  slug: 'home',
  label: 'Forside',

  hooks: {
    afterChange: [revalidateGlobalAfterChange],
  },

  fields: [
    {
      name: 'introduction',
      type: 'richText',
      editor: lexicalEditor(),
      label: 'Introduktion',
      admin: {
        description: 'Introduktionsteksten under overskriften på forsiden.',
      },
    },
  ],
}
