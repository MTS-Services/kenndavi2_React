import { Head } from '@inertiajs/react';

import UserLayout from '@/layouts/user-layout';

export default function UserHome() {
    return (
        <UserLayout>
            <Head title="Dashboard" />
            <div className="bg-bg-animation font-sans text-gray-900 overflow-x-hidden">
            <div className="bg-bg-animation flex items-center justify-center p-6 font-sans text-gray-900">
                <div className="bg-[var(--bg-gray0)] w-full max-w-4xl p-10 md:p-16 rounded-sm shadow-sm">
                <h1 className="text-2xl font-bold mb-10 font-['Alumni_Sans']">
                    Edit address
                </h1>
                <form className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-bold mb-3 font-['Alumni_Sans']">
                        Region/State
                        </label>
                        <input
                        type="text"
                        defaultValue="Antofagasta"
                        className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-3 font-['Alumni_Sans']">
                        City
                        </label>
                        <input
                        type="text"
                        defaultValue="Pembroke Pines"
                        className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-3 font-['Alumni_Sans']">
                        Zip cope
                        </label>
                        <input
                        type="text"
                        defaultValue={97133}
                        className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all"
                        />
                    </div>
                    </div>
                    <div>
                    <label className="block text-sm font-bold mb-3 font-['Alumni_Sans']">
                        Address
                    </label>
                    <input
                        type="text"
                        defaultValue="8558 Green Rd."
                        className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all"
                    />
                    </div>
                    <div className="pt-2">
                    <button
                        type="button"
                        className="text-bg-red text-sm hover:underline font-medium"
                    >
                        Delete
                    </button>
                    </div>
                    <div className="flex gap-4 pt-4">
                    <button
                        type="button"
                        className="px-8 py-2 border border-bg-red text-bg-red font-medium rounded-sm hover:bg-red-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-10 py-2 bg-bg-red text-white font-medium rounded-sm hover:bg-red-800 transition-colors"
                    >
                        Save
                    </button>
                    </div>
                </form>
                </div>
            </div>
            </div>


        </UserLayout>
    );
}

