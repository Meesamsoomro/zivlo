"use client";
import Logo from "@/components/Logo";
import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Lock } from "lucide-react";
import Link from "next/link";

function PaywallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const navy = "#0D1529";
  const gold = "#C8A84B";
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    // Get message from URL
    const urlMessage = searchParams.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
      // Clear message from URL after 4 seconds

      setMessage(null);
      router.replace('/paywall');

    }

    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
          router.push('/signup');
          return;
        }

        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        if (parsedUser.is_subscribed === true) {
          router.push('/appscreen');
          return;
        }

        setLoading(false);

      } catch (error) {
        console.error('Error in paywall:', error);
        router.push('/signup');
      }
    };

    checkAuth();
  }, [router, searchParams]);

  const handleSubscribe = async (price: number) => {
    setPaymentLoading(true);

    try {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        router.push('/signup');
        return;
      }

      const response = await fetch('/api/stripe-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          amount: price,
          productName: "Zivlo Subscription",
          domain: window.location.origin
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.success && data.data) {
        // Redirect to Stripe Checkout
        window.location.href = data.data;
      } else {
        throw new Error(data.error || 'Payment initialization failed');
      }


    } catch (error: any) {
      console.error('Payment error:', error);
      alert(error.message || 'Payment failed. Please try again.');
      setPaymentLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('subscription');
    localStorage.removeItem('zivlo_search_results');
    localStorage.removeItem('zivlo_search_query');
    document.cookie = 'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    router.push('/login?message=You have been logged out successfully.');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <nav className="flex items-center justify-between px-5 py-4 md:px-12 md:py-5 bg-white border-b border-slate-100">
        <Link href="/"><Logo /></Link>

        <div className="flex items-center gap-3">
          <Link
            href='/dashboard'
            className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md"
            style={{ backgroundColor: navy }}
          >
            Go to Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Log out
          </button>
        </div>
      </nav>

      <div className="flex-1 flex items-center justify-center px-5 py-12 md:py-16">
        <div className="w-full max-w-lg">
          {message && (
            <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
              <p className="text-sm text-green-700 text-center font-semibold">
                {message}
              </p>
            </div>
          )}

          <div className="text-center mb-8">
            <div
              className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-5"
              style={{ backgroundColor: navy }}
            >
              <Lock size={28} style={{ color: gold }} />
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
              style={{
                color: navy,
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              Subscribe to start
              <br />
              finding clients
            </h1>

            <p className="text-slate-600 text-base md:text-lg">
              Get unlimited access to high-quality UK business leads for your
              service.
            </p>
          </div>

          <div
            className="bg-white rounded-2xl p-7 md:p-8 shadow-xl border-2"
            style={{ borderColor: gold }}
          >
            <div className="text-center mb-6">
              <span
                className="text-5xl font-bold"
                style={{ color: navy, fontFamily: "Georgia, serif" }}
              >
                £19.99
              </span>

              <span className="text-lg text-slate-500 font-medium">/month</span>
            </div>

            <ul className="space-y-3 mb-7">
              {[
                "Up to 5 searches per day",
                "Up to 10 leads per search",
                "Personalised pitch per lead",
                "UK limited companies only",
                
              ].map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 text-slate-700 text-sm md:text-base"
                >
                  <Check
                    size={18}
                    style={{ color: gold }}
                    strokeWidth={3}
                    className="flex-shrink-0"
                  />
                  {feature}
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleSubscribe(19.99)}
              disabled={paymentLoading}
              className="w-full py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
              style={{ backgroundColor: gold, color: navy }}
            >
              {paymentLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Subscribe now
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <p className="text-xs text-center text-slate-500 mt-4">
              Secure payment via Stripe. Cancel anytime in your dashboard.
            </p>
          </div>

          {user && (
            <p className="text-center text-sm text-slate-500 mt-6">
              Logged in as {user.email}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Paywall() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <PaywallContent />
    </Suspense>
  );
}