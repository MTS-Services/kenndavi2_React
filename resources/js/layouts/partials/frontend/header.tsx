import { Link, router, usePage } from '@inertiajs/react';
import { Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useState } from 'react';

const navigationItems = [
    //   { name: 'Home', href: '/' },
    { name: 'Men', href: '/' },
    { name: 'Women', href: '/home-women' },
    { name: 'Accessories', href: '/accessories' },
];

export function FrontendHeader() {
    const { url } = usePage();
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <section className="overflow-x-hidden font-sans text-gray-900 relative z-10">
            <nav className="relative z-50 container mx-auto mt-10 flex items-center justify-between bg-bg-red backdrop-blur-md px-6 py-5 md:px-12 border-b border-white/10">
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
                        <li key={item.name}>
                            <Link
                                href={item.href}
                                className={`transition hover:text-white ${url === item.href ? 'text-white font-bold' : 'text-gray-900'
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
