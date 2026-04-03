import { Head, router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import FrontendLayout from '@/layouts/frontend-layout';
import { cn } from '@/lib/utils';
import { SharedData } from '@/types';

// ── Types ────────────────────────────────────────────────────────────────────

interface ProductImage {
    id: number;
    url: string;
    alt: string;
    is_primary: boolean;
    color_id: number | null;
}

interface ProductColor {
    id: number;
    name: string;
    value: string; // hex or Tailwind class
}

interface ProductSize {
    id: number;
    name: string;
}

interface ProductVariant {
    id: number;
    color_id: number | null;
    size_id: number | null;
    quantity: number;
}

interface RatingDistribution {
    star: number;
    count: number;
    percent: number;
}

interface ReviewUser {
    name: string;
    avatar: string | null;
}

interface ProductReview {
    id: number;
    rating: number;
    title: string | null;
    comment: string | null;
    created_at: string;
    user: ReviewUser;
}

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    discount: number;
    discount_type: 'percentage' | 'fixed';
    stock: number;
    avg_rating: number;
    review_count: number;
    rating_distribution: RatingDistribution[];
    images: ProductImage[];
    colors: ProductColor[];
    sizes: ProductSize[];
    variants: ProductVariant[];
    reviews: ProductReview[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Returns true if the color value looks like a hex/rgb/hsl string. */
function isColorCode(value: string | null | undefined): boolean {
    if (!value) return false;
    return (
        value.startsWith('#') ||
        value.startsWith('rgb') ||
        value.startsWith('hsl')
    );
}

function computeFinalPrice(
    price: number,
    discount: number,
    discountType: 'percentage' | 'fixed',
): number {
    if (!discount) return price;
    if (discountType === 'percentage') return price - (price * discount) / 100;
    return Math.max(0, price - discount);
}

const FALLBACK_IMG = '/assets/images/no-image.png';

function resolveUrl(url: string | null | undefined): string {
    if (!url) return FALLBACK_IMG;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
}

function StarRow({ rating }: { rating: number }) {
    return (
        <span>
            {[1, 2, 3, 4, 5].map((s) => (
                <span
                    key={s}
                    className={
                        s <= Math.round(rating)
                            ? 'text-orange-500'
                            : 'text-gray-600'
                    }
                >
                    ★
                </span>
            ))}
        </span>
    );
}

// ── Component ────────────────────────────────────────────────────────────────

export default function ProductDetails({ product }: { product: Product }) {
    const { auth } = usePage<SharedData>().props;
    console.log(auth);

    const [selectedImage, setSelectedImage] = useState<ProductImage>(
        product.images.find((i) => i.is_primary) ?? product.images[0],
    );

    // const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
    //     null,
    // );
    // const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);

    const [selectedColor, setSelectedColor] = useState<ProductColor | null>(
        product.colors[0] ?? null,
    );
    const [selectedSize, setSelectedSize] = useState<ProductSize | null>(
        product.sizes[0] ?? null,
    );

    const [quantity, setQuantity] = useState(1);

    const finalPrice = computeFinalPrice(
        product.price,
        product.discount,
        product.discount_type,
    );

    // Find the matching variant for the current color+size selection
    const selectedVariant = useMemo<ProductVariant | null>(() => {
        if (!selectedColor || !selectedSize) return null;
        return (
            product.variants.find(
                (v) =>
                    v.color_id === selectedColor.id &&
                    v.size_id === selectedSize.id,
            ) ?? null
        );
    }, [selectedColor, selectedSize, product.variants]);

    // Available sizes for the selected color
    const availableSizeIds = useMemo<Set<number>>(() => {
        if (!selectedColor) return new Set(product.sizes.map((s) => s.id));
        return new Set(
            product.variants
                .filter(
                    (v) => v.color_id === selectedColor.id && v.quantity > 0,
                )
                .map((v) => v.size_id!)
                .filter(Boolean),
        );
    }, [selectedColor, product.variants, product.sizes]);

    // Available colors for the selected size
    const availableColorIds = useMemo<Set<number>>(() => {
        if (!selectedSize) return new Set(product.colors.map((c) => c.id));
        return new Set(
            product.variants
                .filter((v) => v.size_id === selectedSize.id && v.quantity > 0)
                .map((v) => v.color_id!)
                .filter(Boolean),
        );
    }, [selectedSize, product.variants, product.colors]);

    const variantStock = selectedVariant?.quantity ?? 0;
    const isInStock = selectedVariant ? variantStock > 0 : product.stock > 0;
    const maxQty = selectedVariant ? variantStock : product.stock;

    function handleColorSelect(color: ProductColor) {
        setSelectedColor(color);
        // If selected size is no longer available for this color, clear it
        const still = product.variants.some(
            (v) =>
                v.color_id === color.id &&
                v.size_id === selectedSize?.id &&
                v.quantity > 0,
        );
        if (!still) setSelectedSize(null);

        // Switch displayed image to first image for this color (if any)
        const colorImage = product.images.find(
            (img) => img.color_id === color.id,
        );
        if (colorImage) setSelectedImage(colorImage);
    }

    function handleAddToCart(buyNow = false) {
        if (!selectedColor || !selectedSize) {
            alert('Please select a color and size.');
            return;
        }
        if (!selectedVariant || variantStock === 0) {
            alert('This combination is out of stock.');
            return;
        }
        const destination = buyNow ? '/checkout' : '/cartpage';
        router.post(destination, {
            variant_id: selectedVariant.id,
            product_id: product.id,
            quantity,
            price: finalPrice,
        });
    }

    return (
        <FrontendLayout>
            <Head title={product.title} />

            <div className="relative overflow-x-hidden font-sans text-white">
                <section className="text-gray-100">
                    <div className="relative z-10 container mx-auto px-6 py-10">
                        {/* BREADCRUMB */}
                        <nav className="mb-6 flex items-center space-x-2 text-sm">
                            <a href="/" className="hover:text-gray-300">
                                Home
                            </a>
                            <span>/</span>
                            <a href="/products" className="hover:text-gray-300">
                                Products
                            </a>
                            <span>/</span>
                            <span className="text-gray-400">
                                {product.title}
                            </span>
                        </nav>

                        {/* PRODUCT SECTION */}
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            {/* LEFT: IMAGES */}
                            <div>
                                <div className="aspect-[4/5] max-h-[600px] overflow-hidden rounded-sm bg-white shadow-xl shadow-black/20">
                                    <img
                                        src={resolveUrl(selectedImage?.url)}
                                        className="h-full w-full object-contain"
                                        alt={
                                            selectedImage?.alt ?? product.title
                                        }
                                    />
                                </div>

                                {/* Thumbnails */}
                                {product.images.length > 1 && (
                                    <div className="mt-4 flex flex-wrap gap-4">
                                        {product.images.map((img) => (
                                            <div
                                                key={img.id}
                                                onClick={() =>
                                                    setSelectedImage(img)
                                                }
                                                className={`transitionshrink-0 h-20 w-20 cursor-pointer overflow-hidden rounded-lg border-2 bg-white shadow-sm ${
                                                    selectedImage?.id === img.id
                                                        ? 'border-gray-100 ring-2 ring-primary'
                                                        : 'border-gray-300 hover:border-gray-100'
                                                }`}
                                            >
                                                <img
                                                    src={resolveUrl(img.url)}
                                                    className="h-full w-full object-cover"
                                                    alt={img.alt}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* RIGHT: DETAILS */}
                            <div>
                                {/* Rating */}
                                <div className="flex items-center gap-2 text-sm text-gray-100">
                                    <StarRow rating={product.avg_rating} />
                                    <span>
                                        {product.avg_rating} Star Rating (
                                        {product.review_count.toLocaleString()}{' '}
                                        Reviews)
                                    </span>
                                </div>

                                {/* Title */}
                                <h1 className="mt-4 text-2xl font-semibold">
                                    {product.title}
                                </h1>

                                {/* Description */}
                                <p className="mt-3 leading-relaxed text-gray-100">
                                    {product.description}
                                </p>

                                {/* Colors */}
                                {product.colors.length > 0 && (
                                    <div className="mt-6">
                                        <p className="mb-2 font-semibold text-gray-100">
                                            Colors
                                            {/* {selectedColor
                                                ? `: ${selectedColor.name}`
                                                : ''} */}
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {product.colors.map((color) => {
                                                const unavailable =
                                                    !availableColorIds.has(
                                                        color.id,
                                                    );
                                                const isSelected =
                                                    selectedColor?.id ===
                                                    color.id;
                                                return (
                                                    <button
                                                        key={color.id}
                                                        title={color.name}
                                                        disabled={unavailable}
                                                        onClick={() =>
                                                            handleColorSelect(
                                                                color,
                                                            )
                                                        }
                                                        // className={`relative h-7 w-7 rounded-full border-2 transition ${
                                                        //     isSelected
                                                        //         ? 'scale-110 border-white ring-2 '
                                                        //         : 'border-transparent hover:border-gray-300'
                                                        // } ${unavailable ? 'cursor-not-allowed opacity-30' : 'cursor-pointer'}`}
                                                        className={cn(
                                                            'relative h-7 w-7 rounded-full border-2 transition',
                                                            isSelected
                                                                ? `scale-110 border-white ring-2 ring-primary`
                                                                : 'border-transparent hover:border-gray-300',
                                                            unavailable
                                                                ? 'cursor-not-allowed opacity-30'
                                                                : 'cursor-pointer',
                                                        )}
                                                        style={
                                                            isColorCode(
                                                                color.value,
                                                            )
                                                                ? {
                                                                      backgroundColor:
                                                                          color.value!,
                                                                  }
                                                                : undefined
                                                        }
                                                    >
                                                        {/* Fallback: Tailwind class-based color */}
                                                        {!isColorCode(
                                                            color.value,
                                                        ) && (
                                                            <span
                                                                className={`absolute inset-0 rounded-full ${color.value}`}
                                                            />
                                                        )}
                                                        {/* Cross-out for unavailable */}
                                                        {unavailable && (
                                                            <span className="absolute inset-0 flex items-center justify-center text-xs text-white">
                                                                ✕
                                                            </span>
                                                        )}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Sizes */}
                                {product.sizes.length > 0 && (
                                    <div className="mt-6">
                                        <p className="mb-2 font-semibold text-gray-100">
                                            Size
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            {product.sizes.map((size) => {
                                                const unavailable =
                                                    !availableSizeIds.has(
                                                        size.id,
                                                    );
                                                const isSelected =
                                                    selectedSize?.id ===
                                                    size.id;
                                                return (
                                                    <button
                                                        key={size.id}
                                                        disabled={unavailable}
                                                        onClick={() =>
                                                            setSelectedSize(
                                                                size,
                                                            )
                                                        }
                                                        className={`relative rounded-md px-5 py-2 transition ${
                                                            isSelected
                                                                ? 'bg-primary text-white'
                                                                : unavailable
                                                                  ? 'cursor-not-allowed bg-gray-800 text-gray-500 line-through'
                                                                  : 'bg-gray-900 hover:bg-gray-700'
                                                        }`}
                                                    >
                                                        {size.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {/* Availability */}
                                <p className="mt-4 text-sm">
                                    Availability:{' '}
                                    {selectedVariant ? (
                                        <span
                                            className={`font-medium ${variantStock > 0 ? 'text-green-500' : 'text-red-500'}`}
                                        >
                                            {variantStock > 0
                                                ? `In Stock (${variantStock} left)`
                                                : 'Out of Stock'}
                                        </span>
                                    ) : (
                                        <span
                                            className={`font-medium ${product.stock > 0 ? 'text-green-500' : 'text-red-500'}`}
                                        >
                                            {product.stock > 0
                                                ? 'In Stock'
                                                : 'Out of Stock'}
                                        </span>
                                    )}
                                </p>

                                {/* Price */}
                                <div className="mt-4 flex items-center gap-4">
                                    <span className="text-2xl font-semibold">
                                        ${finalPrice.toFixed(2)}
                                    </span>
                                    {product.discount > 0 && (
                                        <>
                                            <span className="text-sm text-gray-400 line-through">
                                                ${product.price.toFixed(2)}
                                            </span>
                                            <span className="text-sm font-medium text-red-500">
                                                {product.discount_type ===
                                                'percentage'
                                                    ? `${product.discount}% OFF`
                                                    : `$${product.discount} OFF`}
                                            </span>
                                        </>
                                    )}
                                </div>

                                {/* Quantity + Actions */}
                                <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                                    <div className="flex w-fit items-center rounded-md border border-gray-600">
                                        <button
                                            onClick={() =>
                                                setQuantity((p) =>
                                                    Math.max(1, p - 1),
                                                )
                                            }
                                            className="px-3 py-2 transition hover:text-primary"
                                        >
                                            −
                                        </button>
                                        <span className="px-4">{quantity}</span>
                                        <button
                                            onClick={() =>
                                                setQuantity((p) =>
                                                    Math.min(maxQty, p + 1),
                                                )
                                            }
                                            disabled={quantity >= maxQty}
                                            className="px-3 py-2 transition hover:text-primary disabled:opacity-40"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleAddToCart(false)}
                                        disabled={!isInStock}
                                        className="flex-1 rounded-md bg-primary px-6 py-3 text-white transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial"
                                    >
                                        Add To Cart
                                        <i className="fa-solid fa-cart-plus ml-2" />
                                    </button>

                                    <button
                                        onClick={() => handleAddToCart(true)}
                                        disabled={!isInStock}
                                        className="flex-1 rounded-md border border-red-600 px-6 py-3 text-red-500 transition hover:bg-red-50/10 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-initial"
                                    >
                                        <i className="fa-solid fa-bag-shopping mr-2" />
                                        Buy Now
                                    </button>
                                </div>

                                <button
                                    onClick={() => router.get('/ai-suggestion')}
                                    className="mt-4 w-full rounded-md border border-gray-600 bg-gray-900 px-6 py-3 text-white transition hover:bg-gray-800 sm:w-auto"
                                >
                                    <i className="fa-solid fa-robot mr-2" />
                                    AI Suggest
                                </button>
                            </div>
                        </div>

                        {/* CUSTOMER FEEDBACK */}
                        <div className="mt-20 max-w-5xl">
                            <h2 className="mb-8 font-[Alumni_Sans] text-2xl font-semibold">
                                Customer Feedback
                            </h2>

                            {product.review_count === 0 ? (
                                <p className="text-gray-400">
                                    No reviews yet. Be the first to review this
                                    product!
                                </p>
                            ) : (
                                <>
                                    <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                                        {/* Overall Rating */}
                                        <div className="rounded-xl bg-yellow-100 p-8 text-center">
                                            <p className="font-[Alumni_Sans] text-5xl font-semibold text-gray-900">
                                                {product.avg_rating.toFixed(1)}
                                            </p>
                                            <div className="mt-2 text-xl">
                                                <StarRow
                                                    rating={product.avg_rating}
                                                />
                                            </div>
                                            <p className="mt-2 text-sm text-neutral-600">
                                                Customer rating (
                                                {product.review_count.toLocaleString()}
                                                )
                                            </p>
                                        </div>

                                        {/* Rating Bars */}
                                        <div className="space-y-4 lg:col-span-2">
                                            {product.rating_distribution.map(
                                                (row) => (
                                                    <div
                                                        key={row.star}
                                                        className="flex items-center gap-4"
                                                    >
                                                        <span className="w-20 shrink-0 text-sm text-orange-500">
                                                            {'★'.repeat(
                                                                row.star,
                                                            )}
                                                            {'☆'.repeat(
                                                                5 - row.star,
                                                            )}
                                                        </span>
                                                        <div className="h-2 flex-1 rounded bg-neutral-700">
                                                            <div
                                                                className="h-2 rounded bg-orange-500 transition-all"
                                                                style={{
                                                                    width: `${row.percent}%`,
                                                                }}
                                                            />
                                                        </div>
                                                        <span className="w-24 shrink-0 text-right text-sm text-gray-400">
                                                            {row.percent}% (
                                                            {row.count.toLocaleString()}
                                                            )
                                                        </span>
                                                    </div>
                                                ),
                                            )}
                                        </div>
                                    </div>

                                    {/* Reviews List */}
                                    <div className="mt-12 space-y-8">
                                        <h3 className="mb-6 font-[Alumni_Sans] text-xl font-medium">
                                            Recent Reviews
                                        </h3>
                                        {product.reviews.map((review) => (
                                            <div
                                                key={review.id}
                                                className="border-b border-gray-700 pb-6"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <img
                                                        src={resolveUrl(
                                                            review.user.avatar,
                                                        )}
                                                        className="h-10 w-10 rounded-full object-cover"
                                                        alt={review.user.name}
                                                    />
                                                    <div>
                                                        <p className="font-medium">
                                                            {review.user.name}
                                                        </p>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <StarRow
                                                                rating={
                                                                    review.rating
                                                                }
                                                            />
                                                            <span className="text-gray-400">
                                                                {
                                                                    review.created_at
                                                                }
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {review.title && (
                                                    <p className="mt-3 font-medium text-gray-100">
                                                        {review.title}
                                                    </p>
                                                )}
                                                {review.comment && (
                                                    <p className="mt-1 text-gray-300">
                                                        {review.comment}
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Pagination (reviews) */}
                        {product.review_count > 10 && (
                            <div className="mt-12 flex items-center space-x-2 font-sans">
                                <a
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center border border-gray-600 hover:bg-gray-800"
                                >
                                    «
                                </a>
                                <a
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center border border-gray-600 hover:bg-gray-800"
                                >
                                    ‹
                                </a>
                                <a
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-white"
                                >
                                    1
                                </a>
                                <a
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center border border-gray-600 hover:bg-gray-800"
                                >
                                    2
                                </a>
                                <a
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center border border-gray-600 hover:bg-gray-800"
                                >
                                    3
                                </a>
                                <span className="flex h-9 w-9 items-center justify-center text-gray-400">
                                    …
                                </span>
                                <a
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center border border-gray-600 hover:bg-gray-800"
                                >
                                    ›
                                </a>
                                <a
                                    href="#"
                                    className="flex h-9 w-9 items-center justify-center border border-gray-600 hover:bg-gray-800"
                                >
                                    »
                                </a>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </FrontendLayout>
    );
}
