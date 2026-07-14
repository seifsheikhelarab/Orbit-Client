import { LayoutDashboard, Briefcase, Calendar, FileText, Settings, UserCircle, Sparkles, HelpCircle } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/hooks/useUIStore';

const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { name: 'Applications', icon: Briefcase, path: '/app/applications' },
  { name: 'Resumes', icon: FileText, path: '/app/resumes' },
  { name: 'Interviews', icon: Calendar, path: '/app/interviews' },
  { name: 'AutoCV', icon: Sparkles, path: '/app/autocv' },
  { name: 'Profile', icon: UserCircle, path: '/app/profile' },
];

const SECONDARY_NAV_ITEMS = [
  { name: 'Settings', icon: Settings, path: '/app/settings' },
];

function NavItem({ item }: { item: typeof NAV_ITEMS[0] }) {
  const Icon = item.icon;
  
  return (
    <NavLink
      to={item.path}
        className={({ isActive }) =>
        cn(
          'flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 ease-out-quart cursor-pointer font-headline relative group',
          isActive
            ? 'bg-on-primary/10 text-on-primary font-semibold'
            : 'text-on-primary/60 hover:bg-on-primary/5 hover:text-on-primary font-medium'
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-8 bg-on-primary rounded-r" />}
          <Icon className={cn(
            "size-5 shrink-0 transition-all duration-200 ease-out-quart",
            isActive && "text-on-primary scale-110"
          )} />
          <span className={cn(
            "text-sm tracking-wide transition-all duration-200",
            isActive ? "translate-x-1" : "group-hover:translate-x-1"
          )}>{item.name}</span>
        </>
      )}
    </NavLink>
  );
}

export function Sidebar() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <aside className={cn(
      "flex flex-col w-72 bg-primary p-6 gap-8 shrink-0 h-full text-on-primary relative overflow-hidden border-r border-on-primary/5",
      "transition-transform duration-300 ease-out-quart",
      "md:flex md:translate-x-0 md:opacity-100",
      "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:z-40 max-md:shadow-2xl",
      sidebarOpen
        ? "translate-x-0 opacity-100"
        : "max-md:-translate-x-full max-md:opacity-0 max-md:pointer-events-none"
    )}>

      <nav className="flex flex-col gap-2 flex-1 relative z-10 mt-4">
        {NAV_ITEMS.map((item) => (
          <NavItem key={item.name} item={item} />
        ))}
      </nav>

      <div className="relative z-10 space-y-6">
        <nav className="flex flex-col gap-2 pt-6 border-t border-on-primary/5">
            {SECONDARY_NAV_ITEMS.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
        </nav>
        <button
          type="button"
          className="flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 ease-out-quart text-on-primary/40 hover:text-on-primary/70 hover:bg-on-primary/5 font-medium text-sm tracking-wide w-full"
          onClick={() => window.open(`${import.meta.env.BASE_URL}/docs`, '_blank')}
        >
          <HelpCircle className="size-4 shrink-0" />
          <span>Documentation</span>
        </button>
      </div>
    </aside>
  );
}
