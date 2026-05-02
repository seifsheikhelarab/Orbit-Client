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
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <SidebarOverlay />
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-surface-container-lowest">
          <PageTransition>
            <Outlet />
          </PageTransition>
        </main>
      </div>
    </div>
  );
}
