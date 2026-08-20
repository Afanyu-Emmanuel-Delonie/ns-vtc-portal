import { redirect } from "next/navigation";
import { BackButton } from "@/components/ui/BackButton";
import { ListingForm } from "@/components/listings/ListingForm";
import { createListing, getTrades, addTrade } from "@/lib/queries/listings";
import { getEmployers } from "@/lib/queries/recruiters";
import { defaultApplicationFields } from "@/lib/constants";
import type { Listing } from "@/lib/types";

export default async function NewListingPage() {
  const [trades, employers] = await Promise.all([getTrades(), getEmployers()]);

  async function handleSave(data: Omit<Listing, "id" | "applicants" | "publishedAt">) {
    "use server";
    await createListing({
      ...data,
      applicationFields: data.applicationFields?.length
        ? data.applicationFields
        : defaultApplicationFields,
    });
    redirect("/listings");
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
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">Create listing</h1>
        </div>
      </div>
      <div className="mx-auto w-full max-w-3xl">
        <ListingForm trades={trades} employers={employers} onSave={handleSave} onAddTrade={handleAddTrade} />
      </div>
    </div>
  );
}
