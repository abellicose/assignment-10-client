"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiSecure } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import useUserRole from "@/hooks/useUserRole";
import PageTitle from "@/components/dashboard/PageTitle";
import Loading from "@/components/Loading";

export default function ProfilePage() {
  const { user, updateUserProfile } = useAuth();
  const { profile, role, roleLoading } = useUserRole();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", photo: "" });
  const [saving, setSaving] = useState(false);

  if (roleLoading) return <Loading />;

  const startEdit = () => {
    setForm({ name: profile?.name || user?.displayName || "", photo: profile?.photo || user?.photoURL || "" });
    setEditing(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await apiSecure.patch("/users/profile", form);
      await updateUserProfile(form.name, form.photo);
      toast.success("Profile updated");
      qc.invalidateQueries({ queryKey: ["userRole"] });
      setEditing(false);
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  const field = "mt-1 w-full rounded-lg border border-sand-200 px-3 py-2.5 outline-none focus:border-brand-500";

  return (
    <div className="max-w-2xl">
      <PageTitle title="My Profile" subtitle="Manage your account information." />
      <div className="card-surface p-6">
        <div className="flex items-center gap-4">
          <img
            src={profile?.photo || user?.photoURL || "https://i.ibb.co/5GzXkwq/user.png"}
            alt="avatar"
            className="h-20 w-20 rounded-full border border-sand-200 object-cover"
          />
          <div>
            <h3 className="font-display text-xl font-bold text-brand-800">
              {profile?.name || user?.displayName}
            </h3>
            <p className="text-sm text-ink-700/70">{user?.email}</p>
            <span className="mt-1 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              {role}
            </span>
          </div>
        </div>

        {editing ? (
          <form onSubmit={save} className="mt-6 space-y-4">
            <div>
              <label className="text-sm font-semibold text-ink-700">Name</label>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={field} />
            </div>
            <div>
              <label className="text-sm font-semibold text-ink-700">Photo URL</label>
              <input value={form.photo} onChange={(e) => setForm({ ...form, photo: e.target.value })} className={field} />
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary disabled:opacity-60">
                {saving ? "Saving..." : "Save changes"}
              </button>
              <button type="button" onClick={() => setEditing(false)} className="rounded-lg border border-sand-200 px-4 py-2 font-semibold">
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <button onClick={startEdit} className="btn-primary mt-6">
            Edit Profile
          </button>
        )}
      </div>
    </div>
  );
}
