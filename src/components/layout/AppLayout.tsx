import { Outlet } from 'react-router-dom';
import { TopBar } from './TopBar';
import { Sidebar } from './Sidebar';
import { useUIStore } from '@/hooks/useUIStore';
import { PageTransition } from '@/components/ui/page-transition';

function SidebarOverlay() {
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  if (!sidebarOpen) return null;

  return (
    <div
      className="md:hidden fixed inset-0 bg-black/50 z-30 animate-in fade-in duration-300"
      onClick={toggleSidebar}
      aria-hidden="true"
    />
  );
}

export function AppLayout() {
  return (
    <div className="flex h-screen w-full flex-col bg-background overflow-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-surface focus:text-on-surface focus:rounded-lg focus:m-4 focus:outline-none focus:ring-2 focus:ring-ring">
        Skip to content
      </a>
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarOverlay />
        <Sidebar />
        <main id="main-content" className="flex-1 overflow-y-auto">
          <div className="relative z-10">
            <PageTransition>
              <Outlet />
            </PageTransition>
          </div>
        </main>
      </div>
    </div>
  );
}
