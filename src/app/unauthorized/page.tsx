import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <main className="auth-shell">
      <section className="auth-panel">
        <h1>Akses ditolak</h1>
        <p className="muted">Role akun kamu tidak memiliki izin untuk membuka halaman ini.</p>
        <Link className="button" href="/dashboard">
          Kembali ke Dashboard
        </Link>
      </section>
    </main>
  );
}
