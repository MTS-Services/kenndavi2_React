import { Head } from "@inertiajs/react";
import FrontendLayout from "@/layouts/frontend-layout";

export default function OrderConfirmed() {
    return (
        <FrontendLayout>
            <Head title="Order Confirmed" />
            <div className="bg-[var(--bg-animation)] font-sans text-gray-900 overflow-x-hidden">
            <div className="bg-[var(--bg-animation)] py-6 font-sans text-[var(--text-red)]">
                <div className="max-w-6xl mx-auto">
                <button className="bg-[var(--primary-color)] text-white p-2 rounded-sm hover:bg-red-800 transition-colors">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                    </svg>
                </button>
                </div>
                <div className="flex flex-col items-center mb-12">
                <div className="relative w-25 h-25 mb-4">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-pulse" />
                    <div className="relative flex items-center justify-center w-full h-full rounded-full text-white">
                    <img src="images/Confit.png" alt="" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold mb-2 font-['Libre_Franklin']">
                    Order Confirmed!
                </h1>
                <p className="text-gray font-['Libre_Franklin']">
                    Thank you for your purchase
                </p>
                </div>
                <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
                <div className="flex-grow space-y-6">
                    <div className="bg-[var(--bg-gray0)] p-8 rounded-sm relative">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                        <p className="text-lg font-bold mb-4 font-['Libre_Franklin']">
                            Order ID:{" "}
                            <span className="font-normal text-gray-700">#04589</span>
                        </p>
                        <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            Oct 5, 2025
                            </div>
                            <div className="flex items-center gap-2">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                />
                            </svg>
                            customer@gmail.com
                            </div>
                        </div>
                        </div>
                        <div className="bg-[var(--bg-nevired)] border border-red-700 p-4 text-xs text-red-800 max-w-xs rounded font-['Libre_Franklin']">
                        A confirmation email has been sent to your inbox
                        </div> 
                    </div>      
                    <div className="mt-8">
                        <h2 className="text-xl font-bold mb-4 font-['Libre_Franklin']">
                        Shipped to Your Address
                        </h2>
                        <p className="text-sm text-gray-500 mb-4 font-['Libre_Franklin']">
                        3 items in this shipment
                        </p>
                        <div className="space-y-4">
                        <div className="bg-[var(--bg-animation)] p-5 rounded flex gap-4">
                            <div className="text-[var(--bg-gray)]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            </div>
                            <div>
                            <p className="font-bold text-sm font-['Libre_Franklin']">
                                Delivery Address
                            </p>
                            <p className="text-sm text-gray-600 font-['Libre_Franklin']">
                                4517 Washington Ave. Manchester, Kentucky 39495
                            </p>
                            </div>
                        </div>
                        <div className="bg-[var(--bg-animation)] p-5 rounded flex gap-4">
                            <div className="text-[var(--bg-gray)]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                />
                            </svg>
                            </div>
                            <div>
                            <p className="font-bold text-sm font-['Libre_Franklin']">
                                Estimated delivery date
                            </p>
                            <p className="text-sm text-gray-600 font-['Libre_Franklin']">
                                Oct 8, 2025 - Oct 12, 2025
                            </p>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="w-full lg:w-[380px] bg-[var(--bg-gray0)] p-8 rounded-sm self-start">
                    <h2 className="text-lg font-bold mb-6 uppercase tracking-tight font-['Libre_Franklin']">
                    Order summery
                    </h2>
                    <div className="space-y-4 mb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded shrink-0">
                        <img
                            src="images/Rectangle 25 (4).png"
                            alt="Hoodie"
                            className="h-12 object-contain"
                        />
                        </div>
                        <div className="text-xs">
                        <p className="font-bold text-sm font-['Libre_Franklin']">
                            Broon hoodie
                        </p>
                        <p className="text-gray-500">
                            1 x <span className="font-bold text-black">$70</span>
                        </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded shrink-0">
                        <img
                            src="images/Frame 2147226352 (1).png"
                            alt="Hoodie"
                            className="h-12 object-contain"
                        />
                        </div>
                        <div className="text-xs">
                        <p className="font-bold text-sm font-['Libre_Franklin']">
                            Black pant
                        </p>
                        <p className="text-gray-500">
                            1 x <span className="font-bold text-black">$70</span>
                        </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 flex items-center justify-center rounded shrink-0">
                        <img
                            src="images/Rectangle 28 (1).png"
                            alt="Hoodie"
                            className="h-12 object-contain"
                        />
                        </div>
                        <div className="text-xs">
                        <p className="font-bold text-sm font-['Libre_Franklin']">
                            Black shoe
                        </p>
                        <p className="text-gray-500">
                            1 x <span className="font-bold text-black">$70</span>
                        </p>
                        </div>
                    </div>
                    </div>
                    <div className="space-y-3 text-sm border-t border-gray-300 pt-6">
                    <div className="flex justify-between text-gray-600">
                        <span className="font-['Libre_Franklin']">Sub-total</span>
                        <span className="font-bold text-black">$210</span>
                    </div>
                    <div className="flex justify-between text-gray-600 border-b border-gray-300 pb-3">
                        <span className="font-['Libre_Franklin']">Shipping</span>
                        <span className="font-bold text-black">$00</span>
                    </div>
                    <div className="flex justify-between pt-1 mb-8">
                        <span className="font-bold font-['Libre_Franklin']">Total</span>
                        <span className="font-bold text-base">$210</span>
                    </div>
                    <div className="flex justify-between text-xs pt-4 border-t border-gray-300">
                        <span className="text-gray-600 font-['Libre_Franklin']">
                        Payment Method:
                        </span>
                        <span className="font-bold font-['Libre_Franklin']">
                        Online payment
                        </span>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>

        </FrontendLayout>
    );
}