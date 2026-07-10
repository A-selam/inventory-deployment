# Input Sanitization - Quick Reference Guide

## 🚀 Quick Start

### For Search Fields
```typescript
import { useSanitizedSearch } from "@/hooks/useSanitizedSearch";

function SearchComponent() {
  const { sanitizeSearch } = useSanitizedSearch();
  
  return (
    <input
      onChange={(e) => {
        const safe = sanitizeSearch(e.target.value);
        // Use safe value...
      }}
    />
  );
}
```

### For Form Schemas
```typescript
import { sanitizedString, sanitizedEmail } from "@/schemas/sanitized";
import { z } from "zod";

const mySchema = z.object({
  name: sanitizedString({ min: 1, max: 100 }),
  email: sanitizedEmail(),
});
```

### For Direct Sanitization
```typescript
import { sanitizeInput, sanitizeEmail, sanitizeIdentifier } from "@/lib/sanitize";

const cleanName = sanitizeInput(userInput);
const cleanEmail = sanitizeEmail(userEmail);
const cleanId = sanitizeIdentifier(userId);
```

## 📋 Function Reference

| Function | Use Case | Example |
|----------|----------|---------|
| `sanitizeInput()` | General text input | Names, descriptions |
| `sanitizeXSS()` | XSS prevention only | HTML content |
| `sanitizeSearchQuery()` | Search fields | Search boxes |
| `sanitizeEmail()` | Email addresses | User email inputs |
| `sanitizeNumeric()` | Number strings | Prices, quantities |
| `sanitizeIdentifier()` | IDs, SKUs, codes | Item SKU, UUID |

## 🎯 Common Patterns

### Pattern 1: Search Input with Real-Time Sanitization
```typescript
"use client";

import { useSanitizedSearch } from "@/hooks/useSanitizedSearch";
import { useRouter, useSearchParams } from "next/navigation";

export function MyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { sanitizeSearch } = useSanitizedSearch();
  const search = searchParams.get("search") ?? "";

  const handleSearchChange = (value: string) => {
    const sanitized = sanitizeSearch(value);
    const params = new URLSearchParams(searchParams);
    
    if (sanitized) {
      params.set("search", sanitized);
    } else {
      params.delete("search");
    }
    
    router.push(`?${params.toString()}`);
  };

  return (
    <input
      type="text"
      value={search}
      onChange={(e) => handleSearchChange(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### Pattern 2: Form with Sanitized Schema
```typescript
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { sanitizedString, sanitizedEmail } from "@/schemas/sanitized";

const formSchema = z.object({
  name: sanitizedString({ min: 3, max: 50 }),
  email: sanitizedEmail(),
  description: sanitizedString({ max: 200 }).optional(),
});

export function MyForm() {
  const { register, handleSubmit } = useForm({
    resolver: standardSchemaResolver(formSchema),
  });

  const onSubmit = async (data) => {
    // data is already sanitized from schema
    console.log("Clean data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register("name")} placeholder="Name" />
      <input {...register("email")} type="email" placeholder="Email" />
      <textarea {...register("description")} placeholder="Description" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

### Pattern 3: API Payload Sanitization
```typescript
import { sanitizeItemPayload } from "@/lib/api-sanitization";
import { apiClient } from "@/lib/api-client";

async function createItem(itemData) {
  // Sanitize before sending to API
  const clean = sanitizeItemPayload(itemData);
  
  const response = await apiClient.post("/items", clean);
  return response.data;
}
```

## ⚠️ Important Notes

1. **Client-side is NOT enough**: Always validate and sanitize on the backend too
2. **Use parameterized queries**: Prevents SQL injection at database level
3. **Type-specific sanitization**: Use the right function for the input type
4. **Schema validation**: Combine with Zod for comprehensive protection

## 🔒 Protection Coverage

### XSS Protection
- ✅ HTML character escaping
- ✅ Script tag removal
- ✅ Event handler blocking
- ✅ Null byte removal

### SQL Injection Protection
- ✅ SQL keyword removal
- ✅ Comment syntax blocking
- ✅ Union query prevention
- ✅ Quote/semicolon handling

## 🧪 Testing Payloads

### XSS Vectors to Test
```
<script>alert('xss')</script>
<img src=x onerror="alert('xss')">
<iframe src="javascript:alert('xss')"></iframe>
'"><script>alert(String.fromCharCode(88,83,83))</script>
```

### SQL Injection Vectors to Test
```
' OR '1'='1
'; DROP TABLE items; --
UNION SELECT * FROM users--
1' AND '1'='1
admin'--
```

## 📚 Full Documentation

See `SECURITY.md` for comprehensive documentation including:
- Detailed function descriptions
- Implementation guidelines
- Best practices
- Backend integration examples
- Automated testing patterns

## 🆘 Troubleshooting

**Q: My input is being stripped of valid characters**
- A: You might be using the wrong sanitization function. Check the function reference above.

**Q: Sanitization isn't working for a new form**
- A: Make sure to import from the right module and apply sanitization at the right layer.

**Q: The backend is getting unsanitized data**
- A: Always implement server-side validation too. Client-side is defense-in-depth.

## ✅ Checklist for New Forms

- [ ] Import sanitization utilities
- [ ] Add sanitization to schema using `sanitized*` helpers
- [ ] Apply `sanitizeSearch()` to search inputs
- [ ] Test with XSS payloads
- [ ] Test with SQL injection payloads
- [ ] Implement server-side validation
- [ ] Use parameterized queries on backend
