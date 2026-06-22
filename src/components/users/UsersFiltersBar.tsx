// import Card from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UserRole } from "@/lib/users";

type RoleOption = {
  value: UserRole | "";
  label: string;
};

const roleOptions: RoleOption[] = [
  { value: "", label: "All users" },
  { value: "admin", label: "Administrators" },
  { value: "operator", label: "Operators" },
  { value: "viewer", label: "Viewers" },
];

export default function UsersFiltersBar({
  role,
  onRoleChange,
}: {
  role?: UserRole;
  onRoleChange: (role?: UserRole) => void;
}) {
  const activeRole = role ?? "";

  return (
    // <Card className="rounded-[12px] border-border p-4">
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="inline-flex rounded-lg bg-muted p-1">
        {roleOptions.map((option) => {
          const isActive = activeRole === option.value;
          return (
            <button
              key={option.value || "all"}
              type="button"
              onClick={() =>
                onRoleChange(option.value ? option.value : undefined)
              }
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
    // </Card>
  );
}
