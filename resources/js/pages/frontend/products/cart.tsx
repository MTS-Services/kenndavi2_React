import { shipping } from '@/routes/order';
import { router } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

export default function Cart() {
    return (
        <FrontendLayout>
            <section className="container mx-auto max-w-6xl p-4 font-sans md:p-10">
                <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="flex-grow rounded-sm bg-[var(--bg-gray0)] p-6 md:p-8">
                        <h1 className="mb-8 font-[Alumni_Sans] text-xl font-semibold text-gray-900">
                            Shipping cart
                        </h1>
                        <div className="mb-6 hidden grid-cols-12 border-b border-gray-200 pb-2 text-sm text-text-primary md:grid">
                            <div className="col-span-6 tracking-wider text-gray-900 uppercase">
                                Products
                            </div>
                            <div className="col-span-2 text-center tracking-wider text-gray-900 uppercase">
                                Price
                            </div>
                            <div className="col-span-3 text-center tracking-wider text-gray-900 uppercase">
                                Quantity
                            </div>
                            <div className="col-span-1" />
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                                <div className="col-span-6 flex items-center space-x-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-sm">
                                        <img
                                            src="assets/images/Rectangle 25 (2).png"
                                            alt="Broon hoodie"
                                            className="h-12 object-cover"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        Broon hoodie
                                    </span>
                                </div>
                                <div className="col-span-2 text-center font-[Libre_Franklin] text-lg font-bold text-gray-900">
                                    $70
                                </div>
                                <div className="col-span-3 flex justify-center">
                                    <div className="flex items-center space-x-4 border border-gray-100 bg-[var(--bg-animation)] px-3 py-1">
                                        <button className="text-gray-400 hover:text-black">
                                            —
                                        </button>
                                        <span className="text-sm font-medium text-gray-900">
                                            01
                                        </span>
                                        <button className="text-gray-400 hover:text-black">
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="col-span-1 flex justify-end md:justify-center">
                                    <button className="text-gray-400 hover:text-red-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                                <div className="col-span-6 flex items-center space-x-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-sm">
                                        <img
                                            src="assets/images/Frame 2147226352 (4).png"
                                            alt="Broon hoodie"
                                            className="h-12 object-cover"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        Broon hoodie
                                    </span>
                                </div>
                                <div className="col-span-2 text-center font-[Libre_Franklin] text-lg font-bold text-gray-900">
                                    $70
                                </div>
                                <div className="col-span-3 flex justify-center">
                                    <div className="flex items-center space-x-4 border border-gray-100 bg-[var(--bg-animation)] px-3 py-1">
                                        <button className="text-gray-400 hover:text-black">
                                            —
                                        </button>
                                        <span className="text-sm font-medium text-gray-900">
                                            01
                                        </span>
                                        <button className="text-gray-400 hover:text-black">
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="col-span-1 flex justify-end md:justify-center">
                                    <button className="text-gray-400 hover:text-red-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 items-center gap-4 md:grid-cols-12">
                                <div className="col-span-6 flex items-center space-x-4">
                                    <div className="flex h-16 w-16 items-center justify-center rounded-sm">
                                        <img
                                            src="assets/images/Rectangle 28 (4).png"
                                            alt="Broon hoodie"
                                            className="h-12 object-cover"
                                        />
                                    </div>
                                    <span className="text-sm font-medium text-gray-900">
                                        Broon hoodie
                                    </span>
                                </div>
                                <div className="col-span-2 text-center font-[Libre_Franklin] text-lg font-bold text-gray-900">
                                    $70
                                </div>
                                <div className="col-span-3 flex justify-center">
                                    <div className="flex items-center space-x-4 border border-gray-100 bg-[var(--bg-animation)] px-3 py-1">
                                        <button className="text-gray-400 hover:text-black">
                                            —
                                        </button>
                                        <span className="text-sm font-medium text-gray-900">
                                            01
                                        </span>
                                        <button className="text-gray-400 hover:text-black">
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className="col-span-1 flex justify-end md:justify-center">
                                    <button className="text-gray-400 hover:text-red-600">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-5 w-5"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="1.5"
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full self-start rounded-sm bg-[var(--bg-gray0)] p-8 lg:w-80">
                        <h2 className="mb-6 font-[Alumni_Sans] text-xl font-bold text-gray-900">
                            Card totals
                        </h2>
                        <div className="mb-6 space-y-4 text-sm">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="font-[Libre_Franklin] text-gray-600 text-gray-900">
                                    Sub-total
                                </span>
                                <span className="text-right font-bold text-gray-900">
                                    $210
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-300 pb-2">
                                <span className="font-[Libre_Franklin] text-gray-600 text-gray-900">
                                    Shipping
                                </span>
                                <span className="font-[Libre_Franklin] font-bold text-gray-900">
                                    $00
                                </span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="font-[Libre_Franklin] font-bold text-gray-900">
                                    Total
                                </span>
                                <span className="font-[Libre_Franklin] font-bold text-gray-900">
                                    $210
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => router.get(shipping().url)}
                            className="mb-4 flex w-full items-center justify-center space-x-2 rounded-sm bg-[var(--bg-red)] py-3 text-white transition-colors hover:bg-red-800"
                        >
                            <span>Proceed To Checkout</span>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                />
                            </svg>
                        </button>
                        <button
                            onClick={() => window.history.back()}
                            className="w-full rounded-sm border border-primary py-3 text-primary transition-colors hover:bg-red-50"
                        >
                            Back
                        </button>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
