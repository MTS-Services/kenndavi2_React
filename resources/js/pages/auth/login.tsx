import { Form, Head } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';
import InputError from '@/components/input-error';

export default function Login({ status }: { status?: string }) {
    return (
        <FrontendLayout>
            <Head title="User Login" />

            <div className="font-sans text-white overflow-x-hidden relative min-h-screen">
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

                        {status && (
                            <p className="mb-4 text-sm text-emerald-400 font-['Libre_Franklin']">{status}</p>
                        )}

                        <Form
                            method="post"
                            action={route('user.otp.request')}
                            resetOnSuccess={['email']}
                            className="space-y-6"
                        >
                            {({ errors, processing }) => (
                                <>
                                    <div>
                                        <label className="block text-xl font-bold mb-2 font-['Alumni_Sans']">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="Email"
                                            className="w-full p-3 bg-transparent border border-gray-400 rounded-sm focus:outline-none focus:ring-1 focus:ring-red-800 transition-all placeholder:text-gray-500"
                                        />

                                        <InputError message={errors.email} />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="text-md font-bold w-full bg-[var(--bg-red)] text-white py-3 rounded-sm font-['Libre_Franklin'] transition-colors disabled:opacity-50"
                                    >
                                        {processing ? 'Processing...' : 'Continue'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
