import { Head, useForm } from '@inertiajs/react';
import { Star } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import FrontendLayout from '@/layouts/frontend-layout';

interface ReviewOrder {
    id: number;
    order_number: string;
}

interface ReviewItem {
    id: number;
    title: string;
    sku: string | null;
    image_url: string;
    quantity: number;
    color: string | null;
    size: string | null;
}

interface ReviewFormPageProps {
    order: ReviewOrder;
    item: ReviewItem;
}

export default function ReviewForm({ order, item }: ReviewFormPageProps) {
    const { data, setData, post, errors, processing } = useForm({
        rating: 0,
        title: '',
        comment: '',
    });

    const submit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        post(
            route('order.review.store', {
                order: order.id,
                item: item.id,
            }),
        );
    };

    return (
        <FrontendLayout>
            <Head title={`Review ${item.title}`} />

            <section className="py-8 md:py-12">
                <div className="container mx-auto grid max-w-4xl gap-6 px-4 md:grid-cols-3">
                    <Card className="md:col-span-1 h-fit sticky top-4">
                        <CardHeader>
                            <CardTitle className="text-base">Product</CardTitle>
                            <CardDescription>Order #{order.order_number}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3 text-sm">
                            <img
                                src={item.image_url}
                                alt={item.title}
                                className="h-40 w-full rounded-md object-cover"
                            />
                            <p className="font-medium">{item.title}</p>
                            <p className="text-muted-foreground">SKU: {item.sku ?? '—'}</p>
                            <p className="text-muted-foreground">
                                Qty: {item.quantity} • Color: {item.color ?? '—'} • Size:{' '}
                                {item.size ?? '—'}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="md:col-span-2">
                        <CardHeader>
                            <CardTitle>Write your review</CardTitle>
                            <CardDescription>
                                You can submit one review for this delivered/completed item.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label>Rating</Label>
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setData('rating', value)}
                                                className="cursor-pointer p-1"
                                            >
                                                <Star
                                                    className={
                                                        data.rating >= value
                                                            ? 'h-6 w-6 fill-yellow-400 text-yellow-400'
                                                            : 'h-6 w-6 text-muted-foreground'
                                                    }
                                                />
                                            </button>
                                        ))}
                                    </div>
                                    {errors.rating ? (
                                        <p className="text-sm text-destructive">{errors.rating}</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="title">Title (optional)</Label>
                                    <Input
                                        id="title"
                                        value={data.title}
                                        onChange={(event) =>
                                            setData('title', event.target.value)
                                        }
                                        placeholder="Short review title"
                                    />
                                    {errors.title ? (
                                        <p className="text-sm text-destructive">{errors.title}</p>
                                    ) : null}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="comment">Comment</Label>
                                    <Textarea
                                        id="comment"
                                        value={data.comment}
                                        onChange={(event) =>
                                            setData('comment', event.target.value)
                                        }
                                        rows={6}
                                        placeholder="Tell other customers about your experience."
                                    />
                                    {errors.comment ? (
                                        <p className="text-sm text-destructive">{errors.comment}</p>
                                    ) : null}
                                </div>

                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Submitting...' : 'Submit Review'}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </FrontendLayout>
    );
}
