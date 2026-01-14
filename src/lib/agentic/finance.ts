export async function runFinance(input: Record<string, any> = {}) {
  // Simple POC finance agent: produce a short forecast and key KPIs.
  const revenue = Number(input.revenue ?? 100000);
  const growthEstimate = Number(input.growth ?? 0.06);
  const months = Number(input.months ?? 6);

  const monthly = [] as { month: number; revenue: number }[];
  let current = revenue;
  for (let i = 1; i <= months; i++) {
    current = Math.round(current * (1 + growthEstimate));
    monthly.push({ month: i, revenue: current });
  }

  const total = monthly.reduce((s, m) => s + m.revenue, 0);

  return {
    summary: `Estimated ${months}-month revenue: ${total}`,
    forecast: { months, monthly, total, growthEstimate },
    recommendations: [
      "Monitor CAC and LTV monthly",
      "Run a promotional campaign in month 2 to accelerate growth",
    ],
  };
}
