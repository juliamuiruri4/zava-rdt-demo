import { z } from 'zod';

export const currencyCodeSchema = z.enum(['USD']);

export const productCategorySchema = z.enum([
  'flooring',
  'paint-and-finishes',
  'tools-and-hardware',
]);

export const priceUnitSchema = z.enum(['each', 'square-foot']);

export const productSlugSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const productSearchQuerySchema = z
  .string()
  .max(100)
  .refine((query) => query.trim().length > 0, 'Search query cannot be blank');

export const moneySchema = z
  .object({
    amount: z.number().int().nonnegative(),
    currency: currencyCodeSchema,
  })
  .strict()
  .readonly();

export const productSchema = z
  .object({
    id: z.string().regex(/^prod_[a-z0-9_]+$/),
    slug: productSlugSchema,
    name: z.string().min(1).max(120),
    description: z.string().min(1).max(500),
    category: productCategorySchema,
    price: moneySchema,
    priceUnit: priceUnitSchema,
    image: z.string().regex(/^\/images\/[a-z0-9-]+\.(?:png|jpg|webp)$/),
    href: z.string().regex(/^\/products\/[a-z0-9-/]+$/),
    tags: z.array(z.string().min(1).max(40)).max(12).readonly(),
    featured: z.boolean(),
    popular: z.boolean(),
  })
  .strict()
  .readonly();

export const catalogSchema = z
  .array(productSchema)
  .min(1)
  .superRefine((products, context) => {
    for (const field of ['id', 'slug'] as const) {
      const seen = new Set<string>();

      products.forEach((product, index) => {
        if (seen.has(product[field])) {
          context.addIssue({
            code: 'custom',
            message: `Duplicate product ${field}: ${product[field]}`,
            path: [index, field],
          });
        }

        seen.add(product[field]);
      });
    }
  })
  .readonly();

export type CurrencyCode = z.infer<typeof currencyCodeSchema>;
export type ProductCategory = z.infer<typeof productCategorySchema>;
export type PriceUnit = z.infer<typeof priceUnitSchema>;
export type ProductSlug = z.infer<typeof productSlugSchema>;
export type ProductSearchQuery = z.infer<typeof productSearchQuerySchema>;
export type Money = z.infer<typeof moneySchema>;
export type Product = z.infer<typeof productSchema>;
export type Catalog = z.infer<typeof catalogSchema>;
