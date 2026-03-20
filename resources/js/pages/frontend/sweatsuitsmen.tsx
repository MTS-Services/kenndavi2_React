import { Head, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import FrontendLayout from "@/layouts/frontend-layout";

// --- REUSABLE GRID ITEM COMPONENT ---
// This handles the high-end hover effect for all product boxes
function GridItem({ img, title, isLarge = false }: { img: string, title: string, isLarge?: boolean }) {
    return (

        <>
            <div className={`relative overflow-hidden rounded group cursor-pointer w-full ${isLarge ? 'h-100 lg:h-212.5' : 'h-48 lg:h-105'}`}>
            {/* Background Image with Zoom & Rotate Effect */}
            <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat w-full h-full transition-all duration-1000 ease-out group-hover:scale-110 group-hover:rotate-1"
                style={{ backgroundImage: `url('${img}')` }}
            >
                {/* Dynamic Overlay */}
                <div className="absolute inset-0 transition-all duration-700 bg-gray-900/10 via-gray-900 to-transparent group-hover:from-gray-900 group-hover:via-gray-900/90 group-hover:to-transparent"></div>
                <div className="absolute inset-0 transition-colors duration-500 backdrop-brightness-100 group-hover:backdrop-brightness-90"></div>
            </div>

            {/* Content Container (Slides up on hover) */}
            <div className="relative z-10 flex h-full flex-col items-center justify-center text-white px-4 transition-all duration-700 ease-out translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100">

                {/* Title */}
                <h3 className="mb-2 md:mb-4 text-xl md:text-3xl font-['Alumni_Sans'] font-semibold tracking-wide text-center uppercase">
                    {title}
                </h3>

                {/* Decorative Line */}
                <div className="mb-4 h-10 lg:h-20 w-px bg-white/50 transition-all duration-700 delay-100 scale-y-0 group-hover:scale-y-100 origin-top"></div>

                {/* The Button */}
                <button onClick={() => router.get('/productdetails')} className="bg-primary px-10 py-4 text-base font-medium font-['Libre_Franklin'] transition-all duration-700 delay-200 opacity-0 scale-75 group-hover:opacity-100 group-hover:scale-100 rounded shadow-lg relative overflow-hidden">
                    <span className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative z-10">View Details</span>
                </button>
            </div>

            {/* Image border glow */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-md transition-all duration-500 pointer-events-none"></div>
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

export default function SweatsuitsMen({
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
        router.get("/sweatsuitsmen", query);
    };

    const navigateWithFiltersAndPage = (nextCategory: string, nextSubcategory: string, nextPage: number) => {
        const query: Record<string, string> = {};
        if (nextCategory !== "all") query.category = nextCategory;
        if (nextSubcategory !== "all") query.subcategory = nextSubcategory;
        query.page = String(nextPage);
        router.get("/sweatsuitsmen", query);
    };

    const productAt = (index: number) => products[index] ?? null;

    const isDefaultFilters = category === "all" && subcategory === "all";

    const defaultSlots = [
        { img: "/assets/images/Rectangle 15 (5).png", title: "Tracksuit Back", isLarge: true },
        { img: "/assets/images/Rectangle 16 (6).png", title: "Tracksuit Front", isLarge: true },
        { img: "/assets/images/Rectangle 17 (2).png", title: "Aces Box", isLarge: false },
        { img: "/assets/images/Frame 98 (6).png", title: "Hoodie Flat", isLarge: false },
    ];

    const slotData = (index: number) => {
        const slot = defaultSlots[index];
        const p = productAt(index);

        if (!slot) return null;
        if (isDefaultFilters) return slot;

        // Use dynamic product data when filters are not default.
        // If this slot doesn't have a product for the current page, fall back to the original static slot image.
        if (!p) return slot;

        return {
            img: resolveImageUrl(p.image_url),
            title: p.title,
            isLarge: slot.isLarge,
        };
    };

    return (
        <FrontendLayout>
            <Head title="Sweatsuits Men" />
            <div className="bg-[var(--bg-animason)] font-sans text-gray-900 overflow-x-hidden">

                {/* --- FILTER HEADER --- */}
                <section className="container mx-auto px-4 pt-10 pb-6">
                    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-4 items-end">
                        <div>
                            <label className="block text-xl font-semibold tracking-wide text-white/80 mb-2 font-['Alumni_Sans']">Category</label>
                            <div className="relative">
                                <select
                                    value={category}
                                    onChange={(event) => {
                                        const nextCategory = event.target.value;
                                        setCategory(nextCategory);
                                        setSubcategory("all");
                                        navigateWithFilters(nextCategory, "all");
                                    }}
                                    className="w-full rounded-lg border border-white/10 bg-white/90 py-3 pl-4 pr-10 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-white focus:ring-2 focus:ring-white/20"
                                >
                                    <option value="all">All</option>
                                    {categories.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                    {/* <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 7L10 11L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg> */}
                                </span>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xl font-semibold tracking-wide text-white/80 mb-2 font-['Alumni_Sans']">Subcategory</label>
                            <div className="relative">
                                <select
                                    value={subcategory}
                                    onChange={(event) => {
                                        const nextSubcategory = event.target.value;
                                        setSubcategory(nextSubcategory);
                                        navigateWithFilters(category, nextSubcategory);
                                    }}
                                    className="w-full rounded-lg border border-white/10 bg-white/90 py-3 pl-4 pr-10 text-sm font-medium text-gray-900 shadow-sm outline-none transition focus:border-white focus:ring-2 focus:ring-white/20"
                                >
                                    <option value="all">All</option>
                                    {subcategoryOptions.map((opt) => (
                                        <option key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>

                                <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-500">
                                    {/* <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M6 7L10 11L14 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg> */}
                                </span>
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
                                className="inline-flex items-center justify-center rounded bg-red-700 px-5 py-4 text-sm font-semibold text-white shadow-lg transition focus:outline-none focus:ring-2 focus:ring-red-500/50"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </div>
                </section>

                <div className="space-y-8">
                    {/* SECTION 1: Layout 1-2-1 */}
                    <section className="lg:py-12 py-6 container mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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

                            <div className="md:col-span-1 flex flex-col gap-4">
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
                        <div className="text-white/80 text-center py-10">
                            No products found for this filter.
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-4 pb-10">
                            {currentPage < totalPages && (
                                <button
                                    type="button"
                                    onClick={() => navigateWithFiltersAndPage(category, subcategory, currentPage + 1)}
                                    className="inline-flex items-center justify-center rounded bg-red-700 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-red-500/50"
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
