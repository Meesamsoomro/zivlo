"use client";
import Logo from "@/components/Logo";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";

function SuccessPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navy = "#0D1529";
  const gold = "#C8A84B";
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const finalizePayment = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          router.push('/login');
          return;
        }

        // We call our internal create-payment API to update the database
        // and grant the user subscription access.
        const response = await fetch('/api/create-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            sub_id: 1, // Default subscription plan
            session_id: searchParams.get('session_id')
          })
        });

        const data = await response.json();

        if (data.success) {
          // Update local session with the new token that has is_subscribed: true
          localStorage.setItem('user', JSON.stringify(data.user));
          localStorage.setItem('auth_token', data.token);
          document.cookie = `auth_token=${data.token}; path=/; max-age=604800; SameSite=Strict`;
          setStatus('success');
        } else {
          throw new Error(data.error || 'Failed to activate subscription');
        }
      } catch (err: any) {
        console.error('Finalization error:', err);
        setErrorMessage(err.message || 'An error occurred while activating your account.');
        setStatus('error');
      }
    };

    // Delay slightly to ensure user sees the transition
    const timer = setTimeout(finalizePayment, 1500);
    return () => clearTimeout(timer);
  }, [router, searchParams]);

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
        <div className="w-full max-w-lg">
          <div className="text-center mb-8">
            <div
              className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl"
              style={{ backgroundColor: navy }}
            >
              {status === 'loading' ? (
                <Loader2 size={32} className="animate-spin" style={{ color: gold }} />
              ) : status === 'error' ? (
                <div className="text-red-400 text-3xl font-bold">!</div>
              ) : (
                <Check size={36} style={{ color: gold }} strokeWidth={3} />
              )}
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold mb-4 leading-tight"
              style={{
                color: navy,
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              {status === 'loading' ? "Finalizing Payment..." :
                status === 'error' ? "Activation Issue" : "Payment Successful!"}
            </h1>

            <p className="text-slate-600 text-base md:text-lg max-w-sm mx-auto">
              {status === 'loading' ? "Please wait while we set up your account access." :
                status === 'error' ? (errorMessage || "We encountered an issue activating your plan.") :
                  "Your subscription is now active. Welcome to the Zivlo community!"}
            </p>
          </div>

          <div
            className="bg-white rounded-2xl p-8 shadow-2xl border-2"
            style={{ borderColor: status === 'error' ? '#fee2e2' : gold }}
          >
            {status === 'success' && (
              <button
                onClick={() => router.replace('/appscreen')}
                className="w-full text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 hover:opacity-90 shadow-lg"
                style={{ backgroundColor: navy }}
              >
                Start Finding Clients
                <ArrowRight size={18} />
              </button>
            )}

            {status === 'error' && (
              <button
                onClick={() => window.location.reload()}
                className="w-full text-white py-4 rounded-lg font-semibold transition bg-red-600 hover:bg-red-700 shadow-lg"
              >
                Try Again
              </button>
            )}

            {status === 'loading' && (
              <div className="py-4 text-center text-slate-400 italic">
                Securely processing...
              </div>
            )}
          </div>

          {status === 'success' && (
            <p className="text-center text-sm text-slate-500 mt-8">
              A confirmation email has been sent to your inbox.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <SuccessPageContent />
    </Suspense>
  );
}