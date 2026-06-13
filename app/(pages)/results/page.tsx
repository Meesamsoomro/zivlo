"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import {
  ArrowLeft,
  Phone,
  Globe,
  User,
  Copy,
  Download,
  Lock,
  Zap,
} from "lucide-react";
import {
  isInFreeMode,
  isUserSubscribed,
  truncatePitch,
} from "@/lib/trial";

type NormalizedLead = {
  id: string;
  companyName: string;
  businessType: string;
  location: string;
  incorporationYear: string;
  phone: string;
  website: string;
  directorName: string;
  pitch: string;
};

function normalizeLead(raw: Record<string, unknown>): NormalizedLead {
  const director = String(raw.director ?? "");
  return {
    id: String(raw.id ?? raw.company_number ?? raw.name ?? Math.random()),
    companyName: String(
      raw.name ?? raw.businessName ?? raw.business_name ?? "Unknown"
    ),
    businessType: String(raw.type ?? raw.businessType ?? ""),
    location: String(raw.location ?? ""),
    incorporationYear: String(raw.incorporated ?? raw.incorporationYear ?? ""),
    phone: String(raw.phone ?? ""),
    website: String(raw.website ?? ""),
    directorName: director.split("(")[0]?.trim() || director,
    pitch: String(
      raw.message ?? raw.personalisedPitch ?? raw.personalised_pitch ?? ""
    ),
  };
}

async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    /* fallback below */
  }
  const textarea = document.createElement("textarea");
  textarea.value = text;
  document.body.appendChild(textarea);
  textarea.select();
  const ok = document.execCommand("copy");
  document.body.removeChild(textarea);
  return ok;
}

function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const businessType =
    searchParams.get("type") ||
    searchParams.get("businessType") ||
    "";
  const location = searchParams.get("location") || "";
  const modeParam = searchParams.get("mode");
  const searchId = searchParams.get("search_id");

  const [leads, setLeads] = useState<NormalizedLead[]>([]);
  const [query, setQuery] = useState({ type: businessType, location });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const subscribed = isUserSubscribed();
  const freeMode =
    !subscribed && (modeParam === "free" || isInFreeMode());

  useEffect(() => {
    let cancelled = false;

    async function loadResults() {
      setLoading(true);
      setError(null);

      try {
        if (searchId) {
          const token = localStorage.getItem("auth_token");
          const res = await fetch(`/api/get-leads?search_id=${searchId}`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          });
          const data = await res.json();
          if (cancelled) return;
          if (data.success) {
            setLeads((data.leads || []).map(normalizeLead));
            setQuery({
              type: data.search?.business_type || businessType,
              location: data.search?.location || location,
            });
          } else {
            setError(data.error || "Failed to load leads");
          }
          setLoading(false);
          return;
        }

        if (freeMode && businessType && location) {
          const res = await fetch(
            `/api/search?businessType=${encodeURIComponent(businessType)}&location=${encodeURIComponent(location)}&free=true`
          );
          const data = await res.json();
          if (cancelled) return;
          if (data.success) {
            const normalized = (data.results || []).map(normalizeLead);
            setLeads(normalized);
            setQuery({ type: businessType, location });
            localStorage.setItem(
              "zivlo_search_results",
              JSON.stringify(data.results)
            );
            localStorage.setItem(
              "zivlo_search_query",
              JSON.stringify({ type: businessType, location })
            );
          } else {
            setError(data.error || "Failed to find leads");
          }
          setLoading(false);
          return;
        }

        const cachedResults = localStorage.getItem("zivlo_search_results");
        const cachedQuery = localStorage.getItem("zivlo_search_query");

        if (cachedResults) {
          const parsed = JSON.parse(cachedResults);
          if (cancelled) return;
          setLeads((Array.isArray(parsed) ? parsed : []).map(normalizeLead));
        }

        if (cachedQuery) {
          const parsedQuery = JSON.parse(cachedQuery);
          if (cancelled) return;
          setQuery({
            type: parsedQuery.type || businessType,
            location: parsedQuery.location || location,
          });
        } else if (businessType || location) {
          setQuery({ type: businessType, location });
        }

        if (
          !cachedResults &&
          !freeMode &&
          subscribed &&
          businessType &&
          location
        ) {
          const token = localStorage.getItem("auth_token");
          const res = await fetch(
            `/api/search?businessType=${encodeURIComponent(businessType)}&location=${encodeURIComponent(location)}`,
            { headers: token ? { Authorization: `Bearer ${token}` } : {} }
          );
          const data = await res.json();
          if (cancelled) return;
          if (data.success) {
            setLeads((data.results || []).map(normalizeLead));
            localStorage.setItem(
              "zivlo_search_results",
              JSON.stringify(data.results)
            );
            localStorage.setItem(
              "zivlo_search_query",
              JSON.stringify({ type: businessType, location })
            );
          } else {
            setError(data.error || "Failed to find leads");
          }
        }
      } catch {
        if (!cancelled) setError("Something went wrong loading results.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    const timer = setTimeout(loadResults, freeMode ? 800 : 0);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [businessType, location, freeMode, searchId, subscribed]);

  const handleCopyPitch = async (lead: NormalizedLead) => {
    if (freeMode) return;
    const ok = await copyToClipboard(lead.pitch);
    if (ok) {
      setCopiedId(lead.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleSubscribe = () => {
    const token = localStorage.getItem("auth_token");
    router.push(token ? "/paywall" : "/signup");
  };

  const displayLocation = query.location || location || "your area";
  const displayType = query.type || businessType || "Leads";

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col items-center justify-center bg-cream px-6">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        <p className="mt-4 text-sm font-light text-[#666]">
          Finding leads in {displayLocation}…
        </p>
        <p className="mt-1 text-xs font-light text-[#999]">
          Cross-referencing Companies House
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-auto flex min-h-screen max-w-[430px] flex-col items-center justify-center bg-cream px-6 text-center">
        <p className="text-sm text-navy">{error}</p>
        <Link
          href="/search"
          className="mt-4 text-sm font-medium text-gold underline"
        >
          Back to search
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-[430px] bg-cream">
      <header className="bg-navy px-5 pb-5 pt-4">
        <div className="mb-4 flex items-center gap-3">
          <Link
            href="/search"
            className="flex h-10 w-10 items-center justify-center text-white/70 active:text-white"
            aria-label="Back to search"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="font-serif text-base font-semibold text-white">
              {displayType} in {displayLocation}
            </h1>
            <p className="text-xs font-light text-white/50">
              {leads.length} leads found
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          {subscribed && !freeMode && leads.length > 0 && (
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/70"
              onClick={() => {
                const header = "Company,Phone,Website,Director,Pitch\n";
                const rows = leads
                  .map((l) =>
                    [
                      l.companyName,
                      l.phone,
                      l.website,
                      l.directorName,
                      `"${l.pitch.replace(/"/g, '""')}"`,
                    ].join(",")
                  )
                  .join("\n");
                const blob = new Blob([header + rows], { type: "text/csv" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `zivlo-leads-${displayLocation.replace(/\s/g, "-")}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              <Download className="h-3.5 w-3.5" />
              Export CSV
            </button>
          )}
          {freeMode && (
            <span className="flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1.5 text-xs text-gold">
              <Lock className="h-3 w-3" />
              Preview mode — subscribe to unlock
            </span>
          )}
        </div>
      </header>

      <div className="space-y-3 px-4 pb-8 pt-4">
        {leads.length === 0 && (
          <div className="rounded-xl border border-gray-100 bg-white p-6 text-center text-sm text-[#666]">
            No leads found. Try a different search.
          </div>
        )}

        {leads.map((lead) => (
          <article
            key={lead.id}
            className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm"
          >
            <div className="p-4">
              <h3 className="text-base font-semibold text-navy">
                {lead.companyName}
              </h3>
              <p className="mt-0.5 text-xs font-light text-[#666]">
                {lead.businessType} · {lead.location}
                {lead.incorporationYear
                  ? ` · Inc. ${lead.incorporationYear}`
                  : ""}
              </p>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
                {lead.phone && (
                  <a
                    href={`tel:${lead.phone.replace(/\s/g, "")}`}
                    className="flex items-center gap-1.5 text-xs text-[#666]"
                  >
                    <Phone className="h-3 w-3 text-gold" />
                    {lead.phone}
                  </a>
                )}
                {lead.website && (
                  <span className="flex items-center gap-1.5 text-xs text-[#666]">
                    <Globe className="h-3 w-3 text-gold" />
                    {lead.website}
                  </span>
                )}
              </div>

              <div className="mt-2 flex items-center gap-1.5">
                <User className="h-3 w-3 text-gold" />
                {freeMode ? (
                  <span className="flex items-center gap-1.5 text-xs text-[#999]">
                    <Lock className="h-3 w-3" />
                    Director on file — subscribe to view
                  </span>
                ) : (
                  <span className="text-xs font-medium text-navy">
                    {lead.directorName || "Director on file"}
                  </span>
                )}
              </div>

              <div className="mt-3 border-t border-gray-50 pt-3">
                <p className="mb-1.5 text-[10px] uppercase tracking-[0.15em] text-[#999]">
                  Personalised pitch
                </p>
                {freeMode ? (
                  <p className="line-clamp-2 text-sm font-light italic leading-relaxed text-[#444]">
                    &ldquo;{truncatePitch(lead.pitch)}&rdquo;
                  </p>
                ) : (
                  <p className="text-sm font-light italic leading-relaxed text-[#444]">
                    &ldquo;{lead.pitch}&rdquo;
                  </p>
                )}
              </div>
            </div>

            {!freeMode && subscribed && (
              <div className="flex gap-2 px-4 pb-4">
                <button
                  type="button"
                  onClick={() => handleCopyPitch(lead)}
                  className="flex-1 rounded-lg bg-navy py-2.5 text-xs font-medium text-white active:scale-[0.98]"
                >
                  {copiedId === lead.id ? "Copied ✓" : "Copy pitch"}
                </button>
              </div>
            )}
          </article>
        ))}

        {freeMode && leads.length > 0 && (
          <div className="rounded-xl bg-navy p-5 text-center">
            <Zap className="mx-auto mb-2 h-6 w-6 text-gold" />
            <p className="text-sm font-medium text-white">
              Want the full picture?
            </p>
            <p className="mb-4 mt-1 text-xs font-light text-white/60">
              Subscribe to see director names, full pitches, and run unlimited
              searches.
            </p>
            <button
              type="button"
              onClick={handleSubscribe}
              className="w-full rounded-xl bg-gold py-3 text-sm font-medium text-navy active:scale-[0.98]"
            >
              Subscribe — £19.99/month
            </button>
            <p className="mt-2 text-[10px] font-light text-white/30">
              Cancel anytime
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ResultsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-screen max-w-[430px] items-center justify-center bg-cream">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
        </div>
      }
    >
      <ResultsContent />
    </Suspense>
  );
}
