import { Head, Link, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import FrontendLayout from '@/layouts/frontend-layout';

interface ProfileData {
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone: string | null;
}

export default function ProfileForm({ profile }: { profile: ProfileData }) {
    const { data, setData, post, processing, errors } = useForm({
        first_name: profile.first_name ?? '',
        last_name: profile.last_name ?? '',
        email: profile.email ?? '',
        phone: profile.phone ?? '',
    });

    return (
        <FrontendLayout>
            <Head title="Edit Profile" />
            <section className="py-8 md:py-12">
                <div className="container mx-auto max-w-3xl px-4">
                    <div className="rounded-sm bg-(--bg-gray0) p-6 shadow-sm md:p-10">
                        <h1 className="mb-8 text-xl font-semibold">
                            Edit profile
                        </h1>
                        <form
                            className="space-y-6"
                            onSubmit={(e) => {
                                e.preventDefault();
                                post(route('user.profile.update'));
                            }}
                        >
                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="first_name">
                                        First name
                                    </Label>
                                    <Input
                                        id="first_name"
                                        value={data.first_name}
                                        className="rounded border border-[#110304B8] focus:ring-1 focus:ring-red-800 focus:outline-none"
                                        onChange={(e) =>
                                            setData(
                                                'first_name',
                                                e.target.value,
                                            )
                                        }
                                    />
                                    {errors.first_name ? (
                                        <p className="text-xs text-red-600">
                                            {errors.first_name}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="last_name">Last name</Label>
                                    <Input
                                        id="last_name"
                                        value={data.last_name}
                                        className="rounded border border-[#110304B8] focus:ring-1 focus:ring-red-800 focus:outline-none"
                                        onChange={(e) =>
                                            setData('last_name', e.target.value)
                                        }
                                    />
                                    {errors.last_name ? (
                                        <p className="text-xs text-red-600">
                                            {errors.last_name}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="rounded border border-[#110304B8] focus:ring-1 focus:ring-red-800 focus:outline-none"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData('email', e.target.value)
                                        }
                                    />
                                    {errors.email ? (
                                        <p className="text-xs text-red-600">
                                            {errors.email}
                                        </p>
                                    ) : null}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="phone">Phone</Label>
                                    <Input
                                        id="phone"
                                        value={data.phone}
                                        className="rounded border border-[#110304B8] focus:ring-1 focus:ring-red-800 focus:outline-none"
                                        onChange={(e) =>
                                            setData('phone', e.target.value)
                                        }
                                    />
                                    {errors.phone ? (
                                        <p className="text-xs text-red-600">
                                            {errors.phone}
                                        </p>
                                    ) : null}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-2">
                                <Button asChild type="button" variant="outline">
                                    <Link href={route('user.profile.index')}>
                                        Cancel
                                    </Link>
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save changes'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
