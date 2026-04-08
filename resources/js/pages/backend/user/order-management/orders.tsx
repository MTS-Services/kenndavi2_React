import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FrontendLayout from '@/layouts/frontend-layout';
import { cn } from '@/lib/utils';

interface OrderItemSummary {
    id: number;
    title: string;
    image_url: string;
    quantity: number;
    unit_price?: number;
    can_review: boolean;
    has_review?: boolean;
}

interface OrderSummary {
    id: number;
    order_number: string;
    status: string;
    status_label: string;
    created_at: string | null;
    grand_total: number;
    items_count: number;
    items: OrderItemSummary[];
}

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface Paginated<T> {
    data: T[];
    links: PaginatorLink[];
}

interface OrdersPageProps {
    orders: Paginated<OrderSummary>;
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

    return new Date(value).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

function statusClass(status: string): string {
    if (status === 'delivered' || status === 'completed') {
        return 'bg-green-50 text-green-600';
    }
    if (
        status === 'packed' ||
        status === 'processing' ||
        status === 'shipped'
    ) {
        return 'bg-purple-50 text-purple-600';
    }
    if (status === 'cancelled' || status === 'failed') {
        return 'bg-zinc-100 text-zinc-600';
    }

    return 'bg-red-50 text-red-600';
}

export default function Orders({ orders }: OrdersPageProps) {
    const [expandedOrders, setExpandedOrders] = useState<
        Record<number, boolean>
    >({});

    const toggleExpand = (orderId: number): void => {
        setExpandedOrders((current) => ({
            ...current,
            [orderId]: !current[orderId],
        }));
    };

    return (
        <FrontendLayout>
            <Head title="Orders" />
            <section className="flex flex-1 items-center justify-center py-10">
                <div className="container mx-auto max-w-4xl space-y-6 px-4">
                    {orders.data.length === 0 ? (
                        <div className="rounded-sm bg-[var(--bg-gray0)] p-8 text-center text-sm text-gray-600">
                            No orders found.
                        </div>
                    ) : (
                        orders.data.map((order) => {
                            const isExpanded = Boolean(
                                expandedOrders[order.id],
                            );
                            const visibleItems = isExpanded
                                ? order.items
                                : order.items.slice(0, 2);
                            const hasMoreThanDefault = order.items.length > 2;
                            const hasScrollableItems =
                                isExpanded && order.items.length > 4;

                            return (
                                <Card
                                    key={order.id}
                                    className="border border-zinc-200 bg-[var(--bg-gray0)] shadow-xs"
                                >
                                    <CardContent className="">
                                        <div className="mb-4 flex flex-wrap items-start justify-between gap-3 border-b border-zinc-200 pb-4">
                                            <div className="space-y-1">
                                                <p className="text-sm text-gray-600">
                                                    Order ID:{' '}
                                                    <span className="font-bold text-black">
                                                        #{order.order_number}
                                                    </span>
                                                </p>
                                                <p className="font-[Libre_Franklin] text-sm leading-relaxed text-gray-600">
                                                    Placed on{' '}
                                                    {formatDate(
                                                        order.created_at,
                                                    )}
                                                    . {order.items_count}{' '}
                                                    item(s)
                                                </p>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <span
                                                    className={`rounded-sm px-3 py-1 font-[Alumni_Sans] text-xs font-bold uppercase ${statusClass(order.status)}`}
                                                >
                                                    {order.status_label}
                                                </span>
                                                <span className="font-[Libre_Franklin] text-xl font-bold text-zinc-900">
                                                    {formatMoney(
                                                        order.grand_total,
                                                    )}
                                                </span>
                                            </div>
                                        </div>

                                        <div
                                            className={`space-y-4 border-l-2 border-l-red-500 pr-1 pl-4 ${
                                                hasScrollableItems
                                                    ? 'max-h-[320px] overflow-y-auto'
                                                    : ''
                                            }`}
                                        >
                                            {visibleItems.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-start justify-between gap-4 rounded-md border border-zinc-100 bg-zinc-50/50 p-3"
                                                >
                                                    <div className="flex items-start gap-3">
                                                        <div className="h-20 w-20 overflow-hidden rounded-sm bg-gray-200">
                                                            <img
                                                                src={
                                                                    item.image_url
                                                                }
                                                                alt={item.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-[Alumni_Sans] text-2xl leading-tight font-bold">
                                                                {item.title}
                                                            </h3>
                                                            <p className="font-[Libre_Franklin] text-sm leading-relaxed text-gray-600">
                                                                Quantity:{' '}
                                                                {item.quantity}
                                                            </p>
                                                            <p className="font-[Libre_Franklin] text-xl font-bold text-zinc-900">
                                                                {formatMoney(
                                                                    item.unit_price ??
                                                                        0,
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    {item.has_review ? (
                                                        <Button
                                                            size="sm"
                                                            disabled
                                                            className="cursor-not-allowed rounded-sm px-4 py-2 font-[Libre_Franklin] text-xs"
                                                        >
                                                            Reviewed
                                                        </Button>
                                                    ) : item.can_review ? (
                                                        <Link
                                                            href={route(
                                                                'order.review.create',
                                                                {
                                                                    order: order.id,
                                                                    item: item.id,
                                                                },
                                                            )}
                                                            className="rounded-sm bg-red-600 px-4 py-2 font-[Libre_Franklin] text-xs text-white transition-colors hover:bg-red-700"
                                                        >
                                                            Write A Review
                                                        </Link>
                                                    ) : (
                                                        <span className="text-xs text-zinc-400">
                                                            Not eligible
                                                        </span>
                                                    )}
                                                </div>
                                            ))}
                                        </div>

                                        <div className="mt-4 flex flex-wrap gap-3">
                                            {hasMoreThanDefault ? (
                                                <Button
                                                    variant="link"
                                                    size="sm"
                                                    onClick={() =>
                                                        toggleExpand(order.id)
                                                    }
                                                    className="cursor-pointer"
                                                >
                                                    {isExpanded
                                                        ? 'Load Less'
                                                        : 'Load More'}
                                                </Button>
                                            ) : null}
                                            <Link
                                                href={route(
                                                    'order.show',
                                                    order.id,
                                                )}
                                                className="cursor-pointer rounded-sm border border-red-200 px-6 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })
                    )}

                    {orders.links.length > 3 ? (
                        <div className="mt-2 flex items-center justify-center gap-2">
                            {orders.links.map((link, idx) => {
                                const label = link.label
                                    .replace('&laquo; Previous', 'Previous')
                                    .replace('Next &raquo;', 'Next')
                                    .trim();
                                const isNavButton =
                                    label === 'Previous' || label === 'Next';

                                if (!link.url) {
                                    return (
                                        <Button
                                            key={`disabled-${idx}`}
                                            variant="outline"
                                            size="sm"
                                            disabled
                                            className="min-w-9 disabled:cursor-not-allowed bg-[var(--bg-gray0)]/80 backdrop-blur-lg"
                                        >
                                            {label}
                                        </Button>
                                    );
                                }

                                return (
                                    <Button
                                        key={`${label}-${idx}`}
                                        asChild
                                        variant={
                                            link.active ? 'default' : 'outline'
                                        }
                                        size="sm"
                                        className={cn(
                                            'cursor-pointer bg-[var(--bg-gray0)]/70 backdrop-blur-lg',
                                            isNavButton ? 'px-4' : 'min-w-9',
                                        )}
                                    >
                                        <Link href={link.url}>{label}</Link>
                                    </Button>
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            </section>
        </FrontendLayout>
    );
}
