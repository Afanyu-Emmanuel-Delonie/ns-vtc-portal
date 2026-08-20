import { notFound } from "next/navigation";
import Link from "next/link";
import { Mail, Phone, MapPin, Briefcase, TrendingUp, Calendar } from "lucide-react";
import { getEmployer } from "@/lib/queries/recruiters";
import { getListings } from "@/lib/queries/listings";
import { BackButton } from "@/components/ui/BackButton";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ComplaintsPanel } from "@/components/recruiters/ComplaintsPanel";

export default async function EmployerDetailPage({
  params,
}: {
  params: Promise<{ recruiterId: string }>;
}) {
  const { recruiterId } = await params;
  const [employer, allListings] = await Promise.all([
    getEmployer(recruiterId),
    getListings(),
  ]);
  if (!employer) notFound();

  const listings = allListings.filter((l) => l.employerId === employer.id);

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <BackButton />
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Employer</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">{employer.name}</h1>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate">
              <MapPin size={13} />{employer.location}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate">
            {employer.phone && (
              <a href={`tel:${employer.phone}`} className="inline-flex items-center gap-1.5 hover:text-ink">
                <Phone size={14} />{employer.phone}
              </a>
            )}
            <a href={`mailto:${employer.email}`} className="inline-flex items-center gap-1.5 text-navy hover:underline">
              <Mail size={14} />{employer.email}
            </a>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard icon={<Briefcase size={18} />} label="Active listings" value={employer.activeListings} />
        <StatCard icon={<TrendingUp size={18} />} label="Total placements" value={employer.totalPlacements} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        {/* Listings */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-base font-semibold">Listings</h2>
            <span className="text-sm text-slate">{listings.length} total</span>
          </div>
          {listings.length === 0 ? (
            <p className="text-sm text-slate">No listings from this employer yet.</p>
          ) : (
            <div className="grid gap-2">
              {listings.map((l) => (
                <Link
                  key={l.id}
                  href={`/listings/${l.id}`}
                  className="flex items-center justify-between rounded-xl border border-border bg-canvas px-4 py-3 transition hover:border-navy/30 hover:bg-navy/5"
                >
                  <div>
                    <p className="text-sm font-medium">{l.title}</p>
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-slate">
                      <Calendar size={11} />
                      {new Date(l.publishedAt).toLocaleDateString("en-RW", { day: "numeric", month: "short", year: "numeric" })}
                      <span className="text-border">·</span>
                      {l.trade}
                    </p>
                  </div>
                  <Badge tone={l.status === "Open" ? "success" : l.status === "Paused" ? "warning" : "neutral"}>{l.status}</Badge>
                </Link>
              ))}
            </div>
          )}
        </Card>

        {/* Complaints */}
        <Card>
          <ComplaintsPanel recruiterId={employer.id} complaints={employer.complaints} />
        </Card>
      </div>
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
