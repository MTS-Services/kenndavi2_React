import { Link } from '@inertiajs/react';
import AdminLayout from '@/layouts/admin-layout';

export default function DashboarOrdersdetails() {
    return (
        <AdminLayout
            title="Order details"
            description="View a detailed summary of this customer order."
        >
            <div className="p-4 md:p-8 font-sans text-gray-800">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-[var(--bg-grayslight0)] rounded-md p-8 shadow-sm">
                            <h2 className="text-xl font-bold mb-10 font-[Alumni_Sans]">Customer info</h2>
                            <div className="grid grid-cols-4 gap-4">
                                <div className="flex flex-col">
                                    <p className="text-gray-400 text-sm mb-6">Customer</p>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-gray-200 rounded overflow-hidden">
                                            <img
                                                src="/assets/images/Rectangle 25.png"
                                                alt="Albert Flores"
                                                className="object-cover"
                                            />
                                        </div>
                                        <p className="font-medium text-[9px] font-nowrap">
                                            Albert Flores
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-8">Phone</p>
                                    <p className="font-medium text-[9px] font-nowrap">(270) 555-0117</p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-8">Gmail</p>
                                    <p className="font-medium text-[9px] font-nowrap">
                                        admin@dev.com
                                    </p>
                                </div>
                                <div>
                                    <p className="text-gray-400 text-sm mb-8">Location</p>
                                    <p className="font-medium text-[9px] font-nowrap">
                                        2118 Thornridge Cir. Syracuse
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-[var(--bg-grayslight0)] rounded-md p-8 shadow-sm">
                            <h2 className="text-xl font-bold mb-10 font-[Alumni_Sans]">Orders summary</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-gray-900 text-sm text-[12px]">
                                            <th className="pb-8 font-normal">Products</th>
                                            <th className="pb-8 font-normal">Color</th>
                                            <th className="pb-8 font-normal">Size</th>
                                            <th className="pb-8 font-normal">Quantity</th>
                                            <th className="pb-8 font-normal">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[12px] font-bold">
                                        <tr>
                                            <td className="py-6 flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                                    <img src="/assets/images/Rectangle 25.png" alt="Hoodie" />
                                                </div>
                                                <span>Broon hoodie</span>
                                            </td>
                                            <td className="py-6 text-gray-700">Broon</td>
                                            <td className="py-6 text-gray-700">38</td>
                                            <td className="py-6 text-gray-700">1pc</td>
                                            <td className="py-6 text-gray-700">$70</td>
                                        </tr>
                                        <tr>
                                            <td className="py-6 flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                                    <img src="/assets/images/Frame 2147226352.png" alt="Pant" />
                                                </div>
                                                <span>Black pant</span>
                                            </td>
                                            <td className="py-6 text-gray-700">Black</td>
                                            <td className="py-6 text-gray-700">38</td>
                                            <td className="py-6 text-gray-700">1pc</td>
                                            <td className="py-6 text-gray-700">$70</td>
                                        </tr>
                                        <tr>
                                            <td className="py-6 flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gray-100 rounded flex items-center justify-center">
                                                    <img src="/assets/images/Rectangle 28.png" alt="Shoe" />
                                                </div>
                                                <span>Black shoe</span>
                                            </td>
                                            <td className="py-6 text-gray-700">Black</td>
                                            <td className="py-6 text-gray-700">38</td>
                                            <td className="py-6 text-gray-700">1pc</td>
                                            <td className="py-6 text-gray-700">$70</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-[var(--bg-grayslight0)] rounded-md p-8 shadow-sm h-full flex flex-col">
                            <h2 className="text-xl font-bold mb-10 font-[Alumni_Sans]">Order summary</h2>
                            <div className="space-y-8 flex-grow px-2">
                                <div className="flex items-center space-x-4 text-[12px] font-bold">
                                    <div className="w-12 h-12 bg-gray-100 rounded">
                                        <img src="/assets/images/Rectangle 28.png" alt="Broon hoodie" />
                                    </div>
                                    <div>
                                        <p className="mb-1 lg:text-[12px] font-[Alumni_Sans]">Broon hoodie</p>
                                        <p className="text-gray-500 font-medium">
                                            1 x <span className="text-gray-900 font-bold">$70</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 text-[12px] font-bold">
                                    <div className="w-12 h-12 bg-gray-100 rounded">
                                        <img src="/assets/images/Rectangle 25.png" alt="Black pant" />
                                    </div>
                                    <div>
                                        <p className="mb-1 lg:text-[12px] font-[Alumni_Sans]">Black pant</p>
                                        <p className="text-gray-500 font-medium">
                                            1 x <span className="text-gray-900 font-bold">$70</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-4 text-[12px] font-bold">
                                    <div className="w-12 h-12 bg-gray-100 rounded">
                                        <img src="/assets/images/Rectangle 25.png" alt="Black shoe" />
                                    </div>
                                    <div>
                                        <p className="mb-1 lg:text-[12px] font-[Alumni_Sans]">Black shoe</p>
                                        <p className="text-gray-500 font-medium">
                                            1 x <span className="text-gray-900 font-bold">$70</span>
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-gray-300 space-y-4">
                                <div className="flex justify-between text-[12px] text-gray-500 font-medium">
                                    <span>Sub-total</span>
                                    <span className="text-black font-bold">$210</span>
                                </div>
                                <div className="flex justify-between text-[12px] text-gray-500 font-medium">
                                    <span>Shipping</span>
                                    <span className="text-black font-bold">$00</span>
                                </div>
                                <div className="flex justify-between text-[12px] font-bold text-black pt-2">
                                    <span>Total</span>
                                    <span>$210</span>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link
                                    href={route('admin.orders.index')}
                                    className="block w-full text-center border border-[var(--bg-red)] text-[var(--bg-red)] py-3 rounded-md font-medium text-[12px] hover:bg-red-50 transition-colors"
                                >
                                    Back
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
