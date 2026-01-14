import { prisma } from "@/lib/prisma";
import path from "path";

export type DiagnosticCheck = {
  name: string;
  status: "ok" | "warning" | "error";
  message?: string;
};

export type DiagnosticResult = {
  id: string;
  timestamp: string;
  checks: DiagnosticCheck[];
};

const DATA_DIR = path.join(process.cwd(), ".agentic_data");
const DIAG_FILE = path.join(DATA_DIR, "diagnostics.json");

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {
    // ignore
  }
}

export async function runDiagnostics(createdBy?: string): Promise<DiagnosticResult> {
  const checks: DiagnosticCheck[] = [];

  // Node runtime
  try {
    checks.push({ name: "Node", status: "ok", message: process.version });
  } catch (e) {
    checks.push({ name: "Node", status: "warning", message: String(e) });
  }

  // Database URL
  if (process.env.DATABASE_URL) {
    checks.push({ name: "Database", status: "ok", message: "DATABASE_URL is set" });
  } else {
    checks.push({ name: "Database", status: "warning", message: "DATABASE_URL is not set" });
  }

  // Prisma client presence
  try {
    const pkgPath = path.join(process.cwd(), "node_modules", "@prisma", "client", "package.json");
    await fs.access(pkgPath);
    checks.push({ name: "Prisma Client", status: "ok", message: "@prisma/client is installed" });
  } catch (e) {
    checks.push({ name: "Prisma Client", status: "warning", message: "@prisma/client not found" });
  }

  // Simple disk space / writable check: create temp file
  try {
    const tmpFile = path.join(DATA_DIR, ".writable");
    await ensureDataDir();
    await fs.writeFile(tmpFile, String(Date.now()));
    checks.push({ name: "Storage", status: "ok", message: "Data dir writable" });
  } catch (e) {
    checks.push({ name: "Storage", status: "error", message: "Data dir not writable" });
  }

  const result: DiagnosticResult = {
    id: String(Date.now()),
    timestamp: new Date().toISOString(),
    checks,
  };
  return result;
}

export async function readDiagnostics(limit = 20): Promise<DiagnosticResult[]> {
  const rows = await prisma.agentRun.findMany({
    where: { agent: "DIAGNOSTICS" },
    orderBy: { createdAt: "desc" },
    take: limit,
  });
  return rows.map((r: any) => ({ id: r.id, timestamp: r.createdAt.toISOString(), checks: r.output?.checks || [] }));
}

// persist run via prisma
export async function persistDiagnostics(result: DiagnosticResult, createdBy?: string) {
  await prisma.agentRun.create({
    data: {
      agent: "DIAGNOSTICS",
      status: "COMPLETED",
      input: {},
      output: { checks: result.checks, timestamp: result.timestamp },
      createdBy: createdBy ?? null,
      finishedAt: new Date(),
    },
  });
}
