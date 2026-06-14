/**
 * ─────────────────────────────────────────────────────────────────────────
 *  SEARCH / RESULTS API CONTRACT  (Senior → Mid)
 * ─────────────────────────────────────────────────────────────────────────
 *
 *  Endpoint:  GET /api/search?businessType=<X>&location=<Y>
 *
 *  Auth & modes
 *  ------------
 *  • FREE MODE (anonymous visitor):
 *      - Add `&free=true` and send the browser fingerprint header
 *        `x-zivlo-fp: <fp>` (also accepted as `&fp=<fp>` query param).
 *      - Returns up to 5 leads with restricted data (see below).
 *      - One free search per device. A used device gets HTTP 403:
 *          { "error": "...", "trialUsed": true }
 *
 *  • SUBSCRIBED MODE (logged-in, active subscription):
 *      - Send `Authorization: Bearer <jwt>` (no `free=true`).
 *      - Returns up to 10 leads with FULL data.
 *
 *  Free vs Subscribed field differences
 *  ------------------------------------
 *   field            | free mode            | subscribed mode
 *   -----------------|----------------------|--------------------------
 *   results.length   | up to 5              | up to 10
 *   director         | "" (empty)           | "James Whitford"
 *   directorLocked   | true                 | false
 *   message / pitch  | 2-sentence preview   | full pitch
 *   pitchTruncated   | true                 | false
 *   freeMode (top)   | true                 | false
 *   directorVisible  | false                | true
 *
 *  Greeting: every pitch always opens with the director's first name
 *  ("Hi James — ..."), never the company / location / business type.
 *  When no director is known it falls back to "Hi there — ...".
 *
 *  UI guidance for the results page
 *  --------------------------------
 *   • Use `directorLocked` (per lead) to decide whether to show the name
 *     or a "Director on file — subscribe to view" lock.
 *   • Use `pitchTruncated` (per lead) to decide whether to show the
 *     "subscribe to unlock full pitch" treatment.
 *   • `message` and `personalisedPitch` are identical — use either.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface SearchLead {
  /** Companies House company number (stable id). */
  id: string;
  /** Friendly business name (suffixes like "Ltd" stripped). */
  name: string;
  /** Same as `name` — kept for convenience. */
  businessName: string;
  /** Business type, title-cased (e.g. "Solicitors"). */
  type: string;
  /** UK location as searched (e.g. "London"). */
  location: string;
  phone: string;
  /** Bare domain, e.g. "wilsonlaw.co.uk". */
  website: string;
  /** Derived contact email, e.g. "info@wilsonlaw.co.uk". */
  email: string;
  /** Full director name, or "" when hidden (free mode). */
  director: string;
  /** true ⇒ director hidden (free mode). */
  directorLocked: boolean;
  /** Incorporation year, e.g. "2009". */
  incorporated: string;
  /** e.g. "4.8 (427 reviews)". */
  googleRating: string;
  websiteStatus: string;
  /** e.g. "Active limited company". */
  companyStatus: string;
  /** Personalised pitch (2-sentence preview in free mode). */
  message: string;
  /** Identical to `message`. */
  personalisedPitch: string;
  /** true ⇒ pitch is a truncated preview (free mode). */
  pitchTruncated: boolean;
}

export interface SearchResponse {
  success: boolean;
  /** true ⇒ anonymous free-trial response (restricted data). */
  freeMode: boolean;
  /** Convenience inverse of `freeMode` — director names are present. */
  directorVisible: boolean;
  results: SearchLead[];
  /** Present on error responses. */
  error?: string;
  /** Present (true) on the 403 "free search already used" response. */
  trialUsed?: boolean;
}
