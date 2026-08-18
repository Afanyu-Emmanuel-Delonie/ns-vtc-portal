import { notFound } from "next/navigation";
import { getListing } from "@/lib/queries/listings";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  const listing = await getListing(listingId);

  if (!listing) {
    notFound();
  }

  return (
    <Card className="mx-auto max-w-3xl">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--slate)]">
          Edit listing
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{listing.title}</h1>
      </div>
      <form className="grid gap-4">
        <Input defaultValue={listing.title} />
        <Input defaultValue={listing.trade} />
        <Input defaultValue={listing.employer} />
        <Input defaultValue={listing.location} />
        <textarea
          rows={6}
          className="w-full rounded-2xl border border-[var(--border)] bg-surface px-4 py-3 text-sm outline-none"
          defaultValue={listing.description}
        />
        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button">
            Cancel
          </Button>
          <Button type="submit">Save changes</Button>
        </div>
      </form>
    </Card>
  );
}
