import { Head } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

export default function Settings() {
    return (
        <FrontendLayout>
            <Head title="Settings" />
            <section className="flex flex-1 items-center justify-center py-10">
                <div className="container mx-auto max-w-4xl">
                    <div className="w-full rounded-sm bg-[var(--bg-gray0)] p-10 shadow-sm md:p-16">
                        <h1 className="mb-10 font-['Alumni_Sans'] text-2xl font-bold">
                            Settings
                        </h1>
                        <div className="space-y-8">
                            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
                                <div className="max-w-md">
                                    <div className="mb-3 flex items-center gap-2">
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
                                        <span className="font-[Alumni_Sans] text-sm font-bold">
                                            Sign out everywhere
                                        </span>
                                    </div>
                                    <p className="font-[Libre_Franklin] text-sm leading-relaxed text-gray-600">
                                        If you've lost a device or have security
                                        concerns, log out to ensure the security
                                        of your account.
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="rounded-sm bg-bg-red px-6 py-3 font-[Libre_Franklin] text-sm font-medium whitespace-nowrap text-white transition-colors hover:bg-red-800">
                                        Sign Out Everywhere
                                    </button>
                                    <p className="hidden max-w-[150px] font-[Libre_Franklin] text-[11px] text-gray-500 italic lg:block">
                                        You'll also be signed out on this
                                        device.
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
                                    <span className="bg-[var(--bg-gray0)] pr-3 text-sm font-bold tracking-wide text-gray-700 uppercase">
                                        Or
                                    </span>
                                </div>
                            </div>
                            <div>
                                <button className="rounded-sm border border-bg-red px-10 py-2 font-['Alumni_Sans'] text-sm font-medium text-bg-red transition-colors hover:bg-red-50">
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
