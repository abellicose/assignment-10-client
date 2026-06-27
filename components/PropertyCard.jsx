import Link from "next/link";
import { FiMapPin } from "react-icons/fi";
import { FaBed, FaBath } from "react-icons/fa6";

const placeholder =
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=60";

export default function PropertyCard({ property }) {
  const { _id, title, location, rent, rentType, type, bedrooms, bathrooms, images } =
    property;

  return (
    <article className="card-surface group flex h-full flex-col overflow-hidden">
      <div className="relative h-52 overflow-hidden">
        <img
          src={images?.[0] || placeholder}
          alt={title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-brand-700">
          {type}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold text-brand-800 line-clamp-1">
          {title}
        </h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-ink-700/70">
          <FiMapPin className="text-accent-500" /> {location}
        </p>
        <div className="mt-3 flex items-center gap-4 text-sm text-ink-700/80">
          <span className="flex items-center gap-1">
            <FaBed className="text-brand-500" /> {bedrooms} Beds
          </span>
          <span className="flex items-center gap-1">
            <FaBath className="text-brand-500" /> {bathrooms} Baths
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-sand-200 pt-4">
          <p className="text-lg font-bold text-brand-700">
            ${rent}
            <span className="text-xs font-medium text-ink-700/60">/{rentType}</span>
          </p>
          <Link href={`/properties/${_id}`} className="btn-primary px-4 py-2 text-sm">
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
