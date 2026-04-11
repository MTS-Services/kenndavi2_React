import {
    CatalogEmptyStateBrowse,
    CatalogNoMoreProducts,
    CatalogProductCard,
    CatalogSkeletonCard,
    type CatalogProduct,
    type PaginatedCatalogProducts,
} from '@/components/frontend/product-catalog-grid';
import { Button } from '@/components/ui/button';
import FrontendLayout from '@/layouts/frontend-layout';
import { Head, InfiniteScroll, Link, router } from '@inertiajs/react';

interface Props {
    products: PaginatedCatalogProducts;
    page_title: string;
    page_subtitle: string;
}

export default function AiSuggestion({
    products,
    page_title,
    page_subtitle,
}: Props) {
    const allLoaded =
        products.data.length > 0 && products.current_page >= products.last_page;

    return (
        <FrontendLayout>
            <Head title={page_title} />

            <section className="container mx-auto my-10 space-y-10">
                <div className="mx-auto max-w-6xl space-y-4">
                    <Button
                        type="button"
                        variant="outline"
                        className="border-white/20 bg-white/5 text-white hover:bg-white/10"
                        onClick={() => router.visit('/')}
                    >
                        <span className="mr-2" aria-hidden>
                            ←
                        </span>
                        Back to home
                    </Button>

                    <div>
                        <h1 className="font-['Alumni_Sans'] text-3xl font-semibold tracking-wide text-white md:text-4xl">
                            {page_title}
                        </h1>
                        <p className="mt-2 max-w-2xl font-['Libre_Franklin'] text-sm text-white/60 md:text-base">
                            {page_subtitle}
                        </p>
                    </div>
                </div>

                <div className="space-y-8">
                    {products.data.length === 0 ? (
                        <CatalogEmptyStateBrowse
                            title="No suggestions yet"
                            description="We could not load any active products. Try browsing the shop."
                            action={
                                <Button
                                    asChild
                                    className="bg-red-700 hover:bg-red-800"
                                >
                                    <Link href="/men">Browse catalog</Link>
                                </Button>
                            }
                        />
                    ) : (
                        <InfiniteScroll
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
