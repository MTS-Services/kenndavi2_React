import { Head, Link } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';
import { home } from '@/routes';

interface OrderItem {
    title: string;
    quantity: number;
    price: string;
    image_url: string | null;
}

interface ShippingAddress {
    name: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    phone: string;
}

interface PaymentSuccessProps {
    orderNumber: string;
    orderDate: string;
    userEmail: string;
    paymentGateway: 'stripe' | 'paypal' | 'authorize_net';
    success: boolean;
    message: string;
    subtotal: string;
    shippingCost: string;
    grandTotal: string;
    shippingAddress: ShippingAddress | null;
    items: OrderItem[];
}

export default function PaymentSuccess({
    orderNumber,
    orderDate,
    userEmail,
    paymentGateway,
    success,
    message,
    subtotal,
    shippingCost,
    grandTotal,
    shippingAddress,
    items,
}: PaymentSuccessProps) {
    const formattedAddress = shippingAddress
        ? [
              shippingAddress.address,
              shippingAddress.city,
              shippingAddress.state,
              shippingAddress.zip_code,
          ]
              .filter(Boolean)
              .join(', ')
        : null;

    return (
        <FrontendLayout>
            <Head title={success ? 'Order Confirmed' : 'Payment Status'} />

            <section className="flex flex-1 items-center justify-center py-10">
                <div className="container mx-auto max-w-6xl px-4">
                    {/* Header */}
                    <div className="mb-12 flex flex-col items-center">
                        <div className="relative mb-4 h-24 w-24">
                            <div
                                className={`absolute inset-0 animate-pulse rounded-full ${
                                    success ? 'bg-green-100' : 'bg-red-100'
                                }`}
                            />
                            <div className="relative flex h-full w-full items-center justify-center rounded-full">
                                {success ? (
                                    <svg
                                        className="h-14 w-14 text-green-500"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                        />
                                    </svg>
                                ) : (
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
                                )}
                            </div>
                        </div>
                        <h1 className="mb-2 font-['Libre_Franklin'] text-3xl font-bold text-gray-700">
                            {success
                                ? 'Order Confirmed!'
                                : 'Payment Incomplete'}
                        </h1>
                        <p className="font-['Libre_Franklin'] text-gray-400">
                            {success ? 'Thank you for your purchase' : message}
                        </p>
                    </div>

                    {/* Body */}
                    <div className="mx-auto flex max-w-6xl flex-col gap-10 pb-20 lg:flex-row">
                        {/* Left — order details */}
                        <div className="flex-grow space-y-6">
                            <div className="relative rounded-sm bg-[var(--bg-gray0)] p-8">
                                {/* Order meta */}
                                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                                    <div>
                                        <p className="mb-4 font-['Libre_Franklin'] text-lg font-bold text-gray-900">
                                            Order ID:{' '}
                                            <span className="font-normal text-gray-900">
                                                #{orderNumber}
                                            </span>
                                        </p>
                                        <div className="space-y-2 text-sm text-gray-900">
                                            {orderDate && (
                                                <div className="flex items-center gap-2">
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        className="h-4 w-4 shrink-0"
                                                        fill="currentColor"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                    {orderDate}
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4 shrink-0"
                                                    fill="currentColor"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                                {userEmail}
                                            </div>
                                        </div>
                                    </div>
                                    {success && (
                                        <div className="max-w-xs rounded border border-red-500/50 bg-[var(--bg-nevired)] p-4 font-['Libre_Franklin'] text-xs text-red-700">
                                            A confirmation email has been sent
                                            to your inbox
                                        </div>
                                    )}
                                </div>

                                {/* Shipping info */}
                                <div className="mt-8">
                                    <h2 className="mb-4 font-['Alumni_Sans'] text-xl font-bold text-gray-900">
                                        Shipped to Your Address
                                    </h2>
                                    <p className="mb-4 font-['Alumni_Sans'] text-sm text-gray-900">
                                        {items.length} item
                                        {items.length !== 1 ? 's' : ''} in this
                                        shipment
                                    </p>
                                    <div className="space-y-4">
                                        {shippingAddress && (
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
                                                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                        />
                                                    </svg>
                                                </div>
                                                <div>
                                                    <p className="font-['Alumni_Sans'] text-sm font-bold text-gray-900">
                                                        {shippingAddress.name}
                                                    </p>
                                                    <p className="font-['Alumni_Sans'] text-sm text-gray-900">
                                                        {formattedAddress}
                                                    </p>
                                                    {shippingAddress.phone && (
                                                        <p className="font-['Alumni_Sans'] text-sm text-gray-500">
                                                            {
                                                                shippingAddress.phone
                                                            }
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

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
                                                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                                    />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="font-['Alumni_Sans'] text-sm font-bold text-gray-900">
                                                    Payment via
                                                </p>
                                                <p className="font-['Alumni_Sans'] text-sm text-gray-900">
                                                    {paymentGateway.toUpperCase()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* CTA */}
                                <div className="mt-8 flex flex-wrap gap-3">
                                    <Link
                                        href={home().url}
                                        className="inline-flex items-center rounded-sm border border-gray-300 px-5 py-2 font-['Libre_Franklin'] text-sm font-medium text-gray-900 transition hover:bg-gray-100"
                                    >
                                        Continue shopping
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Right — order summary */}
                        <div className="w-full self-start rounded-sm bg-[var(--bg-gray0)] p-8 lg:w-[380px]">
                            <h2 className="mb-6 font-['Alumni_Sans'] text-lg font-bold tracking-tight text-gray-900 uppercase">
                                Order Summary
                            </h2>

                            {/* Items */}
                            <div className="mb-8 space-y-4">
                                {items.map((item, i) => (
                                    <div
                                        key={i}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded bg-gray-100">
                                            {item.image_url ? (
                                                <img
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    className="h-12 w-12 object-cover"
                                                />
                                            ) : (
                                                <svg
                                                    className="h-6 w-6 text-gray-300"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            )}
                                        </div>
                                        <div className="text-xs">
                                            <p className="font-['Libre_Franklin'] text-sm font-bold text-gray-900">
                                                {item.title}
                                            </p>
                                            <p className="text-gray-500">
                                                {item.quantity} x{' '}
                                                <span className="font-bold text-black">
                                                    ${item.price}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="space-y-3 border-t border-gray-300 pt-6 text-sm">
                                <div className="flex justify-between text-gray-600">
                                    <span className="font-['Libre_Franklin'] font-bold text-gray-900">
                                        Sub-total
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        ${subtotal}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-gray-300 pb-3 text-gray-600">
                                    <span className="font-['Libre_Franklin'] font-bold text-gray-900">
                                        Shipping
                                    </span>
                                    <span className="font-bold text-gray-900">
                                        {parseFloat(shippingCost) === 0
                                            ? 'Free'
                                            : `$${shippingCost}`}
                                    </span>
                                </div>
                                <div className="mb-8 flex justify-between pt-1">
                                    <span className="font-['Libre_Franklin'] font-bold text-gray-900">
                                        Total
                                    </span>
                                    <span className="text-base font-bold text-gray-900">
                                        ${grandTotal}
                                    </span>
                                </div>
                                <div className="flex justify-between border-t border-gray-300 pt-4 text-xs">
                                    <span className="font-[Libre_Franklin] text-gray-600">
                                        Payment Method:
                                    </span>
                                    <span className="font-[Libre_Franklin] font-bold text-gray-900">
                                        {paymentGateway.toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
