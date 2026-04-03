import FrontendLayout from '@/layouts/frontend-layout';
import { Head, InfiniteScroll, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

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

interface SubcategoryOption {
    value: string;
    label: string;
}

interface CategoryOption {
    value: string;
    label: string;
    subcategories: SubcategoryOption[];
}

interface PaginatedProducts {
    data: Product[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

interface Props {
    products: PaginatedProducts;
    type: string;
    type_label: string;
    categories: CategoryOption[];
    selected_category: string;
    selected_subcategory: string;
}

// ─── Mosaic layout patterns ───────────────────────────────────────────────────

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

const FALLBACK_IMG = '/assets/images/no-image.png';

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

// ─── Image slot with hover effect ─────────────────────────────────────────────

function ImageSlot({
    url,
    productId,
    productTitle,
    gridClass,
}: {
    url: string;
    productId: number;
    productTitle: string;
    gridClass: string;
}) {
    return (
        <div
            className={`group relative cursor-pointer overflow-hidden rounded ${gridClass}`}
        >
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                style={{ backgroundImage: `url('${url}')` }}
            >
                <div className="absolute inset-0 bg-gray-900/5 transition-all duration-700 group-hover:bg-gray-900/55" />
                <div className="absolute inset-0 backdrop-brightness-100 transition-colors duration-500 group-hover:backdrop-brightness-90" />
            </div>

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
                    <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                    <span className="relative z-10">View Details</span>
                </button>
            </div>

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

            <div className="grid h-[260px] max-h-[500px] min-h-[200px] grid-cols-4 grid-rows-2 gap-2 sm:h-[340px] lg:h-[440px]">
                {product.images.map((img, i) => (
                    <ImageSlot
                        key={i}
                        url={resolveUrl(img.url)}
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

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyState({ onClear }: { onClear: () => void }) {
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
                onClick={onClear}
                className="mt-6 rounded bg-red-700 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-red-800"
            >
                Clear Filters
            </button>
        </div>
    );
}

// ─── No more products ─────────────────────────────────────────────────────────

function NoMoreProducts({ total }: { total: number }) {
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

// ─── Page component ───────────────────────────────────────────────────────────

export default function ProductCategory({
    products,
    type,
    type_label,
    categories,
    selected_category,
    selected_subcategory,
}: Props) {
    // ── Local filter state ────────────────────────────────────────────────────
    const [category, setCategory] = useState(selected_category);
    const [subcategory, setSubcategory] = useState(selected_subcategory);

    // ── Navigation lock ───────────────────────────────────────────────────────
    // Blocks the useEffect below from overwriting our optimistic state while a
    // filter navigation is in-flight.  A ref (not state) so toggling it never
    // triggers a re-render.
    const navigating = useRef(false);

    // ── Prop sync — back / forward only ──────────────────────────────────────
    // When the user hits the browser back/forward button, Inertia swaps props
    // without remounting the component, so useState keeps its stale value.
    // This effect detects that case (navigating.current === false) and syncs.
    // During an active filter navigation navigating.current is true, so the
    // effect is a no-op and our optimistic state stays intact.
    useEffect(() => {
        if (!navigating.current) {
            setCategory(selected_category);
            setSubcategory(selected_subcategory);
        }
    }, [selected_category, selected_subcategory]);

    // ── Derived values ────────────────────────────────────────────────────────
    const subcategoryOptions = useMemo<SubcategoryOption[]>(() => {
        if (category === 'all') return [];
        return (
            categories.find((c) => c.value === category)?.subcategories ?? []
        );
    }, [category, categories]);

    const subcategoryEnabled =
        category !== 'all' && subcategoryOptions.length > 0;

    const allLoaded =
        products.data.length > 0 && products.current_page >= products.last_page;

    // ── Navigate ──────────────────────────────────────────────────────────────
    function navigate(nextCategory: string, nextSubcategory: string) {
        const query: Record<string, string> = {};
        if (nextCategory !== 'all') query.category = nextCategory;
        if (nextSubcategory !== 'all') query.subcategory = nextSubcategory;

        navigating.current = true;

        // THE FIX: preserveState: true tells Inertia to leave all React
        // component state untouched while processing the server response.
        //
        // Without it (the default is false), Inertia resets every useState
        // back to its initial value the moment the XHR response arrives —
        // before the new props are committed — so the select flashes "All".
        //
        // We replace reset: ['products'] with a key on <InfiniteScroll> that
        // uses the server-confirmed props, so it remounts at exactly the right
        // moment (when the server returns data for the new filter).
        router.get(`/${type}`, query, {
            preserveState: true,
            preserveScroll: false,
            onFinish: () => {
                navigating.current = false;
            },
        });
    }

    function handleCategoryChange(next: string) {
        setCategory(next);
        setSubcategory('all');
        navigate(next, 'all');
    }

    function handleSubcategoryChange(next: string) {
        setSubcategory(next);
        navigate(category, next);
    }

    function handleClear() {
        setCategory('all');
        setSubcategory('all');
        navigate('all', 'all');
    }

    return (
        <FrontendLayout>
            <Head title={type_label} />

            <section className="container mx-auto my-10 space-y-10">
                {/* ── Filter header ── */}
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                        {/* Category */}
                        <div>
                            <label className="mb-2 block font-['Alumni_Sans'] text-xl font-semibold tracking-wide text-white/80">
                                Category
                            </label>
                            <select
                                value={category}
                                onChange={(e) =>
                                    handleCategoryChange(e.target.value)
                                }
                                className="w-full rounded-lg border border-white/10 bg-white/90 py-3 pr-10 pl-4 text-sm font-medium text-gray-900 shadow-sm transition outline-none focus:border-white focus:ring-2 focus:ring-white/20"
                            >
                                <option value="all">All</option>
                                {categories.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Subcategory */}
                        <div>
                            <label
                                className={`mb-2 block font-['Alumni_Sans'] text-xl font-semibold tracking-wide transition-colors duration-200 ${
                                    subcategoryEnabled
                                        ? 'text-white/80'
                                        : 'text-white/30'
                                }`}
                            >
                                Subcategory
                            </label>
                            <select
                                value={subcategory}
                                disabled={!subcategoryEnabled}
                                onChange={(e) =>
                                    handleSubcategoryChange(e.target.value)
                                }
                                className={`w-full rounded-lg border border-white/10 py-3 pr-10 pl-4 text-sm font-medium shadow-sm transition-all duration-200 outline-none ${
                                    subcategoryEnabled
                                        ? 'bg-white/90 text-gray-900 focus:border-white focus:ring-2 focus:ring-white/20'
                                        : 'cursor-not-allowed bg-white/20 text-white/30'
                                }`}
                            >
                                <option value="all">All</option>
                                {subcategoryOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Clear Filters */}
                        <div className="flex items-center justify-between lg:justify-end">
                            <button
                                type="button"
                                onClick={handleClear}
                                className="inline-flex items-center justify-center rounded bg-red-700 px-5 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-red-800 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* ── Product list with infinite scroll ── */}
                <div className="space-y-8">
                    {products.data.length === 0 ? (
                        <EmptyState onClear={handleClear} />
                    ) : (
                        // Key uses the SERVER-confirmed props (not local state) so
                        // InfiniteScroll remounts — clearing accumulated pages — at
                        // exactly the moment the server returns data for the new filter.
                        // This replaces the need for reset: ['products'] on router.visit.
                        <InfiniteScroll
                            key={`${selected_category}-${selected_subcategory}`}
                            data="products"
                            buffer={300}
                            onlyNext
                        >
                            {({ loading }: { loading: boolean }) => (
                                <div className="space-y-8">
                                    {products.data.map((product) => (
                                        <ProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}

                                    {loading && <SkeletonCard />}

                                    {allLoaded && !loading && (
                                        <NoMoreProducts
                                            total={products.total}
                                        />
                                    )}
                                </div>
                            )}
                        </InfiniteScroll>
                    )}
                </div>
            </section>
        </FrontendLayout>
    );
}
