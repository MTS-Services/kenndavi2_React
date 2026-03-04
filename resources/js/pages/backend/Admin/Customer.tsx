import AdminLayout from '@/layouts/admin-layout';
import { Link } from '@inertiajs/react';

export default function DashboarCustomer() {
    return (
        <AdminLayout
            title="Customer feedback"
            description="Review ratings and feedback from your customers."
        >
            <div className="flex flex-col lg:flex-row gap-8 mb-12 items-start lg:items-center">
                <div className="bg-[var(--bg-oranges)] p-8 rounded-lg flex flex-col items-center justify-center w-full lg:w-64 shadow-sm border border-[var(--bg-oranges)]">
                    <span className="text-5xl font-bold mb-2">4.7</span>
                    <div className="flex text-yellow-400 mb-2">
                        {Array.from({ length: 4 }).map((_, index) => (
                            <svg key={index} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        ))}
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
                    {[
                        { label: '★★★★★', percent: '63%', count: '94,532', width: 'w-[63%]' },
                        { label: '★★★★☆', percent: '24%', count: '6,717', width: 'w-[24%]' },
                        { label: '★★★☆☆', percent: '9%', count: '714', width: 'w-[9%]' },
                        { label: '★★☆☆☆', percent: '1%', count: '152', width: 'w-[1%]' },
                        { label: '★☆☆☆☆', percent: '7%', count: '643', width: 'w-[7%]' },
                    ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3 text-xs">
                            <div className="flex text-yellow-400 w-24">{item.label}</div>
                            <div className="flex-1 h-1.5 bg-stone-200 rounded-full overflow-hidden">
                                <div className={`bg-${item.label === '★★★★★' ? 'yellow-400' : 'stone-500'} h-full ${item.width}`} />
                            </div>
                            <span className="w-20 text-right text-stone-600">
                                {item.percent}{' '}
                                <span className="text-stone-400">({item.count})</span>
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-0">
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
                                Darrell Steward
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
                                Brooklyn Simmons
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
        </AdminLayout>
    );
}
