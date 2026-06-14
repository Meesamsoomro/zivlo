/**
 * Browser fingerprint for the free-trial gate.
 *
 * The fingerprint is derived from stable device/browser signals and hashed,
 * so it stays the same even after the visitor clears cookies AND localStorage.
 * That's what stops a visitor resetting their single free search by wiping
 * storage. A computed value is cached in localStorage only as a speed-up; if
 * it's missing the same hash is recomputed deterministically.
 */

const FP_CACHE_KEY = "zivlo_fp";

function canvasSignal(): string {
  try {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return "no-canvas";
    ctx.textBaseline = "top";
    ctx.font = "14px 'Arial'";
    ctx.fillStyle = "#f60";
    ctx.fillRect(125, 1, 62, 20);
    ctx.fillStyle = "#069";
    ctx.fillText("zivlo-fp", 2, 15);
    ctx.fillStyle = "rgba(102, 204, 0, 0.7)";
    ctx.fillText("zivlo-fp", 4, 17);
    return canvas.toDataURL();
  } catch {
    return "no-canvas";
  }
}

function collectSignals(): string {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const parts = [
    nav.userAgent,
    nav.language,
    (nav.languages || []).join(","),
    nav.platform,
    String(nav.hardwareConcurrency ?? ""),
    String(nav.deviceMemory ?? ""),
    `${screen.width}x${screen.height}x${screen.colorDepth}`,
    String(new Date().getTimezoneOffset()),
    Intl.DateTimeFormat().resolvedOptions().timeZone || "",
    canvasSignal(),
  ];
  return parts.join("|");
}

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Non-crypto fallback hash for environments without crypto.subtle.
function fallbackHash(input: string): string {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (Math.imul(31, h) + input.charCodeAt(i)) | 0;
  }
  return `fb_${(h >>> 0).toString(16)}`;
}

export async function getFingerprint(): Promise<string> {
  if (typeof window === "undefined") return "";

  try {
    const cached = localStorage.getItem(FP_CACHE_KEY);
    if (cached) return cached;
  } catch {
    /* localStorage blocked — recompute below */
  }

  const signals = collectSignals();
  let fp: string;
  try {
    fp = `fp_${(await sha256(signals)).slice(0, 32)}`;
  } catch {
    fp = fallbackHash(signals);
  }

  try {
    localStorage.setItem(FP_CACHE_KEY, fp);
  } catch {
    /* ignore — value is deterministic and can be recomputed */
  }

  return fp;
}
