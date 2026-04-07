<?php

namespace App\Http\Controllers\Backend\Admin;

use App\Enums\OrderPaymentStatus;
use App\Enums\OrderStatus;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\FinalizeShippedOrderRequest;
use App\Http\Requests\Admin\ShipOrderRequest;
use App\Models\Admin;
use App\Models\Order;
use App\Models\OrderStatusHistory;
use App\Support\AdminOrderTab;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    private const PER_PAGE = 15;

    public function index(Request $request): Response
    {
        $tabQuery = $request->query('tab') ?? $request->query('status');
        $activeTab = AdminOrderTab::normalize(is_string($tabQuery) ? $tabQuery : null);

        $statusValues = AdminOrderTab::statusValuesForTab($activeTab);

        $counts = [
            AdminOrderTab::PENDING => $this->countForTab(AdminOrderTab::PENDING),
            AdminOrderTab::SHIPPED => $this->countForTab(AdminOrderTab::SHIPPED),
            AdminOrderTab::DELIVERED => $this->countForTab(AdminOrderTab::DELIVERED),
            AdminOrderTab::CANCELLED => $this->countForTab(AdminOrderTab::CANCELLED),
        ];

        $orders = Order::query()
            ->whereIn('status', $statusValues)
            ->with([
                'user:id,first_name,last_name,email',
                'shippingAddress',
                'items:id,order_id,product_title,quantity',
            ])
            ->orderByDesc('created_at')
            ->paginate(self::PER_PAGE)
            ->appends(['tab' => $activeTab])
            ->through(fn (Order $order) => $this->formatOrderListRow($order));

        return Inertia::render('backend/Admin/order/index', [
            'orders' => $orders,
            'counts' => $counts,
            'activeTab' => $activeTab,
            'success' => $request->session()->get('success'),
        ]);
    }

    public function show(Order $order): Response
    {
        $order->load(['user', 'shippingAddress', 'items']);

        return Inertia::render('backend/Admin/order/show', [
            'order' => $this->formatOrderDetail($order),
        ]);
    }

    public function ship(ShipOrderRequest $request, Order $order): RedirectResponse
    {
        if (! $this->orderCanBeMarkedShipped($order)) {
            throw ValidationException::withMessages([
                'order' => [__('This order cannot be marked as shipped.')],
            ]);
        }

        $admin = $request->user('admin');
        if (! $admin instanceof Admin) {
            abort(403);
        }

        DB::transaction(function () use ($order, $admin, $request): void {
            /** @var Order $locked */
            $locked = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();

            $from = $locked->status instanceof OrderStatus ? $locked->status->value : (string) $locked->status;

            $locked->update([
                'status' => OrderStatus::SHIPPED->value,
            ]);

            OrderStatusHistory::query()->create([
                'order_id' => $locked->id,
                'changer_id' => $admin->id,
                'changer_type' => Admin::class,
                'from_status' => $from,
                'to_status' => OrderStatus::SHIPPED->value,
                'note' => $request->validated('note'),
            ]);
        });

        return redirect()
            ->route('admin.orders.index', ['tab' => AdminOrderTab::SHIPPED])
            ->with('success', __('Order marked as shipped.'));
    }

    public function deliver(FinalizeShippedOrderRequest $request, Order $order): RedirectResponse
    {
        return $this->transitionFromShipped(
            $request,
            $order,
            OrderStatus::DELIVERED,
            __('Order marked as delivered.'),
        );
    }

    private function countForTab(string $tab): int
    {
        return Order::query()
            ->whereIn('status', AdminOrderTab::statusValuesForTab($tab))
            ->count();
    }

    /**
     * @return array<string, mixed>
     */
    private function formatOrderListRow(Order $order): array
    {
        $status = $order->status instanceof OrderStatus
            ? $order->status
            : OrderStatus::tryFrom((string) $order->status) ?? OrderStatus::PENDING;

        $buyer = $this->resolveBuyerName($order);
        $productSummary = $this->resolveProductSummary($order);

        return [
            'id' => $order->id,
            'orderId' => '#'.$order->order_number,
            'buyer' => $buyer,
            'product' => $productSummary,
            'amount' => $this->formatMoney((float) $order->grand_total),
            'shipping' => $this->formatShippingLabel($order),
            'date' => $order->created_at?->format('n/j/y') ?? '',
            'status' => AdminOrderTab::uiBucketForStatus($status),
            'can_mark_shipped' => $this->orderCanBeMarkedShipped($order),
            'can_mark_delivered' => $this->orderCanBeMarkedDeliveredOrCompleted($order),
            'can_mark_completed' => $this->orderCanBeMarkedDeliveredOrCompleted($order),
        ];
    }

    /**
     * @return array<string, mixed>
     */
    private function formatOrderDetail(Order $order): array
    {
        $status = $order->status instanceof OrderStatus
            ? $order->status
            : OrderStatus::tryFrom((string) $order->status) ?? OrderStatus::PENDING;

        $address = $order->shippingAddress;
        $user = $order->user;

        $customerName = $address
            ? trim(implode(' ', array_filter([$address->first_name, $address->last_name])))
            : '';
        if ($customerName === '' && $user) {
            $customerName = trim(implode(' ', array_filter([$user->first_name, $user->last_name])));
        }
        if ($customerName === '') {
            $customerName = __('Guest');
        }

        $email = $address?->email ?? $user?->email ?? '';
        $phone = $address?->phone ?? $user?->phone ?? '';
        $location = $address
            ? trim(implode(', ', array_filter([
                $address->address,
                $address->city,
                $address->state,
                $address->zip_code,
            ])))
            : '';

        $avatar = '/assets/images/Rectangle 25.png';

        $items = $order->items->map(fn ($item) => [
            'id' => $item->id,
            'title' => $item->product_title ?? __('Product'),
            'color' => $item->color_name ?? '—',
            'size' => $item->size_name ?? '—',
            'quantity' => $item->quantity,
            'quantityLabel' => $item->quantity.'pc',
            'unitPrice' => $this->formatMoney((float) $item->unit_price),
            'image' => $item->image_url ?: '/assets/images/Rectangle 25.png',
        ])->values()->all();

        $sidebarItems = $order->items->map(fn ($item) => [
            'title' => $item->product_title ?? __('Product'),
            'quantity' => $item->quantity,
            'unitPrice' => $this->formatMoney((float) $item->unit_price),
            'image' => $item->image_url ?: '/assets/images/Rectangle 28.png',
        ])->values()->all();

        return [
            'id' => $order->id,
            'orderNumber' => $order->order_number,
            'status' => $status->value,
            'statusLabel' => $status->label(),
            'customer' => [
                'name' => $customerName,
                'email' => $email,
                'phone' => $phone,
                'location' => $location,
                'avatar' => $avatar,
            ],
            'items' => $items,
            'sidebarItems' => $sidebarItems,
            'subtotal' => $this->formatMoney((float) $order->subtotal),
            'shipping' => $this->formatMoney((float) $order->shipping_cost),
            'total' => $this->formatMoney((float) $order->grand_total),
            'backTab' => AdminOrderTab::uiBucketForStatus($status),
        ];
    }

    private function orderCanBeMarkedShipped(Order $order): bool
    {
        $payment = $order->payment_status instanceof OrderPaymentStatus
            ? $order->payment_status
            : OrderPaymentStatus::tryFrom((string) $order->payment_status);

        if ($payment !== OrderPaymentStatus::PAID) {
            return false;
        }

        $status = $order->status instanceof OrderStatus
            ? $order->status
            : OrderStatus::tryFrom((string) $order->status);

        if ($status === null) {
            return false;
        }

        return in_array($status, [
            OrderStatus::CONFIRMED,
            OrderStatus::PROCESSING,
            OrderStatus::PENDING,
        ], true);
    }

    private function orderCanBeMarkedDeliveredOrCompleted(Order $order): bool
    {
        $status = $order->status instanceof OrderStatus
            ? $order->status
            : OrderStatus::tryFrom((string) $order->status);

        return $status === OrderStatus::SHIPPED;
    }

    private function transitionFromShipped(
        FinalizeShippedOrderRequest $request,
        Order $order,
        OrderStatus $toStatus,
        string $successMessage,
    ): RedirectResponse {
        if (! $this->orderCanBeMarkedDeliveredOrCompleted($order)) {
            throw ValidationException::withMessages([
                'order' => [__('This order cannot be updated from its current status.')],
            ]);
        }

        $admin = $request->user('admin');
        if (! $admin instanceof Admin) {
            abort(403);
        }

        DB::transaction(function () use ($order, $admin, $request, $toStatus): void {
            /** @var Order $locked */
            $locked = Order::query()->whereKey($order->id)->lockForUpdate()->firstOrFail();

            $current = $locked->status instanceof OrderStatus
                ? $locked->status
                : OrderStatus::tryFrom((string) $locked->status);

            if ($current !== OrderStatus::SHIPPED) {
                throw ValidationException::withMessages([
                    'order' => [__('This order cannot be updated from its current status.')],
                ]);
            }

            $from = $current->value;

            $locked->update([
                'status' => $toStatus->value,
            ]);

            OrderStatusHistory::query()->create([
                'order_id' => $locked->id,
                'changer_id' => $admin->id,
                'changer_type' => Admin::class,
                'from_status' => $from,
                'to_status' => $toStatus->value,
                'note' => $request->validated('note'),
            ]);
        });

        return redirect()
            ->route('admin.orders.index', ['tab' => AdminOrderTab::DELIVERED])
            ->with('success', $successMessage);
    }

    private function resolveBuyerName(Order $order): string
    {
        $address = $order->shippingAddress;
        if ($address) {
            $name = trim(implode(' ', array_filter([$address->first_name, $address->last_name])));
            if ($name !== '') {
                return $name;
            }
        }

        $user = $order->user;
        if ($user) {
            $name = trim(implode(' ', array_filter([$user->first_name, $user->last_name])));
            if ($name !== '') {
                return $name;
            }

            return (string) ($user->email ?? __('Customer'));
        }

        return __('Guest');
    }

    private function resolveProductSummary(Order $order): string
    {
        $items = $order->items;
        if ($items->isEmpty()) {
            return '—';
        }

        $first = $items->first();
        $title = $first?->product_title ?? __('Product');
        if ($items->count() === 1) {
            return $title;
        }

        return $title.' +'.($items->count() - 1).' '.__('more');
    }

    private function formatShippingLabel(Order $order): string
    {
        $cost = (float) $order->shipping_cost;

        if ($cost <= 0) {
            return __('Standard');
        }

        return $this->formatMoney($cost);
    }

    private function formatMoney(float $amount): string
    {
        return '$'.number_format($amount, 2);
    }
}
