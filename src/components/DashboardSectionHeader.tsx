import type { ReactNode } from "react";

type DashboardSectionHeaderProps = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
};

export default function DashboardSectionHeader({ title, subtitle, action }: DashboardSectionHeaderProps) {
  return (
    <div className="dashboard-section-header">
      <div>
        <h2>{title}</h2>
        {subtitle ? <p>{subtitle}</p> : null}
      </div>
      {action ? <div className="dashboard-section-action">{action}</div> : null}
    </div>
  );
}
