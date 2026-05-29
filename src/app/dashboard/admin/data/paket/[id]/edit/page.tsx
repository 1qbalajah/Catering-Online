import { notFound } from "next/navigation";
import PackageForm from "@/components/PackageForm";
import { requireRole } from "@/lib/auth";
import { getPackageById } from "@/lib/packages";

type EditPaketPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPaketPage({ params }: EditPaketPageProps) {
  await requireRole(["admin"]);
  const { id } = await params;
  const paket = await getPackageById(id);

  if (!paket) {
    notFound();
  }

  return (
    <div className="page">
      <div>
        <h1>Edit Paket</h1>
        <p className="muted">Update data paket dan foto jika diperlukan.</p>
      </div>
      <section className="card">
        <PackageForm paket={paket} />
      </section>
    </div>
  );
}
