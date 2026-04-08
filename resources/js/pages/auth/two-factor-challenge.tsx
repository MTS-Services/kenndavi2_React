import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import FrontendLayout from '@/layouts/frontend-layout';

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
            <section className="flex flex-1 items-center justify-center py-10">
                <div className="container mx-auto max-w-md">
                    <div className="w-full rounded-sm bg-[var(--bg-gray0)] p-10 text-[#1a1a1a] shadow-sm md:p-14">
                        <div className="mb-10 flex flex-col items-center">
                            <img
                                src="/assets/images/Layer_1.png"
                                alt="Logo"
                                className="h-16 w-auto"
                            />
                        </div>

                        <div className="mb-8">
                            <h2 className="font-['Libre_Franklin'] text-lg font-bold">
                                Enter code
                            </h2>
                            <p className="mt-1 font-['Libre_Franklin'] text-sm text-gray-500">
                                Sent to{' '}
                                <span className="font-semibold text-gray-700">
                                    {email || 'your email'}
                                </span>
                            </p>
                            {isExpired && (
                                <p className="mt-2 font-['Libre_Franklin'] text-sm text-red-600">
                                    This code has expired. Request a new one
                                    below.
                                </p>
                            )}
                            {expiresAt && (
                                <p className="mt-1 font-['Libre_Franklin'] text-xs text-gray-500">
                                    Expires{' '}
                                    {new Date(expiresAt).toLocaleString()}
                                </p>
                            )}
                            {status && (
                                <p className="mt-2 font-['Libre_Franklin'] text-sm text-emerald-500">
                                    {status}
                                </p>
                            )}
                        </div>

                        <Form
                            method="post"
                            action={verifyUrl}
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label className="mb-2 block font-['Libre_Franklin'] text-sm font-bold">
                                            Code
                                        </label>
                                        <input
                                            type="text"
                                            name="code"
                                            placeholder="6-digit code"
                                            maxLength={6}
                                            className="w-full rounded-sm border border-gray-400 bg-transparent p-3 transition-all placeholder:text-gray-500 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                        />
                                        <InputError message={errors.code} />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing || isExpired}
                                        className="w-full rounded-sm bg-[var(--bg-red)] py-3 font-['Libre_Franklin'] font-medium text-white transition-colors hover:bg-red-800 disabled:opacity-50 cursor-pointer"
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
                                    className="w-full text-center font-['Libre_Franklin'] text-sm text-gray-900 hover:underline disabled:opacity-50 cursor-pointer"
                                >
                                    Resend code
                                </button>
                            )}
                        </Form>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
