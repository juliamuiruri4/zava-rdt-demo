import { z } from 'zod';

import { productSchema } from '../catalog';

const CHAT_SEARCH_LIMIT = 5;

const productSearchResponseSchema = z
  .object({
    query: z.string(),
    products: z.array(productSchema).readonly(),
    total: z.number().int().nonnegative(),
    limit: z.number().int().positive(),
  })
  .strict();

export type CatalogSearchResult = z.infer<typeof productSearchResponseSchema>;

export async function searchCatalog(
  query: string,
): Promise<CatalogSearchResult> {
  const searchParams = new URLSearchParams({
    q: query,
    limit: CHAT_SEARCH_LIMIT.toString(),
  });
  const response = await fetch(`/api/products/search?${searchParams}`, {
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`Product search failed with status ${response.status}`);
  }

  return productSearchResponseSchema.parse(await response.json());
}
