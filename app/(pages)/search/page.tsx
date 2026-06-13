"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import axios from "axios";
import {
  ArrowRight,
  Search,
  Zap,
  SlidersHorizontal,
  LogOut,
  LayoutDashboard,
} from "lucide-react";
import {
  canRunFreeSearch,
  getRemainingDailySearches,
  getUserFirstName,
  hasUsedFreeSearch,
  isUserSubscribed,
  recordFreeSearch,
} from "@/lib/trial";

const DAILY_SEARCH_LIMIT = 5;

function SearchPageContent() {
  const router = useRouter();
  const [businessType, setBusinessType] = useState("");
  const [location, setLocation] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  const [subscribed, setSubscribed] = useState(false);
  const [canTryFree, setCanTryFree] = useState(true);
  const [trialUsed, setTrialUsed] = useState(false);
  const [remainingToday, setRemainingToday] = useState<number | null>(null);
  const [firstName, setFirstName] = useState<string | null>(null);

  useEffect(() => {
    setSubscribed(isUserSubscribed());
    setCanTryFree(canRunFreeSearch());
    setTrialUsed(hasUsedFreeSearch());
    setRemainingToday(getRemainingDailySearches());
    setFirstName(getUserFirstName());
    setReady(true);
  }, []);

  const refreshTrialFlags = () => {
    setSubscribed(isUserSubscribed());
    setCanTryFree(canRunFreeSearch());
    setTrialUsed(hasUsedFreeSearch());
    setRemainingToday(getRemainingDailySearches());
    setFirstName(getUserFirstName());
  };

  const handleFreeSearch = () => {
    if (!businessType.trim() || !location.trim()) return;
    recordFreeSearch();
    router.push(
      `/results?type=${encodeURIComponent(businessType.trim())}&location=${encodeURIComponent(location.trim())}&mode=free`
    );
  };

  const handleSubscribedSearch = async () => {
    if (!businessType.trim() || !location.trim()) return;

    const token = localStorage.getItem("auth_token");
    if (!token) {
      router.push("/signup");
      return;
    }

    let user: { pitch_context?: string } | null = null;
    try {
      user = JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      user = null;
    }

    if (!user?.pitch_context) {
      alert(
        "Please complete your pitch description in Profile Settings before searching."
      );
      router.push("/dashboard");
      return;
    }

    try {
      const sub = JSON.parse(localStorage.getItem("subscription") || "{}");
      if (Number(sub.per_day) <= 0 || Number(sub.per_month) <= 0) {
        alert("You have used all your available search credits for today.");
        return;
      }
    } catch {
      /* ignore */
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `/api/search?businessType=${encodeURIComponent(businessType)}&location=${encodeURIComponent(location)}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        localStorage.setItem(
          "zivlo_search_results",
          JSON.stringify(res.data.results)
        );
        localStorage.setItem(
          "zivlo_search_query",
          JSON.stringify({ type: businessType, location })
        );

        try {
          const subString = localStorage.getItem("subscription");
          if (subString) {
            const subObj = JSON.parse(subString);
            if (Number(subObj.per_day) > 0) {
              subObj.per_day -= 1;
              if (Number(subObj.per_month)) {
                subObj.per_month = Math.max(
                  0,
                  subObj.per_month - (res.data.results?.length || 0)
                );
              }
              localStorage.setItem("subscription", JSON.stringify(subObj));
            }
          }
        } catch {
          /* ignore */
        }

        router.push("/results");
      } else {
        alert(res.data?.error || "Failed to search businesses");
      }
    } catch {
      alert("Failed to search businesses. Please try again.");
    } finally {
      setLoading(false);
      refreshTrialFlags();
    }
  };

  const handleSearch = () => {
    if (subscribed) {
      handleSubscribedSearch();
    } else {
      handleFreeSearch();
    }
  };

  const handleSubscribe = () => {
    const token = localStorage.getItem("auth_token");
    router.push(token ? "/paywall" : "/signup");
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    localStorage.removeItem("subscription");
    document.cookie =
      "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    setMenuOpen(false);
    refreshTrialFlags();
    router.push("/");
  };

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-cream">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  // ─── State 2: Paywall (trial used, not subscribed) ───
  if (trialUsed && !subscribed) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col bg-cream">
        <header className="rounded-b-3xl bg-navy px-5 pb-6 pt-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gold">Z</span>
            <span className="font-serif font-semibold text-white">Zivlo</span>
          </Link>
        </header>

        <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
          <div className="mb-6 mt-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
            <Zap className="h-8 w-8 text-gold" />
          </div>
          <h1 className="font-serif text-2xl font-semibold leading-snug text-navy">
            You&apos;ve seen what Zivlo finds
          </h1>
          <p className="mt-3 max-w-[300px] text-sm font-light leading-relaxed text-[#666]">
            Subscribe to unlock director names, full pitches, and unlimited
            searches.
          </p>

          <div className="mt-8 w-full max-w-[320px] rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="mb-4 text-center">
              <p className="font-serif text-4xl font-semibold text-navy">
                £19.99
              </p>
              <p className="text-sm font-light text-[#666]">
                /month · cancel anytime
              </p>
            </div>
            <div className="mb-6 space-y-2">
              {[
                "Up to 5 searches per day",
                "Up to 10 leads per search",
                "Director names & full pitches",
                "Search history saved",
                "Cancel anytime",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 text-sm text-navy"
                >
                  <Zap className="h-3.5 w-3.5 shrink-0 text-gold" />
                  <span className="font-light">{item}</span>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={handleSubscribe}
              className="w-full rounded-xl bg-gold py-3.5 text-sm font-medium text-navy shadow-md transition-transform active:scale-[0.98]"
            >
              Subscribe — £19.99/month
            </button>
            <Link
              href="/"
              className="mt-3 block w-full py-2 text-sm font-light text-[#666]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const searchesUsedToday =
    remainingToday !== null
      ? Math.max(0, DAILY_SEARCH_LIMIT - remainingToday)
      : 0;

  // ─── State 1 & 3: Free form / Subscribed header ───
  return (
    <div className="relative mx-auto min-h-screen max-w-[430px] bg-cream">
      <header className="rounded-b-3xl bg-navy px-5 pb-5 pt-4">
        <div className="mb-5 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gold">Z</span>
            <span className="font-serif font-semibold text-white">Zivlo</span>
          </Link>
          {subscribed && (
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex h-10 w-10 items-center justify-center text-white/70 active:text-white"
              aria-label="Menu"
            >
              <SlidersHorizontal className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* State 1: Free banner */}
        {!subscribed && canTryFree && (
          <div className="rounded-xl border border-white/10 bg-white/10 px-4 py-3">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-gold" />
              <span className="text-sm font-medium text-white">
                One free search — 5 leads restricted
              </span>
            </div>
            <p className="mt-1 text-xs font-light text-white/50">
              See real UK leads with restricted data. Subscribe for full access.
            </p>
          </div>
        )}

        {/* State 3: Subscribed quota header */}
        {subscribed && remainingToday !== null && (
          <div className="flex items-center justify-between">
            <span className="text-xs font-light text-white/50">
              {searchesUsedToday} of {DAILY_SEARCH_LIMIT} today
            </span>
            <span className="text-xs font-medium text-gold">
              {remainingToday} left
            </span>
          </div>
        )}
      </header>

      {menuOpen && subscribed && (
        <div className="absolute left-4 right-4 top-20 z-50 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center gap-3 px-5 py-3.5 text-left text-sm text-navy hover:bg-gray-50"
          >
            <LayoutDashboard className="h-4 w-4 text-gold" />
            Dashboard
          </Link>
          <Link
            href="/appscreen"
            onClick={() => setMenuOpen(false)}
            className="flex w-full items-center gap-3 border-t border-gray-50 px-5 py-3.5 text-left text-sm text-navy hover:bg-gray-50"
          >
            <Search className="h-4 w-4 text-gold" />
            Classic search
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 border-t border-gray-50 px-5 py-3.5 text-left text-sm text-red-500 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      )}

      <div className="flex-1 px-5 pb-8 pt-6">
        {subscribed && firstName && (
          <p className="mb-1 text-xs font-medium tracking-wide text-gold">
            Hey {firstName}
          </p>
        )}

        <h1 className="mb-1 font-serif text-2xl font-semibold text-navy">
          Find leads
        </h1>
        <p className="mb-6 text-sm font-light text-[#666]">
          Enter a business type and UK location.
        </p>

        <div className="space-y-3">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy">
              What type of business?
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={businessType}
                onChange={(e) => setBusinessType(e.target.value)}
                placeholder="e.g. Estate agents, Solicitors"
                className="w-full rounded-xl border border-gray-200 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition-colors focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-medium text-navy">
              Which UK location?
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Brighton, Manchester"
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 text-sm outline-none transition-colors focus:border-gold"
            />
          </div>

          <button
            type="button"
            onClick={handleSearch}
            disabled={
              !businessType.trim() || !location.trim() || loading
            }
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gold py-3.5 text-sm font-medium text-navy shadow-md transition-transform active:scale-[0.98] disabled:opacity-40"
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-navy/30 border-t-navy" />
                Searching...
              </>
            ) : (
              <>
                {!subscribed && canTryFree
                  ? "Try one free search"
                  : "Search for leads"}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>

        {!subscribed && (
          <p className="mt-6 text-center text-xs font-light text-[#999]">
            No signup required for your first search.
          </p>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-cream">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      }
    >
      <SearchPageContent />
    </Suspense>
  );
}
