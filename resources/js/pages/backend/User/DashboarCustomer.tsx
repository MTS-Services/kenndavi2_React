import UserLayout from '@/layouts/user-layout'; 
export default function UserDashboard() {
    return (
        <UserLayout>
           
         <div className="lg:hidden bg-[var(--bg-animation)] p-4 flex justify-between items-center border-b border-gray-200">
            <div className="w-8">
            <img src="/assets/images/Layer_1 (2).png" alt="Logo" className="max-w-full" />
            </div>
            <button id="menuBtn" className="text-red-600 text-2xl">
            <i className="fas fa-bars" />
            </button>
        </div>
        <div className="flex min-h-screen relative bg-bg-cofyColor">
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
                    src="/assets/images/Rectangle 28 (4).png"
                    alt="User"
                    className="w-full h-full object-cover"
                    />
                </div>
                <div className="overflow-hidden">
                    <p className="text-sm font-bold truncate text-gray-900">Super Admin</p>
                    <p className="text-xs text-gray-400 truncate">admin@platform.com</p>
                </div>
                </div>
                <button className="flex items-center text-red-500 text-sm font-medium hover:opacity-80 transition w-full">
                <i className="fas fa-sign-out-alt mr-2" />
                Log Out
                </button>
            </div>
            </aside>
            <div className="container mx-auto bg-[var(--bg-animation)] p-6  font-sans text-gray-900 m-12">
            <div className="mb-6">
                <button className="bg-bg-red hover:bg-red-800 text-white p-2 rounded transition-colors shadow-sm">
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                    />
                </svg>
                </button>
            </div>
            <h1 className="text-3xl font-bold mb-8 font-[Alumni_Sans]">Customer Feedback</h1>
            <div className="flex flex-col lg:flex-row gap-8 mb-12 items-start lg:items-center">
                <div className="bg-[var(--bg-oranges)] p-8 rounded-lg flex flex-col items-center justify-center w-full lg:w-64 shadow-sm border border-[var(--bg-oranges)]">
                <span className="text-5xl font-bold mb-2">4.7</span>
                <div className="flex text-yellow-400 mb-2">
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <svg
                    className="w-5 h-5 fill-current opacity-30"
                    viewBox="0 0 20 20"
                    >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                </div>
                <p className="text-xs text-stone-500">Customer Rating (934,516)</p>
                </div>
                <div className="flex-1 w-full space-y-2">
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex text-yellow-400 w-24">★★★★★</div>
                    <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="bg-yellow-400 h-full w-[63%]" />
                    </div>
                    <span className="w-20 text-right text-stone-600">
                    63% <span className="text-stone-400">(94,532)</span>
                    </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex text-yellow-400 w-24">★★★★☆</div>
                    <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="bg-stone-500 h-full w-[24%]" />
                    </div>
                    <span className="w-20 text-right text-stone-600">
                    24% <span className="text-stone-400">(6,717)</span>
                    </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex text-yellow-400 w-24">★★★☆☆</div>
                    <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="bg-stone-500 h-full w-[9%]" />
                    </div>
                    <span className="w-20 text-right text-stone-600">
                    9% <span className="text-stone-400">(714)</span>
                    </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex text-yellow-400 w-24">★★☆☆☆</div>
                    <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="bg-stone-500 h-full w-[1%]" />
                    </div>
                    <span className="w-20 text-right text-stone-600">
                    1% <span className="text-stone-400">(152)</span>
                    </span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex text-yellow-400 w-24">★☆☆☆☆</div>
                    <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                    <div className="bg-stone-500 h-full w-[7%]" />
                    </div>
                    <span className="w-20 text-right text-stone-600">
                    7% <span className="text-stone-400">(643)</span>
                    </span>
                </div>
                </div>
            </div>
            <div className="space-y-0 ">
                <h3 className="font-bold text-lg mb-4 font-[Alumni_Sans]">Customer Feedback</h3>
                <div className="border-t border-stone-300 py-6">
                <div className="flex items-center gap-3 mb-2">
                    <img
                    src="https://i.pravatar.cc/150?u=1"
                    className="w-10 h-10 rounded-full object-cover grayscale"
                    alt="User"
                    />
                    <div>
                    <p className="text-sm font-bold font-[Alumni_Sans]">
                        Darrell Steward{" "}
                        <span className="font-normal text-stone-500 ml-2">
                        • Just now
                        </span>
                    </p>
                    <div className="flex text-yellow-400 text-xs">★★★★★</div>
                    </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed max-w-3xl">
                    This hoodie completely changed my everyday style. The fit is
                    premium, the comfort is next-level, and the look is perfectly
                    balanced.
                </p>
                </div>
                <div className="border-t border-stone-300 py-6">
                <div className="flex items-center gap-3 mb-2">
                    <img
                    src="https://i.pravatar.cc/150?u=2"
                    className="w-10 h-10 rounded-full object-cover"
                    alt="User"
                    />
                    <div>
                    <p className="text-sm font-bold font-[Alumni_Sans]">
                        Brooklyn Simmons{" "}
                        <span className="font-normal text-stone-500 ml-2">
                        • 2 mins ago
                        </span>
                    </p>
                    <div className="flex text-yellow-400 text-xs">★★★★★</div>
                    </div>
                </div>
                <p className="text-stone-600 text-sm leading-relaxed max-w-3xl">
                    I wore it once and everyone asked where I got it from. The fit is
                    perfect and the vibe is unmatched—absolutely love it!
                </p>
                </div>
            </div>
            <div className="flex items-center gap-2 mt-8">
                <button className="w-8 h-8 flex items-center justify-center rounded bg-stone-100 text-stone-400">
                «
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-stone-100 text-stone-400">
                ‹
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-[var(--bg-red)] text-white">
                1
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-stone-100 hover:bg-stone-200">
                2
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-stone-100 hover:bg-stone-200">
                3
                </button>
                <span className="px-2 text-stone-400">...</span>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-stone-100 hover:bg-stone-200">
                10
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-stone-100 hover:bg-stone-200">
                ›
                </button>
                <button className="w-8 h-8 flex items-center justify-center rounded bg-stone-100 hover:bg-stone-200">
                »
                </button>
            </div>
            </div>
            <div
            id="overlay"
            className="fixed inset-0 bg-black opacity-50 z-40 hidden lg:hidden"
            />
        </div>

        </UserLayout>
    );
}
