import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ redirect?: string }>;
}) {
  const { redirect } = (await searchParams) ?? {};

  return (
    <AuthShell>
      <LoginForm redirect={redirect} />
    </AuthShell>
  );
}
