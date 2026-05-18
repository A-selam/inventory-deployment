import { Progress } from "@/components/ui/progress";

export default function StorageUsedCard() {
  return (
    <div className="mt-auto p-4">
      <div className="rounded-xl border border-border bg-sidebar-accent p-4 shadow-sm">
        <div className="label-caps text-[10px] text-sidebar-accent-foreground">
          STORAGE USED
        </div>
        <div className="mt-3">
          <Progress value={65} className="w-full" />
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          65% of 10GB used
        </div>
      </div>
    </div>
  );
}
