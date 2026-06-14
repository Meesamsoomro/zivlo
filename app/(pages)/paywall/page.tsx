"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Check, Lock } from "lucide-react";
import Link from "next/link";

function PaywallContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-cream">
      <header className="flex items-center justify-between rounded-b-3xl bg-navy px-5 pb-6 pt-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold text-gold">Z</span>
          <span className="font-serif font-semibold text-white">Zivlo</span>
        </Link>
        <button
          onClick={handleLogout}
          className="text-xs font-light text-white/60 active:text-white"
        >
          Log out
        </button>
      </header>

      <div className="flex flex-1 flex-col items-center px-6 pb-10 pt-2 text-center">
        {message && (
          <div className="mt-4 w-full max-w-[320px] rounded-xl border border-green-200 bg-green-50 p-3">
            <p className="text-xs font-medium text-green-700">{message}</p>
          </div>
        )}

        <div className="mb-6 mt-6 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
          <Lock className="h-8 w-8 text-gold" />
        </div>

        <h1 className="font-serif text-2xl font-semibold leading-snug text-navy">
          One last step to unlock everything
        </h1>
        <p className="mt-3 max-w-[300px] text-sm font-light leading-relaxed text-[#666]">
          Subscribe to reveal director names, full personalised pitches, and run
          unlimited searches.
        </p>

        <div className="mt-8 w-full max-w-[320px] rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
          <div className="mb-4 text-center">
            <p className="font-serif text-4xl font-semibold text-navy">£19.99</p>
            <p className="text-sm font-light text-[#666]">
              /month · cancel anytime
            </p>
          </div>

          <div className="mb-6 space-y-2 text-left">
            {[
              "Up to 5 searches per day",
              "Up to 10 leads per search",
              "Director names & full pitches",
              "Search history saved",
              "Cancel anytime",
            ].map((feature) => (
              <div
                key={feature}
                className="flex items-center gap-2 text-sm text-navy"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-gold" strokeWidth={3} />
                <span className="font-light">{feature}</span>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleSubscribe(19.99)}
            disabled={paymentLoading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-medium text-navy shadow-md transition-transform active:scale-[0.98] disabled:opacity-50"
          >
            {paymentLoading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy" />
                Processing…
              </>
            ) : (
              <>
                Subscribe — £19.99/month
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          <p className="mt-3 text-[10px] font-light text-[#999]">
            Secure payment via Stripe. Cancel anytime in your dashboard.
          </p>
        </div>

        {user && (
          <p className="mt-6 text-xs font-light text-[#999]">
            Logged in as {user.email}
          </p>
        )}
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