"use client";

import Link from "next/link";
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

function Bookings() {
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["myBookings"],
    queryFn: async () => (await apiSecure.get("/bookings/mine")).data,
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageTitle title="My Bookings" subtitle="Track the status of your reservations." />
      {bookings.length === 0 ? (
        <div className="card-surface p-10 text-center text-ink-700/60">
          You have no bookings yet.{" "}
          <Link href="/properties" className="font-semibold text-brand-700">Browse properties</Link>
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sand-200 bg-sand-100 text-ink-700">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Booking Date</th>
                <th className="px-4 py-3">Amount</th>
                <th className="px-4 py-3">Booking Status</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="border-b border-sand-100">
                  <td className="px-4 py-3 font-semibold text-ink-900">{b.propertyTitle}</td>
                  <td className="px-4 py-3">{new Date(b.createdAt).toLocaleDateString()}</td>
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
                  <td className="px-4 py-3">
                    {b.paymentStatus === "unpaid" ? (
                      <Link href={`/dashboard/payment/${b._id}`} className="btn-primary px-3 py-1.5 text-xs">
                        Pay Now
                      </Link>
                    ) : (
                      <span className="text-xs text-ink-700/50">Paid</span>
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

export default function BookingsPage() {
  return (
    <RouteGuard roles={["Tenant"]}>
      <Bookings />
    </RouteGuard>
  );
}
