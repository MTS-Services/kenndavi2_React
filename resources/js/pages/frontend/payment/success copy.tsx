import { Head, Link } from '@inertiajs/react';
import { CheckCircle2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import FrontendLayout from '@/layouts/frontend-layout';
import { home } from '@/routes';
import { index as cartIndex } from '@/routes/cart';

interface PaymentSuccessProps {
    orderNumber: string;
    paymentGateway: 'stripe' | 'paypal';
    success: boolean;
    message: string;
}

export default function PaymentSuccess({
    orderNumber,
    paymentGateway,
    success,
    message,
}: PaymentSuccessProps) {
    return (
        <FrontendLayout>
            <Head title={success ? 'Payment successful' : 'Payment status'} />

            <section className="container mx-auto max-w-3xl p-4 py-10">
                <div className="rounded-sm bg-[var(--bg-gray0)] p-6 md:p-8">
                    <div className="flex items-start gap-3">
                        <CheckCircle2 className="mt-0.5 h-6 w-6 text-green-600" />
                        <div className="flex-1">
                            <h1 className="font-[Alumni_Sans] text-2xl font-bold">
                                {success ? 'Payment successful' : 'Payment status'}
                            </h1>
                            <p className="mt-1 text-sm text-gray-600">
                                Order{' '}
                                <span className="font-medium">{orderNumber}</span> •{' '}
                                <span className="font-medium">
                                    {paymentGateway.toUpperCase()}
                                </span>
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
                        <Button asChild className="cursor-pointer">
                            <Link href={cartIndex().url}>Go to cart</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}

