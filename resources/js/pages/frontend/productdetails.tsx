import { Head, router } from '@inertiajs/react';
import FrontendLayout from '@/layouts/frontend-layout';

import { useState } from "react";

export default function ProductDetails() {

    // Product Data (API-ready structure)
  const product = {
    title: "Maroon Hoodie",
    description:
      "A premium, smooth hoodie crafted with the perfect balance of comfort and street style. Ideal for everyday wear—making every look effortlessly fresh.",
    price: 1699,
    discount: 21,
    stock: 12,
    rating: 4.7,
    reviews: 21671,
    images: [
      "assets/images/Rectangle 20 (4).png",
      "assets/images/rectangle1.png",
      "assets/images/rechangle22.png",
      "assets/images/rechangle74.png",
      "assets/images/rechangle22.jpg", 
    ],
    colors: [
      { name: "Maroon", value: "bg-red-800" },
      { name: "Black", value: "bg-black" },
      { name: "Gray", value: "bg-gray-600" },
    ],
    sizes: [38, 40, 42, 44],
  };

  // State
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const finalPrice =
    product.price - (product.price * product.discount) / 100;


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
                        src={selectedImage}
                        className="w-full object-cover"
                        alt={product.title}
                      />
                    </div>

                    {/* Thumbnails */}
                    <div className="flex gap-4 mt-4">
                      {product.images.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          onClick={() => setSelectedImage(img)}
                          className={`w-20 h-20 object-cover rounded-lg cursor-pointer border ${
                            selectedImage === img
                              ? "border-black"
                              : "border-neutral-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                {/* RIGHT: DETAILS */}
                <div>
                  {/* Rating */}
                  <div className="flex items-center gap-2 text-sm text-neutral-600">
                    <div className="text-orange-500">
                      {"★".repeat(Math.round(product.rating))}
                    </div>
                    <span>
                      {product.rating} Star Rating ({product.reviews.toLocaleString()} Reviews)
                    </span>
                  </div>

                  {/* Title */}
                  <h1 className="text-2xl font-semibold mt-4">
                    {product.title}
                  </h1>

                  {/* Description */}
                  <p className="text-neutral-600 mt-3 leading-relaxed">
                    {product.description}
                  </p>

                  {/* Colors */}
                  <div className="mt-6">
                    <p className="font-semibold mb-2">Colors</p>
                    <div className="flex gap-3">
                      {product.colors.map((color, index) => (
                        <span
                          key={index}
                          onClick={() => setSelectedColor(color.name)}
                          className={`w-6 h-6 ${color.value} rounded-full cursor-pointer border-2 ${
                            selectedColor === color.name
                              ? "border-black scale-110"
                              : "border-transparent"
                          } transition`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div className="mt-6">
                    <p className="font-semibold mb-2">Size</p>
                    <div className="flex gap-3">
                      {product.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-5 py-2 rounded-md ${
                            selectedSize === size
                              ? "bg-primary text-white"
                              : "bg-neutral-200"
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <p className="text-sm mt-4">
                    Availability:{" "}
                    <span
                      className={`font-medium ${
                        product.stock > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {product.stock > 0 ? "In Stock" : "Out of Stock"}
                    </span>
                  </p>

                  {/* Price */}
                  <div className="flex items-center gap-4 mt-4">
                    <span className="text-2xl font-semibold">
                      ${finalPrice.toFixed(0)}
                    </span>
                    <span className="text-red-600 text-sm font-medium">
                      {product.discount}% OFF
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-4 mt-6">
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() =>
                          setQuantity((prev) => Math.max(1, prev - 1))
                        }
                        className="px-3 py-2"
                      >
                        -
                      </button>
                      <span className="px-4">{quantity}</span>
                      <button
                        onClick={() => setQuantity((prev) => prev + 1)}
                        className="px-3 py-2"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => router.get('/cartpage')}
                      className="bg-primary text-white px-6 py-3 rounded-md"
                    >
                      Add To Cart
                      <i className="fa-solid fa-cart-plus ml-2" />
                    </button>
                    <button className="border border-red-600 text-red-600 px-6 py-3 rounded-md hover:bg-red-50 transition">
                      <i className="fa-solid fa-bag-shopping mr-2" />
                      Buy Now
                    </button>
                   
                  </div>
                  <button onClick={() => router.get('/ai-suggestion')} className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md bg-gray-900 text-white transition mt-6">
                    <i className="fa-solid fa-robot mr-2" />
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
                    className="flex h-9 w-9 items-center justify-center rounded-sm bg-primary text-white"
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