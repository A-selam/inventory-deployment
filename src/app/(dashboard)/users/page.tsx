import { redirect } from "next/navigation";
import UsersPageClient from "@/components/users/UsersPageClient";

export default async function UsersPage() {
  // Note: Client-side RBAC protection is implemented via the CanAccess component
  // Server-side validation should be added when backend guards are implemented
  return <UsersPageClient />;
}

