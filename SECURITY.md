# Security Guidelines - Input Sanitization

This document outlines the input sanitization practices implemented in the Inventory Management application to protect against XSS (Cross-Site Scripting) and SQL Injection attacks.

## Overview

The application implements defense-in-depth input sanitization across all user-facing forms and search fields. This includes:

1. **Client-side sanitization** - Prevents XSS attacks before data reaches the server
2. **Schema validation** - Enforces data type and format constraints
3. **Automatic HTML escaping** - Neutralizes potentially dangerous markup

## Key Security Modules

### 1. Sanitization Library (`src/lib/sanitize.ts`)

Core sanitization functions for different input types:

#### XSS Protection
```typescript
import { sanitizeXSS, sanitizeInput } from "@/lib/sanitize";

// Escapes HTML special characters
const safe = sanitizeXSS("<script>alert('xss')</script>");
// Result: "&lt;script&gt;alert(&#x27;xss&#x27;)&lt;&#x2F;script&gt;"

// Comprehensive sanitization for general text
const cleanText = sanitizeInput("User input with <tags>");
```

#### SQL Injection Defense
```typescript
import { sanitizeSQLInjection } from "@/lib/sanitize";

// Removes SQL keywords and dangerous patterns
const cleaned = sanitizeSQLInjection("'; DROP TABLE users; --");
```

#### Specialized Sanitization Functions
- `sanitizeSearchQuery()` - For search fields (more permissive)
- `sanitizeNumeric()` - For numeric inputs
- `sanitizeIdentifier()` - For IDs, SKUs, codes (alphanumeric + hyphens/underscores)
- `sanitizeEmail()` - For email inputs
- `validateAndSanitize()` - Type-based sanitization

### 2. Zod Schema Integration (`src/schemas/sanitized.ts`)

Pre-built Zod schemas with automatic sanitization:

```typescript
import { sanitizedString, sanitizedEmail, sanitizedIdentifier } from "@/schemas/sanitized";

const schema = z.object({
  name: sanitizedString({ min: 3, max: 50 }),
  email: sanitizedEmail(),
  sku: sanitizedIdentifier({ min: 1, max: 20 }),
});

// Data is automatically sanitized during validation
const result = schema.parse(userInput);
```

### 3. React Hooks for Search (`src/hooks/useSanitizedSearch.ts`)

Convenient hooks for search field implementation:

```typescript
import { useSanitizedSearch } from "@/hooks/useSanitizedSearch";

export function MySearchComponent() {
  const { sanitizeSearch } = useSanitizedSearch();
  
  const handleSearchChange = (value: string) => {
    const sanitized = sanitizeSearch(value);
    // Use sanitized value...
  };
}
```

## Updated Form Components

The following components have been updated with sanitization:

### Search Fields
- `src/components/items/ItemsFilters.tsx` - Item search
- `src/components/transactions/TransactionFilters.tsx` - Transaction search
- `src/components/replenishment/ReplenishmentFilters.tsx` - Replenishment search

### Form Schemas
- `src/schemas/item.ts` - Item creation and update forms

## Implementation Guide

### For Text Input Fields

```typescript
import { useSanitizedSearch } from "@/hooks/useSanitizedSearch";

function MyComponent() {
  const { sanitizeSearch } = useSanitizedSearch();
  
  return (
    <input
      type="text"
      onChange={(e) => {
        const sanitized = sanitizeSearch(e.target.value);
        // Use sanitized value
      }}
    />
  );
}
```

### For React Hook Forms

```typescript
import { sanitizedString } from "@/schemas/sanitized";
import { z } from "zod";

const schema = z.object({
  itemName: sanitizedString({ min: 1, max: 100 }),
  description: sanitizedString({ min: 0, max: 500 }).optional(),
});

// Use with react-hook-form as normal
const form = useForm({ resolver: standardSchemaResolver(schema) });
```

### For Custom Inputs

```typescript
import { sanitizeInput } from "@/lib/sanitize";

// In your component
const handleChange = (value: string) => {
  const clean = sanitizeInput(value);
  // Process clean data
};
```

## Security Best Practices

### 1. Always Sanitize on Input
✅ DO sanitize user input as soon as it enters the application
```typescript
const sanitized = sanitizeInput(userValue);
```

❌ DON'T rely solely on backend sanitization
```typescript
// BAD: Unvalidated client-side data
apiClient.post('/items', { name: userInput });
```

### 2. Use Type-Specific Sanitization
✅ DO use the appropriate sanitization function for the input type
```typescript
import { sanitizeEmail, sanitizeIdentifier, sanitizeNumeric } from "@/lib/sanitize";

const email = sanitizeEmail(userEmail);
const sku = sanitizeIdentifier(userSku);
const price = sanitizeNumeric(userPrice);
```

❌ DON'T use generic sanitization for all inputs
```typescript
// LESS IDEAL: Same function for all types
const sanitized = sanitizeInput(anyValue);
```

### 3. Leverage Schema Validation
✅ DO use sanitized Zod schemas for form data
```typescript
const schema = z.object({
  name: sanitizedString({ max: 50 }),
});
```

❌ DON'T skip schema validation
```typescript
// BAD: No validation
const data = await form.getValues();
```

### 4. Additional Backend Validation
⚠️ IMPORTANT: Client-side sanitization is not sufficient alone

Always implement corresponding server-side validation:

```typescript
// Backend example (pseudocode)
@Post('/items')
async createItem(body: CreateItemDTO) {
  // Validate schema
  const validated = await createItemSchema.parseAsync(body);
  
  // Use parameterized queries for database operations
  const item = await db.query(
    'INSERT INTO items (name, sku) VALUES ($1, $2)',
    [validated.name, validated.sku]
  );
}
```

### 5. Database Queries
⚠️ CRITICAL: Always use parameterized queries to prevent SQL injection

```typescript
// ✅ CORRECT: Parameterized query
const result = await db.query(
  'SELECT * FROM items WHERE name = $1',
  [sanitizedName]
);

// ❌ WRONG: String concatenation
const result = await db.query(
  `SELECT * FROM items WHERE name = '${unsanitizedName}'`
);
```

## Common Vulnerability Scenarios and Mitigation

### Cross-Site Scripting (XSS)

**Attack Vector:**
```
User Input: <img src="x" onerror="alert('XSS')">
```

**Our Defense:**
```typescript
const safe = sanitizeXSS(userInput);
// Output: &lt;img src="x" onerror="alert(&#x27;XSS&#x27;)&gt;
```

### SQL Injection

**Attack Vector:**
```
User Input: '; DROP TABLE users; --
```

**Our Defense:**
1. Client-side: `sanitizeSQLInjection()` removes dangerous patterns
2. Server-side: Parameterized queries prevent injection regardless

### Stored XSS

**Prevention:**
- Sanitize on input (client-side)
- Validate on server (server-side)
- Use `sanitizeForDisplay()` when rendering stored data

## Testing Security

### Manual Testing

1. **Test XSS vectors:**
   ```
   <script>alert('xss')</script>
   <img src=x onerror=alert('xss')>
   <iframe src="javascript:alert('xss')"></iframe>
   ```

2. **Test SQL patterns:**
   ```
   ' OR '1'='1
   '; DROP TABLE items; --
   UNION SELECT * FROM users--
   ```

3. **Verify sanitization is working:**
   - Open browser DevTools
   - Check Network tab to ensure data is sanitized before sending
   - Check console for any errors

### Automated Testing

Recommended test cases for each input field:

```typescript
describe('Input Sanitization', () => {
  it('should sanitize XSS attempts', () => {
    const result = sanitizeXSS("<script>alert('xss')</script>");
    expect(result).not.toContain('<script>');
  });

  it('should remove SQL injection patterns', () => {
    const result = sanitizeSQLInjection("' OR '1'='1");
    expect(result).not.toContain("OR");
  });

  it('should preserve valid input', () => {
    const result = sanitizeInput("Valid Item Name");
    expect(result).toBe("Valid Item Name");
  });
});
```

## Maintenance

### When Adding New Forms

1. Import sanitization utilities:
   ```typescript
   import { sanitizedString } from "@/schemas/sanitized";
   ```

2. Update schema with sanitized fields:
   ```typescript
   const schema = z.object({
     fieldName: sanitizedString({ max: 100 }),
   });
   ```

3. Apply sanitization to real-time inputs:
   ```typescript
   const { sanitizeSearch } = useSanitizedSearch();
   onChange={(e) => sanitizeSearch(e.target.value)}
   ```

## Resources

- [OWASP XSS Prevention Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cross_Site_Scripting_Prevention_Cheat_Sheet.html)
- [OWASP SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html)
- [Zod Validation Library](https://zod.dev/)

## Support

For security concerns or to report vulnerabilities, please contact the security team immediately.
