import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getNotifications,
  getUnreadNotificationsCount,
  markAllNotificationsRead,
  markNotificationRead,
  type Notification,
  type NotificationsResponse,
} from "@/lib/notifications";

export const notificationsKey = ["notifications"] as const;
export const unreadNotificationsCountKey = [
  "notifications",
  "unread_count",
] as const;

export function useNotifications({ enabled = true }: { enabled?: boolean } = {}) {
  return useQuery<NotificationsResponse>({
    queryKey: notificationsKey,
    queryFn: () => getNotifications(),
    enabled,
  });
}

export function useUnreadNotificationsCount({
  enabled = true,
}: { enabled?: boolean } = {}) {
  return useQuery<number>({
    queryKey: unreadNotificationsCountKey,
    queryFn: () => getUnreadNotificationsCount(),
    enabled,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) => markNotificationRead(notificationId),
    onMutate: async (notificationId: string) => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notificationsKey }),
        queryClient.cancelQueries({ queryKey: unreadNotificationsCountKey }),
      ]);

      const previousNotifications =
        queryClient.getQueryData<NotificationsResponse>(notificationsKey);
      const previousUnread =
        queryClient.getQueryData<number>(unreadNotificationsCountKey);

      let unreadDelta = 0;
      if (previousNotifications?.data) {
        const wasUnread = previousNotifications.data.some(
          (n) => n.id === notificationId && !n.is_read,
        );
        unreadDelta = wasUnread ? 1 : 0;
      }

      queryClient.setQueryData<NotificationsResponse>(notificationsKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.map((notification) =>
            notification.id === notificationId
              ? { ...notification, is_read: true }
              : notification,
          ),
        };
      });

      if (typeof previousUnread === "number") {
        queryClient.setQueryData<number>(unreadNotificationsCountKey, () =>
          Math.max(0, previousUnread - unreadDelta),
        );
      } else if (unreadDelta > 0) {
        queryClient.setQueryData<number>(unreadNotificationsCountKey, () => 0);
      }

      return { previousNotifications, previousUnread };
    },
    onError: (_error, _notificationId, context) => {
      if (!context) return;
      if (context.previousNotifications) {
        queryClient.setQueryData(notificationsKey, context.previousNotifications);
      }
      if (typeof context.previousUnread === "number") {
        queryClient.setQueryData(unreadNotificationsCountKey, context.previousUnread);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKey });
      queryClient.invalidateQueries({ queryKey: unreadNotificationsCountKey });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onMutate: async () => {
      await Promise.all([
        queryClient.cancelQueries({ queryKey: notificationsKey }),
        queryClient.cancelQueries({ queryKey: unreadNotificationsCountKey }),
      ]);

      const previousNotifications =
        queryClient.getQueryData<NotificationsResponse>(notificationsKey);
      const previousUnread =
        queryClient.getQueryData<number>(unreadNotificationsCountKey);

      queryClient.setQueryData<NotificationsResponse>(notificationsKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          data: prev.data.map((notification) => ({ ...notification, is_read: true })),
        };
      });

      queryClient.setQueryData<number>(unreadNotificationsCountKey, () => 0);

      return { previousNotifications, previousUnread };
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      if (context.previousNotifications) {
        queryClient.setQueryData(notificationsKey, context.previousNotifications);
      }
      if (typeof context.previousUnread === "number") {
        queryClient.setQueryData(unreadNotificationsCountKey, context.previousUnread);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: notificationsKey });
      queryClient.invalidateQueries({ queryKey: unreadNotificationsCountKey });
    },
  });
}

export function mergeNotificationIntoList(
  existing: Notification[],
  incoming: Notification,
) {
  const alreadyExists = existing.some((n) => n.id === incoming.id);
  if (alreadyExists) return existing;
  return [incoming, ...existing];
}

