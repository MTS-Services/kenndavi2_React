import { Head, useForm, Link } from '@inertiajs/react';
import FrontendLayout from '@/layouts/frontend-layout';

interface Props {
    status?: string;
    error?: string;
}

export default function AdminLogin({ status, error }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.login.store'));
    };

    return (
        <FrontendLayout>
            <Head title="Admin sign in" />

            <div className="container mx-auto mt-20 mb-20 flex items-center justify-center font-sans">
                <div className="bg-[var(--bg-gray0)] w-full max-w-md p-10 md:p-14 rounded-sm shadow-sm text-sidebar">
                    <div className="flex flex-col items-center mb-10">
                        <img src="/assets/images/Layer_1.png" alt="Logo" className="h-16 w-auto" />
                    </div>

                    <div className="mb-8">
                        <h2 className="text-xl font-bold font-['Alumni_Sans']">Admin sign in</h2>
                        <p className="text-sm text-sidebar mt-1 font-['Libre_Franklin']">
                            Enter your admin email and password
                        </p>
                    </div>

                    {error && (
                        <div className="mb-4 p-3 rounded-sm bg-red-50 border border-red-200 text-red-700 text-sm">
                            {error}
                        </div>
                    )}
                    {status && (
                        <div className="mb-4 p-3 rounded-sm bg-green-50 border border-green-200 text-green-700 text-sm">
                            {status}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xl font-bold mb-2 font-['Alumni_Sans']">
                                Email
                            </label>
                            <input
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="Admin email"
                                required
                                className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-500"
                            />
                            {errors.email && (
                                <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xl font-bold mb-2 font-['Alumni_Sans']">
                                Password
                            </label>
                            <input
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Password"
                                required
                                className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-500"
                            />
                            {errors.password && (
                                <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="text-md font-bold w-full bg-[var(--bg-red)] text-white py-3 rounded-sm font-['Libre_Franklin'] transition-colors disabled:opacity-50"
                        >
                            {processing ? 'Logging in...' : 'Log in as admin'}
                        </button>
                    </form>

                    <div className="text-sm mt-6 text-center">
                        <Link
                            href={route('userlogin')}
                            className="text-sidebar hover:underline font-['Libre_Franklin']"
                        >
                            Sign in as user instead
                        </Link>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
