import { notFound, redirect } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { ListingForm } from "@/components/listings/ListingForm";
import { getListing, updateListing, getTrades, addTrade } from "@/lib/queries/listings";
import { getEmployers } from "@/lib/queries/recruiters";
import type { Listing } from "@/lib/types";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ listingId: string }>;
}) {
  const { listingId } = await params;
  const [listing, trades, employers] = await Promise.all([getListing(listingId), getTrades(), getEmployers()]);
  if (!listing) notFound();

  async function handleSave(data: Omit<Listing, "id" | "applicants" | "publishedAt">) {
    "use server";
    await updateListing(listingId, data);
    redirect(`/listings/${listingId}`);
  }

  async function handleAddTrade(trade: string) {
    "use server";
    await addTrade(trade);
  }

  return (
    <div className="grid gap-6">
      <div>
        <BackButton />
        <div className="mt-4">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate">Listings</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{listing.title}</h1>
        </div>
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <ListingForm
          initial={listing}
          listingId={listingId}
          trades={trades}
          employers={employers}
          onSave={handleSave}
          onAddTrade={handleAddTrade}
        />
      </div>
    </div>
  );
}
