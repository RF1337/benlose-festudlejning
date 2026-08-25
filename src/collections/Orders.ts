import type { CollectionConfig } from 'payload'

export const Orders: CollectionConfig = {
  slug: 'orders',

  admin: {
    useAsTitle: 'customerName',
    defaultColumns: ['customerName', 'customerEmail', 'eventDate', 'createdAt'],
  },

  fields: [
    {
      name: 'customerName',
      type: 'text',
      required: true,
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'customerPhone',
      type: 'text',
    },
    {
      name: 'eventDate',
      type: 'date',
    },
    {
      name: 'comment',
      type: 'textarea',
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      fields: [
        {
          name: 'item',
          type: 'relationship',
          relationTo: ['products', 'product-bundles'],
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
        },
        {
          name: 'selectedOptions',
          type: 'text',
          admin: {
            description: 'Fx "Farve: Rød, Type: Gaffel"',
          },
        },
      ],
    },
  ],
}
