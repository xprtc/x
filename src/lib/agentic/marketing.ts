import { prisma } from "@/lib/prisma";
import path from "path";

export type MarketingResult = {
  id: string;
  timestamp: string;
  brief?: string;
  suggestions: { title: string; summary: string }[];
};

const DATA_DIR = path.join(process.cwd(), ".agentic_data");
const MARKETING_FILE = path.join(DATA_DIR, "marketing.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

export async function runMarketing(brief?: string, createdBy?: string): Promise<MarketingResult> {
  const timestamp = new Date().toISOString();
  const id = String(Date.now());

  // Simple deterministic suggestions based on brief hash length
  const seed = (brief || "").length + 3;
  const suggestions = [];
  for (let i = 0; i < 3; i++) {
    suggestions.push({
      title: `Campaign Idea ${i + 1}`,
      summary: `Brief length ${seed}. Suggestion ${i + 1}: Focus on channel ${i === 0 ? "email" : i === 1 ? "paid social" : "content"}.`,
    });
  }

  const result: MarketingResult = { id, timestamp, brief, suggestions };
  return result;
}

export async function readMarketing(limit = 20): Promise<MarketingResult[]> {
  const rows = await prisma.agentRun.findMany({
    where: { agent: "MARKETING" },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((r: any) => ({ id: r.id, timestamp: r.createdAt.toISOString(), brief: r.input?.brief, suggestions: r.output?.suggestions || [] }));
}

export async function persistMarketing(result: MarketingResult, createdBy?: string) {
  await prisma.agentRun.create({
    data: {
      agent: "MARKETING",
      status: "COMPLETED",
      input: { brief: result.brief },
      output: { suggestions: result.suggestions, timestamp: result.timestamp },
      createdBy: createdBy ?? null,
      finishedAt: new Date(),
    },
  });
}
