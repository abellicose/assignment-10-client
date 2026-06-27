"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import GoogleButton from "@/components/GoogleButton";

function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ email, password }) => {
    setSubmitting(true);
    try {
      await login(email, password);
      toast.success("Welcome back!");
      router.push(redirect);
    } catch (err) {
      toast.error(err?.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-app flex min-h-[80vh] items-center justify-center py-12">
      <div className="card-surface w-full max-w-md p-8">
        <h1 className="section-title text-3xl">Welcome back</h1>
        <p className="mt-1 text-sm text-ink-700/70">
          Log in to continue your Nestify journey.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-ink-700">Email</label>
            <input
              type="email"
              {...register("email", { required: "Email is required" })}
              className="mt-1 w-full rounded-lg border border-sand-200 px-3 py-2.5 outline-none focus:border-brand-500"
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-700">Password</label>
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
              className="mt-1 w-full rounded-lg border border-sand-200 px-3 py-2.5 outline-none focus:border-brand-500"
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Logging in..." : "Login"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-ink-700/50">
          <span className="h-px flex-1 bg-sand-200" /> OR <span className="h-px flex-1 bg-sand-200" />
        </div>
        <GoogleButton />

        <p className="mt-6 text-center text-sm text-ink-700/70">
          New to Nestify?{" "}
          <Link href="/register" className="font-semibold text-brand-700">
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
