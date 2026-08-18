import type { DashboardStats } from "@/lib/types";
import { mockStore } from "@/lib/mock-data";

const PIPELINE_STAGES = ["Screening", "Under Review", "Shortlisted", "Interview"] as const;

export async function getDashboardStats(): Promise<DashboardStats> {
  const listings = mockStore.listListings();
  const applications = mockStore.listApplications();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return {
    openListings: listings.filter((l) => l.status === "Open").length,
    totalApplications: applications.length,
    inPipeline: applications.filter((a) => (PIPELINE_STAGES as readonly string[]).includes(a.stage)).length,
    hired: applications.filter((a) => a.stage === "Hired").length,
    overdueFollowUps: applications.filter((a) => {
      if (!a.nextFollowUpDate) return false;
      return new Date(a.nextFollowUpDate) < today;
    }).length,
  };
}

export interface CalendarEvent {
  date: string; // ISO date string YYYY-MM-DD
  applicationId: string;
  candidateName: string;
  listingTitle: string;
  type: "interview" | "followup" | "deadline";
  state: "needs-action" | "upcoming" | "scheduled";
}

export async function getCalendarEvents(): Promise<CalendarEvent[]> {
  const applications = mockStore.listApplications();
  const listings = mockStore.listListings();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in7 = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const events: CalendarEvent[] = [];

  for (const app of applications) {
    const listing = listings.find((l) => l.id === app.listingId);
    const title = listing?.title ?? app.trade;

    if (app.interviewDate) {
      const d = new Date(app.interviewDate);
      d.setHours(0, 0, 0, 0);
      const dateStr = d.toISOString().slice(0, 10);
      let state: CalendarEvent["state"] = "scheduled";
      if (d < today) state = "needs-action"; // past interview, no outcome logged if still in Interview
      else if (d <= in7) state = "upcoming";
      events.push({ date: dateStr, applicationId: app.id, candidateName: app.candidateName, listingTitle: title, type: "interview", state });
    }

    if (app.nextFollowUpDate) {
      const d = new Date(app.nextFollowUpDate);
      d.setHours(0, 0, 0, 0);
      const dateStr = d.toISOString().slice(0, 10);
      let state: CalendarEvent["state"] = "scheduled";
      if (d < today) state = "needs-action";
      else if (d <= in7) state = "upcoming";
      events.push({ date: dateStr, applicationId: app.id, candidateName: app.candidateName, listingTitle: title, type: "followup", state });
    }
  }

  for (const listing of listings) {
    if (!listing.applicationDeadline || listing.status !== "Open") continue;
    const d = new Date(listing.applicationDeadline);
    d.setHours(0, 0, 0, 0);
    const dateStr = d.toISOString().slice(0, 10);
    let state: CalendarEvent["state"] = "scheduled";
    if (d < today) state = "needs-action";
    else if (d <= in7) state = "upcoming";
    events.push({ date: dateStr, applicationId: listing.id, candidateName: "", listingTitle: listing.title, type: "deadline", state });
  }

  return events;
}

export interface DeadlineListing {
  id: string;
  title: string;
  trade: string;
  applicationDeadline: string;
  applicants: number;
  daysLeft: number;
}

export async function getUpcomingDeadlines(): Promise<DeadlineListing[]> {
  const listings = mockStore.listListings();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const in14 = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);

  return listings
    .filter((l) => l.status === "Open" && l.applicationDeadline)
    .map((l) => {
      const d = new Date(l.applicationDeadline!);
      d.setHours(0, 0, 0, 0);
      return { id: l.id, title: l.title, trade: l.trade, applicationDeadline: l.applicationDeadline!, applicants: l.applicants, daysLeft: Math.round((d.getTime() - today.getTime()) / 86400000) };
    })
    .filter((l) => new Date(l.applicationDeadline) <= in14)
    .sort((a, b) => a.daysLeft - b.daysLeft);
}

export interface FunnelStep {
  label: string;
  value: number;
}

export async function getFunnelData(): Promise<FunnelStep[]> {
  const applications = mockStore.listApplications();
  const stages = ["New", "Screening", "Under Review", "Shortlisted", "Interview", "Offer", "Hired"];
  return stages.map((s) => ({ label: s, value: applications.filter((a) => a.stage === s).length }));
}

export interface TradeRow {
  trade: string;
  applications: number;
  hired: number;
}

export async function getTradeBreakdown(): Promise<TradeRow[]> {
  const applications = mockStore.listApplications();
  const map = new Map<string, TradeRow>();
  for (const a of applications) {
    const row = map.get(a.trade) ?? { trade: a.trade, applications: 0, hired: 0 };
    row.applications++;
    if (a.stage === "Hired") row.hired++;
    map.set(a.trade, row);
  }
  return [...map.values()].sort((a, b) => b.applications - a.applications);
}

export interface MonthlyPoint {
  month: string; // e.g. "Jan", "Feb"
  applications: number;
  hired: number;
}

export interface ReportData {
  stats: DashboardStats;
  funnel: FunnelStep[];
  trades: TradeRow[];
  monthly: MonthlyPoint[];
  conversionRate: number; // hired / total %
  avgTimeToHire: number; // days (mock)
  topTrade: string;
}

export async function getReportData(): Promise<ReportData> {
  const applications = mockStore.listApplications();
  const listings = mockStore.listListings();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const stats: DashboardStats = {
    openListings: listings.filter((l) => l.status === "Open").length,
    totalApplications: applications.length,
    inPipeline: applications.filter((a) =>
      (["Screening", "Under Review", "Shortlisted", "Interview"] as string[]).includes(a.stage),
    ).length,
    hired: applications.filter((a) => a.stage === "Hired").length,
    overdueFollowUps: applications.filter((a) => {
      if (!a.nextFollowUpDate) return false;
      return new Date(a.nextFollowUpDate) < today;
    }).length,
  };

  const funnel = await getFunnelData();
  const trades = await getTradeBreakdown();

  // Build last 6 months buckets
  const monthly: MonthlyPoint[] = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth() - (5 - i), 1);
    return {
      month: d.toLocaleString("default", { month: "short" }),
      applications: 0,
      hired: 0,
    };
  });

  for (const app of applications) {
    const d = new Date(app.appliedAt);
    const monthIdx = monthly.findIndex(
      (m) => m.month === d.toLocaleString("default", { month: "short" }),
    );
    if (monthIdx !== -1) {
      monthly[monthIdx].applications++;
      if (app.stage === "Hired") monthly[monthIdx].hired++;
    }
  }

  const conversionRate =
    stats.totalApplications > 0
      ? Math.round((stats.hired / stats.totalApplications) * 100)
      : 0;

  const topTrade =
    trades.length > 0 ? trades.sort((a, b) => b.applications - a.applications)[0].trade : "—";

  return {
    stats,
    funnel,
    trades,
    monthly,
    conversionRate,
    avgTimeToHire: 18, // mock static value
    topTrade,
  };
}
