import React from 'react';
import { TopNav } from './TopNav';
import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="bg-background text-on-surface flex flex-col items-center min-h-screen">
      <div className="w-full max-w-[480px] min-h-screen bg-background relative shadow-sm border-x border-outline-variant/30 flex flex-col">
        <TopNav />
        <main className="flex-1 w-full relative">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
