import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';

export default function UserHome() {
    return (
        <UserLayout>
            <Head title="Dashboard" />
             <div className="bg-[#FDF7F7] font-sans text-gray-900 overflow-x-hidden">
             <div className="pt-28 pb-28 bg-[#fdf8f7] flex items-center justify-center p-6 font-sans text-[#1a1a1a]">
                <div className="bg-[#f4ecea] w-full max-w-5xl p-10 md:p-14 rounded-sm shadow-sm">
                <h2 className="text-xl font-bold mb-10 font-['Alumni_Sans']">Settings</h2>
                <div className="space-y-12">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="max-w-md">
                        <div className="flex items-center gap-2 mb-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                        <span className="font-bold text-sm font-['Alumni_Sans']">
                            Sign out everywhere
                        </span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed font-['Alumni_Sans']">
                        If you've lost a device or have security concerns, log out to
                        ensure the security of your account.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="bg-[#c22e2e] text-white px-6 py-3 text-sm font-medium rounded-sm hover:bg-red-800 transition-colors whitespace-nowrap font-['Alumni_Sans']">
                        Sign Out Everywhere
                        </button>
                        <p className="hidden lg:block text-[11px] text-gray-500 italic max-w-[150px] font-['Alumni_Sans']">
                        You'll also be signed out on this device.
                        </p>
                    </div>
                    </div>
                    <div className="relative">
                    <div
                        className="absolute inset-0 flex items-center"
                        aria-hidden="true"
                    >
                        <div className="w-full border-t border-gray-300" />
                    </div>
                    <div className="relative flex justify-start">
                        <span className="pr-3 bg-[#f4ecea] text-sm font-bold text-gray-700 uppercase tracking-wide">
                        Or
                        </span>
                    </div>
                    </div>
                    <div>
                    <button className="border border-[#c22e2e] text-[#c22e2e] px-10 py-2 text-sm font-medium rounded-sm hover:bg-red-50 transition-colors font-['Alumni_Sans']">
                        Sign Out
                    </button>
                    </div>
                </div>
                </div>
             </div>
            </div>

        </UserLayout>
    );
}

