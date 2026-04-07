import { Link, usePage } from '@inertiajs/react';

import AdminLayout from '@/layouts/admin-layout';
import { index as ordersIndex } from '@/routes/admin/orders';

interface OrderItemRow {
    id: number;
    title: string;
    color: string;
    size: string;
    quantity: number;
    quantityLabel: string;
    unitPrice: string;
    image: string;
}

interface SidebarLine {
    title: string;
    quantity: number;
    unitPrice: string;
    image: string;
}

interface OrderShowPageProps {
    order: {
        id: number;
        orderNumber: string;
        status: string;
        statusLabel: string;
        customer: {
            name: string;
            email: string;
            phone: string;
            location: string;
            avatar: string;
        };
        items: OrderItemRow[];
        sidebarItems: SidebarLine[];
        subtotal: string;
        shipping: string;
        total: string;
        backTab: string;
    };
    [key: string]: unknown;
}

export default function OrderShowPage() {
    const { order } = usePage<OrderShowPageProps>().props;

    return (
        <AdminLayout
            title="Order details"
            description="View a detailed summary of this customer order."
        >
            <div className="p-4 font-sans text-gray-800 md:p-8">
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="space-y-6 lg:col-span-2">
                        <div className="rounded-md bg-[var(--bg-grayslight0)] p-8 shadow-sm">
                            <div className="mb-6 flex flex-wrap items-center justify-between gap-2">
                                <h2 className="font-[Alumni_Sans] text-xl font-bold">
                                    Customer info
                                </h2>
                                <span className="text-xs font-medium text-gray-500">
                                    {order.statusLabel}
                                </span>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                <div className="flex flex-col">
                                    <p className="mb-4 text-sm text-gray-400">
                                        Customer
                                    </p>
                                    <div className="flex items-center space-x-2">
                                        <div className="h-8 w-8 overflow-hidden rounded bg-gray-200">
                                            <img
                                                src={order.customer.avatar}
                                                alt=""
                                                className="h-full w-full object-cover"
                                            />
                                        </div>
                                        <p className="text-[9px] font-medium text-nowrap">
                                            {order.customer.name}
                                        </p>
                                    </div>
                                </div>
                                <div>
                                    <p className="mb-4 text-sm text-gray-400">
                                        Phone
                                    </p>
                                    <p className="text-[9px] font-medium text-nowrap">
                                        {order.customer.phone || '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-4 text-sm text-gray-400">
                                        Email
                                    </p>
                                    <p className="text-[9px] font-medium break-all">
                                        {order.customer.email || '—'}
                                    </p>
                                </div>
                                <div>
                                    <p className="mb-4 text-sm text-gray-400">
                                        Location
                                    </p>
                                    <p className="text-[9px] font-medium text-nowrap">
                                        {order.customer.location || '—'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-md bg-[var(--bg-grayslight0)] p-8 shadow-sm">
                            <h2 className="mb-10 font-[Alumni_Sans] text-xl font-bold">
                                Orders summary
                            </h2>
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead>
                                        <tr className="text-[12px] text-gray-900">
                                            <th className="pb-8 font-normal">
                                                Products
                                            </th>
                                            <th className="pb-8 font-normal">
                                                Color
                                            </th>
                                            <th className="pb-8 font-normal">
                                                Size
                                            </th>
                                            <th className="pb-8 font-normal">
                                                Quantity
                                            </th>
                                            <th className="pb-8 font-normal">
                                                Price
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="text-[12px] font-bold">
                                        {order.items.map((item) => (
                                            <tr key={item.id}>
                                                <td className="flex items-center space-x-4 py-6">
                                                    <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100">
                                                        <img
                                                            src={item.image}
                                                            alt=""
                                                            className="max-h-full max-w-full object-contain"
                                                        />
                                                    </div>
                                                    <span>{item.title}</span>
                                                </td>
                                                <td className="py-6 text-gray-700">
                                                    {item.color}
                                                </td>
                                                <td className="py-6 text-gray-700">
                                                    {item.size}
                                                </td>
                                                <td className="py-6 text-gray-700">
                                                    {item.quantityLabel}
                                                </td>
                                                <td className="py-6 text-gray-700">
                                                    {item.unitPrice}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="flex h-full flex-col rounded-md bg-[var(--bg-grayslight0)] p-8 shadow-sm">
                            <h2 className="mb-10 font-[Alumni_Sans] text-xl font-bold">
                                Order summary
                            </h2>
                            <div className="flex-grow space-y-8 px-2">
                                {order.sidebarItems.map((line, idx) => (
                                    <div
                                        key={`${line.title}-${idx}`}
                                        className="flex items-center space-x-4 text-[12px] font-bold"
                                    >
                                        <div className="h-12 w-12 rounded bg-gray-100">
                                            <img
                                                src={line.image}
                                                alt=""
                                                className="h-full w-full rounded object-cover"
                                            />
                                        </div>
                                        <div>
                                            <p className="mb-1 font-[Alumni_Sans] lg:text-[12px]">
                                                {line.title}
                                            </p>
                                            <p className="font-medium text-gray-500">
                                                {line.quantity} x{' '}
                                                <span className="font-bold text-gray-900">
                                                    {line.unitPrice}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-8 space-y-4 border-t border-gray-300 pt-6">
                                <div className="flex justify-between text-[12px] font-medium text-gray-500">
                                    <span>Sub-total</span>
                                    <span className="font-bold text-black">
                                        {order.subtotal}
                                    </span>
                                </div>
                                <div className="flex justify-between text-[12px] font-medium text-gray-500">
                                    <span>Shipping</span>
                                    <span className="font-bold text-black">
                                        {order.shipping}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 text-[12px] font-bold text-black">
                                    <span>Total</span>
                                    <span>{order.total}</span>
                                </div>
                            </div>

                            <div className="mt-10">
                                <Link
                                    href={ordersIndex.url({
                                        query: { tab: order.backTab },
                                    })}
                                    className="block w-full rounded-md border border-[var(--bg-red)] py-3 text-center text-[12px] font-medium text-[var(--bg-red)] transition-colors hover:bg-red-50"
                                >
                                    Back
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
