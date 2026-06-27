import Link from "next/link";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-sand-200 bg-brand-800 text-sand-100">
      <div className="container-app grid gap-8 py-12 md:grid-cols-4">
        <div className="md:col-span-1">
          <div className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-accent-500 text-white font-bold">
              N
            </span>
            <span className="font-display text-xl font-bold text-white">Nestify</span>
          </div>
          <p className="mt-3 text-sm text-sand-200">
            A transparent, secure rental marketplace connecting tenants and
            property owners.
          </p>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Explore</h4>
          <ul className="space-y-2 text-sm text-sand-200">
            <li><Link href="/" className="hover:text-white">Home</Link></li>
            <li><Link href="/properties" className="hover:text-white">All Properties</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">Dashboard</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Support</h4>
          <ul className="space-y-2 text-sm text-sand-200">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Terms of Service</a></li>
            <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-white">Follow Us</h4>
          <div className="flex gap-3">
            {[FaFacebookF, FaXTwitter, FaInstagram, FaLinkedinIn].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="grid h-9 w-9 place-items-center rounded-full bg-brand-700 text-sand-100 transition-colors hover:bg-accent-500 hover:text-white"
              >
                <Icon />
              </a>
            ))}
          </div>
        </div>
      </div>
      <div className="border-t border-brand-700 py-4 text-center text-sm text-sand-200">
        © {new Date().getFullYear()} Nestify. All rights reserved.
      </div>
    </footer>
  );
}
