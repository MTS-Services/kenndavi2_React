import { Form, Head } from '@inertiajs/react';

import InputError from '@/components/input-error';
import FrontendLayout from '@/layouts/frontend-layout';

export default function Login({ status }: { status?: string }) {
    return (
        <FrontendLayout>
            <Head title="User Login" />

            <section className="flex flex-1 items-center justify-center">
                <div className="container mx-auto max-w-md">
                    <div className="w-full rounded-sm bg-[var(--bg-gray0)] p-10 text-sidebar shadow-sm md:p-14">
                        <div className="mb-10 flex flex-col items-center">
                            <img
                                src="assets/images/Layer_1.png"
                                alt="Logo"
                                className="h-16 w-auto"
                            />
                        </div>

                        <div className="mb-8">
                            <h2 className="font-['Alumni_Sans'] text-xl font-bold">
                                Sign in
                            </h2>
                            <p className="mt-1 font-['Libre_Franklin'] text-sm text-sidebar">
                                Sign in or create an accounts
                            </p>
                        </div>

                        {status && (
                            <p className="mb-4 font-['Libre_Franklin'] text-sm text-emerald-400">
                                {status}
                            </p>
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
                                        <label className="mb-2 block font-['Alumni_Sans'] text-xl font-bold">
                                            Email
                                        </label>

                                        <input
                                            type="email"
                                            name="email"
                                            required
                                            placeholder="Email"
                                            className="w-full rounded-sm border border-gray-400 bg-transparent p-3 transition-all placeholder:text-gray-500 focus:ring-1 focus:ring-red-800 focus:outline-none"
                                        />

                                        <InputError message={errors.email} />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="text-md w-full rounded-sm bg-[var(--bg-red)] py-3 font-['Libre_Franklin'] font-bold text-white transition-colors disabled:opacity-50"
                                    >
                                        {processing
                                            ? 'Processing...'
                                            : 'Continue'}
                                    </button>
                                </>
                            )}
                        </Form>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
