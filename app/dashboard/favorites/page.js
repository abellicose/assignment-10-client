"use client";

import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import { apiSecure } from "@/lib/api";
import RouteGuard from "@/components/RouteGuard";
import PageTitle from "@/components/dashboard/PageTitle";
import Loading from "@/components/Loading";

function Favorites() {
  const qc = useQueryClient();
  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ["myFavorites"],
    queryFn: async () => (await apiSecure.get("/favorites")).data,
  });

  const remove = useMutation({
    mutationFn: async (id) => apiSecure.delete(`/favorites/${id}`),
    onSuccess: () => {
      toast.success("Removed from favorites");
      qc.invalidateQueries({ queryKey: ["myFavorites"] });
    },
  });

  if (isLoading) return <Loading />;

  return (
    <div>
      <PageTitle title="My Favorites" subtitle="Homes you've saved for later." />
      {favorites.length === 0 ? (
        <div className="card-surface p-10 text-center text-ink-700/60">
          No favorites yet.{" "}
          <Link href="/properties" className="font-semibold text-brand-700">Explore properties</Link>
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-sand-200 bg-sand-100 text-ink-700">
              <tr>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3">Rent</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {favorites.map((f) => (
                <tr key={f._id} className="border-b border-sand-100">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {f.propertyImage && (
                        <img src={f.propertyImage} alt="" className="h-10 w-12 rounded object-cover" />
                      )}
                      <Link href={`/properties/${f.propertyId}`} className="font-semibold text-brand-700">
                        {f.propertyTitle}
                      </Link>
                    </div>
                  </td>
                  <td className="px-4 py-3">{f.location}</td>
                  <td className="px-4 py-3">${f.rent}/{f.rentType}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => remove.mutate(f._id)}
                      className="flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      <FiTrash2 /> Remove
                    </button>
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

export default function FavoritesPage() {
  return (
    <RouteGuard roles={["Tenant"]}>
      <Favorites />
    </RouteGuard>
  );
}
