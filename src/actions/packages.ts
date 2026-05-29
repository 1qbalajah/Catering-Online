"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { getPackageById } from "@/lib/packages";
import { createServiceClient } from "@/lib/supabase";
import { uploadPublicImage } from "@/lib/storage";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function readNumber(formData: FormData, key: string) {
  const value = Number(readString(formData, key));
  return Number.isFinite(value) ? value : 0;
}

async function imageUrl(formData: FormData, key: string, folder: string, fallback?: string | null) {
  const file = formData.get(key);

  if (file instanceof File && file.size > 0) {
    return uploadPublicImage("packages", file, folder);
  }

  return fallback ?? null;
}

function validatePackage(formData: FormData) {
  const namaPaket = readString(formData, "nama_paket");
  const jenis = readString(formData, "jenis");
  const kategori = readString(formData, "kategori");
  const jumlahPax = readNumber(formData, "jumlah_pax");
  const hargaPaket = readNumber(formData, "harga_paket");
  const deskripsi = readString(formData, "deskripsi");

  if (!namaPaket || !jenis || !kategori || jumlahPax <= 0 || hargaPaket <= 0 || !deskripsi) {
    return { error: "Semua data paket wajib diisi dengan benar." };
  }

  if (!["Prasmanan", "Box"].includes(jenis)) {
    return { error: "Jenis paket tidak valid." };
  }

  if (!["Pernikahan", "Selamatan", "Ulang Tahun", "Studi Tour", "Rapat"].includes(kategori)) {
    return { error: "Kategori paket tidak valid." };
  }

  return {
    nama_paket: namaPaket,
    jenis,
    kategori,
    jumlah_pax: jumlahPax,
    harga_paket: hargaPaket,
    deskripsi,
  };
}

export async function createPackageAction(_: unknown, formData: FormData) {
  await requireRole(["admin"]);
  const payload = validatePackage(formData);

  if ("error" in payload) {
    return payload;
  }

  let foto1: string | null = null;
  let foto2: string | null = null;
  let foto3: string | null = null;

  try {
    foto1 = await imageUrl(formData, "foto1", "pakets");
    foto2 = await imageUrl(formData, "foto2", "pakets");
    foto3 = await imageUrl(formData, "foto3", "pakets");
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload foto paket gagal." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase.from("pakets").insert({
    ...payload,
    foto1,
    foto2,
    foto3,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/paket");
  revalidatePath("/dashboard/admin/data/paket");
  redirect("/dashboard/admin/data/paket");
}

export async function updatePackageAction(_: unknown, formData: FormData) {
  await requireRole(["admin"]);
  const id = readString(formData, "id");
  const current = await getPackageById(id);

  if (!current) {
    return { error: "Paket tidak ditemukan." };
  }

  const payload = validatePackage(formData);

  if ("error" in payload) {
    return payload;
  }

  let foto1 = current.foto1;
  let foto2 = current.foto2;
  let foto3 = current.foto3;

  try {
    foto1 = await imageUrl(formData, "foto1", `pakets/${id}`, current.foto1);
    foto2 = await imageUrl(formData, "foto2", `pakets/${id}`, current.foto2);
    foto3 = await imageUrl(formData, "foto3", `pakets/${id}`, current.foto3);
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload foto paket gagal." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("pakets")
    .update({
      ...payload,
      foto1,
      foto2,
      foto3,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/paket");
  revalidatePath(`/paket/${id}`);
  revalidatePath("/dashboard/admin/data/paket");
  redirect("/dashboard/admin/data/paket");
}

export async function deletePackageAction(formData: FormData) {
  await requireRole(["admin"]);
  const id = readString(formData, "id");
  const supabase = createServiceClient();
  const { error } = await supabase.from("pakets").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/paket");
  revalidatePath("/dashboard/admin/data/paket");
}
