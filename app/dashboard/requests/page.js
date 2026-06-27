"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiCheck, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiSecure } from "@/lib/api";
import RouteGuard from "@/components/RouteGuard";
import PageTitle from "@/components/dashboard/PageTitle";
import Loading from "@/components/Loading";

const badge = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
};

function Requests() {
  const qc = useQueryClient();
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["bookingRequests"],
    queryFn: async () => (await apiSecure.get("/bookings/requests")).data,
  });

  const update = useMutation({
    mutationFn: async ({ id, status }) =>
      apiSecure.patch(`/bookings/status/${id}`, { status }),
    onSuccess: () => {
      toast.success("Booking updated");
      qc.invalidateQueries({ queryKey: ["bookingRequests"] });
    },
    onError: () => toast.error("Update failed"),
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageTitle title="Booking Requests" subtitle="Review and respond to paid booking requests." />
      {requests.length === 0 ? (
        <div className="card-surface p-10 text-center text-ink-700/60">
          No booking requests yet.
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sand-200 bg-sand-100 text-ink-700">
              <tr>
                <th className="px-4 py-3">Tenant</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Move-in</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id} className="border-b border-sand-100">
                  <td className="px-4 py-3">
                    <p className="font-semibold text-ink-900">{r.tenantName}</p>
                    <p className="text-xs text-ink-700/60">{r.tenantEmail}</p>
                    <p className="text-xs text-ink-700/60">{r.contact}</p>
                  </td>
                  <td className="px-4 py-3">{r.propertyTitle}</td>
                  <td className="px-4 py-3">{r.moveInDate}</td>
                  <td className="px-4 py-3">${r.amount}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge[r.bookingStatus]}`}>
                      {r.bookingStatus}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {r.bookingStatus === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() => update.mutate({ id: r._id, status: "Approved" })}
                          className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700"
                        >
                          <FiCheck /> Approve
                        </button>
                        <button
                          onClick={() => update.mutate({ id: r._id, status: "Rejected" })}
                          className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                        >
                          <FiX /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-ink-700/50">Responded</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default function RequestsPage() {
  return (
    <RouteGuard roles={["Owner"]}>
      <Requests />
    </RouteGuard>
  );
}
