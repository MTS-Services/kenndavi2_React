import * as React from 'react';
import { type ReactNode } from 'react';

import { Toaster } from "@/components/ui/sonner"
import { UserFooter } from '@/layouts/partials/user/footer';
import { UserHeader } from '@/layouts/partials/user/header';
import { type BreadcrumbItem } from '@/types';

interface UserLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
    showProfileMenu?: boolean;
}

export default function UserLayout({ children, showProfileMenu = true }: UserLayoutProps) {

    return (
        <div className="flex min-h-screen flex-col bg-sidebar">

            <div
                className="relative flex min-h-screen flex-col"
                style={{
                    backgroundImage: 'url("/assets/images/bg.png")',
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    backgroundAttachment: 'fixed',
                }}
            >
                <div className="absolute inset-0 bg-sidebar/70" />
                <UserHeader showProfileMenu={showProfileMenu} />
                <main className="flex-1">{children}</main>
                <UserFooter />
                <Toaster position="top-right" richColors />

            </div>
        </div>
    );
}
