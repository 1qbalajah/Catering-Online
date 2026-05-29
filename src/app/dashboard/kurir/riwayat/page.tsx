import DeliveryFinishForm from "@/components/DeliveryFinishForm";
import DataTable from "@/components/DataTable";
import OrderThumbnail from "@/components/OrderThumbnail";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import StatusBadge from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { getDeliveriesByCourier } from "@/lib/deliveries";

export default async function RiwayatPengirimanPage() {
  const user = await requireRole(["kurir"]);
  const deliveries = await getDeliveriesByCourier(user.id);

  return (
    <div className="page">
      <RealtimeRefresh tables={["pengirimans"]} />
      <div>
        <h1>History Pengantaran</h1>
        <p className="muted">Total paket sudah diantar: {deliveries.filter((item) => item.status_kirim === "Tiba Ditujuan").length}</p>
      </div>
      <DataTable columns={["Image", "ID Pesanan", "Pelanggan", "Status", "Tanggal Kirim", "Tanggal Tiba", "Bukti / Aksi"]}>
            {deliveries.map((delivery) => (
              <tr key={delivery.id}>
                <td><OrderThumbnail src={delivery.pemesanan?.package_image_url} /></td>
                <td>{delivery.id_pesan}</td>
                <td>{delivery.pemesanan?.pelanggan?.nama_pelanggan ?? "-"}</td>
                <td><StatusBadge status={delivery.status_kirim} /></td>
                <td>{new Date(delivery.tgl_kirim).toLocaleString("id-ID")}</td>
                <td>{delivery.tgl_tiba ? new Date(delivery.tgl_tiba).toLocaleString("id-ID") : "-"}</td>
                <td>
                  {delivery.status_kirim === "Sedang Dikirim" ? (
                    <DeliveryFinishForm id={delivery.id} />
                  ) : delivery.bukti_foto ? (
                    <a className="button compact secondary" href={delivery.bukti_foto} target="_blank">
                      Lihat Bukti
                    </a>
                  ) : (
                    "Paket Telah Sampai"
                  )}
                </td>
              </tr>
            ))}
      </DataTable>
    </div>
  );
}
