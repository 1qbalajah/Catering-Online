export default function EmptyState({ title = "Data belum tersedia" }: { title?: string }) {
  return <div className="state">{title}</div>;
}
