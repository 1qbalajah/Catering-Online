"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getPelangganProfile } from "@/lib/pelanggan";
import { createSession } from "@/lib/session";
import { createServiceClient } from "@/lib/supabase";
import { uploadPublicImage } from "@/lib/storage";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function updateProfileAction(_: unknown, formData: FormData) {
  const user = await requireRole(["user"]);

  if (user.accountType !== "pelanggan") {
    return { error: "Profile pelanggan tidak ditemukan." };
  }

  const namaPelanggan = readString(formData, "nama_pelanggan");
  const tglLahir = readString(formData, "tgl_lahir");
  const telepon = readString(formData, "telepon");
  const alamat1 = readString(formData, "alamat1");
  const alamat2 = readString(formData, "alamat2");
  const alamat3 = readString(formData, "alamat3");
  const kartuId = readString(formData, "kartu_id");
  const foto = formData.get("foto");

  if (!namaPelanggan || !alamat1) {
    return { error: "Nama pelanggan dan alamat utama wajib diisi." };
  }

  let fotoUrl: string | null = null;

  try {
    if (foto instanceof File && foto.size > 0) {
      fotoUrl = await uploadPublicImage("profiles", foto, `pelanggans/${user.id}`);
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload foto gagal." };
  }

  const currentProfile = await getPelangganProfile(user.id);
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("pelanggans")
    .update({
      nama_pelanggan: namaPelanggan,
      tgl_lahir: tglLahir || null,
      telepon: telepon || null,
      alamat1,
      alamat2: alamat2 || null,
      alamat3: alamat3 || null,
      kartu_id: kartuId || null,
      foto: fotoUrl ?? currentProfile?.foto ?? null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message };
  }

  await createSession({
    user: {
      ...user,
      name: namaPelanggan,
    },
  });

  revalidatePath("/profile");
  redirect("/profile");
}
