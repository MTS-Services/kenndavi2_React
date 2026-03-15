import { dashboard } from '@/routes/admin';
import { index as categoriesIndex } from '@/routes/admin/categories';
import { Link, usePage } from '@inertiajs/react';
import React, { useMemo } from 'react';
import { index as ordersIndex } from '@/routes/admin/orders';
import { index as productsIndex } from '@/routes/admin/products';
import { useActiveUrl } from '@/hooks/use-active-url';
import { Box, LayoutGrid, LucideIcon, Megaphone, Package2, ShoppingCart } from 'lucide-react';
import { index as announcementIndex } from '@/routes/admin/announcement';
import { Icon } from '@/components/icon';


interface NavItem {
  label: string;
  href: string | any;
  icon: string | LucideIcon;
}

const logo = "/assets/images/Layer_1 (2).png";

export const AdminSidebar: React.FC = React.memo(() => {
  const { urlIsActive } = useActiveUrl();

  // 1. Centralized Navigation Config
  const navigation: NavItem[] = useMemo(() => [
    {
      label: 'Overview',
      href: dashboard(),
      icon: LayoutGrid,
    },
    {
      label: 'Orders',
      href: ordersIndex(),
      icon: ShoppingCart,
    },
    {
      label: 'Products',
      href: productsIndex(),
      icon: Package2,
    },
    {
      label: 'Categories',
      href: categoriesIndex(),
      icon: Box,
    },
    {
      label: 'Announcement',
      href: announcementIndex(),
      icon: Megaphone,
    }
  ], []);

  // 2. Optimized Class Merger
  const getNavLinkClasses = (isActive: boolean) => {
    const base = "flex items-center px-4 py-3 transition duration-200 rounded-md mb-1 ";
    const active = "bg-red-50 border-l-4 border-red-600 text-red-700 font-semibold";
    const inactive = "text-gray-700 hover:bg-gray-100 hover:text-gray-900";

    return `${base} ${isActive ? active : inactive}`;
  };

  return (
    <aside
      id="sidebar"
      className="fixed inset-y-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col justify-between py-4 overflow-y-auto transform -translate-x-full lg:translate-x-0 lg:static lg:inset-0 transition-transform duration-300 ease-in-out"
    >
      <div>
        {/* Mobile Close Button */}
        <button
          id="closeBtn"
          className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-red-600"
          aria-label="Close Sidebar"
        >
          <i className="fas fa-times text-xl" />
        </button>

        {/* Logo Section */}
        <div className="px-6 mb-6 flex justify-center">
          <Link href={route('admin.dashboard')}>
            <img src={logo} alt="Logo" className="h-12 w-auto object-contain" />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="px-4 space-y-1">
          <div className="border-t border-gray-100 my-4" />
          {navigation.map((item) => {
            const isActive = urlIsActive(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={getNavLinkClasses(isActive)}
              >
                {item.icon && typeof item.icon !== 'string' ? (
                  <Icon
                    iconNode={item.icon}
                    className="size-5"
                  />
                ) : (
                  <i className={`${item.icon} w-5 ${isActive ? 'text-red-600' : 'text-gray-400'}`} />
                )}
                <span className="ml-3">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / User Profile */}
      <div className="px-4 border-t border-gray-200 pt-4">
        <div className="flex items-center p-2 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden flex-shrink-0 border border-gray-200">
            <img
              src={logo} // Replace with user avatar if available
              alt="User"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="ml-3 min-w-0">
            <p className="text-sm font-bold text-gray-900 truncate">Super Admin</p>
            <p className="text-xs text-gray-500 truncate">admin@platform.com</p>
          </div>
        </div>

        <Link
          href={route('admin.logout')}
          method="post"
          as="button"
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition"
        >
          <i className="fas fa-sign-out-alt mr-3" />
          Log Out
        </Link>
      </div>
    </aside>
  );
});

AdminSidebar.displayName = 'AdminSidebar';