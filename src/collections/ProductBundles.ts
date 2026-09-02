import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const ProductBundles: CollectionConfig = {
  slug: 'product-bundles',

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
      admin: {
        description: 'Pakkens navn, som det vises på hjemmesiden.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Bruges i URL\'en, fx "fest-50" giver /pakketilbud/fest-50.',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Kort beskrivelse af pakken, vises på pakkesiden.',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Hovedbillede. Vises som udgangspunkt på pakkesiden og i lister.',
      },
    },
    {
      name: 'gallery',
      type: 'array',
      label: 'Ekstra billeder',
      admin: {
        description: 'Andre billeder af pakken.',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
    {
      name: 'productItems',
      type: 'array',
      label: 'Produkter i pakken',
      required: true,
      minRows: 1,
      admin: {
        description: 'De produkter og antal, pakken indeholder.',
      },
      fields: [
        {
          name: 'product',
          type: 'relationship',
          relationTo: 'products',
          required: true,
          admin: {
            description: 'Produktet, der indgår i pakken.',
          },
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          min: 1,
          defaultValue: 1,
          admin: {
            description: 'Antal af produktet i pakken.',
          },
        },
      ],
    },
    {
      name: 'price',
      type: 'number',
      required: true,
      min: 0,
      admin: {
        description: 'Pakkens samlede pris i kr.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Bestem om pakken er synlig og kan bestilles på hjemmesiden.',
      },
    },
  ],
}
