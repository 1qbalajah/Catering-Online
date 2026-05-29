import { startDeliveryAction } from "@/actions/orders";
import DataTable from "@/components/DataTable";
import DeliveryFinishForm from "@/components/DeliveryFinishForm";
import OrderThumbnail from "@/components/OrderThumbnail";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import StatusBadge from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { getDeliveriesByCourier, getWaitingCourierDeliveries } from "@/lib/deliveries";

export default async function PengirimanPage() {
  const user = await requireRole(["kurir"]);
  const [requests, deliveries] = await Promise.all([getWaitingCourierDeliveries(), getDeliveriesByCourier(user.id)]);
  const activeDeliveries = deliveries.filter((item) => item.status_kirim === "Sedang Dikirim");
  const rows = [...requests, ...activeDeliveries];

  return (
    <div className="page">
      <RealtimeRefresh tables={["pengirimans", "pemesanans"]} />
      <div>
        <h1>Pengiriman</h1>
        <p className="muted">Kelola status kirim dan bukti foto pengiriman.</p>
      </div>
      <DataTable columns={["Image", "No Resi", "Pelanggan", "Alamat", "Status", "Aksi"]}>
            {rows.map((delivery) => (
              <tr key={delivery.id}>
                <td><OrderThumbnail src={delivery.pemesanan?.package_image_url} /></td>
                <td>{delivery.no_resi ?? delivery.id_pesan}</td>
                <td>{delivery.pemesanan?.pelanggan?.nama_pelanggan ?? "-"}</td>
                <td>{delivery.pemesanan?.pelanggan?.alamat1 ?? "-"}</td>
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
