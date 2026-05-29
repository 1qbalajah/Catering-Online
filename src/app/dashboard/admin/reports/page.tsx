import DataTable from "@/components/DataTable";
import { requireRole } from "@/lib/auth";
import { formatRupiah } from "@/lib/packages";
import { getOrdersByPeriod } from "@/lib/reports";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type AdminReportsPageProps = {
  searchParams: Promise<{
    start?: string;
    end?: string;
  }>;
};

export default async function AdminReportsPage({ searchParams }: AdminReportsPageProps) {
  await requireRole(["admin"]);
  const params = await searchParams;
  const orders = await getOrdersByPeriod(params.start, params.end);
  const exportUrl = `/api/reports/sales?start=${params.start ?? ""}&end=${params.end ?? ""}`;

  return (
    <div className="page">
      <div>
        <h1>Laporan Admin</h1>
        <p className="muted">Export dan cetak laporan penjualan catering.</p>
      </div>
      <form className="card report-filter">
        <label className="field">
          <span>Dari</span>
          <input className="input" defaultValue={params.start ?? ""} name="start" type="date" />
        </label>
        <label className="field">
          <span>Sampai</span>
          <input className="input" defaultValue={params.end ?? ""} name="end" type="date" />
        </label>
        <button className="button" type="submit">
          Filter
        </button>
        <a className="button secondary" href={exportUrl} target="_blank">
          Export PDF
        </a>
      </form>
      <DataTable columns={["Tanggal", "Pelanggan", "Status", "Total"]}>
            {orders.map((order) => {
              const pelanggan = Array.isArray(order.pelanggans) ? order.pelanggans[0] : order.pelanggans;
              return (
                <tr key={order.id}>
                  <td>{new Date(order.tgl_pesan).toLocaleDateString("id-ID")}</td>
                  <td>{pelanggan?.nama_pelanggan ?? "-"}</td>
                  <td>{order.status_pesan}</td>
                  <td>{formatRupiah(Number(order.total_bayar))}</td>
                </tr>
              );
            })}
      </DataTable>
    </div>
  );
}
