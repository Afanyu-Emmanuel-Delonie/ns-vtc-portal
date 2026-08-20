"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/invalid-email": "Enter a valid email address.",
  "auth/user-not-found": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/too-many-requests": "Too many attempts. Try again in a few minutes.",
  "auth/user-disabled": "This account has been disabled.",
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-navy px-4">

      {/* Decorative background shapes */}
      <svg className="pointer-events-none absolute inset-0 h-full w-full" aria-hidden>
        {/* Large circles */}
        <circle cx="8%" cy="12%" r="220" fill="rgba(255,255,255,0.04)" />
        <circle cx="92%" cy="88%" r="280" fill="rgba(255,255,255,0.04)" />
        <circle cx="85%" cy="10%" r="140" fill="rgba(255,255,255,0.03)" />
        <circle cx="15%" cy="90%" r="160" fill="rgba(255,255,255,0.03)" />
        {/* Ring outlines */}
        <circle cx="50%" cy="50%" r="380" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <circle cx="50%" cy="50%" r="480" fill="none" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />
        {/* Diagonal lines */}
        <line x1="0" y1="0" x2="100%" y2="100%" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
        <line x1="100%" y1="0" x2="0" y2="100%" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
        {/* Dot grid */}
        {Array.from({ length: 8 }).map((_, row) =>
          Array.from({ length: 12 }).map((_, col) => (
            <circle
              key={`${row}-${col}`}
              cx={`${4 + col * 8.5}%`}
              cy={`${6 + row * 13}%`}
              r="1.5"
              fill="rgba(255,255,255,0.1)"
            />
          ))
        )}
      </svg>

      {/* Card */}
      <div className="relative z-10 w-full max-w-sm rounded-3xl bg-white p-8 shadow-[0_32px_80px_rgba(0,0,0,0.28)]">
        {/* Brand */}
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-navy shadow-[0_8px_24px_rgba(0,50,98,0.35)]">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate">NS VTC · Staff portal</p>
          <h1 className="mt-1.5 text-2xl font-semibold tracking-tight text-ink">Welcome back</h1>
          <p className="mt-1 text-sm text-slate">Sign in to access your dashboard.</p>
        </div>

        <form
          className="grid gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError(null);

            if (!auth) {
              setError("Firebase isn't configured. Check your environment variables.");
              return;
            }

            setSubmitting(true);
            try {
              await signInWithEmailAndPassword(auth, email, password);
              document.cookie = "ns_vtc_auth=1; path=/";
              router.push("/");
            } catch (err) {
              const code = err instanceof Error && "code" in err ? String((err as { code: string }).code) : "";
              setError(AUTH_ERROR_MESSAGES[code] ?? "Something went wrong. Please try again.");
            } finally {
              setSubmitting(false);
            }
          }}
        >
          <div className="grid gap-1.5">
            <label className="text-sm font-medium text-ink">Email</label>
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="recruiter@nsvtc.co.za"
            />
          </div>
          <div className="grid gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-ink">Password</label>
              <span className="cursor-pointer text-xs text-slate transition-colors hover:text-navy">
                Forgot password?
              </span>
            </div>
            <Input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error && (
            <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <Button type="submit" disabled={submitting} className="mt-1 w-full py-3">
            {submitting ? "Signing in…" : "Enter dashboard"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-slate">
          © {new Date().getFullYear()} NS VTC · All rights reserved
        </p>
      </div>
    </div>
  );
}
