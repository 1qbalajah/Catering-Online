import { notFound } from "next/navigation";
import { confirmOrderAction } from "@/actions/orders";
import OrderThumbnail from "@/components/OrderThumbnail";
import StatusBadge from "@/components/StatusBadge";
import { requireRole } from "@/lib/auth";
import { getDeliveryStatusByOrderIds } from "@/lib/deliveries";
import { getOrderViewData } from "@/lib/orders";
import { formatRupiah } from "@/lib/packages";

type AdminOrderDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  await requireRole(["admin"]);
  const { id } = await params;
  const { order, details, payments } = await getOrderViewData(id);
  const deliveryMap = await getDeliveryStatusByOrderIds([id]);

  if (!order) notFound();

  const payment = payments.find((item) => item.id === order.id_jenis_bayar);
  const delivery = deliveryMap.get(order.id);

  return (
    <div className="page">
      <div>
        <h1>Detail Pesanan</h1>
        <p className="muted">Pembayaran development dianggap berhasil dari sisi user, admin tinggal konfirmasi.</p>
      </div>
      <section className="card">
        <p>Pelanggan: {order.pelanggan?.nama_pelanggan ?? "-"}</p>
        <p>Email: {order.pelanggan?.email ?? "-"}</p>
        <p>Alamat: {order.pelanggan?.alamat1 ?? "-"}</p>
        <p>Status: <StatusBadge status={order.status_pesan} /></p>
        <p>Status Pengiriman: <StatusBadge status={delivery?.status_kirim} /></p>
        <p>Metode Bayar: {payment?.metode_pembayaran ?? "-"}</p>
        <p>Total: {formatRupiah(order.total_bayar)}</p>
        {order.catatan ? <p>Catatan: {order.catatan}</p> : null}
        {order.alasan_pembatalan ? <p className="danger-text">Alasan pembatalan: {order.alasan_pembatalan}</p> : null}
        {order.status_pesan === "Menunggu Konfirmasi" ? (
          <form action={confirmOrderAction}>
            <input name="id" type="hidden" value={order.id} />
            <button className="button" type="submit">
              Konfirmasi dan Kirim ke Kurir
            </button>
          </form>
        ) : null}
      </section>
      <div className="grid">
        {details.map((detail) => (
            <section className="card" key={`${detail.id_pemesanan}-${detail.id_paket}`}>
              <div className="order-detail-item">
                <OrderThumbnail src={detail.paket?.foto1 ?? detail.paket?.foto2 ?? detail.paket?.foto3} alt={detail.paket?.nama_paket ?? "Paket"} />
                <div>
                  <h2>{detail.paket?.nama_paket ?? "Paket"}</h2>
                  <p className="muted">{detail.paket?.kategori ?? "-"} | {detail.paket?.jumlah_pax ?? 0} pax</p>
                  <p>Harga: {formatRupiah(detail.harga_satuan)}</p>
                  <p>Jumlah: {detail.jumlah}</p>
                  <p>Subtotal: {formatRupiah(detail.subtotal)}</p>
                </div>
              </div>
            </section>
          ))}
      </div>
    </div>
  );
}
