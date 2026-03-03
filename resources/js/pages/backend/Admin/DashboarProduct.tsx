import UserLayout from '@/layouts/user-layout'; 
import { Head, Link, usePage } from '@inertiajs/react';
export default function UserDashboard() {
    const { url } = usePage();

    const navLinkClasses = (isActive: boolean) =>
        'flex items-center px-4 py-3 text-gray-900 hover:bg-gray-50 transition' +
        (isActive ? ' bg-red-50 border-l-4 border-red-600 rounded-l-md text-gray-900 font-medium' : '');

    return (
        <UserLayout>
            <Head title="Order Management" />
            <>
              <div className="bg-[#f4eded] text-gray-800">
                <div className="lg:hidden bg-[#FDF7F7] p-4 flex justify-between items-center border-b border-gray-200">
                    <div className="w-8">
                    <img src="/assets/images/Layer_1 (2).png" alt="Logo" className="max-w-full" />
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
                            <img src="/assets/images/Layer_1 (2).png" alt="Logo" />
                        </div>
                        </div>
                        <nav className="space-y-2 pt-4 border-t border-gray-400 px-6">
                        <Link
                            href={route('admin.dashboard')}
                            className={navLinkClasses(url === '/admin/dashboard')}
                        >
                            <i className="fas fa-th-large w-5 text-red-600" />
                            <span className="ml-3 font-medium">Overview</span>
                        </Link>
                        <Link
                            href={route('admin.orders.index')}
                            className={navLinkClasses(url.startsWith('/admin/orders'))}
                        >
                            <i className="fas fa-shopping-cart w-5" />
                            <span className="ml-3 font-medium">Orders</span>
                        </Link>
                        <Link
                            href={route('admin.products.index')}
                            className={navLinkClasses(url.startsWith('/admin/products'))}
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
                            src="assets/images/Rectangle 25 (4).png"
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
                    <div className="min-h-screen bg-[#f4eded] p-8 font-sans text-stone-800">
                    <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                        <h1 className="text-3xl font-bold text-stone-900 font-[Alumni_Sans]">
                            Manage your products
                        </h1>
                        <p className="text-stone-600 mt-1">
                            View, edit, and manage your inventory in one place.
                        </p>
                        </div>
                        <Link
                        href={route('admin.products.create')}
                        className="inline-flex items-center justify-center bg-red-700 hover:bg-red-800 text-white px-6 py-2.5 rounded shadow-sm transition-colors font-medium"
                        >
                        Add New Product
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-[#FDF7F7] p-4 rounded-sm shadow-sm flex flex-col">
                        <div className="relative group overflow-hidden bg-gray-200">
                            <img
                            src="/assets/images/Frame 2147226402 (4).png"
                            alt="Broon hoodie"
                            className="w-full h-56 object-cover"
                            />
                            <span className="absolute bottom-3 left-0 bg-green-500 text-white text-xs px-2 py-1">
                            Available 20
                            </span>
                        </div>
                        <div className="mt-4 flex-grow">
                            <h3 className="text-lg font-bold text-stone-900 font-[Alumni_Sans]">Broon hoodie</h3>
                            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                            A premium, smooth hoodie crafted with the perfect balance of
                            comfort and street style. Ideal for everyday wear—making every
                            look effortlessly fresh.
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <Link
                            href={route('admin.products.create')}
                            className="flex-1 flex items-center justify-center gap-2 border border-green-600 text-green-600 py-2 rounded hover:bg-green-50 transition-colors text-sm font-medium"
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Edit
                            </Link>
                            <button className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded hover:bg-red-50 transition-colors text-sm font-medium">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Delete
                            </button>
                        </div>
                        </div>
                        <div className="bg-[#FDF7F7] p-4 rounded-sm shadow-sm flex flex-col">
                        <div className="relative group overflow-hidden bg-gray-200">
                            <img
                            src="/assets/images/Frame 2147226402 (4).png"
                            alt="Broon hoodie"
                            className="w-full h-56 object-cover"
                            />
                            <span className="absolute bottom-3 left-0 bg-green-500 text-white text-xs px-2 py-1">
                            Available 20
                            </span>
                        </div>
                        <div className="mt-4 flex-grow">
                            <h3 className="text-lg font-bold text-stone-900 font-[Alumni_Sans]">
                            Broon sweatsuits
                            </h3>
                            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                            A premium, smooth hoodie crafted with the perfect balance of
                            comfort and street style. Ideal for everyday wear—making every
                            look effortlessly fresh.
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <Link
                            href={route('admin.products.create')}
                            className="flex-1 flex items-center justify-center gap-2 border border-green-600 text-green-600 py-2 rounded hover:bg-green-50 transition-colors text-sm font-medium"
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Edit
                            </Link>
                            <button className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded hover:bg-red-50 transition-colors text-sm font-medium">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Delete
                            </button>
                        </div>
                        </div>
                        <div className="bg-[#FDF7F7] p-4 rounded-sm shadow-sm flex flex-col">
                        <div className="relative group overflow-hidden bg-gray-200">
                            <img
                            src="/assets/images/Frame 2147226402 (4).png"
                            alt="Broon hoodie"
                            className="w-full h-56 object-cover"
                            />
                            <span className="absolute bottom-3 left-0 bg-green-500 text-white text-xs px-2 py-1">
                            Available 20
                            </span>
                        </div>
                        <div className="mt-4 flex-grow">
                            <h3 className="text-lg font-bold text-stone-900 font-[Alumni_Sans]">Gray hoodie</h3>
                            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                            A premium, smooth hoodie crafted with the perfect balance of
                            comfort and street style. Ideal for everyday wear—making every
                            look effortlessly fresh.
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <Link
                            href={route('admin.products.create')}
                            className="flex-1 flex items-center justify-center gap-2 border border-green-600 text-green-600 py-2 rounded hover:bg-green-50 transition-colors text-sm font-medium"
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Edit
                            </Link>
                            <button className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded hover:bg-red-50 transition-colors text-sm font-medium">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Delete
                            </button>
                        </div>
                        </div>
                        <div className="bg-[#FDF7F7] p-4 rounded-sm shadow-sm flex flex-col">
                        <div className="relative group overflow-hidden bg-gray-200">
                            <img
                            src="/assets/images/Frame 2147226402 (4).png"
                            alt="Broon hoodie"
                            className="w-full h-56 object-cover"
                            />
                            <span className="absolute bottom-3 left-0 bg-green-500 text-white text-xs px-2 py-1">
                            Available 20
                            </span>
                        </div>
                        <div className="mt-4 flex-grow">
                            <h3 className="text-lg font-bold text-stone-900 font-[Alumni_Sans]">
                            Broon sweatsuits
                            </h3>
                            <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                            A premium, smooth hoodie crafted with the perfect balance of
                            comfort and street style. Ideal for everyday wear—making every
                            look effortlessly fresh.
                            </p>
                        </div>
                        <div className="mt-6 flex gap-3">
                            <Link
                            href={route('admin.products.create')}
                            className="flex-1 flex items-center justify-center gap-2 border border-green-600 text-green-600 py-2 rounded hover:bg-green-50 transition-colors text-sm font-medium"
                            >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                />
                            </svg>
                            Edit
                            </Link>
                            <button className="flex-1 flex items-center justify-center gap-2 border border-red-200 text-red-600 py-2 rounded hover:bg-red-50 transition-colors text-sm font-medium">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                            Delete
                            </button>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>

            </>

        </UserLayout>
    );
}
