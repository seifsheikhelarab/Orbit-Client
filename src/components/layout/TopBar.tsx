import { useNavigate } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { useUIStore } from '@/hooks/useUIStore';
import { useSession } from '@/lib/auth-client';
import { useUnreadCount } from '@/features/notifications/api/useNotifications';
import { cn } from '@/lib/utils';

function NotificationBell() {
  const navigate = useNavigate();
  const { data: unreadData } = useUnreadCount();
  const count = unreadData?.count ?? 0;

  return (
     <button
       onClick={() => navigate('/app/notifications')}
       className={cn(
         "relative flex size-11 items-center justify-center rounded-lg",
         "text-on-surface-variant hover:bg-surface-container hover:text-on-surface",
         "transition-all duration-200 ease-out-quart",
         "active:scale-95"
       )}
       aria-label="Notifications"
     >
       <Bell className={cn(
         "size-5 transition-transform duration-200"
       )} />
       {count > 0 && (
         <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-primary text-on-primary text-[10px] font-semibold leading-none animate-in zoom-in-95 duration-300 animate-click-ripple">
           {count > 99 ? '99+' : count}
         </span>
       )}
     </button>
   );
}

function UserAvatar() {
  const { data: session } = useSession();
  
  if (session?.user?.image) {
    return (
      <div
        className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10 border border-outline-variant"
        style={{ backgroundImage: `url("${session.user.image}")` }}
      />
    );
  }
  
  const name = session?.user?.name || 'U';
  const initial = name.charAt(0).toUpperCase();
  
  return (
    <div className="rounded-full size-10 border border-outline-variant bg-primary flex items-center justify-center text-on-primary font-semibold">
      {initial}
    </div>
  );
}

export function TopBar() {
  const navigate = useNavigate();
  const toggleSidebar = useUIStore((state) => state.toggleSidebar);

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-surface-container-high/90 backdrop-blur-md px-6 md:px-10 py-4">
      <div className="flex items-center gap-5 text-on-surface">
        <button 
           onClick={toggleSidebar}
           className={cn(
             "md:hidden flex size-11 items-center justify-center rounded-xl",
             "hover:bg-surface-container",
             "transition-all duration-200 ease-out-quart",
             "active:scale-90 active:duration-75"
           )}
           aria-label="Toggle sidebar"
         >
          <Menu className="size-5 transition-transform duration-200" />
        </button>
        <button onClick={() => navigate('/app/dashboard')} className="flex items-center gap-3 group">
          <img src="/icon.png" alt="Orbit" className="size-7 transition-transform duration-200 ease-out-quart group-hover:scale-105 group-hover:rotate-3" />
          <h2 className={cn(
            "text-on-surface text-display-sm font-bold tracking-tight",
            "transition-all duration-200",
            "group-hover:text-primary"
          )}>
            Orbit
          </h2>
        </button>
      </div>

      <div className="flex items-center gap-3">
         <NotificationBell />
         <button onClick={() => navigate('/app/settings')} className="transition-transform duration-150 hover:scale-105" aria-label="User settings">
           <UserAvatar />
         </button>
       </div>
    </header>
  );
}
