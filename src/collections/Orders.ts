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
      name: 'companyName',
      type: 'text',
    },
    {
      name: 'deliveryMethod',
      type: 'select',
      defaultValue: 'pickup',
      options: [
        { label: 'Afhentning i butikken', value: 'pickup' },
        { label: 'Levering til adresse', value: 'delivery' },
      ],
    },
    {
      name: 'deliveryAddress',
      type: 'group',
      fields: [
        { name: 'street', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'DK' },
      ],
    },
    {
      name: 'billingSameAsDelivery',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'billingAddress',
      type: 'group',
      fields: [
        { name: 'companyName', type: 'text' },
        { name: 'name', type: 'text' },
        { name: 'street', type: 'text' },
        { name: 'postalCode', type: 'text' },
        { name: 'city', type: 'text' },
        { name: 'country', type: 'text', defaultValue: 'DK' },
      ],
    },
    {
      name: 'termsAccepted',
      type: 'checkbox',
      defaultValue: false,
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
