"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { FaHouseChimney, FaUsers, FaCalendarCheck, FaUserShield } from "react-icons/fa6";
import { apiPublic } from "@/lib/api";

const config = [
  { key: "totalProperties", label: "Listed Properties", icon: FaHouseChimney },
  { key: "totalUsers", label: "Happy Users", icon: FaUsers },
  { key: "totalBookings", label: "Successful Bookings", icon: FaCalendarCheck },
  { key: "totalOwners", label: "Trusted Owners", icon: FaUserShield },
];

export default function RentalStats() {
  const { data = {} } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data } = await apiPublic.get("/properties/stats");
      return data;
    },
  });

  return (
    <section className="bg-brand-700 py-16 md:py-20">
      <div className="container-app grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {config.map((c, i) => (
          <motion.div
            key={c.key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="text-center text-white"
          >
            <c.icon className="mx-auto text-3xl text-accent-400" />
            <p className="mt-3 font-display text-4xl font-bold">
              {data[c.key] ?? 0}+
            </p>
            <p className="mt-1 text-sm text-sand-100/80">{c.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
