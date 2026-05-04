import { home } from '@/routes';
import { Link, router } from '@inertiajs/react';
import { Instagram } from 'lucide-react';

const links = [
    {
        label: 'Men',
        href: home({ query: { type: 'men' } }),
    },
    {
        label: 'Women',
        href: home({ query: { type: 'women' } }),
    },
    {
        label: 'Accessories',
        href: home({ query: { type: 'accessories' } }),
    },
];
export function FrontendFooter() {
    return (
        <section className="relative z-10 overflow-x-hidden bg-[var(--bg-animation)] font-sans text-gray-900">
            <footer className="bg-[var(--sidebar)] px-6 py-12 text-[var(--bg-black)]">
                <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-5">
                    <div className="flex flex-col items-center space-y-6 md:items-start">
                        <div className="text-center md:text-left">
                            <img src="/assets/images/Layer_1.png" alt="logo" />
                        </div>

                        <div className="flex space-x-2">
                            <a
                                target="_blank"
                                href="https://www.tiktok.com/@aces.in.da.hole?_r=1&_t=ZP-964uvVCe2HP"
                                className="flex h-10 w-10 items-center justify-center rounded bg-[var(--bg-violet)] transition-colors"
                            >
                                <svg
                                    role="img"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="currentColor"
                                >
                                    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.9-.32-1.98-.23-2.81.31-.75.42-1.24 1.17-1.35 2.01-.11 1.25.7 2.45 1.9 2.78.33.09.68.1 1.02.1 1.12-.03 2.22-.61 2.81-1.55.39-.55.59-1.24.62-1.92V.02z" />
                                </svg>
                            </a>
                            <a
                                target="_blank"
                                href="https://www.instagram.com/aces_in_da_hole"
                                className="flex h-10 w-10 items-center justify-center rounded bg-[var(--bg-violet)] transition-colors"
                            >
                                <Instagram className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-3">
                        {links.map((link) => (
                            <Link
                                href={link.href}
                                className="text-gray-100 underline-offset-4"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>

                    <div className="flex flex-col space-y-3">
                        <a
                            href="#"
                            onClick={() => router.visit('/shippings')}
                            className="text-gray-100 underline-offset-4 hover:underline"
                        >
                            Shipping & returns
                        </a>
                        <a
                            href="#"
                            onClick={() => router.visit('/privacy-policy')}
                            className="text-gray-100 underline-offset-4 hover:underline"
                        >
                            Privacy policy
                        </a>
                        <a
                            href="#"
                            onClick={() =>
                                router.visit('/terms-and-conditions')
                            }
                            className="text-gray-100 underline-offset-4 hover:underline"
                        >
                            Terms & conditions
                        </a>
                    </div>

                    <div className="flex flex-col space-y-3">
                        <h3 className="font-['Alumni_Sans'] text-2xl font-semibold text-gray-100">
                            Join for Exclusive Offers + Updates
                        </h3>
                        <p className="font-['Libre_Franklin'] text-xs text-gray-100">
                            Be the first to know about drops, special offers,
                            and news from Aces in Da Hole.
                        </p>
                        <form className="flex flex-row">
                            <div className="gap-4 space-y-2">
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    className="flex-1 rounded border border-gray-400 bg-transparent px-6 py-2 text-sm text-gray-100 placeholder-gray-100 focus:ring-1 focus:outline-none"
                                />

                                <button className="rounded-md bg-[var(--bg-red)] px-6 py-3 font-medium text-white transition-colors">
                                    Subscribe & Get Updates
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Column 4: Logo */}
                    <div className="mt-8 flex justify-center space-y-3 md:mt-0 md:justify-end">
                        <img
                            src="/assets/images/footer-logo-preview.png"
                            alt="logo"
                            className="max-h-24 max-w-36"
                        />
                    </div>
                </div>
            </footer>
        </section>
    );
}
