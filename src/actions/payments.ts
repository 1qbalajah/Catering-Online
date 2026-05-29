"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createServiceClient } from "@/lib/supabase";
import { uploadPublicImage } from "@/lib/storage";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createPaymentMethodAction(_: unknown, formData: FormData) {
  await requireRole(["admin"]);
  const metodePembayaran = readString(formData, "metode_pembayaran");
  const noRek = readString(formData, "no_rek");
  const tempatBayar = readString(formData, "tempat_bayar");
  const logo = formData.get("logo");

  if (!metodePembayaran || !noRek || !tempatBayar) {
    return { error: "Metode pembayaran, nomor pembayaran, dan tempat bayar wajib diisi." };
  }

  let logoUrl: string | null = null;

  try {
    if (logo instanceof File && logo.size > 0) {
      logoUrl = await uploadPublicImage("payments", logo, "logos");
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload logo gagal." };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("jenis_pembayarans")
    .insert({ metode_pembayaran: metodePembayaran })
    .select("id")
    .single<{ id: string }>();

  if (error) {
    return { error: error.message };
  }

  const { error: detailError } = await supabase.from("detail_jenis_pembayarans").insert({
    id_jenis_pembayaran: data.id,
    no_rek: noRek,
    tempat_bayar: tempatBayar,
    logo: logoUrl,
  });

  if (detailError) {
    return { error: detailError.message };
  }

  revalidatePath("/dashboard/admin/data/pembayaran");
  redirect("/dashboard/admin/data/pembayaran");
}

export async function updatePaymentMethodAction(_: unknown, formData: FormData) {
  await requireRole(["admin"]);
  const id = readString(formData, "id");
  const detailId = readString(formData, "detail_id");
  const metodePembayaran = readString(formData, "metode_pembayaran");
  const noRek = readString(formData, "no_rek");
  const tempatBayar = readString(formData, "tempat_bayar");
  const logo = formData.get("logo");

  if (!id || !metodePembayaran || !noRek || !tempatBayar) {
    return { error: "Data metode pembayaran wajib lengkap." };
  }

  let logoUrl = readString(formData, "current_logo") || null;

  try {
    if (logo instanceof File && logo.size > 0) {
      logoUrl = await uploadPublicImage("payments", logo, "logos");
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload logo gagal." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("jenis_pembayarans")
    .update({
      metode_pembayaran: metodePembayaran,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  if (detailId) {
    const { error: detailError } = await supabase
      .from("detail_jenis_pembayarans")
      .update({
        no_rek: noRek,
        tempat_bayar: tempatBayar,
        logo: logoUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", detailId);

    if (detailError) return { error: detailError.message };
  } else {
    const { error: detailError } = await supabase.from("detail_jenis_pembayarans").insert({
      id_jenis_pembayaran: id,
      no_rek: noRek,
      tempat_bayar: tempatBayar,
      logo: logoUrl,
    });

    if (detailError) return { error: detailError.message };
  }

  revalidatePath("/dashboard/admin/data/pembayaran");
  redirect("/dashboard/admin/data/pembayaran");
}

export async function deletePaymentMethodAction(formData: FormData) {
  await requireRole(["admin"]);
  const id = readString(formData, "id");
  const supabase = createServiceClient();

  await supabase.from("detail_jenis_pembayarans").delete().eq("id_jenis_pembayaran", id);
  const { error } = await supabase.from("jenis_pembayarans").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/dashboard/admin/data/pembayaran");
}
