import { prisma } from "@/lib/prisma";

export type SalesResult = {
  id: string;
  timestamp: string;
  lead?: { name?: string; email?: string; company?: string };
  score: number;
  notes: string[];
};

export async function runSales(lead?: { name?: string; email?: string; company?: string }, createdBy?: string): Promise<SalesResult> {
  const id = String(Date.now());
  const timestamp = new Date().toISOString();

  // Naive scoring: presence of email + company increases score
  let score = 50;
  const notes: string[] = [];
  if (lead?.email) {
    score += 25;
    notes.push("Email provided");
  } else {
    notes.push("No email provided");
  }
  if (lead?.company) {
    score += 15;
    notes.push("Company provided");
  }
  if (lead?.name) notes.push(`Name: ${lead.name}`);

  if (score >= 80) notes.push("Recommend: Route to AE (high priority)");
  else if (score >= 60) notes.push("Recommend: SDR outreach (medium priority)");
  else notes.push("Recommend: Nurture sequence (low priority)");

  const result: SalesResult = { id, timestamp, lead, score, notes };

  // persist via prisma
  await prisma.agentRun.create({
    data: {
      agent: "SALES",
      status: "COMPLETED",
      input: { lead },
      output: { score, notes, timestamp },
      createdBy: createdBy ?? null,
      finishedAt: new Date(),
    },
  });

  return result;
}

export async function readSales(limit = 20) {
  const rows = await prisma.agentRun.findMany({
    where: { agent: "SALES" },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((r: any) => ({ id: r.id, timestamp: r.createdAt.toISOString(), lead: r.input?.lead, score: r.output?.score, notes: r.output?.notes || [] }));
}
