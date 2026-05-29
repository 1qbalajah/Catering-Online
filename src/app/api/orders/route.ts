import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/lib/auth";
import { createOrder } from "@/lib/orders";

export async function POST(request: NextRequest) {
  const user = await requireRole(["user"]);

  if (user.accountType !== "pelanggan") {
    return NextResponse.json({ error: "Akun pelanggan diperlukan." }, { status: 403 });
  }

  const body = (await request.json().catch(() => null)) as {
    id_jenis_bayar?: unknown;
    catatan?: unknown;
    items?: unknown;
  } | null;

  const jenisBayarId = typeof body?.id_jenis_bayar === "string" ? body.id_jenis_bayar.trim() : "";
  const items = Array.isArray(body?.items)
    ? body.items.map((item) => {
        const value = item as { id_paket?: unknown; jumlah?: unknown };

        return {
          paketId: typeof value.id_paket === "string" ? value.id_paket.trim() : "",
          jumlah: Number(value.jumlah ?? 1),
        };
      })
    : [];

  if (!jenisBayarId || !items.length) {
    return NextResponse.json({ error: "Metode pembayaran dan item paket wajib diisi." }, { status: 400 });
  }

  try {
    const orderId = await createOrder({
      pelangganId: user.id,
      jenisBayarId,
      items,
      catatan: typeof body?.catatan === "string" ? body.catatan : null,
    });

    revalidatePath("/profile/orders");
    revalidatePath("/dashboard/admin");
    revalidatePath("/dashboard/admin/orders");
    revalidatePath("/dashboard/admin/reports");

    return NextResponse.json({ data: { id: orderId } }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Gagal membuat pesanan." },
      { status: 500 },
    );
  }
}
