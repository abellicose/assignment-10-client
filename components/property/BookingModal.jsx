"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiSecure } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

export default function BookingModal({ property, onClose }) {
  const { user } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ moveInDate: "", contact: "", notes: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.moveInDate || !form.contact) {
      return toast.error("Move-in date and contact are required");
    }
    setSubmitting(true);
    try {
      const { data } = await apiSecure.post("/bookings", {
        propertyId: property._id,
        tenantName: user.displayName,
        moveInDate: form.moveInDate,
        contact: form.contact,
        notes: form.notes,
      });
      toast.success("Booking created. Proceed to payment.");
      onClose();
      router.push(`/dashboard/payment/${data._id}`);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Booking failed");
    } finally {
      setSubmitting(false);
    }
  };

  const field = "mt-1 w-full rounded-lg border border-sand-200 px-3 py-2.5 outline-none focus:border-brand-500";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/60 p-4">
      <div className="card-surface w-full max-w-lg p-6">
        <div className="flex items-center justify-between">
          <h3 className="section-title text-xl">Book this property</h3>
          <button onClick={onClose} className="text-2xl text-ink-700/60 hover:text-ink-900">
            <FiX />
          </button>
        </div>
        <p className="mt-1 text-sm text-ink-700/70">{property.title}</p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold text-ink-700">Your name</label>
              <input value={user?.displayName || ""} readOnly className={`${field} bg-sand-100`} />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink-700">Email</label>
              <input value={user?.email || ""} readOnly className={`${field} bg-sand-100`} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-700">Move-in date</label>
            <input
              type="date"
              value={form.moveInDate}
              onChange={(e) => setForm({ ...form, moveInDate: e.target.value })}
              className={field}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-700">Contact number</label>
            <input
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              className={field}
              placeholder="+1 555 000 0000"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-700">Additional notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className={field}
              placeholder="Anything the owner should know?"
            />
          </div>
          <div className="flex items-center justify-between border-t border-sand-200 pt-4">
            <p className="text-lg font-bold text-brand-700">
              ${property.rent}
              <span className="text-xs font-medium text-ink-700/60">/{property.rentType}</span>
            </p>
            <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
              {submitting ? "Processing..." : "Confirm & Pay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
