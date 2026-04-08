import FrontendLayout from '@/layouts/frontend-layout';
import { Head, router } from '@inertiajs/react';

export default function Orders() {
    return (
        <FrontendLayout>
            <Head title="Orders" />

            {/* Main Wrapper (inherits layout background) */}
            <section className="flex flex-1 items-center justify-center py-10">
                <div className="container mx-auto max-w-4xl space-y-6">
                    {/* Order Card: Pending */}
                    <div className="flex flex-col gap-6 rounded-sm bg-[var(--bg-gray0)] p-2 md:flex-row">
                        <div className="aspect-square w-full overflow-hidden rounded-sm bg-gray-200 md:w-48">
                            <img
                                src="/assets/images/Rectangle 4343.png"
                                alt="1Broon Hoodie"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex-grow">
                            <div className="mb-2 flex items-start justify-between">
                                <p className="text-sm text-gray-600">
                                    Order ID:{' '}
                                    <span className="font-bold text-black">
                                        #ord-001
                                    </span>
                                </p>
                                <span className="rounded-sm bg-red-50 px-3 py-1 font-[Alumni_Sans] text-xs font-bold text-red-600 uppercase">
                                    Pending
                                </span>
                            </div>
                            <h3 className="mb-2 font-[Alumni_Sans] text-xl font-bold">
                                Broon Hoodie
                            </h3>
                            <p className="mb-4 max-w-lg font-[Libre_Franklin] text-sm leading-relaxed text-gray-600">
                                A premium, smooth hoodie crafted with the
                                perfect balance of comfort and street style.
                            </p>
                            <p className="mb-6 font-[Alumni_Sans] text-xl font-bold">
                                $199
                            </p>
                            <button className="rounded-sm border border-red-200 px-6 py-2 text-sm text-red-600 transition-colors hover:bg-red-50">
                                Cancel Order
                            </button>
                        </div>
                    </div>

                    {/* Order Card: Packed */}
                    <div className="flex flex-col gap-6 rounded-sm bg-[var(--bg-gray0)] p-2 md:flex-row">
                        <div className="aspect-square w-full overflow-hidden rounded-sm bg-gray-200 md:w-48">
                            <img
                                src="/assets/images/Rectangle 4343.png"
                                alt="Broon Hoodie"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex-grow">
                            <div className="mb-2 flex items-start justify-between">
                                <p className="text-sm text-gray-600">
                                    Order ID:{' '}
                                    <span className="font-bold text-black">
                                        #ord-002
                                    </span>
                                </p>
                                <span className="rounded-sm bg-purple-50 px-3 py-1 font-[Alumni_Sans] text-xs font-bold text-purple-600 uppercase">
                                    Packed
                                </span>
                            </div>
                            <h3 className="mb-2 font-[Alumni_Sans] text-xl font-bold">
                                Broon Hoodie
                            </h3>
                            <p className="mb-4 max-w-lg font-[Libre_Franklin] text-sm text-gray-600">
                                A premium, smooth hoodie crafted for street
                                style.
                            </p>
                            <p className="mb-6 font-[Alumni_Sans] text-xl font-bold">
                                $199
                            </p>
                            <button className="rounded-sm border border-red-200 px-6 py-2 text-sm text-red-600 transition-colors hover:bg-red-50">
                                Cancel Order
                            </button>
                        </div>
                    </div>

                    {/* Order Card: Delivered */}
                    <div className="flex flex-col gap-6 rounded-sm bg-[var(--bg-gray0)] p-2 md:flex-row">
                        <div className="aspect-square w-full overflow-hidden rounded-sm bg-gray-200 md:w-48">
                            <img
                                src="/assets/images/Rectangle 4343.png"
                                alt="Broon Hoodie"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <div className="flex-grow">
                            <div className="mb-2 flex items-start justify-between">
                                <p className="text-sm text-gray-600">
                                    Order ID:{' '}
                                    <span className="font-bold text-black">
                                        #ord-003
                                    </span>
                                </p>
                                <span className="rounded-sm bg-green-50 px-3 py-1 font-[Alumni_Sans] text-xs font-bold text-green-600 uppercase">
                                    Delivered
                                </span>
                            </div>
                            <h3 className="mb-2 font-[Alumni_Sans] text-xl font-bold">
                                Broon Hoodie
                            </h3>
                            <p className="mb-4 max-w-lg font-[Libre_Franklin] text-sm text-gray-600">
                                A premium, smooth hoodie crafted for street
                                style.
                            </p>
                            <p className="mb-6 font-[Libre_Franklin] text-xl font-bold">
                                $199
                            </p>
                            <button
                                onClick={() => router.get('/review')}
                                className="rounded-sm bg-red-600 px-6 py-2 font-[Libre_Franklin] text-sm text-white transition-colors hover:bg-red-700"
                            >
                                Write A Review
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
