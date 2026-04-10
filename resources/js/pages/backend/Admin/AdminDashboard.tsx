import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from '@/components/ui/chart';
import AdminLayout from '@/layouts/admin-layout';
import { dashboard } from '@/routes/admin';
import { show as ordersShow } from '@/routes/admin/orders';
import { router } from '@inertiajs/react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Label,
    Pie,
    PieChart,
    XAxis,
} from 'recharts';

type RangeType = 'week' | 'month';

interface DashboardStats {
    total_orders: number;
    cancel_orders: number;
    total_revenue: number;
    total_review: number;
}

interface StatsTrend {
    total_orders: number;
    cancel_orders: number;
    total_revenue: number;
    total_review: number;
}

interface SalesOverviewRow {
    label: string;
    sold_qty: number;
    sold_amount: number;
}

interface AvgSalesRow {
    type: string;
    total_units: number;
    total_sales_amount: number;
    avg_sale_per_unit: number;
}

interface RecentOrderRow {
    id: number;
    order_number: string;
    buyer_name: string;
    total_amount: number;
    quantity: number;
    status: string;
    is_paid: boolean;
}

interface AdminDashboardProps {
    range: RangeType;
    stats: DashboardStats;
    statsTrend: StatsTrend;
    salesOverview: SalesOverviewRow[];
    avgSalesByType: AvgSalesRow[];
    recentOrders: RecentOrderRow[];
}

const barChartConfig = {
    sold_amount: {
        label: 'Sold amount',
        color: 'var(--chart-2)',
    },
} satisfies ChartConfig;

const avgPieChartConfig = {
    total_units: {
        label: 'Units sold',
    },
} satisfies ChartConfig;

const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
});

function formatTrend(value: number): string {
    if (value === 0) {
        return '0.00%';
    }
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(2)}%`;
}

function trendClass(value: number): string {
    if (value > 0) {
        return 'text-emerald-600';
    }
    if (value < 0) {
        return 'text-red-500';
    }
    return 'text-gray-500';
}

function capitalize(text: string): string {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

export default function AdminDashboard({
    range,
    stats,
    statsTrend,
    salesOverview,
    avgSalesByType,
    recentOrders,
}: AdminDashboardProps) {
    const previousLabel = range === 'week' ? 'previous week' : 'previous month';

    const statCards = [
        {
            label: 'Total orders',
            value: stats.total_orders.toLocaleString(),
            trend: statsTrend.total_orders,
        },
        {
            label: 'Cancel orders',
            value: stats.cancel_orders.toLocaleString(),
            trend: statsTrend.cancel_orders,
        },
        {
            label: 'Total revenue',
            value: currency.format(stats.total_revenue),
            trend: statsTrend.total_revenue,
        },
        {
            label: 'Total review',
            value: stats.total_review.toLocaleString(),
            trend: statsTrend.total_review,
        },
    ];

    const pieColors = ['#dc2626', '#2dd4bf', '#4b5563', '#f59e0b', '#7c3aed'];
    const avgPieData = avgSalesByType.map((item, index) => ({
        ...item,
        fill: pieColors[index % pieColors.length],
    }));
    const totalAvgUnits = avgSalesByType.reduce(
        (sum, item) => sum + item.total_units,
        0,
    );

    function onChangeRange(nextRange: RangeType): void {
        if (nextRange === range) {
            return;
        }

        router.get(
            dashboard.url({ query: { range: nextRange } }),
            {},
            { preserveState: true, preserveScroll: true, replace: true },
        );
    }

    return (
        <AdminLayout
            title="Dashboard"
            description="Welcome to your admin dashboard."
        >
            <div className="mb-6 grid grid-cols-12 gap-6">
                <div className="col-span-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-5">
                    {statCards.map((card) => (
                        <div
                            key={card.label}
                            className="rounded-lg border border-gray-100 bg-bg-animation p-5 shadow-sm"
                        >
                            <div className="mb-3 text-sm text-gray-900">
                                {card.label}
                            </div>
                            <h3 className="mb-4 font-[Alumni_Sans] text-3xl font-bold text-gray-900">
                                {card.value}
                            </h3>
                            <div className="flex items-center justify-between text-xs">
                                <span className="text-gray-600">
                                    Vs {previousLabel}
                                </span>
                                <span
                                    className={`font-[Alumni_Sans] font-bold ${trendClass(card.trend)}`}
                                >
                                    {formatTrend(card.trend)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="col-span-12 rounded-lg border border-gray-100 bg-bg-animation p-6 shadow-sm lg:col-span-7">
                    <div className="mb-1 flex items-center justify-between">
                        <h3 className="font-[Alumni_Sans] text-lg font-bold">
                            Sales overview
                        </h3>
                        <div className="flex space-x-2">
                            <button
                                type="button"
                                onClick={() => onChangeRange('week')}
                                className={`rounded px-4 py-1 text-xs transition ${
                                    range === 'week'
                                        ? 'bg-bg-red text-white'
                                        : 'border border-red-100 text-red-600'
                                }`}
                            >
                                Weekly
                            </button>
                            <button
                                type="button"
                                onClick={() => onChangeRange('month')}
                                className={`rounded px-4 py-1 text-xs transition ${
                                    range === 'month'
                                        ? 'bg-bg-red text-white'
                                        : 'border border-red-100 text-red-600'
                                }`}
                            >
                                Monthly
                            </button>
                        </div>
                    </div>
                    <p className="mb-6 text-xs text-gray-700">
                        Top sold products by amount for this {range}.
                    </p>

                    {salesOverview.length > 0 ? (
                        <ChartContainer
                            config={barChartConfig}
                            className="aspect-auto h-[250px] w-full"
                        >
                            <BarChart
                                accessibilityLayer
                                data={salesOverview}
                                margin={{ left: 12, right: 12 }}
                            >
                                <CartesianGrid vertical={false} />
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tickMargin={8}
                                    interval={0}
                                    tickFormatter={(value: string) =>
                                        value.length > 10
                                            ? `${value.slice(0, 10)}...`
                                            : value
                                    }
                                />
                                <ChartTooltip
                                    content={
                                        <ChartTooltipContent
                                            formatter={(value, _name, item) => {
                                                const amount = currency.format(
                                                    Number(value),
                                                );
                                                const qty =
                                                    item.payload.sold_qty;
                                                const product =
                                                    item.payload.label;

                                                return [
                                                    `${amount} | Qty: ${qty} pcs`,
                                                    `Product: ${product}`,
                                                ];
                                            }}
                                        />
                                    }
                                />
                                <Bar
                                    dataKey="sold_amount"
                                    fill="var(--color-sold_amount)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ChartContainer>
                    ) : (
                        <div className="flex h-[250px] items-center justify-center rounded border border-dashed border-gray-200 text-sm text-gray-500">
                            No sales data found for this {range}.
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12 rounded-lg border border-gray-100 bg-bg-animation p-4 shadow-sm md:p-6 lg:col-span-8">
                    <h3 className="mb-6 font-[Alumni_Sans] text-lg font-bold">
                        Recent order
                    </h3>
                    <div className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
                        <table className="w-full min-w-[500px] text-left text-sm">
                            <thead className="border-b border-gray-100 text-gray-900">
                                <tr>
                                    <th className="pb-3 font-[Alumni_Sans] font-semibold">
                                        Order ID
                                    </th>
                                    <th className="pb-3 font-[Alumni_Sans] font-semibold">
                                        Buyer name
                                    </th>
                                    <th className="pb-3 font-[Alumni_Sans] font-semibold">
                                        Total Amount
                                    </th>
                                    <th className="pb-3 font-[Alumni_Sans] font-semibold">
                                        Quantity
                                    </th>
                                    <th className="pb-3 font-[Alumni_Sans] font-semibold">
                                        Status
                                    </th>
                                    <th className="pb-3 font-[Alumni_Sans] font-semibold">
                                        Is Paid
                                    </th>
                                    <th className="pb-3 text-right font-[Alumni_Sans] font-semibold">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {recentOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td className="py-4 font-medium whitespace-nowrap text-gray-600">
                                            {order.order_number}
                                        </td>
                                        <td className="py-4 whitespace-nowrap">
                                            {order.buyer_name}
                                        </td>
                                        <td className="py-4">
                                            {currency.format(
                                                order.total_amount,
                                            )}
                                        </td>
                                        <td className="py-4">
                                            {order.quantity}pc
                                        </td>
                                        <td className="py-4">
                                            {capitalize(order.status)}
                                        </td>
                                        <td className="py-4">
                                            {order.is_paid ? 'Yes' : 'No'}
                                        </td>
                                        <td className="py-4 text-right">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    router.get(
                                                        ordersShow.url(
                                                            order.id,
                                                        ),
                                                    )
                                                }
                                                className="rounded bg-bg-red px-3 py-1.5 text-xs text-white transition-colors hover:bg-red-700"
                                            >
                                                View Details
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {recentOrders.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            No recent orders available.
                        </p>
                    ) : null}
                </div>

                <div className="col-span-12 rounded-lg border border-gray-100 bg-bg-animation p-4 shadow-sm md:p-6 lg:col-span-4">
                    <h3 className="mb-1 font-[Alumni_Sans] text-lg font-bold">
                        Avg sales
                    </h3>
                    <p className="mb-6 text-xs text-gray-700">
                        Average selling price per unit by product type for this{' '}
                        {range}.
                    </p>

                    {avgPieData.length > 0 ? (
                        <>
                            <div className="h-full w-full">
                                <ChartContainer
                                    config={avgPieChartConfig}
                                    className="mx-auto aspect-square max-h-[240px]"
                                >
                                    <PieChart>
                                        <ChartTooltip
                                            cursor={false}
                                            content={
                                                <ChartTooltipContent
                                                    formatter={(
                                                        _,
                                                        __,
                                                        item,
                                                    ) => [
                                                        `${item.payload.total_units} pcs | Avg ${currency.format(item.payload.avg_sale_per_unit)} | ${currency.format(item.payload.total_sales_amount)}`,
                                                        item.payload.type,
                                                    ]}
                                                />
                                            }
                                        />
                                        <Pie
                                            data={avgPieData}
                                            dataKey="total_units"
                                            nameKey="type"
                                            innerRadius={62}
                                            strokeWidth={5}
                                        >
                                            {avgPieData.map((entry) => (
                                                <Cell
                                                    key={entry.type}
                                                    fill={entry.fill}
                                                />
                                            ))}
                                            <Label
                                                content={({ viewBox }) => {
                                                    if (
                                                        viewBox &&
                                                        'cx' in viewBox &&
                                                        'cy' in viewBox
                                                    ) {
                                                        return (
                                                            <text
                                                                x={viewBox.cx}
                                                                y={viewBox.cy}
                                                                textAnchor="middle"
                                                                dominantBaseline="middle"
                                                            >
                                                                <tspan
                                                                    x={
                                                                        viewBox.cx
                                                                    }
                                                                    y={
                                                                        viewBox.cy
                                                                    }
                                                                    className="fill-foreground text-2xl font-bold"
                                                                >
                                                                    {totalAvgUnits.toLocaleString()}
                                                                </tspan>
                                                                <tspan
                                                                    x={
                                                                        viewBox.cx
                                                                    }
                                                                    y={
                                                                        (viewBox.cy ||
                                                                            0) +
                                                                        20
                                                                    }
                                                                    className="fill-muted-foreground text-[10px]"
                                                                >
                                                                    TOTAL
                                                                </tspan>
                                                            </text>
                                                        );
                                                    }
                                                    return null;
                                                }}
                                            />
                                        </Pie>
                                    </PieChart>
                                </ChartContainer>
                                <div className="grid grid-cols-1 gap-y-2 text-[11px] sm:grid-cols-2">
                                    {avgPieData.map((item) => (
                                        <div
                                            key={item.type}
                                            className="flex items-center gap-2"
                                        >
                                            <span
                                                className="h-3 w-3 rounded-sm"
                                                style={{
                                                    backgroundColor: item.fill,
                                                }}
                                            />
                                            <span className="text-gray-600">
                                                {item.type}: {item.total_units}{' '}
                                                pcs
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </>
                    ) : null}

                    {avgSalesByType.length === 0 ? (
                        <p className="mt-4 text-sm text-gray-500">
                            No average sales data available for this {range}.
                        </p>
                    ) : null}
                </div>
            </div>
        </AdminLayout>
    );
}
