# Input Sanitization - Integration Checklist

Complete this checklist to ensure all forms and search fields in your application are properly protected.

## ✅ Already Completed

- [x] Core sanitization library created (`src/lib/sanitize.ts`)
- [x] Zod schema helpers created (`src/schemas/sanitized.ts`)
- [x] React hooks for search created (`src/hooks/useSanitizedSearch.ts`)
- [x] API sanitization middleware created (`src/lib/api-sanitization.ts`)
- [x] Item filters updated with sanitization
- [x] Transaction filters updated with sanitization
- [x] Replenishment filters updated with sanitization
- [x] Item schema updated with sanitization
- [x] Build verified (no TypeScript errors)
- [x] Documentation created (SECURITY.md, Quick Reference, etc.)

## 📋 Components to Update

### Search/Filter Components

- [ ] `src/components/categories/CategoryFilters.tsx`
  - [ ] Import `useSanitizedSearch` hook
  - [ ] Apply sanitization to search inputs
  
- [ ] `src/components/warehouses/WarehouseFilters.tsx`
  - [ ] Import `useSanitizedSearch` hook
  - [ ] Apply sanitization to search inputs
  
- [ ] `src/components/vendors/VendorFilters.tsx`
  - [ ] Import `useSanitizedSearch` hook
  - [ ] Apply sanitization to search inputs

- [ ] `src/components/users/UsersFiltersBar.tsx`
  - [ ] Import `useSanitizedSearch` hook
  - [ ] Apply sanitization to search inputs

- [ ] `src/components/alerts/AlertsPageClient.tsx`
  - [ ] Review for any search/filter fields
  - [ ] Apply sanitization if present

### Form Components

- [ ] `src/components/categories/CreateCategoryForm.tsx`
  - [ ] Update schema with `sanitizedString` helpers
  - [ ] Test with XSS payloads

- [ ] `src/components/categories/UpdateCategoryForm.tsx`
  - [ ] Update schema with `sanitizedString` helpers
  - [ ] Test with XSS payloads

- [ ] `src/components/vendors/create-vendor/CreateVendorForm.tsx`
  - [ ] Update schema with appropriate sanitizers
  - [ ] Apply sanitization to all text fields

- [ ] `src/components/vendors/create-vendor/CreateVendorBasicInfoSection.tsx`
  - [ ] Review for unsanitized inputs
  - [ ] Apply sanitization helpers

- [ ] `src/components/vendors/create-vendor/CreateVendorContactSection.tsx`
  - [ ] Add email sanitization
  - [ ] Sanitize phone and contact fields

- [ ] `src/components/warehouses/CreateWarehouseForm.tsx`
  - [ ] Update schema with sanitized fields
  - [ ] Test with various payloads

- [ ] `src/components/warehouses/UpdateWarehouseForm.tsx`
  - [ ] Update schema with sanitized fields

- [ ] `src/components/users/InviteUserForm.tsx`
  - [ ] Add email sanitization
  - [ ] Validate email format

- [ ] `src/components/items/update-item/UpdateItemForm.tsx`
  - [ ] Verify uses sanitized schema
  - [ ] Test with attack payloads

- [ ] `src/components/transactions/create-transaction/CreateTransactionForm.tsx`
  - [ ] Review for any text inputs
  - [ ] Apply appropriate sanitization

- [ ] `src/components/auth/LoginForm.tsx`
  - [ ] Add email sanitization
  - [ ] Test with various payloads

- [ ] `src/components/auth/InviteAcceptanceForm.tsx`
  - [ ] Add password field considerations
  - [ ] Sanitize any text inputs

### Schema Files to Update

- [ ] `src/schemas/category.ts` (if exists)
  - [ ] Use `sanitizedString` helpers
  
- [ ] `src/schemas/vendor.ts` (if exists)
  - [ ] Use `sanitizedString` and `sanitizedEmail`
  
- [ ] `src/schemas/warehouse.ts` (if exists)
  - [ ] Use `sanitizedString` helpers
  
- [ ] `src/schemas/user.ts` (if exists)
  - [ ] Use `sanitizedEmail` helper
  
- [ ] `src/schemas/transaction.ts` (if exists)
  - [ ] Use `sanitizedString` helpers
  
- [ ] `src/schemas/auth.ts` (if exists)
  - [ ] Use `sanitizedEmail` helper

## 🧪 Testing Checklist

For each updated component, perform these tests:

### XSS Test Cases
- [ ] `<script>alert('xss')</script>`
- [ ] `<img src=x onerror="alert('xss')">`
- [ ] `'"><script>alert(String.fromCharCode(88,83,83))</script>`
- [ ] `<iframe src="javascript:alert('xss')"></iframe>`
- [ ] Test with DevTools that data is escaped before sending

### SQL Injection Test Cases
- [ ] `' OR '1'='1`
- [ ] `'; DROP TABLE items; --`
- [ ] `UNION SELECT * FROM users--`
- [ ] `admin'--`

### Normal Input Test Cases
- [ ] Single word: `Product`
- [ ] Multiple words: `Product Name 123`
- [ ] With numbers: `SKU-001-ITEM`
- [ ] With special chars (allowed): `$99.99`, `50%`
- [ ] With spaces: `  Product Name  ` (should be trimmed)
- [ ] Empty string: `` (should be handled gracefully)

## 📝 Implementation Steps for Each Component

### For Search/Filter Fields:
```typescript
// 1. Import the hook
import { useSanitizedSearch } from "@/hooks/useSanitizedSearch";

// 2. Use in component
const { sanitizeSearch } = useSanitizedSearch();

// 3. Apply to input
onChange={(e) => {
  const sanitized = sanitizeSearch(e.target.value);
  // Use sanitized value
}}
```

### For Form Schemas:
```typescript
// 1. Import helpers
import { sanitizedString, sanitizedEmail } from "@/schemas/sanitized";

// 2. Update schema
const schema = z.object({
  name: sanitizedString({ min: 1, max: 100 }),
  email: sanitizedEmail(),
});
```

### For API Calls:
```typescript
// 1. Import sanitizer
import { sanitizeItemPayload } from "@/lib/api-sanitization";

// 2. Sanitize before sending
const clean = sanitizeItemPayload(data);
await apiClient.post("/endpoint", clean);
```

## 🔒 Server-Side Validation Checklist

For each form/API endpoint, ensure backend has:

- [ ] Schema validation (validate all fields)
- [ ] Type checking (confirm data types)
- [ ] Length validation (check string lengths)
- [ ] Format validation (regex for specific formats)
- [ ] Parameterized queries (never string concatenation)
- [ ] Error handling (graceful error messages)

Example backend validation:
```typescript
// Backend pseudocode
@Post('/items')
async createItem(body: CreateItemDTO) {
  // 1. Validate schema
  const validated = await createItemSchema.parseAsync(body);
  
  // 2. Use parameterized query
  const item = await db.query(
    'INSERT INTO items (name, sku) VALUES ($1, $2)',
    [validated.name, validated.sku]
  );
  
  // 3. Return result
  return item;
}
```

## 📊 Progress Tracking

### Phase 1: Filter Components (5 components)
- [x] ItemsFilters.tsx ✓
- [x] TransactionFilters.tsx ✓
- [x] ReplenishmentFilters.tsx ✓
- [ ] CategoryFilters.tsx
- [ ] WarehouseFilters.tsx
- [ ] VendorFilters.tsx
- [ ] UsersFiltersBar.tsx

**Progress:** 3/7 (43%)

### Phase 2: Form Schemas (6 schemas)
- [x] Item schema ✓
- [ ] Category schema
- [ ] Vendor schema
- [ ] Warehouse schema
- [ ] User schema
- [ ] Transaction schema

**Progress:** 1/6 (17%)

### Phase 3: Form Components (12 components)
- [ ] Category forms
- [ ] Vendor forms
- [ ] Warehouse forms
- [ ] User forms
- [ ] Transaction forms
- [ ] Auth forms
- [ ] Item detail forms

**Progress:** 0/12 (0%)

### Overall Completion
**Progress:** 4/25 (16%)

## 🎯 Quick Start Template

Use this template when updating a component:

```typescript
"use client";

import { useSanitizedSearch } from "@/hooks/useSanitizedSearch";
// ... other imports

export function MyComponent() {
  const { sanitizeSearch } = useSanitizedSearch();
  
  const handleChange = (value: string) => {
    const sanitized = sanitizeSearch(value);
    // Process sanitized value
  };

  return (
    <input
      onChange={(e) => handleChange(e.target.value)}
    />
  );
}
```

## 📚 Reference Links

- **Core Functions:** `src/lib/sanitize.ts`
- **Schema Helpers:** `src/schemas/sanitized.ts`
- **React Hooks:** `src/hooks/useSanitizedSearch.ts`
- **API Middleware:** `src/lib/api-sanitization.ts`
- **Full Documentation:** `SECURITY.md`
- **Quick Reference:** `SANITIZATION_QUICK_REFERENCE.md`
- **Test Examples:** `src/lib/__tests__/sanitize.test.ts`

## 🚨 Important Reminders

1. **Client-side is NOT enough**
   - Always validate on the backend too
   - Use parameterized queries for all database access

2. **Test with real attack payloads**
   - XSS: `<script>alert('xss')</script>`
   - SQL: `'; DROP TABLE items; --`

3. **Keep backend in sync**
   - Match client-side validation logic
   - Don't trust client input

4. **Update this checklist as you go**
   - Mark items complete with [x]
   - Track progress

## 📞 Support

If you encounter issues:
1. Check the error in browser console
2. Review `SANITIZATION_QUICK_REFERENCE.md`
3. Check test examples in `src/lib/__tests__/sanitize.test.ts`
4. Refer to full documentation in `SECURITY.md`

---

**Last Updated:** 2024
**Estimated Time to Complete:** 2-3 hours
**Priority:** High (Security)
