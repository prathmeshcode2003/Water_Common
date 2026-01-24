"use server";

/* ============================================================
   Imports
============================================================ */

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import type {
  WaterCitizenCandidate,
  CitizenAuthSession,
  WaterCitizenLandingData,
  CitizenLookupKind,
  WaterConnectionSummary,
} from "@/types/water-tax.types";

import { searchConsumer } from "@/services/waterConsumerService";

// import { fetchConsumersByMobile, fetchConsumerData } from "@/lib/api/consumerApi";

/* ============================================================
   Constants & Helpers
============================================================ */

const SESSION_COOKIE = "wt_citizen_session_id";

const sessions = new Map<string, CitizenAuthSession>();

function nowIso() {
  return new Date().toISOString();
}

function addMinutesIso(minutes: number) {
  return new Date(Date.now() + minutes * 60_000).toISOString();
}

function isMobileLike(q: string) {
  const digits = q.replace(/\D/g, "");
  return digits.length >= 10;
}

function detectLookupKind(query: string): CitizenLookupKind {
  const q = query.trim();
  if (!q) return "unknown";
  if (isMobileLike(q)) return "mobile";
  if (/^cns[-\s]?\d+/i.test(q)) return "consumerNo";
  if (/^prop[-\s]?\d+/i.test(q)) return "propertyNo";
  if (q.length >= 3) return "name";
  return "unknown";
}

function maskTarget(query: string, kind: CitizenLookupKind): string {
  if (kind === "mobile") {
    const digits = query.replace(/\D/g, "");
    const last2 = digits.slice(-2);
    return `${digits.slice(0, 2)}XXXXXX${last2}`;
  }
  return "your registered contact";
}

async function getSessionIdFromCookie(): Promise<string | null> {
  const store = await cookies();
  return store.get(SESSION_COOKIE)?.value ?? null;
}

/* ============================================================
   API Fetch (kept as-is)
============================================================ */

async function fetchConnectionsFromApi(
  query: string,
  kind: CitizenLookupKind
): Promise<WaterConnectionSummary[]> {
  try {
    // const result = await fetchConsumerData(query);
    // if (result?.error) return [];
    // return result?.data ?? [];
    return [];
  } catch {
    return [];
  }
}

/* ============================================================
   Landing Page Data
============================================================ */

export async function getCitizenLandingData(): Promise<WaterCitizenLandingData> {
  return {
    branding: {
      corporationName: "Municipal Corporation",
      portalName: "AquaFlow Portal",
      versionTag: "v2.0 Aqua",
      systemStatus: "Aqua",
    },
    heroKicker: "Next-Gen Water Management System",
    heroTitleLine1: "Transform Your",
    heroTitleAccent: "Water Services",
    heroTitleLine3: "Experience",
    heroDescription:
      "Seamlessly manage water connections, pay bills instantly, and track everything in real-time.",
    stats: [
      { label: "Citizens Served", value: "50,000+", hint: "Registered users" },
      { label: "Connections", value: "2,000+", hint: "Active connections" },
      { label: "Avg Resolution", value: "2 Days", hint: "Grievances" },
      { label: "SLA Compliance", value: "5/5", hint: "Service rating" },
    ],
  };
}

/* ============================================================
   Session Helpers
============================================================ */

export async function getCitizenSession() {
  const sid = await getSessionIdFromCookie();
  if (!sid) return null;
  return sessions.get(sid) ?? null;
}

export async function clearCitizenSession(): Promise<void> {
  const sid = await getSessionIdFromCookie();
  if (sid) sessions.delete(sid);

  const store = await cookies();
  store.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });

  revalidatePath("/water-tax/citizen");
  redirect("/water-tax/citizen?view=login");
}

/* ============================================================
   OTP – SESSION BASED FLOW (UI ACTIONS)
============================================================ */

export async function sendOtpAction(formData: FormData): Promise<void> {
  const query = String(formData.get("query") ?? "").trim();
  if (!query) redirect("/water-tax/citizen?view=login&err=missing");

  const lookupKind = detectLookupKind(query);

  const sessionId = String(Date.now());
  const otp = "123456";

  const session: CitizenAuthSession = {
    sessionId,
    lookupQuery: query,
    lookupKind,
    otpTargetMasked: maskTarget(query, lookupKind),
    otp,
    otpExpiresAtIso: addMinutesIso(5),
    citizenId: undefined,
    connections: [],
  };

  sessions.set(sessionId, session);

  const store = await cookies();
  store.set(SESSION_COOKIE, sessionId, { path: "/", httpOnly: true });

  revalidatePath("/water-tax/citizen");
  redirect("/water-tax/citizen?view=otp");
}

export async function verifyOtpAction(formData: FormData): Promise<void> {
  const otp = String(formData.get("otp") ?? "").trim();

  const sid = await getSessionIdFromCookie();
  if (!sid) redirect("/water-tax/citizen?view=login&err=session");

  const session = sessions.get(sid);
  if (!session) redirect("/water-tax/citizen?view=login&err=session");

  if (new Date(session.otpExpiresAtIso).getTime() < Date.now()) {
    redirect("/water-tax/citizen?view=login&err=otp_expired");
  }

  if (otp !== session.otp) {
    redirect("/water-tax/citizen?view=otp&err=otp_invalid");
  }

  const connections = await fetchConnectionsFromApi(
    session.lookupQuery,
    session.lookupKind
  );

  if (!connections.length) {
    redirect("/water-tax/citizen?view=login&err=not_found");
  }

  const first = connections[0];
  session.citizenId = String(first.consumerID || first.consumerNumber);
  session.connections = connections;

  const requireSelection =
    session.lookupKind === "mobile" && connections.length > 1;

  if (requireSelection) {
    sessions.set(sid, session);
    redirect("/water-tax/citizen?view=select-property");
  }

  session.selectedConnectionId = String(
    first.consumerID || first.consumerNumber
  );
  sessions.set(sid, session);

  revalidatePath("/water-tax/citizen");
  redirect("/water-tax/citizen?view=dashboard");
}

/* ============================================================
   OTP – COOKIE BASED FLOW (API STYLE)
============================================================ */

export async function loginAction(query: string) {
  if (!query || query.trim().length < 3) {
    return { success: false, error: "Invalid input" };
  }

  const otp = "123456";
  const store = cookies();

  store.set("waterTaxOtp", otp, { maxAge: 300, path: "/" });
  store.set("waterTaxOtpQuery", query, { maxAge: 300, path: "/" });

  return { success: true, otpSent: true, query };
}

export async function verifyOtpApiCookie(query: string, otp: string) {
  const store = cookies();
  const storedOtp = store.get("waterTaxOtp")?.value;
  const storedQuery = store.get("waterTaxOtpQuery")?.value;

  if (!storedOtp || storedOtp !== otp || storedQuery !== query) {
    return { success: false, error: "Invalid OTP" };
  }

  store.set("waterTaxOtp", "", { maxAge: 0, path: "/" });
  store.set("waterTaxOtpQuery", "", { maxAge: 0, path: "/" });

  try {
    const data = await searchConsumer({ query });
    return { success: true, data };
  } catch {
    return { success: false, error: "Failed to fetch consumer data" };
  }
}

/* ============================================================
   Property Selection
============================================================ */

export async function selectPropertyAction(formData: FormData): Promise<void> {
  const connectionId = String(formData.get("connectionId") ?? "").trim();

  const sid = await getSessionIdFromCookie();
  if (!sid) redirect("/water-tax/citizen?view=login&err=session");

  const session = sessions.get(sid);
  if (!session) redirect("/water-tax/citizen?view=login&err=session");

  session.selectedConnectionId = connectionId;
  sessions.set(sid, session);

  revalidatePath("/water-tax/citizen");
  redirect("/water-tax/citizen?view=dashboard");
}

/* ============================================================
   Citizen Data Helpers
============================================================ */

export async function getCitizenCandidateForSession(): Promise<WaterCitizenCandidate | null> {
  const session = await getCitizenSession();
  if (!session?.citizenId) return null;

  const first = session.connections?.[0];
  if (!first) return null;

  return {
    citizenId: session.citizenId,
    displayName:
      first.consumerNameEnglish || first.consumerName || "Citizen",
    mobileMasked: session.otpTargetMasked,
    connections: session.connections,
  };
}

export async function getSelectedConnection(): Promise<WaterConnectionSummary | null> {
  const session = await getCitizenSession();
  if (!session?.selectedConnectionId) return null;

  return (
    session.connections?.find(
      (c) =>
        String(c.consumerID) === session.selectedConnectionId ||
        c.consumerNumber === session.selectedConnectionId
    ) ?? null
  );
}




