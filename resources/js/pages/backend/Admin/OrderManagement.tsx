import { router, usePage } from '@inertiajs/react';
import { useMemo, useState } from 'react';

import { OrderStatusFilter, type OrderStatus } from '@/components/backend/OrderStatusFilter';
import AdminLayout from '@/layouts/admin-layout';

interface OrderRow {
    id: string;
    orderId: string;
    buyer: string;
    product: string;
    amount: string;
    shipping: string;
    date: string;
    status: OrderStatus;
}

function statusLabel(s: OrderStatus): string {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

function statusBadgeClass(s: OrderStatus): string {
    const base = 'text-[10px] px-2 py-1 rounded font-medium';
    switch (s) {
        case 'pending': return `${base} bg-amber-100 text-amber-800`;
        case 'shipped': return `${base} bg-blue-100 text-blue-800`;
        case 'delivered': return `${base} bg-green-100 text-green-800`;
        case 'cancelled': return `${base} bg-gray-100 text-gray-700`;
        default: return base;
    }
}

// Example data: in a real app this would come from page props (e.g. props.orders)
const INITIAL_ORDERS: OrderRow[] = [
    { id: '1', orderId: '#SLR980131-9N', buyer: 'Jerome Bell', product: 'Hoodie', amount: '$120', shipping: 'Standard', date: '9/4/26', status: 'pending' },
    { id: '2', orderId: '#SLR980131-9N', buyer: 'Jerome Bell', product: 'Hoodie', amount: '$120', shipping: 'Standard', date: '9/4/26', status: 'pending' },
    { id: '3', orderId: '#SLR980131-9N', buyer: 'Jerome Bell', product: 'Hoodie', amount: '$120', shipping: 'Standard', date: '9/4/26', status: 'pending' },
    { id: '4', orderId: '#SLR980131-9N', buyer: 'Jerome Bell', product: 'Hoodie', amount: '$120', shipping: 'Standard', date: '9/4/26', status: 'pending' },
    { id: '5', orderId: '#SLR980131-9N', buyer: 'Jerome Bell', product: 'Hoodie', amount: '$120', shipping: 'Standard', date: '9/4/26', status: 'pending' },
    { id: '6', orderId: '#SLR980132-1A', buyer: 'Jane Doe', product: 'Sweatsuit', amount: '$90', shipping: 'Express', date: '9/3/26', status: 'shipped' },
    { id: '7', orderId: '#SLR980132-1A', buyer: 'Jane Doe', product: 'Sweatsuit', amount: '$90', shipping: 'Express', date: '9/3/26', status: 'shipped' },
    { id: '8', orderId: '#SLR980132-1A', buyer: 'Jane Doe', product: 'Sweatsuit', amount: '$90', shipping: 'Express', date: '9/3/26', status: 'shipped' },
    { id: '9', orderId: '#SLR980132-1A', buyer: 'Jane Doe', product: 'Sweatsuit', amount: '$90', shipping: 'Express', date: '9/3/26', status: 'shipped' },
    { id: '10', orderId: '#SLR980132-1A', buyer: 'Jane Doe', product: 'Sweatsuit', amount: '$90', shipping: 'Express', date: '9/3/26', status: 'shipped' },
    { id: '11', orderId: '#SLR980133-2B', buyer: 'John Smith', product: 'T-Shirt', amount: '$35', shipping: 'Standard', date: '9/2/26', status: 'delivered' },
    { id: '12', orderId: '#SLR980133-2B', buyer: 'John Smith', product: 'T-Shirt', amount: '$35', shipping: 'Standard', date: '9/2/26', status: 'delivered' },
    { id: '13', orderId: '#SLR980133-2B', buyer: 'John Smith', product: 'T-Shirt', amount: '$35', shipping: 'Standard', date: '9/2/26', status: 'delivered' },
    { id: '14', orderId: '#SLR980133-2B', buyer: 'John Smith', product: 'T-Shirt', amount: '$35', shipping: 'Standard', date: '9/2/26', status: 'delivered' },
    { id: '15', orderId: '#SLR980133-2B', buyer: 'John Smith', product: 'T-Shirt', amount: '$35', shipping: 'Standard', date: '9/2/26', status: 'delivered' },
    { id: '16', orderId: '#SLR980134-3C', buyer: 'Alice Brown', product: 'Hoodie', amount: '$120', shipping: 'Standard', date: '9/1/26', status: 'cancelled' },
    { id: '17', orderId: '#SLR980134-3C', buyer: 'Alice Brown', product: 'Hoodie', amount: '$120', shipping: 'Standard', date: '9/1/26', status: 'cancelled' },
    { id: '18', orderId: '#SLR980134-3C', buyer: 'Alice Brown', product: 'Hoodie', amount: '$120', shipping: 'Standard', date: '9/1/26', status: 'cancelled' },
    { id: '19', orderId: '#SLR980134-3C', buyer: 'Alice Brown', product: 'Hoodie', amount: '$120', shipping: 'Standard', date: '9/1/26', status: 'cancelled' },
    { id: '20', orderId: '#SLR980134-3C', buyer: 'Alice Brown', product: 'Hoodie', amount: '$120', shipping: 'Standard', date: '9/1/26', status: 'cancelled' },
];

const VALID_TABS: OrderStatus[] = ['pending', 'shipped', 'delivered', 'cancelled'];

export default function OrderManagement() {
    const { props } = usePage<{ initialTab?: string }>();
    const initialTab = props.initialTab && VALID_TABS.includes(props.initialTab as OrderStatus)
        ? (props.initialTab as OrderStatus)
        : 'pending';

    const [orders, setOrders] = useState<OrderRow[]>(INITIAL_ORDERS);
    const [statusFilter, setStatusFilter] = useState<OrderStatus>(initialTab);

    const countByStatus = useMemo(() => {
        const counts: Record<OrderStatus, number> = {
            pending: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0,
        };
        orders.forEach((o) => {
            counts[o.status]++;
        });
        return counts;
    }, [orders]);

    const filteredOrders = useMemo(
        () => orders.filter((o) => o.status === statusFilter),
        [orders, statusFilter]
    );

    function markAsShipped(orderId: string) {
        setOrders((prev) =>
            prev.map((o) => (o.id === orderId ? { ...o, status: 'shipped' as OrderStatus } : o))
        );
        setStatusFilter('shipped');
    }

    return (
        <AdminLayout
            title="Order Management"
            description="Track, manage, and process all customer orders effectively."
        >
            <div className="bg-[var(--bg-animation)] p-4 md:p-8 font-sans text-slate-700 rounded-lg shadow-sm">
                <OrderStatusFilter
                    activeFilter={statusFilter}
                    onFilterChange={setStatusFilter}
                    countByStatus={countByStatus}
                />

                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-4">
                        <thead>
                            <tr className="text-lg font-semibold text-gray-900 uppercase tracking-wider font-[Alumni_Sans]">
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
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors shadow-sm rounded-lg bg-white">
                                    <td className="px-4 py-4 font-medium">{order.orderId}</td>
                                    <td className="px-4 py-4 text-gray-600">{order.buyer}</td>
                                    <td className="px-4 py-4 text-gray-600">{order.product}</td>
                                    <td className="px-4 py-4 font-semibold text-gray-900">{order.amount}</td>
                                    <td className="px-4 py-4 text-gray-600">{order.shipping}</td>
                                    <td className="px-4 py-4 text-gray-600">{order.date}</td>
                                    <td className="px-4 py-4">
                                        <span className={statusBadgeClass(order.status)}>
                                            {statusLabel(order.status)}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 text-right space-x-2">
                                        {order.status === 'pending' && (
                                            <button
                                                type="button"
                                                onClick={() => markAsShipped(order.id)}
                                                className="bg-[var(--bg-red)] text-white px-4 py-2 rounded text-xs font-medium hover:bg-red-800 transition-colors"
                                            >
                                                Mark As Shipped
                                            </button>
                                        )}
                                        <button
                                            type="button"
                                            onClick={() => router.get(route('admin.orders.details'))}
                                            className="border border-red-700 text-red-700 px-4 py-2 rounded text-xs font-medium hover:bg-red-50 transition-colors"
                                        >
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="md:hidden space-y-4">
                    {filteredOrders.map((order) => (
                        <div key={order.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <p className="text-xs text-gray-500 font-semibold">{order.orderId}</p>
                                    <h4 className="font-bold text-gray-900">{order.buyer}</h4>
                                </div>
                                <span className="font-bold text-gray-900">{order.amount}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">Product</p>
                                    <p className="text-gray-600">{order.product}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">Date</p>
                                    <p className="text-gray-600">{order.date}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 uppercase">Status</p>
                                    <span className={statusBadgeClass(order.status)}>
                                        {statusLabel(order.status)}
                                    </span>
                                </div>
                            </div>
                            <div className="flex flex-col space-y-2">
                                {order.status === 'pending' && (
                                    <button
                                        type="button"
                                        onClick={() => markAsShipped(order.id)}
                                        className="w-full bg-red-700 text-white py-2 rounded text-xs font-medium"
                                    >
                                        Mark As Shipped
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={() => router.get(route('admin.orders.details'))}
                                    className="w-full border border-red-700 text-red-700 py-2 rounded text-xs font-medium"
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {filteredOrders.length === 0 && (
                    <p className="text-center text-gray-500 py-8">No orders in this category.</p>
                )}

                <div className="flex flex-col md:flex-row items-center justify-between mt-8 gap-4">
                    <span className="text-xs text-gray-500 order-2 md:order-1">
                        Showing {filteredOrders.length} of {filteredOrders.length} entries
                    </span>
                    <nav className="flex space-x-1 order-1 md:order-2">
                        <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 transition">
                            &lt;
                        </button>
                        <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-700 text-white font-semibold">
                            1
                        </button>
                        <button type="button" className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium">
                            &gt;
                        </button>
                    </nav>
                </div>
            </div>
        </AdminLayout>
    );
}
