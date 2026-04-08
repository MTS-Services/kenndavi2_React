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
import { User as UserType, type SharedData } from '@/types';

interface UserMenuContentProps {
    user: UserType;
}

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
                    className="text-lg text-gray-900 transition hover:text-white cursor-pointer"
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
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                        <Package2 className="mr-2 h-4 w-4" />
                        Orders
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                        <User2 className="mr-2 h-4 w-4" />
                        Profile
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/profile" className="cursor-pointer">
                        <Cog className="mr-2 h-4 w-4" />
                        Settings
                    </Link>
                </DropdownMenuItem>
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
