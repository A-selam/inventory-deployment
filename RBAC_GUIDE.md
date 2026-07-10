# Role-Based Access Control (RBAC) Implementation Guide

## Overview

This application implements comprehensive role-based access control to ensure users only access features and data they're authorized for. The system supports three roles with distinct permission levels.

## Roles & Permissions

### Admin Role
**Full system access** - Can manage all aspects of the application

Permissions:
- User Management: `manage:users`, `invite:users`, `delete:users`, `edit:users`
- Inventory: `manage:inventory`, `create:items`, `edit:items`, `delete:items`
- Vendors: `manage:vendors`, `create:vendors`, `edit:vendors`, `delete:vendors`
- Warehouses: `manage:warehouses`, `create:warehouses`, `edit:warehouses`, `delete:warehouses`
- Categories: `manage:categories`, `create:categories`, `edit:categories`, `delete:categories`
- Transactions: `create:transactions`, `edit:transactions`, `delete:transactions`, `view:transactions`
- Reports: `view:reports`
- Import/Export: `import:data`, `export:data`
- Replenishment: `manage:replenishment`, `create:replenishment`, `edit:replenishment`, `delete:replenishment`

### Operator Role
**Limited operational access** - Can create and update items, manage transactions

Permissions:
- Inventory: `create:items`, `edit:items`
- Transactions: `create:transactions`, `view:transactions`
- Reports: `view:reports`
- Replenishment: `create:replenishment`, `edit:replenishment`
- Dashboard: `view:dashboard`

Cannot:
- Manage users
- Delete system-level resources
- Manage vendors, warehouses, categories
- Import/export data

### Viewer Role
**Read-only access** - Can only view data, no modifications allowed

Permissions:
- Inventory: `view:inventory`
- Reports: `view:reports`
- Dashboard: `view:dashboard`
- Transactions: `view:transactions`

## Core Files

### 1. **src/lib/rbac.ts** - Permission Engine
Centralized permission definitions and checker functions.

```typescript
// Check single permission
hasPermission(user, "create:items")

// Check multiple permissions (AND logic)
hasAllPermissions(user, ["create:items", "delete:items"])

// Check if user has any permission (OR logic)
hasAnyPermission(user, ["create:items", "edit:items"])

// Role checks
isAdmin(user)
isOperator(user)
isViewer(user)
```

### 2. **src/hooks/useRole.ts** - React Hook
Easy access to permission checking within components.

```typescript
const { can, isAdmin, user } = useRole();
```

### 3. **src/components/rbac/CanAccess.tsx** - Conditional Component
Conditionally render content based on permissions.

```typescript
<CanAccess permission="manage:users">
  <UserManagementButton />
</CanAccess>
```

### 4. **src/components/layout/dashboard-nav.ts** - Navigation Configuration
Navigation links with permission requirements.

## Usage Patterns

### Pattern 1: Using the useRole Hook

```typescript
import { useRole } from "@/hooks/useRole";

export function ItemsForm() {
  const { can, isAdmin, user } = useRole();

  return (
    <div>
      {can("create:items") && (
        <button onClick={handleCreate}>Create Item</button>
      )}

      {can("delete:items") && (
        <button onClick={handleDelete}>Delete Item</button>
      )}

      {isAdmin() && (
        <button onClick={handleAdminAction}>Admin Action</button>
      )}
    </div>
  );
}
```

### Pattern 2: Using the CanAccess Component

```typescript
import { CanAccess } from "@/components/rbac/CanAccess";

export function Dashboard() {
  return (
    <>
      {/* Single permission check */}
      <CanAccess permission="manage:users">
        <UserManagementPanel />
      </CanAccess>

      {/* Multiple roles (OR logic) */}
      <CanAccess role={["admin", "operator"]}>
        <OperationsPanel />
      </CanAccess>

      {/* With fallback */}
      <CanAccess
        permission="view:reports"
        fallback={<p>You don't have access to reports</p>}
      >
        <ReportsPanel />
      </CanAccess>

      {/* AND logic for permissions */}
      <CanAccess
        permissions={["create:items", "edit:items"]}
        mode="all"
      >
        <ItemManagementPanel />
      </CanAccess>
    </>
  );
}
```

### Pattern 3: Permission-Based Navigation

```typescript
// In dashboard-nav.ts
export const DASHBOARD_NAV_LINKS: DashboardNavItem[] = [
  {
    label: "Users",
    href: "/users",
    icon: Users,
    requiredPermission: "manage:users",
  },
  {
    label: "Items",
    href: "/inventory",
    icon: Package,
    requiredPermission: "view:inventory",
    children: [
      {
        label: "Categories",
        href: "/categories",
        requiredPermission: "manage:categories",
      },
    ],
  },
];
```

The sidebar automatically filters navigation items based on user permissions.

### Pattern 4: Page-Level Access Control

```typescript
import { CanAccess } from "@/components/rbac/CanAccess";

export default function AdminPanel() {
  return (
    <CanAccess
      permission="manage:users"
      fallback={
        <Card>
          <div className="label-caps">Access Denied</div>
          <p>You don't have permission to access this section.</p>
        </Card>
      }
    >
      <UserManagementContent />
    </CanAccess>
  );
}
```

## Implementation Checklist

### Already Implemented
- [x] RBAC library with all permission definitions
- [x] `useRole` hook for easy component access
- [x] `CanAccess` component for conditional rendering
- [x] Updated dashboard navigation with permission filters
- [x] Updated Items table with permission-based actions
- [x] Protected Users page (admin-only)
- [x] Role-based button visibility in components

### To Implement in Other Components

For each component with actions/buttons:

1. Import `useRole` hook:
   ```typescript
   import { useRole } from "@/hooks/useRole";
   ```

2. Get permissions:
   ```typescript
   const { can } = useRole();
   ```

3. Conditionally show buttons:
   ```typescript
   {can("delete:items") && (
     <DeleteButton onClick={handleDelete} />
   )}
   ```

Or use `CanAccess` component:
```typescript
<CanAccess permission="delete:items">
  <DeleteButton onClick={handleDelete} />
</CanAccess>
```

## Components That Need RBAC Updates

Priority order for implementation:

### High Priority (Critical)
- [ ] Vendors management (vendor-related actions)
- [ ] Warehouses management (warehouse-related actions)
- [ ] Categories management (category-related actions)
- [ ] Transactions table (delete/edit buttons)
- [ ] Replenishment page (delete/edit actions)

### Medium Priority
- [ ] Import/export features (file upload buttons)
- [ ] Reports page (download buttons)
- [ ] Transaction details (action buttons)
- [ ] Item details page (edit/delete buttons)

### Low Priority
- [ ] Alerts page (configuration options)
- [ ] Dashboard (admin-specific widgets)
- [ ] Sidebar (already implemented)

## Testing RBAC

### Test with Different Roles

1. **Admin User**
   - Should see all navigation items
   - Should see all action buttons
   - Should have access to all pages

2. **Operator User**
   - Should NOT see Users menu
   - Should NOT see vendor/warehouse management
   - Should see Items, Transactions, Reports
   - Should NOT see import/export buttons

3. **Viewer User**
   - Should only see read-only content
   - Should NOT see any action buttons
   - Should NOT see create/edit/delete options

### Manual Testing Checklist

```
[ ] Login as Admin - verify all features visible
[ ] Login as Operator - verify limited access
[ ] Login as Viewer - verify read-only mode
[ ] Check sidebar navigation filters correctly
[ ] Check buttons appear/disappear based on role
[ ] Check modal/form actions respect permissions
[ ] Check table row actions respect permissions
[ ] Try accessing protected pages directly
```

## Backend Integration

Current implementation is **client-side only**. For production, also implement:

### 1. API Route Protection
```typescript
import { hasPermission } from "@/lib/rbac";

export async function GET(req: Request) {
  const user = await getSessionUser(req);
  
  if (!hasPermission(user, "view:reports")) {
    return new Response("Unauthorized", { status: 403 });
  }
  
  return getReports();
}
```

### 2. Database-Level Row Level Security (RLS)
Ensure users can only query data they have permission to access.

### 3. Audit Logging
Log permission checks and access attempts for security auditing.

## API Permissions Reference

Map each API endpoint to required permissions:

```typescript
// Permissions for common operations
GET    /api/items           -> view:inventory
POST   /api/items           -> create:items
PUT    /api/items/:id       -> edit:items
DELETE /api/items/:id       -> delete:items

GET    /api/vendors         -> manage:vendors OR view:inventory
POST   /api/vendors         -> manage:vendors
PUT    /api/vendors/:id     -> manage:vendors
DELETE /api/vendors/:id     -> manage:vendors AND delete:vendors

GET    /api/users           -> manage:users
POST   /api/users           -> manage:users AND invite:users
PUT    /api/users/:id       -> manage:users AND edit:users
DELETE /api/users/:id       -> manage:users AND delete:users

GET    /api/reports         -> view:reports
EXPORT /api/reports/export  -> export:data
```

## Adding New Roles

To add a new role (e.g., "supervisor"):

1. Update `User` type in `src/types/auth.ts`:
   ```typescript
   role: "admin" | "operator" | "viewer" | "supervisor";
   ```

2. Add permissions in `src/lib/rbac.ts`:
   ```typescript
   supervisor: new Set([
     "create:items",
     "edit:items",
     "view:reports",
     // ... other permissions
   ]),
   ```

3. Update `rolePermissions` in `src/lib/rbac.ts`

4. Update type in `src/types/auth.ts`

## Permission Naming Convention

Use `<action>:<resource>` format:

- Actions: `create`, `view`, `edit`, `delete`, `manage`, `import`, `export`
- Resources: `users`, `items`, `vendors`, `warehouses`, `reports`, `data`, `categories`, `transactions`, `replenishment`

Examples:
- `create:items` - ability to create items
- `manage:users` - full control over users
- `view:reports` - read-only access to reports
- `export:data` - ability to export system data

## Security Best Practices

1. **Always validate permissions server-side**
   - Client-side checks are for UX, not security
   - Backend must validate every request

2. **Use parameterized queries**
   - Filter results by `user_id` at database level
   - Implement Row Level Security (RLS)

3. **Audit access attempts**
   - Log who accessed what and when
   - Track permission denial events

4. **Principle of least privilege**
   - Grant only necessary permissions
   - Default to deny, explicitly allow

5. **Regular permission reviews**
   - Audit user roles quarterly
   - Remove unnecessary permissions

## Troubleshooting

### Buttons not hiding when expected
1. Verify user role in browser DevTools
2. Check that permission string matches exactly
3. Ensure `useRole` hook is called (client component)
4. Check that `CanAccess` component is not wrapped in RSC-only parent

### Wrong permissions assigned
1. Check permission definitions in `src/lib/rbac.ts`
2. Verify user role from backend matches frontend type
3. Check that permission strings are consistent

### Navigation items not filtering
1. Verify `requiredPermission` is set on nav items
2. Check DashboardSidebar has proper filter logic
3. Ensure `useRole` is working correctly

## Resources

- RBAC Library: `src/lib/rbac.ts`
- Hook: `src/hooks/useRole.ts`
- Component: `src/components/rbac/CanAccess.tsx`
- Auth Store: `src/stores/auth-store.ts`
- Auth Types: `src/types/auth.ts`
