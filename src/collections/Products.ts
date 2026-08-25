import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Products: CollectionConfig = {
  slug: 'products',

  admin: {
    useAsTitle: 'name',
  },

  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },

  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hovedbillede. Vises som udgangspunkt på produktsiden og i lister.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Ekstra billeder',
      admin: {
        description:
          'Andre billeder af produktet, fx andre farver. Udfyld "Matcher valgmulighed" med teksten fra en værdi under Valgmuligheder (fx "Grå"), så billedet vises automatisk når den valgmulighed vælges.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'matchesVariantValue',
          type: 'text',
          admin: {
            description: 'Valgfrit. Skal matche en værdi under Valgmuligheder præcist, fx "Grå".',
          },
        },
      ],
    },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'categories',
      hasMany: true,
    },
    {
      name: 'variants',
      type: 'array',
      label: 'Valgmuligheder',
      admin: {
        description:
          'Fx farve, eller type hvis produktet er bestik (gaffel/ske/kniv). Hver gruppe vises som en dropdown på produktsiden.',
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          required: true,
          admin: {
            description: 'Fx "Farve" eller "Type"',
          },
        },
        {
          name: 'options',
          type: 'array',
          required: true,
          minRows: 1,
          fields: [
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'relatedProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      label: 'Relaterede produkter',
      admin: {
        description: 'Vises som "Måske synes du også om" nederst på produktsiden.',
      },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}