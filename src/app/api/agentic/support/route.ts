import { NextResponse } from "next/server";
import { runSupport } from "@/lib/agentic/support";
import { createRun, runOrEnqueue, getHistory } from "@/lib/agentic";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) || {};
    const run = await createRun("SUPPORT", body);
    const result = await runOrEnqueue(run, async (input) => runSupport(input));
    return NextResponse.json({ ok: true, run, result });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function GET() {
  try {
    const list = await getHistory("SUPPORT", 50);
    return NextResponse.json({ ok: true, list });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
