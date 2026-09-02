import type { CollectionConfig } from 'payload'
import { revalidateAfterChange, revalidateAfterDelete } from '../hooks/revalidate'

export const FAQs: CollectionConfig = {
  slug: 'faqs',

  admin: {
    useAsTitle: 'question',
    defaultColumns: ['question', 'order', 'active'],
  },

  hooks: {
    afterChange: [revalidateAfterChange],
    afterDelete: [revalidateAfterDelete],
  },

  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description: 'Spørgsmålet, som det vises i FAQ-listen.',
      },
    },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Svaret, der vises når spørgsmålet foldes ud.',
      },
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lavere tal vises først.',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Bestem om spørgsmålet vises på hjemmesiden.',
      },
    },
  ],
  defaultSort: 'order',
}
