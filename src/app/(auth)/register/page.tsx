import AuthShell from "@/components/auth/AuthShell";
import InviteAcceptanceForm from "@/components/auth/InviteAcceptanceForm";

export default async function InviteAcceptancePage({
  searchParams,
}: {
  searchParams?: Promise<{ token?: string }>;
}) {
  const { token } = (await searchParams) ?? {};

  return (
    <AuthShell
      title="Accept Invitation"
      description="Set your password to activate your account and join the workspace."
      footer={
        <div className="mt-2 text-center text-sm text-muted-foreground">
          <span>Already activated? </span>
          <a className="font-medium text-primary" href="/login">
            Sign In
          </a>
        </div>
      }
    >
      <InviteAcceptanceForm token={token} />
    </AuthShell>
  );
}
