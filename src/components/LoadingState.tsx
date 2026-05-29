export default function LoadingState({ label = "Memuat data..." }: { label?: string }) {
  return <div className="state">{label}</div>;
}
