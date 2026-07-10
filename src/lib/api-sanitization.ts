/**
 * API Sanitization Middleware
 * Sanitizes all outgoing API request payloads
 */

import {
  sanitizeInput,
  sanitizeEmail,
  sanitizeSearchQuery,
  sanitizeNumeric,
  sanitizeIdentifier,
} from "./sanitize";

export type SanitizationType = "text" | "email" | "search" | "numeric" | "identifier" | "none";

interface SanitizationConfig {
  [key: string]: SanitizationType;
}

/**
 * Deep sanitize an object recursively based on configuration
 * Useful for sanitizing form payloads before sending to API
 */
export function sanitizePayload<T extends Record<string, unknown>>(
  payload: T,
  config: SanitizationConfig
): T {
  const sanitized: Record<string, unknown> = { ...payload };

  for (const [key, type] of Object.entries(config)) {
    if (key in sanitized && sanitized[key] !== undefined && sanitized[key] !== null) {
      const value = sanitized[key];

      if (typeof value === "string") {
        switch (type) {
          case "text":
            sanitized[key] = sanitizeInput(value);
            break;
          case "email":
            sanitized[key] = sanitizeEmail(value);
            break;
          case "search":
            sanitized[key] = sanitizeSearchQuery(value);
            break;
          case "numeric":
            sanitized[key] = sanitizeNumeric(value);
            break;
          case "identifier":
            sanitized[key] = sanitizeIdentifier(value);
            break;
          case "none":
            // Skip sanitization
            break;
          default:
            sanitized[key] = value;
        }
      }
    }
  }

  return sanitized as T;
}

/**
 * Sanitize item creation/update payload
 */
export function sanitizeItemPayload(payload: Record<string, unknown>) {
  return sanitizePayload(payload, {
    name: "text",
    description: "text",
    sku: "identifier",
    bin_location: "text",
    category_id: "identifier",
    vendor_id: "identifier",
    warehouse_id: "identifier",
  });
}

/**
 * Sanitize search query parameters
 */
export function sanitizeSearchParams(query: string): string {
  return sanitizeSearchQuery(query);
}

/**
 * Sanitize filter parameters for API calls
 */
export function sanitizeFilterParams(filters: Record<string, unknown>) {
  return sanitizePayload(filters, {
    search: "search",
    query: "search",
    category_id: "identifier",
    vendor_id: "identifier",
    warehouse_id: "identifier",
    sort_by: "identifier",
  });
}

/**
 * Create a sanitization wrapper for an API function
 * Automatically sanitizes payloads before sending
 */
export function createSanitizedApiCall<T extends (...args: any[]) => Promise<any>>(
  apiFunction: T,
  sanitizationConfig: SanitizationConfig
): T {
  return (async (...args: any[]) => {
    // Assume first argument is the payload
    const [payload, ...rest] = args;

    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      const sanitized = sanitizePayload(payload as Record<string, unknown>, sanitizationConfig);
      return apiFunction(sanitized, ...rest);
    }

    return apiFunction(...args);
  }) as T;
}

/**
 * Sanitize form data before submission
 * Works with FormData objects
 */
export function sanitizeFormData(
  formData: FormData,
  config: SanitizationConfig
): FormData {
  const sanitized = new FormData();

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string" && key in config) {
      const type = config[key];
      let sanitizedValue = value;

      switch (type) {
        case "text":
          sanitizedValue = sanitizeInput(value);
          break;
        case "email":
          sanitizedValue = sanitizeEmail(value);
          break;
        case "search":
          sanitizedValue = sanitizeSearchQuery(value);
          break;
        case "numeric":
          sanitizedValue = sanitizeNumeric(value);
          break;
        case "identifier":
          sanitizedValue = sanitizeIdentifier(value);
          break;
      }

      sanitized.append(key, sanitizedValue);
    } else {
      // Keep non-string values and non-configured fields as-is
      sanitized.append(key, value);
    }
  }

  return sanitized;
}

/**
 * Sanitize URL search parameters
 */
export function sanitizeUrlParams(params: URLSearchParams, config: SanitizationConfig): URLSearchParams {
  const sanitized = new URLSearchParams();

  for (const [key, value] of params.entries()) {
    if (key in config && typeof value === "string") {
      const type = config[key];
      let sanitizedValue = value;

      switch (type) {
        case "text":
          sanitizedValue = sanitizeInput(value);
          break;
        case "search":
          sanitizedValue = sanitizeSearchQuery(value);
          break;
        case "identifier":
          sanitizedValue = sanitizeIdentifier(value);
          break;
      }

      sanitized.set(key, sanitizedValue);
    } else {
      sanitized.set(key, value);
    }
  }

  return sanitized;
}
