"use client";
import Logo from "@/components/Logo";
import React from "react";
import { useRouter } from "next/navigation";
import { XCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function FailurePage() {
  const router = useRouter();
  const navy = "#0D1529";
  const gold = "#C8A84B";

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <nav className="flex items-center justify-between px-5 py-4 md:px-12 md:py-5 bg-white border-b border-slate-100">
        <Link href="/"><Logo /></Link>

        <Link
          href='/dashboard'
          className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md"
          style={{ backgroundColor: navy }}
        >
          Go to Dashboard
        </Link>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 py-12 md:py-16">
        <div className="w-full max-w-lg text-center">
          <div
            className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl bg-red-50"
          >
            <XCircle size={40} className="text-red-600" />
          </div>

          <h1
            className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
            style={{
              color: navy,
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            Payment Cancelled
          </h1>

          <p className="text-slate-600 text-base md:text-lg mb-10 max-w-sm mx-auto">
            The payment process was cancelled or failed. Your account has not been charged.
          </p>

          <div
            className="bg-white rounded-2xl p-8 shadow-xl border border-slate-200"
          >
            <Link
              href='/paywall'
              className="w-full text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 hover:opacity-90 shadow-lg"
              style={{ backgroundColor: navy }}
            >
              <ArrowLeft size={18} />
              Return to Plans
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
