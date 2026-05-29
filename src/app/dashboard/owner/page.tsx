import { BarChart3, CheckCircle2, Package, ReceiptText } from "lucide-react";
import DashboardBanner from "@/components/DashboardBanner";
import DashboardSectionHeader from "@/components/DashboardSectionHeader";
import OrdersChart from "@/components/OrdersChart";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import StatCard from "@/components/StatCard";
import { requireRole } from "@/lib/auth";
import { formatRupiah } from "@/lib/packages";
import { getMonthlyOrderStats, getSalesSummary } from "@/lib/reports";

export default async function OwnerDashboardPage() {
  await requireRole(["owner"]);
  const [summary, monthlyStats] = await Promise.all([getSalesSummary(), getMonthlyOrderStats()]);

  return (
    <div className="page">
      <RealtimeRefresh tables={["pemesanans", "pengirimans", "pakets"]} />
      <DashboardBanner title="Hello, Owner" subtitle="Selamat datang kembali Owner" badge="Owner Active" />
      <DashboardSectionHeader
        title="Overview"
        subtitle="Monitoring read-only bisnis catering."
        action={
        <a className="button" href="/api/reports/sales" target="_blank">
          Download Laporan
        </a>
        }
      />
      <div className="analytics-grid">
        <StatCard icon={ReceiptText} label="Total Pemesanan" value={summary.totalOrders} />
        <StatCard icon={BarChart3} label="Total Pendapatan" value={formatRupiah(summary.totalSales)} />
        <StatCard icon={Package} label="Jumlah/Stok Product" value={summary.totalProducts} />
        <StatCard icon={CheckCircle2} label="Pesanan Selesai" value={summary.completedOrders} />
      </div>
      <section className="card">
        <h2>Statistik Catering</h2>
        <p className="muted">Jumlah pemesanan per bulan.</p>
        <OrdersChart data={monthlyStats} />
      </section>
    </div>
  );
}
