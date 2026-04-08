import { Head } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

export default function AddressForm() {
    return (
        <FrontendLayout>
            <Head title="Dashboard" />
            <section className="flex flex-1 items-center justify-center py-10">
                <div className="container mx-auto max-w-4xl">
                    <div className="w-full rounded-sm bg-[var(--bg-gray0)] p-10 shadow-sm md:p-16">
                        <h1 className="mb-10 font-['Alumni_Sans'] text-2xl font-bold">
                            Edit address
                        </h1>
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div>
                                    <label className="mb-3 block font-['Alumni_Sans'] text-sm font-bold">
                                        Region/State
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Antofagasta"
                                        className="w-full rounded-sm border border-gray-400 bg-transparent p-3 transition-all focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 block font-['Alumni_Sans'] text-sm font-bold">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue="Pembroke Pines"
                                        className="w-full rounded-sm border border-gray-400 bg-transparent p-3 transition-all focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="mb-3 block font-['Alumni_Sans'] text-sm font-bold">
                                        Zip cope
                                    </label>
                                    <input
                                        type="text"
                                        defaultValue={97133}
                                        className="w-full rounded-sm border border-gray-400 bg-transparent p-3 transition-all focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="mb-3 block font-['Alumni_Sans'] text-sm font-bold">
                                    Address
                                </label>
                                <input
                                    type="text"
                                    defaultValue="8558 Green Rd."
                                    className="w-full rounded-sm border border-gray-400 bg-transparent p-3 transition-all focus:ring-1 focus:ring-red-800 focus:outline-none"
                                />
                            </div>
                            <div className="pt-2">
                                <button
                                    type="button"
                                    className="text-sm font-medium text-bg-red hover:underline"
                                >
                                    Delete
                                </button>
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
                </div>
            </section>
        </FrontendLayout>
    );
}
