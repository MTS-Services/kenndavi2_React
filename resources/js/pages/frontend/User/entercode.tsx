import { Head, useForm, Link } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

interface Props {
    email?: string;
}

export default function EnterCode({ email = '' }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        code: '',
        email,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('login.verify-code'));
    };

    return (
        <FrontendLayout>
            <Head title="Enter Code" />
            <div className="font-sans text-white overflow-x-hidden relative min-h-screen">
                <div className="container mx-auto p-12 flex justify-center relative z-10">
                    <div className="bg-[var(--bg-gray0)] w-full max-w-md p-10 md:p-14 rounded-sm shadow-sm text-[#1a1a1a]">
                        <div className="flex flex-col items-center mb-10">
                            <img src="/assets/images/Layer_1.png" alt="Logo" className="h-16 w-auto" />
                        </div>

                        <div className="mb-8">
                            <h2 className="text-lg font-bold font-['Libre_Franklin']">
                                Enter code
                            </h2>
                            <p className="text-sm text-gray-500 mt-1 font-['Libre_Franklin']">
                                Sent to <span className="font-semibold text-gray-700">{email || 'your email'}</span>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold mb-2 font-['Libre_Franklin']">
                                    Code
                                </label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value)}
                                    placeholder="6-digit code"
                                    maxLength={6}
                                    className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-500"
                                />
                                {errors.code && (
                                    <p className="text-red-600 text-sm mt-1">{errors.code}</p>
                                )}
                            </div>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[var(--bg-red)] text-white py-3 font-medium rounded-sm font-['Libre_Franklin'] hover:bg-red-800 transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Verifying...' : 'Submit'}
                            </button>

                            <div className="text-sm mt-4">
                                <Link
                                    href={route('login')}
                                    className="text-gray-900 hover:underline font-['Libre_Franklin']"
                                >
                                    Sign in with a different email
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
