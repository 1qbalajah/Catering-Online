import PackageForm from "@/components/PackageForm";
import { requireRole } from "@/lib/auth";

export default async function CreatePaketPage() {
  await requireRole(["admin"]);

  return (
    <div className="page">
      <div>
        <h1>Tambah Paket</h1>
        <p className="muted">Foto paket akan disimpan di Supabase Storage, URL disimpan di tabel pakets.</p>
      </div>
      <section className="card">
        <PackageForm />
      </section>
    </div>
  );
}
