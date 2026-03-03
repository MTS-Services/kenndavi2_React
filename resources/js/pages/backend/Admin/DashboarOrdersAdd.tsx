import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';

export default function DashboarOrdersAdd() {
    return (
        <AdminLayout
            title="Add new product"
            description="Upload product photos and details to add a new item."
        >
            <div className="container mx-auto flex items-center justify-center p-4">
                <div className="bg-[var(--bg-animation)] w-full p-8 rounded-lg shadow-lg relative">
                    <Link
                        href={route('admin.products.index')}
                        className="absolute top-6 right-6 bg-red-600 hover:bg-red-700 text-white p-1 rounded transition-colors"
                    >
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
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </Link>

                    <h2 className="text-2xl font-bold text-stone-900 mb-8 font-[Alumni_Sans]">
                        Add new Product
                    </h2>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        {Array.from({ length: 5 }).map((_, index) => (
                            <div
                                key={index}
                                className="aspect-square bg-[var(--bg-grayslight)] border border-stone-200 rounded flex items-center justify-center cursor-pointer hover:bg-stone-200 transition-colors"
                            >
                                <span className="text-stone-500 text-sm font-medium">
                                    Add Photos
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <label className="block text-lg font-bold text-stone-900 mb-2 font-[Alumni_Sans]">
                                Tittle
                            </label>
                            <input
                                type="text"
                                placeholder="Enter title"
                                className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 focus:ring-2 focus:ring-red-600 outline-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-lg font-bold text-stone-900 mb-2 font-[Alumni_Sans]">
                                    Size
                                </label>
                                <input
                                    type="text"
                                    placeholder="38,40,42,44"
                                    className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 focus:ring-2 focus:ring-red-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-lg font-bold text-stone-900 mb-2 font-[Alumni_Sans]">
                                    Colors
                                </label>
                                <input
                                    type="text"
                                    placeholder="Maroon, Gray, Dark green"
                                    className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 focus:ring-2 focus:ring-red-600 outline-none"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-lg font-bold text-stone-900 mb-2 font-[Alumni_Sans]">
                                Description
                            </label>
                            <textarea
                                rows={6}
                                placeholder="Enter description"
                                className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 focus:ring-2 focus:ring-red-600 outline-none resize-none"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-base font-bold text-stone-900 mb-2 font-[Alumni_Sans]">
                                    Category
                                </label>
                                <div className="relative">
                                    <select className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 appearance-none focus:ring-2 focus:ring-red-600 outline-none">
                                        <option>Hoodie</option>
                                        <option>Sweatshirt</option>
                                        <option>T-Shirt</option>
                                    </select>
                                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                                        <svg
                                            className="h-4 w-4 text-stone-600"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <label className="block text-base font-bold text-stone-900 mb-2 font-[Alumni_Sans]">
                                    Stock Level
                                </label>
                                <input
                                    type="number"
                                    placeholder="10"
                                    className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 focus:ring-2 focus:ring-red-600 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-base font-bold text-stone-900 mb-2 font-[Alumni_Sans]">
                                    Price
                                </label>
                                <input
                                    type="text"
                                    placeholder="Price"
                                    className="w-full bg-[var(--bg-grayslight)] border-none rounded p-3 focus:ring-2 focus:ring-red-600 outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button className="bg-red-700 hover:bg-red-800 text-white px-10 py-3 rounded shadow-md transition-all font-medium">
                                Upload
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
