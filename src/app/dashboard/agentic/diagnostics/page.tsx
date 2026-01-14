"use client";

import React from "react";

export default function DiagnosticsPage() {
  const [running, setRunning] = React.useState(false);
  const [last, setLast] = React.useState<any | null>(null);
  const [history, setHistory] = React.useState<any[]>([]);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/agentic/diagnostics");
      const data = await res.json();
      if (data?.ok) setHistory(data.list || []);
    } catch (e) {
      // ignore
    }
  }

  React.useEffect(() => {
    fetchHistory();
  }, []);

  async function run() {
    setRunning(true);
    try {
      const res = await fetch("/api/agentic/diagnostics", { method: "POST" });
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
      <h1 className="text-2xl font-semibold mb-4">Diagnostics Agent</h1>

      <div className="mb-4">
        <button
          onClick={run}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          disabled={running}
        >
          {running ? "Running…" : "Run Diagnostics"}
        </button>
      </div>

      {last && (
        <div className="mb-6 p-4 border rounded">
          <h3 className="font-medium">Last Result — {last.timestamp}</h3>
          <ul className="mt-2">
            {(last.checks || []).map((c: any) => (
              <li key={c.name} className="text-sm">
                <strong>{c.name}:</strong> {c.status} {c.message ? `— ${c.message}` : ""}
              </li>
            ))}
            {last.error && <li className="text-sm text-red-600">Error: {String(last.error)}</li>}
          </ul>
        </div>
      )}

      <div>
        <h3 className="font-medium mb-2">History</h3>
        <div className="space-y-3">
          {history.length === 0 && <div className="text-sm text-gray-500">No runs yet.</div>}
          {history.map((h) => (
            <div key={h.id} className="p-3 border rounded">
              <div className="text-sm text-gray-700">{h.timestamp}</div>
              <ul className="mt-1 text-sm">
                {(h.checks || []).map((c: any) => (
                  <li key={c.name}>
                    <strong>{c.name}:</strong> {c.status} {c.message ? `— ${c.message}` : ""}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
