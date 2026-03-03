import * as React from 'react';
import { AdminHeader } from './partials/admin/header';
import { AdminFooter } from './partials/admin/footer';
import { Logo } from './partials/admin/logo';
import { AdminSidebar } from './partials/admin/sidebar';

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
    return (
        <>
        <div className="min-h-screen bg-[var(--bg-grayslight)] flex">
            <AdminSidebar />
            <div className="flex-1 p-4 md:p-8 h-screen overflow-y-auto">
                <AdminHeader title={title || ''} description={description || ''} />
                {children}
            </div>
            
        </div>
        {/* <AdminFooter /> */}
        </>

    );
}
