import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FrontendLayout from '@/layouts/frontend-layout';

interface AddressData {
    state: string | null;
    city: string | null;
    zip_code: string | null;
    address_line: string | null;
}

export default function AddressForm({ address }: { address: AddressData }) {
    const { data, setData, post, processing, errors } = useForm({
        state: address.state ?? '',
        city: address.city ?? '',
        zip_code: address.zip_code ?? '',
        address_line: address.address_line ?? '',
    });

    return (
        <FrontendLayout>
            <Head title="Edit Address" />
            <section className="py-8 md:py-12">
                <div className="container mx-auto max-w-3xl px-4">
                    <div className="rounded-sm bg-(--bg-gray0) p-6 shadow-sm md:p-10">
                        <h1 className="mb-8 text-xl font-semibold">
                            Edit address
                        </h1>
                        <form
                            className="space-y-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                post(route('user.address.update'));
                            }}
                        >
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="state">Region/State</Label>
                                    <Input
                                        id="state"
                                        value={data.state}
                                        className="rounded border border-[#110304B8] focus:ring-1 focus:ring-red-800 focus:outline-none"
                                        onChange={(e) =>
                                            setData('state', e.target.value)
                                        }
                                    />
                                    {errors.state ? (
                                        <p className="text-xs text-red-600">
                                            {errors.state}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={data.city}
                                        className="rounded border border-[#110304B8] focus:ring-1 focus:ring-red-800 focus:outline-none"
                                        onChange={(e) =>
                                            setData('city', e.target.value)
                                        }
                                    />
                                    {errors.city ? (
                                        <p className="text-xs text-red-600">
                                            {errors.city}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="zip_code">Zip code</Label>
                                    <Input
                                        id="zip_code"
                                        value={data.zip_code}
                                        className="rounded border border-[#110304B8] focus:ring-1 focus:ring-red-800 focus:outline-none"
                                        onChange={(e) =>
                                            setData('zip_code', e.target.value)
                                        }
                                    />
                                    {errors.zip_code ? (
                                        <p className="text-xs text-red-600">
                                            {errors.zip_code}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address_line">Address</Label>
                                <Input
                                    id="address_line"
                                    value={data.address_line}
                                    className="rounded border border-[#110304B8] focus:ring-1 focus:ring-red-800 focus:outline-none"
                                    onChange={(e) =>
                                        setData('address_line', e.target.value)
                                    }
                                />
                                {errors.address_line ? (
                                    <p className="text-xs text-red-600">
                                        {errors.address_line}
                                    </p>
                                ) : null}
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button asChild type="button" variant="outline">
                                    <Link href={route('user.profile.index')}>
                                        Cancel
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save address'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
