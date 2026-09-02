import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const Categories: CollectionConfig = {
  slug: 'categories',

  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'parent', 'active'],
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
        description: 'Kategoriens navn, som det vises på hjemmesiden.',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'Skal være unik på tværs af ALLE kategorier, ikke kun søskende-kategorier. Hvis navnet allerede findes i en anden gruppe (fx "Plastik" under både Stole og Bestik), så gør sluggen tydelig, fx "stole-plastik" og "bestik-plastik".',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'categories',
      admin: {
        description: 'Lad stå tomt for en topniveau-kategori, eller vælg en kategori for at gøre denne til en underkategori.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Bestem om kategorien er synlig og kan vælges på hjemmesiden.',
      },
    },
  ],
}
