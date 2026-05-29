import Link from "next/link";
import { notFound } from "next/navigation";
import CheckoutGate from "@/components/CheckoutGate";
import PublicHeader from "@/components/PublicHeader";
import { getCurrentUser } from "@/lib/auth";
import { formatRupiah, getPackageById } from "@/lib/packages";

type PaketDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PaketDetailPage({ params }: PaketDetailPageProps) {
  const { id } = await params;
  const [user, paket] = await Promise.all([getCurrentUser(), getPackageById(id)]);

  if (!paket) {
    notFound();
  }

  const images = [paket.foto1, paket.foto2, paket.foto3].filter(Boolean);

  return (
    <main className="public-shell">
      <PublicHeader user={user} />
      <section className="public-section">
        <div className="detail-layout">
          <div className="detail-gallery">
            {images.length ? (
              images.map((image) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img alt={paket.nama_paket} key={image} src={image!} />
              ))
            ) : (
              <div className="package-image">{paket.kategori}</div>
            )}
          </div>
          <article className="checkout-panel">
            <p className="eyebrow">
              {paket.jenis} - {paket.kategori}
            </p>
            <h1>{paket.nama_paket}</h1>
            <p className="muted">{paket.deskripsi}</p>
            <div className="grid">
              <div className="card">
                <h2>Jumlah Pax</h2>
                <p>{paket.jumlah_pax} pax</p>
              </div>
              <div className="card">
                <h2>Harga</h2>
                <p>{formatRupiah(paket.harga_paket)}</p>
              </div>
            </div>
            <CheckoutGate href={`/paket/${paket.id}/beli`} isLoggedIn={Boolean(user)} />
          </article>
        </div>
      </section>
    </main>
  );
}
