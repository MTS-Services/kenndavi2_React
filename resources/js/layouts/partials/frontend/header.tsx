import { Link, router, usePage } from '@inertiajs/react';
import { Menu, X, Search, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
    { name: 'Men', href: '/' },
    { name: 'Women', href: '/home-women' },
    { name: 'Accessories', href: '/accessories' }, 
];

export function FrontendHeader() {
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

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
                    <button onClick={() => router.get('/userlogin')} className="text-lg hover:text-red-600 transition">
                        <User size={20} />
                    </button>

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