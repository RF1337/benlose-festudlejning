import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import { ProductCard } from '@/components/ProductCard'
import type { Category, Product } from '@/payload-types'
import '../styles.css'

function topLevelCategoryId(categoryId: number, byId: Map<number, Category>): number {
  const category = byId.get(categoryId)
  if (!category || !category.parent) return categoryId
  const parentId = typeof category.parent === 'object' ? category.parent.id : category.parent
  return topLevelCategoryId(parentId, byId)
}

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => {
        const image = typeof product.image === 'object' ? product.image : null

        return (
          <ProductCard
            description={product.description}
            detailsHref={`/udlejning/${product.slug}`}
            image={image?.url ? { url: image.url, alt: image.alt } : null}
            key={product.id}
            name={product.name}
            price={product.price}
            productId={product.id}
            type="product"
          />
        )
      })}
    </div>
  )
}

export default async function UdlejningPage() {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const [{ docs: products }, { docs: categories }] = await Promise.all([
    payload.find({
      collection: 'products',
      where: { active: { equals: true } },
      depth: 1,
    }),
    payload.find({
      collection: 'categories',
      where: { active: { equals: true } },
      depth: 0,
      limit: 0,
    }),
  ])

  const categoriesById = new Map(categories.map((category) => [category.id, category]))
  const topLevelCategories = categories.filter((category) => !category.parent)

  const uncategorized = products.filter((product) => !product.categories || product.categories.length === 0)

  return (
    <div className="mx-auto max-w-6xl p-6 min-[400px]:p-11.25">
      <h1 className="text-center">Udlejning</h1>

      {topLevelCategories.length === 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="flex flex-col gap-10">
          {topLevelCategories.map((topCategory) => {
            const subcategories = categories.filter(
              (category) =>
                category.parent &&
                (typeof category.parent === 'object' ? category.parent.id : category.parent) === topCategory.id,
            )

            const productInTopCategory = (product: Product, categoryId: number) =>
              (product.categories ?? []).some((c) => {
                const id = typeof c === 'object' ? c.id : c
                return topLevelCategoryId(id, categoriesById) === categoryId
              })

            const productsInTop = products.filter((product) => productInTopCategory(product, topCategory.id))
            if (productsInTop.length === 0) return null

            return (
              <section key={topCategory.id}>
                <h2 className="mb-6">{topCategory.name}</h2>
                {subcategories.length === 0 ? (
                  <ProductGrid products={productsInTop} />
                ) : (
                  <div className="flex flex-col gap-8">
                    {subcategories.map((subcategory) => {
                      const productsInSub = productsInTop.filter((product) =>
                        (product.categories ?? []).some((c) => (typeof c === 'object' ? c.id : c) === subcategory.id),
                      )
                      if (productsInSub.length === 0) return null

                      return (
                        <div key={subcategory.id}>
                          <h3 className="mb-4">{subcategory.name}</h3>
                          <ProductGrid products={productsInSub} />
                        </div>
                      )
                    })}
                    {(() => {
                      const productsDirectlyInTop = productsInTop.filter(
                        (product) =>
                          !(product.categories ?? []).some((c) => {
                            const id = typeof c === 'object' ? c.id : c
                            return subcategories.some((sub) => sub.id === id)
                          }),
                      )
                      if (productsDirectlyInTop.length === 0) return null
                      return (
                        <div>
                          <h3 className="mb-4">Øvrige</h3>
                          <ProductGrid products={productsDirectlyInTop} />
                        </div>
                      )
                    })()}
                  </div>
                )}
              </section>
            )
          })}
          {uncategorized.length > 0 && (
            <section>
              <h2 className="mb-6">Andre produkter</h2>
              <ProductGrid products={uncategorized} />
            </section>
          )}
        </div>
      )}

      {products.length === 0 && <p>No products found.</p>}
    </div>
  )
}
