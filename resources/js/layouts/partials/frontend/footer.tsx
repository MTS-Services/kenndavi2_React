import { home } from '@/routes';
import { Link, router } from '@inertiajs/react';
import { FacebookIcon, Instagram } from 'lucide-react';

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
                                href="https://www.facebook.com"
                                className="flex h-10 w-10 items-center justify-center rounded bg-[var(--bg-violet)] transition-colors"
                            >
                                <FacebookIcon className="h-5 w-5" />
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
                    <div className="flex justify-center md:justify-end mt-8 md:mt-0 space-y-3">
                        <img
                            src="/assets/images/footer-logo-preview.png"
                            alt="logo"
                            className="max-w-36 max-h-24"
                        />
                    </div>
                </div>
            </footer>
        </section>
    );
}
