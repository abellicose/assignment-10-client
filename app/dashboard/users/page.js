"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { apiSecure } from "@/lib/api";
import RouteGuard from "@/components/RouteGuard";
import PageTitle from "@/components/dashboard/PageTitle";
import Loading from "@/components/Loading";

const roleBadge = {
  Tenant: "bg-brand-100 text-brand-700",
  Owner: "bg-accent-400/20 text-accent-600",
  Admin: "bg-emerald-100 text-emerald-700",
};

function Users() {
  const qc = useQueryClient();
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["allUsers"],
    queryFn: async () => (await apiSecure.get("/users")).data,
  });

  const changeRole = useMutation({
    mutationFn: async ({ id, role }) => apiSecure.patch(`/users/role/${id}`, { role }),
    onSuccess: () => {
      toast.success("Role updated");
      qc.invalidateQueries({ queryKey: ["allUsers"] });
    },
    onError: () => toast.error("Could not update role"),
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageTitle title="All Users" subtitle="Manage platform users and their roles." />
      <div className="card-surface overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-sand-200 bg-sand-100 text-ink-700">
            <tr>
              <th className="px-4 py-3">User</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Change Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id} className="border-b border-sand-100">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {u.photo && <img src={u.photo} alt="" className="h-9 w-9 rounded-full object-cover" />}
                    <span className="font-semibold text-ink-900">{u.name || "—"}</span>
                  </div>
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${roleBadge[u.role]}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={u.role}
                    onChange={(e) => changeRole.mutate({ id: u._id, role: e.target.value })}
                    className="rounded-lg border border-sand-200 px-2 py-1.5 text-sm outline-none focus:border-brand-500"
                  >
                    <option value="Tenant">Tenant</option>
                    <option value="Owner">Owner</option>
                    <option value="Admin">Admin</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function UsersPage() {
  return (
    <RouteGuard roles={["Admin"]}>
      <Users />
    </RouteGuard>
  );
}
