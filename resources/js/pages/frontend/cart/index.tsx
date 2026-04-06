import { Head, Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart, Trash2 } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import FrontendLayout from '@/layouts/frontend-layout';
import { cn } from '@/lib/utils';
import { home, login } from '@/routes';
import { destroy, update } from '@/routes/cart/items';
import type { SharedData } from '@/types';
import { shipping } from '@/routes/order';

// ─── Constants ────────────────────────────────────────────────────────────────

const FALLBACK_IMG = '/assets/images/no-image.png';
const TOAST_ID = 'inertia-session-flash' as const;

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartLine {
    id: number;
    product_id: number | null;
    variant_id: number | null;
    title: string;
    image_url: string | null;
    image_alt: string | null;
    color: string | null;
    size: string | null;
    unit_price: number;
    quantity: number;
    max_quantity: number;
    line_total: number;
}

interface CartPageProps {
    items: CartLine[];
    subtotal: number;
    item_count: number;
    is_empty: boolean;
    is_authenticated: boolean;
}

type FlashToast = { type: 'success' | 'error' | string; message: string };

// ─── Utilities ────────────────────────────────────────────────────────────────

function resolveImageSrc(url: string | null | undefined): string {
    if (!url) return FALLBACK_IMG;
    if (url.startsWith('http://') || url.startsWith('https://')) return url;
    return url.startsWith('/') ? url : `/${url}`;
}

function formatPrice(amount: number): string {
    return `$${amount.toFixed(2)}`;
}

function pluralise(count: number, word: string): string {
    return `${count} ${word}${count === 1 ? '' : 's'}`;
}

// ─── QuantityStepper ──────────────────────────────────────────────────────────

interface QuantityStepperProps {
    value: number;
    min?: number;
    max: number;
    disabled?: boolean;
    onChange: (next: number) => void;
}

function QuantityStepper({
    value,
    min = 1,
    max,
    disabled = false,
    onChange,
}: QuantityStepperProps) {
    const [draft, setDraft] = useState(String(value));

    // Keep draft in sync when the authoritative value changes (e.g. after server response)
    const prevValue = useRef(value);
    useEffect(() => {
        if (prevValue.current !== value) {
            prevValue.current = value;
            setDraft(String(value));
        }
    }, [value]);

    const commit = useCallback(() => {
        const trimmed = draft.trim();
        if (trimmed === '') {
            setDraft(String(value));
            return;
        }
        const parsed = parseInt(trimmed, 10);
        if (!Number.isFinite(parsed)) {
            setDraft(String(value));
            return;
        }
        const clamped = Math.min(max, Math.max(min, Math.floor(parsed)));
        if (clamped !== value) onChange(clamped);
        else setDraft(String(value)); // reset if same
    }, [draft, max, min, onChange, value]);

    const handleKeyDown = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') e.currentTarget.blur();
            if (e.key === 'Escape') {
                setDraft(String(value));
                e.currentTarget.blur();
            }
        },
        [value],
    );

    return (
        <div
            className={cn(
                'inline-flex items-center rounded-md border border-gray-200 bg-[var(--bg-animation)]',
                disabled && 'pointer-events-none opacity-50',
            )}
        >
            <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Decrease quantity"
                disabled={value <= min || disabled}
                onClick={() => onChange(value - 1)}
                className="h-9 w-9 rounded-r-none p-0 text-base"
            >
                −
            </Button>

            <span className="h-5 w-px bg-gray-200" aria-hidden />

            <Input
                type="number"
                inputMode="numeric"
                min={min}
                max={max}
                value={draft}
                disabled={disabled}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={handleKeyDown}
                aria-label="Quantity"
                className={cn(
                    'h-9 w-12 rounded-none border-0 bg-transparent px-0 text-center text-sm',
                    'font-medium tabular-nums shadow-none focus-visible:ring-0',
                    '[appearance:textfield]',
                    '[&::-webkit-inner-spin-button]:appearance-none',
                    '[&::-webkit-outer-spin-button]:appearance-none',
                )}
            />

            <span className="h-5 w-px bg-gray-200" aria-hidden />

            <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label="Increase quantity"
                disabled={value >= max || disabled}
                onClick={() => onChange(value + 1)}
                className="h-9 w-9 rounded-l-none p-0 text-base"
            >
                +
            </Button>
        </div>
    );
}

// ─── CartLineRow ──────────────────────────────────────────────────────────────

function CartLineRow({ line }: { line: CartLine }) {
    const [busy, setBusy] = useState(false);

    const handleQuantityChange = useCallback(
        (next: number) => {
            setBusy(true);
            router.patch(
                update.url({ cartItem: line.id }),
                { quantity: next },
                { preserveScroll: true, onFinish: () => setBusy(false) },
            );
        },
        [line.id],
    );

    const handleRemove = useCallback(() => {
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
                'grid grid-cols-1 items-center gap-4 border-b border-gray-100 py-6',
                'last:border-b-0 md:grid-cols-12',
                busy && 'pointer-events-none opacity-50',
            )}
        >
            {/* Product info */}
            <div className="col-span-6 flex items-center gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-sm bg-gray-50">
                    <img
                        src={resolveImageSrc(line.image_url)}
                        alt={line.image_alt ?? line.title}
                        className="h-full w-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="min-w-0">
                    <p className="truncate font-medium text-gray-900">
                        {line.title}
                    </p>
                    {subtitle && (
                        <p className="mt-0.5 text-sm text-gray-500">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {/* Unit price */}
            <div className="col-span-2 font-[Libre_Franklin] text-base font-semibold text-gray-900 md:text-center">
                {formatPrice(line.unit_price)}
            </div>

            {/* Quantity */}
            <div className="col-span-2 flex justify-start md:justify-center">
                <QuantityStepper
                    value={line.quantity}
                    max={line.max_quantity}
                    disabled={busy}
                    onChange={handleQuantityChange}
                />
            </div>

            {/* Line total */}
            <div className="col-span-1 font-[Libre_Franklin] text-base font-semibold text-gray-900 md:text-right">
                {formatPrice(line.line_total)}
            </div>

            {/* Remove */}
            <div className="col-span-1 flex justify-end">
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    aria-label={`Remove ${line.title} from cart`}
                    disabled={busy}
                    onClick={handleRemove}
                    className="text-gray-400 transition-colors hover:text-red-600"
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

// ─── OrderSummary ─────────────────────────────────────────────────────────────

interface OrderSummaryProps {
    subtotal: number;
    isAuthenticated: boolean;
}

function OrderSummary({ subtotal, isAuthenticated }: OrderSummaryProps) {
    return (
        <aside className="w-full shrink-0 self-start rounded-sm bg-[var(--bg-gray0)] p-8 lg:sticky lg:top-6 lg:w-80">
            <h2 className="mb-6 font-[Alumni_Sans] text-xl font-bold text-gray-900">
                Order summary
            </h2>

            <dl className="mb-6 space-y-4 text-sm">
                <SummaryRow label="Subtotal" value={formatPrice(subtotal)} />
                <SummaryRow label="Shipping" value="—" />
                <div className="flex justify-between border-t border-gray-200 pt-4 text-base font-bold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(subtotal)}</span>
                </div>
            </dl>

            {isAuthenticated ? (
                <Button
                    type="button"
                    className="mb-3 w-full rounded-sm bg-[var(--bg-red)] py-6 text-white hover:bg-red-800"
                    onClick={() => router.visit(shipping().url)}
                >
                    Proceed to checkout
                </Button>
            ) : (
                <Button
                    type="button"
                    className="mb-3 w-full rounded-sm bg-[var(--bg-red)] py-6 text-white hover:bg-red-800"
                    onClick={() => router.visit(login().url)}
                >
                    Sign in to checkout
                </Button>
            )}

            <Button
                type="button"
                variant="outline"
                className="w-full rounded-sm border-primary py-6 text-primary hover:bg-red-50"
                onClick={() => window.history.back()}
            >
                Back
            </Button>
        </aside>
    );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex justify-between border-b border-gray-100 pb-3">
            <dt className="font-[Libre_Franklin] text-gray-600">{label}</dt>
            <dd className="font-[Libre_Franklin] font-semibold text-gray-900">
                {value}
            </dd>
        </div>
    );
}

// ─── EmptyCart ────────────────────────────────────────────────────────────────

function EmptyCart() {
    return (
        <div className="flex flex-col items-center justify-center py-20 text-center">
            <ShoppingCart className="mb-4 h-12 w-12 text-gray-300" />
            <p className="text-base text-gray-500">Your cart is empty.</p>
            <Button asChild className="mt-6" variant="default">
                <Link href={home().url}>Continue shopping</Link>
            </Button>
        </div>
    );
}

// ─── CartTable Header ─────────────────────────────────────────────────────────

function CartTableHeader() {
    return (
        <div className="mb-2 hidden grid-cols-12 border-b border-gray-200 pb-3 text-xs font-semibold tracking-wider text-gray-400 uppercase md:grid">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-1 text-right">Total</div>
            <div className="col-span-1" />
        </div>
    );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Cart({
    items,
    subtotal,
    item_count,
    is_empty,
    is_authenticated,
}: CartPageProps) {
    const { flash } = usePage<
        SharedData & { flash?: { toast?: FlashToast | null } }
    >().props;

    useEffect(() => {
        const t = flash?.toast;
        if (!t?.message) return;
        const opts = { id: TOAST_ID };
        if (t.type === 'success') toast.success(t.message, opts);
        else if (t.type === 'error') toast.error(t.message, opts);
        else toast.message(t.message, opts);
    }, [flash?.toast]);

    return (
        <FrontendLayout>
            <Head title="Shopping cart" />

            <section className="flex flex-1 items-center justify-center">
                <div className="container mx-auto max-w-7xl px-4 py-8">
                    <div className="flex flex-col gap-6 lg:flex-row">
                        {/* Cart items panel */}
                        <div className="min-w-0 flex-1 rounded-sm bg-[var(--bg-gray0)] p-6 md:p-8">
                            <div className="mb-6 flex items-baseline gap-3">
                                <h1 className="font-[Alumni_Sans] text-2xl font-semibold text-gray-900">
                                    Shopping cart
                                </h1>
                                {item_count > 0 && (
                                    <span className="text-sm text-gray-500">
                                        {pluralise(item_count, 'item')}
                                    </span>
                                )}
                            </div>

                            {is_empty ? (
                                <EmptyCart />
                            ) : (
                                <>
                                    <CartTableHeader />
                                    <div>
                                        {items.map((line) => (
                                            <CartLineRow
                                                key={line.id}
                                                line={line}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Order summary sidebar */}
                        {!is_empty && (
                            <OrderSummary
                                subtotal={subtotal}
                                isAuthenticated={is_authenticated}
                            />
                        )}
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
