import FrontendLayout from '@/layouts/frontend-layout';
import { Head, InfiniteScroll, router } from '@inertiajs/react';
import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProductImage {
    url: string | null;
    alt: string;
}

interface Product {
    id: number;
    title: string;
    slug: string;
    price: number;
    discount: number;
    discount_type: 'percentage' | 'fixed';
    images: ProductImage[]; // always 4 from server
}

interface CategoryOption {
    value: string;
    label: string;
}

interface PaginatedProducts {
    data: Product[];
    meta: { current_page: number; last_page: number };
}

interface Props {
    products: PaginatedProducts;
    type: string;
    type_label: string;
    categories: CategoryOption[];
    selected_category: string;
}

// ─── Mosaic layout patterns ───────────────────────────────────────────────────
// Each pattern is 4 Tailwind grid-placement strings for a grid-cols-4 grid-rows-2 container.
// Patterns vary which image is wide, tall, or half-height.

const LAYOUTS = [
    // A: tall-left | wide-center | stacked-right
    [
        'col-start-1 col-span-1 row-start-1 row-span-2',
        'col-start-2 col-span-2 row-start-1 row-span-2',
        'col-start-4 col-span-1 row-start-1 row-span-1',
        'col-start-4 col-span-1 row-start-2 row-span-1',
    ],
    // B: stacked-left | wide-center | tall-right
    [
        'col-start-1 col-span-1 row-start-1 row-span-1',
        'col-start-1 col-span-1 row-start-2 row-span-1',
        'col-start-2 col-span-2 row-start-1 row-span-2',
        'col-start-4 col-span-1 row-start-1 row-span-2',
    ],
    // C: wide-left | tall-center | stacked-right
    [
        'col-start-1 col-span-2 row-start-1 row-span-2',
        'col-start-3 col-span-1 row-start-1 row-span-2',
        'col-start-4 col-span-1 row-start-1 row-span-1',
        'col-start-4 col-span-1 row-start-2 row-span-1',
    ],
    // D: tall-left | stacked-center | wide-right
    [
        'col-start-1 col-span-1 row-start-1 row-span-2',
        'col-start-2 col-span-1 row-start-1 row-span-1',
        'col-start-2 col-span-1 row-start-2 row-span-1',
        'col-start-3 col-span-2 row-start-1 row-span-2',
    ],
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const FALLBACK_IMG = '/assets/images/bg.png';

function resolveUrl(url: string | null | undefined): string {
    if (!url) return FALLBACK_IMG;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
}

function computeFinalPrice(
    price: number,
    discount: number,
    type: string,
): number {
    if (!discount) return price;
    return type === 'percentage'
        ? price - (price * discount) / 100
        : Math.max(0, price - discount);
}

// ─── Single image slot with hover effect ──────────────────────────────────────

function ImageSlot({
    url,
    alt,
    productId,
    productTitle,
    gridClass,
}: {
    url: string;
    alt: string;
    productId: number;
    productTitle: string;
    gridClass: string;
}) {
    return (
        <div
            className={`group relative cursor-pointer overflow-hidden rounded ${gridClass}`}
            style={{ minHeight: 80, minWidth: 60 }}
        >
            {/* Background image with zoom effect */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                style={{ backgroundImage: `url('${url}')` }}
            >
                {/* Darkening overlay on hover */}
                <div className="absolute inset-0 bg-gray-900/5 transition-all duration-700 group-hover:bg-gray-900/55" />
                <div className="absolute inset-0 backdrop-brightness-100 transition-colors duration-500 group-hover:backdrop-brightness-90" />
            </div>

            {/* Hover content (title + button) */}
            <div className="relative z-10 flex h-full translate-y-6 flex-col items-center justify-center gap-3 px-3 opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                <h3 className="text-center font-['Alumni_Sans'] text-base font-semibold tracking-wide text-white uppercase drop-shadow-lg md:text-xl">
                    {productTitle}
                </h3>

                <div className="h-8 w-px origin-top scale-y-0 bg-white/50 transition-all delay-75 duration-700 group-hover:scale-y-100 lg:h-12" />

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        router.get(`/details/${productId}`);
                    }}
                    className="relative scale-75 overflow-hidden rounded bg-primary px-6 py-2.5 font-['Libre_Franklin'] text-sm font-medium text-white opacity-0 shadow-lg transition-all delay-150 duration-700 group-hover:scale-100 group-hover:opacity-100"
                >
                    {/* Shimmer */}
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    <span className="relative z-10">View Details</span>
                </button>
            </div>

            {/* Border glow */}
            <div className="pointer-events-none absolute inset-0 rounded border-2 border-transparent transition-all duration-500 group-hover:border-white/20" />
        </div>
    );
}

// ─── Product mosaic card ──────────────────────────────────────────────────────

function ProductCard({ product }: { product: Product }) {
    const layout = LAYOUTS[product.id % LAYOUTS.length];
    const finalPrice = computeFinalPrice(
        product.price,
        product.discount,
        product.discount_type,
    );

    return (
        <article>
            {/* Meta bar above the mosaic */}
            <div className="mb-2.5 flex flex-wrap items-baseline gap-x-3 gap-y-1 px-0.5">
                <h2 className="font-['Alumni_Sans'] text-xl font-semibold tracking-wide text-white">
                    {product.title}
                </h2>
                <span className="font-semibold text-white">
                    ${finalPrice.toFixed(2)}
                </span>
                {product.discount > 0 && (
                    <span className="rounded bg-red-700/80 px-2 py-0.5 text-xs font-semibold text-white">
                        {product.discount_type === 'percentage'
                            ? `${product.discount}% OFF`
                            : `$${product.discount} OFF`}
                    </span>
                )}
            </div>

            {/* Mosaic grid — fixed height with min/max constraints */}
            <div className="grid h-[260px] max-h-[500px] min-h-[200px] grid-cols-4 grid-rows-2 gap-2 sm:h-[340px] lg:h-[440px]">
                {product.images.map((img, i) => (
                    <ImageSlot
                        key={i}
                        url={resolveUrl(img.url)}
                        alt={img.alt}
                        productId={product.id}
                        productTitle={product.title}
                        gridClass={layout[i]}
                    />
                ))}
            </div>
        </article>
    );
}

// ─── Loading skeleton ─────────────────────────────────────────────────────────

function SkeletonCard() {
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

// ─── Page component ───────────────────────────────────────────────────────────

export default function ProductCategory({
    products,
    type,
    type_label,
    categories,
    selected_category,
}: Props) {
    const [category, setCategory] = useState(selected_category);

    function applyFilter(nextCategory: string) {
        setCategory(nextCategory);
        const query: Record<string, string> = {};
        if (nextCategory !== 'all') query.category = nextCategory;

        router.visit(`/${type}`, {
            data: query,
            only: ['products'],
            reset: ['products'], // clears infinite scroll history on filter change
            preserveScroll: false,
        });
    }

    return (
        <FrontendLayout>
            <Head title={type_label} />

            <section className="container mx-auto my-10 space-y-8 px-4 lg:px-6">
                {/* ── Header + filter ── */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <h1 className="font-['Alumni_Sans'] text-3xl font-bold tracking-widest text-white uppercase lg:text-4xl">
                        {type_label}
                    </h1>

                    {categories.length > 0 && (
                        <div className="flex flex-wrap items-end gap-3">
                            <div>
                                <label className="mb-1.5 block text-[10px] font-semibold tracking-widest text-white/50 uppercase">
                                    Category
                                </label>
                                <select
                                    value={category}
                                    onChange={(e) =>
                                        applyFilter(e.target.value)
                                    }
                                    className="rounded-lg border border-white/10 bg-white/90 px-4 py-2.5 text-sm font-medium text-gray-900 shadow-sm transition outline-none focus:ring-2 focus:ring-white/30"
                                >
                                    <option value="all">All</option>
                                    {categories.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {category !== 'all' && (
                                <button
                                    onClick={() => applyFilter('all')}
                                    className="rounded-lg bg-red-700 px-4 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-red-800"
                                >
                                    Clear
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* ── Infinite scroll product list ── */}
                <InfiniteScroll data="products" buffer={300} onlyNext>
                    {({ loading }: { loading: boolean }) => (
                        <div className="space-y-10">
                            {products.data.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-24 text-white/50">
                                    <svg
                                        className="mb-4 h-12 w-12 opacity-30"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                        />
                                    </svg>
                                    <p className="text-lg font-medium">
                                        No products found
                                    </p>
                                    <p className="mt-1 text-sm">
                                        Try clearing the filter
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {products.data.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}
                                    {/* Loading skeleton appears while fetching next page */}
                                    {loading && <SkeletonCard />}
                                </>
                            )}
                        </div>
                    )}
                </InfiniteScroll>
            </section>
        </FrontendLayout>
    );
}
