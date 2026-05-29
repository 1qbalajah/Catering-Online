import { createServiceClient } from "@/lib/supabase";

export type PelangganProfile = {
  id: string;
  nama_pelanggan: string;
  email: string;
  tgl_lahir: string | null;
  telepon: string | null;
  alamat1: string | null;
  alamat2: string | null;
  alamat3: string | null;
  kartu_id: string | null;
  foto: string | null;
};

export async function getPelangganProfile(id: string) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("pelanggans")
    .select("id,nama_pelanggan,email,tgl_lahir,telepon,alamat1,alamat2,alamat3,kartu_id,foto")
    .eq("id", id)
    .maybeSingle<PelangganProfile>();

  if (error) {
    throw new Error(error.message);
  }

  return data
    ? {
        ...data,
        id: String(data.id),
      }
    : null;
}
