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
      admin: {
        description: 'Kundens fulde navn.',
      },
    },
    {
      name: 'customerEmail',
      type: 'email',
      required: true,
      admin: {
        description: 'Kundens e-mailadresse. Bruges til at sende ordrebekræftelse.',
      },
    },
    {
      name: 'customerPhone',
      type: 'text',
      admin: {
        description: 'Kundens telefonnummer.',
      },
    },
    {
      name: 'companyName',
      type: 'text',
      admin: {
        description: 'Firmanavn, hvis ordren er til en virksomhed.',
      },
    },
    {
      name: 'deliveryMethod',
      type: 'select',
      defaultValue: 'pickup',
      admin: {
        description: 'Vælg om kunden afhenter selv eller får leveret til en adresse.',
      },
      options: [
        { label: 'Afhentning i butikken', value: 'pickup' },
        { label: 'Levering til adresse', value: 'delivery' },
      ],
    },
    {
      name: 'deliveryAddress',
      type: 'group',
      admin: {
        description: 'Leveringsadresse. Udfyldes kun hvis leveringsmetoden er "Levering til adresse".',
      },
      fields: [
        { name: 'street', type: 'text', admin: { description: 'Vejnavn og husnummer.' } },
        { name: 'postalCode', type: 'text', admin: { description: 'Postnummer.' } },
        { name: 'city', type: 'text', admin: { description: 'By.' } },
        { name: 'country', type: 'text', defaultValue: 'DK', admin: { description: 'Landekode, fx "DK".' } },
      ],
    },
    {
      name: 'billingSameAsDelivery',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Markér hvis faktureringsadressen er den samme som leveringsadressen.',
      },
    },
    {
      name: 'billingAddress',
      type: 'group',
      admin: {
        description: 'Faktureringsadresse. Udfyldes kun hvis den afviger fra leveringsadressen.',
      },
      fields: [
        { name: 'companyName', type: 'text', admin: { description: 'Firmanavn på fakturaen, hvis relevant.' } },
        { name: 'name', type: 'text', admin: { description: 'Navn på fakturaen.' } },
        { name: 'street', type: 'text', admin: { description: 'Vejnavn og husnummer.' } },
        { name: 'postalCode', type: 'text', admin: { description: 'Postnummer.' } },
        { name: 'city', type: 'text', admin: { description: 'By.' } },
        { name: 'country', type: 'text', defaultValue: 'DK', admin: { description: 'Landekode, fx "DK".' } },
      ],
    },
    {
      name: 'termsAccepted',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description: 'Om kunden har accepteret handelsbetingelserne ved bestilling.',
      },
    },
    {
      name: 'eventDate',
      type: 'date',
      admin: {
        description: 'Datoen for kundens arrangement.',
      },
    },
    {
      name: 'comment',
      type: 'textarea',
      admin: {
        description: 'Eventuel kommentar eller særlige ønsker fra kunden.',
      },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      admin: {
        description: 'Produkterne og pakkerne i ordren.',
      },
      fields: [
        {
          name: 'item',
          type: 'relationship',
          relationTo: ['products', 'product-bundles'],
          required: true,
          admin: {
            description: 'Det bestilte produkt eller pakketilbud.',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
          admin: {
            description: 'Antal bestilt.',
          },
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
