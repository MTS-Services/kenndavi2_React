import { Head, router } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';

export default function UserHome() {
    const bgImage = "https://plus.unsplash.com/premium_photo-1733760125442-efad43dd88c3?q=80&w=1171&auto=format&fit=crop";

    return (
        <UserLayout>
            <Head title="Profile" />

            {/* Main content (inherits layout background) */}
            <div className=" w-full font-sans text-gray-900 relative">
                <div className=" p-6 md:p-12">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-3xl font-bold mb-6 font-['Alumni_Sans'] text-white">Profile</h1>

                        <div className="space-y-4">
                            {/* Personal Info Card */}
                            <div className="bg-[var(--bg-gray0)] p-8 rounded-sm shadow-sm backdrop-blur-sm">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 text-sm font-['Libre_Franklin'] uppercase tracking-wider">
                                            Name
                                        </span>
                                        <button onClick={() => router.get('/Editprofile')} className="text-gray-400 hover:text-black transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm mb-1 font-['Libre_Franklin']">Number</p>
                                        <p className="font-medium text-lg">06541451</p>
                                    </div>

                                    <div>
                                        <p className="text-gray-500 text-sm mb-1 font-['Libre_Franklin']">Email</p>
                                        <p className="font-medium font-['Libre_Franklin']">mdshakibalhasan62@gmail.com</p>
                                    </div>
                                </div>
                            </div>

                            {/* Address Card */}
                            <div className="bg-[var(--bg-gray0)] p-8 rounded-sm shadow-sm backdrop-blur-sm">
                                <div className="flex items-center gap-2 mb-6">
                                    <span className="text-gray-500 text-sm font-['Libre_Franklin'] uppercase tracking-wider">
                                        Addresses
                                    </span>
                                    <button className="text-gray-400 hover:text-black transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                    </button>
                                </div>

                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-gray-500 text-sm font-['Libre_Franklin']">Default address</p>
                                        <button onClick={() => router.get('/Editaddress')} className="text-gray-400 hover:text-black transition-colors">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="font-normal font-['Libre_Franklin']">Bangladesh</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </UserLayout>
    );
}
