import { Head, Link } from '@inertiajs/react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import FrontendLayout from '@/layouts/frontend-layout';

interface OrderReview {
    id: number;
    rating: number;
    title: string | null;
    comment: string | null;
    status: string;
    created_at: string | null;
}

interface OrderItemDetails {
    id: number;
    title: string;
    sku: string | null;
    image_url: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    color: string | null;
    size: string | null;
    can_review: boolean;
    review: OrderReview | null;
}

interface PaymentDetails {
    id: number;
    method: string;
    gateway_txn_id: string | null;
    amount: number;
    currency: string;
    status: string;
    paid_at: string | null;
}

interface StatusHistory {
    id: number;
    from_status: string | null;
    to_status: string;
    note: string | null;
    created_at: string | null;
}

interface OrderDetailsPayload {
    id: number;
    order_number: string;
    status: string;
    status_label: string;
    payment_status: string;
    created_at: string | null;
    subtotal: number;
    discount_amount: number;
    shipping_cost: number;
    tax_amount: number;
    grand_total: number;
    notes: string | null;
    shipping_address: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        state: string;
        city: string;
        zip_code: string;
        address: string;
    } | null;
    items: OrderItemDetails[];
    payments: PaymentDetails[];
    status_history: StatusHistory[];
}

interface OrderDetailsPageProps {
    order: OrderDetailsPayload;
}

function formatMoney(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

function formatDate(value: string | null): string {
    if (!value) {
        return '—';
    }

    return new Date(value).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function stars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
}

export default function OrderDetails({ order }: OrderDetailsPageProps) {
    return (
        <FrontendLayout>
            <Head title={`Order #${order.order_number}`} />

            <section className="py-8 md:py-12">
                <div className="container mx-auto grid max-w-6xl gap-6 px-4 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div>
                                        <CardTitle>Order #{order.order_number}</CardTitle>
                                        <CardDescription>
                                            Placed on {formatDate(order.created_at)}
                                        </CardDescription>
                                    </div>
                                    <Badge>{order.status_label}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {order.items.map((item) => (
                                    <div key={item.id} className="rounded-md border p-4">
                                        <div className="flex flex-col gap-4 md:flex-row">
                                            <img
                                                src={item.image_url}
                                                alt={item.title}
                                                className="h-24 w-24 rounded-md object-cover"
                                            />
                                            <div className="flex-1 space-y-2">
                                                <div className="flex flex-wrap items-center justify-between gap-2">
                                                    <p className="font-medium">{item.title}</p>
                                                    <p className="text-sm font-semibold">
                                                        {formatMoney(item.total_price)}
                                                    </p>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    SKU: {item.sku ?? '—'} • Qty: {item.quantity} • Color:{' '}
                                                    {item.color ?? '—'} • Size: {item.size ?? '—'}
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    Unit price: {formatMoney(item.unit_price)}
                                                </p>
                                                {item.review ? (
                                                    <div className="rounded-md bg-muted p-3 text-sm">
                                                        <p className="font-medium">
                                                            Your review {stars(item.review.rating)}
                                                        </p>
                                                        {item.review.title ? (
                                                            <p className="mt-1">{item.review.title}</p>
                                                        ) : null}
                                                        {item.review.comment ? (
                                                            <p className="mt-1 text-muted-foreground">
                                                                {item.review.comment}
                                                            </p>
                                                        ) : null}
                                                    </div>
                                                ) : item.can_review ? (
                                                    <Button asChild size="sm">
                                                        <Link
                                                            href={route('order.review.create', {
                                                                order: order.id,
                                                                item: item.id,
                                                            })}
                                                        >
                                                            Write Review
                                                        </Link>
                                                    </Button>
                                                ) : null}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {order.payments.length === 0 ? (
                                    <p className="text-sm text-muted-foreground">
                                        No payment records found.
                                    </p>
                                ) : (
                                    order.payments.map((payment) => (
                                        <div
                                            key={payment.id}
                                            className="rounded-md border p-3 text-sm"
                                        >
                                            <p>
                                                <span className="font-medium">Method:</span>{' '}
                                                {payment.method}
                                            </p>
                                            <p>
                                                <span className="font-medium">Status:</span>{' '}
                                                {payment.status}
                                            </p>
                                            <p>
                                                <span className="font-medium">Amount:</span>{' '}
                                                {formatMoney(payment.amount)} {payment.currency}
                                            </p>
                                            <p>
                                                <span className="font-medium">Transaction:</span>{' '}
                                                {payment.gateway_txn_id ?? '—'}
                                            </p>
                                            <p>
                                                <span className="font-medium">Paid at:</span>{' '}
                                                {formatDate(payment.paid_at)}
                                            </p>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Order Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span>Subtotal</span>
                                    <span>{formatMoney(order.subtotal)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Discount</span>
                                    <span>-{formatMoney(order.discount_amount)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Shipping</span>
                                    <span>{formatMoney(order.shipping_cost)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span>Tax</span>
                                    <span>{formatMoney(order.tax_amount)}</span>
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between font-semibold">
                                    <span>Total</span>
                                    <span>{formatMoney(order.grand_total)}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Shipping Address</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-1 text-sm">
                                {order.shipping_address ? (
                                    <>
                                        <p className="font-medium">
                                            {order.shipping_address.first_name}{' '}
                                            {order.shipping_address.last_name}
                                        </p>
                                        <p>{order.shipping_address.address}</p>
                                        <p>
                                            {order.shipping_address.city}, {order.shipping_address.state}{' '}
                                            {order.shipping_address.zip_code}
                                        </p>
                                        <p>{order.shipping_address.email}</p>
                                        <p>{order.shipping_address.phone}</p>
                                    </>
                                ) : (
                                    <p className="text-muted-foreground">No shipping address found.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Status Timeline</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                {order.status_history.length === 0 ? (
                                    <p className="text-muted-foreground">No timeline events yet.</p>
                                ) : (
                                    order.status_history.map((entry) => (
                                        <div key={entry.id} className="rounded-md border p-3">
                                            <p className="font-medium">
                                                {entry.from_status ?? '—'} {'->'} {entry.to_status}
                                            </p>
                                            <p className="text-muted-foreground">
                                                {formatDate(entry.created_at)}
                                            </p>
                                            {entry.note ? <p className="mt-1">{entry.note}</p> : null}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}