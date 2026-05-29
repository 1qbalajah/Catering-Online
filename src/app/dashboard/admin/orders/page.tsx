import Link from "next/link";
import { confirmOrderAction } from "@/actions/orders";
import DataTable from "@/components/DataTable";
import InvoiceButton from "@/components/InvoiceButton";
import OrderThumbnail from "@/components/OrderThumbnail";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import StatusBadge from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { getDeliveryStatusByOrderIds } from "@/lib/deliveries";
import { getAllOrders, getPrimaryOrderImage, getPrimaryOrderPackage } from "@/lib/orders";
import { formatRupiah } from "@/lib/packages";

export default async function AdminOrdersPage() {
  await requireRole(["admin"]);
  const orders = await getAllOrders();
  const deliveryMap = await getDeliveryStatusByOrderIds(orders.map((order) => order.id));

  return (
    <div className="page">
      <RealtimeRefresh tables={["pemesanans", "pengirimans"]} />
      <div>
        <h1>Manajemen Pesanan</h1>
        <p className="muted">Pesanan terbaru, history, pembatalan, dan progress pengiriman.</p>
      </div>
      <DataTable columns={["Image", "Pelanggan", "Status", "Pengiriman", "No Resi", "Total", "Aksi"]}>
            {orders.map((order) => (
              <tr key={order.id}>
                <td><OrderThumbnail src={getPrimaryOrderImage(order)} alt={getPrimaryOrderPackage(order)?.nama_paket ?? "Paket catering"} /></td>
                <td>
                  <strong>{order.pelanggan?.nama_pelanggan ?? "-"}</strong>
                  <div className="table-subtext">{getPrimaryOrderPackage(order)?.nama_paket ?? "Paket Catering"}</div>
                </td>
                <td><StatusBadge status={order.status_pesan} /></td>
                <td><StatusBadge status={deliveryMap.get(order.id)?.status_kirim} /></td>
                <td>{order.invoice_code ?? order.no_resi ?? "-"}</td>
                <td>{formatRupiah(order.total_bayar)}</td>
                <td className="actions-cell">
                  <Link className="button compact secondary" href={`/dashboard/admin/orders/${order.id}`}>
                    Detail
                  </Link>
                  <InvoiceButton orderId={order.id} />
                  {order.status_pesan === "Menunggu Konfirmasi" ? (
                    <form action={confirmOrderAction}>
                      <input name="id" type="hidden" value={order.id} />
                      <button className="button compact" type="submit">
                        Konfirmasi
                      </button>
                    </form>
                  ) : null}
                  {order.alasan_pembatalan ? <span className="danger-text">Dibatalkan user</span> : null}
                </td>
              </tr>
            ))}
      </DataTable>
    </div>
  );
}
