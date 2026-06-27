"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiEdit2, FiTrash2, FiEye, FiX } from "react-icons/fi";
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

function EditModal({ property, onClose, onSaved }) {
  const [form, setForm] = useState({
    title: property.title,
    rent: property.rent,
    location: property.location,
    description: property.description,
  });
  const [saving, setSaving] = useState(false);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiSecure.patch(`/properties/${property._id}`, {
        ...form,
        rent: Number(form.rent),
      });
      toast.success("Property updated");
      onSaved();
      onClose();
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const field = "mt-1 w-full rounded-lg border border-sand-200 px-3 py-2.5 outline-none focus:border-brand-500";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink-900/60 p-4">
      <div className="card-surface w-full max-w-lg p-6">
        <div className="flex items-center justify-between">
          <h3 className="section-title text-xl">Update Property</h3>
          <button onClick={onClose} className="text-2xl text-ink-700/60"><FiX /></button>
        </div>
        <form onSubmit={save} className="mt-4 space-y-4">
          <div>
            <label className="text-sm font-semibold">Title</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className={field} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-semibold">Rent</label>
              <input type="number" value={form.rent} onChange={(e) => setForm({ ...form, rent: e.target.value })} className={field} />
            </div>
            <div>
              <label className="text-sm font-semibold">Location</label>
              <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className={field} />
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className={field} />
          </div>
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </div>
  );
}

function MyProperties() {
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);

  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["myProperties"],
    queryFn: async () => (await apiSecure.get("/properties/mine")).data,
  });

  const del = useMutation({
    mutationFn: async (id) => apiSecure.delete(`/properties/${id}`),
    onSuccess: () => {
      toast.success("Property deleted");
      qc.invalidateQueries({ queryKey: ["myProperties"] });
    },
  });

  const confirmDelete = (id) => {
    Swal.fire({
      title: "Delete property?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e26d3a",
      confirmButtonText: "Yes, delete it",
    }).then((r) => r.isConfirmed && del.mutate(id));
  };

  const viewFeedback = (text) => {
    Swal.fire({
      title: "Rejection Feedback",
      text: text || "No feedback provided.",
      icon: "info",
    });
  };

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageTitle title="My Properties" subtitle="Manage your listed properties." />
      {properties.length === 0 ? (
        <div className="card-surface p-10 text-center text-ink-700/60">
          You haven&apos;t listed any properties yet.
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sand-200 bg-sand-100 text-ink-700">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Rent</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr key={p._id} className="border-b border-sand-100">
                  <td className="px-4 py-3 font-semibold text-ink-900">{p.title}</td>
                  <td className="px-4 py-3">{p.location}</td>
                  <td className="px-4 py-3">${p.rent}/{p.rentType}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${badge[p.status]}`}>
                      {p.status}
                      {p.status === "Rejected" && (
                        <button onClick={() => viewFeedback(p.rejectionFeedback)} title="View feedback">
                          <FiEye />
                        </button>
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setEditing(p)} className="rounded-lg border border-sand-200 p-2 text-brand-700 hover:bg-sand-100">
                        <FiEdit2 />
                      </button>
                      <button onClick={() => confirmDelete(p._id)} className="rounded-lg border border-red-200 p-2 text-red-600 hover:bg-red-50">
                        <FiTrash2 />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <EditModal
          property={editing}
          onClose={() => setEditing(null)}
          onSaved={() => qc.invalidateQueries({ queryKey: ["myProperties"] })}
        />
      )}
    </div>
  );
}

export default function MyPropertiesPage() {
  return (
    <RouteGuard roles={["Owner"]}>
      <MyProperties />
    </RouteGuard>
  );
}
