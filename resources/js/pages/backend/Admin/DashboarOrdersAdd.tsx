import UserLayout from '@/layouts/user-layout'; 
import { Link } from '@inertiajs/react';
export default function UserDashboard() {
    return (
        <UserLayout>
            <>
               <div className="bg-[var(--bg-grayslight)] text-gray-800">
                <div className="lg:hidden bg-[var(--bg-animation)] p-4 flex justify-between items-center border-b border-gray-200">
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
                    className="fixed inset-y-0 left-0 z-50 w-64 bg-[var(--bg-animation)] border-r border-gray-200 flex flex-col justify-between py-4 transform -translate-x-full lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out"
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
                        <a
                          href="#"
                          className="flex items-center px-4 py-3 bg-red-50 border-l-4 border-red-600 rounded-l-md text-gray-900 font-medium"
                        >
                          <i className="fas fa-th-large w-5 text-red-600" />
                          <span className="ml-3 font-medium">Overview</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-50 transition"
                        >
                          <i className="fas fa-shopping-cart w-5" />
                          <span className="ml-3 font-medium">Orders</span>
                        </a>
                        <a
                          href="#"
                          className="flex items-center px-4 py-3 text-gray-900 hover:bg-gray-50 transition"
                        >
                          <i className="fas fa-box w-5" />
                          <span className="ml-3 font-medium">Products</span>
                        </a>
                      </nav>
                    </div>
                    <div className="px-6 border-t border-gray-400 pt-6">
                      <div className="flex items-center mb-6">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                          <img
                            src="/assets/images/Layer_1 (2).png"
                            alt="User"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="overflow-hidden">
                          <p className="text-sm font-bold truncate">Super Admin</p>
                          <p className="text-xs text-gray-400 truncate">admin@platform.com</p>
                        </div>
                      </div>
                      <button className="flex items-center text-red-500 text-sm font-medium hover:opacity-80 transition w-full">
                        <i className="fas fa-sign-out-alt mr-2" />
                        Log Out
                      </button>
                    </div>
                  </aside>
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
                        <div className="aspect-square bg-[var(--bg-grayslight)] border border-stone-200 rounded flex items-center justify-center cursor-pointer hover:bg-stone-200 transition-colors">
                          <span className="text-stone-500 text-sm font-medium">
                            Add Photos
                          </span>
                        </div>
                        <div className="aspect-square bg-[var(--bg-grayslight)] border border-stone-200 rounded flex items-center justify-center cursor-pointer hover:bg-stone-200 transition-colors">
                          <span className="text-stone-500 text-sm font-medium">
                            Add Photos
                          </span>
                        </div>
                        <div className="aspect-square bg-[var(--bg-grayslight)] border border-stone-200 rounded flex items-center justify-center cursor-pointer hover:bg-stone-200 transition-colors">
                          <span className="text-stone-500 text-sm font-medium">
                            Add Photos
                          </span>
                        </div>
                        <div className="aspect-square bg-[var(--bg-grayslight)] border border-stone-200 rounded flex items-center justify-center cursor-pointer hover:bg-stone-200 transition-colors">
                          <span className="text-stone-500 text-sm font-medium">
                            Add Photos
                          </span>
                        </div>
                        <div className="aspect-square bg-[var(--bg-grayslight)] border border-stone-200 rounded flex items-center justify-center cursor-pointer hover:bg-stone-200 transition-colors">
                          <span className="text-stone-500 text-sm font-medium">
                            Add Photos
                          </span>
                        </div>
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
                            defaultValue={""}
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
                </div>
              </div>  
            </>

        </UserLayout>
    );
}
