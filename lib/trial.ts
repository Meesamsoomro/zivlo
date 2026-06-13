/** Free trial state — localStorage until Senior wires API flags */

const TRIAL_KEY = "zivlo_trial";
const FREE_SEARCH_LIMIT = 1;

export interface TrialState {
  freeSearchesUsed: number;
}

function readTrialState(): TrialState {
  if (typeof window === "undefined") return { freeSearchesUsed: 0 };
  try {
    const raw = localStorage.getItem(TRIAL_KEY);
    if (!raw) return { freeSearchesUsed: 0 };
    return JSON.parse(raw) as TrialState;
  } catch {
    return { freeSearchesUsed: 0 };
  }
}

export function getTrialState(): TrialState {
  return readTrialState();
}

export function recordFreeSearch(): void {
  const trial = readTrialState();
  trial.freeSearchesUsed += 1;
  localStorage.setItem(TRIAL_KEY, JSON.stringify(trial));
}

export function hasUsedFreeSearch(): boolean {
  return readTrialState().freeSearchesUsed >= FREE_SEARCH_LIMIT;
}

export function canRunFreeSearch(): boolean {
  return readTrialState().freeSearchesUsed < FREE_SEARCH_LIMIT;
}

export function isUserSubscribed(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return false;
    const user = JSON.parse(userData);
    return user.is_subscribed === true;
  } catch {
    return false;
  }
}

export function getRemainingDailySearches(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const subData = localStorage.getItem("subscription");
    if (!subData) return null;
    const sub = JSON.parse(subData);
    if (sub.per_day === undefined || sub.per_day === null) return null;
    return Math.max(0, Number(sub.per_day));
  } catch {
    return null;
  }
}

export function isInFreeMode(): boolean {
  return hasUsedFreeSearch() && !isUserSubscribed();
}

export function truncatePitch(pitch: string, maxLength = 140): string {
  if (!pitch) return "";
  if (pitch.length <= maxLength) return pitch;
  return `${pitch.slice(0, maxLength).trim()}…`;
}

export function getUserFirstName(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const userData = localStorage.getItem("user");
    if (!userData) return null;
    const user = JSON.parse(userData);
    const name = user.sender_name || user.email?.split("@")[0];
    if (!name || typeof name !== "string") return null;
    return name.split(" ")[0];
  } catch {
    return null;
  }
}
