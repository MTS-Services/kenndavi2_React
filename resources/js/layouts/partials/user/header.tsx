import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X, Search, ShoppingCart, User, LogOut, Settings } from 'lucide-react';
import { useState } from 'react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { logout } from '@/routes';

const navigationItems = [
    { name: 'Order', href: '/' },
    { name: 'Profile', href: '/profiles' },
    { name: 'Settings', href: '/settingx' }, 
];

interface UserHeaderProps {
    showProfileMenu?: boolean;
}

export function UserHeader({ showProfileMenu = true }: UserHeaderProps) {
    const { url, props } = usePage<{ auth?: { user?: { name: string; email: string; avatar_url?: string } } }>();
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = props?.auth?.user;
    const logoutRoute = logout();

    return (
        <section className="bg-[var(--color-bg-animation)] font-sans text-gray-900 overflow-x-hidden">
            <nav className="container mx-auto mt-10 relative z-50 flex items-center justify-between bg-[var(--bg-white-secondary)] px-6 py-5 md:px-12">

                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <img src="/assets/images/Layer_1.png" alt="Logo" className="h-10 w-auto" />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <ul className="hidden md:flex space-x-10 text-md font-semibold tracking-wider font-[Libre_Franklin]">
                    {navigationItems.map((item) => (
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`transition hover:text-red-600 ${
                                    url === item.href ? 'text-red-600' : ''
                                }`}
                            >
                                {item.name}
                            </Link>
                        </li>
                    ))}
                </ul>

                {/* Right Side Icons */}
                <div className="flex items-center gap-3 md:gap-6">

                    {/* Search */}
                    <div className="relative hidden sm:flex items-center gap-2 rounded bg-black px-4 py-2.5">
                        <Search size={14} className="text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-20 md:w-32 bg-transparent text-xs text-white outline-none placeholder:text-gray-500"
                        />
                    </div>

                    {/* Cart */}
                    <button className="text-lg hover:text-red-600 transition">
                        <ShoppingCart size={20} />
                    </button>

                    {/* User */}
                    {showProfileMenu && user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:text-gray-100">
                                <svg
                                    width="36"
                                    height="36"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    aria-label={user.name}
                                >
                                    <path d="M15.5 10.5C15.5 8.567 13.933 7 12 7C10.067 7 8.5 8.567 8.5 10.5C8.5 12.433 10.067 14 12 14C13.933 14 15.5 12.433 15.5 10.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M18 20C18 16.6863 15.3137 14 12 14C8.68629 14 6 16.6863 6 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/profiles" className="cursor-pointer">
                                        <User className="mr-2 h-4 w-4" />
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/settingx" className="cursor-pointer">
                                        <Settings className="mr-2 h-4 w-4" />
                                        Settings
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={logoutRoute.url}
                                        method="post"
                                        as="button"
                                        className="w-full cursor-pointer"
                                    >
                                        <LogOut className="mr-2 h-4 w-4" />
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <button className="text-lg hover:text-red-600 transition">
                            <User size={20} />
                        </button>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden text-2xl"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="absolute left-0 top-full w-full bg-[var(--bg-white-secondary)] border-t border-gray-200 p-6 md:hidden">
                        <ul className="flex flex-col space-y-4 text-sm font-semibold uppercase tracking-wider">
                            {navigationItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`block ${
                                            url === item.href ? 'text-red-600' : ''
                                        }`}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}

                            {/* Mobile Search */}
                            <li className="pt-4 border-t border-gray-300">
                                <div className="flex items-center gap-2 rounded bg-black px-4 py-2">
                                    <Search size={14} className="text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full bg-transparent text-xs text-white outline-none"
                                    />
                                </div>
                            </li>
                        </ul>
                    </div>
                )}
            </nav>
        </section>
    );
}