export type AppRole = "buyer" | "seller" | "admin" | "super";

export type DemoSession = {
  id: string;
  email: string;
  display_name: string;
  role: AppRole;
  created_at: string;
};

const DEMO_SESSION_KEY = "demo_auth_session";
const DEMO_PROFILE_KEY = "demo_profiles_store";
const DEMO_ADS_KEY = "demo_ads";

const hasStorage = typeof window !== "undefined" && typeof window.localStorage !== "undefined";

function readFromStorage<T>(key: string): T | null {
  if (!hasStorage) return null;
  try {
    return JSON.parse(window.localStorage.getItem(key) ?? "null") as T | null;
  } catch {
    return null;
  }
}

function writeToStorage(key: string, value: unknown) {
  if (!hasStorage) return;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function createDemoId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `demo-${crypto.randomUUID()}`;
  }
  return `demo-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getDisplayNameFromEmail(email: string) {
  const userName = email.split("@")[0] || "User";
  return userName.replace(/[-_.\d]+/g, " ").replace(/\s+/g, " ").trim() || "User";
}

export function createDemoSession(email: string, displayName: string, role: AppRole): DemoSession {
  return {
    id: createDemoId(),
    email,
    display_name: displayName.trim() || getDisplayNameFromEmail(email),
    role,
    created_at: new Date().toISOString(),
  };
}

export function saveDemoSession(session: DemoSession) {
  writeToStorage(DEMO_SESSION_KEY, session);
}

export function loadDemoSession(): DemoSession | null {
  return readFromStorage<DemoSession>(DEMO_SESSION_KEY);
}

export function clearDemoSession() {
  if (!hasStorage) return;
  window.localStorage.removeItem(DEMO_SESSION_KEY);
}

export function isDemoUserId(userId: string | null | undefined) {
  return typeof userId === "string" && userId.startsWith("demo-");
}

export function loadDemoProfile(userId: string) {
  const profiles = readFromStorage<Record<string, any>>(DEMO_PROFILE_KEY) ?? {};
  return profiles[userId] ?? null;
}

export function saveDemoProfile(userId: string, profile: Record<string, any>) {
  const profiles = readFromStorage<Record<string, any>>(DEMO_PROFILE_KEY) ?? {};
  profiles[userId] = { ...profiles[userId], ...profile };
  writeToStorage(DEMO_PROFILE_KEY, profiles);
}

export function loadDemoAds() {
  return readFromStorage<any[]>(DEMO_ADS_KEY) ?? [];
}

export function saveDemoAds(ads: any[]) {
  writeToStorage(DEMO_ADS_KEY, ads);
}

export function addDemoAd(ad: any) {
  const existing = loadDemoAds();
  existing.unshift(ad);
  saveDemoAds(existing);
}

export function isDemoSession(session: any): session is DemoSession {
  return session?.id?.toString().startsWith("demo-");
}
