"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { FiSearch } from "react-icons/fi";

const types = ["Apartment", "House", "Studio", "Villa", "Condo"];

export default function Banner() {
  const router = useRouter();
  const [form, setForm] = useState({ location: "", type: "", min: "", max: "" });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (form.location) params.set("search", form.location);
    if (form.type) params.set("type", form.type);
    if (form.min) params.set("min", form.min);
    if (form.max) params.set("max", form.max);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="relative overflow-hidden bg-brand-800">
      <img
        src="https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1600&q=70"
        alt="Modern home"
        className="absolute inset-0 h-full w-full object-cover opacity-30"
      />
      <div className="relative container-app py-20 md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <span className="inline-block rounded-full bg-white/15 px-4 py-1 text-sm font-medium text-white">
            Find your next home with confidence
          </span>
          <h1 className="mt-5 font-display text-4xl font-bold leading-tight text-white md:text-6xl">
            Rent smarter. Live better with Nestify.
          </h1>
          <p className="mt-4 max-w-xl text-lg text-sand-100/90">
            Discover verified rental properties, book instantly, and pay securely.
            A transparent marketplace built for tenants and owners alike.
          </p>
        </motion.div>

        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 grid gap-3 rounded-2xl bg-white/95 p-4 shadow-xl backdrop-blur md:grid-cols-5"
        >
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Location"
            className="rounded-lg border border-sand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500 md:col-span-2"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="rounded-lg border border-sand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          >
            <option value="">Property type</option>
            {types.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
          <input
            type="number"
            value={form.min}
            onChange={(e) => setForm({ ...form, min: e.target.value })}
            placeholder="Min $"
            className="rounded-lg border border-sand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          />
          <input
            type="number"
            value={form.max}
            onChange={(e) => setForm({ ...form, max: e.target.value })}
            placeholder="Max $"
            className="rounded-lg border border-sand-200 px-3 py-2.5 text-sm outline-none focus:border-brand-500"
          />
          <button type="submit" className="btn-accent md:col-span-5">
            <FiSearch /> Search Properties
          </button>
        </motion.form>
      </div>
    </section>
  );
}
