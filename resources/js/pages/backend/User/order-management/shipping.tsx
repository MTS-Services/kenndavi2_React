import { Head, router } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

export default function ShippingInformation() {
    return (
        <FrontendLayout>
            <Head title="Shipping Information" />

            <section className="container mx-auto max-w-7xl p-4 py-10">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
                    <div className="flex-grow rounded-sm bg-[var(--bg-gray0)] p-6 md:p-8">
                        <h1 className="mb-8 font-['Alumni_Sans'] text-2xl font-bold">
                            Shipping information
                        </h1>
                        <form className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="text-md mb-2 block font-['Alumni_Sans'] font-bold">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        className="w-full rounded-md border border-[#110304B8] bg-transparent p-3 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-md mb-2 block font-['Alumni_Sans'] font-bold">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        className="w-full rounded-md border border-[#110304B8] bg-transparent p-3 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div>
                                    <label className="text-md mb-2 block font-['Alumni_Sans'] font-bold">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="jackson.graham@example.com"
                                        className="w-full rounded-md border border-[#110304B8] bg-transparent p-3 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-md mb-2 block font-['Alumni_Sans'] font-bold">
                                        Phone number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="(406) 555-0120"
                                        className="w-full rounded-md border border-[#110304B8] bg-transparent p-3 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div>
                                    <label className="text-md mb-2 block font-['Alumni_Sans'] font-bold">
                                        Region/State
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Antofagasta"
                                        className="w-full rounded-md border border-[#110304B8] bg-transparent p-3 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-md mb-2 block font-['Alumni_Sans'] font-bold">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Pembroke Pines"
                                        className="w-full rounded-md border border-[#110304B8] bg-transparent p-3 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-md mb-2 block font-['Alumni_Sans'] font-bold">
                                        Zip code
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="97133"
                                        className="w-full rounded-md border border-[#110304B8] bg-transparent p-3 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-md mb-2 block font-['Alumni_Sans'] font-bold">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    placeholder="8558 Green Rd."
                                    className="w-full rounded-md border border-[#110304B8] bg-transparent p-3 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="save-address"
                                    className="h-5 w-5 rounded border-[#110304B8] accent-red-700"
                                />
                                <label
                                    htmlFor="save-address"
                                    className="text-sm"
                                >
                                    Save shipping address into default address
                                </label>
                            </div>
                        </form>
                    </div>
                    <div className="w-full self-start rounded-sm bg-[var(--bg-gray0)] p-6 md:p-8 lg:w-[380px]">
                        <h2 className="mb-6 font-['Libre_Franklin'] text-lg font-bold text-gray-900">
                            Order summary
                        </h2>
                        <div className="mb-8 space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md">
                                    <img
                                        src="assets/images/Rectangle 25 (3).png"
                                        alt="Hoodie"
                                        className="h-10 object-contain"
                                    />
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-gray-900">
                                        Broon hoodie
                                    </p>
                                    <p className="text-gray-600">
                                        1 x{' '}
                                        <span className="font-bold text-gray-900">
                                            $70
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md">
                                    <img
                                        src="assets/images/Frame 2147226352 (1).png"
                                        alt="Pants"
                                        className="h-10 object-contain"
                                    />
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-gray-900">
                                        Black pant
                                    </p>
                                    <p className="text-gray-600">
                                        1 x{' '}
                                        <span className="font-bold text-gray-900">
                                            $70
                                        </span>
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-md">
                                    <img
                                        src="assets/images/Rectangle 28 (1).png"
                                        alt="Shoes"
                                        className="h-10 object-contain"
                                    />
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold text-gray-900">
                                        Black shoe
                                    </p>
                                    <p className="text-gray-600">
                                        1 x{' '}
                                        <span className="font-bold text-gray-900">
                                            $70
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="mb-8 space-y-3 border-t border-gray-300 pt-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-900">Sub-total</span>
                                <span className="font-bold text-gray-900">
                                    $210
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-300 pb-3">
                                <span className="text-gray-900">Shipping</span>
                                <span className="font-bold text-gray-900">
                                    $00
                                </span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="font-['Libre_Franklin'] font-bold text-gray-900">
                                    Total
                                </span>
                                <span className="text-base font-bold text-gray-900">
                                    $210
                                </span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <button
                                onClick={() => router.get('/orderconfirmed')}
                                className="flex w-full items-center justify-center gap-2 rounded-sm bg-[var(--bg-red)] py-3 font-medium text-white transition-colors hover:bg-red-800"
                            >
                                Place Order
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
                                className="w-full rounded-sm border border-[var(--bg-red)] py-3 font-medium text-[var(--bg-red)] transition-colors hover:bg-red-50"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
