import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, Loader2, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useState } from 'react';

import { UserMenuContent } from '@/components/user-menu-content';
import { useLogout } from '@/hooks/use-logout';
import { cn } from '@/lib/utils';
import { home, login, logout } from '@/routes';
import { index as cartIndex } from '@/routes/cart';
import type {
    FrontendNav,
    FrontendNavByTypeEntry,
    FrontendNavCategory,
    SharedData,
} from '@/types';

function pathOnly(href: string): string {
    if (href.startsWith('http://') || href.startsWith('https://')) {
        try {
            return new URL(href).pathname;
        } catch {
            return href;
        }
    }
    return href.split('?')[0] ?? href;
}

function catalogFilterHref(
    listingHref: string,
    parentSlug: string,
    subSlug?: string,
): string {
    const params = new URLSearchParams();
    params.set('category', parentSlug);
    if (subSlug != null) {
        params.set('subcategory', subSlug);
    }
    const qs = params.toString();
    const sep = listingHref.includes('?') ? '&' : '?';
    return qs ? `${listingHref}${sep}${qs}` : listingHref;
}

function DesktopTypeNavItem({
    label,
    landingHref,
    listingHref,
    categories,
    isActive,
}: {
    label: string;
    landingHref: string;
    listingHref: string;
    categories: FrontendNavCategory[];
    isActive: boolean;
}) {
    const firstExpandableId = useMemo(
        () => categories.find((c) => c.children.length > 0)?.id ?? null,
        [categories],
    );

    const [expandedParentId, setExpandedParentId] = useState<number | null>(
        () => categories.find((c) => c.children.length > 0)?.id ?? null,
    );

    useEffect(() => {
        setExpandedParentId(firstExpandableId);
    }, [firstExpandableId]);

    const isLandingActive = isActive;
    const hasMenu = categories.length > 0;

    const toggleParent = useCallback((id: number) => {
        setExpandedParentId((prev) => (prev === id ? null : id));
    }, []);

    return (
        <li className="group relative">
            <Link
                href={landingHref}
                className={cn(
                    'transition hover:text-white',
                    isLandingActive ? 'font-bold text-white' : 'text-gray-900',
                )}
            >
                {label}
            </Link>

            {hasMenu && (
                <div
                    className={cn(
                        'absolute top-full left-0 z-9999 pt-3',
                        '-ml-2 pr-2 pl-2',
                        'pointer-events-none group-hover:pointer-events-auto',
                    )}
                >
                    <div className="max-h-[min(24rem,70vh)] w-64 overflow-y-auto rounded-md border border-white/10 bg-black/95 opacity-0 shadow-lg backdrop-blur-md transition-opacity duration-150 group-hover:opacity-100">
                        <ul className="py-2">
                            {categories.map((cat) => {
                                const open = expandedParentId === cat.id;
                                const hasChildren = cat.children.length > 0;

                                return (
                                    <li
                                        key={cat.id}
                                        className="border-b border-white/5 last:border-0"
                                    >
                                        <div className="flex items-stretch gap-0">
                                            <Link
                                                href={catalogFilterHref(
                                                    listingHref,
                                                    cat.slug,
                                                )}
                                                className="min-w-0 flex-1 px-4 py-2.5 text-sm text-gray-100 transition hover:bg-white/10"
                                            >
                                                {cat.title}
                                            </Link>
                                            {hasChildren && (
                                                <button
                                                    type="button"
                                                    aria-expanded={open}
                                                    aria-label={`Toggle ${cat.title} subcategories`}
                                                    className="shrink-0 px-2 text-gray-400 transition hover:bg-white/10 hover:text-white"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        toggleParent(cat.id);
                                                    }}
                                                >
                                                    <ChevronDown
                                                        className={cn(
                                                            'size-4 transition-transform',
                                                            open &&
                                                                'rotate-180',
                                                        )}
                                                    />
                                                </button>
                                            )}
                                        </div>
                                        {hasChildren && open && (
                                            <ul className="border-t border-white/5 bg-black/40 py-1">
                                                {cat.children.map((child) => (
                                                    <li key={child.id}>
                                                        <Link
                                                            href={catalogFilterHref(
                                                                listingHref,
                                                                cat.slug,
                                                                child.slug,
                                                            )}
                                                            className="block py-2 pr-4 pl-8 text-sm text-gray-200 transition hover:bg-white/10"
                                                        >
                                                            {child.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>
            )}
        </li>
    );
}

export function FrontendHeader() {
    const { url, props } = usePage<SharedData>();
    const mobileNavId = useId();
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileTypeOpen, setMobileTypeOpen] = useState<string | null>(null);
    const [mobileParentOpen, setMobileParentOpen] = useState<
        Record<string, boolean>
    >({});

    const user = props?.auth?.user ?? null;
    const frontendNav: FrontendNav | undefined = props?.frontendNav;

    const productTypes = useMemo(
        () => frontendNav?.productTypes ?? [],
        [frontendNav?.productTypes],
    );
    const byType = useMemo<Record<string, FrontendNavByTypeEntry>>(
        () => frontendNav?.byType ?? {},
        [frontendNav?.byType],
    );

    const logoutUrl = logout.url();
    const { loggingOut, performLogout } = useLogout(logoutUrl);

    const currentPath = useMemo(() => pathOnly(url), [url]);

    const toggleMobileParent = useCallback((key: string) => {
        setMobileParentOpen((prev) => ({ ...prev, [key]: !prev[key] }));
    }, []);

    const activeType = useMemo(() => {
        const searchParams = new URLSearchParams(
            url.includes('?') ? url.split('?')[1] : '',
        );
        const typeParam = searchParams.get('type');
        const knownTypes = new Set(productTypes.map((pt) => pt.value));
        const defaultType = productTypes[0]?.value ?? '';

        if (currentPath === '/') {
            return typeParam && knownTypes.has(typeParam)
                ? typeParam
                : defaultType;
        }

        const segment = currentPath.replace(/^\//, '').split('/')[0] ?? '';
        if (knownTypes.has(segment)) {
            return segment;
        }

        return '';
    }, [url, currentPath, productTypes]);

    const handleMobileLogout = useCallback(() => {
        setMobileOpen(false);
        performLogout();
    }, [performLogout]);

    return (
        <section className="sticky top-0 z-1000 overflow-visible font-sans text-gray-900">
            <nav
                className="relative z-1000 container mx-auto mt-4 grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 border-b border-white/10 bg-bg-red px-4 py-4 backdrop-blur-md md:mt-10 md:grid-cols-[auto_minmax(0,1fr)_auto] md:gap-y-0 md:px-12 md:py-5"
                aria-label="Main navigation"
            >
                <div className="flex min-w-0 shrink-0 items-center gap-2">
                    <Link href={home()} className="inline-flex">
                        <img
                            src="/assets/images/Layer_1 (3).png"
                            alt="Logo"
                            className="h-9 w-auto md:h-10"
                        />
                    </Link>
                </div>

                <ul className="text-md hidden min-w-0 items-center justify-center space-x-8 font-[Libre_Franklin] font-semibold tracking-wider md:flex md:space-x-10">
                    {productTypes.map((pt) => {
                        const entry = byType[pt.value];
                        if (!entry) return null;

                        return (
                            <DesktopTypeNavItem
                                key={pt.value}
                                label={pt.label}
                                landingHref={entry.landingHref}
                                listingHref={entry.listingHref}
                                categories={entry.categories}
                                isActive={activeType === pt.value}
                            />
                        );
                    })}
                </ul>

                <div className="flex shrink-0 items-center gap-2 sm:gap-4 md:gap-6">
                    <div className="relative hidden min-w-0 items-center gap-2 rounded bg-gray-900 px-3 py-2 sm:flex md:px-4 md:py-2.5">
                        <Search size={14} className="shrink-0 text-gray-100" />
                        <input
                            type="search"
                            name="header-search"
                            placeholder="Search"
                            className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-gray-100 sm:w-24 md:w-32"
                            aria-label="Search products"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => router.visit(cartIndex.url())}
                        className={cn(
                            'text-lg text-gray-900 transition hover:text-white',
                            currentPath === cartIndex.url()
                                ? 'text-white'
                                : 'text-gray-900',
                        )}
                        aria-label="Shopping cart"
                    >
                        <ShoppingCart size={20} />
                    </button>

                    {user ? (
                        <UserMenuContent user={user} />
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

                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-md p-1.5 text-2xl text-gray-900 transition hover:bg-white/10 hover:text-white md:hidden"
                        aria-expanded={mobileOpen}
                        aria-controls={mobileNavId}
                        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
                        onClick={() => setMobileOpen((o) => !o)}
                    >
                        {mobileOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {mobileOpen && (
                    <div
                        id={mobileNavId}
                        className="absolute top-full right-0 left-0 z-1001 max-h-[min(70vh,calc(100dvh-5rem))] overflow-y-auto border-t border-white/10 bg-black/90 p-4 shadow-lg backdrop-blur-md md:hidden"
                    >
                        <ul className="flex flex-col space-y-2 text-sm font-semibold tracking-wider uppercase">
                            {productTypes.map((pt) => {
                                const entry = byType[pt.value];
                                if (!entry) return null;

                                const typeExpanded =
                                    mobileTypeOpen === pt.value;
                                const landingActive =
                                    currentPath === pathOnly(entry.landingHref);

                                return (
                                    <li
                                        key={pt.value}
                                        className="border-b border-white/10 pb-3 last:border-0"
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <Link
                                                href={entry.landingHref}
                                                className={cn(
                                                    'block min-w-0 flex-1',
                                                    landingActive
                                                        ? 'font-bold text-white'
                                                        : 'text-gray-300',
                                                )}
                                                onClick={() =>
                                                    setMobileOpen(false)
                                                }
                                            >
                                                {pt.label}
                                            </Link>
                                            {entry.categories.length > 0 && (
                                                <button
                                                    type="button"
                                                    aria-expanded={typeExpanded}
                                                    className="shrink-0 rounded p-1 text-gray-400 hover:bg-white/10 hover:text-white"
                                                    aria-label={`Toggle ${pt.label} categories`}
                                                    onClick={() =>
                                                        setMobileTypeOpen(
                                                            (v) =>
                                                                v === pt.value
                                                                    ? null
                                                                    : pt.value,
                                                        )
                                                    }
                                                >
                                                    <ChevronDown
                                                        className={cn(
                                                            'size-5 transition-transform',
                                                            typeExpanded &&
                                                                'rotate-180',
                                                        )}
                                                    />
                                                </button>
                                            )}
                                        </div>

                                        {typeExpanded &&
                                            entry.categories.length > 0 && (
                                                <ul className="mt-2 space-y-1 border-l border-white/10 pl-3 normal-case">
                                                    {entry.categories.map(
                                                        (cat) => {
                                                            const pKey = `${pt.value}:${cat.id}`;
                                                            const pOpen =
                                                                mobileParentOpen[
                                                                    pKey
                                                                ] ?? false;
                                                            const hasChildren =
                                                                cat.children
                                                                    .length > 0;

                                                            return (
                                                                <li
                                                                    key={cat.id}
                                                                >
                                                                    <div className="flex items-center justify-between gap-2">
                                                                        <Link
                                                                            href={catalogFilterHref(
                                                                                entry.listingHref,
                                                                                cat.slug,
                                                                            )}
                                                                            className="min-w-0 flex-1 text-xs text-gray-200 hover:text-white"
                                                                            onClick={() =>
                                                                                setMobileOpen(
                                                                                    false,
                                                                                )
                                                                            }
                                                                        >
                                                                            {
                                                                                cat.title
                                                                            }
                                                                        </Link>
                                                                        {hasChildren && (
                                                                            <button
                                                                                type="button"
                                                                                className="shrink-0 rounded p-1 text-gray-500 hover:bg-white/10 hover:text-white"
                                                                                aria-expanded={
                                                                                    pOpen
                                                                                }
                                                                                aria-label={`Toggle ${cat.title} subcategories`}
                                                                                onClick={() =>
                                                                                    toggleMobileParent(
                                                                                        pKey,
                                                                                    )
                                                                                }
                                                                            >
                                                                                <ChevronDown
                                                                                    className={cn(
                                                                                        'size-4 transition-transform',
                                                                                        pOpen &&
                                                                                            'rotate-180',
                                                                                    )}
                                                                                />
                                                                            </button>
                                                                        )}
                                                                    </div>
                                                                    {hasChildren &&
                                                                        pOpen && (
                                                                            <ul className="mt-1 space-y-1 pl-3">
                                                                                {cat.children.map(
                                                                                    (
                                                                                        child,
                                                                                    ) => (
                                                                                        <li
                                                                                            key={
                                                                                                child.id
                                                                                            }
                                                                                        >
                                                                                            <Link
                                                                                                href={catalogFilterHref(
                                                                                                    entry.listingHref,
                                                                                                    cat.slug,
                                                                                                    child.slug,
                                                                                                )}
                                                                                                className="block text-xs text-gray-300 hover:text-white"
                                                                                                onClick={() =>
                                                                                                    setMobileOpen(
                                                                                                        false,
                                                                                                    )
                                                                                                }
                                                                                            >
                                                                                                {
                                                                                                    child.title
                                                                                                }
                                                                                            </Link>
                                                                                        </li>
                                                                                    ),
                                                                                )}
                                                                            </ul>
                                                                        )}
                                                                </li>
                                                            );
                                                        },
                                                    )}
                                                </ul>
                                            )}
                                    </li>
                                );
                            })}

                            {/* <li className="border-t border-white/10 pt-4">
                                {user ? (
                                    <div className="space-y-3 normal-case">
                                        <div className="text-left">
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
                                            <button
                                                type="button"
                                                disabled={loggingOut}
                                                className="flex items-center gap-2 text-left text-sm text-gray-200 transition hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                                                onClick={handleMobileLogout}
                                            >
                                                {loggingOut ? (
                                                    <Loader2 className="size-4 shrink-0 animate-spin" />
                                                ) : null}
                                                {loggingOut
                                                    ? 'Logging out…'
                                                    : 'Log out'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="block text-sm text-gray-200 normal-case transition hover:text-white"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Login
                                    </Link>
                                )}
                            </li> */}

                            <li className="border-t border-white/10 pt-4">
                                <div className="flex items-center gap-2 rounded bg-white/10 px-4 py-2 normal-case">
                                    <Search
                                        size={14}
                                        className="shrink-0 text-gray-400"
                                    />
                                    <input
                                        type="search"
                                        name="mobile-header-search"
                                        placeholder="Search"
                                        className="min-w-0 flex-1 bg-transparent text-xs text-white outline-none placeholder:text-gray-400"
                                        aria-label="Search products"
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
