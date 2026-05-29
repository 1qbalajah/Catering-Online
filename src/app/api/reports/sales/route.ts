import { NextResponse } from "next/server";
import { formatRupiah } from "@/lib/packages";
import { createSimplePdf, getOrdersByPeriod } from "@/lib/reports";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  const url = new URL(request.url);
  const start = url.searchParams.get("start") ?? undefined;
  const end = url.searchParams.get("end") ?? undefined;
  const orders = await getOrdersByPeriod(start, end);
  const total = orders.reduce((sum, order) => sum + Number(order.total_bayar), 0);
  const lines = [
    `Periode: ${start ?? "awal"} sampai ${end ?? "sekarang"}`,
    `Jumlah Pesanan: ${orders.length}`,
    `Total Penjualan: ${formatRupiah(total)}`,
    "",
    "Aktivitas Transaksi:",
    ...orders.slice(0, 30).map((order) => {
      const pelanggan = Array.isArray(order.pelanggans) ? order.pelanggans[0] : order.pelanggans;
      return `#${order.id} - ${pelanggan?.nama_pelanggan ?? "-"} - ${order.status_pesan} - ${formatRupiah(Number(order.total_bayar))}`;
    }),
  ];

  return new NextResponse(createSimplePdf("Laporan Penjualan Catering", lines), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=\"laporan-penjualan.pdf\"",
      "Cache-Control": "no-store, max-age=0",
    },
  });
}
