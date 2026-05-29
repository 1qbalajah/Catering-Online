import Link from "next/link";
import InvoiceButton from "@/components/InvoiceButton";
import ImageWithFallback from "@/components/ImageWithFallback";
import PublicHeader from "@/components/PublicHeader";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import RejectOrderForm from "@/components/RejectOrderForm";
import { getCurrentUser } from "@/lib/auth";
import { getDeliveryStatusByOrderIds } from "@/lib/deliveries";
import { formatRupiah } from "@/lib/packages";
import { getOrdersByPelanggan, getPrimaryOrderImage, getPrimaryOrderPackage } from "@/lib/orders";

type ProfileOrdersPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function ProfileOrdersPage({ searchParams }: ProfileOrdersPageProps) {
  const user = await getCurrentUser();
  const params = await searchParams;
  
  if (!user || user.role !== "user") {
    return (
      <main className="public-shell">
        <PublicHeader user={user} />
        <section className="public-section">
          <div className="state premium-empty">
            <h1>Masuk untuk melihat pemesanan</h1>
            <p className="muted">Riwayat, invoice, dan status produksi akan tampil setelah kamu login sebagai pelanggan.</p>
            <Link className="button" href="/login?next=/profile/orders">
              Login Pelanggan
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const orders = await getOrdersByPelanggan(user.id);
  const deliveryMap = await getDeliveryStatusByOrderIds(orders.map((order) => order.id));
  const selectedStatus = params.status ?? "all";
  
  const filteredOrders = orders.filter((order) => {
    const delivery = deliveryMap.get(order.id)?.status_kirim;
    if (selectedStatus === "pending") return order.status_pesan === "Menunggu Konfirmasi";
    if (selectedStatus === "proses") return order.status_pesan === "Sedang Diproses" && delivery !== "Tiba Ditujuan";
    if (selectedStatus === "dikirim") return delivery === "Sedang Dikirim" || delivery === "Menunggu Kurir";
    if (selectedStatus === "selesai") return order.status_pesan === "Selesai" || delivery === "Tiba Ditujuan";
    if (selectedStatus === "batal") return order.status_pesan === "Dibatalkan";
    return true;
  });
  
  const userDeliveryLabel = (status?: string | null) => {
    if (status === "Sedang Dikirim") return "Menunggu Kurir";
    return status;
  };

  // Fungsi untuk menentukan status saat ini (hanya satu) + class CSS untuk border berwarna
  const getCurrentStatus = (order: any, delivery: any) => {
    if (order.status_pesan === "Dibatalkan") {
      return { label: "Dibatalkan", class: "status-canceled" };
    }
    if (order.status_pesan === "Selesai" || delivery?.status_kirim === "Tiba Ditujuan") {
      return { label: "Selesai", class: "status-done" };
    }
    if (delivery?.status_kirim === "Sedang Dikirim" || delivery?.status_kirim === "Menunggu Kurir") {
      return { label: userDeliveryLabel(delivery.status_kirim), class: "status-shipping" };
    }
    if (order.status_pesan === "Sedang Diproses") {
      return { label: "Sedang Diproses", class: "status-processing" };
    }
    if (order.status_pesan === "Menunggu Konfirmasi") {
      return { label: "Menunggu Konfirmasi", class: "status-waiting" };
    }
    return { label: "Unknown", class: "" };
  };

  // Hitung total
  const totalOrders = filteredOrders.length;
  const totalAmount = filteredOrders.reduce((sum, order) => sum + order.total_bayar, 0);

  return (
    <main className="public-shell">
      <RealtimeRefresh tables={["pemesanans", "pengirimans"]} />
      <PublicHeader user={user} />
      <section className="public-section">
        <div className="section-heading">
          <div>
            <h1>Pemesanan Saya</h1>
            <p className="muted">Kelola dan lacak status pesanan catering Anda.</p>
          </div>
        </div>

        {/* Order Summary Border */}
        <div className="order-summary-border">
          <div className="summary-stats">
            <div className="stat-item">
              <span className="stat-label">Total Pesanan</span>
              <strong className="stat-value">{totalOrders}</strong>
            </div>
            <div className="stat-divider" />
            <div className="stat-item">
              <span className="stat-label">Total Belanja</span>
              <strong className="stat-value amount">{formatRupiah(totalAmount)}</strong>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="order-filter">
          <Link className={selectedStatus === "all" ? "filter-pill active" : "filter-pill"} href="/profile/orders">Semua</Link>
          <Link className={selectedStatus === "pending" ? "filter-pill active" : "filter-pill"} href="/profile/orders?status=pending">Menunggu Konfirmasi</Link>
          <Link className={selectedStatus === "proses" ? "filter-pill active" : "filter-pill"} href="/profile/orders?status=proses">Diproses</Link>
          <Link className={selectedStatus === "dikirim" ? "filter-pill active" : "filter-pill"} href="/profile/orders?status=dikirim">Dikirim</Link>
          <Link className={selectedStatus === "selesai" ? "filter-pill active" : "filter-pill"} href="/profile/orders?status=selesai">Selesai</Link>
          <Link className={selectedStatus === "batal" ? "filter-pill active" : "filter-pill"} href="/profile/orders?status=batal">Dibatalkan</Link>
        </div>

        {/* Order List - 2 Column Grid Layout */}
        <div className="order-card-list">
          {filteredOrders.map((order) => {
            const delivery = deliveryMap.get(order.id);
            const currentDate = new Date(order.tgl_pesan);
            const currentStatus = getCurrentStatus(order, delivery);
            
            const primaryPaket = getPrimaryOrderPackage(order);
            const orderImage = getPrimaryOrderImage(order);
            const orderName = primaryPaket?.nama_paket ?? "Paket Catering";
            
            return (
              <article className="order-card cart-style" key={order.id}>
                
                {/* LEFT COLUMN: Product Image, Name, Date, Price */}
                <div className="order-left-column">
                  <div className="product-image-wrapper">
                    <ImageWithFallback
                      src={orderImage}
                      alt={orderName}
                      className="product-image"
                      fallbackClassName="product-image-placeholder"
                      iconSize={48}
                    />
                  </div>
                  
                  <div className="product-info">
                    <h3 className="product-name">{orderName}</h3>
                    <div className="product-meta">
                      <span className="order-date">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                          <line x1="16" y1="2" x2="16" y2="6" />
                          <line x1="8" y1="2" x2="8" y2="6" />
                          <line x1="3" y1="10" x2="21" y2="10" />
                        </svg>
                        {currentDate.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                      </span>
                      <span className="order-id">#{order.invoice_code ?? order.id}</span>
                    </div>
                    <div className="product-price">
                      <span className="price-label">Total</span>
                      <strong className="price-amount">{formatRupiah(order.total_bayar)}</strong>
                    </div>
                    {order.details.length ? (
                      <div className="order-items-inline">
                        {order.details.map((detail) => (
                          <span key={`${detail.id_pemesanan}-${detail.id_paket}`}>
                            {detail.paket?.nama_paket ?? "Paket"} x{detail.jumlah}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                {/* RIGHT COLUMN: Status Badge + Action Buttons */}
                <div className="order-right-column">
                  <div className="status-wrapper">
                    <span className={`status-badge status-badge-bordered ${currentStatus.class}`}>
                      {currentStatus.label}
                    </span>
                  </div>
                  
                  <div className="action-buttons">
                    <InvoiceButton orderId={order.id} />
                    {order.status_pesan === "Menunggu Konfirmasi" && (
                      <RejectOrderForm orderId={order.id} />
                    )}
                  </div>
                </div>

                {/* Notes (if any) - Full Width */}
                {order.catatan && (
                  <div className="order-notes">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                      <polyline points="14 2 14 8 20 8" />
                      <line x1="16" y1="13" x2="8" y2="13" />
                      <line x1="16" y1="17" x2="8" y2="17" />
                      <polyline points="10 9 9 9 8 9" />
                    </svg>
                    <span>{order.catatan}</span>
                  </div>
                )}

                {order.alasan_pembatalan && (
                  <div className="order-notes danger">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <line x1="12" y1="8" x2="12" y2="12" />
                      <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    <span>Alasan batal: {order.alasan_pembatalan}</span>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        {filteredOrders.length === 0 && (
          <div className="state premium-empty">
            <h1>Tidak ada pesanan</h1>
            <p className="muted">Belum ada pesanan dengan filter yang dipilih.</p>
            <Link className="button" href="/paket">Lihat Paket Catering</Link>
          </div>
        )}
      </section>
    </main>
  );
}
