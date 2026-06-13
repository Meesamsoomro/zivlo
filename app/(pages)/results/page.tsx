"use client";
import Logo from "@/components/Logo";
import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Phone,
  Globe,
  User,
  Copy,
  Check,
  Mail,
  MapPin,
  Search,
  Flag,
  AlertCircle,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

function normalizeCopyText(value: unknown): string {
  const text = typeof value === "string" ? value : String(value ?? "");
  return text.trim();
}

function copyViaHiddenTextarea(text: string): boolean {
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "0";
  textarea.style.opacity = "0";
  textarea.style.pointerEvents = "none";
  // Helps iOS not zoom and improves selection reliability.
  textarea.style.fontSize = "16px";

  document.body.appendChild(textarea);

  let ok = false;
  try {
    textarea.focus();
    textarea.select();
    textarea.setSelectionRange(0, text.length);
    ok = document.execCommand("copy");
  } catch {
    ok = false;
  } finally {
    document.body.removeChild(textarea);
  }

  return ok;
}

async function copyToClipboard(value: unknown): Promise<boolean> {
  const text = normalizeCopyText(value);
  if (!text) return false;

  // Prefer modern API when it’s available and allowed.
  if (navigator.clipboard?.writeText && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Fall back below (notably on iOS Safari).
    }
  }

  return copyViaHiddenTextarea(text);
}

export default function ResultsWrapper(props: any) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    }>
      <Results {...props} />
    </Suspense>
  );
}

function Results({
  onNavigate,
  searchQuery = { type: "Estate agents", location: "Brighton" },
  leads = null,
}: {
  onNavigate?: any;
  searchQuery?: any;
  leads?: any;
}) {

  const router = useRouter();
  const searchParams = useSearchParams();

  const [copiedId, setCopiedId] = useState<any>(null);
  const [reportedIds, setReportedIds] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const navy = "#0D1529";
  const gold = "#C8A84B";

  // Sample data fallback
  const [liveLeads, setLiveLeads] = useState<any[]>(leads || []);
  const [liveQuery, setLiveQuery] = useState<any>(searchQuery);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        // Ignore parse errors
      }
    }

    const searchId = searchParams.get("search_id");

    if (searchId) {
      // Fetch leads from database
      const fetchLeads = async () => {
        try {
          const token = localStorage.getItem("auth_token");
          const res = await fetch(`/api/get-leads?search_id=${searchId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          const data = await res.json();
          if (data.success) {
            setLiveLeads(data.leads);
            setLiveQuery({
              type: data.search.business_type,
              location: data.search.location
            });
          } else {
            console.error("Failed to fetch leads:", data.error);
          }
        } catch (err) {
          console.error("Error fetching leads:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchLeads();
    } else if (!leads) {
      try {
        const cachedResults = localStorage.getItem("zivlo_search_results");
        const cachedQuery = localStorage.getItem("zivlo_search_query");
        if (cachedResults) {
          setLiveLeads(JSON.parse(cachedResults));
        } else {
          // Default beautiful premium preview data
          // setLiveLeads([
          //   {
          //     id: 1,
          //     name: "Brighton & Hove Estates",
          //     type: "Estate Agent",
          //     location: "Brighton",
          //     phone: "01273 555 0142",
          //     website: "bhestates.co.uk",
          //     email: "info@bhestates.co.uk",
          //     director: "James Whitford (HIGH confidence match)",
          //     incorporated: "2016",
          //     googleRating: "4.2 (38 reviews)",
          //     websitePresent: true,
          //     message: `Hi James — I noticed Brighton & Hove Estates has been trading since 2016 and has a strong presence in the local Brighton market. I help independent estate agents redesign their websites to stand out on Rightmove and Zoopla. Would a quick chat next week be of interest?`,
          //   },
          //   {
          //     id: 2,
          //     name: "Seaside Property Group Ltd",
          //     type: "Estate Agent",
          //     location: "Brighton",
          //     phone: "01273 555 0298",
          //     website: "seasideproperty.co.uk",
          //     email: "hello@seasideproperty.co.uk",
          //     director: "Sarah Mitchell (HIGH confidence match)",
          //     incorporated: "2019",
          //     googleRating: "4.6 (52 reviews)",
          //     websitePresent: true,
          //     message: `Hi Sarah — I noticed Seaside Property Group has been trading since 2019 and has a strong presence in the local Brighton market. I help independent estate agents redesign their websites to stand out on Rightmove and Zoopla. Would a quick chat next week be of interest?`,
          //   }
          // ]);
        }
        if (cachedQuery) {
          setLiveQuery(JSON.parse(cachedQuery));
        }
      } catch (e) {
        console.error("Failed loading cached leads", e);
      } finally {
        setIsLoading(false);
      }
    } else {
      setLiveLeads(leads);
      setIsLoading(false);
    }
  }, [leads]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <div className="text-slate-500 font-medium">Loading your leads...</div>
      </div>
    );
  }

  const handleCopy = async (id: any, message: any) => {
    const ok = await copyToClipboard(message);
    if (!ok) return;
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleReport = (id: any) => {
    if (reportedIds.includes(id)) return;
    setReportedIds([...reportedIds, id]);
  };

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      {/* NAVBAR */}
      <nav className="bg-white border-b border-slate-100 px-5 py-3 md:px-12 md:py-4 flex items-center justify-between sticky top-0 z-50">
        <Link
          href="/appscreen"
          className="flex items-center gap-2 text-sm font-medium hover:opacity-70 transition whitespace-nowrap"
          style={{ color: navy }}
        >
          <ArrowLeft size={18} />
          <span className="hidden sm:inline">New search</span>
        </Link>

        <Link href="/"><Logo /></Link>

        <Link
          href="/dashboard"
          className="text-xs md:text-sm text-white px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-semibold shadow-md whitespace-nowrap"
          style={{ backgroundColor: navy }}
        >
          Dashboard
        </Link>
      </nav>

      {/* HEADER */}
      <div className="px-5 md:px-12 py-6 md:py-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
          <Search size={14} />
          Search results
        </div>

        <h1
          className="text-2xl md:text-4xl font-bold mb-2 leading-tight"
          style={{
            color: navy,
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.02em",
          }}
        >
          {liveQuery.type || liveQuery.businessType || "Estate agents"} in {liveQuery.location || "Brighton"}
        </h1>

        <p className="text-slate-600">
          Found{" "}
          <span className="font-semibold" style={{ color: navy }}>
            {liveLeads.length} leads
          </span>{" "}
          — UK limited companies only.
        </p>

        {user && !user.sender_name && (
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm mt-4">
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
        )}
      </div>

      {/* LEADS */}
      <div className="px-5 md:px-12 pb-16 max-w-4xl mx-auto space-y-5">
        {liveLeads.map((lead: any) => (
          <div
            key={lead.id || lead.name}
            className="bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden"
          >
            {/* CARD HEADER */}
            <div
              className="px-6 py-5 flex items-start justify-between"
              style={{ backgroundColor: navy }}
            >
              <div className="text-white">
                <div className="text-lg font-bold">{lead.name || lead.businessName}</div>
                <div className="text-xs text-slate-300 flex gap-2 mt-1">
                  <span>{lead.type}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin size={12} />
                    {lead.location || liveQuery.location}
                  </span>
                </div>
              </div>

              <div className="text-xs text-slate-300">
                Inc. {lead.incorporated}
              </div>
            </div>

            {/* CARD BODY */}
            <div className="p-5 space-y-4">
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-slate-700">
                <a href={`tel:${lead.phone}`} className="flex gap-2 items-center hover:text-slate-900 transition">
                  <Phone size={16} className="text-slate-500 shrink-0" />
                  <span className="truncate">{lead.phone}</span>
                </a>

                <a href={`https://${lead.website}`} target="_blank" rel="noopener noreferrer" className="flex gap-2 items-center hover:text-slate-900 transition">
                  <Globe size={16} className="text-slate-500 shrink-0" />
                  <span className="truncate">{lead.website}</span>
                </a>

                <a href={`mailto:${lead.email}`} className="flex gap-2 items-center hover:text-slate-900 transition">
                  <Mail size={16} className="text-slate-500 shrink-0" />
                  <span className="truncate">{lead.email}</span>
                </a>

                <div className="flex gap-2 items-center">
                  <User size={16} className="text-slate-500 shrink-0" />
                  <span className="truncate">{lead.director}</span>
                </div>
              </div>

              {/* MESSAGE */}
              <div className="bg-slate-50 p-4 rounded-lg text-sm whitespace-pre-line leading-relaxed italic text-slate-700">
                "{lead.message || lead.personalisedPitch}"
              </div>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy(lead.id, lead.message || lead.personalisedPitch)}
                  className="flex-1 py-3 rounded-lg text-white font-semibold flex items-center justify-center gap-2 touch-manipulation"
                  style={{
                    backgroundColor: copiedId === lead.id ? gold : navy,
                  }}
                >
                  {copiedId === lead.id ? (
                    <>
                      <Check size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy message
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleReport(lead.id)}
                  disabled={reportedIds.includes(lead.id)}
                  className="px-4 py-3 rounded-lg border flex items-center gap-2"
                >
                  <Flag size={16} />
                  {reportedIds.includes(lead.id) ? "Reported" : "Flag"}
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* CTA */}
        <div className="text-center pt-8">
          <Link
            href="/appscreen"
            className="px-8 py-3 rounded-lg text-white flex items-center gap-2 mx-auto"
            style={{ backgroundColor: navy }}
          >
            <Search size={18} />
            Run another search
          </Link>
        </div>
      </div>
    </div >
  );
}
