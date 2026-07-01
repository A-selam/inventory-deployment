"use client";

import { useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/auth-store";
import type { ApiSuccessResponse } from "@/types/api";
import type { Notification, NotificationsResponse } from "@/lib/notifications";
import {
  notificationsKey,
  unreadNotificationsCountKey,
} from "@/hooks/useNotifications";

type WsEnvelope =
  | {
      event: "NEW_NOTIFICATION";
      notification: Notification;
    }
  | { event?: string };

function buildWsUrl(token: string) {
  const wsUrl = process.env.NEXT_PUBLIC_API_URL_WS;
  const fallback = `wss://inventory-management-be-1-mdaf.onrender.com/api/v1/ws?token=${encodeURIComponent(
    token,
  )}`;

  try {
    return `${wsUrl}?token=${encodeURIComponent(token)}`;
  } catch {
    return fallback;
  }
}

function isApiSuccessResponse(
  value: unknown,
): value is ApiSuccessResponse<unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    "success" in value &&
    (value as { success?: unknown }).success === true &&
    "data" in value
  );
}

function mergeNotification(existing: Notification[], incoming: Notification) {
  const alreadyExists = existing.some((n) => n.id === incoming.id);
  if (alreadyExists) return existing;
  return [incoming, ...existing];
}

export function useNotificationsSocket({
  enabled = true,
}: { enabled?: boolean } = {}) {
  const queryClient = useQueryClient();
  const accessToken = useAuthStore((s) => s.access_token);

  const reconnectTimeoutRef = useRef<number | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const closedByEffectRef = useRef(false);
  const backoffRef = useRef(500);

  useEffect(() => {
    if (!enabled || !accessToken) return;

    closedByEffectRef.current = false;
    backoffRef.current = 500;

    const connect = () => {
      const wsUrl = buildWsUrl(accessToken);
      const socket = new WebSocket(wsUrl);
      socketRef.current = socket;

      socket.onopen = () => {
        backoffRef.current = 500;
      };

      socket.onmessage = (event) => {
        if (typeof event.data !== "string") return;
        let message: WsEnvelope | null = null;
        try {
          message = JSON.parse(event.data) as WsEnvelope;
        } catch {
          return;
        }

        if (!message || message.event !== "NEW_NOTIFICATION") return;
        if (!("notification" in message)) return;

        const incoming = message.notification;

        queryClient.setQueryData<NotificationsResponse>(
          notificationsKey,
          (prev) => {
            if (!prev) {
              return {
                success: true,
                message: "OK",
                data: [incoming],
              };
            }

            const raw = prev as unknown;
            if (isApiSuccessResponse(raw)) {
              const typed = raw as NotificationsResponse;
              return {
                ...typed,
                data: mergeNotification(typed.data ?? [], incoming),
              };
            }

            return prev;
          },
        );

        queryClient.setQueryData<number>(
          unreadNotificationsCountKey,
          (prev) => {
            const current = typeof prev === "number" ? prev : 0;
            return incoming.is_read ? current : current + 1;
          },
        );
      };

      socket.onclose = () => {
        socketRef.current = null;
        if (closedByEffectRef.current) return;

        const delay = Math.min(10_000, backoffRef.current);
        backoffRef.current = Math.min(10_000, backoffRef.current * 1.6);

        reconnectTimeoutRef.current = window.setTimeout(() => {
          reconnectTimeoutRef.current = null;
          connect();
        }, delay);
      };
    };

    connect();

    return () => {
      closedByEffectRef.current = true;
      if (reconnectTimeoutRef.current) {
        window.clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [accessToken, enabled, queryClient]);
}
