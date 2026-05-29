import type { ReactNode } from "react";

type DashboardBannerProps = {
  title: string;
  subtitle: string;
  badge: string;
  action?: ReactNode;
};

export default function DashboardBanner({ title, subtitle, badge, action }: DashboardBannerProps) {
  return (
    <section className="dashboard-banner">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="dashboard-banner-actions">
        {action}
        <span className="dashboard-role-pill">{badge}</span>
      </div>
    </section>
  );
}
