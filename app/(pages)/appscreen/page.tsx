"use client";
import Logo from "@/components/Logo";
import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Sparkles, Clock, ChevronRight, LogOut, AlertCircle } from "lucide-react";
import axios from "axios";
import Link from "next/link";

function AppScreenContent({
  recentSearches = []
}: {
  recentSearches?: any[]
}) {

  const router = useRouter();
  const searchParams = useSearchParams();
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [remainingQuota, setRemainingQuota] = useState<number | null>(null);
  const [showQuotaModal, setShowQuotaModal] = useState(false);

  const navy = "#0D1529";
  const gold = "#C8A84B";

  useEffect(() => {
    // Get message from URL
    const urlMessage = searchParams.get('message');
    if (urlMessage) {
      setMessage(urlMessage);
      // Clear message from URL after 4 seconds
      setTimeout(() => {
        setMessage(null);
        router.replace('/appscreen');
      }, 4000);
    }

    // Check authentication and subscription securely inside useEffect to avoid SSR hydration bugs
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    console.log('userData', userData);
    const subscriptionData = localStorage.getItem('subscription');

    console.log('subscriptionData', subscriptionData);
    if (!token || !userData) {
      router.push('/signup');
      return;
    }

    const parsedUser = JSON.parse(userData);
    setUser(parsedUser);

    // If not subscribed, redirect to paywall
    if (parsedUser.is_subscribed !== true) {
      router.push('/paywall');
    }

    // Initialize remaining quota state
    try {
      if (subscriptionData) {
        const parsedSub = JSON.parse(subscriptionData);
        if (Number(parsedSub.per_day) <= 0 || Number(parsedSub.per_month) <= 0) {
          setRemainingQuota(0);
        } else {
          setRemainingQuota(parsedSub.per_day);
        }
      }
    } catch (e) {
      // Ignore parse errors
    }
  }, [router, searchParams]);

  const handleSearch = async () => {
    if (!businessType || !location) return;

    if (!user?.pitch_context) {
      alert("Please complete your pitch description in Profile Settings before searching.");
      return;
    }

    // Check daily and monthly quota before executing network request
    try {
      const subString = JSON.parse(localStorage.getItem("subscription") || "{}");

      if (Number(subString.per_day) <= 0 || Number(subString.per_month) <= 0) {
        setShowQuotaModal(true);
        return;
      }

    } catch (e) {
      // Ignore parse errors
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("auth_token");
      const res = await axios.get(
        `/api/search?businessType=${encodeURIComponent(businessType)}&location=${encodeURIComponent(location)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log('response', res.data);
      if (res.data?.success) {
        localStorage.setItem("zivlo_search_results", JSON.stringify(res.data.results));
        localStorage.setItem("zivlo_search_query", JSON.stringify({ type: businessType, location }));

        // Attempt to extract payment_id safely from subscription storage
        let paymentId = undefined;
        try {
          const subData = localStorage.getItem("subscription");
          if (subData) {
            const parsedSub = JSON.parse(subData);
            paymentId = parsedSub?.id || parsedSub?.payment_id;
          }
        } catch (e) {
          // Ignore storage parse errors
        }

        // Decrement daily quota locally (backend already handled search insertion & quota decrement in /api/search)
        try {
            const subString = localStorage.getItem("subscription");
            if (subString) {
              const subObj = JSON.parse(subString);
              if (Number(subObj.per_day) > 0) {
                subObj.per_day -= 1;

                if (Number(subObj.per_month)) {
                  subObj.per_month = Math.max(0, subObj.per_month - (res.data.results?.length || 0));
                }

                localStorage.setItem("subscription", JSON.stringify(subObj));
                setRemainingQuota(subObj.per_day);
              }
            }
          } catch (localErr) {
            // Ignore local storage parse errors
          }

        router.push("/results");
      } else {
        alert(res.data?.error || "Failed to search businesses");
      }
    } catch (err: any) {
      console.error("Search API error:", err.message);
      alert("Failed to search businesses. Please try again.");
    } finally {
      setLoading(false);
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

  const examples = [
    { type: "Estate agents", location: "Brighton" },
    { type: "Dentists", location: "Manchester" },
    { type: "Solicitors", location: "Leeds" },
    { type: "Accountants", location: "Bristol" },
  ];

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50 relative"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* QUOTA POP-UP MODAL */}
      {showQuotaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm px-4 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8 border-t-4 border-amber-500 relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                <AlertCircle size={22} />
              </div>
              <h3 className="text-xl font-bold" style={{ color: navy }}>
                Daily Quota Exhausted
              </h3>
            </div>

            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6">
              You have used all your available search credits. Your daily quota automatically resets at midnight UTC, while your monthly lead limits refill every billing cycle.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowQuotaModal(false)}
                className="px-5 py-2.5 rounded-lg font-semibold text-white transition hover:opacity-90 w-full"
                style={{ backgroundColor: navy }}
              >
                Understood
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-100 px-5 py-3 md:px-12 md:py-4 flex items-center justify-between sticky top-0 z-40">
        <Link href="/"><Logo /></Link>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap"
            style={{ backgroundColor: navy }}
          >
            Dashboard
          </Link>

          {/* REMAINING QUOTA PILL */}
          {remainingQuota !== null && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border"
              style={{
                backgroundColor: remainingQuota > 0 ? "#F8FAFC" : "#FEF2F2",
                borderColor: remainingQuota > 0 ? "#E2E8F0" : "#FCA5A5",
                color: remainingQuota > 0 ? navy : "#DC2626"
              }}
              title="Remaining searches available today"
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: remainingQuota > 0 ? gold : "#DC2626" }} />
              <span>{remainingQuota} {remainingQuota === 1 ? 'search' : 'searches'} left today</span>
            </div>
          )}

          <div className="text-sm text-slate-600 hidden sm:block">
            {user?.email}
          </div>
          <button
            onClick={handleLogout}
            className="p-2.5 rounded-lg hover:bg-slate-100 transition"
            title="Logout"
          >
            <LogOut size={20} className="text-slate-600" />
          </button>
        </div>
      </nav>

      {/* Success Message */}
      {message && (
        <div className="max-w-3xl mx-auto mt-4 px-5">
          <div className="p-4 rounded-lg bg-green-50 border border-green-200">
            <p className="text-sm text-green-700 text-center font-semibold">
              {message}
            </p>
          </div>
        </div>
      )}

      {/* Missing Sender Name Alert */}
      {user && !user.sender_name && (
        <div className="max-w-3xl mx-auto mt-4 px-5">
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
              <AlertCircle size={18} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-amber-900">Set your sender name</h4>
              <p className="text-xs text-amber-700 mt-0.5 leading-relaxed">
                Your cold emails are currently signing off with the literal <strong>"[Your name]"</strong> placeholder. Set your sender name in your profile to auto-fill this.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 bg-amber-600 text-white rounded-lg text-xs font-semibold hover:bg-amber-700 transition shadow-sm shrink-0 mt-2 sm:mt-0 inline-block"
            >
              Fix now
            </Link>
          </div>
        </div>
      )}

      {/* Missing Pitch Context Alert */}
      {user && !user.pitch_context && (
        <div className="max-w-3xl mx-auto mt-4 px-5">
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle size={18} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-red-900">Missing pitch description</h4>
              <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
                You cannot generate leads or write emails without a pitch description. Set your pitch context in your profile to proceed.
              </p>
            </div>
            <Link
              href="/dashboard"
              className="px-3.5 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-700 transition shadow-sm shrink-0 mt-2 sm:mt-0 inline-block"
            >
              Fix now
            </Link>
          </div>
        </div>
      )}

      {/* HERO */}
      <div className="px-5 md:px-12 py-12 md:py-20 max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <div
            className="inline-flex items-center gap-2 text-xs md:text-sm font-medium px-3 py-1.5 rounded-full mb-5"
            style={{ backgroundColor: "#FFF8E7", color: "#9A7B1F" }}
          >
            <Sparkles size={14} />
            Find your next customer
          </div>

          <h1
            className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
            style={{
              color: navy,
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            Who do you want
            <br />
            as a customer?
          </h1>

          <p className="text-slate-600 text-base md:text-lg">
            Tell us the type of business you want as a client. We'll find real UK companies and write a pitch for each one.
          </p>
        </div>

        {/* SEARCH FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-slate-200">
          <div className="space-y-4">
            {/* BUSINESS TYPE */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: navy }}
              >
                Business type
              </label>

              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g. Estate agents, dentists, plumbers"
                className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 text-base bg-white text-slate-900 placeholder:text-slate-400"
                style={{ color: "#0D1529", backgroundColor: "#ffffff" }}
              />
              <p className="text-xs text-slate-500 mt-2">
                Search businesses that need your service, not your own profession.
              </p>
            </div>

            {/* LOCATION */}
            <div>
              <label
                className="block text-sm font-semibold mb-2"
                style={{ color: navy }}
              >
                UK location
              </label>

              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Brighton, Manchester, Leeds"
                className="w-full px-4 py-3.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 text-base bg-white text-slate-900 placeholder:text-slate-400"
                style={{ color: "#0D1529", backgroundColor: "#ffffff" }}
              />
            </div>

            {/* BUTTON */}
            <button
              onClick={handleSearch}
              disabled={!businessType || !location || !user?.pitch_context || loading}
              className="w-full text-white py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ backgroundColor: navy }}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Finding leads...
                </>
              ) : (
                <>
                  <Search size={18} />
                  Find leads
                </>
              )}
            </button>
          </div>
        </div>

        {/* EXAMPLES */}
        <div className="mt-8">
          <div className="text-sm text-slate-500 mb-3 text-center">
            Try one of these:
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => {
                  setBusinessType(ex.type);
                  setLocation(ex.location);
                }}
                className="text-sm bg-white border border-slate-200 rounded-full px-4 py-2 hover:border-slate-400 transition"
                style={{ color: navy }}
              >
                {ex.type} in {ex.location}
              </button>
            ))}
          </div>
        </div>

        {/* RECENT SEARCHES */}
        {recentSearches.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center gap-2 mb-4">
              <Clock size={18} className="text-slate-400" />
              <h3 className="font-semibold" style={{ color: navy }}>
                Recent searches
              </h3>
            </div>

            {/* <div className="space-y-2">
              {recentSearches.slice(0, 5).map((search, i) => (
                <button
                  key={i}
                  className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 flex items-center justify-between hover:border-slate-400 transition text-left"
                >
                  <div>
                    <div
                      className="font-medium text-sm"
                      style={{ color: navy }}
                    >
                      {search.type} in {search.location}
                    </div>

                    <div className="text-xs text-slate-500">{search.date}</div>
                  </div>

                  <ChevronRight size={18} className="text-slate-400" />
                </button>
              ))}
            </div> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AppScreen(props: any) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <AppScreenContent {...props} />
    </Suspense>
  );
}