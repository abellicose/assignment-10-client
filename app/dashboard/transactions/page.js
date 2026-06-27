"use client";

import { useQuery } from "@tanstack/react-query";
import { apiSecure } from "@/lib/api";
import RouteGuard from "@/components/RouteGuard";
import PageTitle from "@/components/dashboard/PageTitle";
import Loading from "@/components/Loading";

function Transactions() {
  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => (await apiSecure.get("/payments/transactions")).data,
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageTitle title="Transactions" subtitle="All successful payments on the platform." />
      <div className="card-surface overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sand-200 bg-sand-100 text-ink-700">
            <tr>
              <th className="px-4 py-3">Transaction ID</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Tenant</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t._id} className="border-b border-sand-100">
                <td className="px-4 py-3 font-mono text-xs text-brand-700">{t.transactionId}</td>
                <td className="px-4 py-3">{t.propertyTitle}</td>
                <td className="px-4 py-3 text-xs">{t.tenantName || t.tenantEmail}</td>
                <td className="px-4 py-3 text-xs">{t.ownerEmail}</td>
                <td className="px-4 py-3 font-semibold">${t.amount}</td>
                <td className="px-4 py-3">{new Date(t.date).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TransactionsPage() {
  return (
    <RouteGuard roles={["Admin"]}>
      <Transactions />
    </RouteGuard>
  );
}
