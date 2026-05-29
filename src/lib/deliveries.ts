import { createServiceClient } from "@/lib/supabase";
import { getAllOrders, getPrimaryOrderImage } from "@/lib/orders";

type DeliveryPelanggan = {
  nama_pelanggan: string;
  email: string;
  alamat1: string | null;
};

export type Delivery = {
  id: string;
  id_pesan: string;
  id_user: string | null;
  tgl_kirim: string;
  tgl_tiba: string | null;
  status_kirim: string;
  bukti_foto: string | null;
  no_resi: string | null;
  estimasi_tiba: string | null;
  pemesanan?: {
    pelanggan?: DeliveryPelanggan | null;
    total_bayar: number;
    package_image_url: string | null;
  } | null;
};

const deliverySelect =
  "id,id_pesan,id_user,tgl_kirim,tgl_tiba,status_kirim,bukti_foto,no_resi,estimasi_tiba,pemesanans(total_bayar,pelanggans(nama_pelanggan,email,alamat1),detail_pemesanans(id_paket,pakets(foto1,foto2,foto3)))";
const legacyDeliverySelect =
  "id,id_pesan,id_user,tgl_kirim,tgl_tiba,status_kirim,bukti_foto,pemesanans(total_bayar,pelanggans(nama_pelanggan,email,alamat1))";

function isMissingColumnError(error: { message?: string } | null) {
  return Boolean(error?.message?.toLowerCase().includes("does not exist"));
}

export async function getDeliveriesByCourier(courierId: string) {
  const supabase = createServiceClient();
  let result: Awaited<ReturnType<typeof supabase.from>> | any = await supabase
    .from("pengirimans")
    .select(deliverySelect)
    .eq("id_user", courierId)
    .order("id", { ascending: false });

  if (isMissingColumnError(result.error)) {
    result = await supabase
      .from("pengirimans")
      .select(legacyDeliverySelect)
      .eq("id_user", courierId)
      .order("id", { ascending: false });
  }

  if (result.error) throw new Error(result.error.message);

  return normalizeDeliveries(result.data ?? []);
}

export async function getWaitingCourierDeliveries() {
  const supabase = createServiceClient();
  let result: Awaited<ReturnType<typeof supabase.from>> | any = await supabase
    .from("pengirimans")
    .select(deliverySelect)
    .eq("status_kirim", "Menunggu Kurir")
    .order("id", { ascending: false });

  if (isMissingColumnError(result.error)) {
    result = await supabase
      .from("pengirimans")
      .select(legacyDeliverySelect)
      .eq("status_kirim", "Menunggu Kurir")
      .order("id", { ascending: false });
  }

  if (result.error) return getAdminConfirmedCourierTasks([]);

  const deliveries = normalizeDeliveries(result.data ?? []);
  const confirmedTasks = await getAdminConfirmedCourierTasks(deliveries.map((delivery) => delivery.id_pesan));

  return [...deliveries, ...confirmedTasks];
}

export async function getDeliveryStatusByOrderIds(orderIds: string[]) {
  if (!orderIds.length) return new Map<string, Delivery>();

  const supabase = createServiceClient();
  let result: Awaited<ReturnType<typeof supabase.from>> | any = await supabase
    .from("pengirimans")
    .select("id,id_pesan,id_user,tgl_kirim,tgl_tiba,status_kirim,bukti_foto,no_resi,estimasi_tiba")
    .in("id_pesan", orderIds)
    .order("id", { ascending: false });

  if (isMissingColumnError(result.error)) {
    result = await supabase
      .from("pengirimans")
      .select("id,id_pesan,id_user,tgl_kirim,tgl_tiba,status_kirim,bukti_foto")
      .in("id_pesan", orderIds)
      .order("id", { ascending: false });
  }

  if (result.error) throw new Error(result.error.message);

  const map = new Map<string, Delivery>();

  (result.data ?? []).forEach((item: Record<string, unknown>) => {
    const delivery = {
      ...item,
      id: String(item.id),
      id_pesan: String(item.id_pesan),
      id_user: String(item.id_user),
    } as Delivery;

    if (!map.has(delivery.id_pesan)) {
      map.set(delivery.id_pesan, delivery);
    }
  });

  return map;
}

function normalizeDeliveries(rows: unknown[]) {
  return rows.map((item) => {
    const row = item as Delivery & {
      pemesanans?: {
        total_bayar: number;
        pelanggans?: DeliveryPelanggan | DeliveryPelanggan[];
        detail_pemesanans?: Array<{
          pakets?: { foto1: string | null; foto2: string | null; foto3: string | null } | { foto1: string | null; foto2: string | null; foto3: string | null }[] | null;
        }>;
      } | null;
    };
    const pelanggan = Array.isArray(row.pemesanans?.pelanggans)
      ? row.pemesanans?.pelanggans[0]
      : row.pemesanans?.pelanggans;
    const firstDetail = row.pemesanans?.detail_pemesanans?.[0];
    const paket = Array.isArray(firstDetail?.pakets) ? firstDetail?.pakets[0] : firstDetail?.pakets;

    return {
      ...row,
      id: String(row.id),
      id_pesan: String(row.id_pesan),
      id_user: row.id_user ? String(row.id_user) : null,
      no_resi: row.no_resi ?? null,
      estimasi_tiba: row.estimasi_tiba ?? null,
      pemesanan: row.pemesanans
        ? {
            total_bayar: Number(row.pemesanans.total_bayar),
            package_image_url: paket?.foto1 ?? paket?.foto2 ?? paket?.foto3 ?? null,
            pelanggan: pelanggan ?? null,
          }
        : null,
    };
  }) as Delivery[];
}

async function getAdminConfirmedCourierTasks(existingOrderIds: string[]) {
  const orders = await getAllOrders();
  const candidates = orders.filter(
    (order) =>
      (order.status_pesan === "Sedang Diproses" || order.status_pesan === "Menunggu Kurir") &&
      !existingOrderIds.includes(order.id),
  );
  const deliveryMap = await getDeliveryStatusByOrderIds(candidates.map((order) => order.id));
  const queueOrders = candidates.filter((order) => {
    const delivery = deliveryMap.get(order.id);

    return !delivery || delivery.status_kirim === "Menunggu Kurir";
  });

  return queueOrders.map((order) => ({
    id: `order:${order.id}`,
    id_pesan: order.id,
    id_user: null,
    tgl_kirim: order.tgl_pesan,
    tgl_tiba: null,
    status_kirim: "Menunggu Kurir",
    bukti_foto: null,
    no_resi: order.no_resi,
    estimasi_tiba: null,
    pemesanan: {
      pelanggan: order.pelanggan ?? null,
      total_bayar: order.total_bayar,
      package_image_url: getPrimaryOrderImage(order),
    },
  })) satisfies Delivery[];
}
