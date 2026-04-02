import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

import FrontendLayout from '@/layouts/frontend-layout';

export default function ProductDetails() {
    // Product Data (API-ready structure)
    const product = {
        title: 'Maroon Hoodie',
        description:
            'A premium, smooth hoodie crafted with the perfect balance of comfort and street style. Ideal for everyday wear—making every look effortlessly fresh.',
        price: 1699,
        discount: 21,
        stock: 12,
        rating: 4.7,
        reviews: 21671,
        images: [
            'assets/images/Rectangle 20 (4).png',
            'assets/images/rectangle1.png',
            'assets/images/rechangle22.png',
            'assets/images/rechangle74.png',
            'assets/images/rechangle22.jpg',
        ],
        colors: [
            { name: 'Maroon', value: 'bg-red-800' },
            { name: 'Black', value: 'bg-black' },
            { name: 'Gray', value: 'bg-gray-600' },
        ],
        sizes: [38, 40, 42, 44],
    };

    // State
    const [selectedImage, setSelectedImage] = useState(product.images[0]);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<number | null>(null);
    const [quantity, setQuantity] = useState(1);

    const finalPrice = product.price - (product.price * product.discount) / 100;

    return (
        <FrontendLayout>
            <Head title="Product Details" />

            <div className="relative overflow-x-hidden font-sans text-white">
                <section className="text-gray-100">
                    <div className="relative z-10 container mx-auto px-6 py-10">
                        {/* BREADCRUMB */}
                        <div className="mb-6">
                            <nav className="flex items-center space-x-2 text-sm">
                                <a href="#" className="hover:text-gray-300">
                                    Home
                                </a>
                                <span>/</span>
                                <a href="#" className="hover:text-gray-300">
                                    Products
                                </a>
                                <span>/</span>
                                <span className="text-gray-400">
                                    {product.title}
                                </span>
                            </nav>
                        </div>

                        {/* PRODUCT SECTION */}
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            {/* LEFT: IMAGES */}
                            <div>
                                <div className="overflow-hidden rounded-sm bg-white shadow-xl shadow-black/20">
                                    <img
                                        src={selectedImage}
                                        className="w-full bg-gray-100 object-contain"
                                        alt={product.title}
                                    />
                                </div>

                                {/* Thumbnails */}
                                <div className="mt-4 flex gap-4">
                                    {product.images.map((img, index) => (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                setSelectedImage(img)
                                            }
                                            className={`h-20 w-20 cursor-pointer overflow-hidden rounded-lg border-2 bg-white shadow-sm ${
                                                selectedImage === img
                                                    ? 'border-gray-100 ring-2 ring-primary'
                                                    : 'border-gray-300 hover:border-gray-100'
                                            } transition`}
                                        >
                                            <img
                                                src={img}
                                                className="h-full w-full object-cover"
                                                alt={`${product.title} thumbnail ${index + 1}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* RIGHT: DETAILS */}
                            <div>
                                {/* Rating */}
                                <div className="flex items-center gap-2 text-sm text-gray-100">
                                    <div className="text-orange-500">
                                        {'★'.repeat(Math.round(product.rating))}
                                    </div>
                                    <span>
                                        {product.rating} Star Rating (
                                        {product.reviews.toLocaleString()}{' '}
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
                                <div className="mt-6">
                                    <p className="mb-2 font-semibold text-gray-100">
                                        Colors
                                    </p>
                                    <div className="flex gap-3">
                                        {product.colors.map((color, index) => (
                                            <span
                                                key={index}
                                                onClick={() =>
                                                    setSelectedColor(color.name)
                                                }
                                                className={`h-6 w-6 ${color.value} cursor-pointer rounded-full border-2 ${
                                                    selectedColor === color.name
                                                        ? 'scale-110 border-gray-100'
                                                        : 'border-transparent'
                                                } transition`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Sizes */}
                                <div className="mt-6">
                                    <p className="mb-2 font-semibold text-gray-100">
                                        Size
                                    </p>
                                    <div className="flex gap-3">
                                        {product.sizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() =>
                                                    setSelectedSize(size)
                                                }
                                                className={`rounded-md px-5 py-2 ${
                                                    selectedSize === size
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-900'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Availability */}
                                <p className="mt-4 text-sm">
                                    Availability:{' '}
                                    <span
                                        className={`font-medium ${
                                            product.stock > 0
                                                ? 'text-green-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {product.stock > 0
                                            ? 'In Stock'
                                            : 'Out of Stock'}
                                    </span>
                                </p>

                                {/* Price */}
                                <div className="mt-4 flex items-center gap-4">
                                    <span className="text-2xl font-semibold">
                                        ${finalPrice.toFixed(0)}
                                    </span>
                                    <span className="text-sm font-medium text-red-600">
                                        {product.discount}% OFF
                                    </span>
                                </div>

                                {/* Quantity */}
                                <div className="mt-6 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                                    <div className="flex w-fit items-center rounded-md border">
                                        <button
                                            onClick={() =>
                                                setQuantity((prev) =>
                                                    Math.max(1, prev - 1),
                                                )
                                            }
                                            className="px-3 py-2"
                                        >
                                            -
                                        </button>
                                        <span className="px-4">{quantity}</span>
                                        <button
                                            onClick={() =>
                                                setQuantity((prev) => prev + 1)
                                            }
                                            className="px-3 py-2"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => {
                                            if (
                                                !selectedColor ||
                                                !selectedSize
                                            ) {
                                                alert(
                                                    'Please select color and size',
                                                );
                                                return;
                                            }
                                            router.post('/cartpage', {
                                                product_id: product.title,
                                                quantity,
                                                color: selectedColor,
                                                size: selectedSize,
                                                price: finalPrice,
                                            });
                                        }}
                                        className="flex-1 rounded-md bg-primary px-6 py-3 text-white transition hover:bg-primary/90 sm:flex-initial"
                                    >
                                        Add To Cart
                                        <i className="fa-solid fa-cart-plus ml-2" />
                                    </button>

                                    <button
                                        onClick={() => {
                                            if (
                                                !selectedColor ||
                                                !selectedSize
                                            ) {
                                                alert(
                                                    'Please select color and size',
                                                );
                                                return;
                                            }
                                            router.post('/cartpage', {
                                                product_id: product.title,
                                                quantity,
                                                color: selectedColor,
                                                size: selectedSize,
                                                price: finalPrice,
                                            });
                                        }}
                                        className="flex-1 rounded-md border border-red-600 px-6 py-3 text-red-600 transition hover:bg-red-50 sm:flex-initial"
                                    >
                                        <i className="fa-solid fa-bag-shopping mr-2" />
                                        Buy Now
                                    </button>
                                </div>
                                <button
                                    onClick={() => router.get('/ai-suggestion')}
                                    className="mt-6 w-full rounded-md border border-gray-300 bg-gray-900 px-6 py-3 text-gray-700 text-white transition sm:w-auto"
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
                            <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
                                {/* Overall Rating */}
                                <div className="rounded-xl bg-yellow-100 p-8 text-center">
                                    <p className="font-[Alumni_Sans] text-5xl font-semibold text-gray-900">
                                        4.7
                                    </p>
                                    <div className="mt-2 text-xl text-orange-500">
                                        ★★★★★
                                    </div>
                                    <p className="mt-2 text-sm text-neutral-600">
                                        Customer rating (834,516)
                                    </p>
                                </div>
                                {/* Rating Bars */}
                                <div className="space-y-4 lg:col-span-2">
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-orange-500">
                                            ★★★★★
                                        </span>
                                        <div className="h-2 flex-1 rounded bg-neutral-200">
                                            <div className="h-2 w-[63%] rounded bg-orange-500" />
                                        </div>
                                        <span className="text-sm text-gray-100">
                                            63% (94,532)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-orange-500">
                                            ★★★★
                                        </span>
                                        <div className="h-2 flex-1 rounded bg-neutral-200">
                                            <div className="h-2 w-[24%] rounded bg-orange-500" />
                                        </div>
                                        <span className="text-sm text-gray-100">
                                            24% (6.717)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-orange-500">
                                            ★★★
                                        </span>
                                        <div className="h-2 flex-1 rounded bg-neutral-200">
                                            <div className="h-2 w-[9%] rounded bg-orange-500" />
                                        </div>
                                        <span className="text-sm text-gray-100">
                                            9% (714)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-orange-500">
                                            ★★
                                        </span>
                                        <div className="h-2 flex-1 rounded bg-neutral-200">
                                            <div className="h-2 w-[1%] rounded bg-orange-500" />
                                        </div>
                                        <span className="text-sm text-gray-100">
                                            1% (152)
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-orange-500">
                                            ★
                                        </span>
                                        <div className="h-2 flex-1 rounded bg-neutral-200">
                                            <div className="h-2 w-[7%] rounded bg-orange-500" />
                                        </div>
                                        <span className="text-sm text-gray-100">
                                            7% (643)
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {/* Reviews List */}
                            <div className="mt-12 space-y-8">
                                <h1 className="mb-8 font-[Alumni_Sans] text-2xl font-medium">
                                    Customer Feedback
                                </h1>
                                {/* Review Item */}
                                <div className="border-b pb-6">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="assets/images/Ellipse 12.png"
                                            className="h-10 w-10 rounded-full"
                                            alt="Profile"
                                            onError={(e) => {
                                                const img =
                                                    e.currentTarget as HTMLImageElement;
                                                img.onerror = null;
                                                img.src =
                                                    'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
                                            }}
                                        />
                                        <div>
                                            <p className="font-medium">
                                                Daniel Marshall
                                            </p>
                                            <div className="text-sm text-orange-500">
                                                ★★★★★
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-gray-100">
                                        This hoodie completely changed my
                                        everyday style. The fit is premium, the
                                        comfort is next-level, and the look is
                                        perfectly balanced.
                                    </p>
                                </div>
                                <div className="border-b pb-6">
                                    <div className="flex items-center gap-3">
                                        <img
                                            src="assets/images/Ellipse 12.png"
                                            className="h-10 w-10 rounded-full"
                                            alt="Profile"
                                            onError={(e) => {
                                                const img =
                                                    e.currentTarget as HTMLImageElement;
                                                img.onerror = null;
                                                img.src =
                                                    'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png';
                                            }}
                                        />
                                        <div>
                                            <p className="font-medium">
                                                Brooklyn Simmons
                                            </p>
                                            <div className="text-sm text-orange-500">
                                                ★★★★★
                                            </div>
                                        </div>
                                    </div>
                                    <p className="mt-3 text-gray-100">
                                        I wore it once and everyone asked where
                                        I got it from. The fit is perfect and
                                        the vibe is unmatched.
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex items-center space-x-2 font-sans">
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-100 hover:bg-gray-50"
                            >
                                «
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-100 hover:bg-gray-50"
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
                                className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-100 hover:bg-gray-50"
                            >
                                2
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-100 hover:bg-gray-50"
                            >
                                3
                            </a>
                            <span className="flex h-9 w-9 items-center justify-center text-gray-100">
                                ...
                            </span>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-100 hover:bg-gray-50"
                            >
                                10
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-100 hover:bg-gray-50"
                            >
                                ›
                            </a>
                            <a
                                href="#"
                                className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-100 hover:bg-gray-50"
                            >
                                »
                            </a>
                        </div>
                    </div>
                </section>
            </div>
        </FrontendLayout>
    );
}
