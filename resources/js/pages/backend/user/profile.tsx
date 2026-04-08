import { Head, Link } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import FrontendLayout from '@/layouts/frontend-layout';

interface ProfileData {
    first_name: string | null;
    last_name: string | null;
    email: string;
    phone: string | null;
}

interface AddressData {
    state: string | null;
    city: string | null;
    zip_code: string | null;
    address_line: string | null;
}

export default function Profile({
    profile,
    address,
}: {
    profile: ProfileData;
    address: AddressData;
}) {
    return (
        <FrontendLayout>
            <Head title="Profile" />

            <section className="py-8 md:py-12">
                <div className="container mx-auto max-w-5xl space-y-4 px-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h1 className="text-2xl font-semibold">My Profile</h1>
                        <Button asChild size="sm">
                            <Link href={route('user.settings.index')}>Settings</Link>
                        </Button>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <Card className="bg-[var(--bg-gray0)]">
                            <CardHeader className="flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-base">Personal information</CardTitle>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={route('user.profile.edit')}>Edit</Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <p>
                                    <span className="text-muted-foreground">First name:</span>{' '}
                                    {profile.first_name || '—'}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Last name:</span>{' '}
                                    {profile.last_name || '—'}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Email:</span>{' '}
                                    {profile.email || '—'}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Phone:</span>{' '}
                                    {profile.phone || '—'}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="bg-[var(--bg-gray0)]">
                            <CardHeader className="flex-row items-center justify-between space-y-0">
                                <CardTitle className="text-base">Address</CardTitle>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={route('user.address.edit')}>Edit</Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <p>
                                    <span className="text-muted-foreground">State:</span>{' '}
                                    {address.state || '—'}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">City:</span>{' '}
                                    {address.city || '—'}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Zip:</span>{' '}
                                    {address.zip_code || '—'}
                                </p>
                                <p>
                                    <span className="text-muted-foreground">Address:</span>{' '}
                                    {address.address_line || '—'}
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>
        </FrontendLayout>
    );
}
