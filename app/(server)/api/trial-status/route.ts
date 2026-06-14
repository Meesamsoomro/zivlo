import { NextResponse } from "next/server";
import { getSupabaseClient } from "@/lib/auth";

const TRIAL_COOKIE = "zivlo_trial_used";

function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Returns whether this device has already used its single free search.
// Mirrors the search gate exactly (cookie OR fingerprint) so the frontend
// shows the correct state (free form vs paywall) on load — even after the
// visitor clears cookies/localStorage (the fingerprint still catches them).
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const fingerprint =
    req.headers.get("x-zivlo-fp") || searchParams.get("fp") || null;

  const cookieUsed = readCookie(req.headers.get("cookie"), TRIAL_COOKIE) === "1";

  let fingerprintUsed = false;
  if (fingerprint) {
    try {
      const supabase = getSupabaseClient();
      const { data } = await supabase
        .from("free_trials")
        .select("id")
        .eq("fingerprint", fingerprint)
        .maybeSingle();
      fingerprintUsed = !!data;
    } catch (err) {
      console.error("trial-status lookup failed:", err);
      // Fall back to the cookie result only.
    }
  }

  return NextResponse.json({ used: cookieUsed || fingerprintUsed });
}
