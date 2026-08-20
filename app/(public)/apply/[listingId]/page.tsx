import { notFound } from "next/navigation";
import { getListing } from "@/lib/queries/listings";
import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { ApplicationForm } from "@/components/public/ApplicationForm";
import { defaultApplicationFields } from "@/lib/constants";

export default async function ApplyListingPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  const listing = await getListing(listingId);
  if (!listing) notFound();

  const fields = listing.applicationFields?.length
    ? listing.applicationFields
    : defaultApplicationFields;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
      <Card className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <Badge tone={listing.status === "Open" ? "success" : "warning"}>{listing.status}</Badge>
          <span className="text-sm text-slate">{listing.applicants} applicants</span>
        </div>
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">{listing.trade}</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">{listing.title}</h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate">{listing.description}</p>
        </div>
        <dl className="grid gap-4 sm:grid-cols-3">
          <div>
            <dt className="text-sm text-slate">Employer</dt>
            <dd className="mt-1 font-semibold">{listing.employer}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate">Location</dt>
            <dd className="mt-1 font-semibold">{listing.location}</dd>
          </div>
          <div>
            <dt className="text-sm text-slate">Stipend</dt>
            <dd className="mt-1 font-semibold">{listing.salary}</dd>
          </div>
        </dl>
        {listing.applicationDeadline && (
          <p className="text-sm text-slate">
            Applications close{" "}
            <strong className="text-ink">
              {new Date(listing.applicationDeadline).toLocaleDateString("en-RW", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </strong>
          </p>
        )}
      </Card>

      <Card className="space-y-5">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Apply now</p>
          <h2 className="mt-2 text-2xl font-semibold">Candidate details</h2>
        </div>
        <ApplicationForm
          listingId={listing.id}
          listingTitle={listing.title}
          applicationFields={fields}
        />
      </Card>
    </div>
  );
}
