import { Head, router, useForm } from '@inertiajs/react';
import { useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import FrontendLayout from '@/layouts/frontend-layout';
import { cn } from '@/lib/utils';

type Gateway = {
    slug: string;
    name: string;
};

interface GatewayPageProps {
    orderNumber: string;
    gateways: Gateway[];
    grandTotal: number;
}

export default function GatewaySelect({
    orderNumber,
    gateways,
    grandTotal,
}: GatewayPageProps) {
    const defaultGateway = useMemo(() => gateways.at(0)?.slug ?? '', [gateways]);

    const { data, setData, post, processing } = useForm({
        order_number: orderNumber,
        gateway: defaultGateway,
    });

    return (
        <FrontendLayout>
            <Head title="Select payment method" />

            <section className="container mx-auto max-w-4xl p-4 py-10">
                <div className="rounded-sm bg-[var(--bg-gray0)] p-6 md:p-8">
                    <div className="flex flex-col gap-2">
                        <h1 className="font-[Alumni_Sans] text-2xl font-bold">
                            Select payment method
                        </h1>
                        <p className="text-sm text-gray-600">
                            Order <span className="font-medium">{orderNumber}</span> •
                            Total{' '}
                            <span className="font-medium">
                                ${grandTotal.toFixed(2)}
                            </span>
                        </p>
                    </div>

                    <div className="mt-6 grid gap-3">
                        {gateways.map((g) => {
                            const selected = data.gateway === g.slug;
                            return (
                                <button
                                    key={g.slug}
                                    type="button"
                                    onClick={() => setData('gateway', g.slug)}
                                    className={cn(
                                        'flex w-full cursor-pointer items-center justify-between rounded border p-4 text-left transition-colors',
                                        selected
                                            ? 'border-red-800 bg-white'
                                            : 'border-gray-200 bg-white hover:border-gray-300',
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={cn(
                                                'h-4 w-4 rounded-full border',
                                                selected
                                                    ? 'border-red-800 bg-red-800'
                                                    : 'border-gray-300 bg-white',
                                            )}
                                            aria-hidden="true"
                                        />
                                        <div className="flex flex-col">
                                            <Label className="font-medium">
                                                {g.name}
                                            </Label>
                                            <span className="text-xs text-gray-500">
                                                {g.slug}
                                            </span>
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Button
                            type="button"
                            className="cursor-pointer"
                            disabled={!data.gateway || processing}
                            onClick={() => {
                                post('/checkout/start', {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                        // start endpoint redirects away
                                    },
                                });
                            }}
                        >
                            Continue to payment
                        </Button>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}

