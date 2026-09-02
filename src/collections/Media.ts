import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description: 'Alt-tekst til billedet. Bruges for tilgængelighed og vises hvis billedet ikke kan indlæses.',
      },
    },
  ],
  upload: true,
}
