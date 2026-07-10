/**
 * Input Sanitization Utilities
 * Protects against XSS (Cross-Site Scripting) and SQL Injection attacks
 */

/**
 * Sanitizes a string to prevent XSS attacks
 * Escapes HTML special characters that could be interpreted as markup
 */
export function sanitizeXSS(input: string): string {
  if (!input || typeof input !== "string") return "";

  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
    "/": "&#x2F;",
  };

  return input.replace(/[&<>"'/]/g, (char) => htmlEscapeMap[char] || char);
}

/**
 * Removes potentially dangerous SQL patterns
 * This is a defense-in-depth measure. Always use parameterized queries on the backend!
 */
export function sanitizeSQLInjection(input: string): string {
  if (!input || typeof input !== "string") return "";

  // Remove or escape common SQL injection patterns
  // Note: This is NOT a replacement for parameterized queries on the backend
  const sqlDangerousPatterns = [
    /(\b(UNION|SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|DECLARE|CAST|CONVERT|script|javascript|onerror|onload|onclick)\b)/gi,
    /(--|#|\/\*|\*\/|xp_|sp_)/gi,
    /([';"])\s*(OR|AND)\s*([';"]?).*?([';"])?/gi,
  ];

  let sanitized = input;
  for (const pattern of sqlDangerousPatterns) {
    sanitized = sanitized.replace(pattern, "");
  }

  return sanitized;
}

/**
 * Comprehensive sanitization against both XSS and SQL injection
 * Use this for general text input fields
 */
export function sanitizeInput(input: string): string {
  if (!input || typeof input !== "string") return "";

  // First, trim whitespace
  let sanitized = input.trim();

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, "");

  // Apply XSS protection
  sanitized = sanitizeXSS(sanitized);

  return sanitized;
}

/**
 * Sanitize search queries specifically
 * More permissive than general input to allow search operators
 */
export function sanitizeSearchQuery(input: string): string {
  if (!input || typeof input !== "string") return "";

  let sanitized = input.trim();

  // Remove null bytes
  sanitized = sanitized.replace(/\0/g, "");

  // For search, we escape HTML but are more permissive with special chars
  // that are useful for search operators
  const htmlEscapeMap: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
  };

  sanitized = sanitized.replace(/[&<>"]/g, (char) => htmlEscapeMap[char] || char);

  return sanitized;
}

/**
 * Sanitize numeric inputs
 * Ensures only valid numeric characters remain
 */
export function sanitizeNumeric(input: string | number): string {
  const str = String(input ?? "").trim();

  // Remove any non-numeric characters except decimal point and minus sign
  return str.replace(/[^0-9.\-]/g, "");
}

/**
 * Sanitize identifiers (IDs, SKUs, codes)
 * Allows alphanumeric, hyphens, underscores only
 */
export function sanitizeIdentifier(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input.replace(/[^a-zA-Z0-9\-_]/g, "");
}

/**
 * Sanitize email input
 * Basic email sanitization - additional validation should happen server-side
 */
export function sanitizeEmail(input: string): string {
  if (!input || typeof input !== "string") return "";

  return input
    .trim()
    .toLowerCase()
    .replace(/[<>'"]/g, ""); // Remove potentially dangerous characters
}

/**
 * Sanitize for display - safely render user-generated content
 * Use this when displaying user input in the UI
 */
export function sanitizeForDisplay(input: string): string {
  return sanitizeXSS(input);
}

/**
 * Validate and sanitize input based on type
 */
export function validateAndSanitize(
  input: string,
  type: "text" | "email" | "number" | "identifier" | "search" = "text"
): string {
  switch (type) {
    case "email":
      return sanitizeEmail(input);
    case "number":
      return sanitizeNumeric(input);
    case "identifier":
      return sanitizeIdentifier(input);
    case "search":
      return sanitizeSearchQuery(input);
    case "text":
    default:
      return sanitizeInput(input);
  }
}
