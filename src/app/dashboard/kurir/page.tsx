import { Bike, CheckCircle2, ClipboardList } from "lucide-react";
import { startDeliveryAction } from "@/actions/orders";
import DashboardBanner from "@/components/DashboardBanner";
import DashboardSectionHeader from "@/components/DashboardSectionHeader";
import DataTable from "@/components/DataTable";
import DeliveryFinishForm from "@/components/DeliveryFinishForm";
import OrderThumbnail from "@/components/OrderThumbnail";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import StatCard from "@/components/StatCard";
import StatusBadge from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { getDeliveriesByCourier, getWaitingCourierDeliveries } from "@/lib/deliveries";
import { formatRupiah } from "@/lib/packages";

export default async function KurirDashboardPage() {
  const user = await requireRole(["kurir"]);
  const [requests, deliveries] = await Promise.all([
    getWaitingCourierDeliveries(),
    getDeliveriesByCourier(user.id),
  ]);
  const completed = deliveries.filter((delivery) => delivery.status_kirim === "Tiba Ditujuan");
  const active = deliveries.filter((delivery) => delivery.status_kirim === "Sedang Dikirim");
  const rows = [...requests, ...active];

  return (
    <div className="page">
      <RealtimeRefresh tables={["pengirimans", "pemesanans"]} />
      <DashboardBanner title="Hello, Kurir" subtitle="Selamat datang kembali Kurir" badge="Kurir Active" />
      <DashboardSectionHeader title="Overview" subtitle="Ringkasan tugas pengiriman aktif." />
      <div className="analytics-grid">
        <StatCard icon={ClipboardList} label="Request Baru" value={requests.length} />
        <StatCard icon={Bike} label="Sedang Dikirim" value={active.length} />
        <StatCard icon={CheckCircle2} label="Total Paket Diantar" value={completed.length} />
      </div>
      <DataTable title="Request dari Admin" columns={["Image", "No Resi", "Pelanggan", "Alamat", "Total", "Status", "Aksi"]}>
            {rows.slice(0, 6).map((delivery) => (
              <tr key={delivery.id}>
                <td><OrderThumbnail src={delivery.pemesanan?.package_image_url} /></td>
                <td>{delivery.no_resi ?? delivery.id_pesan}</td>
                <td>{delivery.pemesanan?.pelanggan?.nama_pelanggan ?? "-"}</td>
                <td>{delivery.pemesanan?.pelanggan?.alamat1 ?? "-"}</td>
                <td>{formatRupiah(delivery.pemesanan?.total_bayar ?? 0)}</td>
                <td><StatusBadge status={delivery.status_kirim} /></td>
                <td>
                  {delivery.status_kirim === "Menunggu Kurir" ? (
                    <form action={startDeliveryAction}>
                      <input name="id" type="hidden" value={delivery.id} />
                      <button className="button compact" type="submit">
                        Terima Request
                      </button>
                    </form>
                  ) : (
                    <DeliveryFinishForm id={delivery.id} compact />
                  )}
                </td>
              </tr>
            ))}
      </DataTable>
    </div>
  );
}
