import { Plus_Jakarta_Sans, Fraunces } from "next/font/google";
import "./globals.css";
import Providers from "@/context/Providers";

const sans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Nestify — Property Rental & Booking Platform",
  description:
    "Discover, book and pay for rental properties. Nestify connects tenants and owners through a transparent, secure rental marketplace.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
