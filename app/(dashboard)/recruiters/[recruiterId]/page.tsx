import { notFound } from "next/navigation";
import { Mail, Briefcase, Users, TrendingUp } from "lucide-react";
import { getRecruiter } from "@/lib/queries/recruiters";
import { BackButton } from "@/components/ui/BackButton";
import { Card } from "@/components/ui/Card";

export default async function RecruiterDetailPage({
  params,
}: {
  params: Promise<{ recruiterId: string }>;
}) {
  const { recruiterId } = await params;
  const recruiter = await getRecruiter(recruiterId);
  if (!recruiter) notFound();

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <BackButton />
        <div className="mt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Recruiter</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{recruiter.name}</h1>
          <p className="mt-1 text-sm text-slate">{recruiter.role}</p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={<Briefcase size={18} />} label="Workload" value={recruiter.workload} />
        <StatCard icon={<Users size={18} />} label="Active applications" value={recruiter.activeApplications} />
        <StatCard icon={<TrendingUp size={18} />} label="Placed candidates" value={recruiter.placedCandidates} />
      </div>

      <Card className="max-w-lg">
        <h2 className="mb-4 text-base font-semibold">Contact</h2>
        <div className="flex items-center gap-2">
          <Mail size={15} className="shrink-0 text-slate" />
          <a href={`mailto:${recruiter.email}`} className="text-sm font-medium text-navy hover:underline">
            {recruiter.email}
          </a>
        </div>
      </Card>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <Card className="flex items-center gap-4">
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-navy/8 text-navy">
        {icon}
      </span>
      <div>
        <p className="text-xs text-slate">{label}</p>
        <p className="font-heading text-2xl font-bold tabular-nums">{value}</p>
      </div>
    </Card>
  );
}
