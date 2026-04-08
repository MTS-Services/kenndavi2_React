import FrontendLayout from '@/layouts/frontend-layout';
import { Head, router } from '@inertiajs/react';

export default function Profile() {
    const bgImage =
        'https://plus.unsplash.com/premium_photo-1733760125442-efad43dd88c3?q=80&w=1171&auto=format&fit=crop';

    return (
        <FrontendLayout>
            <Head title="Profile" />

            {/* Main content (inherits layout background) */}
            <section className="flex flex-1 items-center justify-center py-10">
                <div className="container mx-auto max-w-4xl">
                    <h1 className="mb-6 font-['Alumni_Sans'] text-3xl font-bold text-white">
                        Profile
                    </h1>

                    <div className="space-y-4">
                        {/* Personal Info Card */}
                        <div className="rounded-sm bg-[var(--bg-gray0)] p-8 shadow-sm backdrop-blur-sm">
                            <div className="space-y-6">
                                <div className="flex items-center gap-2">
                                    <span className="font-['Libre_Franklin'] text-sm tracking-wider text-gray-500 uppercase">
                                        Name
                                    </span>
                                    <button
                                        onClick={() =>
                                            router.get('/Editprofile')
                                        }
                                        className="text-gray-400 transition-colors hover:text-black"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <div>
                                    <p className="mb-1 font-['Libre_Franklin'] text-sm text-gray-500">
                                        Number
                                    </p>
                                    <p className="text-lg font-medium">
                                        06541451
                                    </p>
                                </div>

                                <div>
                                    <p className="mb-1 font-['Libre_Franklin'] text-sm text-gray-500">
                                        Email
                                    </p>
                                    <p className="font-['Libre_Franklin'] font-medium">
                                        mdshakibalhasan62@gmail.com
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Address Card */}
                        <div className="rounded-sm bg-[var(--bg-gray0)] p-8 shadow-sm backdrop-blur-sm">
                            <div className="mb-6 flex items-center gap-2">
                                <span className="font-['Libre_Franklin'] text-sm tracking-wider text-gray-500 uppercase">
                                    Addresses
                                </span>
                                <button className="text-gray-400 transition-colors hover:text-black">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M12 4v16m8-8H4"
                                        />
                                    </svg>
                                </button>
                            </div>

                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <p className="font-['Libre_Franklin'] text-sm text-gray-500">
                                        Default address
                                    </p>
                                    <button
                                        onClick={() =>
                                            router.get('/Editaddress')
                                        }
                                        className="text-gray-400 transition-colors hover:text-black"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-4 w-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                            />
                                        </svg>
                                    </button>
                                </div>
                                <p className="font-['Libre_Franklin'] font-normal">
                                    Bangladesh
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
