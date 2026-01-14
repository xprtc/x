import Link from "next/link";

export const metadata = {
  title: "Agentic — Dashboard",
};

export default function AgenticDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Agentic Dashboard</h1>
      <p className="text-gray-600 mb-6">Overview and quick links to department agents.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/dashboard/agentic/diagnostics/" className="block p-4 border rounded hover:shadow">
          <h3 className="font-medium">Diagnostics Agent</h3>
          <p className="text-sm text-gray-500">Health checks, system diagnostics and alerts.</p>
        </Link>

        <Link href="/dashboard/agentic/marketing/" className="block p-4 border rounded hover:shadow">
          <h3 className="font-medium">Marketing Agent</h3>
          <p className="text-sm text-gray-500">Campaign suggestions, scheduling and briefs.</p>
        </Link>

        <Link href="/dashboard/agentic/sales/" className="block p-4 border rounded hover:shadow">
          <h3 className="font-medium">Sales Agent</h3>
          <p className="text-sm text-gray-500">Lead qualification, routing and deal assistance.</p>
        </Link>

        <Link href="/dashboard/agentic/finance/" className="block p-4 border rounded hover:shadow">
          <h3 className="font-medium">Finance Agent</h3>
          <p className="text-sm text-gray-500">Invoice analysis, coding and AP suggestions.</p>
        </Link>

        <Link href="/dashboard/agentic/support/" className="block p-4 border rounded hover:shadow">
          <h3 className="font-medium">Support Agent</h3>
          <p className="text-sm text-gray-500">Ticket triage, KB suggestions and response templates.</p>
        </Link>
      </div>
    </div>
  );
}
