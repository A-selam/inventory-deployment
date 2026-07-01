import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type ProfileCardProps = {
  collapsed?: boolean;
  className?: string;
};

export default function ProfileCard({
  collapsed,
  className,
}: ProfileCardProps) {
  return (
    <button
      type="button"
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border border-border bg-sidebar-accent px-3 py-2 text-right justify-around transition-colors hover:bg-accent",
        collapsed && "justify-center px-2",
        className,
      )}
      aria-label="User profile menu"
    >
      {!collapsed ? (
        <div className="text-right">
          <div className="text-sm font-medium text-sidebar-foreground">
            Admin User
          </div>
          <div className="label-caps text-[10px] text-sidebar-accent-foreground">
            SYSTEM MANAGER
          </div>
        </div>
      ) : null}
      <Avatar className="size-9 border border-border">
        <AvatarFallback className="bg-muted text-xs font-semibold text-sidebar-foreground">
          AU
        </AvatarFallback>
      </Avatar>
    </button>
  );
}
