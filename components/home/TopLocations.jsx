"use client";

import Link from "next/link";
import { motion } from "motion/react";
import SectionHeading from "@/components/SectionHeading";

const locations = [
  { name: "New York", count: 128, image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=60" },
  { name: "Los Angeles", count: 94, image: "https://images.unsplash.com/photo-1444723121867-7a241cacace9?auto=format&fit=crop&w=600&q=60" },
  { name: "Chicago", count: 76, image: "https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=600&q=60" },
  { name: "Miami", count: 61, image: "https://images.unsplash.com/photo-1506966953602-c20cc11f75e3?auto=format&fit=crop&w=600&q=60" },
];

export default function TopLocations() {
  return (
    <section className="bg-sand-100 py-16 md:py-24">
      <div className="container-app">
        <SectionHeading
          center
          eyebrow="Explore by city"
          title="Top Locations"
          subtitle="Browse the cities where renters are finding their next home."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {locations.map((loc, i) => (
            <motion.div
              key={loc.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Link
                href={`/properties?search=${encodeURIComponent(loc.name)}`}
                className="group relative block h-56 overflow-hidden rounded-2xl"
              >
                <img
                  src={loc.image}
                  alt={loc.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="font-display text-xl font-semibold">{loc.name}</h3>
                  <p className="text-sm text-sand-100/90">{loc.count} properties</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
