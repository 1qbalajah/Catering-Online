import { createServiceClient } from "@/lib/supabase";

export type PaymentMethod = {
  id: string;
  metode_pembayaran: string;
  detail_jenis_pembayarans?: PaymentDetail[];
};

export type PaymentDetail = {
  id: string;
  id_jenis_pembayaran: string;
  no_rek: string;
  tempat_bayar: string;
  logo: string | null;
};

export async function getPaymentMethods() {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("jenis_pembayarans")
    .select("id,metode_pembayaran,detail_jenis_pembayarans(id,id_jenis_pembayaran,no_rek,tempat_bayar,logo)")
    .order("id", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((method) => ({
    ...method,
    id: String(method.id),
    detail_jenis_pembayarans: (method.detail_jenis_pembayarans ?? []).map((detail) => ({
      ...detail,
      id: String(detail.id),
      id_jenis_pembayaran: String(detail.id_jenis_pembayaran),
    })),
  })) as PaymentMethod[];
}

export async function getPaymentMethodById(id: string) {
  const methods = await getPaymentMethods();

  return methods.find((method) => method.id === id) ?? null;
}
