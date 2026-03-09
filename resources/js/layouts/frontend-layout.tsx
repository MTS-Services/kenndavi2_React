import * as React from 'react';

import { FrontendFooter } from '@/layouts/partials/frontend/footer';
import { FrontendHeader } from '@/layouts/partials/frontend/header';

interface FrontendLayoutProps {
    children: React.ReactNode;
}

export default function FrontendLayout({ children }: FrontendLayoutProps) {
    return (
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

            <div className="relative z-10 flex min-h-screen flex-col">
                <FrontendHeader />
                <main className="flex-1 flex flex-col">{children}</main>
                <FrontendFooter />
            </div>
        </div>
    );
}
