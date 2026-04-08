import { Head } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

export default function ProfileForm() {
    return (
        <FrontendLayout>
            <Head title="Dashboard" />
            <div className="overflow-x-hidden font-sans text-gray-900">
                <section className="relative z-10 flex items-center justify-center p-6 font-sans text-gray-900">
                    <div className="w-full max-w-4xl rounded-sm bg-[var(--bg-gray0)] p-10 shadow-sm md:p-16">
                        <h1 className="mb-10 font-['Alumni_Sans'] text-xl font-bold">
                            Edit profile
                        </h1>
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div>
                                    <label className="text-md mb-3 block font-['Alumni_Sans'] font-bold">
                                        First name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        className="w-full rounded-sm border border-gray-400 bg-transparent p-3 transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="text-md mb-3 block font-['Alumni_Sans'] font-bold">
                                        Last name
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        className="w-full rounded-sm border border-gray-400 bg-transparent p-3 transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                <div>
                                    <label className="text-md mb-3 block font-['Alumni_Sans'] font-bold">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        placeholder="jackson.graham@example.com"
                                        className="w-full rounded-sm border border-gray-400 bg-transparent p-3 transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                    <p className="mt-2 text-[10px] text-gray-500 italic">
                                        This email is used for sign-in and order
                                        updates.
                                    </p>
                                </div>
                                <div>
                                    <label className="text-md mb-3 block font-['Alumni_Sans'] font-bold">
                                        Phone number
                                    </label>
                                    <input
                                        type="tel"
                                        placeholder="(406) 555-0120"
                                        className="w-full rounded-sm border border-gray-400 bg-transparent p-3 transition-all placeholder:text-gray-400 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button
                                    type="button"
                                    className="rounded-sm border border-bg-red px-8 py-2 font-medium text-bg-red transition-colors hover:bg-red-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="rounded-sm bg-bg-red px-10 py-2 font-medium text-white transition-colors hover:bg-red-800"
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>
        </FrontendLayout>
    );
}
