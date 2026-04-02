import { Link, router, usePage } from '@inertiajs/react';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useState } from 'react';
import { logout, login } from '@/routes';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { type SharedData } from '@/types';

const navigationItems = [
    //   { name: 'Home', href: '/' },
    { name: 'Men', href: '/men' },
    { name: 'Women', href: '/women' },
    { name: 'Accessories', href: '/accessories' },
];

type NavSubItem = {
    label: string;
    href?: string;
    indent?: boolean;
    isHeader?: boolean;
};

const menSubcategories: NavSubItem[] = [
    { label: 'New Arrivals', href: '/sweatsuitsmen' },
    { label: 'Sweats/Hoodies', href: '/sweatsuitsmen' },
    // Client requested nested subcategories under Casuals.
    { label: 'Casuals', isHeader: true },
    { label: 'Polos', href: '/hoodies-women', indent: true },
    { label: 'Shirts', href: '/hoodies-women', indent: true },
    { label: 'Shorts', href: '/hoodies-women', indent: true },
];

const womenSubcategories: NavSubItem[] = [
    { label: 'New Arrivals', href: '/hoodies-women' },
    { label: 'Sweats/Hoodies', href: '/hoodies-women' },
    // Client requested nested subcategories under Casuals.
    { label: 'Casuals', isHeader: true },
    { label: 'Polos', href: '/hoodies-women', indent: true },
    { label: 'Shirts', href: '/hoodies-women', indent: true },
    { label: 'Shorts', href: '/hoodies-women', indent: true },
];

function DesktopDropdownNavItem({
    label,
    href,
    isActive,
    subItems,
}: {
    label: string;
    href: string;
    isActive: boolean;
    subItems?: NavSubItem[];
}) {
    return (
        <li className="group relative">
            <Link
                href={href}
                className={`transition hover:text-white ${
                    isActive ? 'font-bold text-white' : 'text-gray-900'
                }`}
            >
                {label}
            </Link>

            {subItems && (
                <div className="absolute top-full left-0 z-9999 mt-3 w-56 overflow-visible rounded-md border border-white/10 bg-black/95 opacity-0 backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100">
                    <ul className="py-2">
                        {subItems.map((sub, idx) => (
                            <li key={`${sub.label}-${idx}`}>
                                {sub.isHeader ? (
                                    <span className="block px-4 py-2 text-xs tracking-wide text-gray-400 uppercase">
                                        {sub.label}
                                    </span>
                                ) : (
                                    <Link
                                        href={sub.href as string}
                                        className={`block py-2 text-sm text-gray-100 transition hover:bg-white/10 ${
                                            sub.indent
                                                ? 'pr-4 pl-8'
                                                : 'px-4'
                                        }`}
                                    >
                                        {sub.label}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </li>
    );
}

export function FrontendHeader() {
    const { url, props } = usePage<SharedData>();
    const [mobileOpen, setMobileOpen] = useState(false);
    const user = props?.auth?.user ?? null;
    const logoutRoute = logout();
    const logoutHref = (() => {
        const route = logoutRoute as unknown as {
            url?: string | (() => string);
        };

        if (typeof route === 'string') {
            return route;
        }

        if (typeof route.url === 'function') {
            return route.url();
        }

        return route.url ?? '';
    })();

    return (
        <section className="relative z-1000 overflow-visible font-sans text-gray-900">
            <nav className="relative z-1000 container mx-auto mt-10 flex items-center justify-between border-b border-white/10 bg-bg-red px-6 py-5 backdrop-blur-md md:px-12">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <Link href="/">
                        <img
                            src="/assets/images/Layer_1 (3).png"
                            alt="Logo"
                            className="h-10 w-auto"
                        />
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <ul className="text-md hidden space-x-10 font-[Libre_Franklin] font-semibold tracking-wider md:flex">
                    {navigationItems.map((item) => {
                        const subItems =
                            item.name === 'Men'
                                ? menSubcategories
                                : item.name === 'Women'
                                  ? womenSubcategories
                                  : undefined;

                        return (
                            <DesktopDropdownNavItem
                                key={item.name}
                                label={item.name}
                                href={item.href}
                                isActive={url === item.href}
                                subItems={subItems}
                            />
                        );
                    })}
                </ul>

                {/* Right Side Icons */}
                <div className="flex items-center gap-3 md:gap-6">
                    {/* Search */}
                    <div className="relative hidden items-center gap-2 rounded bg-gray-900 px-4 py-2.5 sm:flex">
                        <Search size={14} className="text-gray-100" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-20 bg-transparent text-xs text-white outline-none placeholder:text-gray-100 md:w-32"
                        />
                    </div>

                    {/* Cart */}
                    <button
                        onClick={() => router.get('/cartpage')}
                        className="text-lg text-gray-900 transition hover:text-white"
                    >
                        <ShoppingCart size={20} />
                    </button>

                    {/* User */}
                    {user ? (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    className="text-lg text-gray-900 transition hover:text-white"
                                    aria-label="Open user menu"
                                >
                                    <User size={20} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                className="w-56"
                                align="end"
                                sideOffset={8}
                            >
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user.name}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href="/profile"
                                        className="cursor-pointer"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Profile
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link
                                        href={logoutHref}
                                        method="post"
                                        as="button"
                                        className="w-full cursor-pointer"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Log out
                                    </Link>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    ) : (
                        <Link
                            href={login()}
                            className="text-lg text-gray-900 transition hover:text-white"
                            aria-label="Login"
                            onClick={() => setMobileOpen(false)}
                        >
                            <User size={20} />
                        </Link>
                    )}

                    {/* Mobile Toggle */}
                    <button
                        className="text-2xl md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileOpen && (
                    <div className="absolute top-full left-0 w-full border-t border-white/10 bg-black/90 p-6 backdrop-blur-md md:hidden">
                        <ul className="flex flex-col space-y-4 text-sm font-semibold tracking-wider uppercase">
                            {navigationItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`block ${
                                            url === item.href
                                                ? 'font-bold text-white'
                                                : 'text-gray-300'
                                        }`}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.name}
                                    </Link>

                                    {item.name === 'Men' && (
                                        <div className="mt-3 space-y-2 pl-4 uppercase">
                                            {menSubcategories.map((sub, idx) =>
                                                sub.isHeader ? (
                                                    <span
                                                        key={`${sub.label}-${idx}`}
                                                        className="block text-xs text-gray-400"
                                                    >
                                                        {sub.label}
                                                    </span>
                                                ) : (
                                                    <Link
                                                        key={`${sub.label}-${idx}`}
                                                        href={
                                                            sub.href as string
                                                        }
                                                        onClick={() =>
                                                            setMobileOpen(false)
                                                        }
                                                        className={`block text-xs text-gray-200 transition hover:text-white ${sub.indent ? 'pl-4' : ''}`}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                ),
                                            )}
                                        </div>
                                    )}

                                    {item.name === 'Women' && (
                                        <div className="mt-3 space-y-2 pl-4 uppercase">
                                            {womenSubcategories.map(
                                                (sub, idx) =>
                                                    sub.isHeader ? (
                                                        <span
                                                            key={`${sub.label}-${idx}`}
                                                            className="block text-xs text-gray-400"
                                                        >
                                                            {sub.label}
                                                        </span>
                                                    ) : (
                                                        <Link
                                                            key={`${sub.label}-${idx}`}
                                                            href={
                                                                sub.href as string
                                                            }
                                                            onClick={() =>
                                                                setMobileOpen(
                                                                    false,
                                                                )
                                                            }
                                                            className={`block text-xs text-gray-200 transition hover:text-white ${sub.indent ? 'pl-4' : ''}`}
                                                        >
                                                            {sub.label}
                                                        </Link>
                                                    ),
                                            )}
                                        </div>
                                    )}
                                </li>
                            ))}

                            <li className="border-t border-white/10 pt-4">
                                {user ? (
                                    <div className="space-y-3">
                                        <div className="text-left normal-case">
                                            <div className="text-sm font-semibold text-white">
                                                {user.name}
                                            </div>
                                            <div className="text-xs text-gray-300">
                                                {user.email}
                                            </div>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <Link
                                                href="/profile"
                                                className="text-sm text-gray-200 transition hover:text-white"
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href={logoutHref}
                                                method="post"
                                                as="button"
                                                className="text-left text-sm text-gray-200 transition hover:text-white"
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                            >
                                                Log out
                                            </Link>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="block text-sm text-gray-200 transition hover:text-white"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Login
                                    </Link>
                                )}
                            </li>

                            {/* Mobile Search */}
                            <li className="border-t border-white/10 pt-4">
                                <div className="flex items-center gap-2 rounded bg-white/10 px-4 py-2">
                                    <Search
                                        size={14}
                                        className="text-gray-400"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Search"
                                        className="w-full bg-transparent text-xs text-white outline-none placeholder:text-gray-400"
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
