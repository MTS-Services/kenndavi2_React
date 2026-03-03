import { Head } from '@inertiajs/react';
import UserLayout from '@/layouts/user-layout';

export default function UserHome() {
    return (
        <UserLayout>
            <Head title="Dashboard" />
            <div className="flex flex-col items-center justify-center py-24 gap-4">
                <h1 className="text-3xl font-semibold text-gray-900">Welcome to your dashboard</h1>
                <p className="text-gray-600 max-w-md text-center">
                    Your customer dashboard will appear here. You&apos;ll be able to see your orders,
                    profile details, and other information in this area.
                </p>
            </div>
        </UserLayout>
    );
}

