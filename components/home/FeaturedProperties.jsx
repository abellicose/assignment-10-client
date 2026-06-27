"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import Link from "next/link";
import { apiPublic } from "@/lib/api";
import PropertyCard from "@/components/PropertyCard";
import SectionHeading from "@/components/SectionHeading";
import Loading from "@/components/Loading";

export default function FeaturedProperties() {
  const { data: properties = [], isLoading } = useQuery({
    queryKey: ["featured"],
    queryFn: async () => {
      const { data } = await apiPublic.get("/properties/featured");
      return data;
    },
  });

  return (
    <section className="container-app py-16 md:py-24">
      <SectionHeading
        center
        eyebrow="Handpicked"
        title="Featured Properties"
        subtitle="Explore our latest approved listings, curated for comfort and value."
      />

      {isLoading ? (
        <Loading label="Loading properties..." />
      ) : properties.length === 0 ? (
        <p className="text-center text-ink-700/60">No properties available yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {properties.map((property, i) => (
            <motion.div
              key={property._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <PropertyCard property={property} />
            </motion.div>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link href="/properties" className="btn-primary">
          Browse All Properties
        </Link>
      </div>
    </section>
  );
}
