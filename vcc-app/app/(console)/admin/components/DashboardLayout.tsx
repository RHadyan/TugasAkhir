'use client';

import Sidebar from './Sidebar';
import Header from './Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-h-screen">
      <div className="page-wrapper flex w-full">
        {/* Sidebar */}
        <div className="xl:block hidden">
          <Sidebar />
        </div>

        <div className="body-wrapper w-full">
          {/* Header */}
          <Header />

          {/* Body Content */}
          <div className="bg-lightgray dark:bg-dark mr-3 rounded-3xl min-h-[90vh]">
            <div className="container mx-auto px-6 py-30">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
