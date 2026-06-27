"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
import { FaStar, FaQuoteLeft } from "react-icons/fa6";
import { apiPublic } from "@/lib/api";
import SectionHeading from "@/components/SectionHeading";

const fallback = [
  { _id: "f1", tenantName: "Amelia Carter", rating: 5, comment: "Booking my apartment through Nestify was seamless. The whole process took minutes.", date: new Date() },
  { _id: "f2", tenantName: "Daniel Osei", rating: 5, comment: "Loved how transparent everything was. No hidden fees, verified owners, secure payment.", date: new Date() },
  { _id: "f3", tenantName: "Priya Nair", rating: 4, comment: "Great selection of homes and the favorites feature helped me compare easily.", date: new Date() },
  { _id: "f4", tenantName: "Marco Rossi", rating: 5, comment: "As an owner the analytics dashboard is fantastic. I can track earnings at a glance.", date: new Date() },
];

export default function CustomerReviews() {
  const { data } = useQuery({
    queryKey: ["reviews"],
    queryFn: async () => {
      const { data } = await apiPublic.get("/reviews");
      return data;
    },
  });

  const reviews = data && data.length ? data : fallback;

  return (
    <section className="container-app py-16 md:py-24">
      <SectionHeading
        center
        eyebrow="Loved by tenants"
        title="What our customers say"
        subtitle="Real feedback from people who found their home through Nestify."
      />
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.slice(0, 4).map((r, i) => (
          <motion.div
            key={r._id}
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="card-surface flex flex-col p-6"
          >
            <FaQuoteLeft className="text-2xl text-brand-200" />
            <p className="mt-3 flex-1 text-sm text-ink-700/80">{r.comment}</p>
            <div className="mt-4 flex items-center gap-1 text-accent-500">
              {Array.from({ length: 5 }).map((_, idx) => (
                <FaStar key={idx} className={idx < r.rating ? "" : "text-sand-200"} />
              ))}
            </div>
            <p className="mt-3 font-semibold text-brand-800">{r.tenantName}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
