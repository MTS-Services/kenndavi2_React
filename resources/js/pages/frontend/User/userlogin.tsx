import { Head, useForm, Link } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

export default function UserLogin() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('login.send-code'));
    };

    return (
        <FrontendLayout>
            <Head title="User Login" />

            <div
                className="font-sans text-white overflow-x-hidden relative min-h-screen"
                style={{
                    backgroundImage: 'url("/assets/images/bg.png")',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                }}
            >
                
                <div className="absolute inset-0 bg-gray-900/45 z-10"></div>
                <div className="container mx-auto mt-20 mb-20 flex items-center justify-center font-sans relative z-10">
                <div className="bg-[var(--bg-gray0)] w-full max-w-md p-10 md:p-14 rounded-sm shadow-sm text-sidebar">
                    
                    <div className="flex flex-col items-center mb-10">
                        <img src="assets/images/Layer_1.png" alt="Logo" className="h-16 w-auto" />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold font-['Alumni_Sans']">Sign in</h2>
                        <p className="text-sm text-sidebar mt-1 font-['Libre_Franklin']">
                            Sign in or create an account
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xl font-bold mb-2 font-['Alumni_Sans']">
                                Email
                            </label>

                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Email"
                                required
                                className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-500"
                            />

                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="text-md font-bold w-full bg-[var(--bg-red)] text-white py-3 rounded-sm font-['Libre_Franklin'] transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Processing...' : 'Continue'}
                        </button>
                    </form>

                    <div className="text-sm mt-6 text-center">
                        <Link
                            href={route('admin.login')}
                            className="text-sidebar hover:underline font-['Libre_Franklin']"
                        >
                            Admin? Sign in here
                        </Link>
                    </div>
                </div>
            </div>
            </div>
        </FrontendLayout>
    );
}