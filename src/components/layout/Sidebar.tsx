import { LayoutDashboard, Briefcase, Calendar, FileText, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useUIStore } from '@/hooks/useUIStore';

const NAV_ITEMS = [
  { name: 'Dashboard', icon: LayoutDashboard, path: '/app/dashboard' },
  { name: 'Applications', icon: Briefcase, path: '/app/applications' },
  { name: 'Resumes', icon: FileText, path: '/app/resumes' },
  { name: 'Interviews', icon: Calendar, path: '/app/interviews' },
];

const SECONDARY_NAV_ITEMS = [
  { name: 'Settings', icon: Settings, path: '/app/settings' },
];

function NavItem({ item, index }: { item: typeof NAV_ITEMS[0], index: number }) {
  const Icon = item.icon;
  
  return (
    <NavLink
      to={item.path}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-200 ease-out-quart cursor-pointer font-headline relative group',
          'animate-in slide-in-from-left-4 fade-in duration-300',
          isActive
            ? 'bg-on-primary/10 text-on-primary font-semibold shadow-xl shadow-inverse-surface/10'
            : 'text-on-primary/60 hover:bg-on-primary/5 hover:text-on-primary font-medium'
        )
      }
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {({ isActive }) => (
        <>
          <Icon className={cn(
            "size-5 shrink-0 transition-all duration-200 ease-out-quart",
            isActive && "text-accent scale-110"
          )} />
          <span className={cn(
            "text-sm tracking-wide transition-all duration-200",
            isActive ? "translate-x-1" : "group-hover:translate-x-1"
          )}>{item.name}</span>
           {isActive && (
             <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-r-full animate-slide-in-left" />
           )}
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
      {/* Editorial Grid Decor */}
       <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none overflow-hidden" aria-hidden="true">
         <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(to right, var(--color-on-primary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-on-primary) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
       </div>

      <nav className="flex flex-col gap-2 flex-1 relative z-10">
        {NAV_ITEMS.map((item, index) => (
          <NavItem key={item.name} item={item} index={index} />
        ))}
      </nav>

      <div className="relative z-10 space-y-6">
        <nav className="flex flex-col gap-2 pt-6 border-t border-on-primary/5">
          {SECONDARY_NAV_ITEMS.map((item, index) => (
            <NavItem key={item.name} item={item} index={NAV_ITEMS.length + index} />
          ))}
        </nav>
      </div>
    </aside>
  );
}
