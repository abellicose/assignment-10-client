"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiHome, FiGrid, FiHeart, FiUser, FiPlusSquare, FiList,
  FiInbox, FiUsers, FiBox, FiCreditCard, FiBarChart2,
} from "react-icons/fi";

const menus = {
  Tenant: [
    { href: "/dashboard", label: "Overview", icon: FiHome },
    { href: "/dashboard/bookings", label: "My Bookings", icon: FiGrid },
    { href: "/dashboard/favorites", label: "Favorites", icon: FiHeart },
    { href: "/dashboard/profile", label: "Profile", icon: FiUser },
  ],
  Owner: [
    { href: "/dashboard", label: "Analytics", icon: FiBarChart2 },
    { href: "/dashboard/add-property", label: "Add Property", icon: FiPlusSquare },
    { href: "/dashboard/my-properties", label: "My Properties", icon: FiList },
    { href: "/dashboard/requests", label: "Booking Requests", icon: FiInbox },
    { href: "/dashboard/profile", label: "Profile", icon: FiUser },
  ],
  Admin: [
    { href: "/dashboard", label: "Overview", icon: FiHome },
    { href: "/dashboard/users", label: "All Users", icon: FiUsers },
    { href: "/dashboard/manage-properties", label: "All Properties", icon: FiBox },
    { href: "/dashboard/all-bookings", label: "All Bookings", icon: FiGrid },
    { href: "/dashboard/transactions", label: "Transactions", icon: FiCreditCard },
    { href: "/dashboard/profile", label: "Profile", icon: FiUser },
  ],
};

export default function Sidebar({ role }) {
  const pathname = usePathname();
  const items = menus[role] || [];

  return (
    <aside className="w-full shrink-0 border-r border-sand-200 bg-white md:w-64">
      <div className="p-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white font-bold">N</span>
          <span className="font-display text-lg font-bold text-brand-800">Nestify</span>
        </Link>
        <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-accent-500">
          {role} Dashboard
        </p>
      </div>
      <nav className="flex flex-col gap-1 px-3 pb-6">
        {items.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-brand-600 text-white"
                  : "text-ink-700 hover:bg-sand-100"
              }`}
            >
              <item.icon className="text-lg" /> {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
