import { Link, usePage } from '@inertiajs/react';
import { Menu } from 'lucide-react';

import AppLogo from '@/components/app-logo';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { type SharedData } from '@/types';


export function AdminHeader() {
    const { auth } = usePage<SharedData>().props;

    return (
        <header className='bg-primary-50'>
            <div className='container mx-auto flex items-center justify-between py-4 px-4  text-primary-500'>
                <Link href="#" className='flex text-primary-500  items-center gap-2'>
                    <AppLogo className="h-16 w-auto" />
                </Link>
                <div className='hidden md:flex items-center gap-4'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="flex items-center gap-2 h-auto p-2 hover:bg-transparent hover:scale-105 transition-transform focus-visible:ring-0 focus-visible:ring-offset-0">
                                <UserInfo user={auth.user} />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 p-2 shadow-sm border-none" align="end" sideOffset={8}>
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                    {/* <Link
                        className="flex gap-1 items-center w-full cursor-pointer font-open-sans"
                        href={logout()}
                        as="button"
                        onClick={handleLogout}
                        data-test="logout-button"
                    >
                        <LogOut />
                        Sign Out
                    </Link> */}
                </div>
                <div className='md:hidden'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-9 w-9 rounded-md ring-offset-background transition-all hover:ring-2 hover:ring-ring">
                                <Menu className="size-6" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-64 p-2 shadow-sm border-none" align="end" sideOffset={8}>
                            <UserMenuContent user={auth.user} />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
}
