import { Bell, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { PageContainer, PageHeader } from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import {
  useNotifications,
  useMarkAllAsRead,
  useMarkAsRead,
  useSnoozeNotification,
  useDismissNotification,
} from '../api/useNotifications';

export function NotificationsPage() {
  const navigate = useNavigate();
  const { data: notifications, isLoading } = useNotifications();
  const markAsRead = useMarkAsRead();
  const markAllAsRead = useMarkAllAsRead();
  const snooze = useSnoozeNotification();
  const dismiss = useDismissNotification();

  const unreadCount = notifications?.filter((n: any) => !n.readAt)?.length || 0;

  return (
    <PageContainer maxWidth="2xl">
      <PageHeader
        icon={Bell}
        title="Notifications"
        description="Manage your follow-up reminders and alerts."
        actions={
          unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead.mutate()}
              disabled={markAllAsRead.isPending}
              className="text-sm text-primary hover:underline disabled:opacity-50"
            >
              Mark all as read
            </button>
          )
        }
      />

      <div className="flex flex-col gap-3">
        {isLoading ? (
          <>
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
            <Skeleton className="h-20 rounded-xl" />
          </>
        ) : notifications && notifications.length > 0 ? (
          notifications.map((notification: any) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onMarkAsRead={() => markAsRead.mutate(notification.id)}
              onSnooze={(days) => snooze.mutate({ id: notification.id, days })}
              onDismiss={() => dismiss.mutate(notification.id)}
              onNavigate={() => navigate(`/app/applications/${notification.applicationId}`)}
            />
          ))
        ) : (
          <Card variant="default" size="sm">
            <CardContent className="py-12 text-center">
              <Bell className="size-12 mx-auto mb-3 text-muted-foreground" />
              <p className="text-on-surface font-medium">No notifications</p>
              <p className="text-on-surface-variant text-sm mt-1">
                You're all caught up!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageContainer>
  );
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onSnooze,
  onDismiss,
  onNavigate,
}: {
  notification: any;
  onMarkAsRead: () => void;
  onSnooze: (days: number) => void;
  onDismiss: () => void;
  onNavigate: () => void;
}) {
  const isUnread = !notification.readAt;
  const isOverdue = notification.type === 'FOLLOW_UP_OVERDUE';

  return (
    <Card
      variant={isUnread ? 'elevated' : 'default'}
      size="default"
      className={`cursor-pointer transition-all duration-150 hover:bg-surface-container-low ${
        isOverdue ? 'border-l-4 border-l-error' : ''
      }`}
      onClick={onNavigate}
    >
      <CardContent className="flex items-start gap-6 p-5">
        <div
          className={`shrink-0 mt-1.5 size-2.5 rounded-full transition-colors duration-150 ${
            isUnread ? 'bg-primary' : 'bg-transparent'
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p
              className={`font-headline font-medium ${
                isUnread ? 'text-on-surface' : 'text-on-surface-variant'
              }`}
            >
              {notification.title}
            </p>
            <span className="text-sm text-on-surface-variant shrink-0 font-headline">
              {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
            </span>
          </div>
          <p className="text-sm text-on-surface-variant mt-2 line-clamp-2">
            {notification.body}
          </p>
          {notification.jobTitle && (
            <p className="text-sm text-primary mt-2 font-medium">
              {notification.jobTitle}
              {notification.company && ` at ${notification.company}`}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {isUnread && (
            <button
              onClick={(e) => { e.stopPropagation(); onMarkAsRead(); }}
              className="text-xs text-primary hover:underline font-medium"
            >
              Mark read
            </button>
          )}
          <button
            onClick={(e) => { e.stopPropagation(); onSnooze(3); }}
            className="text-xs text-on-surface-variant hover:text-on-surface font-medium"
          >
            Snooze
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDismiss(); }}
            className="text-xs text-on-surface-variant hover:text-error font-medium"
          >
            Dismiss
          </button>
          <ChevronRight className="size-5 text-on-surface-variant" />
        </div>
      </CardContent>
    </Card>
  );
}