# RBAC Quick Reference

## Quick Start - Add Permission Check to a Component

### Option 1: Using useRole Hook (Recommended for complex logic)
```typescript
import { useRole } from "@/hooks/useRole";

export function MyComponent() {
  const { can, isAdmin, user } = useRole();

  return (
    <>
      {can("delete:items") && <DeleteButton />}
      {isAdmin() && <AdminPanel />}
    </>
  );
}
```

### Option 2: Using CanAccess Component (Recommended for simple checks)
```typescript
import { CanAccess } from "@/components/rbac/CanAccess";

export function MyComponent() {
  return (
    <CanAccess permission="delete:items">
      <DeleteButton />
    </CanAccess>
  );
}
```

## All Permissions Reference

| Permission | Admin | Operator | Viewer |
|-----------|-------|----------|--------|
| manage:users | ✅ | ❌ | ❌ |
| invite:users | ✅ | ❌ | ❌ |
| delete:users | ✅ | ❌ | ❌ |
| edit:users | ✅ | ❌ | ❌ |
| manage:inventory | ✅ | ❌ | ❌ |
| create:items | ✅ | ✅ | ❌ |
| edit:items | ✅ | ✅ | ❌ |
| delete:items | ✅ | ❌ | ❌ |
| manage:vendors | ✅ | ❌ | ❌ |
| create:vendors | ✅ | ❌ | ❌ |
| edit:vendors | ✅ | ❌ | ❌ |
| delete:vendors | ✅ | ❌ | ❌ |
| manage:warehouses | ✅ | ❌ | ❌ |
| create:warehouses | ✅ | ❌ | ❌ |
| edit:warehouses | ✅ | ❌ | ❌ |
| delete:warehouses | ✅ | ❌ | ❌ |
| manage:categories | ✅ | ❌ | ❌ |
| create:categories | ✅ | ❌ | ❌ |
| edit:categories | ✅ | ❌ | ❌ |
| delete:categories | ✅ | ❌ | ❌ |
| create:transactions | ✅ | ✅ | ❌ |
| edit:transactions | ✅ | ❌ | ❌ |
| delete:transactions | ✅ | ❌ | ❌ |
| view:transactions | ✅ | ✅ | ✅ |
| view:reports | ✅ | ✅ | ✅ |
| import:data | ✅ | ❌ | ❌ |
| export:data | ✅ | ❌ | ❌ |
| manage:replenishment | ✅ | ❌ | ❌ |
| create:replenishment | ✅ | ✅ | ❌ |
| edit:replenishment | ✅ | ✅ | ❌ |
| delete:replenishment | ✅ | ❌ | ❌ |
| view:inventory | ✅ | ✅ | ✅ |
| view:dashboard | ✅ | ✅ | ✅ |

## useRole Hook Methods

```typescript
const {
  // Current user info
  user,           // User object or null
  role,           // "admin" | "operator" | "viewer"

  // Permission checks
  can,            // (permission: string) => boolean
  canAny,         // (permissions: string[]) => boolean (OR logic)
  canAll,         // (permissions: string[]) => boolean (AND logic)

  // Role checks
  isRole,         // (role: UserRole) => boolean
  isAnyRole,      // (roles: UserRole[]) => boolean
  isAdmin,        // () => boolean
  isOperator,     // () => boolean
  isViewer,       // () => boolean

  // Role info
  getRoleLabel,        // () => string
  getRoleDescription,  // () => string
  getPermissions,      // () => string[]

  // Auth status
  isAuthenticated,     // boolean
} = useRole();
```

## CanAccess Component Props

```typescript
<CanAccess
  // Single permission
  permission="manage:users"

  // Multiple permissions (use with mode)
  permissions={["create:items", "delete:items"]}
  mode="all"  // "all" (AND) or "any" (OR)

  // Role-based
  role="admin"                          // Single role
  role={["admin", "operator"]}          // Multiple roles (OR)

  // Content
  children={<MyComponent />}

  // Fallback content
  fallback={<AccessDenied />}
>
  Content here
</CanAccess>
```

## Common Patterns

### Show button for specific role
```typescript
<CanAccess role="admin">
  <AdminButton />
</CanAccess>
```

### Show button for multiple roles
```typescript
<CanAccess role={["admin", "operator"]}>
  <EditButton />
</CanAccess>
```

### Show with fallback
```typescript
<CanAccess
  permission="delete:items"
  fallback={<button disabled>Delete (No Access)</button>}
>
  <DeleteButton />
</CanAccess>
```

### Complex permission logic
```typescript
const { can, canAny } = useRole();

{canAny(["edit:items", "edit:vendors"]) && (
  <EditMenu />
)}
```

### Conditional page access
```typescript
if (!can("manage:users")) {
  return <AccessDenied />;
}
return <UserManagementPage />;
```

## Navigation Item with Permissions

```typescript
// In dashboard-nav.ts
{
  label: "Users",
  href: "/users",
  icon: Users,
  requiredPermission: "manage:users",
}
```

Navigation automatically filters based on user permissions.

## File Locations

- **Permission definitions**: `src/lib/rbac.ts`
- **React hook**: `src/hooks/useRole.ts`
- **Conditional component**: `src/components/rbac/CanAccess.tsx`
- **Navigation config**: `src/components/layout/dashboard-nav.ts`
- **Full guide**: `RBAC_GUIDE.md`

## Implementation Checklist

When adding RBAC to a new component:

- [ ] Import `useRole` or use `CanAccess`
- [ ] Check permission/role at the start
- [ ] Hide buttons/features if no permission
- [ ] Add fallback UI if needed
- [ ] Test with different user roles
- [ ] Consider edge cases (empty states, loading)

## Testing Different Roles

1. Open browser DevTools
2. Go to Application > Session Storage
3. Find `stocklogic-auth` entry
4. Modify the `user.role` field to test:
   - `"admin"` - full access
   - `"operator"` - limited access
   - `"viewer"` - read-only access

## Role Descriptions

**Admin**: Full system access - Manage users, inventory, vendors, import/export

**Operator**: Can create/update items and transactions, view reports. Cannot manage users or delete system resources.

**Viewer**: Read-only access - View inventory, reports, and dashboard analytics

## Need Help?

See `RBAC_GUIDE.md` for:
- Detailed permission reference
- Backend integration examples
- Troubleshooting guide
- Security best practices
