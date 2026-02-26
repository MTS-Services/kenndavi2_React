import { Head, router } from '@inertiajs/react';
import FrontendLayout from '@/layouts/frontend-layout';

import { useState } from "react";

export default function ProductDetails() {
  const sizes = ["S", "M", "L", "XL", "XXL"];

  const colors = [
    { name: "Red", value: "bg-red-800" },
    { name: "Black", value: "bg-black" },
    { name: "Gray", value: "bg-gray" },
  ];

  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  return (
        <FrontendLayout>
            <Head title="Product Details" />
            <>
 
            <section className="text-neutral-800">
                <div className="container mx-auto px-6 py-10">

                {/* PRODUCT SECTION */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* LEFT: IMAGES */}
                    <div>
                    <div className="rounded-sm overflow-hidden bg-white">
                        <img
                            src="assets/images/Rectangle 20 (3).png"
                            className="w-full object-cover"
                            alt="Profile"
                            onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                img.onerror = null;
                                img.src = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                            }}
                        />   
                    </div>
                    {/* Thumbnails */}
                    <div className="flex gap-4 mt-4">
                        <img
                        src="assets/images/01 (1).png"
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer border border-neutral-300" 
                                onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                img.onerror = null;
                                img.src = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                            }}
                        />
                        <img
                        src="assets/images/05 (2).png"
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer border border-neutral-300"
                                onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                img.onerror = null;
                                img.src = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                            }}
                        />
                        <img
                        src="assets/images/03 (1).png"
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer border border-neutral-300" 
                                onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                img.onerror = null;
                                img.src = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                            }}
                        />
                        <img
                        src="assets/images/04 (1).png"
                        className="w-20 h-20 object-cover rounded-lg cursor-pointer border border-neutral-300" 
                                onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                img.onerror = null;
                                img.src = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                            }}
                        />
                    </div>
                    </div>
                    {/* RIGHT: DETAILS */}
                    <div>
                    {/* Rating */}
                    <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <div className="flex text-orange-500">★★★★★</div>
                        <span>4.7 Star Rating (21,671 User feedback)</span>
                    </div>
                    {/* Title */}
                    <h1 className="text-2xl font-semibold mt-4 font-[Alumni_Sans]">
                        Maroon hoodie
                    </h1>
                    {/* Description */}
                    <p className="text-neutral-600 mt-3 leading-relaxed font-[Alumni_Sans]">
                        A premium, smooth hoodie crafted with the perfect balance of comfort
                        and street style. Ideal for everyday wear — making every look
                        effortlessly fresh.
                    </p>
                    {/* Colors */}
                    <div className="mt-6">
                    <p className="font-semibold mb-2 font-[Alumni_Sans]">Colors</p>

                    <div className="flex gap-3">
                        {colors.map((color, index) => (
                        <span
                            key={index}
                            onClick={() => setSelectedColor(color.name)}
                            className={`w-6 h-6 ${color.value} rounded-full cursor-pointer border-2 ${
                            selectedColor === color.name
                                ? "border-black scale-110"
                                : "border-transparent"
                            } transition-all duration-200`}
                        />
                        ))}
                    </div>

                    {selectedColor && (
                        <p className="mt-3 text-sm">Selected: {selectedColor}</p>
                    )}
                    </div>
                    {/* Sizes */}
                    <div className="mt-6">
                        <p className="font-semibold mb-2 font-[Alumni_Sans]">Size</p>

                        <div className="flex gap-3">
                            {sizes.map((size) => (
                            <button
                                key={size}
                                onClick={() => setSelectedSize(size)}
                                className={`px-5 py-2 rounded-md transition-all duration-200 ${
                                selectedSize === size
                                    ? "bg-primary text-white"
                                    : "bg-neutral-200 hover:bg-neutral-300"
                                }`}
                            >
                                {size}
                            </button>
                            ))}
                        </div>

                        {selectedSize && (
                            <p className="mt-3 text-sm">Selected Size: {selectedSize}</p>
                        )}
                        </div>
                    {/* Availability */}
                    <p className="text-sm mt-4">
                        Availability:{" "}
                        <span className="text-green-600 font-medium">In Stock</span>
                    </p>
                    {/* Price */}
                    <div className="flex items-center gap-4 mt-4">
                        <span className="text-2xl font-semibold font-[Alumni_Sans]">
                        $1699
                        </span>
                        <span className="text-red-600 text-sm font-medium">21% OFF</span>
                    </div>
                    {/* Quantity + Buttons */}
                    <div className="flex items-center gap-4 mt-6">
                        <div className="flex items-center border rounded-md">
                        <button className="px-3 py-2">-</button>
                        <span className="px-4">01</span>
                        <button className="px-3 py-2">+</button>
                        </div>
                        <button className="bg-primary text-white lg:px-6 lg:py-3 px-1.5 py-1.5 rounded-md hover:bg-red-700 transition">
                        Add To Cart
                        <i className="fa-solid fa-cart-shopping" />
                        </button>
                        <button className="border border-red-600 text-red-600 lg:px-6 lg:py-3 px-1.5 py-1.5 rounded-md hover:bg-red-50 transition">
                        Buy Now
                        </button>
                    </div>
                    <button className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-md text-sm">
                        <i className="fa-solid fa-robot" />
                         AI Suggest
                    </button>
                    </div>
                </div>

                {/* CUSTOMER FEEDBACK */}
                <div className="mt-20 max-w-5xl">
                    <h2 className="text-2xl font-semibold mb-8 font-[Alumni_Sans]">
                    Customer Feedback
                    </h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Overall Rating */}
                    <div className="bg-yellow-100 p-8 rounded-xl text-center">
                        <p className="text-5xl font-semibold font-[Alumni_Sans]">4.7</p>
                        <div className="text-orange-500 text-xl mt-2">★★★★★</div>
                        <p className="text-sm text-neutral-600 mt-2">
                        Customer rating (834,516)
                        </p>
                    </div>
                    {/* Rating Bars */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex items-center gap-4">
                        <span className="text-orange-500 text-sm">★★★★★</span>
                        <div className="flex-1 bg-neutral-200 h-2 rounded">
                            <div className="bg-orange-500 h-2 rounded w-[63%]" />
                        </div>
                        <span className="text-sm text-neutral-500">63%  (94,532)</span>
                        </div>
                        <div className="flex items-center gap-4">
                        <span className="text-orange-500 text-sm">★★★★</span>
                        <div className="flex-1 bg-neutral-200 h-2 rounded">
                            <div className="bg-orange-500 h-2 rounded w-[24%]" />
                        </div>
                        <span className="text-sm text-neutral-500">24%  (6.717)</span>
                        </div>
                        <div className="flex items-center gap-4">
                        <span className="text-orange-500 text-sm">★★★</span>
                        <div className="flex-1 bg-neutral-200 h-2 rounded">
                            <div className="bg-orange-500 h-2 rounded w-[9%]" />
                        </div>
                        <span className="text-sm text-neutral-500">9%  (714)</span>
                        </div>
                        <div className="flex items-center gap-4">
                        <span className="text-orange-500 text-sm">★★</span>
                        <div className="flex-1 bg-neutral-200 h-2 rounded">
                            <div className="bg-orange-500 h-2 rounded w-[1%]" />
                        </div>
                        <span className="text-sm text-neutral-500">1%  (152)</span>
                        </div>
                        <div className="flex items-center gap-4">
                        <span className="text-orange-500 text-sm">★</span>
                        <div className="flex-1 bg-neutral-200 h-2 rounded">
                            <div className="bg-orange-500 h-2 rounded w-[7%]" />
                        </div>
                        <span className="text-sm text-neutral-500">7%  (643)</span>
                        </div>
                    </div>
                    </div>
                    {/* Reviews List */}
                    <div className="mt-12 space-y-8">
                    <h1 className="text-2xl font-medium mb-8 font-[Alumni_Sans]">
                        Customer Feedback
                    </h1>
                    {/* Review Item */}
                    <div className="border-b pb-6">
                        <div className="flex items-center gap-3">
                        <img
                            src="assets/images/Ellipse 12.png"
                            className="w-10 h-10 rounded-full"
                            alt="Profile"
                            onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                img.onerror = null;
                                img.src = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                            }}
                        />   
                        <div>
                            <p className="font-medium">Daniel Marshall</p>
                            <div className="text-orange-500 text-sm">★★★★★</div>
                        </div>
                        </div>
                        <p className="text-neutral-600 mt-3">
                        This hoodie completely changed my everyday style. The fit is
                        premium, the comfort is next-level, and the look is perfectly
                        balanced.
                        </p>
                    </div>
                    <div className="border-b pb-6">
                        <div className="flex items-center gap-3">
                        <img
                            src="assets/images/Ellipse 12.png"
                            className="w-10 h-10 rounded-full"
                            alt="Profile"
                            onError={(e) => {
                                const img = e.currentTarget as HTMLImageElement;
                                img.onerror = null;
                                img.src = "https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png";
                            }}
                        />                       
                        <div>
                            <p className="font-medium">Brooklyn Simmons</p>
                            <div className="text-orange-500 text-sm">★★★★★</div>
                        </div>
                        </div>
                        <p className="text-neutral-600 mt-3">
                        I wore it once and everyone asked where I got it from. The fit is
                        perfect and the vibe is unmatched.
                        </p>
                    </div>
                    </div>
                </div>

                <div className="flex items-center space-x-2 font-sans mt-12">
                    <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-700 hover:bg-gray-50"
                    >
                    «
                    </a>
                    <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-700 hover:bg-gray-50"
                    >
                    ‹
                    </a>
                    <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#b91c1c] text-white"
                    >
                    1
                    </a>
                    <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-700 hover:bg-gray-50"
                    >
                    2
                    </a>
                    <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-700 hover:bg-gray-50"
                    >
                    3
                    </a>
                    <span className="flex h-9 w-9 items-center justify-center text-gray-700">
                    ...
                    </span>
                    <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-700 hover:bg-gray-50"
                    >
                    10
                    </a>
                    <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-700 hover:bg-gray-50"
                    >
                    ›
                    </a>
                    <a
                    href="#"
                    className="flex h-9 w-9 items-center justify-center border border-gray-100 text-gray-700 hover:bg-gray-50"
                    >
                    »
                    </a>
                </div>

                </div>
            </section>
            
            </>

        </FrontendLayout>
    );
}   