import type { Product } from '@/app/lib/catalog';

export type ProductSearchSuccessResponse = {
  query: string;
  products: readonly Product[];
  total: number;
  limit: number;
};

export type ProductSearchErrorResponse = {
  error: {
    code: 'INVALID_QUERY' | 'INTERNAL_ERROR';
    message: string;
  };
};

