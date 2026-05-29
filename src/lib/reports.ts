import { createServiceClient } from "@/lib/supabase";
import { getAllOrders } from "@/lib/orders";

function isMissingColumnError(error: { message?: string } | null) {
  return Boolean(error?.message?.toLowerCase().includes("does not exist"));
}

export type SalesSummary = {
  totalOrders: number;
  totalSales: number;
  pendingOrders: number;
  confirmedOrders: number;
  todayOrders: number;
  totalProducts: number;
  completedOrders: number;
};

export type ReportOrder = {
  id: string | number;
  id_pelanggan: string | number;
  id_jenis_bayar: string | number;
  no_resi: string | null;
  tgl_pesan: string;
  status_pesan: string;
  total_bayar: number | string;
  pelanggans?: {
    nama_pelanggan: string;
    email: string;
    alamat1: string | null;
  } | {
    nama_pelanggan: string;
    email: string;
    alamat1: string | null;
  }[] | null;
  detail_pemesanans?: Array<{
    id_paket: string | number;
    jumlah?: number | null;
    harga_satuan?: number | string | null;
    subtotal: number | string;
    pakets?: {
      id: string | number;
      nama_paket: string;
      foto1: string | null;
      foto2: string | null;
      foto3: string | null;
    } | {
      id: string | number;
      nama_paket: string;
      foto1: string | null;
      foto2: string | null;
      foto3: string | null;
    }[] | null;
  }>;
};

export async function getSalesSummary(): Promise<SalesSummary> {
  const supabase = createServiceClient();
  const [orders, packagesResult, completedResult] = await Promise.all([
    getAllOrders(),
    supabase.from("pakets").select("id", { count: "exact", head: true }),
    supabase.from("pengirimans").select("id", { count: "exact", head: true }).eq("status_kirim", "Tiba Ditujuan"),
  ]);
  const today = new Date().toISOString().slice(0, 10);

  return {
    totalOrders: orders.length,
    totalSales: orders.reduce((sum, order) => sum + order.total_bayar, 0),
    pendingOrders: orders.filter((order) => order.status_pesan === "Menunggu Konfirmasi").length,
    confirmedOrders: orders.filter((order) => order.status_pesan === "Sedang Diproses").length,
    todayOrders: orders.filter((order) => (order.tgl_pesan ?? "").slice(0, 10) === today).length,
    totalProducts: packagesResult.count ?? 0,
    completedOrders: completedResult.count ?? 0,
  };
}

export async function getMonthlyOrderStats() {
  const orders = await getAllOrders();
  const formatter = new Intl.DateTimeFormat("id-ID", { month: "short" });
  const now = new Date();
  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - 11 + index, 1);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

    return {
      key,
      label: formatter.format(date),
      orders: 0,
      revenue: 0,
    };
  });
  const map = new Map(months.map((item) => [item.key, item]));

  orders.forEach((order) => {
    if (!order.tgl_pesan || order.status_pesan === "Dibatalkan") return;
    const date = new Date(order.tgl_pesan);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    const point = map.get(key);

    if (point) {
      point.orders += 1;
      point.revenue += order.total_bayar;
    }
  });

  return months;
}

export async function getOrdersByPeriod(start?: string, end?: string): Promise<ReportOrder[]> {
  const supabase = createServiceClient();
  const modernSelect =
    "id,id_pelanggan,id_jenis_bayar,no_resi,tgl_pesan,status_pesan,total_bayar,pelanggans(nama_pelanggan,email,alamat1),detail_pemesanans(id_paket,jumlah,harga_satuan,subtotal,pakets(id,nama_paket,foto1,foto2,foto3))";
  const legacySelect =
    "id,id_pelanggan,id_jenis_bayar,no_resi,tgl_pesan,status_pesan,total_bayar,pelanggans(nama_pelanggan,email,alamat1),detail_pemesanans(id_paket,subtotal,pakets(id,nama_paket,foto1,foto2,foto3))";

  const buildQuery = (select: string) => {
    let query = supabase.from("pemesanans").select(select).order("tgl_pesan", { ascending: false });

    if (start) {
      query = query.gte("tgl_pesan", `${start}T00:00:00`);
    }

    if (end) {
      query = query.lte("tgl_pesan", `${end}T23:59:59`);
    }

    return query;
  };

  let result = await buildQuery(modernSelect);

  if (isMissingColumnError(result.error)) {
    result = await buildQuery(legacySelect);
  }

  if (result.error) throw new Error(result.error.message);

  return (result.data ?? []) as unknown as ReportOrder[];
}

export function createSimplePdf(title: string, lines: string[]) {
  const content = [`BT /F1 18 Tf 50 780 Td (${escapePdf(title)}) Tj ET`]
    .concat(
      lines.map((line, index) => `BT /F1 10 Tf 50 ${740 - index * 18} Td (${escapePdf(line)}) Tj ET`),
    )
    .join("\n");
  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${content.length} >> stream\n${content}\nendstream endobj`,
  ];
  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object) => {
    offsets.push(pdf.length);
    pdf += `${object}\n`;
  });

  const xref = pdf.length;
  pdf += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, "0")} 00000 n \n`;
  });
  pdf += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;

  return pdf;
}

function escapePdf(value: string) {
  return value.replaceAll("\\", "\\\\").replaceAll("(", "\\(").replaceAll(")", "\\)");
}
