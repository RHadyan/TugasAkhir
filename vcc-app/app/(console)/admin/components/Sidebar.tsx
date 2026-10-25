'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Icon } from '@iconify/react';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import {
  AMLogo,
  AMMenu,
  AMMenuItem,
  AMSidebar,
  AMSubmenu,
} from 'tailwind-sidebar';
import 'tailwind-sidebar/styles.css';

const menuItems = [
  {
    id: 'dashboard',
    title: 'Dashboard',
    url: '/admin',
    icon: 'solar:home-2-linear',
  },
  {
    id: 'countries',
    title: 'Countries',
    url: '/admin/countries',
    icon: 'solar:flag-linear',
  },
  {
    id: 'programs',
    title: 'Programs',
    url: '/admin/programs',
    icon: 'solar:document-text-linear',
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <AMSidebar
      collapsible="none"
      animation={true}
      showProfile={false}
      width={'270px'}
      showTrigger={false}
      className="fixed left-0 top-0 border-none bg-background z-10 h-screen"
    >
      {/* Logo */}
      <div className="px-4 flex items-center brand-logo overflow-hidden h-[70px]">
        <AMLogo component={Link} href="/admin" img="">
          <h1 className="text-2xl font-bold text-primary">VCC Admin</h1>
        </AMLogo>
      </div>

      {/* Sidebar items */}
      <SimpleBar className="h-[calc(100vh-10vh)]">
        <div className="px-6">
          {menuItems.map((item) => {
            const isSelected = pathname === item.url;
            const iconElement = (
              <Icon icon={item.icon} height={21} width={21} />
            );

            return (
              <div key={item.id}>
                <AMMenuItem
                  icon={iconElement}
                  isSelected={isSelected}
                  link={item.url}
                  component={Link}
                  className={`hover:bg-lightprimary hover:text-primary mt-1.5 text-link dark:text-darklink ${isSelected
                      ? '!bg-lightprimary !text-primary !hover-bg-lightprimary'
                      : ''
                    }`}
                >
                  <span className="truncate flex-1">{item.title}</span>
                </AMMenuItem>
              </div>
            );
          })}
        </div>
      </SimpleBar>

      {/* Footer */}
      <div className="p-4 border-t border-defaultBorder">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-dark dark:text-white">Admin User</p>
            <p className="text-xs text-darklink">admin@vcc.com</p>
          </div>
        </div>
      </div>
    </AMSidebar>
  );
}
