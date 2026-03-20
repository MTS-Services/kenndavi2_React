import { Link, router, usePage } from '@inertiajs/react';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
    //   { name: 'Home', href: '/' },
    { name: 'Men', href: '/' },
    { name: 'Women', href: '/home-women' },
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

export function FrontendHeader() {
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <section className="overflow-visible font-sans text-gray-900 relative z-[1000]">
            <nav className="relative z-[1000] container mx-auto mt-10 flex items-center justify-between bg-bg-red backdrop-blur-md px-6 py-5 md:px-12 border-b border-white/10">
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
                    {navigationItems.map((item) => (
                        <li key={item.name} className="relative group">
                            <Link
                                href={item.href}
                                className={`transition hover:text-white ${url === item.href ? 'text-white font-bold' : 'text-gray-900'
                                    }`}
                            >
                                {item.name}
                            </Link>

                            {item.name === 'Men' && (
                                <div className="absolute left-0 top-full mt-3 w-56 z-[9999] rounded-md bg-black/95 border border-white/10 backdrop-blur-md overflow-visible opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                    <ul className="py-2">
                                        {menSubcategories.map((sub, idx) => (
                                            <li key={`${sub.label}-${idx}`}>
                                                {sub.isHeader ? (
                                                    <span className="block px-4 py-2 text-xs uppercase tracking-wide text-gray-400">
                                                        {sub.label}
                                                    </span>
                                                ) : (
                                                    <Link
                                                        key={`${sub.label}-${idx}`}
                                                        href={sub.href as string}
                                                        className={`block py-2 text-sm text-gray-100 hover:bg-white/10 transition ${sub.indent ? 'pl-8 pr-4' : 'px-4'}`}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {item.name === 'Women' && (
                                <div className="absolute left-0 top-full mt-3 w-56 z-[9999] rounded-md bg-black/95 border border-white/10 backdrop-blur-md overflow-visible opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                                    <ul className="py-2">
                                        {womenSubcategories.map((sub, idx) => (
                                            <li key={`${sub.label}-${idx}`}>
                                                {sub.isHeader ? (
                                                    <span className="block px-4 py-2 text-xs uppercase tracking-wide text-gray-400">
                                                        {sub.label}
                                                    </span>
                                                ) : (
                                                    <Link
                                                        key={`${sub.label}-${idx}`}
                                                        href={sub.href as string}
                                                        className={`block py-2 text-sm text-gray-100 hover:bg-white/10 transition ${sub.indent ? 'pl-8 pr-4' : 'px-4'}`}
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
                    ))}
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
                        className="text-lg transition hover:text-white text-gray-900"
                    >
                        <ShoppingCart size={20} />
                    </button>

                    {/* User */}
                    <button
                        onClick={() => router.get('/userlogin')}
                        className="text-lg transition hover:text-white text-gray-900"
                    >
                        <User size={20} />
                    </button>

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
                    <div className="absolute top-full left-0 w-full border-t border-white/10 bg-black/90 backdrop-blur-md p-6 md:hidden">
                        <ul className="flex flex-col space-y-4 text-sm font-semibold tracking-wider uppercase">
                            {navigationItems.map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className={`block ${url === item.href
                                            ? 'text-white font-bold'
                                            : 'text-gray-300'
                                            }`}
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        {item.name}
                                    </Link>

                                    {item.name === 'Men' && (
                                        <div className="mt-3 pl-4 space-y-2 uppercase normal-case">
                                            {menSubcategories.map((sub, idx) => (
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
                                                        href={sub.href as string}
                                                        onClick={() => setMobileOpen(false)}
                                                        className={`block text-xs text-gray-200 hover:text-white transition ${sub.indent ? 'pl-4' : ''}`}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                )
                                            ))}
                                        </div>
                                    )}

                                    {item.name === 'Women' && (
                                        <div className="mt-3 pl-4 space-y-2 uppercase normal-case">
                                            {womenSubcategories.map((sub, idx) => (
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
                                                        href={sub.href as string}
                                                        onClick={() => setMobileOpen(false)}
                                                        className={`block text-xs text-gray-200 hover:text-white transition ${sub.indent ? 'pl-4' : ''}`}
                                                    >
                                                        {sub.label}
                                                    </Link>
                                                )
                                            ))}
                                        </div>
                                    )}
                                </li>
                            ))}

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
