import UserLayout from '@/layouts/user-layout'; 
import { Link } from '@inertiajs/react';
export default function UserDashboard() {
    return (
        <UserLayout>
            <>
               <div className="bg-[#f4eded] text-gray-800">
                <div className="lg:hidden bg-[#FDF7F7] p-4 flex justify-between items-center border-b border-gray-200">
                    <div className="w-8">
                    <img src="/assets/images/Layer_1.png" alt="Logo" className="max-w-full" />
                    </div>
                    <button id="menuBtn" className="text-red-600 text-2xl">
                    <i className="fas fa-bars" />
                    </button>
                </div>
                <div className="flex min-h-screen relative">
                    <aside
                    id="sidebar"
                    className="fixed inset-y-0 left-0 z-50 w-64 bg-[#FDF7F7] border-r border-gray-200 flex flex-col justify-between py-4 transform -translate-x-full lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out"
                    >
                    <div>
                        <button
                        id="closeBtn"
                        className="lg:hidden absolute top-4 right-4 text-gray-500"
                        >
                        <i className="fas fa-times text-xl" />
                        </button>
                        <div className="px-6 mt-4 flex flex-col items-center p-6">
                        <div className="mb-2">
                            <img src="/assets/images/Layer_1.png" alt="Logo" />
                        </div>
                        </div>
                        <nav className="space-y-2 pt-4 border-t border-gray-400 px-6">
                        <Link
                            href={route('admin.dashboard')}
                            className="flex items-center px-4 py-3 bg-red-50 border-l-4 border-red-600 rounded-l-md text-gray-900 font-medium"
                        >
                            <i className="fas fa-th-large w-5 text-red-600" />
                            <span className="ml-3 font-medium">Overview</span>
                        </Link>
                        <Link
                            href={route('admin.orders.index')}
                            className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-50 transition"
                        >
                            <i className="fas fa-shopping-cart w-5" />
                            <span className="ml-3 font-medium">Orders</span>
                        </Link>
                        <Link
                            href={route('admin.products.index')}
                            className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-50 transition"
                        >
                            <i className="fas fa-box w-5" />
                            <span className="ml-3 font-medium">Products</span>
                        </Link>
                        </nav>
                    </div>
                    <div className="px-6 border-t border-gray-400 pt-6">
                        <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                            <img
                            src="/assets/images/Layer_1.png"
                            alt="User"
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">Super Admin</p>
                            <p className="text-xs text-gray-400 truncate">admin@platform.com</p>
                        </div>
                        </div>
                        <Link
                        href={route('admin.logout')}
                        method="post"
                        as="button"
                        className="flex items-center text-red-500 text-sm font-medium hover:opacity-80 transition w-full"
                        >
                            <i className="fas fa-sign-out-alt mr-2" />
                            Log Out
                        </Link>
                    </div>
                    </aside>
                    <main className="flex-1">
                    <div className=" p-4 md:p-8 font-sans text-gray-800">
                        <div className=" grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-[#FFF9F8] rounded-md p-8 shadow-sm">
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
                                    <p className="font-medium text-[10px] font-nowrap">
                                    Albert Flores
                                    </p>
                                </div>
                                </div>
                                <div>
                                <p className="text-gray-400 text-sm mb-8">Phone</p>
                                <p className="font-medium text-[10px] font-nowrap">(270) 555-0117</p>
                                </div>
                                <div>
                                <p className="text-gray-400 text-sm mb-8">Gmail</p>
                                <p className="font-medium text-[10px] font-nowrap">
                                     admin@dev.com
                                </p>
                                </div>
                                <div>
                                <p className="text-gray-400 text-sm mb-8">Location</p>
                                <p className="font-medium text-[10px] font-nowrap">
                                    2118 Thornridge Cir. Syracuse
                                </p>
                                </div>
                            </div>
                            </div>
                            <div className="bg-[#FFF9F8] rounded-md p-8 shadow-sm">
                            <h2 className="text-xl font-bold mb-10 font-[Alumni_Sans]">Orders summery</h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                <thead>
                                    <tr className="text-gray-400 text-sm">
                                    <th className="pb-8 font-normal">Products</th>
                                    <th className="pb-8 font-normal">Color</th>
                                    <th className="pb-8 font-normal">Size</th>
                                    <th className="pb-8 font-normal">Quantity</th>
                                    <th className="pb-8 font-normal">Price</th>
                                    </tr>
                                </thead>
                                <tbody className="text-[10px] font-bold">
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
                            <div className="bg-[#FFF9F8] rounded-md p-8 shadow-sm h-full flex flex-col">
                            <h2 className="text-xl font-bold mb-10 font-[Alumni_Sans]">Order summery</h2>
                            <div className="space-y-8 flex-grow px-2">
                                <div className="flex items-center space-x-4 text-[10px] font-bold">
                                <div className="w-12 h-12 bg-gray-100 rounded">
                                    <img src="/assets/images/Rectangle 28.png" />
                                </div>
                                <div>
                                    <p className="mb-1">Broon hoodie</p>
                                    <p className="text-gray-500 font-medium">
                                    1 x <span className="text-gray-900 font-bold">$70</span>
                                    </p>
                                </div>
                                </div>
                                <div className="flex items-center space-x-4 text-[10px] font-bold">
                                <div className="w-12 h-12 bg-gray-100 rounded">
                                    <img src="/assets/images/Rectangle 25.png" />
                                </div>
                                <div>
                                    <p className="mb-1">Black pant</p>
                                    <p className="text-gray-500 font-medium">
                                    1 x <span className="text-gray-900 font-bold">$70</span>
                                    </p>
                                </div>
                                </div>
                                <div className="flex items-center space-x-4 text-[10px] font-bold">
                                <div className="w-12 h-12 bg-gray-100 rounded">
                                    <img src="/assets/images/Rectangle 25.png" />
                                </div>
                                <div>
                                    <p className="mb-1">Black shoe</p>
                                    <p className="text-gray-500 font-medium">
                                    1 x <span className="text-gray-900 font-bold">$70</span>
                                    </p>
                                </div>
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-gray-300 space-y-4">
                                <div className="flex justify-between text-xs text-gray-500 font-medium">
                                <span>Sub-total</span>
                                <span className="text-black font-bold">$210</span>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 font-medium">
                                <span>Shipping</span>
                                <span className="text-black font-bold">$00</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold text-black pt-2">
                                <span>Total</span>
                                <span>$210</span>
                                </div>
                            </div>
                            <div className="mt-10">
                                <button className="w-full border border-[#C13030] text-[#C13030] py-3 rounded-md font-medium text-xs hover:bg-red-50 transition-colors">
                                Back
                                </button>
                            </div>
                            </div>
                        </div>
                        </div>
                    </div>
                    </main>
                </div>
                </div>
            </>

        </UserLayout>
    );
}
