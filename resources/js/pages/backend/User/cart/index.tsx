import { Head, Link, router, usePage } from '@inertiajs/react';
import { Trash2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import FrontendLayout from '@/layouts/frontend-layout';
import { cn } from '@/lib/utils';
import { login } from '@/routes';
import { destroy, update } from '@/routes/cart/items';
import type { SharedData } from '@/types';

const FALLBACK_IMG = '/assets/images/no-image.png';

export interface CartLine {
    id: number;
    product_id: number | null;
    title: string;
    image_url: string | null;
    image_alt: string | null;
    color: string | null;
    size: string | null;
    unit_price: number;
    quantity: number;
    max_quantity: number;
    line_total: number;
    variant_id: number | null;
}

interface CartPageProps {
    items: CartLine[];
    subtotal: number;
    item_count: number;
    is_empty: boolean;
    is_authenticated: boolean;
}

function resolveImg(url: string | null | undefined): string {
    if (!url) return FALLBACK_IMG;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
}

function CartLineRow({ line }: { line: CartLine }) {
    const [busy, setBusy] = useState(false);

    const patchQty = useCallback(
        (next: number) => {
            const clamped = Math.min(
                line.max_quantity,
                Math.max(1, Math.floor(next)),
            );
            if (clamped === line.quantity) {
                return;
            }
            setBusy(true);
            router.patch(
                update.url({ cartItem: line.id }),
                { quantity: clamped },
                {
                    preserveScroll: true,
                    onFinish: () => setBusy(false),
                },
            );
        },
        [line.id, line.max_quantity, line.quantity],
    );

    const remove = useCallback(() => {
        if (!confirm('Remove this item from your cart?')) return;
        setBusy(true);
        router.delete(destroy.url({ cartItem: line.id }), {
            preserveScroll: true,
            onFinish: () => setBusy(false),
        });
    }, [line.id]);

    const subtitle = [line.color, line.size].filter(Boolean).join(' · ');

    return (
        <div
            className={cn(
                'grid grid-cols-1 items-center gap-4 border-b border-gray-200 py-6 last:border-b-0 md:grid-cols-12',
                busy && 'pointer-events-none opacity-60',
            )}
        >
            <div className="col-span-6 flex items-center gap-4">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-sm bg-white">
                    <img
                        src={resolveImg(line.image_url)}
                        alt={line.image_alt ?? line.title}
                        className="h-full w-full object-cover"
                    />
                </div>
                <div className="min-w-0">
                    <p className="font-medium text-gray-900">{line.title}</p>
                    {subtitle ? (
                        <p className="text-sm text-gray-500">{subtitle}</p>
                    ) : null}
                </div>
            </div>
            <div className="col-span-2 text-center font-[Libre_Franklin] text-lg font-semibold text-gray-900 md:text-left">
                ${line.unit_price.toFixed(2)}
            </div>
            <div className="col-span-3 flex justify-center md:justify-center">
                <div className="flex items-center gap-1 rounded-md border border-gray-200 bg-[var(--bg-animation)] px-1 py-1">
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 cursor-pointer p-0"
                        disabled={line.quantity <= 1 || busy}
                        onClick={() => patchQty(line.quantity - 1)}
                    >
                        −
                    </Button>
                    <span className="min-w-[2rem] text-center text-sm font-medium tabular-nums text-gray-900">
                        {line.quantity}
                    </span>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 cursor-pointer p-0"
                        disabled={
                            line.quantity >= line.max_quantity || busy
                        }
                        onClick={() => patchQty(line.quantity + 1)}
                    >
                        +
                    </Button>
                </div>
            </div>
            <div className="col-span-1 flex justify-between gap-4 md:flex-col md:items-end">
                <span className="font-[Libre_Franklin] text-sm font-semibold text-gray-900 md:text-base">
                    ${line.line_total.toFixed(2)}
                </span>
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer text-gray-400 hover:text-red-600"
                    onClick={remove}
                    aria-label="Remove item"
                >
                    <Trash2 className="h-5 w-5" />
                </Button>
            </div>
        </div>
    );
}

export default function Cart({
    items,
    subtotal,
    item_count,
    is_empty,
    is_authenticated,
}: CartPageProps) {
    const { flash } = usePage<
        SharedData & {
            flash?: { toast?: { type: string; message: string } | null };
        }
    >().props;

    useEffect(() => {
        const t = flash?.toast;
        if (!t?.message) return;
        // Stable id: React Strict Mode runs effects twice in dev; Sonner merges updates by id.
        const opts = { id: 'inertia-session-flash' } as const;
        if (t.type === 'success') toast.success(t.message, opts);
        else if (t.type === 'error') toast.error(t.message, opts);
        else toast.message(t.message, opts);
    }, [flash?.toast]);

    return (
        <FrontendLayout>
            <Head title="Shopping cart" />

            <section className="container mx-auto max-w-6xl p-4 font-sans md:p-10">
                <div className="flex flex-col gap-6 lg:flex-row">
                    <div className="min-w-0 flex-grow rounded-sm bg-[var(--bg-gray0)] p-6 md:p-8">
                        <h1 className="mb-2 font-[Alumni_Sans] text-xl font-semibold text-gray-900">
                            Shopping cart
                        </h1>
                        {item_count > 0 ? (
                            <p className="mb-6 text-sm text-gray-600">
                                {item_count}{' '}
                                {item_count === 1 ? 'item' : 'items'}
                            </p>
                        ) : null}

                        {!is_empty ? (
                            <>
                                <div className="mb-4 hidden grid-cols-12 border-b border-gray-200 pb-2 text-xs font-medium tracking-wider text-gray-500 uppercase md:grid">
                                    <div className="col-span-6">
                                        Products
                                    </div>
                                    <div className="col-span-2 text-center">
                                        Price
                                    </div>
                                    <div className="col-span-3 text-center">
                                        Quantity
                                    </div>
                                    <div className="col-span-1" />
                                </div>
                                <div>
                                    {items.map((line) => (
                                        <CartLineRow key={line.id} line={line} />
                                    ))}
                                </div>
                            </>
                        ) : (
                            <div className="py-16 text-center">
                                <p className="text-gray-600">
                                    Your cart is empty.
                                </p>
                                <Button asChild className="mt-6" variant="default">
                                    <Link href="/">Continue shopping</Link>
                                </Button>
                            </div>
                        )}
                    </div>

                    <aside className="w-full shrink-0 self-start rounded-sm bg-[var(--bg-gray0)] p-8 lg:w-80">
                        <h2 className="mb-6 font-[Alumni_Sans] text-xl font-bold text-gray-900">
                            Order summary
                        </h2>
                        <div className="mb-6 space-y-4 text-sm">
                            <div className="flex justify-between border-b border-gray-200 pb-2">
                                <span className="font-[Libre_Franklin] text-gray-600">
                                    Subtotal
                                </span>
                                <span className="font-bold text-gray-900">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between border-b border-gray-300 pb-2">
                                <span className="font-[Libre_Franklin] text-gray-600">
                                    Shipping
                                </span>
                                <span className="font-[Libre_Franklin] font-bold text-gray-900">
                                    —
                                </span>
                            </div>
                            <div className="flex justify-between pt-2">
                                <span className="font-[Libre_Franklin] font-bold text-gray-900">
                                    Total
                                </span>
                                <span className="font-[Libre_Franklin] font-bold text-gray-900">
                                    ${subtotal.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {is_authenticated ? (
                            <Button
                                type="button"
                                className="mb-4 w-full cursor-pointer rounded-sm bg-[var(--bg-red)] py-6 text-white hover:bg-red-800"
                                onClick={() =>
                                    router.visit('/productdetails2')
                                }
                            >
                                Proceed to checkout
                            </Button>
                        ) : (
                            <Button
                                type="button"
                                className="mb-4 w-full cursor-pointer rounded-sm bg-[var(--bg-red)] py-6 text-white hover:bg-red-800"
                                onClick={() => router.visit(login().url)}
                            >
                                Sign in to checkout
                            </Button>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            className="w-full cursor-pointer rounded-sm border-primary py-6 text-primary hover:bg-red-50"
                            onClick={() => window.history.back()}
                        >
                            Back
                        </Button>
                    </aside>
                </div>
            </section>
        </FrontendLayout>
    );
}
