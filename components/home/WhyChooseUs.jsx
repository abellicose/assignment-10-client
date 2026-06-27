"use client";

import { motion } from "motion/react";
import { FiShield, FiZap, FiHeart, FiHeadphones } from "react-icons/fi";
import SectionHeading from "@/components/SectionHeading";

const items = [
  {
    icon: FiShield,
    title: "Verified Listings",
    text: "Every property is reviewed and approved by our admin team before it goes live.",
  },
  {
    icon: FiZap,
    title: "Instant Booking",
    text: "Book your next home in minutes with secure Stripe-powered payments.",
  },
  {
    icon: FiHeart,
    title: "Save Favorites",
    text: "Keep track of the homes you love and compare them anytime from your dashboard.",
  },
  {
    icon: FiHeadphones,
    title: "Owner Support",
    text: "Owners get analytics, booking management and earnings reports in one place.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-sand-100 py-16 md:py-24">
      <div className="container-app">
        <SectionHeading
          center
          eyebrow="Why Nestify"
          title="Built for trust and simplicity"
          subtitle="We bring tenants and owners together on a platform designed around transparency."
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="card-surface p-6"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-100 text-2xl text-brand-600">
                <item.icon />
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-brand-800">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-ink-700/75">{item.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
