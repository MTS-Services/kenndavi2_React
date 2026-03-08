import { Head, router } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';

export default function UserHome() {
    return (
        <UserLayout>
            <Head title="Dashboard" />

            {/* Main Wrapper (inherits layout background) */}
            <div className="relative min-h-screen w-full font-sans text-gray-900 pt-12">
                <div className="relative z-10 max-w-4xl mx-4 md:mx-auto space-y-6 ">
                            {/* Order Card: Pending */}
                            <div className="bg-[var(--bg-gray0)] p-2 rounded-sm flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-48 aspect-square bg-gray-200 overflow-hidden rounded-sm">
                                    <img
                                        src="/assets/images/Rectangle 4343.png"
                                        alt="1Broon Hoodie"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm text-gray-600">
                                            Order ID: <span className="text-black font-bold">#ord-001</span>
                                        </p>
                                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-sm text-xs font-bold uppercase font-[Alumni_Sans]">
                                            Pending
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 font-[Alumni_Sans]">Broon Hoodie</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-lg font-[Libre_Franklin]">
                                        A premium, smooth hoodie crafted with the perfect balance of comfort
                                        and street style.
                                    </p>
                                    <p className="text-xl font-bold mb-6 font-[Alumni_Sans]">$199</p>
                                    <button className="border border-red-200 text-red-600 px-6 py-2 rounded-sm text-sm hover:bg-red-50 transition-colors">
                                        Cancel Order
                                    </button>
                                </div>
                            </div>

                            {/* Order Card: Packed */}
                            <div className="bg-[var(--bg-gray0)] p-2 rounded-sm flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-48 aspect-square bg-gray-200 overflow-hidden rounded-sm">
                                    <img src="/assets/images/Rectangle 4343.png" alt="Broon Hoodie" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm text-gray-600">Order ID: <span className="text-black font-bold">#ord-002</span></p>
                                        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-sm text-xs font-bold uppercase font-[Alumni_Sans]">Packed</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 font-[Alumni_Sans]">Broon Hoodie</h3>
                                    <p className="text-sm text-gray-600 mb-4 max-w-lg font-[Libre_Franklin]">A premium, smooth hoodie crafted for street style.</p>
                                    <p className="text-xl font-bold mb-6 font-[Alumni_Sans]">$199</p>
                                    <button className="border border-red-200 text-red-600 px-6 py-2 rounded-sm text-sm hover:bg-red-50 transition-colors">Cancel Order</button>
                                </div>
                            </div>

                            {/* Order Card: Delivered */}
                            <div className="bg-[var(--bg-gray0)] p-2 rounded-sm flex flex-col md:flex-row gap-6">
                                <div className="w-full md:w-48 aspect-square bg-gray-200 overflow-hidden rounded-sm">
                                    <img src="/assets/images/Rectangle 4343.png" alt="Broon Hoodie" className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-grow">
                                    <div className="flex justify-between items-start mb-2">
                                        <p className="text-sm text-gray-600">Order ID: <span className="text-black font-bold">#ord-003</span></p>
                                        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-sm text-xs font-bold uppercase font-[Alumni_Sans]">Delivered</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2 font-[Alumni_Sans]">Broon Hoodie</h3>
                                    <p className="text-sm text-gray-600 mb-4 max-w-lg font-[Libre_Franklin]">A premium, smooth hoodie crafted for street style.</p>
                                    <p className="text-xl font-bold mb-6 font-[Libre_Franklin]">$199</p>
                                    <button
                                        onClick={() => router.get('/review')}
                                        className="bg-red-600 text-white px-6 py-2 rounded-sm text-sm hover:bg-red-700 transition-colors font-[Libre_Franklin]"
                                    >
                                        Write A Review
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
            </UserLayout>
    );
}
