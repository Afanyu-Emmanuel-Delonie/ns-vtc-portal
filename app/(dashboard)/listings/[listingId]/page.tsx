import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Building2, Briefcase, Users, Calendar, Pencil } from "lucide-react";
import { getApplications } from "@/lib/queries/applications";
import { getListing } from "@/lib/queries/listings";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { BackButton } from "@/components/ui/BackButton";

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  const listing = await getListing(listingId);
  if (!listing) notFound();

  const applications = (await getApplications()).filter((a) => a.listingId === listingId);
  const tone = listing.status === "Open" ? "success" : listing.status === "Paused" ? "warning" : "neutral";

  return (
    <div className="grid gap-6">
      {/* Header */}
      <div>
        <BackButton />
        <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Listing</p>
            <h1 className="mt-1 text-3xl font-semibold tracking-tight">{listing.title}</h1>
            <p className="mt-1 text-sm text-slate">{listing.employer}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge tone={tone}>{listing.status}</Badge>
            <Link
              href={`/listings/${listing.id}/edit`}
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-4 py-2 text-sm font-semibold text-ink transition hover:bg-canvas"
            >
              <Pencil size={14} />
              Edit
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        {/* Left */}
        <div className="grid gap-6 self-start">
          {/* Description */}
          <Card>
            <h2 className="mb-3 text-base font-semibold">About this listing</h2>
            <p className="text-sm leading-7 text-slate">{listing.description}</p>
          </Card>

          {/* Applications */}
          <Card>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-semibold">Applications</h2>
              <span className="text-sm text-slate">{applications.length} total</span>
            </div>
            {applications.length === 0 ? (
              <p className="text-sm text-slate">No applications yet.</p>
            ) : (
              <div className="grid gap-2">
                {applications.map((app) => (
                  <Link
                    key={app.id}
                    href={`/applications/${app.id}`}
                    className="flex items-center justify-between rounded-xl border border-border bg-canvas px-4 py-3 transition hover:border-navy/30 hover:bg-navy/5"
                  >
                    <div>
                      <p className="text-sm font-medium">{app.candidateName}</p>
                      <p className="text-xs text-slate">{app.trade} · {app.recruiter}</p>
                    </div>
                    <Badge tone={app.stage === "Hired" ? "success" : "brand"}>{app.stage}</Badge>
                  </Link>
                ))}
              </div>
            )}
          </Card>
        </div>

        {/* Right — meta */}
        <Card className="self-start">
          <h2 className="mb-4 text-base font-semibold">Details</h2>
          <dl className="grid gap-4">
            <div className="flex items-start gap-2">
              <MapPin size={15} className="mt-0.5 shrink-0 text-slate" />
              <div>
                <dt className="text-xs text-slate">Location</dt>
                <dd className="text-sm font-medium">{listing.location}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Building2 size={15} className="mt-0.5 shrink-0 text-slate" />
              <div>
                <dt className="text-xs text-slate">Employer</dt>
                <dd className="text-sm font-medium">{listing.employer}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Briefcase size={15} className="mt-0.5 shrink-0 text-slate" />
              <div>
                <dt className="text-xs text-slate">Trade</dt>
                <dd className="text-sm font-medium">{listing.trade}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users size={15} className="mt-0.5 shrink-0 text-slate" />
              <div>
                <dt className="text-xs text-slate">Salary</dt>
                <dd className="text-sm font-medium">{listing.salary}</dd>
              </div>
            </div>
            {listing.applicationDeadline && (
              <div className="flex items-start gap-2">
                <Calendar size={15} className="mt-0.5 shrink-0 text-slate" />
                <div>
                  <dt className="text-xs text-slate">Deadline</dt>
                  <dd className="text-sm font-medium">
                    {new Date(listing.applicationDeadline).toLocaleDateString("en-RW", {
                      day: "numeric", month: "short", year: "numeric",
                    })}
                  </dd>
                </div>
              </div>
            )}
            <div className="flex items-start gap-2">
              <Calendar size={15} className="mt-0.5 shrink-0 text-slate" />
              <div>
                <dt className="text-xs text-slate">Published</dt>
                <dd className="text-sm font-medium">
                  {new Date(listing.publishedAt).toLocaleDateString("en-RW", {
                    day: "numeric", month: "short", year: "numeric",
                  })}
                </dd>
              </div>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
