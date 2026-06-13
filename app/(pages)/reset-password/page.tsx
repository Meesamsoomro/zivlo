"use client";
import Logo from "@/components/Logo";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, ShieldCheck } from "lucide-react";
import Link from "next/link";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const navy = "#0D1529";
  const gold = "#C8A84B";

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !password) return;

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        setError(data.error || "Failed to reset password. The link may have expired.");
      }
    } catch (err) {
      console.error("Reset password error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} />
        </div>
        <h1
          className="text-2xl md:text-3xl font-bold mb-4"
          style={{ color: navy, fontFamily: "Georgia, serif" }}
        >
          Password updated
        </h1>
        <p className="text-slate-600 mb-8 leading-relaxed">
          Your password has been reset successfully. You can now log in with your new credentials.
        </p>
        <Link
          href="/login"
          className="w-full text-white py-4 rounded-lg font-semibold transition shadow-lg"
          style={{ backgroundColor: navy }}
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-10">
        <div className="w-16 h-16 bg-slate-50 text-slate-800 rounded-full flex items-center justify-center mx-auto mb-6" style={{ backgroundColor: '#f8fafc' }}>
          <ShieldCheck size={32} style={{ color: navy }} />
        </div>
        <h1
          className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
          style={{
            color: navy,
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.02em",
          }}
        >
          Set new password
        </h1>
        <p className="text-slate-600">
          Choose a strong password for your Zivlo account.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: navy }}>
            New password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              className="w-full px-4 py-3.5 pr-12 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 text-base bg-white text-slate-900 placeholder:text-slate-400"
              style={{ color: "#0D1529", backgroundColor: "#ffffff" }}
              disabled={loading || !!error && !token}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2" style={{ color: navy }}>
            Confirm new password
          </label>
          <input
            type={showPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repeat your password"
            required
            className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 text-base bg-white text-slate-900 placeholder:text-slate-400"
            style={{ color: "#0D1529", backgroundColor: "#ffffff" }}
            disabled={loading || !!error && !token}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !password || !confirmPassword || !!error && !token}
          className="w-full text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          style={{ backgroundColor: navy }}
        >
          {loading ? "Updating password..." : "Update password"}
        </button>
      </form>
    </div>
  );
}

export default function ResetPassword() {
  const router = useRouter();
  const navy = "#0D1529";

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <nav className="flex items-center justify-between px-5 py-4 md:px-12 md:py-5 border-b border-slate-100">
        <Link href="/"><Logo /></Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          <Suspense fallback={
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
            </div>
          }>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
