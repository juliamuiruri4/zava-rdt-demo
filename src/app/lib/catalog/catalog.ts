import { seedProducts } from './seed';
import {
  catalogSchema,
  productCategorySchema,
  productSearchQuerySchema,
  productSlugSchema,
  type Catalog,
  type Product,
  type ProductCategory,
} from './schemas';

const catalog = catalogSchema.parse(seedProducts);

export function getAllProducts(): Catalog {
  return catalog;
}

export function getProductBySlug(slug: string): Product | undefined {
  const validatedSlug = productSlugSchema.parse(slug);
  return catalog.find((product) => product.slug === validatedSlug);
}

export function getProductsByCategory(category: ProductCategory): Catalog {
  const validatedCategory = productCategorySchema.parse(category);
  return catalog.filter((product) => product.category === validatedCategory);
}

export function getFeaturedProducts(): Catalog {
  return catalog.filter((product) => product.featured);
}

export function getPopularProducts(): Catalog {
  return catalog.filter((product) => product.popular);
}

export function searchProducts(query: string): Catalog {
  const normalizedQuery = productSearchQuerySchema
    .parse(query)
    .trim()
    .toLocaleLowerCase('en-US');

  return catalog.filter((product) => {
    const searchableText = [
      product.name,
      product.description,
      product.category,
      ...product.tags,
    ]
      .join(' ')
      .toLocaleLowerCase('en-US');

    return searchableText.includes(normalizedQuery);
  });
}
