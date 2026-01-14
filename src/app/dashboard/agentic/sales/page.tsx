"use client";

import React from "react";

export default function SalesPage() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [running, setRunning] = React.useState(false);
  const [last, setLast] = React.useState<any | null>(null);
  const [history, setHistory] = React.useState<any[]>([]);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/agentic/sales");
      const data = await res.json();
      if (data?.ok) setHistory(data.list || []);
    } catch (e) {}
  }

  React.useEffect(() => {
    fetchHistory();
  }, []);

  async function run() {
    setRunning(true);
    try {
      const res = await fetch("/api/agentic/sales", { method: "POST", body: JSON.stringify({ name, email, company }), headers: { "Content-Type": "application/json" } });
      const data = await res.json();
      if (data?.ok) {
        setLast(data.result);
        await fetchHistory();
      } else {
        setLast({ error: data?.error ?? "unknown" });
      }
    } catch (e) {
      setLast({ error: String(e) });
    } finally {
      setRunning(false);
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Sales Agent</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Lead name" className="p-2 border rounded" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-2 border rounded" />
        <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company" className="p-2 border rounded" />
      </div>

      <div className="mb-4">
        <button onClick={run} disabled={running} className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-60">
          {running ? "Running…" : "Score Lead"}
        </button>
      </div>

      {last && (
        <div className="mb-6 p-4 border rounded">
          <h3 className="font-medium">Last Result — {last.timestamp}</h3>
          <div className="mt-2">
            <div>Score: <strong>{last.score}</strong></div>
            <ul className="mt-2 text-sm">
              {(last.notes || []).map((n: string, i: number) => <li key={i}>{n}</li>)}
            </ul>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-medium mb-2">History</h3>
        <div className="space-y-3">
          {history.length === 0 && <div className="text-sm text-gray-500">No runs yet.</div>}
          {history.map((h) => (
            <div key={h.id} className="p-3 border rounded">
              <div className="text-sm text-gray-700">{h.timestamp}</div>
              <div>Score: <strong>{h.score}</strong></div>
              <ul className="mt-1 text-sm">
                {(h.notes || []).map((n: string, idx: number) => <li key={idx}>{n}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
