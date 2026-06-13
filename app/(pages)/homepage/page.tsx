"use client";
import Logo from "@/components/Logo";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Check,
  Search,
  FileText,
  Send,
  Phone,
  Globe,
  User,
  ChevronDown,
} from "lucide-react";
export default function HomePage({
  onNavigate
}: {
  onNavigate?: (screen: string) => void
}) {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navy = "#0D1529";
  const gold = "#C8A84B";
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) setIsLoggedIn(true);
  }, []);

  return (
    <div
      className="min-h-screen bg-white"
      style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}
    >
      <nav className="flex items-center justify-between px-5 py-4 md:px-12 md:py-5 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur z-50">
        <Logo />
        <div className="flex items-center gap-2 md:gap-4">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="text-sm md:text-base text-white px-4 py-2.5 md:px-5 md:py-2.5 rounded-lg shadow-md"
              style={{ backgroundColor: navy }}
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm md:text-base text-slate-600 hover:text-slate-900 transition px-3 py-2"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="text-sm md:text-base text-white px-4 py-2.5 md:px-5 md:py-2.5 rounded-lg shadow-md"
                style={{ backgroundColor: navy }}
              >
                Start finding leads
              </Link>
            </>
          )}
        </div>
      </nav>
      <section className="px-5 md:px-12 pt-12 md:pt-24 pb-12 md:pb-20 max-w-5xl mx-auto text-center">
        <div
          className="inline-block text-xs md:text-sm font-medium px-3 py-1.5 rounded-full mb-6"
          style={{ backgroundColor: "#FFF8E7", color: "#9A7B1F" }}
        >
          ✦ Built for UK B2B businesses
        </div>
        <h1
          className="text-4xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6"
          style={{
            color: navy,
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.03em",
          }}
        >
          Stop prospecting.
          <br />
          Start closing.
          <br />
          <span style={{ color: gold, fontStyle: "italic" }}>
            Win your next client.
          </span>
        </h1>
        <p className="text-base md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Zivlo finds UK businesses that fit your service — and writes a
          personalised pitch for each one. No more spreadsheets. No more cold
          emails to the void. Just real leads, ready to contact.
        </p>
        <button
          onClick={() => onNavigate && onNavigate("signup")}
          className="text-white px-8 py-4 rounded-lg text-base font-semibold shadow-lg flex items-center gap-2 mx-auto"
          style={{
            backgroundColor: navy,
            boxShadow: `0 10px 30px -10px ${navy}50`,
          }}
        >
          Start finding leads — £19.99/month <ArrowRight size={18} />
        </button>
        <p className="text-sm text-slate-500 mt-5">
          Cancel anytime. No long contracts.
        </p>
      </section>
      <section className="px-5 md:px-12 py-14 md:py-20 bg-slate-50">
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-2xl md:text-4xl font-bold mb-5 leading-tight"
            style={{
              color: navy,
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            You didn't start a business to spend your weekends prospecting.
          </h2>
          <p className="text-base md:text-lg text-slate-600 leading-relaxed">
            Hunting Google Maps. Copying business names into spreadsheets.
            Searching LinkedIn for the owner. Writing the same generic email 50
            times. Most of it leads nowhere — and every hour you spend
            prospecting is an hour you're not doing the work you actually do.{" "}
            <span className="font-semibold" style={{ color: navy }}>
              Zivlo gives you that hour back.
            </span>
          </p>
        </div>
      </section>
      <section className="px-5 md:px-12 py-16 md:py-24 max-w-5xl mx-auto">
        <h2
          className="text-3xl md:text-5xl font-bold text-center mb-3 leading-tight"
          style={{
            color: navy,
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.02em",
          }}
        >
          How Zivlo works
        </h2>
        <p className="text-center text-slate-600 mb-12 text-base md:text-lg">
          From idea to outreach in under 60 seconds.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              num: 1,
              icon: Search,
              title: "Pick a niche to target",
              desc: 'Type the business type you want as a client and a UK location. For example: "Estate agents in Brighton" or "Solicitors in Manchester".',
            },
            {
              num: 2,
              icon: FileText,
              title: "Get sourced from Companies House UK leads",
              desc: "Zivlo pulls live UK business data — name, phone, website, director name — all sourced from Companies House against Companies House.",
            },
            {
              num: 3,
              icon: Send,
              title: "Send the perfect pitch",
              desc: "Each lead comes with a personalised pitch, written from a professional's perspective. Copy, send from your own email, win the client.",
            },
          ].map((step) => (
            <div
              key={step.num}
              className="bg-white border border-slate-200 rounded-2xl p-7 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-5">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center font-bold text-lg"
                  style={{
                    backgroundColor: navy,
                    color: gold,
                    fontFamily: "Georgia, serif",
                  }}
                >
                  {step.num}
                </div>
                <step.icon size={22} className="text-slate-300" />
              </div>
              <h3
                className="text-xl font-bold mb-3"
                style={{ color: navy, fontFamily: "Georgia, serif" }}
              >
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
      <section className="px-5 md:px-12 py-16 md:py-24 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div
              className="inline-block text-xs font-medium px-3 py-1.5 rounded-full mb-4"
              style={{ backgroundColor: "#FFF8E7", color: "#9A7B1F" }}
            >
              Example
            </div>
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
              style={{
                color: navy,
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              This is what you'll get
            </h2>
            <p className="text-slate-600 text-base md:text-lg">
              Real lead. Real contact details. Real pitch — written for you, as
              a professional.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
            <div
              className="px-6 py-5 flex items-center justify-between"
              style={{ backgroundColor: navy }}
            >
              <div className="text-white">
                <div className="text-lg md:text-xl font-bold">
                  Brighton & Hove Estates
                </div>
                <div className="text-xs md:text-sm text-slate-300">
                  Estate Agent · Brighton
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs md:text-sm text-slate-300 whitespace-nowrap">
                  Inc. 2016
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <Phone size={16} className="text-slate-400" />
                  01273 555 0142
                </div>
                <div className="flex items-center gap-2 text-slate-700">
                  <Globe size={16} className="text-slate-400" />
                  bhestates.co.uk
                </div>
                <div className="flex items-center gap-2 text-slate-700 col-span-2">
                  <User size={16} className="text-slate-400" />
                  James Whitford · Director
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4">
                <div className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
                  Personalised pitch
                </div>
                <div className="bg-slate-50 rounded-lg p-4 text-sm text-slate-700 leading-relaxed italic">
                  "Hi James — I noticed Brighton & Hove Estates has been trading
                  since 2016 and has a strong presence in the local Brighton
                  market. I help independent estate agents redesign their
                  websites to stand out on Rightmove and Zoopla. Would a quick
                  chat next week be of interest?"
                </div>
                <button
                  className="mt-3 w-full py-2.5 rounded-lg text-white font-semibold text-sm"
                  style={{ backgroundColor: navy }}
                >
                  Copy message
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="px-5 md:px-12 py-16 md:py-24 text-white"
        style={{ backgroundColor: navy }}
      >
        <div className="max-w-5xl mx-auto">
          <h2
            className="text-3xl md:text-5xl font-bold text-center mb-3 leading-tight"
            style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
          >
            Every lead, fully briefed
          </h2>
          <p className="text-center text-slate-300 mb-14 text-base md:text-lg">
            No half-information. Everything you need to reach out with
            confidence.
          </p>
          <div className="grid md:grid-cols-2 gap-5">
            {[
              {
                title: "Business name",
                desc: "Real, sourced from Companies House UK limited companies — never sole traders, never made up.",
              },
              {
                title: "Phone number",
                desc: "Direct line where available, pulled from live Google Maps data.",
              },
              {
                title: "Website",
                desc: "Quick reference so you can size up their current site before pitching.",
              },
              {
                title: "Director name",
                desc: "Real human contact via Companies House — no guessing who to email.",
              },
              {
                title: "Personalised pitch",
                desc: "A personalised pitch that mentions their business — written for you.",
              },
              {
                title: "sourced from Companies House business data",
                desc: "Incorporation date, Google rating, website status — facts you can act on, not opinions you have to second-guess.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: gold }}
                >
                  <Check size={16} style={{ color: navy }} strokeWidth={3} />
                </div>
                <div>
                  <h3
                    className="font-semibold text-lg mb-1"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-slate-300 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-12 py-16 md:py-24 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2
              className="text-3xl md:text-5xl font-bold mb-4 leading-tight"
              style={{
                color: navy,
                fontFamily: "Georgia, serif",
                letterSpacing: "-0.02em",
              }}
            >
              Outreach that stays on the right side of the law
            </h2>
            <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
              Zivlo only ever returns UK limited companies. Sole traders and
              partnerships — the ones that need consent before you can contact
              them — are filtered out automatically. You reach out with
              confidence, every time.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Limited companies only",
                desc: "Every lead is a sourced from Companies House UK limited company. Sole traders and partnerships are excluded automatically, so your outreach rests on a legitimate-interest basis.",
              },
              {
                title: "Official Companies House data",
                desc: "Names, directors and incorporation details come straight from the UK register. Accurate, current, and never scraped from questionable sources.",
              },
              {
                title: "Built-in, not bolted-on",
                desc: "You don’t have to check compliance yourself. Zivlo does it on every search, so it’s handled before you ever hit send.",
              },
            ].map((item, i) => (
              <div key={i} className="flex gap-4 items-start">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                  style={{ backgroundColor: gold }}
                >
                  <Check size={16} style={{ color: navy }} strokeWidth={3} />
                </div>
                <div>
                  <h3
                    className="font-semibold text-lg mb-2"
                    style={{ color: navy, fontFamily: "Georgia, serif" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-5 md:px-12 py-16 md:py-24 bg-slate-50">
        <div className="max-w-md mx-auto text-center">
          <h2
            className="text-3xl md:text-5xl font-bold mb-3 leading-tight"
            style={{
              color: navy,
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.02em",
            }}
          >
            One simple price
          </h2>
          <p className="text-slate-600 mb-10 text-base md:text-lg">
            Win one client and Zivlo pays for itself for years.
          </p>
          <div
            className="bg-white rounded-2xl p-8 md:p-10 shadow-2xl border-2"
            style={{ borderColor: gold }}
          >
            <div className="mb-2">
              <span
                className="text-5xl md:text-6xl font-bold"
                style={{ color: navy, fontFamily: "Georgia, serif" }}
              >
                £19.99
              </span>
              <span className="text-lg text-slate-500 font-medium">/month</span>
            </div>
            <p className="text-slate-600 mb-8 text-sm">
              Everything included. Cancel anytime.
            </p>
            <ul className="text-left space-y-3 mb-8">
              {[
                "Up to 5 searches per day",
                "Up to 10 leads per search",
                "Personalised pitch per lead",
                "UK limited companies only (filters sole traders)",
                "Search history saved",
                "Cancel anytime",
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
            <Link
              href="/signup"
              className="block w-full py-4 rounded-lg font-semibold transition hover:opacity-90"
              style={{ backgroundColor: gold, color: navy }}
            >
              Start finding leads
            </Link>
          </div>
        </div>
      </section>
      <section className="px-5 md:px-12 py-16 md:py-24 max-w-3xl mx-auto">
        <h2
          className="text-3xl md:text-5xl font-bold text-center mb-12 leading-tight"
          style={{
            color: navy,
            fontFamily: "Georgia, serif",
            letterSpacing: "-0.02em",
          }}
        >
          Common questions
        </h2>
        <div className="space-y-3">
          {[
            {
              q: "Are these real businesses or AI-generated?",
              a: "Real. Every lead Zivlo returns is pulled from live UK business data — Google Maps for contact details, Companies House for director names. No fake businesses, no made-up directors.",
            },
            {
              q: "How many leads do I get per search?",
              a: "Up to 10 leads per search, depending on the business type and location. After PECR filtering (which removes sole traders and partnerships you can't legally cold-email), you'll typically see 5–10 high-quality leads per search.",
            },
            {
              q: "Will my outreach be PECR-compliant?",
              a: "Zivlo only returns UK limited companies, PLCs and LLPs — businesses generally permitted for B2B outreach under PECR rules. Sole traders and partnerships are filtered out automatically, and every pitch includes an opt-out line. You remain responsible for compliance with all applicable laws when sending your outreach.",
            },
            {
              q: "Can I cancel anytime?",
              a: "Yes. No contracts, no minimum term. Cancel from your dashboard in two clicks.",
            },
            {
              q: "Will £19.99 pay for itself?",
              a: "One website project for an estate agent or solicitor typically pays £1,000–£5,000. Win one client per year and Zivlo has paid for itself many times over.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="border border-slate-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50"
              >
                <span
                  className="font-semibold text-base md:text-lg pr-4"
                  style={{ color: navy }}
                >
                  {item.q}
                </span>
                <ChevronDown
                  size={20}
                  className="text-slate-400 flex-shrink-0 transition-transform"
                  style={{
                    transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                  }}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-slate-600 leading-relaxed text-sm md:text-base">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      <section
        className="px-5 md:px-12 py-16 md:py-24 text-white text-center"
        style={{ backgroundColor: navy }}
      >
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-3xl md:text-5xl font-bold mb-5 leading-tight"
            style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.02em" }}
          >
            Stop chasing.
            <br />
            <span style={{ color: gold, fontStyle: "italic" }}>
              Start closing.
            </span>
          </h2>
          <p className="text-slate-300 text-base md:text-lg mb-10">
            Your next client is out there. Zivlo finds them.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 px-8 md:px-10 py-4 rounded-lg font-bold text-base md:text-lg shadow-xl"
            style={{ backgroundColor: gold, color: navy }}
          >
            Start finding leads — £19.99/month <ArrowRight size={20} />
          </Link>
        </div>
      </section>
      <footer className="px-5 md:px-12 py-8 border-t border-slate-200 text-sm text-slate-500">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div>
            © {new Date().getFullYear()} Zivlo. Operated by Dare to Accept
            Limited.
          </div>
          <div className="flex gap-5">
            <Link href="/legal" className="hover:text-slate-900">
              Terms
            </Link>
            <Link href="/privacy-policy" className="hover:text-slate-900">
              Privacy
            </Link>
            <a href="mailto:hello@zivlo.io" className="hover:text-slate-900">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
