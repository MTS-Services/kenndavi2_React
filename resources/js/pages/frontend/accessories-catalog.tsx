import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import FrontendLayout from "@/layouts/frontend-layout";

const CATALOG_PATH = "/accessories/catalog";

function GridItem({ img, title, isLarge = false }: { img: string; title: string; isLarge?: boolean }) {
    return (
        <>
            <div
                className={`relative w-full cursor-pointer overflow-hidden rounded group ${isLarge ? "h-100 lg:h-212.5" : "h-48 lg:h-105"}`}
            >
                <div
                    className="absolute inset-0 h-full w-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                    style={{ backgroundImage: `url('${img}')` }}
                >
                    <div className="absolute inset-0 bg-gray-900/10 via-gray-900 to-transparent transition-all duration-700 group-hover:from-gray-900 group-hover:via-gray-900/90 group-hover:to-transparent"></div>
                    <div className="absolute inset-0 backdrop-brightness-100 transition-colors duration-500 group-hover:backdrop-brightness-90"></div>
                </div>

                <div className="relative z-10 flex h-full translate-y-8 flex-col items-center justify-center px-4 text-white opacity-0 transition-all duration-700 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                    <h3 className="mb-2 text-center text-xl font-['Alumni_Sans'] font-semibold tracking-wide uppercase md:mb-4 md:text-3xl">
                        {title}
                    </h3>
                    <div className="mb-4 h-10 w-px origin-top scale-y-0 bg-white/50 transition-all delay-100 duration-700 group-hover:scale-y-100 lg:h-20"></div>
                    <button
                        type="button"
                        onClick={() => router.get("/productdetails")}
                        className="relative scale-75 overflow-hidden rounded bg-primary px-10 py-4 text-base font-['Libre_Franklin'] font-medium opacity-0 shadow-lg transition-all delay-200 duration-700 group-hover:scale-100 group-hover:opacity-100"
                    >
                        <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-full"></span>
                        <span className="relative z-10">View Details</span>
                    </button>
                </div>

                <div className="pointer-events-none absolute inset-0 rounded-md border-2 border-transparent transition-all duration-500 group-hover:border-white/20"></div>
            </div>
        </>
    );
}

type Option = { value: string; label: string };

type Product = {
    id: number;
    title: string;
    slug: string;
    price: string | number;
    discount: string | number | null;
    image_url: string | null;
};

type Props = {
    categories?: Option[];
    subcategories?: Record<string, Option[]>;
    selectedCategory?: string;
    selectedSubcategory?: string;
    products?: Product[];
    currentPage?: number;
    totalPages?: number;
};

export default function AccessoriesCatalog({
    categories = [],
    subcategories = {},
    selectedCategory = "all",
    selectedSubcategory = "all",
    products = [],
    currentPage = 1,
    totalPages = 1,
}: Props) {
    const [category, setCategory] = useState(selectedCategory);
    const [subcategory, setSubcategory] = useState(selectedSubcategory);

    useEffect(() => {
        setCategory(selectedCategory ?? "all");
        setSubcategory(selectedSubcategory ?? "all");
    }, [selectedCategory, selectedSubcategory]);

    const subcategoryOptions = useMemo(() => {
        if (category === "all") return [];
        return subcategories[category] ?? [];
    }, [category, subcategories]);

    const resolveImageUrl = (url: string | null) => {
        if (!url) return "/assets/images/bg.png";
        if (url.startsWith("http://") || url.startsWith("https://")) return url;
        if (url.startsWith("/")) return url;
        return `/${url}`;
    };

    const navigateWithFilters = (nextCategory: string, nextSubcategory: string) => {
        const query: Record<string, string> = {};
        if (nextCategory !== "all") query.category = nextCategory;
        if (nextSubcategory !== "all") query.subcategory = nextSubcategory;
        query.page = "1";
        router.get(CATALOG_PATH, query);
    };

    const navigateWithFiltersAndPage = (nextCategory: string, nextSubcategory: string, nextPage: number) => {
        const query: Record<string, string> = {};
        if (nextCategory !== "all") query.category = nextCategory;
        if (nextSubcategory !== "all") query.subcategory = nextSubcategory;
        query.page = String(nextPage);
        router.get(CATALOG_PATH, query);
    };

    const productAt = (index: number) => products[index] ?? null;

    const isDefaultFilters = category === "all" && subcategory === "all";

    const defaultSlots = [
        { img: "/assets/images/Rectangle 15 (5).png", title: "Accessories", isLarge: true },
        { img: "/assets/images/Rectangle 16 (6).png", title: "Featured", isLarge: true },
        { img: "/assets/images/Rectangle 17 (2).png", title: "New", isLarge: false },
        { img: "/assets/images/Frame 98 (6).png", title: "Collection", isLarge: false },
    ];

    const slotData = (index: number) => {
        const slot = defaultSlots[index];
        const p = productAt(index);

        if (!slot) return null;
        if (isDefaultFilters) return slot;

        if (!p) return slot;

        return {
            img: resolveImageUrl(p.image_url),
            title: p.title,
            isLarge: slot.isLarge,
        };
    };

    return (
        <FrontendLayout>
            <Head title="Accessories" />
            <div className="overflow-x-hidden bg-[var(--bg-animason)] font-sans text-gray-900">
                <section className="container mx-auto px-4 pt-10 pb-6">
                    <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                        <div>
                            <label className="mb-2 block font-['Alumni_Sans'] text-xl font-semibold tracking-wide text-white/80">
                                Category
                            </label>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(event) => {
                                        const nextCategory = event.target.value;
                                        setCategory(nextCategory);
                                        setSubcategory("all");
                                        navigateWithFilters(nextCategory, "all");
                                    }}
                                    className="w-full rounded-lg border border-white/10 bg-white/90 py-3 pr-10 pl-4 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-white focus:ring-2 focus:ring-white/20"
                                >
                                    <option value="all">All</option>
                                    {categories.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500" />
                            </div>
                        </div>

                        <div>
                            <label className="mb-2 block font-['Alumni_Sans'] text-xl font-semibold tracking-wide text-white/80">
                                Subcategory
                            </label>
                            <div className="relative">
                                <select
                                    value={subcategory}
                                    onChange={(event) => {
                                        const nextSubcategory = event.target.value;
                                        setSubcategory(nextSubcategory);
                                        navigateWithFilters(category, nextSubcategory);
                                    }}
                                    className="w-full rounded-lg border border-white/10 bg-white/90 py-3 pr-10 pl-4 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-white focus:ring-2 focus:ring-white/20"
                                >
                                    <option value="all">All</option>
                                    {subcategoryOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500" />
                            </div>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setCategory("all");
                                    setSubcategory("all");
                                    navigateWithFilters("all", "all");
                                }}
                                className="inline-flex items-center justify-center rounded bg-red-700 px-5 py-4 text-sm font-semibold text-white shadow-lg transition focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </section>

                <div className="space-y-8">
                    <section className="container mx-auto py-6 lg:py-12">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                            <div className="md:col-span-1">
                                {(() => {
                                    const s = slotData(0);
                                    if (!s) return null;
                                    return <GridItem isLarge={!!s.isLarge} img={s.img} title={s.title} />;
                                })()}
                            </div>
                            <div className="md:col-span-2">
                                {(() => {
                                    const s = slotData(1);
                                    if (!s) return null;
                                    return <GridItem isLarge={!!s.isLarge} img={s.img} title={s.title} />;
                                })()}
                            </div>
                            <div className="flex flex-col gap-4 md:col-span-1">
                                {(() => {
                                    const s2 = slotData(2);
                                    const s3 = slotData(3);
                                    return (
                                        <>
                                            {s2 ? <GridItem img={s2.img} title={s2.title} isLarge={!!s2.isLarge} /> : null}
                                            {s3 ? <GridItem img={s3.img} title={s3.title} isLarge={!!s3.isLarge} /> : null}
                                        </>
                                    );
                                })()}
                            </div>
                        </div>
                    </section>

                    {!isDefaultFilters && products.length === 0 && (
                        <div className="py-10 text-center text-white/80">No products found for this filter.</div>
                    )}

                    {totalPages > 1 && (
                        <div className="flex items-center justify-center gap-4 pb-10">
                            {currentPage < totalPages && (
                                <button
                                    type="button"
                                    onClick={() => navigateWithFiltersAndPage(category, subcategory, currentPage + 1)}
                                    className="inline-flex items-center justify-center rounded bg-red-700 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-red-800 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                                >
                                    Load More
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </FrontendLayout>
    );
}
