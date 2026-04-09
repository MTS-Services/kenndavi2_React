import { Head, Link, router } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';
import { home } from '@/routes';

interface PaymentFailedProps {
    orderNumber: string;
    message: string;
}

export default function PaymentFailed({
    orderNumber,
    message,
}: PaymentFailedProps) {
    return (
        <FrontendLayout>
            <Head title="Payment Failed" />

            <section className="flex flex-1 items-center justify-center py-10">
                <div className="container mx-auto max-w-6xl px-4">
                    {/* Header */}
                    <div className="mb-12 flex flex-col items-center">
                        <div className="relative mb-4 h-24 w-24">
                            <div className="absolute inset-0 animate-pulse rounded-full bg-red-100" />
                            <div className="relative flex h-full w-full items-center justify-center rounded-full">
                                <svg
                                    className="h-14 w-14 text-red-500"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                            </div>
                        </div>
                        <h1 className="mb-2 font-['Libre_Franklin'] text-3xl font-bold text-gray-700">
                            Payment Failed!
                        </h1>
                        <p className="font-['Libre_Franklin'] text-gray-400">
                            Don't worry, your items are safe
                        </p>
                    </div>

                    {/* Body */}
                    <div className="mx-auto max-w-2xl pb-20">
                        <div className="rounded-sm bg-[var(--bg-gray0)] p-8">
                            {/* Order meta */}
                            <p className="mb-4 font-['Libre_Franklin'] text-lg font-bold text-gray-900">
                                Order ID:{' '}
                                <span className="font-normal text-gray-900">
                                    #{orderNumber}
                                </span>
                            </p>

                            {/* Message box */}
                            <div className="mb-8 rounded border border-red-500/30 bg-[var(--bg-nevired)] p-4 font-['Libre_Franklin'] text-sm text-red-700">
                                {message}
                            </div>

                            {/* What happened / next steps */}
                            <div className="space-y-4">
                                <div className="flex gap-4 rounded bg-[var(--bg-animation)] p-5">
                                    <div className="shrink-0 text-gray-900">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-['Alumni_Sans'] text-sm font-bold text-gray-900">
                                            What happened?
                                        </p>
                                        <p className="font-['Alumni_Sans'] text-sm text-gray-900">
                                            Your payment was not processed and
                                            your order has been cancelled. No
                                            charges have been made to your
                                            account.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex gap-4 rounded bg-[var(--bg-animation)] p-5">
                                    <div className="shrink-0 text-gray-900">
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="h-6 w-6"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-['Alumni_Sans'] text-sm font-bold text-gray-900">
                                            Restore your cart
                                        </p>
                                        <p className="font-['Alumni_Sans'] text-sm text-gray-900">
                                            Click "Back to cart" below to
                                            restore your items and try again
                                            with a different payment method.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* CTAs */}
                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link
                                    href={home().url}
                                    className="inline-flex items-center rounded-sm border border-gray-300 px-5 py-2 font-['Libre_Franklin'] text-sm font-medium text-gray-900 transition hover:bg-gray-100"
                                >
                                    Continue shopping
                                </Link>
                                <button
                                    type="button"
                                    onClick={() =>
                                        router.post(
                                            `/payment/${orderNumber}/restore-cart`,
                                            undefined,
                                            { preserveScroll: true },
                                        )
                                    }
                                    className="inline-flex items-center rounded-sm bg-gray-900 px-5 py-2 font-['Libre_Franklin'] text-sm font-medium text-white transition hover:bg-gray-700"
                                >
                                    Back to cart
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
