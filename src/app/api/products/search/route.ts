import { NextResponse } from 'next/server';
import { z } from 'zod';

import {
  productSearchQuerySchema,
  searchProducts,
} from '@/app/lib/catalog';

import type {
  ProductSearchErrorResponse,
  ProductSearchSuccessResponse,
} from './contract';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

const searchParamsSchema = z
  .object({
    q: productSearchQuerySchema.transform((query) => query.trim()),
    limit: z
      .string()
      .regex(/^[1-9]\d*$/)
      .transform(Number)
      .pipe(z.number().int().max(MAX_LIMIT))
      .default(DEFAULT_LIMIT),
  })
  .strict();

const invalidQueryResponse: ProductSearchErrorResponse = {
  error: {
    code: 'INVALID_QUERY',
    message: 'Invalid search parameters',
  },
};

export async function GET(request: Request) {
  try {
    const searchParams = new URL(request.url).searchParams;
    const rawParams = Object.fromEntries(searchParams);
    const hasDuplicateParams = [...searchParams.keys()].some(
      (key) => searchParams.getAll(key).length > 1,
    );
    const parsedParams = searchParamsSchema.safeParse(rawParams);

    if (hasDuplicateParams || !parsedParams.success) {
      return NextResponse.json<ProductSearchErrorResponse>(
        invalidQueryResponse,
        {
          status: 400,
          headers: { 'Cache-Control': 'no-store' },
        },
      );
    }

    const { q: query, limit } = parsedParams.data;
    const matches = searchProducts(query);
    const response: ProductSearchSuccessResponse = {
      query,
      products: matches.slice(0, limit),
      total: matches.length,
      limit,
    };

    return NextResponse.json<ProductSearchSuccessResponse>(response, {
      headers: {
        'Cache-Control':
          'public, max-age=60, s-maxage=300, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Product search request failed', error);

    return NextResponse.json<ProductSearchErrorResponse>(
      {
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Unable to search products',
        },
      },
      {
        status: 500,
        headers: { 'Cache-Control': 'no-store' },
      },
    );
  }
}
