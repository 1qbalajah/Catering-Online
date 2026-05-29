import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";

export async function GET() {
  try {
    const session = await getSession();

    return NextResponse.json({
      authenticated: Boolean(session),
      role: session?.user.role ?? "guest",
    });
  } catch {
    const response = NextResponse.json({
      authenticated: false,
      role: "guest",
    });

    response.cookies.delete("catering_session");

    return response;
  }
}
