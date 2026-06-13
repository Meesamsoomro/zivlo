"use client";
import Logo from "@/components/Logo";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const navy = "#0D1529";
  const gold = "#C8A84B";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch("/api/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitted(true);
      } else {
        alert(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      alert("Failed to send reset link. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-white flex flex-col"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <nav className="flex items-center justify-between px-5 py-4 md:px-12 md:py-5 border-b border-slate-100">
        <Link href="/"><Logo /></Link>
        <Link
          href="/login"
          className="text-sm md:text-base text-slate-600 hover:text-slate-900 transition flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Back to login
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 py-12">
        <div className="w-full max-w-md">
          {submitted ? (
            <div className="text-center animate-in fade-in zoom-in duration-300">
              <div className="w-16 h-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h1
                className="text-2xl md:text-3xl font-bold mb-4"
                style={{ color: navy, fontFamily: "Georgia, serif" }}
              >
                Check your email
              </h1>
              <p className="text-slate-600 mb-8 leading-relaxed">
                If an account exists for <span className="font-semibold" style={{ color: navy }}>{email}</span>, 
                we've sent a password reset link.
              </p>
              <Link
                href="/login"
                className="w-full text-white py-4 rounded-lg font-semibold transition shadow-lg"
                style={{ backgroundColor: navy }}
              >
                Return to login
              </Link>
            </div>
          ) : (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-10">
                <h1
                  className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
                  style={{
                    color: navy,
                    fontFamily: "Georgia, serif",
                    letterSpacing: "-0.02em",
                  }}
                >
                  Forgot password?
                </h1>
                <p className="text-slate-600">
                  Enter your email and we'll send you a link to reset your password.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    className="block text-sm font-semibold mb-2"
                    style={{ color: navy }}
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@yourbusiness.co.uk"
                    required
                    className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 text-base bg-white text-slate-900 placeholder:text-slate-400"
                    style={{ color: "#0D1529", backgroundColor: "#ffffff" }}
                    disabled={loading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                  style={{ backgroundColor: navy }}
                >
                  {loading ? "Sending link..." : "Send reset link"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
