"use client";

import { AdminUser, isAuthenticated, setToken, setUser } from "@/lib/auth";
import { useApi } from "@/lib/auth-api";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState, useEffect } from "react";
import { MdOutlinePets, MdLockOutline, MdMailOutline } from "react-icons/md";

type LoginResponse = {
  message: string;
  data: { token: string; user: AdminUser };
};

function LoginForm() {
  const api = useApi();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated()) {
      router.replace(next.startsWith("/") ? next : "/admin");
    }
  }, [router, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post<LoginResponse>("/api/auth/login", {
        email: email.trim(),
        password,
      });
      setToken(data.data.token);
      setUser(data.data.user);
      router.replace(next.startsWith("/") ? next : "/admin");
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message || "Invalid email or password.";
      setError(Array.isArray(message) ? message.join(", ") : message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-clay text-white">
            <MdOutlinePets className="h-8 w-8" />
          </div>
          <h1 className="font-display text-3xl font-bold text-ink">
            Northstar Lending
          </h1>
          <p className="mt-1 text-sm text-ink-soft">
            Sign in to manage applications
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-sand-dark/40 bg-white p-8 shadow-sm"
        >
          {error && (
            <div className="mb-5 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          )}

          <label className="mb-4 block">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Email
            </span>
            <div className="relative">
              <MdMailOutline className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-lg border border-sand-dark/60 bg-cream/40 py-3 pl-10 pr-4 text-ink outline-none transition focus:border-clay focus:bg-white"
              />
            </div>
          </label>

          <label className="mb-6 block">
            <span className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </span>
            <div className="relative">
              <MdLockOutline className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-soft" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-sand-dark/60 bg-cream/40 py-3 pl-10 pr-4 text-ink outline-none transition focus:border-clay focus:bg-white"
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg transition hover:bg-clay-dark disabled:cursor-not-allowed disabled:opacity-70 btn-primary"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-soft">
          Authorized administrators only.
        </p>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cream" />}>
      <LoginForm />
    </Suspense>
  );
}
