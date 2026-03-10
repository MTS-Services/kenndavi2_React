import { Head, Link, useForm } from '@inertiajs/react';

import InputError from '@/components/input-error';
import FrontendLayout from '@/layouts/frontend-layout';

interface Props {
    email: string;
    token: string;
    status?: string;
}

export default function AdminResetPassword({ email, token, status }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.password.update'), {
            onFinish: () => {
                setData('password', '');
                setData('password_confirmation', '');
            },
        });
    };

    return (
        <FrontendLayout>
            <Head title="Admin - Reset Password" />
            <div className="font-sans text-white overflow-x-hidden relative min-h-screen">
                <div className="container mx-auto p-12 flex justify-center relative z-10">
                    <div className="bg-[var(--bg-gray0)] w-full max-w-md p-10 md:p-14 rounded-sm shadow-sm text-[#1a1a1a]">
                        <div className="flex flex-col items-center mb-10">
                            <img src="/assets/images/Layer_1.png" alt="Logo" className="h-16 w-auto" />
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-bold font-['Libre_Franklin']">
                                Reset Password
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 font-['Libre_Franklin']">
                                Enter your new password below.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 p-3 rounded-sm bg-green-50 border border-green-200 text-green-700 text-sm">
                                {status}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <input type="hidden" name="token" value={token} />
                            <input type="hidden" name="email" value={email} />

                            <div>
                                <label className="block text-sm font-bold mb-2 font-['Libre_Franklin']">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={data.email}
                                    disabled
                                    className="w-full p-3 bg-gray-100 border border-gray-300 rounded-sm"
                                />
                                {errors.email && (
                                    <p className="text-red-600 text-sm mt-1">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 font-['Libre_Franklin']">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter new password"
                                    required
                                    className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-500"
                                />
                                {errors.password && (
                                    <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold mb-2 font-['Libre_Franklin']">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm new password"
                                    required
                                    className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-500"
                                />
                                {errors.password_confirmation && (
                                    <p className="text-red-600 text-sm mt-1">{errors.password_confirmation}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[var(--bg-red)] text-white py-3 font-medium rounded-sm font-['Libre_Franklin'] hover:bg-red-800 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Resetting...' : 'Reset Password'}
                            </button>

                            <div className="text-sm mt-4 text-center">
                                <Link
                                    href={route('admin.login')}
                                    className="text-gray-900 hover:underline font-['Libre_Franklin']"
                                >
                                    Back to login
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
