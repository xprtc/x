"use client";

import React from "react";

export default function MarketingPage() {
  const [brief, setBrief] = React.useState("");
  const [running, setRunning] = React.useState(false);
  const [last, setLast] = React.useState<any | null>(null);
  const [history, setHistory] = React.useState<any[]>([]);

  async function fetchHistory() {
    try {
      const res = await fetch("/api/agentic/marketing");
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
      const res = await fetch("/api/agentic/marketing", { method: "POST", body: JSON.stringify({ brief }), headers: { "Content-Type": "application/json" } });
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
      <h1 className="text-2xl font-semibold mb-4">Marketing Agent</h1>

      <textarea value={brief} onChange={(e) => setBrief(e.target.value)} placeholder="Paste brief or campaign idea..." className="w-full p-3 border rounded mb-3" />

      <div className="mb-4">
        <button onClick={run} disabled={running} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60">
          {running ? "Running…" : "Generate Campaign Suggestions"}
        </button>
      </div>

      {last && (
        <div className="mb-6 p-4 border rounded">
          <h3 className="font-medium">Last Result — {last.timestamp}</h3>
          <div className="mt-2">
            {last.suggestions?.map((s: any, i: number) => (
              <div key={i} className="mb-2">
                <strong>{s.title}</strong>
                <div className="text-sm text-gray-600">{s.summary}</div>
              </div>
            ))}
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
              <ul className="mt-1 text-sm">
                {(h.suggestions || []).map((s: any, idx: number) => (
                  <li key={idx}>
                    <strong>{s.title}:</strong> {s.summary}
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
