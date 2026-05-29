import { createServiceClient } from "@/lib/supabase";
import { getPaymentMethods } from "@/lib/payments";
import { getAllPackagesForAdmin, getPackageById, type Paket } from "@/lib/packages";

export type OrderStatus = "Menunggu Konfirmasi" | "Sedang Diproses" | "Dibatalkan" | "Menunggu Kurir" | "Selesai";
export type DeliveryStatus = "Menunggu Kurir" | "Sedang Dikirim" | "Tiba Ditujuan";

export type Order = {
  id: string;
  id_pelanggan: string;
  id_jenis_bayar: string;
  no_resi: string | null;
  invoice_code: string | null;
  catatan: string | null;
  alasan_pembatalan: string | null;
  tgl_pesan: string;
  status_pesan: OrderStatus;
  total_bayar: number;
  details: OrderDetailWithPackage[];
  pelanggan?: {
    nama_pelanggan: string;
    email: string;
    alamat1: string | null;
  } | null;
};

export type OrderDetail = {
  id?: string;
  id_pemesanan: string;
  id_paket: string;
  jumlah: number;
  harga_satuan: number;
  subtotal: number;
};

export type OrderDetailWithPackage = OrderDetail & {
  paket: Paket | null;
};

export type CreateOrderItemInput = {
  paketId: string;
  jumlah?: number;
};

const orderSelect =
  "id,id_pelanggan,id_jenis_bayar,no_resi,invoice_code,catatan,alasan_pembatalan,tgl_pesan,status_pesan,total_bayar,pelanggans(nama_pelanggan,email,alamat1),detail_pemesanans(id,id_pemesanan,id_paket,jumlah,harga_satuan,subtotal,pakets(id,nama_paket,jenis,kategori,jumlah_pax,harga_paket,deskripsi,foto1,foto2,foto3))";
const legacyOrderSelect =
  "id,id_pelanggan,id_jenis_bayar,no_resi,tgl_pesan,status_pesan,total_bayar,pelanggans(nama_pelanggan,email,alamat1),detail_pemesanans(id_pemesanan,id_paket,subtotal,pakets(id,nama_paket,jenis,kategori,jumlah_pax,harga_paket,deskripsi,foto1,foto2,foto3))";

function isMissingColumnError(error: { message?: string } | null) {
  return Boolean(error?.message?.toLowerCase().includes("does not exist"));
}

export async function getOrdersByPelanggan(pelangganId: string) {
  const supabase = createServiceClient();
  let result: any = await supabase
    .from("pemesanans")
    .select(orderSelect)
    .eq("id_pelanggan", pelangganId)
    .order("id", { ascending: false });

  if (isMissingColumnError(result.error)) {
    result = await supabase
      .from("pemesanans")
      .select(legacyOrderSelect)
      .eq("id_pelanggan", pelangganId)
      .order("id", { ascending: false });
  }

  if (result.error) throw new Error(result.error.message);

  return normalizeOrders(result.data ?? []);
}

export async function getAllOrders() {
  const supabase = createServiceClient();
  let result: any = await supabase.from("pemesanans").select(orderSelect).order("id", { ascending: false });

  if (isMissingColumnError(result.error)) {
    result = await supabase.from("pemesanans").select(legacyOrderSelect).order("id", { ascending: false });
  }

  if (result.error) throw new Error(result.error.message);

  return normalizeOrders(result.data ?? []);
}

export async function getOrdersWaitingCourier() {
  const supabase = createServiceClient();
  let result: any = await supabase
    .from("pengirimans")
    .select(`id_pesan,status_kirim,pemesanans(${orderSelect})`)
    .eq("status_kirim", "Menunggu Kurir")
    .order("id", { ascending: false });

  if (isMissingColumnError(result.error)) {
    result = await supabase
      .from("pengirimans")
      .select(`id_pesan,status_kirim,pemesanans(${legacyOrderSelect})`)
      .eq("status_kirim", "Menunggu Kurir")
      .order("id", { ascending: false });
  }

  if (result.error) {
    const orders = await getAllOrders();
    return orders.filter((order) => order.status_pesan === "Menunggu Kurir");
  }

  const orders = (result.data ?? [])
    .map((row: unknown) => {
      const item = row as { pemesanans?: unknown | unknown[] };
      return Array.isArray(item.pemesanans) ? item.pemesanans[0] : item.pemesanans;
    })
    .filter(Boolean);

  const normalized = normalizeOrders(orders);

  if (!normalized.length) {
    const legacyOrders = await getAllOrders();
    return legacyOrders.filter((order) => order.status_pesan === "Menunggu Kurir");
  }

  return normalized;
}

export async function getOrderDetails(orderId: string) {
  const supabase = createServiceClient();
  let result: any = await supabase
    .from("detail_pemesanans")
    .select("id,id_pemesanan,id_paket,jumlah,harga_satuan,subtotal,pakets(id,nama_paket,jenis,kategori,jumlah_pax,harga_paket,deskripsi,foto1,foto2,foto3)")
    .eq("id_pemesanan", orderId);

  if (isMissingColumnError(result.error)) {
    result = await supabase
      .from("detail_pemesanans")
      .select("id_pemesanan,id_paket,subtotal,pakets(id,nama_paket,jenis,kategori,jumlah_pax,harga_paket,deskripsi,foto1,foto2,foto3)")
      .eq("id_pemesanan", orderId);
  }

  if (result.error) throw new Error(result.error.message);

  return normalizeOrderDetails(result.data ?? []);
}

export async function getOrderById(orderId: string) {
  const supabase = createServiceClient();
  let result: any = await supabase.from("pemesanans").select(orderSelect).eq("id", orderId).maybeSingle();

  if (isMissingColumnError(result.error)) {
    result = await supabase.from("pemesanans").select(legacyOrderSelect).eq("id", orderId).maybeSingle();
  }

  if (result.error) throw new Error(result.error.message);

  return result.data ? normalizeOrders([result.data])[0] : null;
}

export async function createOrder(input: {
  pelangganId: string;
  jenisBayarId: string;
  items: CreateOrderItemInput[];
  catatan?: string | null;
}) {
  const items = input.items
    .map((item) => ({ paketId: item.paketId, jumlah: Math.max(1, Number(item.jumlah ?? 1)) }))
    .filter((item) => item.paketId);

  if (!input.pelangganId || !input.jenisBayarId || !items.length) {
    throw new Error("Data pemesanan tidak lengkap.");
  }

  const packages = await Promise.all(items.map((item) => getPackageById(item.paketId)));
  const details = items.map((item, index) => {
    const paket = packages[index];

    if (!paket) {
      throw new Error("Paket tidak ditemukan.");
    }

    const hargaSatuan = Number(paket.harga_paket);
    const jumlah = item.jumlah;

    return {
      id_paket: paket.id,
      jumlah,
      harga_satuan: hargaSatuan,
      subtotal: hargaSatuan * jumlah,
    };
  });
  const totalBayar = details.reduce((sum, detail) => sum + detail.subtotal, 0);
  const supabase = createServiceClient();
  let orderResult = await supabase
    .from("pemesanans")
    .insert({
      id_pelanggan: input.pelangganId,
      id_jenis_bayar: input.jenisBayarId,
      status_pesan: "Menunggu Konfirmasi",
      total_bayar: totalBayar,
      catatan: input.catatan || null,
    })
    .select("id")
    .single<{ id: string }>();

  if (orderResult.error?.message.toLowerCase().includes("catatan")) {
    orderResult = await supabase
      .from("pemesanans")
      .insert({
        id_pelanggan: input.pelangganId,
        id_jenis_bayar: input.jenisBayarId,
        status_pesan: "Menunggu Konfirmasi",
        total_bayar: totalBayar,
      })
      .select("id")
      .single<{ id: string }>();
  }

  if (orderResult.error) throw new Error(orderResult.error.message);

  const orderId = String(orderResult.data.id);
  let detailResult = await supabase.from("detail_pemesanans").insert(
    details.map((detail) => ({
      id_pemesanan: orderId,
      ...detail,
    })),
  );

  if (detailResult.error?.message.toLowerCase().includes("jumlah") || detailResult.error?.message.toLowerCase().includes("harga_satuan")) {
    detailResult = await supabase.from("detail_pemesanans").insert(
      details.map((detail) => ({
        id_pemesanan: orderId,
        id_paket: detail.id_paket,
        subtotal: detail.subtotal,
      })),
    );
  }

  if (detailResult.error) throw new Error(detailResult.error.message);

  return orderId;
}

function normalizeOrderDetails(rows: unknown[]): OrderDetailWithPackage[] {
  return rows.map((detail) => {
    const item = detail as OrderDetail & { pakets?: Paket | Paket[] | null };
    const paket = Array.isArray(item.pakets) ? item.pakets[0] : item.pakets;

    return {
      id: item.id ? String(item.id) : undefined,
      id_pemesanan: String(item.id_pemesanan),
      id_paket: String(item.id_paket),
      jumlah: Number(item.jumlah ?? 1),
      harga_satuan: Number(item.harga_satuan ?? item.subtotal ?? paket?.harga_paket ?? 0),
      subtotal: Number(item.subtotal),
      paket: paket
        ? {
            ...paket,
            id: String(paket.id),
            harga_paket: Number(paket.harga_paket),
            jumlah_pax: Number(paket.jumlah_pax),
          }
        : null,
    };
  });
}

export async function getOrderViewData(orderId: string) {
  const [orders, details, packages, payments] = await Promise.all([
    getAllOrders(),
    getOrderDetails(orderId),
    getAllPackagesForAdmin(),
    getPaymentMethods(),
  ]);

  return {
    order: orders.find((item) => item.id === orderId) ?? null,
    details,
    packages,
    payments,
  };
}

export const writableOrderStatuses = [
  "Menunggu Konfirmasi",
  "Sedang Diproses",
  "Menunggu Kurir",
  "Dibatalkan",
  "Selesai",
] as const;

export type WritableOrderStatus = (typeof writableOrderStatuses)[number];

export function isWritableOrderStatus(status: string): status is WritableOrderStatus {
  return writableOrderStatuses.includes(status as WritableOrderStatus);
}

type UpdateOrderStatusOptions = {
  reason?: string | null;
  noResi?: string | null;
  invoiceCode?: string | null;
};

export async function updateOrderStatus(orderId: string, status: WritableOrderStatus, options: UpdateOrderStatusOptions = {}) {
  if (!orderId) {
    throw new Error("ID pesanan wajib diisi.");
  }

  const supabase = createServiceClient();
  const payload: Record<string, string | null> = {
    status_pesan: status,
    updated_at: new Date().toISOString(),
  };

  if (options.reason !== undefined) payload.alasan_pembatalan = options.reason;
  if (options.noResi !== undefined) payload.no_resi = options.noResi;
  if (options.invoiceCode !== undefined) payload.invoice_code = options.invoiceCode;

  let result = await supabase
    .from("pemesanans")
    .update(payload)
    .eq("id", orderId)
    .select("id,status_pesan")
    .maybeSingle<{ id: string; status_pesan: WritableOrderStatus }>();

  if (result.error?.message.toLowerCase().includes("updated_at")) {
    const { updated_at: _updatedAt, ...legacyPayload } = payload;
    result = await supabase
      .from("pemesanans")
      .update(legacyPayload)
      .eq("id", orderId)
      .select("id,status_pesan")
      .maybeSingle<{ id: string; status_pesan: WritableOrderStatus }>();
  }

  if (result.error) {
    throw new Error(result.error.message);
  }

  if (!result.data) {
    throw new Error("Pesanan tidak ditemukan atau status gagal diperbarui.");
  }

  return {
    id: String(result.data.id),
    status_pesan: result.data.status_pesan,
  };
}

function normalizeOrders(rows: unknown[]): Order[] {
  return rows.map((row) => {
    const item = row as Order & {
      pelanggans?: Order["pelanggan"] | Order["pelanggan"][];
      detail_pemesanans?: unknown[];
    };
    const pelanggan = Array.isArray(item.pelanggans) ? item.pelanggans[0] : item.pelanggans;

    return {
      ...item,
      id: String(item.id),
      id_pelanggan: String(item.id_pelanggan),
      id_jenis_bayar: String(item.id_jenis_bayar),
      invoice_code: item.invoice_code ?? null,
      catatan: item.catatan ?? null,
      alasan_pembatalan: item.alasan_pembatalan ?? null,
      total_bayar: Number(item.total_bayar),
      details: normalizeOrderDetails(item.detail_pemesanans ?? []),
      pelanggan: pelanggan ?? null,
    };
  });
}

export function getPrimaryOrderPackage(order: Pick<Order, "details">) {
  return order.details.find((detail) => detail.paket)?.paket ?? null;
}

export function getPrimaryOrderImage(order: Pick<Order, "details">) {
  const paket = getPrimaryOrderPackage(order);
  return paket?.foto1 ?? paket?.foto2 ?? paket?.foto3 ?? null;
}

export function generateResi(orderId: string) {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate(),
  ).padStart(2, "0")}`;

  return `CTR-${stamp}-${String(orderId).padStart(5, "0")}`;
}

export function generateInvoiceCode(orderId: string) {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(
    date.getDate(),
  ).padStart(2, "0")}`;

  return `INV-${stamp}-${String(orderId).padStart(5, "0")}`;
}
