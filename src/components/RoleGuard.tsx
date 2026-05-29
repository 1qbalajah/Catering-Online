import { redirect } from "next/navigation";
import { requireAuth } from "@/lib/auth";
import type { Role } from "@/types";

type RoleGuardProps = {
  allowedRoles: Role[];
  children: React.ReactNode;
};

export default async function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return children;
}
