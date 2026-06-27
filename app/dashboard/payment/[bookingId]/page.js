"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Elements } from "@stripe/react-stripe-js";
import { apiSecure } from "@/lib/api";
import { getStripe } from "@/lib/stripe";
import RouteGuard from "@/components/RouteGuard";
import PageTitle from "@/components/dashboard/PageTitle";
import CheckoutForm from "@/components/payment/CheckoutForm";
import Loading from "@/components/Loading";

function Payment() {
  const { bookingId } = useParams();
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: async () => (await apiSecure.get(`/bookings/${bookingId}`)).data,
  });

  if (isLoading) return <Loading />;
  if (!booking) {
    return <p className="text-center text-ink-700/60">Booking not found.</p>;
  }

  if (booking.paymentStatus === "paid") {
    return (
      <div className="max-w-lg">
        <PageTitle title="Payment" />
        <div className="card-surface p-8 text-center">
          <p className="text-lg font-semibold text-emerald-600">
            This booking is already paid.
          </p>
          <p className="mt-1 text-sm text-ink-700/60">
            Transaction: {booking.transactionId}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <PageTitle title="Complete Payment" subtitle="Secure payment powered by Stripe." />
      <div className="card-surface p-6">
        <div className="mb-5 flex items-center justify-between border-b border-sand-200 pb-4">
          <div>
            <p className="font-semibold text-ink-900">{booking.propertyTitle}</p>
            <p className="text-sm text-ink-700/60">Move-in: {booking.moveInDate}</p>
          </div>
          <p className="text-2xl font-bold text-brand-700">${booking.amount}</p>
        </div>
        <Elements stripe={getStripe()}>
          <CheckoutForm booking={booking} />
        </Elements>
      </div>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <RouteGuard roles={["Tenant"]}>
      <Payment />
    </RouteGuard>
  );
}
