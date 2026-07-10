/**
 * Hook for safely handling search input with automatic sanitization
 * Prevents XSS and SQL injection in search fields
 */

import { useCallback } from "react";
import { sanitizeSearchQuery } from "@/lib/sanitize";

export function useSanitizedSearch() {
  const sanitizeSearch = useCallback((value: string): string => {
    return sanitizeSearchQuery(value);
  }, []);

  return { sanitizeSearch };
}

/**
 * Hook for debounced sanitized search
 * Useful for search-as-you-type scenarios
 */
export function useDebouncedSanitizedSearch(delayMs: number = 300) {
  let timeoutId: NodeJS.Timeout | null = null;

  const debouncedSanitizeSearch = useCallback(
    (value: string, callback: (sanitized: string) => void) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        const sanitized = sanitizeSearchQuery(value);
        callback(sanitized);
      }, delayMs);

      return () => {
        if (timeoutId) clearTimeout(timeoutId);
      };
    },
    [delayMs]
  );

  return { debouncedSanitizeSearch };
}
