"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiCheck, FiX } from "react-icons/fi";
import Swal from "sweetalert2";
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

function ManageProperties() {
  const qc = useQueryClient();
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["adminProperties"],
    queryFn: async () => (await apiSecure.get("/properties/all")).data,
  });

  const setStatus = useMutation({
    mutationFn: async ({ id, status, rejectionFeedback }) =>
      apiSecure.patch(`/properties/status/${id}`, { status, rejectionFeedback }),
    onSuccess: () => {
      toast.success("Property status updated");
      qc.invalidateQueries({ queryKey: ["adminProperties"] });
    },
    onError: () => toast.error("Update failed"),
  });

  const approve = (id) => setStatus.mutate({ id, status: "Approved", rejectionFeedback: "" });

  const reject = async (id) => {
    const { value: feedback } = await Swal.fire({
      title: "Reject property",
      input: "textarea",
      inputLabel: "Rejection feedback",
      inputPlaceholder: "Explain why this listing is rejected...",
      showCancelButton: true,
      confirmButtonColor: "#e26d3a",
      confirmButtonText: "Reject",
      inputValidator: (v) => !v && "Feedback is required",
    });
    if (feedback) {
      setStatus.mutate({ id, status: "Rejected", rejectionFeedback: feedback });
    }
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageTitle title="All Properties" subtitle="Moderate listings submitted by owners." />
      <div className="card-surface overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sand-200 bg-sand-100 text-ink-700">
            <tr>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Rent</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {properties.map((p) => (
              <tr key={p._id} className="border-b border-sand-100">
                <td className="px-4 py-3 font-semibold text-ink-900">{p.title}</td>
                <td className="px-4 py-3 text-xs text-ink-700/70">{p.ownerEmail}</td>
                <td className="px-4 py-3">${p.rent}/{p.rentType}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge[p.status]}`}>
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => approve(p._id)}
                      disabled={p.status === "Approved"}
                      className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-700 disabled:opacity-40"
                    >
                      <FiCheck /> Approve
                    </button>
                    <button
                      onClick={() => reject(p._id)}
                      disabled={p.status === "Rejected"}
                      className="flex items-center gap-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-40"
                    >
                      <FiX /> Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function ManagePropertiesPage() {
  return (
    <RouteGuard roles={["Admin"]}>
      <ManageProperties />
    </RouteGuard>
  );
}
