import { Link, router, usePage } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from 'sonner';

import {
    OrderStatusFilter,
    type OrderStatus,
} from '@/components/backend/OrderStatusFilter';
import AdminLayout from '@/layouts/admin-layout';
import {
    deliver as ordersDeliver,
    index as ordersIndex,
    ship as ordersShip,
    show as ordersShow,
} from '@/routes/admin/orders';
import type { SharedData } from '@/types';

type FlashToast = { type: 'success' | 'error' | string; message: string };

const TOAST_ID = 'admin-orders-toast';

interface OrderRow {
    id: number;
    orderId: string;
    buyer: string;
    product: string;
    amount: string;
    shipping: string;
    date: string;
    status: OrderStatus;
    can_mark_shipped: boolean;
    can_mark_delivered: boolean;
}

interface PaginatorLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginatedOrders {
    data: OrderRow[];
    current_page: number;
    last_page: number;
    from: number | null;
    to: number | null;
    total: number;
    links: PaginatorLink[];
}

interface OrderIndexProps {
    orders: PaginatedOrders;
    counts: Record<OrderStatus, number>;
    activeTab: OrderStatus;
    [key: string]: unknown;
}

function statusLabel(s: OrderStatus): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function statusBadgeClass(s: OrderStatus): string {
    const base = 'text-[10px] px-2 py-1 rounded font-medium';
    switch (s) {
        case 'pending':
            return `${base} bg-amber-100 text-amber-800`;
        case 'shipped':
            return `${base} bg-blue-100 text-blue-800`;
        case 'delivered':
            return `${base} bg-green-100 text-green-800`;
        case 'cancelled':
            return `${base} bg-gray-100 text-gray-700`;
        default:
            return base;
    }
}

function paginationLabel(label: string): string {
    return label
        .replace(/&laquo;/g, '‹')
        .replace(/&raquo;/g, '›')
        .replace(/&nbsp;/g, ' ');
}

export default function OrderManagement() {
    const { orders, counts, activeTab, flash } = usePage<
        SharedData & OrderIndexProps & { flash?: { toast?: FlashToast | null } }
    >().props;

    const rows = orders.data;

    useEffect(() => {
        const t = flash?.toast;
        if (!t?.message) {
            return;
        }

        const opts = { id: TOAST_ID };
        if (t.type === 'success') {
            toast.success(t.message, opts);
        } else if (t.type === 'error') {
            toast.error(t.message, opts);
        } else {
            toast.message(t.message, opts);
        }
    }, [flash?.toast]);

    function changeTab(tab: OrderStatus) {
        router.get(
            ordersIndex.url({ query: { tab } }),
            {},
            { preserveState: true, preserveScroll: true },
        );
    }

    function markAsShipped(orderId: number) {
        router.post(ordersShip.url(orderId), {}, { preserveScroll: true });
    }

    function markAsDelivered(orderId: number) {
        router.post(ordersDeliver.url(orderId), {}, { preserveScroll: true });
    }

    function viewDetails(orderId: number) {
        router.get(ordersShow.url(orderId));
    }

    const showingFrom = orders.from ?? 0;
    const showingTo = orders.to ?? 0;

    return (
        <AdminLayout
            title="Order Management"
            description="Track, manage, and process all customer orders effectively."
        >
            <div className="rounded-lg bg-[var(--bg-animation)] p-4 font-sans text-slate-700 shadow-sm md:p-8">
                <OrderStatusFilter
                    activeFilter={activeTab}
                    onFilterChange={changeTab}
                    countByStatus={counts}
                />

                <div className="hidden overflow-x-auto md:block">
                    <table className="w-full border-separate border-spacing-y-4 text-left">
                        <thead>
                            <tr className="font-[Alumni_Sans] text-lg font-semibold tracking-wider text-gray-900 uppercase">
                                <th className="px-4">Order ID</th>
                                <th className="px-4">Buyer</th>
                                <th className="px-4">Product</th>
                                <th className="px-4">Amount</th>
                                <th className="px-4">Shipping</th>
                                <th className="px-4">Date</th>
                                <th className="px-4">Status</th>
                                <th className="px-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {rows.map((order) => (
                                <tr
                                    key={order.id}
                                    className="rounded-lg bg-white shadow-sm transition-colors hover:bg-gray-50"
                                >
                                    <td className="px-4 py-4 font-medium">
                                        {order.orderId}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {order.buyer}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {order.product}
                                    </td>
                                    <td className="px-4 py-4 font-semibold text-gray-900">
                                        {order.amount}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {order.shipping}
                                    </td>
                                    <td className="px-4 py-4 text-gray-600">
                                        {order.date}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={statusBadgeClass(
                                                order.status,
                                            )}
                                        >
                                            {statusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="space-x-2 px-4 py-4 text-right">
                                        {order.can_mark_shipped ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    markAsShipped(order.id)
                                                }
                                                className="rounded bg-[var(--bg-red)] px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-800"
                                            >
                                                Mark As Shipped
                                            </button>
                                        ) : null}
                                        {order.can_mark_delivered ? (
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    markAsDelivered(order.id)
                                                }
                                                className="rounded bg-emerald-700 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-emerald-800"
                                            >
                                                Mark Delivered
                                            </button>
                                        ) : null}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                viewDetails(order.id)
                                            }
                                            className="rounded border border-red-700 px-4 py-2 text-xs font-medium text-red-700 transition-colors hover:bg-red-50"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="space-y-4 md:hidden">
                    {rows.map((order) => (
                        <div
                            key={order.id}
                            className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm"
                        >
                            <div className="mb-3 flex items-start justify-between">
                                <div>
                                    <p className="text-xs font-semibold text-gray-500">
                                        {order.orderId}
                                    </p>
                                    <h4 className="font-bold text-gray-900">
                                        {order.buyer}
                                    </h4>
                                </div>
                                <span className="font-bold text-gray-900">
                                    {order.amount}
                                </span>
                            </div>
                            <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">
                                        Product
                                    </p>
                                    <p className="text-gray-600">
                                        {order.product}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">
                                        Date
                                    </p>
                                    <p className="text-gray-600">
                                        {order.date}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">
                                        Status
                                    </p>
                                    <span
                                        className={statusBadgeClass(
                                            order.status,
                                        )}
                                    >
                                        {statusLabel(order.status)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                {order.can_mark_shipped ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            markAsShipped(order.id)
                                        }
                                        className="w-full rounded bg-red-700 py-2 text-xs font-medium text-white"
                                    >
                                        Mark As Shipped
                                    </button>
                                ) : null}
                                {order.can_mark_delivered ? (
                                    <button
                                        type="button"
                                        onClick={() =>
                                            markAsDelivered(order.id)
                                        }
                                        className="w-full rounded bg-emerald-700 py-2 text-xs font-medium text-white"
                                    >
                                        Mark Delivered
                                    </button>
                                ) : null}
                                <button
                                    type="button"
                                    onClick={() => viewDetails(order.id)}
                                    className="w-full rounded border border-red-700 py-2 text-xs font-medium text-red-700"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {rows.length === 0 ? (
                    <p className="py-8 text-center text-gray-500">
                        No orders in this category.
                    </p>
                ) : null}

                <div className="mt-8 flex flex-col items-center justify-between gap-4 md:flex-row">
                    <span className="order-2 text-xs text-gray-500 md:order-1">
                        Showing {showingFrom} to {showingTo} of {orders.total}{' '}
                        entries
                    </span>
                    <nav
                        className="order-1 flex flex-wrap justify-center gap-1 md:order-2"
                        aria-label="Pagination"
                    >
                        {orders.links.map((link, i) => {
                            const label = paginationLabel(link.label);
                            const key = `pg-${link.url ?? 'gap'}-${i}`;
                            if (link.url === null) {
                                return (
                                    <span
                                        key={key}
                                        className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm ${
                                            link.active
                                                ? 'bg-red-700 font-semibold text-white'
                                                : 'text-gray-400'
                                        }`}
                                    >
                                        {label}
                                    </span>
                                );
                            }
                            return (
                                <Link
                                    key={key}
                                    href={link.url}
                                    preserveScroll
                                    className={`flex h-8 min-w-8 items-center justify-center rounded-lg px-2 text-sm transition hover:bg-gray-200 ${
                                        link.active
                                            ? 'bg-red-700 font-semibold text-white hover:bg-red-800'
                                            : 'font-medium text-gray-700'
                                    }`}
                                >
                                    {label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </div>
        </AdminLayout>
    );
}