import { notFound } from "next/navigation";
import PaymentMethodForm from "@/components/PaymentMethodForm";
import { requireRole } from "@/lib/auth";
import { getPaymentMethodById } from "@/lib/payments";

type EditPaymentMethodPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditPaymentMethodPage({ params }: EditPaymentMethodPageProps) {
  await requireRole(["admin"]);
  const { id } = await params;
  const method = await getPaymentMethodById(id);

  if (!method) notFound();

  return (
    <div className="page">
      <div>
        <h1>Edit Metode Pembayaran</h1>
        <p className="muted">Untuk E-Wallet seperti GoPay/DANA, isi nomor pada kolom nomor pembayaran.</p>
      </div>
      <section className="card">
        <PaymentMethodForm method={method} />
      </section>
    </div>
  );
}
