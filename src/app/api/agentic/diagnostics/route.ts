import { NextResponse } from "next/server";
import { runDiagnostics, readDiagnostics, persistDiagnostics } from "@/lib/agentic/diagnostics";

export async function POST() {
  try {
    const result = await runDiagnostics();
    await persistDiagnostics(result);
    return NextResponse.json({ ok: true, result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const list = await readDiagnostics(50);
    return NextResponse.json({ ok: true, list });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
