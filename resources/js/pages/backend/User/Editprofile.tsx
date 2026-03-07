import { Head } from '@inertiajs/react';

import UserLayout from '@/layouts/user-layout';

export default function UserHome() {
    return (
        <UserLayout>
            <Head title="Dashboard" />
           <div className="bg-bg-animation font-sans text-gray-900 overflow-x-hidden">
             <section className="bg-bg-animation flex items-center justify-center p-6 font-sans text-gray-900">
                <div className="bg-[var(--bg-gray0)] w-full max-w-4xl p-10 md:p-16 rounded-sm shadow-sm">
                <h1 className="text-xl font-bold mb-10 font-['Alumni_Sans']">
                    Edit profile
                </h1>
                <form className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-md font-bold mb-3 font-['Alumni_Sans']">
                        First name
                        </label>
                        <input
                        type="text"
                        placeholder="First name"
                        className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400"
                        />
                    </div>
                    <div>
                        <label className="block text-md font-bold mb-3 font-['Alumni_Sans']">
                        Last name
                        </label>
                        <input
                        type="text"
                        placeholder="Last name"
                        className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400"
                        />
                    </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <label className="block text-md font-bold mb-3 font-['Alumni_Sans']">
                        Email
                        </label>
                        <input
                        type="email"
                        placeholder="jackson.graham@example.com"
                        className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400"
                        />
                        <p className="text-[10px] text-gray-500 mt-2 italic">
                        This email is used for sign-in and order updates.
                        </p>
                    </div>
                    <div>
                        <label className="block text-md font-bold mb-3 font-['Alumni_Sans']">
                        Phone number
                        </label>
                        <input
                        type="tel"
                        placeholder="(406) 555-0120"
                        className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-400"
                        />
                    </div>
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
             </section>
            </div>

        </UserLayout>
    );
}

