import { Form, Head, Link } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';
import InputError from '@/components/input-error';

interface TwoFactorChallengeProps {
    email?: string;
    expiresAt?: string;
    isExpired?: boolean;
    resendUrl: string;
    status?: string;
    verifyUrl: string;
}

export default function TwoFactorChallenge({
    email = '',
    expiresAt,
    isExpired = false,
    resendUrl,
    status,
    verifyUrl,
}: TwoFactorChallengeProps) {
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
                            {isExpired && (
                                <p className="mt-2 text-sm font-['Libre_Franklin'] text-red-600">
                                    This code has expired. Request a new one below.
                                </p>
                            )}
                            {expiresAt && (
                                <p className="mt-1 text-xs font-['Libre_Franklin'] text-gray-500">
                                    Expires {new Date(expiresAt).toLocaleString()}
                                </p>
                            )}
                        {status && (
                            <p className="mt-2 text-sm font-['Libre_Franklin'] text-emerald-500">
                                {status}
                            </p>
                        )}
                        </div>

                        <Form method="post" action={verifyUrl} className="space-y-6">
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label className="block text-sm font-bold mb-2 font-['Libre_Franklin']">
                                            Code
                                        </label>
                                        <input
                                            type="text"
                                            name="code"
                                            placeholder="6-digit code"
                                            maxLength={6}
                                            className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-500"
                                        />
                                        <InputError message={errors.code} />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || isExpired}
                                        className="w-full bg-[var(--bg-red)] text-white py-3 font-medium rounded-sm font-['Libre_Franklin'] hover:bg-red-800 transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Verifying...' : 'Submit'}
                                    </button>
                                </>
                            )}
                        </Form>

                        <Form method="post" action={resendUrl} className="mt-4">
                            {({ processing }) => (
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full text-center text-sm text-gray-900 hover:underline font-['Libre_Franklin'] disabled:opacity-50"
                                >
                                    Resend code
                                </button>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}