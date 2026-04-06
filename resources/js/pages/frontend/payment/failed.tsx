import { Head, Link, router } from '@inertiajs/react';
import { XCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FrontendLayout from '@/layouts/frontend-layout';
import { home } from '@/routes';

interface PaymentFailedProps {
    orderNumber: string;
    message: string;
}

export default function PaymentFailed({ orderNumber, message }: PaymentFailedProps) {
    return (
        <FrontendLayout>
            <Head title="Payment failed" />

            <section className="container mx-auto max-w-3xl p-4 py-10">
                <div className="rounded-sm bg-[var(--bg-gray0)] p-6 md:p-8">
                    <div className="flex items-start gap-3">
                        <XCircle className="mt-0.5 h-6 w-6 text-red-700" />
                        <div className="flex-1">
                            <h1 className="font-[Alumni_Sans] text-2xl font-bold">
                                Payment not completed
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Order <span className="font-medium">{orderNumber}</span>
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 rounded border border-gray-200 bg-white p-4 text-sm">
                        {message}
                    </div>

                    <div className="mt-8 flex flex-wrap justify-end gap-3">
                        <Button asChild variant="outline" className="cursor-pointer">
                            <Link href={home().url}>Continue shopping</Link>
                        </Button>
                        <Button
                            type="button"
                            className="cursor-pointer"
                            onClick={() => {
                                router.post(`/payment/${orderNumber}/restore-cart`, undefined, {
                                    preserveScroll: true,
                                });
                            }}
                        >
                            Back to cart
                        </Button>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}

