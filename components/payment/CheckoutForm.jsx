"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { apiSecure } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

const cardStyle = {
  style: {
    base: {
      fontSize: "16px",
      color: "#161616",
      "::placeholder": { color: "#9ca3af" },
    },
    invalid: { color: "#dc2626" },
  },
};

export default function CheckoutForm({ booking }) {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useAuth();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setError("");

    try {
      const { data } = await apiSecure.post("/payments/create-intent", {
        amount: booking.amount,
      });

      const card = elements.getElement(CardElement);
      const { paymentIntent, error: stripeError } = await stripe.confirmCardPayment(
        data.clientSecret,
        {
          payment_method: {
            card,
            billing_details: {
              name: user?.displayName || "",
              email: user?.email || "",
            },
          },
        }
      );

      if (stripeError) {
        setError(stripeError.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === "succeeded") {
        await apiSecure.post("/payments/confirm", {
          bookingId: booking._id,
          transactionId: paymentIntent.id,
        });
        toast.success("Payment successful!");
        router.push(`/dashboard/payment/success?tx=${paymentIntent.id}`);
      }
    } catch (err) {
      setError(err?.response?.data?.message || "Payment failed");
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="rounded-lg border border-sand-200 p-4">
        <CardElement options={cardStyle} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="btn-primary w-full disabled:opacity-60"
      >
        {processing ? "Processing..." : `Pay $${booking.amount}`}
      </button>
      <p className="text-center text-xs text-ink-700/50">
        Test card: 4242 4242 4242 4242 · any future date · any CVC
      </p>
    </form>
  );
}
