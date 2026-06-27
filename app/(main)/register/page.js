"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import GoogleButton from "@/components/GoogleButton";

function RegisterForm() {
  const { register: signup, updateUserProfile, syncUser } = useAuth();
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") || "/";
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async ({ name, email, photo, password, role }) => {
    setSubmitting(true);
    try {
      const { user } = await signup(email, password);
      await updateUserProfile(name, photo);
      await syncUser({ email, displayName: name, photoURL: photo }, role);
      toast.success("Account created!");
      router.push(redirect);
    } catch (err) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  const field = "mt-1 w-full rounded-lg border border-sand-200 px-3 py-2.5 outline-none focus:border-brand-500";

  return (
    <div className="container-app flex min-h-[80vh] items-center justify-center py-12">
      <div className="card-surface w-full max-w-md p-8">
        <h1 className="section-title text-3xl">Create your account</h1>
        <p className="mt-1 text-sm text-ink-700/70">
          Join Nestify as a tenant or list properties as an owner.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-semibold text-ink-700">Full name</label>
            <input {...register("name", { required: "Name is required" })} className={field} placeholder="Jane Doe" />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-700">Email</label>
            <input type="email" {...register("email", { required: "Email is required" })} className={field} placeholder="you@example.com" />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-700">Photo URL</label>
            <input {...register("photo")} className={field} placeholder="https://..." />
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-700">Register as</label>
            <select {...register("role")} className={field} defaultValue="Tenant">
              <option value="Tenant">Tenant</option>
              <option value="Owner">Owner</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-ink-700">Password</label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "At least 6 characters" },
              })}
              className={field}
              placeholder="••••••••"
            />
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
          </div>
          <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
            {submitting ? "Creating..." : "Create account"}
          </button>
        </form>

        <div className="my-5 flex items-center gap-3 text-xs text-ink-700/50">
          <span className="h-px flex-1 bg-sand-200" /> OR <span className="h-px flex-1 bg-sand-200" />
        </div>
        <GoogleButton />

        <p className="mt-6 text-center text-sm text-ink-700/70">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-brand-700">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
