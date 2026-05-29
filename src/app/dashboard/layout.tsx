import DashboardLayout from "@/components/DashboardLayout";
import { requireAuth } from "@/lib/auth";

export default async function Layout({ children }: Readonly<{ children: React.ReactNode }>) {
  const user = await requireAuth();

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
