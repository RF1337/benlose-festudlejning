import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const GalleryImages: CollectionConfig = {
  slug: 'gallery-images',

  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'showInHero', 'order', 'active'],
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
        description: 'Bruges som billedets alt-tekst og som billedtekst i galleriet.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Billedet, der vises i galleriet.',
      },
    },
    {
      name: 'showInHero',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Inkluder dette billede i det roterende hero-billede på forsiden.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lavere tal vises først, både i hero-rotationen og galleriet.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Bestem om billedet vises på hjemmesiden.',
      },
    },
  ],
  defaultSort: 'order',
}
