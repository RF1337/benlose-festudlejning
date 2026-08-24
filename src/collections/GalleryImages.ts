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
        description: 'Used as the image alt text and as a caption in the gallery.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'showInHero',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Include this image in the rotating hero on the front page.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first, both in the hero rotation and the gallery.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
  defaultSort: 'order',
}
