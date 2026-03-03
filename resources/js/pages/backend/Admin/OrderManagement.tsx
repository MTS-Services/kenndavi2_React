import { useState } from 'react';
import UserLayout from '@/layouts/user-layout'; 
import { Head, Link, usePage } from '@inertiajs/react';
export default function UserDashboard() {
    const { url } = usePage();

    const navLinkClasses = (isActive: boolean) =>
        'flex items-center px-4 py-3 text-gray-900 hover:bg-gray-50 transition' +
        (isActive ? ' bg-red-50 border-l-4 border-red-600 rounded-l-md font-medium' : '');

    type OrderStatus = 'pending' | 'shipped' | 'delivered' | 'cancelled';

    const [statusFilter, setStatusFilter] = useState<OrderStatus>('pending');

    const countByStatus: Record<OrderStatus, number> = {
        pending: 1,
        shipped: 1,
        delivered: 1,
        cancelled: 1,
    };

    const filterButtonClasses = (isActive: boolean) =>
        'flex items-center space-x-2 pb-4 flex-shrink-0 ' +
        (isActive ? 'border-b-2 border-red-600 text-red-600' : 'text-gray-500 hover:text-gray-700');

    const badgeClasses = (isActive: boolean) =>
        'text-[10px] px-2 py-1 rounded-full ' +
        (isActive ? 'bg-red-600 text-white' : 'bg-gray-600 text-white');

    return (
        <UserLayout>
            <Head title="Order Management" />
            <>
              <div className="hidden bg-[var(--bg-animation)] p-4 flex justify-between items-center border-b border-gray-200">
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
                <main className="flex-1 p-4 md:p-8 bg-[var(--bg-grayslight)]">
                  <header className="mb-8">
                    <h2 className="text-2xl font-bold mb-1 text-sidebar font-[Alumni_Sans]">Order Management</h2>
                    <p className="text-gray-600">
                      Track, manage, and process all customer orders effectively.
                    </p>
                  </header>
                  <div className="bg-[var(--bg-animation)] p-4 md:p-8 font-sans text-slate-700 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-4 md:space-x-8 border-b border-gray-200 mb-6 overflow-x-auto pb-1 no-scrollbar">
                      <button
                        type="button"
                        onClick={() => setStatusFilter('pending')}
                        className={filterButtonClasses(statusFilter === 'pending')}
                      >
                        <svg
                          className="w-5 h-5 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="font-medium whitespace-nowrap">
                          Pending Shipments
                        </span>
                        <span className={badgeClasses(statusFilter === 'pending')}>
                          {countByStatus.pending}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusFilter('shipped')}
                        className={filterButtonClasses(statusFilter === 'shipped')}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                          ></path>
                        </svg>
                        <span className="whitespace-nowrap">Shipped</span>
                        <span className={badgeClasses(statusFilter === 'shipped')}>
                          {countByStatus.shipped}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusFilter('delivered')}
                        className={filterButtonClasses(statusFilter === 'delivered')}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <span className="whitespace-nowrap">Delivered</span>
                        <span className={badgeClasses(statusFilter === 'delivered')}>
                          {countByStatus.delivered}
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setStatusFilter('cancelled')}
                        className={filterButtonClasses(statusFilter === 'cancelled')}
                      >
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                        <span className="whitespace-nowrap">Cancelled</span>
                        <span className={badgeClasses(statusFilter === 'cancelled')}>
                          {countByStatus.cancelled}
                        </span>
                      </button>
                    </div>
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                          <tr className="text-lg font-semibold text-gray-900 uppercase tracking-wider font-[Alumni_Sans]">
                            <th className="px-4">Order ID</th>
                            <th className="px-4">Buyer</th>
                            <th className="px-4">Product</th>
                            <th className="px-4">Amount</th>
                            <th className="px-4">Shipping</th>
                            <th className="px-4">Date</th>
                            <th className="px-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="text-sm">
                          <tr className="bg-white hover:bg-gray-50 transition-colors shadow-sm rounded-lg">
                            <td className="px-4 py-4 font-medium">#SLR980131-9N</td>
                            <td className="px-4 py-4 text-gray-600">Jerome Bell</td>
                            <td className="px-4 py-4 text-gray-600">Hoodie</td>
                            <td className="px-4 py-4 font-semibold text-gray-900">$120</td>
                            <td className="px-4 py-4 text-gray-600">Standard</td>
                            <td className="px-4 py-4 text-gray-600">9/4/26</td>
                            <td className="px-4 py-4 text-right space-x-2">
                              <button className="bg-[var(--bg-red)] text-white px-4 py-2 rounded text-xs font-medium hover:bg-red-800 transition-colors">
                                Mark As Shipped
                              </button>
                              <button className="border border-bg-red text-red-700 px-4 py-2 rounded text-xs font-medium hover:bg-red-50 transition-colors">
                                View Details
                              </button>
                            </td>
                          </tr>
                        </tbody>
                        <tbody className="text-sm">
                          <tr className="bg-white hover:bg-gray-50 transition-colors shadow-sm rounded-lg">
                            <td className="px-4 py-4 font-medium">#SLR980131-9N</td>
                            <td className="px-4 py-4 text-gray-600">Jerome Bell</td>
                            <td className="px-4 py-4 text-gray-600">Hoodie</td>
                            <td className="px-4 py-4 font-semibold text-gray-900">$120</td>
                            <td className="px-4 py-4 text-gray-600">Standard</td>
                            <td className="px-4 py-4 text-gray-600">9/4/26</td>
                            <td className="px-4 py-4 text-right space-x-2">
                              <button className="bg-bg-red text-white px-4 py-2 rounded text-xs font-medium hover:bg-red-800 transition-colors">
                                Mark As Shipped
                              </button>
                              <button className="border border-red-700 text-red-700 px-4 py-2 rounded text-xs font-medium hover:bg-red-50 transition-colors">
                                View Details
                              </button>
                            </td>
                          </tr>
                        </tbody>
                        <tbody className="text-sm">
                          <tr className="bg-white hover:bg-gray-50 transition-colors shadow-sm rounded-lg">
                            <td className="px-4 py-4 font-medium">#SLR980131-9N</td>
                            <td className="px-4 py-4 text-gray-600">Jerome Bell</td>
                            <td className="px-4 py-4 text-gray-600">Hoodie</td>
                            <td className="px-4 py-4 font-semibold text-gray-900">$120</td>
                            <td className="px-4 py-4 text-gray-600">Standard</td>
                            <td className="px-4 py-4 text-gray-600">9/4/26</td>
                            <td className="px-4 py-4 text-right space-x-2">
                              <button className="bg-red-700 text-white px-4 py-2 rounded text-xs font-medium hover:bg-red-800 transition-colors">
                                Mark As Shipped
                              </button>
                              <button className="border border-red-700 text-red-700 px-4 py-2 rounded text-xs font-medium hover:bg-red-50 transition-colors">
                                View Details
                              </button>
                            </td>
                          </tr>
                        </tbody>
                        <tbody className="text-sm">
                          <tr className="bg-white hover:bg-gray-50 transition-colors shadow-sm rounded-lg">
                            <td className="px-4 py-4 font-medium">#SLR980131-9N</td>
                            <td className="px-4 py-4 text-gray-600">Jerome Bell</td>
                            <td className="px-4 py-4 text-gray-600">Hoodie</td>
                            <td className="px-4 py-4 font-semibold text-gray-900">$120</td>
                            <td className="px-4 py-4 text-gray-600">Standard</td>
                            <td className="px-4 py-4 text-gray-600">9/4/26</td>
                            <td className="px-4 py-4 text-right space-x-2">
                              <button className="bg-red-700 text-white px-4 py-2 rounded text-xs font-medium hover:bg-red-800 transition-colors">
                                Mark As Shipped
                              </button>
                              <button className="border border-red-700 text-red-700 px-4 py-2 rounded text-xs font-medium hover:bg-red-50 transition-colors">
                                View Details
                              </button>
                            </td>
                          </tr>
                        </tbody>
                        <tbody className="text-sm">
                          <tr className="bg-white hover:bg-gray-50 transition-colors shadow-sm rounded-lg">
                            <td className="px-4 py-4 font-medium">#SLR980131-9N</td>
                            <td className="px-4 py-4 text-gray-600">Jerome Bell</td>
                            <td className="px-4 py-4 text-gray-600">Hoodie</td>
                            <td className="px-4 py-4 font-semibold text-gray-900">$120</td>
                            <td className="px-4 py-4 text-gray-600">Standard</td>
                            <td className="px-4 py-4 text-gray-600">9/4/26</td>
                            <td className="px-4 py-4 text-right space-x-2">
                              <button className="bg-red-700 text-white px-4 py-2 rounded text-xs font-medium hover:bg-red-800 transition-colors">
                                Mark As Shipped
                              </button>
                              <button className="border border-bg-red-700 text-red-700 px-4 py-2 rounded text-xs font-medium hover:bg-red-50 transition-colors">
                                View Details
                              </button>
                            </td>
                          </tr>
                        </tbody>
                        <tbody className="text-sm">
                          <tr className="bg-white hover:bg-gray-50 transition-colors shadow-sm rounded-lg">
                            <td className="px-4 py-4 font-medium">#SLR980131-9N</td>
                            <td className="px-4 py-4 text-gray-600">Jerome Bell</td>
                            <td className="px-4 py-4 text-gray-600">Hoodie</td>
                            <td className="px-4 py-4 font-semibold text-gray-900">$120</td>
                            <td className="px-4 py-4 text-gray-600">Standard</td>
                            <td className="px-4 py-4 text-gray-600">9/4/26</td>
                            <td className="px-4 py-4 text-right space-x-2">
                              <button className="bg-red-700 text-white px-4 py-2 rounded text-xs font-medium hover:bg-red-800 transition-colors">
                                Mark As Shipped
                              </button>
                              <button className="border border-red-700 text-red-700 px-4 py-2 rounded text-xs font-medium hover:bg-red-50 transition-colors">
                                View Details
                              </button>
                            </td>
                          </tr>
                        </tbody>
                        <tbody className="text-sm">
                          <tr className="bg-white hover:bg-gray-50 transition-colors shadow-sm rounded-lg">
                            <td className="px-4 py-4 font-medium">#SLR980131-9N</td>
                            <td className="px-4 py-4 text-gray-600">Jerome Bell</td>
                            <td className="px-4 py-4 text-gray-600">Hoodie</td>
                            <td className="px-4 py-4 font-semibold text-gray-900">$120</td>
                            <td className="px-4 py-4 text-gray-600">Standard</td>
                            <td className="px-4 py-4 text-gray-600">9/4/26</td>
                            <td className="px-4 py-4 text-right space-x-2">
                              <button className="bg-red-700 text-white px-4 py-2 rounded text-xs font-medium hover:bg-red-800 transition-colors">
                                Mark As Shipped
                              </button>
                              <button className="border border-red-700 text-red-700 px-4 py-2 rounded text-xs font-medium hover:bg-red-50 transition-colors">
                                View Details
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="md:hidden space-y-4">
                      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="text-xs text-gray-500 font-semibold">
                              #SLR980131-9N
                            </p>
                            <h4 className="font-bold text-gray-900">Jerome Bell</h4>
                          </div>
                          <span className="font-bold text-gray-900">$120</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase">Product</p>
                            <p className="text-gray-600">Hoodie</p>
                          </div>
                          <div>
                            <p className="text-[10px] text-gray-400 uppercase">Date</p>
                            <p className="text-gray-600">9/4/26</p>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-2">
                          <button className="w-full bg-red-700 text-white py-2 rounded text-xs font-medium">
                            Mark As Shipped
                          </button>
                          <button className="w-full border border-red-700 text-red-700 py-2 rounded text-xs font-medium">
                            View Details
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
                      <span className="text-xs text-gray-500 order-2 md:order-1">
                        Showing 1 of 5 entries
                      </span>
                      <nav className="flex space-x-1 order-1 md:order-2">
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition">
                          &lt;
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-700 text-white font-semibold">
                          1
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium">
                          2
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium">
                          3
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium">
                          4
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium">
                          5
                        </button>
                        <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition">
                          &gt;
                        </button>
                      </nav>
                    </div>
                  </div>
                </main>
              </div>
            </>

        </UserLayout>
    );
}
