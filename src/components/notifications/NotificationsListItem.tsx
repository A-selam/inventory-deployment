"use client";

import { AlertTriangle, Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Notification } from "@/lib/notifications";
import Button from "@/components/ui/button";

function severityIconClass(severity: Notification["severity"]) {
  return severity === "critical"
    ? "bg-rose-50 text-rose-700"
    : "bg-amber-50 text-amber-700";
}

function formatNotificationTimestamp(value: string | undefined) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h`;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
  }).format(date);
}

export default function NotificationsListItem({
  notification,
  marking,
  onOpen,
  onMarkRead,
}: {
  notification: Notification;
  marking: boolean;
  onOpen: () => void;
  onMarkRead: () => void;
}) {
  const timestamp = formatNotificationTimestamp(notification.created_at);

  return (
    <div
      className={cn(
        "group flex gap-3 px-3 py-2.5 transition-colors",
        notification.is_read
          ? "hover:bg-muted"
          : "bg-muted/40 hover:bg-muted/70",
      )}
    >
      <button
        type="button"
        className="flex min-w-0 flex-1 items-start gap-3 text-left"
        onClick={onOpen}
      >
        <div
          className={cn(
            "mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl",
            severityIconClass(notification.severity),
          )}
        >
          <AlertTriangle className="size-4" />
        </div>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">
                {notification.title}
              </div>
              <div className="text-xs leading-5 text-muted-foreground">
                {notification.message}
              </div>
            </div>
            <div className="shrink-0 text-[11px] text-muted-foreground">
              {timestamp ?? "—"}
            </div>
          </div>

          {!notification.is_read ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
                <span className="size-1.5 rounded-full bg-rose-600" />
                Unread
              </span>
            </div>
          ) : null}
        </div>
      </button>

      {!notification.is_read ? (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-9 shrink-0 gap-2 px-3 text-muted-foreground hover:text-foreground"
          disabled={marking}
          onClick={onMarkRead}
        >
          <Check className="size-4" />
          Read
        </Button>
      ) : null}
    </div>
  );
}
