import { Link, usePage } from '@inertiajs/react';
import { Cog, Loader2, LogOut, Package2, User, User2 } from 'lucide-react';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useLogout } from '@/hooks/use-logout';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { index as orderIndex } from '@/routes/order';
import { index as profileIndex } from '@/routes/user/profile';
import { index as settingsIndex } from '@/routes/user/settings';
import { User as UserType, type SharedData } from '@/types';

interface UserMenuContentProps {
    user: UserType;
}

const menuItems = [
    {
        label: 'Orders',
        href: orderIndex().url,
        icon: Package2,
    },
    {
        label: 'Profile',
        href: profileIndex().url,
        icon: User2,
    },
    {
        label: 'Settings',
        href: settingsIndex().url,
        icon: Cog,
    },
];

export function UserMenuContent({ user }: UserMenuContentProps) {
    const { auth } = usePage<SharedData>().props;
    const cleanup = useMobileNavigation();

    // const logoutUrl = useMemo(() => {
    //     return auth?.admin ? admin.logout.url() : logout.url();
    // }, [auth?.admin]);

    const { loggingOut, performLogout } = useLogout(logout.url());

    const handleLogout = () => {
        if (loggingOut) {
            return;
        }
        cleanup();
        performLogout();
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    type="button"
                    className="cursor-pointer text-lg text-gray-900 transition hover:text-white"
                    aria-label="Open user menu"
                >
                    <User size={20} />
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" sideOffset={8}>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="truncate text-sm leading-none font-medium">
                            {user.name}
                        </p>
                        <p className="truncate text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {menuItems.map((item) => (
                    <DropdownMenuItem asChild key={item.label}>
                        <Link href={item.href} className="cursor-pointer">
                            <item.icon className="mr-2 h-4 w-4" />
                            {item.label}
                        </Link>
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    disabled={loggingOut}
                    onSelect={(event) => {
                        event.preventDefault();
                        handleLogout();
                    }}
                >
                    {loggingOut ? (
                        <Loader2 className="mr-2 h-4 w-4 shrink-0 animate-spin" />
                    ) : (
                        <LogOut className="mr-2 h-4 w-4" />
                    )}
                    {loggingOut ? 'Logging out…' : 'Log out'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
