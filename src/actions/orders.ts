"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireRole } from "@/lib/auth";
import { createOrder, generateInvoiceCode, generateResi, updateOrderStatus } from "@/lib/orders";
import { createServiceClient } from "@/lib/supabase";
import { uploadPublicImage } from "@/lib/storage";

function readString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function revalidateOrderData() {
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/admin/orders");
  revalidatePath("/dashboard/admin/reports");
  revalidatePath("/dashboard/owner");
  revalidatePath("/dashboard/owner/analytics");
  revalidatePath("/dashboard/owner/reports");
  revalidatePath("/dashboard/kurir");
  revalidatePath("/dashboard/kurir/pengiriman");
  revalidatePath("/dashboard/kurir/riwayat");
  revalidatePath("/profile/orders");
  revalidatePath("/api/reports/sales");
}

export async function createOrderAction(formData: FormData) {
  const user = await requireRole(["user"]);

  if (user.accountType !== "pelanggan") {
    redirect("/login");
  }

  const paketId = readString(formData, "id_paket");
  const jenisBayarId = readString(formData, "id_jenis_bayar");
  const catatan = readString(formData, "catatan");
  const jumlah = Number(readString(formData, "jumlah") || 1);

  if (!paketId || !jenisBayarId) {
    throw new Error("Paket atau metode pembayaran tidak valid.");
  }

  await createOrder({
    pelangganId: user.id,
    jenisBayarId,
    catatan,
    items: [{ paketId, jumlah }],
  });

  revalidatePath("/profile");
  revalidatePath("/profile/orders");
  redirect("/profile/orders");
}

export async function confirmOrderAction(formData: FormData) {
  const admin = await requireRole(["admin"]);
  const orderId = readString(formData, "id");
  const supabase = createServiceClient();
  const resi = generateResi(orderId);
  const invoiceCode = generateInvoiceCode(orderId);

  try {
    await updateOrderStatus(orderId, "Sedang Diproses", {
      noResi: resi,
      invoiceCode,
    });
  } catch (error) {
    if (error instanceof Error && error.message.toLowerCase().includes("invoice_code")) {
      await updateOrderStatus(orderId, "Sedang Diproses", { noResi: resi });
    } else {
      throw error;
    }
  }

  let deliveryResult = await supabase.from("pengirimans").insert({
    id_pesan: orderId,
    id_user: null,
    no_resi: resi,
    status_kirim: "Menunggu Kurir",
    estimasi_tiba: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  });

  if (deliveryResult.error) {
    deliveryResult = await supabase.from("pengirimans").insert({
      id_pesan: orderId,
      id_user: admin.id,
      status_kirim: "Menunggu Kurir",
    });
  }

  if (deliveryResult.error && !deliveryResult.error.message.toLowerCase().includes("duplicate")) {
    throw new Error(deliveryResult.error.message);
  }

  revalidateOrderData();
}

export async function rejectOrderAction(_: unknown, formData: FormData) {
  const user = await requireRole(["user"]);
  const orderId = readString(formData, "id");
  const reason = readString(formData, "alasan_pembatalan");

  if (!reason) {
    return { error: "Alasan pembatalan wajib diisi.", success: "" };
  }

  try {
    const supabase = createServiceClient();
    const { data: order, error: orderError } = await supabase
      .from("pemesanans")
      .select("id")
      .eq("id", orderId)
      .eq("id_pelanggan", user.id)
      .maybeSingle<{ id: string }>();

    if (orderError) return { error: orderError.message, success: "" };
    if (!order) return { error: "Pesanan tidak ditemukan.", success: "" };

    try {
      await updateOrderStatus(orderId, "Dibatalkan", { reason });
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("alasan_pembatalan")) {
        await updateOrderStatus(orderId, "Dibatalkan");
      } else {
        throw error;
      }
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Gagal membatalkan pesanan.", success: "" };
  }

  revalidateOrderData();

  return { error: "", success: "Pesanan berhasil dibatalkan." };
}

export async function startDeliveryAction(formData: FormData) {
  const user = await requireRole(["kurir"]);
  const deliveryId = readString(formData, "id");
  const supabase = createServiceClient();

  if (deliveryId.startsWith("order:")) {
    const orderId = deliveryId.replace("order:", "");
    let result = await supabase.from("pengirimans").insert({
      id_pesan: orderId,
      id_user: user.id,
      status_kirim: "Sedang Dikirim",
    });

    if (result.error) {
      result = await supabase
        .from("pengirimans")
        .update({
          id_user: user.id,
          status_kirim: "Sedang Dikirim",
          tgl_kirim: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id_pesan", orderId)
        .eq("status_kirim", "Menunggu Kurir");
    }

    if (result.error) throw new Error(result.error.message);

    await updateOrderStatus(orderId, "Menunggu Kurir");

    revalidateOrderData();
    return;
  }

  const { error } = await supabase
    .from("pengirimans")
    .update({
    id_user: user.id,
    status_kirim: "Sedang Dikirim",
      tgl_kirim: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", deliveryId)
    .eq("status_kirim", "Menunggu Kurir");

  if (error) throw new Error(error.message);

  const { data: delivery, error: deliveryError } = await supabase
    .from("pengirimans")
    .select("id_pesan")
    .eq("id", deliveryId)
    .maybeSingle<{ id_pesan: string }>();

  if (deliveryError) throw new Error(deliveryError.message);

  if (delivery?.id_pesan) {
    await updateOrderStatus(String(delivery.id_pesan), "Menunggu Kurir");
  }

  revalidateOrderData();
}

export async function finishDeliveryAction(_: unknown, formData: FormData) {
  await requireRole(["kurir"]);
  const pengirimanId = readString(formData, "id");
  const buktiFoto = formData.get("bukti_foto");
  let buktiUrl: string | null = null;

  try {
    if (buktiFoto instanceof File && buktiFoto.size > 0) {
      buktiUrl = await uploadPublicImage("deliveries", buktiFoto, `pengirimans/${pengirimanId}`);
    }
  } catch (error) {
    return { error: error instanceof Error ? error.message : "Upload bukti gagal." };
  }

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("pengirimans")
    .update({
      bukti_foto: buktiUrl,
      tgl_tiba: new Date().toISOString(),
      status_kirim: "Tiba Ditujuan",
      updated_at: new Date().toISOString(),
    })
    .eq("id", pengirimanId);

  if (error) return { error: error.message };

  const { data: delivery, error: deliveryError } = await supabase
    .from("pengirimans")
    .select("id_pesan")
    .eq("id", pengirimanId)
    .maybeSingle<{ id_pesan: string }>();

  if (deliveryError) return { error: deliveryError.message };

  if (delivery?.id_pesan) {
    try {
      await updateOrderStatus(String(delivery.id_pesan), "Selesai");
    } catch (error) {
      return { error: error instanceof Error ? error.message : "Gagal memperbarui status pesanan." };
    }
  }

  revalidateOrderData();
  redirect("/dashboard/kurir/riwayat");
}
