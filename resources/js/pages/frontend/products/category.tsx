import { Button } from '@/components/ui/button';
import {
    CatalogEmptyStateFilters,
    CatalogNoMoreProducts,
    CatalogProductCard,
    CatalogSkeletonCard,
    type CatalogProduct,
    type PaginatedCatalogProducts,
} from '@/components/frontend/product-catalog-grid';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import FrontendLayout from '@/layouts/frontend-layout';
import { Head, InfiniteScroll, router } from '@inertiajs/react';
import { useEffect, useMemo, useRef, useState } from 'react';

interface SubcategoryOption {
    value: string;
    label: string;
}

interface CategoryOption {
    value: string;
    label: string;
    subcategories: SubcategoryOption[];
}

interface Props {
    products: PaginatedCatalogProducts;
    type: string;
    type_label: string;
    categories: CategoryOption[];
    selected_category: string;
    selected_subcategory: string;
}

export default function ProductCategory({
    products,
    type,
    type_label,
    categories,
    selected_category,
    selected_subcategory,
}: Props) {
    const [category, setCategory] = useState(selected_category);
    const [subcategory, setSubcategory] = useState(selected_subcategory);

    const navigating = useRef(false);

    useEffect(() => {
        if (!navigating.current) {
            setCategory(selected_category);
            setSubcategory(selected_subcategory);
        }
    }, [selected_category, selected_subcategory]);

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

    function navigate(nextCategory: string, nextSubcategory: string) {
        const query: Record<string, string> = {};
        if (nextCategory !== 'all') query.category = nextCategory;
        if (nextSubcategory !== 'all') query.subcategory = nextSubcategory;

        navigating.current = true;

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
                <div className="mx-auto max-w-6xl">
                    <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto]">
                        <div>
                            <label className="mb-2 block font-['Alumni_Sans'] text-xl font-semibold tracking-wide text-white/80">
                                Category
                            </label>
                            <Select
                                value={category}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger className="h-auto w-full rounded-lg border border-white/10 bg-white/90 py-3 pl-4 text-sm font-medium text-gray-900 shadow-sm transition outline-none focus:ring-2 focus:ring-white/20">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {categories.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

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
                            <Select
                                value={subcategory}
                                onValueChange={handleSubcategoryChange}
                                disabled={!subcategoryEnabled}
                            >
                                <SelectTrigger
                                    className={`h-auto w-full rounded-lg border border-white/10 py-3 pl-4 text-sm font-medium shadow-sm transition-all duration-200 outline-none ${
                                        subcategoryEnabled
                                            ? 'bg-white/90 text-gray-900 focus:ring-2 focus:ring-white/20'
                                            : 'cursor-not-allowed bg-white/20 text-white/30'
                                    }`}
                                >
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All</SelectItem>
                                    {subcategoryOptions.map((opt) => (
                                        <SelectItem
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="flex items-center justify-between lg:justify-end">
                            <Button
                                type="button"
                                onClick={handleClear}
                                className="inline-flex cursor-pointer items-center justify-center rounded bg-red-700 px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-red-800 focus:ring-2 focus:ring-red-500/50 focus:outline-none"
                            >
                                Clear Filters
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="space-y-8">
                    {products.data.length === 0 ? (
                        <CatalogEmptyStateFilters onClear={handleClear} />
                    ) : (
                        <InfiniteScroll
                            key={`${selected_category}-${selected_subcategory}`}
                            data="products"
                            buffer={300}
                            onlyNext
                        >
                            {({ loading }: { loading: boolean }) => (
                                <div className="space-y-8">
                                    {products.data.map((product: CatalogProduct) => (
                                        <CatalogProductCard
                                            key={product.id}
                                            product={product}
                                        />
                                    ))}

                                    {loading && <CatalogSkeletonCard />}

                                    {allLoaded && !loading && (
                                        <CatalogNoMoreProducts
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
