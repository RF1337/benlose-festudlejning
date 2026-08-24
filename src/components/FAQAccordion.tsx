'use client'

import { useState } from 'react'

export type FAQItem = {
  id: number | string
  question: string
  answer: string
}

export function FAQAccordion({ items }: { items: FAQItem[] }) {
  const [openId, setOpenId] = useState<FAQItem['id'] | null>(null)

  return (
    <div className="border-t border-neutral-200">
      {items.map((item) => {
        const isOpen = item.id === openId
        const panelId = `faq-panel-${item.id}`
        const buttonId = `faq-button-${item.id}`

        return (
          <div className="border-b border-neutral-200" key={item.id}>
            <h3 className="m-0 text-lg">
              <button
                aria-controls={panelId}
                aria-expanded={isOpen}
                className="group flex w-full cursor-pointer items-center justify-between gap-4 border-none bg-transparent px-1 py-5 text-left [font:inherit]"
                id={buttonId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
                type="button"
              >
                {item.question}
                <span
                  aria-hidden="true"
                  className="relative h-3.5 w-3.5 shrink-0 text-brand-gold before:absolute before:left-1/2 before:top-1/2 before:h-0.5 before:w-3.5 before:-translate-x-1/2 before:-translate-y-1/2 before:bg-current before:content-[''] after:absolute after:left-1/2 after:top-1/2 after:h-3.5 after:w-0.5 after:-translate-x-1/2 after:-translate-y-1/2 after:bg-current after:transition-transform after:duration-200 after:content-[''] group-aria-expanded:after:rotate-90 group-aria-expanded:after:opacity-0"
                />
              </button>
            </h3>
            <div
              aria-labelledby={buttonId}
              className="px-1 pb-5 text-sm opacity-80"
              hidden={!isOpen}
              id={panelId}
              role="region"
            >
              <p className="m-0">{item.answer}</p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
