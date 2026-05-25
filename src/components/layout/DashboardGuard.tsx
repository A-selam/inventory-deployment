"use client";

import { useEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { useAuthStore } from "@/stores/auth-store";

export default function DashboardGuard({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accessToken = useAuthStore((state) => state.access_token);

  const isHydrated = useSyncExternalStore(
    (onStoreChange) => useAuthStore.persist.onFinishHydration(onStoreChange),
    () => useAuthStore.persist.hasHydrated(),
    () => false,
  );

  const redirectTarget = useMemo(() => {
    const params = searchParams.toString();
    return params ? `${pathname}?${params}` : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (isHydrated && !accessToken) {
      router.replace(`/login?redirect=${encodeURIComponent(redirectTarget)}`);
    }
  }, [accessToken, isHydrated, redirectTarget, router]);

  if (!isHydrated || !accessToken) {
    return <div className="min-h-screen bg-background" />;
  }

  return <>{children}</>;
}
