import Link from "next/link";
import { redirect } from "next/navigation";
import { createOrderAction } from "@/actions/orders";
import PublicHeader from "@/components/PublicHeader";
import { getCurrentUser } from "@/lib/auth";
import { formatRupiah, getPackageById } from "@/lib/packages";
import { getPaymentMethods } from "@/lib/payments";

type BeliPaketPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function BeliPaketPage({ params }: BeliPaketPageProps) {
  const { id } = await params;
  const [user, paket, methods] = await Promise.all([getCurrentUser(), getPackageById(id), getPaymentMethods()]);

  if (!user) {
    redirect(`/login?next=/paket/${id}/beli`);
  }

  if (!paket) {
    redirect("/paket");
  }

  return (
    <main className="public-shell">
      <PublicHeader user={user} />
      <section className="public-section">
        <div className="checkout-panel">
          <h1>Checkout Paket</h1>
          <p className="muted">
            Kamu sudah login sebagai {user.name}. Pilih metode pembayaran development untuk membuat pesanan.
          </p>
          <div className="card">
            <h2>{paket.nama_paket}</h2>
            <p>{formatRupiah(paket.harga_paket)}</p>
          </div>
          <form action={createOrderAction} className="form">
            <input name="id_paket" type="hidden" value={paket.id} />
            <label className="field">
              <span>Jumlah Paket</span>
              <input className="input" min={1} name="jumlah" type="number" defaultValue={1} required />
            </label>
            <label className="field">
              <span>Metode Pembayaran</span>
              <select className="input" name="id_jenis_bayar" required>
                {methods.map((method) => (
                  <option key={method.id} value={method.id}>
                    {method.metode_pembayaran}
                  </option>
                ))}
              </select>
            </label>
            <label className="field">
              <span>Catatan Pesanan</span>
              <textarea
                className="input textarea"
                name="catatan"
                placeholder="Contoh: jam acara, preferensi menu, atau alamat detail"
              />
            </label>
            <button className="button" type="submit">
              Bayar dan Buat Pesanan
            </button>
            <Link className="button secondary" href="/paket">
              Kembali ke Paket
            </Link>
          </form>
        </div>
      </section>
    </main>
  );
}
