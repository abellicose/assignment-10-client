"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { FiSearch } from "react-icons/fi";
import { apiPublic } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import SectionHeading from "@/components/SectionHeading";
import Loading from "@/components/Loading";

const types = ["", "Apartment", "House", "Studio", "Villa", "Condo"];

function PropertiesBrowser() {
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [type, setType] = useState(params.get("type") || "");
  const [sort, setSort] = useState("");
  const [page, setPage] = useState(1);
  const min = params.get("min") || "";
  const max = params.get("max") || "";

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["properties", search, type, sort, page, min, max],
    placeholderData: keepPreviousData,
    queryFn: async () => {
      const { data } = await apiPublic.get("/properties", {
        params: { search, type, sort, page, limit: 9, min, max },
      });
      return data;
    },
  });

  const properties = data?.properties || [];
  const totalPages = data?.totalPages || 1;

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <div className="container-app py-12">
      <SectionHeading
        eyebrow="Browse listings"
        title="All Properties"
        subtitle="Search, filter and sort verified rental homes from trusted owners."
      />

      <form
        onSubmit={handleSearch}
        className="card-surface mb-8 grid gap-3 p-4 md:grid-cols-4"
      >
        <div className="relative md:col-span-2">
          <FiSearch className="absolute left-3 top-3.5 text-ink-700/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by location"
            className="w-full rounded-lg border border-sand-200 py-2.5 pl-9 pr-3 outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={type}
          onChange={(e) => { setType(e.target.value); setPage(1); }}
          className="rounded-lg border border-sand-200 px-3 py-2.5 outline-none focus:border-brand-500"
        >
          {types.map((t) => (
            <option key={t} value={t}>{t || "All types"}</option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="rounded-lg border border-sand-200 px-3 py-2.5 outline-none focus:border-brand-500"
        >
          <option value="">Sort by</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </form>

      {isLoading ? (
        <Loading label="Loading properties..." />
      ) : properties.length === 0 ? (
        <div className="card-surface p-12 text-center text-ink-700/60">
          No properties match your search.
        </div>
      ) : (
        <>
          <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${isFetching ? "opacity-60" : ""}`}>
            {properties.map((property) => (
              <PropertyCard key={property._id} property={property} />
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="rounded-lg border border-sand-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={`h-10 w-10 rounded-lg text-sm font-semibold ${
                  page === i + 1
                    ? "bg-brand-600 text-white"
                    : "border border-sand-200 text-ink-700"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-lg border border-sand-200 px-4 py-2 text-sm font-semibold disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PropertiesBrowser />
    </Suspense>
  );
}
