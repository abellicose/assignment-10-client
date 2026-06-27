"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaStar } from "react-icons/fa6";
import toast from "react-hot-toast";
import { apiPublic, apiSecure } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import useUserRole from "@/hooks/useUserRole";

export default function ReviewSection({ propertyId }) {
  const { user } = useAuth();
  const { role } = useUserRole();
  const qc = useQueryClient();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data: reviews = [] } = useQuery({
    queryKey: ["reviews", propertyId],
    queryFn: async () => {
      const { data } = await apiPublic.get(`/reviews/property/${propertyId}`);
      return data;
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      return apiSecure.post("/reviews", {
        propertyId,
        tenantName: user.displayName,
        rating,
        comment,
      });
    },
    onSuccess: () => {
      toast.success("Review submitted");
      setComment("");
      setRating(5);
      qc.invalidateQueries({ queryKey: ["reviews", propertyId] });
    },
    onError: (err) => toast.error(err?.response?.data?.message || "Failed to submit"),
  });

  return (
    <section className="mt-10">
      <h3 className="section-title text-2xl">Reviews</h3>

      {role === "Tenant" && (
        <form
          onSubmit={(e) => { e.preventDefault(); mutation.mutate(); }}
          className="card-surface mt-4 p-5"
        >
          <p className="text-sm font-semibold text-ink-700">Your rating</p>
          <div className="mt-2 flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setRating(i + 1)}
                className="text-2xl"
              >
                <FaStar className={i < rating ? "text-accent-500" : "text-sand-200"} />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            required
            placeholder="Share your experience..."
            className="mt-3 w-full rounded-lg border border-sand-200 px-3 py-2.5 outline-none focus:border-brand-500"
          />
          <button type="submit" disabled={mutation.isPending} className="btn-primary mt-3 disabled:opacity-60">
            {mutation.isPending ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      <div className="mt-6 space-y-4">
        {reviews.length === 0 ? (
          <p className="text-ink-700/60">No reviews yet. Be the first to review.</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="card-surface p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-brand-800">{r.tenantName}</p>
                  <p className="text-xs text-ink-700/60">{r.tenantEmail}</p>
                </div>
                <div className="flex items-center gap-1 text-accent-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar key={i} className={i < r.rating ? "" : "text-sand-200"} />
                  ))}
                </div>
              </div>
              <p className="mt-2 text-sm text-ink-700/80">{r.comment}</p>
              <p className="mt-2 text-xs text-ink-700/50">
                {new Date(r.date).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
