"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/context/AuthContext";
import { apiSecure } from "@/lib/api";

export default function useUserRole() {
  const { user, loading } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !loading && !!user?.email,
    queryFn: async () => {
      const { data } = await apiSecure.get("/users/me");
      return data;
    },
  });

  return {
    role: data?.role || null,
    profile: data || null,
    roleLoading: loading || isLoading,
  };
}
