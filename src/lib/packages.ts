import { createServiceClient } from "@/lib/supabase";

export type Paket = {
  id: string;
  nama_paket: string;
  jenis: string;
  kategori: string;
  jumlah_pax: number;
  harga_paket: number;
  deskripsi: string;
  foto1: string | null;
  foto2: string | null;
  foto3: string | null;
};

const paketSelect = "id,nama_paket,jenis,kategori,jumlah_pax,harga_paket,deskripsi,foto1,foto2,foto3";

export async function getPublicPackages(): Promise<Paket[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("pakets")
    .select(paketSelect)
    .order("id", { ascending: false })
    .limit(12);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((paket) => ({
    ...paket,
    id: String(paket.id),
  }));
}

export async function getAllPackagesForAdmin(): Promise<Paket[]> {
  const supabase = createServiceClient();
  const { data, error } = await supabase.from("pakets").select(paketSelect).order("id", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((paket) => ({
    ...paket,
    id: String(paket.id),
  }));
}

export async function getPackageById(id: string): Promise<Paket | null> {
  if (!/^\d+$/.test(id)) {
    return null;
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase.from("pakets").select(paketSelect).eq("id", id).maybeSingle<Paket>();

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

export function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}
