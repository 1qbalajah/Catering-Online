import type { ReactNode } from "react";
import type { AppUser } from "@/types";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

type DashboardLayoutProps = {
  user: AppUser;
  children: ReactNode;
};

export default function DashboardLayout({ user, children }: DashboardLayoutProps) {
  return (
    <div className="dashboard-shell">
      <Sidebar role={user.role} />
      <main className="dashboard-main">
        <Navbar user={user} />
        <section className="content">{children}</section>
      </main>
    </div>
  );
}
