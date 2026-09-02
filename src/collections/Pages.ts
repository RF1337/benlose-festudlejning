import type { CollectionConfig } from 'payload'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Pages: CollectionConfig = {
  slug: 'pages',

  admin: {
    useAsTitle: 'title',
  },

  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },

  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Titel, der vises øverst på siden og bruges i admin-panelet.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Bruges i URL\'en, fx "lejebetingelser" giver /lejebetingelser.',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor(),
      admin: {
        description: 'Sidens indhold.',
      },
    },
  ],
}
