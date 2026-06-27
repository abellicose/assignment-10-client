"use client";

import { useQuery } from "@tanstack/react-query";
import { apiSecure } from "@/lib/api";
import RouteGuard from "@/components/RouteGuard";
import PageTitle from "@/components/dashboard/PageTitle";
import Loading from "@/components/Loading";

const badge = {
  Pending: "bg-amber-100 text-amber-700",
  Approved: "bg-emerald-100 text-emerald-700",
  Rejected: "bg-red-100 text-red-700",
  paid: "bg-emerald-100 text-emerald-700",
  unpaid: "bg-amber-100 text-amber-700",
};

function AllBookings() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["adminBookings"],
    queryFn: async () => (await apiSecure.get("/bookings/all")).data,
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageTitle title="All Bookings" subtitle="Monitor booking activity across the platform." />
      <div className="card-surface overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sand-200 bg-sand-100 text-ink-700">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Tenant</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Booking</th>
              <th className="px-4 py-3">Payment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b._id} className="border-b border-sand-100">
                <td className="px-4 py-3 font-semibold text-ink-900">{b.propertyTitle}</td>
                <td className="px-4 py-3 text-xs">{b.tenantEmail}</td>
                <td className="px-4 py-3 text-xs">{b.ownerEmail}</td>
                <td className="px-4 py-3">${b.amount}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge[b.bookingStatus]}`}>
                    {b.bookingStatus}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge[b.paymentStatus]}`}>
                    {b.paymentStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AllBookingsPage() {
  return (
    <RouteGuard roles={["Admin"]}>
      <AllBookings />
    </RouteGuard>
  );
}
