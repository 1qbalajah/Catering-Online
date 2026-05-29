import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { isWritableOrderStatus, updateOrderStatus } from "@/lib/orders";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

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

export async function PATCH(request: NextRequest, context: RouteContext) {
  await requireRole(["admin"]);

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as {
    status_pesan?: unknown;
    alasan_pembatalan?: unknown;
    no_resi?: unknown;
    invoice_code?: unknown;
  } | null;

  const status = typeof body?.status_pesan === "string" ? body.status_pesan.trim() : "";

  if (!isWritableOrderStatus(status)) {
    return NextResponse.json(
      { error: "Status pesanan tidak valid." },
      { status: 400 },
    );
  }

  try {
    const order = await updateOrderStatus(id, status, {
      reason: typeof body?.alasan_pembatalan === "string" ? body.alasan_pembatalan : undefined,
      noResi: typeof body?.no_resi === "string" ? body.no_resi : undefined,
      invoiceCode: typeof body?.invoice_code === "string" ? body.invoice_code : undefined,
    });

    revalidateOrderData();

    return NextResponse.json({ data: order });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal memperbarui status pesanan." },
      { status: 500 },
    );
  }
}
