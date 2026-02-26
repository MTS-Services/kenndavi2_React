import AppLogo from '@/components/app-logo';
import { Link, usePage } from '@inertiajs/react';
import { ChevronDown, ChevronRight, Menu, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Head, router } from '@inertiajs/react';
// Navigation configuration
const navigationItems = [
    { name: 'Men', href: '/' },
    { name: 'Women', href: '/women' },
    { name: 'Accessories', href: '/accessories' }
     
];

export function FrontendHeader() {
    return (
    
    <section className="bg-[#FDF7F7] font-sans text-gray-900 overflow-x-hidden">

    
    <nav className="container mx-auto mt-10 relative z-50 flex items-center justify-between bg-[#f4eded] px-6 py-5 md:px-12">
  
        <div className="flex items-center gap-2">
            <img src="/assets/images/Layer_1.png" alt="Logo" className="h-10 w-auto" />
        </div>

        <ul className="hidden md:flex space-x-10 text-sm font-semibold tracking-wider font-['Libre_Franklin']">
            {navigationItems.map((item) => (
                <li key={item.name}>
                    <a href={item.href} className={item.href === '/' ? 'text-red-600' : 'hover:text-red-600 transition'}>
                        {item.name}
                    </a>
                </li>
            ))}
        </ul>

        <div className="flex items-center gap-3 md:gap-6">
            <div className="relative hidden sm:flex items-center gap-2 rounded bg-black px-4 py-2.5">
            <i className="fa-solid fa-magnifying-glass text-xs text-gray-400"></i>
            <input type="text" placeholder="Search" className="w-20 md:w-32 bg-transparent text-xs text-white outline-none placeholder:text-gray-500" />
            </div>
            
            <button className="text-lg"><i className="fa-solid fa-cart-shopping"></i></button>
            <button className="text-lg"><i className="fa-regular fa-circle-user"></i></button>
            
            <button className="md:hidden text-2xl" onClick={() => document.getElementById('mobile-menu')?.classList.toggle('hidden')}>
            <i className="fa-solid fa-bars"></i>
            </button>
        </div>

        <div id="mobile-menu" className="absolute left-0 top-full hidden w-full bg-[#f4eded] border-t border-gray-200 p-6 md:hidden">
            <ul className="flex flex-col space-y-4 text-sm font-semibold uppercase tracking-wider font-['Libre_Franklin']">
            {navigationItems.map((item) => (
                <li key={item.name}>
                    <a href={item.href} className={item.href === '/' ? 'block text-red-600' : 'block'}>
                        {item.name}
                    </a>
                </li>
            ))}
            <li className="pt-4 border-t border-gray-300">
                <div className="flex items-center gap-2 rounded bg-black px-4 py-2">
                <i className="fa-solid fa-magnifying-glass text-xs text-gray-400"></i>
                <input type="text" placeholder="Search" className="w-full bg-transparent text-xs text-white outline-none" />
                </div>
            </li>
            </ul>
        </div>
    </nav>

    </section>

    );
}
