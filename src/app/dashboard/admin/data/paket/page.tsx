import Link from "next/link";
import { deletePackageAction } from "@/actions/packages";
import DataTable from "@/components/DataTable";
import OrderThumbnail from "@/components/OrderThumbnail";
import RealtimeRefresh from "@/components/RealtimeRefresh";
import { requireRole } from "@/lib/auth";
import { formatRupiah, getAllPackagesForAdmin } from "@/lib/packages";

export default async function AdminPaketPage() {
  await requireRole(["admin"]);
  const packages = await getAllPackagesForAdmin();

  return (
    <div className="page">
      <RealtimeRefresh tables={["pakets"]} />
      <div className="section-heading">
        <div>
          <h1>CRUD Paket</h1>
          <p className="muted">Kelola data paket catering sesuai PDM.</p>
        </div>
        <Link className="button" href="/dashboard/admin/data/paket/create">
          Tambah Paket
        </Link>
      </div>
      <DataTable columns={["Image", "Nama", "Jenis", "Kategori", "Pax", "Harga", "Aksi"]}>
            {packages.map((paket) => (
              <tr key={paket.id}>
                <td><OrderThumbnail src={paket.foto1} alt={paket.nama_paket} /></td>
                <td>{paket.nama_paket}</td>
                <td>{paket.jenis}</td>
                <td>{paket.kategori}</td>
                <td>{paket.jumlah_pax}</td>
                <td>{formatRupiah(paket.harga_paket)}</td>
                <td className="actions-cell">
                  <Link className="button compact secondary" href={`/dashboard/admin/data/paket/${paket.id}/edit`}>
                    Edit
                  </Link>
                  <form action={deletePackageAction}>
                    <input name="id" type="hidden" value={paket.id} />
                    <button className="button compact danger" type="submit">
                      Hapus
                    </button>
                  </form>
                </td>
              </tr>
            ))}
      </DataTable>
    </div>
  );
}
