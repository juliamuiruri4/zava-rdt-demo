import Image from 'next/image';
import Link from 'next/link';

import type { Product, ProductCategory } from '../../lib/catalog';

interface ProductCitationCardProps {
  product: Product;
  citationNumber: number;
}

const categoryLabels: Record<ProductCategory, string> = {
  flooring: 'Flooring',
  'paint-and-finishes': 'Paint & finishes',
  'tools-and-hardware': 'Tools & hardware',
};

const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function formatPrice(product: Product): string {
  const price = currencyFormatter.format(product.price.amount / 100);
  return product.priceUnit === 'square-foot' ? `${price} / sq. ft.` : price;
}

export default function ProductCitationCard({
  product,
  citationNumber,
}: ProductCitationCardProps) {
  return (
    <article className="overflow-hidden rounded-xl border border-teal-100 bg-white">
      <div className="flex min-w-0 gap-3 p-3">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
          <Image
            src={product.image}
            alt={`${product.name} product image`}
            fill
            sizes="80px"
            className="object-cover"
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs">
            <span className="rounded-full bg-teal-50 px-2 py-0.5 font-semibold text-teal-800">
              [{citationNumber}] Catalog match
            </span>
            <span className="text-gray-500">
              {categoryLabels[product.category]}
            </span>
          </div>
          <h4 className="break-words text-sm font-semibold leading-5 text-gray-900">
            {product.name}
          </h4>
          <p className="mt-0.5 text-sm font-semibold text-teal-700">
            {formatPrice(product)}
          </p>
        </div>
      </div>

      <div className="border-t border-gray-100 px-3 py-2.5">
        <p className="line-clamp-2 text-xs leading-5 text-gray-600">
          {product.description}
        </p>
        <Link
          href={product.href}
          className="mt-2 inline-flex items-center rounded-sm text-xs font-semibold text-teal-700 underline decoration-teal-300 underline-offset-2 hover:text-teal-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2"
          aria-label={`View ${product.name} product details`}
        >
          View product
          <svg
            aria-hidden="true"
            className="ml-1 h-3 w-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 12 12"
          >
            <path
              d="M2.5 6h7m-3-3 3 3-3 3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </Link>
      </div>
    </article>
  );
}
