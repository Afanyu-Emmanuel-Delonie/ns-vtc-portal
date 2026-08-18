import {
  getDashboardStats,
  getCalendarEvents,
  getUpcomingDeadlines,
  getFunnelData,
  getTradeBreakdown,
} from "@/lib/queries/stats";
import { KpiBox } from "@/components/dashboard/KpiBox";
import { FunnelChart } from "@/components/dashboard/FunnelChart";
import { TradeBreakdownTable } from "@/components/dashboard/TradeBreakdownTable";
import { ActionCalendar } from "@/components/dashboard/ActionCalendar";
import { UpcomingDeadlines } from "@/components/dashboard/UpcomingDeadlines";

export default async function DashboardPage() {
  const [stats, calendarEvents, deadlines, funnelSteps, tradeRows] = await Promise.all([
    getDashboardStats(),
    getCalendarEvents(),
    getUpcomingDeadlines(),
    getFunnelData(),
    getTradeBreakdown(),
  ]);

  return (
    <div className="grid gap-6">
      {/* Page heading */}
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.22em] text-slate">Dashboard</p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight">Recruitment overview</h1>
      </div>

      {/* KPI strip */}
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        <KpiBox label="Open Listings" value={stats.openListings} />
        <KpiBox label="Total Applications" value={stats.totalApplications} />
        <KpiBox label="In Pipeline" value={stats.inPipeline} />
        <KpiBox label="Hired" value={stats.hired} />
        <KpiBox label="Overdue Follow-ups" value={stats.overdueFollowUps} alert />
      </div>

      {/* Main two-column layout */}
      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        {/* Left — analytics */}
        <div className="grid gap-6">
          <FunnelChart steps={funnelSteps} />
          <TradeBreakdownTable rows={tradeRows} />
        </div>

        {/* Right — action layer */}
        <div className="grid gap-6 self-start">
          <ActionCalendar events={calendarEvents} />
          <UpcomingDeadlines deadlines={deadlines} />
        </div>
      </div>
    </div>
  );
}
