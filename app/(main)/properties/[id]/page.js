"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { FiMapPin, FiHeart, FiCheck } from "react-icons/fi";
import { FaBed, FaBath, FaRulerCombined } from "react-icons/fa6";
import toast from "react-hot-toast";
import { apiPublic, apiSecure } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import useUserRole from "@/hooks/useUserRole";
import RouteGuard from "@/components/RouteGuard";
import Loading from "@/components/Loading";
import BookingModal from "@/components/property/BookingModal";
import ReviewSection from "@/components/property/ReviewSection";

const placeholder =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1000&q=70";

function Details() {
  const { id } = useParams();
  const { user } = useAuth();
  const { role } = useUserRole();
  const [showModal, setShowModal] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const { data: property, isLoading } = useQuery({
    queryKey: ["property", id],
    queryFn: async () => {
      const { data } = await apiPublic.get(`/properties/${id}`);
      return data;
    },
  });

  const addFavorite = async () => {
    try {
      await apiSecure.post("/favorites", { propertyId: id });
      toast.success("Added to favorites");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Could not add favorite");
    }
  };

  if (isLoading) return <Loading />;
  if (!property) {
    return (
      <div className="container-app py-20 text-center">
        <h2 className="section-title text-2xl">Property not found</h2>
      </div>
    );
  }

  const images = property.images?.length ? property.images : [placeholder];

  return (
    <div className="container-app py-12">
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="overflow-hidden rounded-2xl">
            <img src={images[activeImg]} alt={property.title} className="h-[420px] w-full object-cover" />
          </div>
          {images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`h-20 w-24 overflow-hidden rounded-lg border-2 ${
                    activeImg === i ? "border-brand-500" : "border-transparent"
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <h1 className="mt-6 section-title text-3xl">{property.title}</h1>
          <p className="mt-2 flex items-center gap-1 text-ink-700/70">
            <FiMapPin className="text-accent-500" /> {property.location}
          </p>

          <div className="mt-5 grid grid-cols-3 gap-4">
            <div className="card-surface p-4 text-center">
              <FaBed className="mx-auto text-xl text-brand-500" />
              <p className="mt-1 text-sm font-semibold">{property.bedrooms} Bedrooms</p>
            </div>
            <div className="card-surface p-4 text-center">
              <FaBath className="mx-auto text-xl text-brand-500" />
              <p className="mt-1 text-sm font-semibold">{property.bathrooms} Bathrooms</p>
            </div>
            <div className="card-surface p-4 text-center">
              <FaRulerCombined className="mx-auto text-xl text-brand-500" />
              <p className="mt-1 text-sm font-semibold">{property.size || "—"} sqft</p>
            </div>
          </div>

          <h3 className="mt-8 section-title text-xl">Description</h3>
          <p className="mt-2 leading-relaxed text-ink-700/80">{property.description}</p>

          {property.amenities?.length > 0 && (
            <>
              <h3 className="mt-6 section-title text-xl">Amenities</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {property.amenities.map((a) => (
                  <span key={a} className="flex items-center gap-1 rounded-full bg-brand-50 px-3 py-1 text-sm text-brand-700">
                    <FiCheck /> {a}
                  </span>
                ))}
              </div>
            </>
          )}

          <ReviewSection propertyId={id} />
        </div>

        <aside className="lg:col-span-1">
          <div className="card-surface sticky top-24 p-6">
            <p className="text-3xl font-bold text-brand-700">
              ${property.rent}
              <span className="text-sm font-medium text-ink-700/60">/{property.rentType}</span>
            </p>
            <span className="mt-2 inline-block rounded-full bg-brand-100 px-3 py-1 text-xs font-semibold text-brand-700">
              {property.type}
            </span>

            <div className="mt-5 space-y-3">
              {role === "Tenant" ? (
                <>
                  <button onClick={() => setShowModal(true)} className="btn-primary w-full">
                    Book Property
                  </button>
                  <button onClick={addFavorite} className="flex w-full items-center justify-center gap-2 rounded-lg border border-sand-200 py-2.5 font-semibold text-brand-700 hover:bg-sand-100">
                    <FiHeart /> Add to Favorites
                  </button>
                </>
              ) : (
                <p className="rounded-lg bg-sand-100 p-3 text-center text-sm text-ink-700/70">
                  {role ? "Only tenants can book properties." : "Sign in as a tenant to book."}
                </p>
              )}
            </div>

            <div className="mt-6 border-t border-sand-200 pt-4 text-sm text-ink-700/70">
              <p className="font-semibold text-ink-700">Listed by</p>
              <p>{property.ownerEmail}</p>
            </div>
          </div>
        </aside>
      </div>

      {showModal && <BookingModal property={property} onClose={() => setShowModal(false)} />}
    </div>
  );
}

export default function PropertyDetailsPage() {
  return (
    <RouteGuard>
      <Details />
    </RouteGuard>
  );
}
