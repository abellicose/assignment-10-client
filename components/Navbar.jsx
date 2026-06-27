"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { useAuth } from "@/context/AuthContext";
import toast from "react-hot-toast";

const links = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "All Properties" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success("Logged out");
    router.push("/");
  };

  const navLink = (href, label) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        onClick={() => setOpen(false)}
        className={`px-1 py-1 text-sm font-semibold transition-colors ${
          active ? "text-brand-700" : "text-ink-700 hover:text-brand-600"
        }`}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 border-b border-sand-200 bg-sand-50/90 backdrop-blur">
      <nav className="container-app flex items-center justify-between py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white font-bold">
            N
          </span>
          <span className="font-display text-xl font-bold text-brand-800">
            Nestify
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {links.map((l) => navLink(l.href, l.label))}
          {user && navLink("/dashboard", "Dashboard")}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              {user.photoURL && (
                <img
                  src={user.photoURL}
                  alt={user.displayName || "user"}
                  className="h-9 w-9 rounded-full border border-sand-200 object-cover"
                />
              )}
              <button onClick={handleLogout} className="btn-primary">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/login" className="text-sm font-semibold text-brand-700">
                Login
              </Link>
              <Link href="/register" className="btn-primary">
                Register
              </Link>
            </div>
          )}
        </div>

        <button
          className="md:hidden text-2xl text-brand-800"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-sand-200 bg-sand-50 md:hidden">
          <div className="container-app flex flex-col gap-3 py-4">
            {links.map((l) => navLink(l.href, l.label))}
            {user && navLink("/dashboard", "Dashboard")}
            {user ? (
              <button onClick={handleLogout} className="btn-primary w-full">
                Logout
              </button>
            ) : (
              <div className="flex gap-2">
                <Link href="/login" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link href="/register" className="btn-accent flex-1" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
