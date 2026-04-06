import { Head, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FrontendLayout from '@/layouts/frontend-layout';
import { cn } from '@/lib/utils';
import { store as storeShipping } from '@/routes/order/shipping';

type ShippingAddress = {
    first_name: string;
    last_name: string | null;
    email: string;
    phone: string;
    state: string;
    city: string;
    zip_code: string;
    address: string;
};

type CartSummaryItem = {
    id: number;
    title: string;
    image_url: string | null;
    image_alt: string | null;
    color: string | null;
    size: string | null;
    unit_price: number;
    quantity: number;
    line_total: number;
};

interface ShippingPageProps {
    shippingAddress: ShippingAddress | null;
    cartItems: CartSummaryItem[];
    subtotal: number;
    itemCount: number;
}

const FALLBACK_IMG = '/assets/images/no-image.png';

function resolveImg(url: string | null | undefined): string {
    if (!url) return FALLBACK_IMG;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
}

export default function ShippingInformation({
    shippingAddress,
    cartItems,
    subtotal,
    itemCount,
}: ShippingPageProps) {
    const defaults = useMemo(
        () =>
            shippingAddress ?? {
                first_name: '',
                last_name: '',
                email: '',
                phone: '',
                state: '',
                city: '',
                zip_code: '',
                address: '',
            },
        [shippingAddress],
    );

    const { data, setData, post, processing, errors } = useForm({
        first_name: defaults.first_name,
        last_name: defaults.last_name ?? '',
        email: defaults.email,
        phone: defaults.phone,
        state: defaults.state,
        city: defaults.city,
        zip_code: defaults.zip_code,
        address: defaults.address,
        save_as_default: false,
    });

    const total = subtotal;

    return (
        <FrontendLayout>
            <Head title="Shipping Information" />

            <section className="container mx-auto max-w-7xl p-4 py-10">
                <div className="mx-auto flex max-w-6xl flex-col gap-8 lg:flex-row">
                    <div className="flex-grow self-start rounded-sm bg-[var(--bg-gray0)] p-6 md:p-8 lg:sticky lg:top-10">
                        <div className="mb-8 flex items-start justify-between gap-4">
                            <div>
                                <h1 className="font-[Alumni_Sans] text-2xl font-bold">
                                    Shipping information
                                </h1>
                                <p className="mt-1 text-sm text-gray-600">
                                    Enter the address where you want to receive
                                    your order.
                                </p>
                            </div>
                        </div>

                        <form
                            id="shipping-form"
                            className="space-y-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                post(storeShipping.url(), {
                                    preserveScroll: true,
                                });
                            }}
                        >
                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="first_name"
                                        className="font-[Alumni_Sans] text-base font-bold"
                                    >
                                        First name
                                    </Label>
                                    <Input
                                    className='border border-[#110304B8] rounded focus:outline-none focus:ring-1 focus:ring-red-800'
                                        id="first_name"
                                        value={data.first_name}
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                        placeholder="First name"
                                        aria-invalid={!!errors.first_name}
                                    />
                                    {errors.first_name ? (
                                        <p className="text-sm text-red-600">
                                            {errors.first_name}
                                        </p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label
                                        htmlFor="last_name"
                                        className="font-[Alumni_Sans] text-base font-bold"
                                    >
                                        Last name
                                    </Label>
                                    <Input
                                        id="last_name"
                                        className='border border-[#110304B8] rounded focus:outline-none focus:ring-1 focus:ring-red-800'
                                        value={data.last_name}
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                        placeholder="Last name"
                                        aria-invalid={!!errors.last_name}
                                    />
                                    {errors.last_name ? (
                                        <p className="text-sm text-red-600">
                                            {errors.last_name}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="email"
                                        className="font-[Alumni_Sans] text-base font-bold"
                                    >
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        className='border border-[#110304B8] rounded focus:outline-none focus:ring-1 focus:ring-red-800'
                                        type="email"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                        placeholder="jackson.graham@example.com"
                                        autoComplete="email"
                                        aria-invalid={!!errors.email}
                                    />
                                    {errors.email ? (
                                        <p className="text-sm text-red-600">
                                            {errors.email}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="phone"
                                        className="font-[Alumni_Sans] text-base font-bold"
                                    >
                                        Phone number
                                    </Label>
                                    <Input
                                        id="phone"
                                        className='border border-[#110304B8] rounded focus:outline-none focus:ring-1 focus:ring-red-800'
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                        placeholder="(406) 555-0120"
                                        autoComplete="tel"
                                        aria-invalid={!!errors.phone}
                                    />
                                    {errors.phone ? (
                                        <p className="text-sm text-red-600">
                                            {errors.phone}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="state"
                                        className="font-[Alumni_Sans] text-base font-bold"
                                    >
                                        Region/State
                                    </Label>
                                    <Input
                                        id="state"
                                        className='border border-[#110304B8] rounded focus:outline-none focus:ring-1 focus:ring-red-800'
                                        value={data.state}
                                        onChange={(e) =>
                                            setData('state', e.target.value)
                                        }
                                        placeholder="State"
                                        aria-invalid={!!errors.state}
                                    />
                                    {errors.state ? (
                                        <p className="text-sm text-red-600">
                                            {errors.state}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="city"
                                        className="font-[Alumni_Sans] text-base font-bold"
                                    >
                                        City
                                    </Label>
                                    <Input
                                        id="city"
                                        className='border border-[#110304B8] rounded focus:outline-none focus:ring-1 focus:ring-red-800'
                                        value={data.city}
                                        onChange={(e) =>
                                            setData('city', e.target.value)
                                        }
                                        placeholder="City"
                                        aria-invalid={!!errors.city}
                                    />
                                    {errors.city ? (
                                        <p className="text-sm text-red-600">
                                            {errors.city}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="space-y-2">
                                    <Label
                                        htmlFor="zip_code"
                                        className="font-[Alumni_Sans] text-base font-bold"
                                    >
                                        Zip code
                                    </Label>
                                    <Input
                                        id="zip_code"
                                        className='border border-[#110304B8] rounded focus:outline-none focus:ring-1 focus:ring-red-800'
                                        value={data.zip_code}
                                        onChange={(e) =>
                                            setData('zip_code', e.target.value)
                                        }
                                        placeholder="Zip code"
                                        aria-invalid={!!errors.zip_code}
                                    />
                                    {errors.zip_code ? (
                                        <p className="text-sm text-red-600">
                                            {errors.zip_code}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label
                                    htmlFor="address"
                                    className="font-[Alumni_Sans] text-base font-bold"
                                >
                                    Address
                                </Label>
                                <Input
                                    id="address"
                                    className='border border-[#110304B8] rounded focus:outline-none focus:ring-1 focus:ring-red-800'
                                    value={data.address}
                                    onChange={(e) =>
                                        setData('address', e.target.value)
                                    }
                                    placeholder="Street address"
                                    aria-invalid={!!errors.address}
                                />
                                {errors.address ? (
                                    <p className="text-sm text-red-600">
                                        {errors.address}
                                    </p>
                                ) : null}
                            </div>

                            <div className="flex items-center gap-3">
                                <Checkbox
                                    id="save_as_default"
                                    checked={data.save_as_default}
                                    onCheckedChange={(v) =>
                                        setData('save_as_default', !!v)
                                    }
                                />
                                <Label htmlFor="save_as_default">
                                    Save shipping address into default address
                                </Label>
                            </div>
                        </form>
                    </div>

                    <div className="w-full self-start rounded-sm bg-[var(--bg-gray0)] p-6 md:p-8 lg:w-[380px] lg:sticky lg:top-10">
                        <h2 className="mb-6 font-['Libre_Franklin'] text-lg font-bold text-gray-900">
                            Order summary
                        </h2>

                        <div className="mb-8 space-y-4">
                            {cartItems.map((item) => {
                                const subtitle = [item.color, item.size]
                                    .filter(Boolean)
                                    .join(' · ');
                                return (
                                    <div
                                        key={item.id}
                                        className="flex items-center gap-4"
                                    >
                                        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-white">
                                            <img
                                                src={resolveImg(item.image_url)}
                                                alt={
                                                    item.image_alt ??
                                                    item.title
                                                }
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <div className="min-w-0 text-xs">
                                            <p className="truncate font-bold text-gray-900">
                                                {item.title}
                                            </p>
                                            {subtitle ? (
                                                <p className="text-gray-500">
                                                    {subtitle}
                                                </p>
                                            ) : null}
                                            <p className="text-gray-600">
                                                {item.quantity} ×{' '}
                                                <span className="font-bold text-gray-900">
                                                    $
                                                    {item.unit_price.toFixed(2)}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mb-8 space-y-3 border-t border-gray-300 pt-6 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-900">
                                    Sub-total
                                </span>
                                <span className="font-bold text-gray-900">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-300 pb-3">
                                <span className="text-gray-900">Shipping</span>
                                <span className="font-bold text-gray-900">
                                    —
                                </span>
                            </div>
                            <div className="flex justify-between pt-1">
                                <span className="font-['Libre_Franklin'] font-bold text-gray-900">
                                    Total
                                </span>
                                <span className="text-base font-bold text-gray-900">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {itemCount > 0 ? (
                                <Button
                                    type="submit"
                                    form="shipping-form"
                                    disabled={processing}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center justify-center gap-2 rounded-sm bg-[var(--bg-red)] py-6 font-medium text-white transition-colors hover:bg-red-800',
                                    )}
                                >
                                    Place Order
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-4 w-4"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M14 5l7 7m0 0l-7 7m7-7H3"
                                        />
                                    </svg>
                                </Button>
                            ) : null}

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full cursor-pointer rounded-sm border-[var(--bg-red)] py-6 font-medium text-[var(--bg-red)] transition-colors hover:bg-red-50"
                                onClick={() => window.history.back()}
                            >
                                Back
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
