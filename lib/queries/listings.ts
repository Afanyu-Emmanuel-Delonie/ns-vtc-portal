import type { Listing } from "@/lib/types";
import { mockStore } from "@/lib/mock-data";

export async function getListings(): Promise<Listing[]> {
  return mockStore.listListings();
}

export async function getListing(listingId: string): Promise<Listing | undefined> {
  return mockStore.getListing(listingId);
}

export async function createListing(
  input: Omit<Listing, "id" | "applicants" | "publishedAt">,
): Promise<Listing> {
  return mockStore.createListing(input);
}

export async function closeListing(listingId: string): Promise<void> {
  mockStore.closeListing(listingId);
}
