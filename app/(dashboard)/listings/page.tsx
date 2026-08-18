import Link from "next/link";
import { PlusCircle } from "lucide-react";
import { getListings } from "@/lib/queries/listings";
import { ListingsBoard } from "@/components/listings/ListingsBoard";
import { Button } from "@/components/ui/Button";

export default async function ListingsPage() {
  const listings = await getListings();

  return (
    <div className="grid gap-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold tracking-[0.2em] text-slate uppercase">Listings</p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">All job listings</h1>
        </div>
        <Button asChild>
          <Link href="/listings/new">
            <PlusCircle size={16} className="mr-1.5" />
            Create listing
          </Link>
        </Button>
      </div>
      <ListingsBoard listings={listings} />
    </div>
  );
}
