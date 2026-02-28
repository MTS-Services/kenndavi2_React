import FrontendLayout from '@/layouts/frontend-layout';
import React from 'react';

const Cartpage: React.FC = () => {
    return (
        <FrontendLayout>
               <div className="bg-[var(--bg-animation)] font-sans text-gray-900 overflow-x-hidden">
                <div className="min-h-screen bg-[var(--bg-animation)] p-4 md:p-10 font-sans text-gray-900">
                    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
                    <div className="flex-grow bg-[var(--bg-animation)] p-6 md:p-8 rounded-sm">
                        <h1 className="text-xl font-[Libre_Franklin] font-semibold mb-8">
                        Shipping cart
                        </h1>
                        <div className="hidden md:grid grid-cols-12 text-sm text-gray-500 mb-6 border-b border-gray-200 pb-2">
                        <div className="col-span-6 uppercase tracking-wider">Products</div>
                        <div className="col-span-2 uppercase tracking-wider text-center">
                            Price
                        </div>
                        <div className="col-span-3 uppercase tracking-wider text-center">
                            Quantity
                        </div>
                        <div className="col-span-1" />
                        </div>
                        <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                            <div className="col-span-6 flex items-center space-x-4">
                            <div className="w-16 h-16 flex items-center justify-center rounded-sm">
                                <img
                                src="assets/images/Rectangle 25 (2).png"
                                alt="Broon hoodie"
                                className="object-cover h-12"
                                />
                            </div>
                            <span className="font-medium text-sm">Broon hoodie</span>
                            </div>
                            <div className="col-span-2 text-center font-bold text-lg font-[Libre_Franklin]">
                            $70
                            </div>
                            <div className="col-span-3 flex justify-center">
                            <div className="flex items-center border border-gray-100 px-3 py-1 space-x-4 bg-[var(--bg-animation)]">
                                <button className="text-gray-400 hover:text-black">—</button>
                                <span className="text-sm font-medium">01</span>
                                <button className="text-gray-400 hover:text-black">+</button>
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
                        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                            <div className="col-span-6 flex items-center space-x-4">
                            <div className="w-16 h-16 flex items-center justify-center rounded-sm">
                                <img
                                src="assets/images/Frame 2147226352 (4).png"
                                alt="Broon hoodie"
                                className="object-cover h-12"
                                />
                            </div>
                            <span className="font-medium text-sm">Broon hoodie</span>
                            </div>
                            <div className="col-span-2 text-center font-bold text-lg font-[Libre_Franklin]">
                            $70
                            </div>
                            <div className="col-span-3 flex justify-center">
                            <div className="flex items-center border border-gray-100 px-3 py-1 space-x-4 bg-[var(--bg-animation)]">
                                <button className="text-gray-400 hover:text-black">—</button>
                                <span className="text-sm font-medium">01</span>
                                <button className="text-gray-400 hover:text-black">+</button>
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
                        <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                            <div className="col-span-6 flex items-center space-x-4">
                            <div className="w-16 h-16 flex items-center justify-center rounded-sm">
                                <img
                                src="assets/images/Rectangle 28 (4).png"
                                alt="Broon hoodie"
                                className="object-cover h-12"
                                />
                            </div>
                            <span className="font-medium text-sm">Broon hoodie</span>
                            </div>
                            <div className="col-span-2 text-center font-bold text-lg font-[Libre_Franklin]">
                            $70
                            </div>
                            <div className="col-span-3 flex justify-center">
                            <div className="flex items-center border border-gray-100 px-3 py-1 space-x-4 bg-[var(--bg-animation)]">
                                <button className="text-gray-400 hover:text-black">—</button>
                                <span className="text-sm font-medium ">01</span>
                                <button className="text-gray-400 hover:text-black">+</button>
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
                    <div className="w-full lg:w-80 bg-[#F4EDED] p-8 rounded-sm self-start">
                        <h2 className="text-xl font-bold mb-6 font-[Libre_Franklin]">
                        Card totals
                        </h2>
                        <div className="space-y-4 text-sm mb-6">
                        <div className="flex justify-between border-b border-gray-200 pb-2">
                            <span className="text-gray-600 font-[Libre_Franklin]">
                            Sub-total
                            </span>
                            <span className="font-bold text-right">$210</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-300 pb-2">
                            <span className="text-gray-600 font-[Libre_Franklin]">
                            Shipping
                            </span>
                            <span className="font-bold font-[Libre_Franklin]">$00</span>
                        </div>
                        <div className="flex justify-between pt-2">
                            <span className="font-bold font-[Libre_Franklin]">Total</span>
                            <span className="font-bold font-[Libre_Franklin]">$210</span>
                        </div>
                        </div>
                        <button className="w-full bg-[#bd2a2a] text-white py-3 rounded-sm flex items-center justify-center space-x-2 hover:bg-red-800 transition-colors mb-4">
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
                        <button className="w-full border border-[#bd2a2a] text-[#bd2a2a] py-3 rounded-sm hover:bg-red-50 transition-colors">
                        Back
                        </button>
                    </div>
                    </div>
                </div>
                </div>

        </FrontendLayout>
    );
};

export default Cartpage;