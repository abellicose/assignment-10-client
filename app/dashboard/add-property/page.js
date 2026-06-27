"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { apiSecure } from "@/lib/api";
import RouteGuard from "@/components/RouteGuard";
import PageTitle from "@/components/dashboard/PageTitle";

const types = ["Apartment", "House", "Studio", "Villa", "Condo"];
const rentTypes = ["Monthly", "Weekly", "Daily"];

function AddProperty() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (values) => {
    setSubmitting(true);
    try {
      const payload = {
        ...values,
        rent: Number(values.rent),
        bedrooms: Number(values.bedrooms),
        bathrooms: Number(values.bathrooms),
        amenities: values.amenities
          ? values.amenities.split(",").map((a) => a.trim()).filter(Boolean)
          : [],
        images: values.images
          ? values.images.split(",").map((i) => i.trim()).filter(Boolean)
          : [],
      };
      await apiSecure.post("/properties", payload);
      toast.success("Property submitted for review");
      reset();
      router.push("/dashboard/my-properties");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to add property");
    } finally {
      setSubmitting(false);
    }
  };

  const field = "mt-1 w-full rounded-lg border border-sand-200 px-3 py-2.5 outline-none focus:border-brand-500";
  const label = "text-sm font-semibold text-ink-700";

  return (
    <div className="max-w-3xl">
      <PageTitle title="Add Property" subtitle="List a new rental. It will be reviewed before going live." />
      <form onSubmit={handleSubmit(onSubmit)} className="card-surface space-y-5 p-6">
        <div>
          <label className={label}>Property Title</label>
          <input {...register("title", { required: "Title is required" })} className={field} />
          {errors.title && <p className="mt-1 text-xs text-red-500">{errors.title.message}</p>}
        </div>
        <div>
          <label className={label}>Description</label>
          <textarea {...register("description", { required: "Description is required" })} rows={4} className={field} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={label}>Location</label>
            <input {...register("location", { required: true })} className={field} />
          </div>
          <div>
            <label className={label}>Property Type</label>
            <select {...register("type", { required: true })} className={field}>
              {types.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Rent (Price)</label>
            <input type="number" {...register("rent", { required: true })} className={field} />
          </div>
          <div>
            <label className={label}>Rent Type</label>
            <select {...register("rentType", { required: true })} className={field}>
              {rentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className={label}>Bedrooms</label>
            <input type="number" {...register("bedrooms", { required: true })} className={field} />
          </div>
          <div>
            <label className={label}>Bathrooms</label>
            <input type="number" {...register("bathrooms", { required: true })} className={field} />
          </div>
          <div>
            <label className={label}>Property Size (sqft)</label>
            <input {...register("size")} className={field} />
          </div>
          <div>
            <label className={label}>Extra Features</label>
            <input {...register("extraFeatures")} className={field} placeholder="e.g. Pet friendly" />
          </div>
        </div>
        <div>
          <label className={label}>Amenities (comma separated)</label>
          <input {...register("amenities")} className={field} placeholder="WiFi, Parking, Pool" />
        </div>
        <div>
          <label className={label}>Image URLs (comma separated)</label>
          <input {...register("images", { required: "At least one image is required" })} className={field} placeholder="https://..., https://..." />
          {errors.images && <p className="mt-1 text-xs text-red-500">{errors.images.message}</p>}
        </div>
        <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-60">
          {submitting ? "Submitting..." : "Submit Property"}
        </button>
      </form>
    </div>
  );
}

export default function AddPropertyPage() {
  return (
    <RouteGuard roles={["Owner"]}>
      <AddProperty />
    </RouteGuard>
  );
}
