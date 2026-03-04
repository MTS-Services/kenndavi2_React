import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

export default function AdminDashboard() {
    return (
        <AdminLayout title="Dashboard" description="Welcome to your admin dashboard.">
            <div className="grid grid-cols-12 gap-6 mb-6">
                <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-4">
                    <div className="bg-[var(--bg-animation)] p-5 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-gray-900 text-sm">Total orders</span>
                            <div
                                className="w-12 h-8 bg-teal-50 rounded text-teal-900 text-[10px] flex items-center justify-center">
                                <img src="/assets/images/Vector 1 (3).png" alt="" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-4 font-[Alumni_Sans]">501</h3>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-900">Since last week</span>
                            <span className="text-teal-900 font-bold font-[Alumni_Sans]">68,95% ∧</span>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-animation)] p-5 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-gray-900 text-sm">Cancel orders</span>
                            <div
                                className="w-12 h-8 bg-red-50 rounded text-red-500 text-[10px] flex items-center justify-center">
                                <img src="/assets/images/Vector 1 (3).png" alt="" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-red-700 mb-4 font-[Alumni_Sans]">20+</h3>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-900">Since last week</span>
                            <span className="text-red-500 font-bold font-[Alumni_Sans]">-5.51% ∨</span>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-animation)] p-5 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-gray-900 text-sm">Total revenue</span>
                            <div
                                className="w-12 h-8 bg-teal-50 rounded text-teal-500 text-[10px] flex items-center justify-center">
                                <img src="/assets/images/Vector 1 (3).png" alt="" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold mb-4 font-[Alumni_Sans]">$60k+</h3>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-900">Since last week</span>
                            <span className="text-teal-500 font-bold font-[Alumni_Sans]">68,95% ∧</span>
                        </div>
                    </div>

                    <div className="bg-[var(--bg-animation)] p-5 rounded-lg border border-gray-100 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <span className="text-gray-900 text-sm">Total review</span>
                            <div
                                className="w-12 h-8 bg-yellow-50 rounded text-yellow-500 text-[10px] flex items-center justify-center">
                                <img src="/assets/images/Vector 1 (3).png" alt="" />
                            </div>
                        </div>
                        <h3 className="text-3xl font-bold text-yellow-500 mb-4 font-[Alumni_Sans]">400+</h3>
                        <div className="flex justify-between items-center text-xs">
                            <span className="text-gray-900">Avg rating</span>
                            <span className="text-yellow-500 font-bold font-[Alumni_Sans]">★ 4.9</span>
                        </div>
                    </div>
                </div>

                <div className="col-span-12 lg:col-span-7 bg-[var(--bg-animation)] p-6 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex justify-between items-center mb-1">
                        <h3 className="text-lg font-bold font-[Alumni_Sans]">Sales overview</h3>
                        <div className="flex space-x-2">
                            <button className="px-4 py-1 text-white text-xs rounded bg-[var(--bg-red)]">Weekly</button>
                            <button
                                className="px-4 py-1 border border-red-100 text-red-600 text-xs rounded">Monthly</button>
                        </div>
                    </div>
                    <p className="text-xs text-gray-900 mb-6">Monitor sales trends and gain insights for growth.</p>

                    <div className="h-48 flex items-end justify-between px-12 border-b border-gray-900 relative">
                        <div
                            className="absolute inset-0 flex flex-col justify-between text-[10px] text-gray-900 pointer-events-none">
                            <div className="border-t border-dashed w-full pt-1">$700</div>
                            <div className="border-t border-dashed w-full pt-1">$600</div>
                            <div className="border-t border-dashed w-full pt-1">$500</div>
                            <div className="border-t border-dashed w-full pt-1">$400</div>
                            <div className="border-t border-dashed w-full pt-1">$300</div>
                            <div className="border-t border-dashed w-full pt-1">$200</div>
                            <div className="border-t border-dashed w-full pt-1">$100</div>
                        </div>

                        <div className="z-10 w-8 bg-teal-400 rounded-t-sm" style={{ height: '57%' }}></div>
                        <div className="z-10 w-8 bg-teal-400 rounded-t-sm" style={{ height: '72%' }}></div>
                        <div className="z-10 w-8 bg-teal-400 rounded-t-sm" style={{ height: '43%' }}></div>
                        <div className="z-10 w-8 bg-teal-400 rounded-t-sm" style={{ height: '85%' }}></div>
                        <div className="z-10 w-8 bg-teal-400 rounded-t-sm" style={{ height: '57%' }}></div>
                        <div className="z-10 w-8 bg-teal-400 rounded-t-sm" style={{ height: '100%' }}></div>
                        <div className="z-10 w-8 bg-teal-400 rounded-t-sm" style={{ height: '94%' }}></div>
                    </div>
                    <div className="flex justify-between px-2 mt-2 text-[10px] text-gray-900 font-medium">
                        <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div
                    className="col-span-12 lg:col-span-8 bg-[var(--bg-animation)] p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-bold mb-6 font-[Alumni_Sans]">Recent order</h3>
                    <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
                        <table className="w-full text-left text-sm min-w-[500px]">
                            <thead className="text-gray-900 border-b border-gray-100">
                                <tr>
                                    <th className="pb-3 font-semibold font-[Alumni_Sans]">Order ID</th>
                                    <th className="pb-3 font-semibold font-[Alumni_Sans]">Product name</th>
                                    <th className="pb-3 font-semibold font-[Alumni_Sans]">Price</th>
                                    <th className="pb-3 font-semibold font-[Alumni_Sans]">Quantity</th>
                                    <th className="pb-3 font-semibold font-[Alumni_Sans] text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="py-4 text-gray-600 font-medium font-[Alumni_Sans] whitespace-nowrap">#SLR980131-9N</td>
                                    <td className="py-4 whitespace-nowrap font-[Alumni_Sans]">Hoodie</td>
                                    <td className="py-4 font-[Alumni_Sans]">$70</td>
                                    <td className="py-4 font-[Alumni_Sans]">2pcs</td>
                                    <td className="py-4 text-right">
                                        <button onClick={() => router.get('/admin/orders/details')}
                                            className="px-3 py-1.5 bg-[var(--bg-red)] text-white text-xs rounded hover:bg-red-700 transition-colors">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-4 text-gray-600 font-medium whitespace-nowrap">#SLR980131-9N</td>
                                    <td className="py-4 whitespace-nowrap">Sweatsuits</td>
                                    <td className="py-4">$70</td>
                                    <td className="py-4">1pc</td>
                                    <td className="py-4 text-right">
                                        <button onClick={() => router.get('/admin/orders/details')}
                                            className="px-3 py-1.5 bg-[var(--bg-red)] text-white text-xs rounded hover:bg-red-700 transition-colors">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="py-4 text-gray-600 font-medium whitespace-nowrap">#SLR980131-9N</td>
                                    <td className="py-4 whitespace-nowrap">Sweatsuits</td>
                                    <td className="py-4">$70</td>
                                    <td className="py-4">4pcs</td>
                                    <td className="py-4 text-right">
                                        <button onClick={() => router.get('/admin/orders/details')}
                                            className="px-3 py-1.5 bg-[var(--bg-red)] text-white text-xs rounded hover:bg-red-700 transition-colors">
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            <div className="col-span-12 lg:col-span-4 bg-bg-animation p-4 md:p-6 rounded-lg border border-gray-100 shadow-sm flex flex-col items-center lg:items-start">
            <h3 className="text-lg font-bold mb-8 w-full text-center lg:text-left font-[Alumni_Sans]">Avg seals</h3>

            <div className="relative flex items-center justify-center mb-8">
                <div className="w-32 h-32 xs:w-36 xs:h-36 md:w-40 md:h-40 rounded-full border-[12px] md:border-[16px] border-transparent"
                    style={{ borderTopColor: '#c53030', borderLeftColor: '#c53030', borderRightColor: '#2dd4bf', transform: 'rotate(12deg)' }}>
                </div>
                <div className="absolute w-32 h-32 xs:w-36 xs:h-36 md:w-40 md:h-40 rounded-full border-[12px] md:border-[16px] border-transparent"
                    style={{ borderBottomColor: '#4b5563', transform: 'rotate(15deg)' }}>
                </div>
                
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-xs font-bold text-gray-800">6.8k</span>
                    <span className="text-[8px] text-gray-400 uppercase">Total</span>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:flex lg:flex-wrap gap-y-3 gap-x-4 text-[10px] w-full justify-center lg:justify-start">
                <div className="flex items-center justify-center lg:justify-start">
                    <span className="w-3 h-3 bg-red-600 rounded-sm mr-2 flex-shrink-0"></span>
                    <span className="text-gray-500 whitespace-nowrap">Hoodies: 3.8k pcs</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                    <span className="w-3 h-3 bg-teal-400 rounded-sm mr-2 flex-shrink-0"></span>
                    <span className="text-gray-500 whitespace-nowrap">Sweatsuits: 1k pcs</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start">
                    <span className="w-3 h-3 bg-gray-600 rounded-sm mr-2 flex-shrink-0"></span>
                    <span className="text-gray-500 whitespace-nowrap">Others: 2k pcs</span>
                </div>
            </div>
            </div>
            </div>
        </AdminLayout>
    );
}
