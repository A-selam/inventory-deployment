import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileCard() {
  return (
    <button
      type="button"
      className="ml-2 flex items-center gap-3 rounded-xl border border-border bg-sidebar-accent px-3 py-2 text-left transition-colors hover:bg-accent"
      aria-label="User profile menu"
    >
      <div className="hidden text-right sm:block">
        <div className="text-sm font-medium text-sidebar-foreground">
          Admin User
        </div>
        <div className="label-caps text-[10px] text-sidebar-accent-foreground">
          SYSTEM MANAGER
        </div>
      </div>
      <Avatar className="size-9 border border-border">
        <AvatarFallback className="bg-muted text-xs font-semibold text-sidebar-foreground">
          AU
        </AvatarFallback>
      </Avatar>
    </button>
  );
}
