import { ClipboardCheck, Clock, LoaderCircle } from "lucide-react";
import DashboardBanner from "@/components/DashboardBanner";
import DashboardSectionHeader from "@/components/DashboardSectionHeader";
import DataTable from "@/components/DataTable";
import InvoiceButton from "@/components/InvoiceButton";
import OrdersChart from "@/components/OrdersChart";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { confirmOrderAction } from "@/actions/orders";
import { requireRole } from "@/lib/auth";
import { getAllOrders } from "@/lib/orders";
import { formatRupiah } from "@/lib/packages";
import { getMonthlyOrderStats } from "@/lib/reports";

export default async function AdminDashboardPage() {
  await requireRole(["admin"]);
  const [orders, monthlyStats] = await Promise.all([getAllOrders(), getMonthlyOrderStats()]);
  const pendingOrders = orders.filter((order) => order.status_pesan === "Menunggu Konfirmasi");
  const latestOrders = orders.slice(0, 3);

  return (
    <div className="page">
      <RealtimeRefresh tables={["pemesanans", "pengirimans", "pakets"]} />
      <DashboardBanner title="Hello, Admin" subtitle="Selamat datang kembali Admin" badge="Admin Active" />
      <DashboardSectionHeader
        title="Overview"
        subtitle="Pantau produksi, konfirmasi request, dan export laporan."
        action={
        <a className="button" href="/api/reports/sales" target="_blank">
          Export Laporan
        </a>
        }
      />
      <div className="analytics-grid">
        <StatCard icon={ClipboardCheck} label="Total Pesanan" value={orders.length} />
        <StatCard icon={Clock} label="Menunggu Konfirmasi" value={pendingOrders.length} />
        <StatCard
          icon={LoaderCircle}
          label="Sedang Diproses"
          value={orders.filter((order) => order.status_pesan === "Sedang Diproses").length}
        />
      </div>
      <div className="dashboard-two-column">
        <section className="card chart-card">
          <h2>Statistik Pemesanan Bulanan</h2>
          <p className="muted">Jumlah pesanan per bulan.</p>
          <OrdersChart data={monthlyStats} />
        </section>
        <section className="card request-panel">
          <h2>Request Pesanan Terbaru</h2>
          {pendingOrders.length ? (
            <DataTable columns={["Pelanggan", "Status", "Total", "Aksi"]}>
              {pendingOrders.slice(0, 5).map((order) => (
                <tr key={order.id}>
                  <td>{order.pelanggan?.nama_pelanggan ?? "-"}</td>
                  <td><StatusBadge status={order.status_pesan} /></td>
                  <td>{formatRupiah(order.total_bayar)}</td>
                  <td className="actions-cell">
                    <InvoiceButton orderId={order.id} />
                    <form action={confirmOrderAction}>
                      <input name="id" type="hidden" value={order.id} />
                      <button className="button compact" type="submit">Konfirmasi</button>
                    </form>
                  </td>
                </tr>
              ))}
            </DataTable>
          ) : (
            <p className="muted empty-inline">Tidak ada request konfirmasi saat ini.</p>
          )}
        </section>
      </div>
      <DataTable title="3 Pesanan Terbaru" columns={["Pelanggan", "Status", "Total", "Invoice"]}>
        {latestOrders.map((order) => (
          <tr key={order.id}>
            <td>{order.pelanggan?.nama_pelanggan ?? "-"}</td>
            <td><StatusBadge status={order.status_pesan} /></td>
            <td>{formatRupiah(order.total_bayar)}</td>
            <td><InvoiceButton orderId={order.id} /></td>
          </tr>
        ))}
      </DataTable>
    </div>
  );
}
