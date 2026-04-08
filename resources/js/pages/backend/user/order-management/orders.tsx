import { Head, Link } from '@inertiajs/react';

import FrontendLayout from '@/layouts/frontend-layout';

interface OrderItemSummary {
    id: number;
    title: string;
    image_url: string;
    quantity: number;
    can_review: boolean;
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
                            const firstItem = order.items[0];
                            const reviewItem = order.items.find(
                                (item) => item.can_review,
                            );

                            return (
                                <div
                                    key={order.id}
                                    className="flex flex-col gap-6 rounded-sm bg-[var(--bg-gray0)] p-2 md:flex-row"
                                >
                                    <div className="aspect-square w-full overflow-hidden rounded-sm bg-gray-200 md:w-48">
                                        <img
                                            src={
                                                firstItem?.image_url ??
                                                '/assets/images/Rectangle 4343.png'
                                            }
                                            alt={
                                                firstItem?.title ?? 'Order item'
                                            }
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="mb-2 flex items-start justify-between">
                                            <p className="text-sm text-gray-600">
                                                Order ID:{' '}
                                                <span className="font-bold text-black">
                                                    #{order.order_number}
                                                </span>
                                            </p>
                                            <span
                                                className={`rounded-sm px-3 py-1 font-[Alumni_Sans] text-xs font-bold uppercase ${statusClass(order.status)}`}
                                            >
                                                {order.status_label}
                                            </span>
                                        </div>
                                        <h3 className="mb-2 font-[Alumni_Sans] text-xl font-bold">
                                            {firstItem?.title ?? 'Product'}
                                        </h3>
                                        <p className="mb-4 max-w-lg font-[Libre_Franklin] text-sm leading-relaxed text-gray-600">
                                            Placed on{' '}
                                            {formatDate(order.created_at)}.{' '}
                                            {order.items_count} item(s) in this
                                            order.
                                        </p>
                                        <p className="mb-6 font-[Libre_Franklin] text-xl font-bold">
                                            {formatMoney(order.grand_total)}
                                        </p>
                                        <div className="flex flex-wrap gap-3">
                                            <Link
                                                href={route(
                                                    'order.show',
                                                    order.id,
                                                )}
                                                className="rounded-sm border border-red-200 px-6 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
                                            >
                                                View Details
                                            </Link>
                                            {reviewItem ? (
                                                <Link
                                                    href={route(
                                                        'order.review.create',
                                                        {
                                                            order: order.id,
                                                            item: reviewItem.id,
                                                        },
                                                    )}
                                                    className="rounded-sm bg-red-600 px-6 py-2 font-[Libre_Franklin] text-sm text-white transition-colors hover:bg-red-700"
                                                >
                                                    Write A Review
                                                </Link>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}

                    {orders.links.length > 3 ? (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                            {orders.links.map((link, idx) => {
                                const label = link.label
                                    .replace('&laquo; Previous', 'Previous')
                                    .replace('Next &raquo;', 'Next');

                                if (!link.url) {
                                    return (
                                        <span
                                            key={`disabled-${idx}`}
                                            className="rounded-sm border border-gray-200 px-3 py-1 text-sm text-gray-400"
                                            dangerouslySetInnerHTML={{
                                                __html: label,
                                            }}
                                        />
                                    );
                                }

                                return (
                                    <Link
                                        key={`${label}-${idx}`}
                                        href={link.url}
                                        className={`rounded-sm border px-3 py-1 text-sm transition-colors ${
                                            link.active
                                                ? 'border-red-600 bg-red-600 text-white'
                                                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: label,
                                        }}
                                    />
                                );
                            })}
                        </div>
                    ) : null}
                </div>
            </section>
        </FrontendLayout>
    );
}
