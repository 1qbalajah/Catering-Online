import InvoiceButton from "@/components/InvoiceButton";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getAllOrders } from "@/lib/orders";
import { getAllPackagesForAdmin, formatRupiah } from "@/lib/packages";
import { getPaymentMethods } from "@/lib/payments";

export default async function AdminDataPage() {
  await requireRole(["admin"]);
  const [packages, payments, orders] = await Promise.all([getAllPackagesForAdmin(), getPaymentMethods(), getAllOrders()]);

  return (
    <div className="page">
      <div>
        <h1>Kelola Paket</h1>
        <p className="muted">Pusat pengelolaan paket catering, pembayaran, dan pesanan.</p>
      </div>
      <div className="grid">
        <Link className="card" href="/dashboard/admin/data/paket">
          <h2>Paket</h2>
          <p className="muted">{packages.length} paket tersedia.</p>
        </Link>
        <Link className="card" href="/dashboard/admin/data/pembayaran">
          <h2>Pembayaran</h2>
          <p className="muted">{payments.length} metode pembayaran aktif.</p>
        </Link>
        <Link className="card" href="/dashboard/admin/orders">
          <h2>Pesanan</h2>
          <p className="muted">{orders.length} pesanan tercatat.</p>
        </Link>
      </div>
      <section className="card">
        <div className="section-heading">
          <h2>Paket Catering</h2>
          <Link className="button compact" href="/dashboard/admin/data/paket/create">
            Tambah
          </Link>
        </div>
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Nama Paket</th>
                <th>Kategori</th>
                <th>Harga</th>
              </tr>
            </thead>
            <tbody>
              {packages.slice(0, 5).map((paket) => (
                <tr key={paket.id}>
                  <td>{paket.nama_paket}</td>
                  <td>{paket.kategori}</td>
                  <td>{formatRupiah(paket.harga_paket)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card">
        <h2>Metode Pembayaran</h2>
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Metode</th>
                <th>Tempat</th>
                <th>Nomor</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => {
                const detail = payment.detail_jenis_pembayarans?.[0];
                return (
                  <tr key={payment.id}>
                    <td>{payment.metode_pembayaran}</td>
                    <td>{detail?.tempat_bayar ?? "-"}</td>
                    <td>{detail?.no_rek ?? "-"}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
      <section className="card">
        <h2>Pesanan Terbaru</h2>
        <div className="table-card">
          <table>
            <thead>
              <tr>
                <th>Pelanggan</th>
                <th>Status</th>
                <th>Total</th>
                <th>Struk</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 8).map((order) => (
                <tr key={order.id}>
                  <td>{order.pelanggan?.nama_pelanggan ?? "-"}</td>
                  <td>{order.status_pesan}</td>
                  <td>{formatRupiah(order.total_bayar)}</td>
                  <td>
                    <InvoiceButton orderId={order.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
