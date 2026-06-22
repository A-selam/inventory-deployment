"use client";

import { Copy, MoreVertical, Pencil } from "lucide-react";

import Button from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserSummary } from "@/lib/users";
import { useToast } from "@/providers/ToastProvider";

async function copyToClipboard(text: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  if (typeof document === "undefined") return;
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  document.body.removeChild(textarea);
}

export default function UserRowActions({ user }: { user: UserSummary }) {
  const { toast } = useToast();

  return (
    <div className="flex justify-end gap-2 opacity-0 transition-opacity group-hover:opacity-100">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="size-9 rounded-lg p-0"
        onClick={() => {
          toast({
            title: "Access editing not connected yet",
            description:
              "Wire role updates when the backend endpoint is ready.",
            variant: "info",
          });
        }}
        aria-label="Edit access"
      >
        <Pencil className="size-4 text-muted-foreground" />
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="size-9 rounded-lg p-0"
            aria-label="Open user actions"
          >
            <MoreVertical className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            onSelect={async () => {
              await copyToClipboard(user.email);
              toast({
                title: "Copied email",
                description: user.email,
                variant: "success",
              });
            }}
          >
            <Copy className="size-4" />
            Copy email
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={async () => {
              await copyToClipboard(user.id);
              toast({
                title: "Copied user ID",
                description: user.id,
                variant: "success",
              });
            }}
          >
            <Copy className="size-4" />
            Copy user ID
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
