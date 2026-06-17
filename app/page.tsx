"use client";
import Logo from "@/components/Logo";
import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Check,
  Search,
  ClipboardList,
  Send,
  Phone,
  Globe,
  User,
  ChevronDown,
  Copy,
  MessageSquare,
  Calendar,
} from "lucide-react";

const DEMO_LEAD = {
  companyName: "Brighton & Hove Estates",
  businessType: "Estate Agent",
  location: "Brighton",
  incorporationYear: 2016,
  phone: "01273 555 0142",
  website: "bhestates.co.uk",
  directorName: "James Whitford",
  directorRole: "Director",
  pitch:
    "Hi James — I noticed Brighton & Hove Estates has been trading since 2016 and has a strong presence in the local Brighton market. I help independent estate agents redesign their websites to stand out on Rightmove and Zoopla. Would a quick chat next week be of interest?",
};

const FAQ_ITEMS = [
  {
    q: "Is this legal?",
    a: "Yes. Zivlo only ever returns UK limited companies. Sole traders and partnerships — the ones that need consent before you can contact them — are filtered out automatically. Limited companies are listed on the public Companies House register. Your outreach rests on a legitimate-interest basis, and you provide a clear opt-out in every message. If you're unsure, seek legal advice for your specific situation.",
  },
  {
    q: "Can I try before I pay?",
    a: "Yes. Run one free search — no signup, no credit card. You'll see 5 real UK leads with company names, phone numbers, and websites. Director names and full personalised pitches are hidden until you subscribe. It takes 60 seconds to see what Zivlo finds. Then £19.99/month to unlock everything.",
  },
  {
    q: "How is this different from buying a leads list?",
    a: "A leads list is static, often outdated, and sold to dozens of people. Zivlo pulls live data from Companies House and generates personalised pitches at the moment you search. You're not buying a spreadsheet — you're using a tool to find and prepare your outreach in real time.",
  },
  {
    q: "What if I get no replies?",
    a: "Zivlo is a lead-finding and pitch-writing tool, not a guaranteed client generator. Results depend on your offer, timing, and follow-up. That said, if you're not getting replies, reach out — I'll review your pitches and help you refine them.",
  },
  {
    q: "How many leads do I get per search?",
    a: "Up to 10 leads per search (5 on your free trial), up to 5 searches per day. Your free search shows real UK companies with contact details — director names and full pitches unlock after subscribing. £19.99/month, cancel anytime.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel from your account settings with two clicks. No phone call required. No awkward conversation.",
  },
];

const FOUNDER_VIDEO_POSTER = "/images/founder-video-poster.jpg";

function FounderVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [showPoster, setShowPoster] = useState(true);

  useEffect(() => {
    const video = videoRef.current;
    const section = sectionRef.current;
    if (!video || !section) return;

    const onPlaying = () => setShowPoster(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {
            /* autoplay blocked — poster stays until user presses play */
          });
        } else {
          video.pause();
          video.currentTime = 0;
          setShowPoster(true);
        }
      },
      { threshold: 0.4 },
    );

    video.addEventListener("playing", onPlaying);
    observer.observe(section);
    return () => {
      video.removeEventListener("playing", onPlaying);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-cream px-5 py-12 md:px-12 md:py-16"
    >
      <div className="mx-auto w-full max-w-sm md:max-w-md lg:max-w-lg">
        <div className="relative aspect-[9/16] overflow-hidden rounded-2xl border border-gray-100 bg-navy shadow-sm">
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            muted
            playsInline
            controls
            preload="none"
            poster={FOUNDER_VIDEO_POSTER}
          >
            <source src="/videos/founder_intro.mp4" type="video/mp4" />
          </video>
          {showPoster && (
            <Image
              src={FOUNDER_VIDEO_POSTER}
              alt="Zivlo founder introduction"
              fill
              className="pointer-events-none object-cover"
              sizes="(max-width: 768px) 100vw, 448px"
              priority
            />
          )}
        </div>
      </div>
    </section>
  );
}
export default function HomePage() {
  const router = useRouter();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) setIsLoggedIn(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDashboard = () => {
    router.push("/dashboard");
  };

  const handleSearch = () => {
    router.push("/search");
  };

  const handleCopyPitch = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_LEAD.pitch);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Sticky nav */}
      <header className="fixed top-0 left-0 right-0 z-50 flex justify-center">
        <div
          className={`w-full px-4 pt-3 transition-all md:px-6 ${
            scrolled ? "max-w-3xl" : "max-w-5xl"
          }`}
        >
          <nav
            className={`flex items-center justify-between ${
              scrolled
                ? "rounded-full border border-gray-100 bg-white/95 px-4 py-2 shadow-sm backdrop-blur-md"
                : "bg-transparent px-1 py-2"
            }`}
          >
            <Link href="/" className="inline-flex shrink-0 items-center">
              <Logo
                className={scrolled ? "h-8 w-auto" : "h-15 w-auto drop-shadow-md"}
              />
            </Link>

            <div className="flex items-center gap-2 md:gap-3">
              {isLoggedIn ? (
                <button
                  type="button"
                  onClick={handleDashboard}
                  className={`rounded-full px-4 py-2 text-xs font-medium md:text-sm ${
                    scrolled
                      ? "bg-navy text-white"
                      : "border border-white/20 bg-white/10 text-white backdrop-blur-sm"
                  }`}
                >
                  Dashboard
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-3 py-2 text-xs font-medium md:text-sm ${
                      scrolled
                        ? "text-navy"
                        : "text-white/90 drop-shadow-sm"
                    }`}
                  >
                    Log in
                  </Link>
                  <Link
                    href="/search"
                    className={`rounded-full px-4 py-2 text-xs font-medium md:text-sm ${
                      scrolled
                        ? "bg-navy text-white"
                        : "border border-white/20 bg-white/10 text-white backdrop-blur-sm"
                    }`}
                  >
                    Try free
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </header>

      {/* Hero — city background, no price */}
      <section className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden text-center">
        <Image
          src="/images/hero-city.jpg"
          alt="London cityscape at dusk"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-transparent"
          aria-hidden
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-[150px]"
          style={{
            background: "linear-gradient(to bottom, transparent, #F8F9FA)",
          }}
          aria-hidden
        />

        <div className="relative z-10 mx-auto max-w-xl px-6 pt-16">
          <span className="hero-fade-in mb-8 inline-block rounded-full border border-white/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.2em] text-white/80 backdrop-blur-md md:text-xs">
            Built for UK B2B businesses
          </span>

          <h1
            className="hero-fade-in-delay-1 font-serif text-4xl font-semibold leading-[1.15] tracking-tight text-white md:text-5xl lg:text-6xl"
            style={{ textShadow: "0 2px 20px rgba(0,0,0,0.3)" }}
          >
            Stop prospecting.
            <br />
            Start closing.
          </h1>

          <p
            className="hero-fade-in-delay-2 mt-3 font-serif text-xl italic text-gold md:text-2xl"
            style={{ textShadow: "0 1px 10px rgba(0,0,0,0.3)" }}
          >
            Win your next client.
          </p>

          <p
            className="hero-fade-in-delay-3 mt-6 text-sm font-light leading-relaxed tracking-wide text-white/85 md:text-base"
            style={{ textShadow: "0 1px 8px rgba(0,0,0,0.4)" }}
          >
            Zivlo finds UK businesses that fit your service — and writes a
            personalised pitch for each one.
          </p>

          <button
            onClick={isLoggedIn ? handleDashboard : handleSearch}
            className="hero-fade-in-delay-4 mt-8 rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-navy shadow-lg transition-transform active:scale-95"
          >
            {isLoggedIn
              ? "Go to Dashboard"
              : "Try one free search — no signup needed"}
          </button>

          <div className="hero-fade-in-delay-4 mt-4 space-y-1.5">
            <p className="text-xs tracking-wide text-white/50">
              See real UK leads in 60 seconds.
            </p>
            <p className="text-[10px] tracking-wide text-white/40">
              Subscribe to unlock director names, full pitches, and unlimited
              searches.
            </p>
          </div>
        </div>
      </section>

      <FounderVideo />

      {/* Feature quote + office image */}
      <section className="bg-cream">
        <div className="px-5 py-16 text-center md:px-12 md:py-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-serif text-2xl font-semibold leading-snug text-navy md:text-3xl">
              You didn&apos;t start a business to spend your weekends prospecting.
            </h2>
          </div>
        </div>
        <div className="relative h-[55vh] min-h-[380px] w-full md:h-[62vh] md:min-h-[460px]">
          <Image
            src="/images/professional-office.jpg"
            alt="Modern office with city view"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="px-5 py-12 md:px-12">
          <div className="mx-auto max-w-2xl">
            <p className="text-sm font-light leading-relaxed tracking-wide text-[#666] md:text-base">
              Hunting Google Maps. Copying business names into spreadsheets.
              Searching LinkedIn for the owner. Writing the same generic email 50
              times. Most of it leads nowhere — and every hour you spend
              prospecting is an hour you&apos;re not doing the work you actually do.
            </p>
            <p className="mt-4 text-sm font-medium leading-relaxed tracking-wide text-navy md:text-base">
              Zivlo gives you that hour back.
            </p>
          </div>
        </div>
      </section>

      {/* How it works — 3 cards */}
      <section className="bg-cream px-5 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-serif text-3xl font-semibold text-navy">
              How Zivlo works
            </h2>
            <p className="mt-3 text-sm font-light text-[#666] md:text-base">
              From idea to outreach in under 60 seconds.
            </p>
          </div>
          <div className="no-scrollbar -mx-5 flex snap-x-mandatory gap-4 overflow-x-auto px-5 pb-4 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
            {[
              {
                num: "1",
                icon: Search,
                title: "Pick a niche to target",
                text: 'Type the business type you want as a client and a UK location. For example: "Estate agents in Brighton" or "Solicitors in Manchester".',
              },
              {
                num: "2",
                icon: ClipboardList,
                title: "Get sourced from Companies House UK leads",
                text: "Zivlo pulls live UK business data — name, phone, website, director name — all sourced from Companies House.",
              },
              {
                num: "3",
                icon: Send,
                title: "Send the perfect pitch",
                text: "Each lead comes with a personalised pitch, written from a professional's perspective. Copy, send from your own email, win the client.",
              },
            ].map((step) => (
              <div
                key={step.num}
                className="min-w-[280px] snap-start rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:min-w-0"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-navy text-sm font-semibold text-gold">
                    {step.num}
                  </span>
                  <step.icon className="h-5 w-5 text-gray-300" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-navy">
                  {step.title}
                </h3>
                <p className="text-sm font-light leading-relaxed text-[#666]">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead demo card */}
      <section className="bg-cream px-5 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-lg">
          <div className="mb-8 text-center">
            <span className="inline-block rounded-full border border-gold px-4 py-1 text-[10px] font-medium uppercase tracking-[0.15em] text-gold">
              Example
            </span>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-navy">
              This is what you&apos;ll get
            </h2>
            <p className="mt-3 text-sm font-light text-[#666]">
              Real lead. Real contact details. Real pitch — written for you, as
              a professional.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-navy shadow-xl">
            <div className="border-b border-white/10 p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-serif text-lg font-semibold text-white">
                    {DEMO_LEAD.companyName}
                  </h3>
                  <p className="mt-0.5 text-sm text-white/60">
                    {DEMO_LEAD.businessType} · {DEMO_LEAD.location}
                  </p>
                </div>
                <span className="text-xs text-white/40">
                  Inc. {DEMO_LEAD.incorporationYear}
                </span>
              </div>
            </div>

            <div className="space-y-3 p-5">
              <div className="flex items-center gap-3 text-sm">
                <Phone className="h-4 w-4 shrink-0 text-gold" />
                <span className="text-white/80">{DEMO_LEAD.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Globe className="h-4 w-4 shrink-0 text-gold" />
                <span className="text-white/80">{DEMO_LEAD.website}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <User className="h-4 w-4 shrink-0 text-gold" />
                <span className="text-white/80">
                  {DEMO_LEAD.directorName} · {DEMO_LEAD.directorRole}
                </span>
              </div>

              <div className="mt-4 border-t border-white/10 pt-4">
                <p className="mb-2 text-[10px] uppercase tracking-[0.15em] text-white/40">
                  Personalised pitch
                </p>
                <p className="text-sm font-light italic leading-relaxed text-white/85">
                  &ldquo;{DEMO_LEAD.pitch}&rdquo;
                </p>
              </div>
            </div>

            <div className="p-4 pt-0">
              <button
                type="button"
                onClick={handleCopyPitch}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-sm font-medium text-white transition-all hover:bg-white/15 active:scale-95"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy message
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dark features — navy bg (no dark-wave.jpg) */}
      <section className="bg-navy">
        <div className="mx-auto max-w-2xl px-5 pb-20 pt-16 md:px-12">
          <h2 className="text-center font-serif text-3xl font-semibold text-white">
            Every lead, fully briefed
          </h2>
          <p className="mb-10 mt-3 text-center text-sm font-light text-white/50">
            No half-information. Everything you need to reach out with
            confidence.
          </p>

          <div className="space-y-6">
            {[
              {
                icon: Check,
                title: "Business name",
                desc: "Real, sourced from Companies House UK limited companies — never sole traders, never made up.",
              },
              {
                icon: Phone,
                title: "Phone number",
                desc: "Direct line where available, pulled from live data.",
              },
              {
                icon: Globe,
                title: "Website",
                desc: "Quick reference so you can size up their current site before pitching.",
              },
              {
                icon: User,
                title: "Director name",
                desc: "Real human contact via Companies House — no guessing who to email.",
              },
              {
                icon: MessageSquare,
                title: "Personalised pitch",
                desc: "A pitch that mentions their business — written for you.",
              },
              {
                icon: Calendar,
                title: "Extra data",
                desc: "Incorporation date, Google rating, website status — facts you can act on.",
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4">
                <item.icon className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                <div>
                  <h4 className="text-sm font-medium text-white">
                    {item.title}
                  </h4>
                  <p className="mt-0.5 text-sm font-light leading-relaxed text-white/50">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing — soft, no upfront price push */}
      <section className="bg-cream px-5 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-md">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-3xl font-semibold text-navy">
              One simple price
            </h2>
            <p className="mt-2 text-sm font-light text-[#666]">
              Win one client and Zivlo pays for itself for years.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm">
            <p className="mb-6 text-center text-sm font-light text-[#666]">
              Everything included when you subscribe. Cancel anytime.
            </p>
            <div className="space-y-3">
              {[
                "Up to 5 searches per day",
                "Up to 10 leads per search",
                "Personalised pitch per lead",
                "UK limited companies only (filters sole traders)",
                "Search history saved",
                "Cancel anytime",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check className="h-4 w-4 shrink-0 text-gold" />
                  <span className="text-sm font-light text-navy">{item}</span>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={isLoggedIn ? handleDashboard : handleSearch}
              className="mt-8 w-full rounded-full bg-gold py-4 text-sm font-medium text-navy shadow-md transition-transform active:scale-95"
            >
              {isLoggedIn ? "Go to Dashboard" : "Try one free search"}
            </button>
            <p className="mt-3 text-center text-xs font-light text-[#999]">
              No signup required to start. See pricing in FAQ.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ — 6 questions */}
      <section className="bg-cream px-5 py-16 md:px-12 md:py-20">
        <div className="mx-auto max-w-2xl">
          <h2 className="mb-10 text-center font-serif text-3xl font-semibold text-navy">
            Common questions
          </h2>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <div
                key={item.q}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="flex w-full items-center justify-between p-4 text-left transition-colors active:bg-gray-50"
                >
                  <span className="pr-4 text-sm font-medium text-navy">
                    {item.q}
                  </span>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-gray-400 transition-transform"
                    style={{
                      transform: openFaq === i ? "rotate(180deg)" : "rotate(0)",
                    }}
                  />
                </button>
                {openFaq === i && (
                  <p className="px-4 pb-4 text-sm font-light leading-relaxed text-[#666]">
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA → /search */}
      <footer className="bg-navy px-5 py-16 text-center md:px-12 md:py-20">
        <div className="mx-auto max-w-xl">
          <h2 className="font-serif text-3xl font-semibold text-white">
            Stop chasing.
          </h2>
          <p className="mt-1 font-serif text-3xl font-semibold italic text-gold">
            Start closing.
          </p>
          <p className="mt-4 text-sm font-light text-white/60">
            Your next client is out there. Zivlo finds them.
          </p>

          <button
            type="button"
            onClick={isLoggedIn ? handleDashboard : handleSearch}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-sm font-medium text-navy transition-transform active:scale-95"
          >
            Try one free search
            <Send className="h-4 w-4" />
          </button>
          <p className="mt-3 text-xs font-light tracking-wide text-white/40">
            No signup required. See real UK leads in 60 seconds.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl border-t border-white/10 pt-8">
          <div className="flex flex-col items-center justify-center gap-4 text-xs font-light text-white/40 md:flex-row md:gap-6">
            <Link href="/privacy-policy" className="transition-colors hover:text-white/60">
              Privacy
            </Link>
            <Link href="/terms-conditions" className="transition-colors hover:text-white/60">
              Terms of Service
            </Link>
          </div>
          <p className="mt-4 text-xs font-light text-white/30">
            © {new Date().getFullYear()} Zivlo. Operated by Dare to Accept Limited.
          </p>
        </div>
      </footer>
    </div>
  );
}