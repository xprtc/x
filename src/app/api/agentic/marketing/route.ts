import { NextResponse } from "next/server";
import { runMarketing, readMarketing, persistMarketing } from "@/lib/agentic/marketing";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const brief = body?.brief;
    const result = await runMarketing(brief);
    await persistMarketing(result);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const list = await readMarketing(50);
    return NextResponse.json({ ok: true, list });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
