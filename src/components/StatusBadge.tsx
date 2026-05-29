type StatusBadgeProps = {
  status?: string | null;
  label?: string | null;
};

const toneByStatus: Record<string, string> = {
  "Menunggu Konfirmasi": "status-badge status-waiting",
  "Sedang Diproses": "status-badge status-processing",
  Dibatalkan: "status-badge status-canceled",
  "Menunggu Kurir": "status-badge status-courier",
  "Sedang Dikirim": "status-badge status-shipping",
  "Tiba Ditujuan": "status-badge status-done",
  Selesai: "status-badge status-done",
};

export default function StatusBadge({ status, label: displayLabel }: StatusBadgeProps) {
  const label = displayLabel || status || "Belum diproses";

  return <span className={toneByStatus[label] ?? "status-badge"}>{label}</span>;
}
