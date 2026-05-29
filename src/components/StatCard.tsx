import type { ComponentType } from "react";
import type { LucideProps } from "lucide-react";

type StatCardProps = {
  label: string;
  value: string | number;
  icon: ComponentType<LucideProps>;
};

export default function StatCard({ label, value, icon: Icon }: StatCardProps) {
  return (
    <section className="metric-card modern">
      <span className="metric-icon" aria-hidden="true">
        <Icon size={20} />
      </span>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </section>
  );
}
