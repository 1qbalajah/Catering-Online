import { BarChart3, CheckCircle2, Clock, ReceiptText } from "lucide-react";
import DashboardSectionHeader from "@/components/DashboardSectionHeader";
import OrdersChart from "@/components/OrdersChart";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import StatCard from "@/components/StatCard";
import { requireRole } from "@/lib/auth";
import { formatRupiah } from "@/lib/packages";
import { getMonthlyOrderStats, getSalesSummary } from "@/lib/reports";

export default async function AnalyticsPage() {
  await requireRole(["owner"]);
  const [summary, monthlyStats] = await Promise.all([getSalesSummary(), getMonthlyOrderStats()]);

  return (
    <div className="page">
      <RealtimeRefresh tables={["pemesanans", "pengirimans", "pakets"]} />
      <DashboardSectionHeader title="Analytics" subtitle="Statistik realtime dari aktivitas pemesanan catering." />
      <div className="analytics-grid">
        <StatCard icon={ReceiptText} label="Jumlah Pemesanan" value={summary.totalOrders} />
        <StatCard icon={BarChart3} label="Aktivitas Penjualan" value={formatRupiah(summary.totalSales)} />
        <StatCard icon={Clock} label="Pending" value={summary.pendingOrders} />
        <StatCard icon={CheckCircle2} label="Dikonfirmasi" value={summary.confirmedOrders} />
      </div>
      <section className="card">
        <h2>Chart Pemesanan</h2>
        <OrdersChart data={monthlyStats} />
      </section>
      <section className="card">
        <h2>Chart Pendapatan</h2>
        <OrdersChart data={monthlyStats} value="revenue" />
      </section>
    </div>
  );
}
