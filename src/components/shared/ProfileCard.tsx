"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, KeyRound, LogOut, X } from "lucide-react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Button from "@/components/ui/button";
import Modal from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import Label from "@/components/ui/label";
import { useAuthStore } from "@/stores/auth-store";
import { useToast } from "@/providers/ToastProvider";
import {
  useProfile,
  useUpdateProfile,
  useChangePassword,
} from "@/hooks/useProfile";
import { getApiErrorMessage } from "@/lib/api-errors";
import {
  updateProfileSchema,
  changePasswordSchema,
  type UpdateProfileValues,
  type ChangePasswordValues,
} from "@/schemas/profile";
import { cn } from "@/lib/utils";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

function formatDate(iso?: string | null, fallback = "Never"): string {
  if (!iso) return fallback;
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(
    new Date(iso),
  );
}

const ROLE_LABEL: Record<string, string> = {
  admin: "Administrator",
  operator: "Operator",
  viewer: "Viewer",
};

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-violet-100 text-violet-700",
  operator: "bg-blue-100 text-blue-700",
  viewer: "bg-slate-100 text-slate-600",
};

// ─── Edit Profile Modal ───────────────────────────────────────────────────────

function EditProfileModal({
  open,
  onClose,
  name,
  profilePicture,
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  profilePicture?: string | null;
}) {
  const { toast } = useToast();
  const mutation = useUpdateProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UpdateProfileValues>({
    resolver: standardSchemaResolver(updateProfileSchema),
  });

  useEffect(() => {
    if (open) reset({ name, profile_picture: profilePicture ?? "" });
  }, [open, name, profilePicture, reset]);

  const onSubmit = async (values: UpdateProfileValues) => {
    try {
      await mutation.mutateAsync({
        name: values.name,
        profile_picture: values.profile_picture || undefined,
      });
      toast({
        title: "Profile updated",
        description: "Your changes have been saved.",
        variant: "success",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Could not update profile",
        description: getApiErrorMessage(err),
        variant: "error",
      });
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit Profile"
      description="Update your display name and profile picture URL."
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="profile-card-edit-form"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Saving..." : "Save changes"}
          </Button>
        </>
      }
    >
      <form
        id="profile-card-edit-form"
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <Label className="mb-1.5 block">FULL NAME</Label>
          <Input
            placeholder="Your full name"
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
          {errors.name ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.name.message}
            </p>
          ) : null}
        </div>
        <div>
          <Label className="mb-1.5 block">PROFILE PICTURE URL</Label>
          <Input
            placeholder="https://example.com/avatar.jpg"
            aria-invalid={Boolean(errors.profile_picture)}
            {...register("profile_picture")}
          />
          {errors.profile_picture ? (
            <p className="mt-1 text-xs text-destructive">
              {errors.profile_picture.message}
            </p>
          ) : null}
          <p className="mt-1 text-xs text-muted-foreground">
            Leave empty to use your initials avatar.
          </p>
        </div>
      </form>
    </Modal>
  );
}

// ─── Change Password Modal ────────────────────────────────────────────────────

function ChangePasswordModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { toast } = useToast();
  const mutation = useChangePassword();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordValues>({
    resolver: standardSchemaResolver(changePasswordSchema),
  });

  const onSubmit = async (values: ChangePasswordValues) => {
    try {
      await mutation.mutateAsync(values);
      toast({
        title: "Password changed",
        description: "Your password has been updated.",
        variant: "success",
      });
      reset();
      onClose();
    } catch (err) {
      toast({
        title: "Could not change password",
        description: getApiErrorMessage(
          err,
          "Check your current password and try again.",
        ),
        variant: "error",
      });
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const fields = [
    { key: "current_password", label: "CURRENT PASSWORD" },
    { key: "new_password", label: "NEW PASSWORD" },
    { key: "confirm_new_password", label: "CONFIRM NEW PASSWORD" },
  ] as const;

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Change Password"
      description="Enter your current password and choose a new one."
      footer={
        <>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={mutation.isPending}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="profile-card-pw-form"
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Updating..." : "Update password"}
          </Button>
        </>
      }
    >
      <form
        id="profile-card-pw-form"
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        {fields.map(({ key, label }) => (
          <div key={key}>
            <Label className="mb-1.5 block">{label}</Label>
            <Input
              type="password"
              placeholder="••••••••"
              aria-invalid={Boolean(errors[key])}
              {...register(key)}
            />
            {errors[key] ? (
              <p className="mt-1 text-xs text-destructive">
                {errors[key]?.message}
              </p>
            ) : null}
          </div>
        ))}
      </form>
    </Modal>
  );
}

// ─── Profile overlay panel ────────────────────────────────────────────────────

function ProfileOverlay({
  open,
  onClose,
  onChangePassword,
}: {
  open: boolean;
  onClose: () => void;
  onEditProfile: () => void;
  onChangePassword: () => void;
}) {
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data } = useProfile();
  const profile = data?.data;

  const user = useAuthStore((s) => s.user);
  const displayName = profile?.name ?? user?.name ?? "User";
  const displayEmail = profile?.email ?? user?.email ?? "";
  const displayRole = profile?.role ?? user?.role ?? "";
  const profilePicture = profile?.profile_picture ?? null;
  const createdAt = profile?.created_at ?? null;
  const lastLogin = profile?.last_login ?? null;

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Focus trap — focus panel when it opens
  useEffect(() => {
    if (open) {
      const id = window.setTimeout(() => panelRef.current?.focus(), 10);
      return () => window.clearTimeout(id);
    }
  }, [open]);

  const handleLogout = () => {
    onClose();
    logout();
    router.replace("/login");
  };

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close profile panel"
        className="fixed inset-0 z-40"
        onClick={onClose}
        tabIndex={-1}
      />

      {/* Panel — positioned above the sidebar footer */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Profile menu"
        tabIndex={-1}
        className={cn(
          "fixed bottom-16 left-3 z-50 w-72 rounded-[12px] border border-border bg-card shadow-xl outline-none",
          "animate-in fade-in zoom-in-95 slide-in-from-bottom-2 duration-150",
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 border-b border-border px-4 py-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 shrink-0 border-2 border-border">
              {profilePicture ? (
                <AvatarImage src={profilePicture} alt={displayName} />
              ) : null}
              <AvatarFallback className="bg-primary text-sm font-bold text-primary-foreground">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">
                {displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {displayEmail}
              </p>
              <Badge
                className={cn(
                  "mt-1 capitalize text-[10px]",
                  ROLE_BADGE[displayRole] ?? "bg-muted text-foreground",
                )}
              >
                {ROLE_LABEL[displayRole] ?? displayRole}
              </Badge>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="mt-0.5 shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Meta */}
        {createdAt || lastLogin !== undefined ? (
          <div className="border-b border-border px-4 py-3 space-y-1.5">
            {createdAt ? (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <CalendarDays className="size-3.5 shrink-0" />
                <span>Joined {formatDate(createdAt)}</span>
              </div>
            ) : null}
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <CalendarDays className="size-3.5 shrink-0" />
              <span>Last login: {formatDate(lastLogin, "Never")}</span>
            </div>
          </div>
        ) : null}

        {/* Actions */}
        <div className="p-2">
          <button
            type="button"
            onClick={() => {
              onClose();
              onChangePassword();
            }}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-foreground transition-colors hover:bg-muted"
          >
            <KeyRound className="size-4 shrink-0 text-muted-foreground" />
            Change Password
          </button>

          <div className="my-1.5 h-px bg-border" />

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-destructive transition-colors hover:bg-destructive/10"
          >
            <LogOut className="size-4 shrink-0" />
            Log Out
          </button>
        </div>
      </div>
    </>
  );
}

// ─── ProfileCard (trigger) ────────────────────────────────────────────────────

type ProfileCardProps = {
  collapsed?: boolean;
  className?: string;
};

export default function ProfileCard({
  collapsed,
  className,
}: ProfileCardProps) {
  const user = useAuthStore((s) => s.user);
  const initials = getInitials(user?.name);
  const roleLabel = ROLE_LABEL[user?.role ?? ""] ?? "User";

  const [overlayOpen, setOverlayOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [pwOpen, setPwOpen] = useState(false);

  // Profile data for edit modal seed values
  const { data } = useProfile();
  const profile = data?.data;

  return (
    <>
      {/* ── Trigger button ── */}
      <button
        type="button"
        onClick={() => setOverlayOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-border bg-sidebar-accent px-3 py-2 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          collapsed ? "justify-center px-2" : "justify-between",
          className,
        )}
        aria-label="Open user menu"
        aria-expanded={overlayOpen}
        aria-haspopup="dialog"
      >
        {!collapsed ? (
          <div className="min-w-0 flex-1 text-left">
            <div className="truncate text-sm font-medium text-sidebar-foreground">
              {user?.name ?? "User"}
            </div>
            <div className="label-caps truncate text-[10px] text-sidebar-accent-foreground">
              {roleLabel.toUpperCase()}
            </div>
          </div>
        ) : null}

        <Avatar className="size-9 shrink-0 border border-border">
          {profile?.profile_picture ? (
            <AvatarImage
              src={profile.profile_picture}
              alt={user?.name ?? "User"}
            />
          ) : null}
          <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
            {initials}
          </AvatarFallback>
        </Avatar>
      </button>

      {/* ── Profile overlay ── */}
      <ProfileOverlay
        open={overlayOpen}
        onClose={() => setOverlayOpen(false)}
        onEditProfile={() => setEditOpen(true)}
        onChangePassword={() => setPwOpen(true)}
      />

      {/* ── Edit Profile modal ── */}
      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        name={profile?.name ?? user?.name ?? ""}
        profilePicture={profile?.profile_picture}
      />

      {/* ── Change Password modal ── */}
      <ChangePasswordModal open={pwOpen} onClose={() => setPwOpen(false)} />
    </>
  );
}
