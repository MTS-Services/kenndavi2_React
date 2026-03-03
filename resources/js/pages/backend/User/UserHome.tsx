import { Head, router } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';

export default function UserHome() {
    return (
        <UserLayout>
            <Head title="Dashboard" />
            <div className="bg-[#FDF7F7] font-sans text-gray-900 overflow-x-hidden">
             <div className="min-h-screen bg-[#fdf8f7] p-4 md:p-10 font-sans text-[#1a1a1a]">
                <div className="max-w-4xl mx-auto space-y-6">
                <div className="bg-[#f4ecea] p-6 rounded-sm flex flex-col md:flex-row gap-6 relative">
                    <div className="w-full md:w-48 aspect-square bg-gray-200 overflow-hidden rounded-sm">
                    <img
                        src="/assets/images/Rectangle 4343.png"
                        alt="Broon Hoodie"
                        className="w-full h-full object-cover"
                    />
                    </div>
                    <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-gray-600">
                        Order ID: <span className="text-black">#ord-001</span>
                        </p>
                        <span className="bg-red-50 text-red-600 px-3 py-1 rounded-sm text-xs font-bold uppercase font-['Libre_Franklin']">
                        Pending
                        </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 font-['Libre_Franklin']">
                        Broon Hoodie
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-lg font-['Libre_Franklin']">
                        A premium, smooth hoodie crafted with the perfect balance of comfort
                        and street style. Ideal for everyday wear—making every look
                        effortlessly fresh.
                    </p>
                    <p className="text-xl font-bold mb-6 font-['Libre_Franklin']">$199</p>
                    <button className="border border-red-200 text-red-600 px-6 py-2 rounded-sm text-sm hover:bg-red-50 transition-colors">
                        Cancel Order
                    </button>
                    </div>
                </div>
                <div className="bg-[#f4ecea] p-6 rounded-sm flex flex-col md:flex-row gap-6 relative">
                    <div className="w-full md:w-48 aspect-square bg-gray-200 overflow-hidden rounded-sm">
                    <img
                        src="/assets/images/Rectangle 4343.png"
                        alt="Broon Hoodie"
                        className="w-full h-full object-cover"
                    />
                    </div>
                    <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-gray-600">
                        Order ID: <span className="text-black">#ord-001</span>
                        </p>
                        <span className="bg-purple-50 text-purple-600 px-3 py-1 rounded-sm text-xs font-bold uppercase font-['Libre_Franklin']">
                        Packed
                        </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 font-['Libre_Franklin']">
                        Broon Hoodie
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-lg font-['Libre_Franklin']">
                        A premium, smooth hoodie crafted with the perfect balance of comfort
                        and street style.
                    </p>
                    <p className="text-xl font-bold mb-6 font-['Libre_Franklin']">$199</p>
                    <button className="border border-red-200 text-red-600 px-6 py-2 rounded-sm text-sm hover:bg-red-50 transition-colors">
                        Cancel Order
                    </button>
                    </div>
                </div>
                <div className="bg-[#f4ecea] p-6 rounded-sm flex flex-col md:flex-row gap-6 relative">
                    <div className="w-full md:w-48 aspect-square bg-gray-200 overflow-hidden rounded-sm">
                    <img
                        src="/assets/images/Rectangle 4343.png"
                        alt="Broon Hoodie"
                        className="w-full h-full object-cover"
                    />
                    </div>
                    <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                        <p className="text-sm text-gray-600">
                        Order ID: <span className="text-black">#ord-001</span>
                        </p>
                        <span className="bg-green-50 text-green-600 px-3 py-1 rounded-sm text-xs font-bold uppercase font-['Libre_Franklin']">
                        Delivered
                        </span>
                    </div>
                    <h3 className="text-xl font-bold mb-2 font-['Libre_Franklin']">
                        Broon Hoodie
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 max-w-lg font-['Libre_Franklin']">
                        A premium, smooth hoodie crafted with the perfect balance of comfort
                        and street style.
                    </p>
                    <p className="text-xl font-bold mb-6 font-['Libre_Franklin']">$199</p>
                    <button onClick={() => router.get('/review')} className="bg-[#c22e2e] text-white px-6 py-2 rounded-sm text-sm hover:bg-red-800 transition-colors font-['Libre_Franklin']">
                        Write A Review
                    </button>
                    </div>
                </div>
                </div>
             </div>
            </div>

        </UserLayout>
    );
}

