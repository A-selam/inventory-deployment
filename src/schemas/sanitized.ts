/**
 * Sanitized Zod schemas with built-in XSS and SQL injection protection
 * Use these schema helpers to automatically sanitize inputs during validation
 */

import { z } from "zod";
import {
  sanitizeInput,
  sanitizeEmail,
  sanitizeNumeric,
  sanitizeIdentifier,
  sanitizeSearchQuery,
} from "@/lib/sanitize";

/**
 * Sanitized string - applies XSS and general sanitization
 */
export const sanitizedString = (config?: {
  min?: number;
  max?: number;
  message?: string;
}) => {
  return z
    .string()
    .min(config?.min ?? 1, {
      message: config?.message ?? "This field is required",
    })
    .max(config?.max ?? 500, { message: "Input is too long" })
    .transform((val) => sanitizeInput(val));
};

/**
 * Sanitized optional string
 */
export const sanitizedStringOptional = (config?: {
  max?: number;
  message?: string;
}) => {
  return z
    .string()
    .max(config?.max ?? 500, { message: "Input is too long" })
    .optional()
    .default("")
    .transform((val) => sanitizeInput(val));
};

/**
 * Sanitized email
 */
export const sanitizedEmail = () => {
  return z
    .string()
    .email("Invalid email address")
    .transform((val) => sanitizeEmail(val));
};

/**
 * Sanitized identifier (SKU, ID, codes)
 */
export const sanitizedIdentifier = (config?: {
  min?: number;
  max?: number;
  pattern?: RegExp;
  message?: string;
}) => {
  let schema: z.ZodSchema = z
    .string()
    .min(config?.min ?? 1, {
      message: config?.message ?? "This field is required",
    })
    .max(config?.max ?? 50, { message: "Identifier is too long" });

  if (config?.pattern) {
    schema = (schema as z.ZodString).regex(config.pattern, {
      message: config.message ?? "Invalid format",
    });
  }

  return (schema as z.ZodString).transform((val) => sanitizeIdentifier(val));
};

/**
 * Sanitized numeric string
 */
export const sanitizedNumericString = () => {
  return z
    .string()
    .transform((val) => sanitizeNumeric(val))
    .pipe(z.coerce.number());
};

/**
 * Sanitized search query
 */
export const sanitizedSearchQuery = () => {
  return z
    .string()
    .max(200, { message: "Search query is too long" })
    .optional()
    .default("")
    .transform((val) => sanitizeSearchQuery(val));
};

/**
 * Create a sanitized object schema
 * Useful for form data with multiple sanitized fields
 */
export const createSanitizedObjectSchema = <T extends Record<string, z.ZodSchema>>(
  fields: T
) => {
  return z.object(fields);
};
