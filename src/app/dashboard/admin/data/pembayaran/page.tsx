import { deletePaymentMethodAction } from "@/actions/payments";
import Link from "next/link";
import DataTable from "@/components/DataTable";
import PaymentMethodForm from "@/components/PaymentMethodForm";
import { requireRole } from "@/lib/auth";
import { getPaymentMethods } from "@/lib/payments";

export default async function AdminPembayaranPage() {
  await requireRole(["admin"]);
  const methods = await getPaymentMethods();

  return (
    <div className="page">
      <div>
        <h1>Metode Pembayaran</h1>
        <p className="muted">Kelola jenis dan detail pembayaran sesuai PDM.</p>
      </div>
      <section className="card">
        <PaymentMethodForm />
      </section>
      <DataTable columns={["Metode", "Tempat Bayar", "No Rekening", "Aksi"]}>
            {methods.map((method) => {
              const detail = method.detail_jenis_pembayarans?.[0];

              return (
                <tr key={method.id}>
                  <td>{method.metode_pembayaran}</td>
                  <td>{detail?.tempat_bayar ?? "-"}</td>
                  <td>{detail?.no_rek ?? "-"}</td>
                  <td className="actions-cell">
                    <Link className="button compact secondary" href={`/dashboard/admin/data/pembayaran/${method.id}/edit`}>
                      Edit
                    </Link>
                    <form action={deletePaymentMethodAction}>
                      <input name="id" type="hidden" value={method.id} />
                      <button className="button compact danger" type="submit">
                        Hapus
                      </button>
                    </form>
                  </td>
                </tr>
              );
            })}
      </DataTable>
    </div>
  );
}
