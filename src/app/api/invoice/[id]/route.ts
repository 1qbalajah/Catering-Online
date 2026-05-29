import { NextResponse } from "next/server";
import { getDeliveryStatusByOrderIds } from "@/lib/deliveries";
import { getOrderViewData } from "@/lib/orders";
import { formatRupiah } from "@/lib/packages";
import { createSimplePdf } from "@/lib/reports";

type InvoiceRouteProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_: Request, { params }: InvoiceRouteProps) {
  const { id } = await params;
  const { order, details, payments } = await getOrderViewData(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const delivery = (await getDeliveryStatusByOrderIds([order.id])).get(order.id);
  const payment = payments.find((item) => item.id === order.id_jenis_bayar);
  const lines = [
    `No Pesanan: ${order.id}`,
    `Kode Invoice: ${order.invoice_code ?? "-"}`,
    `No Resi: ${order.no_resi ?? "Menunggu admin"}`,
    `Pelanggan: ${order.pelanggan?.nama_pelanggan ?? "-"}`,
    `Email: ${order.pelanggan?.email ?? "-"}`,
    `Alamat: ${order.pelanggan?.alamat1 ?? "-"}`,
    `Status Pesanan: ${order.status_pesan}`,
    `Status Pengiriman: ${delivery?.status_kirim ?? "Belum dikirim"}`,
    `Metode Pembayaran: ${payment?.metode_pembayaran ?? "-"}`,
    `Total: ${formatRupiah(order.total_bayar)}`,
    order.catatan ? `Catatan: ${order.catatan}` : "",
    order.alasan_pembatalan ? `Alasan Pembatalan: ${order.alasan_pembatalan}` : "",
    "",
    "Detail Paket:",
    ...details.map((detail) => {
      return `- ${detail.paket?.nama_paket ?? "Paket"} x${detail.jumlah}: ${formatRupiah(detail.subtotal)}`;
    }),
  ];
  const pdf = createSimplePdf("Invoice Catering Online", lines);

  return new NextResponse(pdf, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="invoice-${order.id}.pdf"`,
    },
  });
}
