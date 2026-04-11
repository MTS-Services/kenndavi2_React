import { router } from '@inertiajs/react';
import { type ReactNode } from 'react';

/** Product row shape from `CatalogProductPayload` (category + AI suggestion pages). */
export interface CatalogProductImage {
    url: string | null;
    alt: string;
}

export interface CatalogProduct {
    id: number;
    title: string;
    slug: string | null;
    price: number;
    discount: number;
    discount_type: 'percentage' | 'fixed';
    images: CatalogProductImage[];
}

export interface PaginatedCatalogProducts {
    data: CatalogProduct[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

/** Mosaic layout patterns — same 4-cell grid as category listing. */
export const CATALOG_LAYOUTS = [
    [
        'col-start-1 col-span-1 row-start-1 row-span-2',
        'col-start-2 col-span-2 row-start-1 row-span-2',
        'col-start-4 col-span-1 row-start-1 row-span-1',
        'col-start-4 col-span-1 row-start-2 row-span-1',
    ],
    [
        'col-start-1 col-span-1 row-start-1 row-span-1',
        'col-start-1 col-span-1 row-start-2 row-span-1',
        'col-start-2 col-span-2 row-start-1 row-span-2',
        'col-start-4 col-span-1 row-start-1 row-span-2',
    ],
    [
        'col-start-1 col-span-2 row-start-1 row-span-2',
        'col-start-3 col-span-1 row-start-1 row-span-2',
        'col-start-4 col-span-1 row-start-1 row-span-1',
        'col-start-4 col-span-1 row-start-2 row-span-1',
    ],
    [
        'col-start-1 col-span-1 row-start-1 row-span-2',
        'col-start-2 col-span-1 row-start-1 row-span-1',
        'col-start-2 col-span-1 row-start-2 row-span-1',
        'col-start-3 col-span-2 row-start-1 row-span-2',
    ],
] as const;

const FALLBACK_IMG = '/assets/images/no-image.png';

export function resolveCatalogImageUrl(url: string | null | undefined): string {
    if (!url) return FALLBACK_IMG;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
}

export function computeCatalogFinalPrice(
    price: number,
    discount: number,
    type: string,
): number {
    if (!discount) return price;
    return type === 'percentage'
        ? price - (price * discount) / 100
        : Math.max(0, price - discount);
}

export function CatalogImageSlot({
    url,
    productId,
    productTitle,
    productPrice,
    gridClass,
}: {
    url: string;
    productId: number;
    productTitle: string;
    productPrice: number;
    gridClass: string;
}) {
    return (
        <div
            className={`group relative cursor-default overflow-hidden rounded ${gridClass}`}
        >
            <div className="absolute inset-0 overflow-hidden bg-gray-50/5 backdrop-blur-xs">
                <img
                    src={url}
                    alt={productTitle}
                    className="h-full w-full object-contain object-center transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                    loading="lazy"
                    decoding="async"
                />
                <div className="pointer-events-none absolute inset-0 bg-gray-900/5 transition-all duration-700 group-hover:bg-gray-900/55" />
                <div className="pointer-events-none absolute inset-0 backdrop-brightness-100 transition-colors duration-500 group-hover:backdrop-brightness-90" />
            </div>

            <div className="relative z-10 flex h-full translate-y-6 flex-col items-center justify-center gap-3 px-3 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <div className="pointer-events-none text-center">
                    <h3 className="text-center font-['Alumni_Sans'] text-base font-semibold tracking-wide text-white uppercase drop-shadow-lg md:text-xl">
                        {productTitle}
                    </h3>
                    <span className="font-semibold text-white">
                        ${productPrice.toFixed(2)}
                    </span>
                </div>
                <div className="pointer-events-none h-8 w-px origin-top scale-y-0 bg-white/50 transition-all delay-75 duration-700 group-hover:scale-y-100 lg:h-12" />
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        router.get(`/details/${productId}`);
                    }}
                    className="relative scale-75 cursor-pointer overflow-hidden rounded bg-primary px-6 py-2.5 font-['Libre_Franklin'] text-sm font-medium text-white opacity-0 shadow-lg transition-all delay-150 duration-700 group-hover:scale-100 group-hover:opacity-100"
                >
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    <span className="relative z-10">View Details</span>
                </button>
            </div>

            <div className="pointer-events-none absolute inset-0 rounded border-2 border-transparent transition-all duration-500 group-hover:border-white/20" />
        </div>
    );
}

export function CatalogProductCard({ product }: { product: CatalogProduct }) {
    const layout = CATALOG_LAYOUTS[product.id % CATALOG_LAYOUTS.length];
    const finalPrice = computeCatalogFinalPrice(
        product.price,
        product.discount,
        product.discount_type,
    );

    return (
        <article>
            <div className="grid h-[260px] max-h-[600px] min-h-[200px] grid-cols-4 grid-rows-2 gap-2 sm:h-[340px] lg:h-[550px]">
                {product.images.map((img, i) => (
                    <CatalogImageSlot
                        key={i}
                        url={resolveCatalogImageUrl(img.url)}
                        productId={product.id}
                        productTitle={product.title}
                        productPrice={finalPrice}
                        gridClass={layout[i]!}
                    />
                ))}
            </div>
        </article>
    );
}

export function CatalogSkeletonCard() {
    return (
        <div className="animate-pulse">
            <div className="mb-2.5 flex gap-3">
                <div className="h-5 w-40 rounded bg-white/10" />
                <div className="h-5 w-16 rounded bg-white/10" />
            </div>
            <div className="grid h-[260px] grid-cols-4 grid-rows-2 gap-2 sm:h-[340px] lg:h-[440px]">
                <div className="col-span-1 col-start-1 row-span-2 row-start-1 rounded bg-white/10" />
                <div className="col-span-2 col-start-2 row-span-2 row-start-1 rounded bg-white/10" />
                <div className="col-span-1 col-start-4 row-span-1 row-start-1 rounded bg-white/10" />
                <div className="col-span-1 col-start-4 row-span-1 row-start-2 rounded bg-white/10" />
            </div>
        </div>
    );
}

export function CatalogEmptyStateFilters({ onClear }: { onClear: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <svg
                    className="h-9 w-9 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.2}
                        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                </svg>
            </div>
            <p className="font-['Alumni_Sans'] text-2xl font-semibold text-white/70">
                No products found
            </p>
            <p className="mt-1 text-sm text-white/40">
                No items match your current filters.
            </p>
            <button
                type="button"
                onClick={onClear}
                className="mt-6 rounded bg-red-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
            >
                Clear Filters
            </button>
        </div>
    );
}

export function CatalogEmptyStateBrowse({
    title = 'Nothing to show yet',
    description = 'Check back soon for personalized picks.',
    action,
}: {
    title?: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center py-28 text-center">
            <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <svg
                    className="h-9 w-9 text-white/30"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.2}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                    />
                </svg>
            </div>
            <p className="font-['Alumni_Sans'] text-2xl font-semibold text-white/70">
                {title}
            </p>
            <p className="mt-1 max-w-md text-sm text-white/40">{description}</p>
            {action ? <div className="mt-8">{action}</div> : null}
        </div>
    );
}

export function CatalogNoMoreProducts({ total }: { total: number }) {
    return (
        <div className="flex flex-col items-center gap-3 pt-10 text-center">
            <div className="flex w-full max-w-sm items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs font-semibold tracking-widest text-white/70 uppercase">
                    All caught up
                </span>
                <div className="h-px flex-1 bg-white/60" />
            </div>
            <p className="text-sm text-white/40">
                Showing all {total.toLocaleString()} product
                {total !== 1 ? 's' : ''}
            </p>
        </div>
    );
}
