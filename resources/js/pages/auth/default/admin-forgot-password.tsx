import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronLeft } from 'lucide-react';

import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FrontendLayout from '@/layouts/frontend-layout';

interface Props {
    status?: string;
}

export default function AdminForgotPassword({ status }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('admin.password.send-code'));
    };

    return (
        <FrontendLayout>
            <Head title="Admin - Forgot password" />
            <div className="font-sans text-white overflow-x-hidden relative min-h-screen">
                <div className="container mx-auto mt-20 mb-20 flex items-center justify-center font-sans relative z-10">
                    <div className="bg-[var(--bg-gray0)] w-full max-w-md p-10 md:p-14 rounded-sm shadow-sm text-sidebar">
                        <div className="flex flex-col items-center mb-10">
                            <img src="/assets/images/Layer_1.png" alt="Logo" className="h-16 w-auto" />
                        </div>

                        <div className="mb-8">
                            <h2 className="text-xl font-bold font-['Alumni_Sans']">Forgot Password</h2>
                            <p className="text-sm text-sidebar mt-1 font-['Libre_Franklin']">
                                We'll send you a code to reset your password.
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 p-3 rounded-sm bg-green-50 border border-green-200 text-green-700 text-sm">
                                {status}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-xl font-bold mb-2 font-['Alumni_Sans']">
                                    Admin Email
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

                            <button
                                type="submit"
                                disabled={processing}
                                className="text-md font-bold w-full bg-[var(--bg-red)] text-white py-3 rounded-sm font-['Libre_Franklin'] transition-colors disabled:opacity-50"
                            >
                                {processing ? 'Sending...' : 'Send Verification Code'}
                            </button>

                            <Link
                                href={route('admin.login')}
                                className="flex items-center justify-center gap-2 text-sm text-sidebar hover:underline font-['Libre_Franklin']"
                            >
                                <ChevronLeft className="h-4 w-4" />
                                Back to login
                            </Link>
                        </form>
                    </div>
                </div>
            </div>
        </FrontendLayout>
    );
}
