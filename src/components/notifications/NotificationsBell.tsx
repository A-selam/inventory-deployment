"use client";

import { Bell, CheckCheck, Loader2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/ui/button";
import Card from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useUnreadNotificationsCount,
} from "@/hooks/useNotifications";
import { useNotificationsSocket } from "@/hooks/useNotificationsSocket";
import type { Notification } from "@/lib/notifications";

import NotificationsListItem from "@/components/notifications/NotificationsListItem";

function formatHeaderTimestamp(updatedAt: number | undefined) {
  if (!updatedAt) return null;
  const date = new Date(updatedAt);
  if (Number.isNaN(date.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function NotificationsBell() {
  const router = useRouter();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [open, setOpen] = useState(false);

  useNotificationsSocket({ enabled: true });

  const unread = useUnreadNotificationsCount({ enabled: true });
  const notificationsQuery = useNotifications({ enabled: open });

  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const notifications = useMemo(
    () => notificationsQuery.data?.data ?? [],
    [notificationsQuery.data?.data],
  );

  const unreadCount = useMemo(() => {
    if (typeof unread.data === "number") return unread.data;
    return notifications.reduce((acc, item) => acc + (item.is_read ? 0 : 1), 0);
  }, [notifications, unread.data]);

  const lastUpdatedLabel = useMemo(
    () => formatHeaderTimestamp(notificationsQuery.dataUpdatedAt),
    [notificationsQuery.dataUpdatedAt],
  );

  useEffect(() => {
    const handleOutsidePointerDown = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      if (!containerRef.current) return;
      if (!containerRef.current.contains(target)) setOpen(false);
    };

    document.addEventListener("mousedown", handleOutsidePointerDown);
    return () =>
      document.removeEventListener("mousedown", handleOutsidePointerDown);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const handleOpenNotification = (notification: Notification) => {
    if (!notification.is_read) {
      markRead.mutate(notification.id);
    }

    if (notification.item_id) {
      setOpen(false);
      router.push(`/inventory/${notification.item_id}`);
    }
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        className="relative inline-flex size-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <Bell className="size-4" />
        {unreadCount > 0 ? (
          <span className="absolute right-1.5 top-1.5 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-600 px-1.5 py-0.5 text-[11px] font-semibold leading-none text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-full z-50 mt-2 w-[min(420px,calc(100vw-2rem))]">
          <Card className="overflow-hidden rounded-[14px] border-border bg-card p-0 shadow-[0_18px_50px_rgba(15,23,42,0.12)]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <div>
                <div className="label-caps text-foreground">Notifications</div>
                {lastUpdatedLabel ? (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Updated {lastUpdatedLabel}
                  </div>
                ) : null}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 gap-2 px-3"
                  disabled={markAllRead.isPending || unreadCount === 0}
                  onClick={() => markAllRead.mutate()}
                >
                  {markAllRead.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <CheckCheck className="size-4" />
                  )}
                  Mark all read
                </Button>
              </div>
            </div>

            {notificationsQuery.isLoading ? (
              <div className="px-4 py-5 text-sm text-muted-foreground">
                Loading notifications…
              </div>
            ) : notificationsQuery.isError ? (
              <div className="space-y-3 px-4 py-5">
                <div className="text-sm text-rose-600">
                  {notificationsQuery.error instanceof Error
                    ? notificationsQuery.error.message
                    : "Failed to load notifications."}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-9"
                  onClick={() => notificationsQuery.refetch()}
                >
                  Retry
                </Button>
              </div>
            ) : notifications.length === 0 ? (
              <div className="px-4 py-6 text-sm text-muted-foreground">
                You’re all caught up.
              </div>
            ) : (
              <div className="max-h-[420px] overflow-auto py-1">
                {notifications.map((notification) => (
                  <NotificationsListItem
                    key={notification.id}
                    notification={notification}
                    marking={
                      markRead.isPending &&
                      markRead.variables === notification.id
                    }
                    onOpen={() => handleOpenNotification(notification)}
                    onMarkRead={() => markRead.mutate(notification.id)}
                  />
                ))}
              </div>
            )}

            <div className="flex items-center justify-between border-t border-border px-4 py-3">
              <div className="text-xs text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "No unread notifications"}
              </div>
              <button
                type="button"
                className={cn(
                  "text-xs font-semibold text-primary underline-offset-2 hover:underline",
                )}
                onClick={() => {
                  setOpen(false);
                  router.push("/alerts");
                }}
              >
                View alerts
              </button>
            </div>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
