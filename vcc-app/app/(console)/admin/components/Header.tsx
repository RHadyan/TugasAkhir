'use client';

import { Icon } from '@iconify/react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Header() {
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <header className="bg-background border-b border-defaultBorder sticky top-0 z-10">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold text-dark dark:text-white">
            Content Management System
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full"
          >
            {theme === 'dark' ? (
              <Icon icon="solar:sun-linear" height={20} width={20} />
            ) : (
              <Icon icon="solar:moon-linear" height={20} width={20} />
            )}
          </Button>

          {/* User Profile */}
          {user && (
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden p-0 border border-gray-200">
                  {user.picture ? (
                    <img
                      src={user.picture}
                      alt={user.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Icon icon="solar:user-circle-bold" className="w-full h-full text-gray-400" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56" align="end">
                <div className="flex flex-col space-y-2">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground mt-1 text-gray-500">
                      {user.email}
                    </p>
                  </div>
                  <div className="h-px bg-gray-100 my-1" />
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={logout}
                  >
                    <Icon icon="solar:logout-2-linear" className="mr-2 h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </header>
  );
}
