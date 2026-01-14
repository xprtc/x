import { NextResponse } from "next/server";
import { runSales, readSales } from "@/lib/agentic/sales";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const lead = { name: body?.name, email: body?.email, company: body?.company };
    const result = await runSales(lead);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const list = await readSales(50);
    return NextResponse.json({ ok: true, list });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
