import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { home, login, logout } from '@/routes';
import type {
    FrontendNav,
    FrontendNavByTypeEntry,
    FrontendNavCategory,
    SharedData,
} from '@/types';
import { Link, router, usePage } from '@inertiajs/react';
import { ChevronDown, Menu, Search, ShoppingCart, User, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';

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
    parentId: number,
    subId?: number,
): string {
    const params = new URLSearchParams();
    params.set('category', String(parentId));
    if (subId != null) {
        params.set('subcategory', String(subId));
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

    // const isLandingActive = pathOnly(currentPath) === pathOnly(landingHref);
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
                        /* Bridge padding fills the space under the label so the cursor never crosses a dead zone (mt-* gap + pointer-events-none used to drop hover). */
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
                                                    cat.id,
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
                                                                cat.id,
                                                                child.id,
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
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileTypeOpen, setMobileTypeOpen] = useState<string | null>(null);
    const [mobileParentOpen, setMobileParentOpen] = useState<
        Record<string, boolean>
    >({});

    const user = props?.auth?.user ?? null;
    const frontendNav: FrontendNav | undefined = props?.frontendNav;

    const productTypes = frontendNav?.productTypes ?? [];
    const byType: Record<string, FrontendNavByTypeEntry> =
        frontendNav?.byType ?? {};

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

        // Home route: always active, default to first type if no/invalid param
        if (currentPath === '/') {
            return typeParam && knownTypes.has(typeParam)
                ? typeParam
                : defaultType;
        }

        // products.category route: /men, /women, /accessories
        const segment = currentPath.replace(/^\//, '').split('/')[0] ?? '';
        if (knownTypes.has(segment)) {
            return segment;
        }

        // Any other route → nothing active
        return '';
    }, [url, currentPath, productTypes]);

    return (
        <section className="relative z-1000 overflow-visible font-sans text-gray-900">
            <nav className="relative z-1000 container mx-auto mt-10 flex items-center justify-between border-b border-white/10 bg-bg-red px-6 py-5 backdrop-blur-md md:px-12">
                <div className="flex items-center gap-2">
                    <Link href={home()}>
                        <img
                            src="/assets/images/Layer_1 (3).png"
                            alt="Logo"
                            className="h-10 w-auto"
                        />
                    </Link>
                </div>

                <ul className="text-md hidden space-x-10 font-[Libre_Franklin] font-semibold tracking-wider md:flex">
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

                <div className="flex items-center gap-3 md:gap-6">
                    <div className="relative hidden items-center gap-2 rounded bg-gray-900 px-4 py-2.5 sm:flex">
                        <Search size={14} className="text-gray-100" />
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-20 bg-transparent text-xs text-white outline-none placeholder:text-gray-100 md:w-32"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={() => router.get('/cartpage')}
                        className="text-lg text-gray-900 transition hover:text-white"
                    >
                        <ShoppingCart size={20} />
                    </button>

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
                                        <p className="text-sm leading-none font-medium">
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

                    <button
                        type="button"
                        className="text-2xl md:hidden"
                        onClick={() => setMobileOpen(!mobileOpen)}
                    >
                        {mobileOpen ? <X /> : <Menu />}
                    </button>
                </div>

                {mobileOpen && (
                    <div className="absolute top-full left-0 w-full border-t border-white/10 bg-black/90 p-6 backdrop-blur-md md:hidden">
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
                                                    'block flex-1',
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
                                                    className="shrink-0 p-1 text-gray-400"
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
                                                                                cat.id,
                                                                            )}
                                                                            className="flex-1 text-xs text-gray-200 hover:text-white"
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
                                                                                className="p-1 text-gray-500"
                                                                                aria-expanded={
                                                                                    pOpen
                                                                                }
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
                                                                                                    cat.id,
                                                                                                    child.id,
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

                            <li className="border-t border-white/10 pt-4">
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
                                        className="block text-sm text-gray-200 normal-case transition hover:text-white"
                                        onClick={() => setMobileOpen(false)}
                                    >
                                        Login
                                    </Link>
                                )}
                            </li>

                            <li className="border-t border-white/10 pt-4">
                                <div className="flex items-center gap-2 rounded bg-white/10 px-4 py-2 normal-case">
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
