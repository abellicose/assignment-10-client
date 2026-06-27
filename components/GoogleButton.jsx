"use client";

import { FcGoogle } from "react-icons/fc";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";

export default function GoogleButton() {
  const { googleLogin, syncUser } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";

  const handleGoogle = async () => {
    try {
      const { user } = await googleLogin();
      await syncUser(user, "Tenant");
      toast.success("Signed in with Google");
      router.push(redirect);
    } catch (err) {
      toast.error(err?.message || "Google sign-in failed");
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogle}
      className="flex w-full items-center justify-center gap-2 rounded-lg border border-sand-200 bg-white py-2.5 font-semibold text-ink-700 transition hover:bg-sand-100"
    >
      <FcGoogle className="text-xl" /> Continue with Google
    </button>
  );
}
