import { requireAuth, redirectToRoleHome } from "@/lib/auth";

export default async function DashboardPage() {
  const user = await requireAuth();

  redirectToRoleHome(user.role);
}
