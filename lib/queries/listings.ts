import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import type { Listing } from "@/lib/types";
import { requireDb } from "@/lib/firebase";

const TRADES_DOC = "meta/config";

export async function getTrades(): Promise<string[]> {
  const snap = await getDoc(doc(requireDb(), TRADES_DOC));
  return (snap.data()?.trades as string[] | undefined) ?? [];
}

export async function addTrade(trade: string): Promise<void> {
  const t = trade.trim();
  if (!t) return;
  const trades = await getTrades();
  if (trades.includes(t)) return;
  await setDoc(doc(requireDb(), TRADES_DOC), { trades: [...trades, t] }, { merge: true });
}

export async function getEmployers(): Promise<string[]> {
  const snap = await getDoc(doc(requireDb(), TRADES_DOC));
  return (snap.data()?.employers as string[] | undefined) ?? [];
}

export async function addEmployer(employer: string): Promise<void> {
  const e = employer.trim();
  if (!e) return;
  const employers = await getEmployers();
  if (employers.includes(e)) return;
  await setDoc(doc(requireDb(), TRADES_DOC), { employers: [...employers, e] }, { merge: true });
}

export async function getListings(): Promise<Listing[]> {
  const snap = await getDocs(query(collection(requireDb(), "listings"), orderBy("publishedAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Listing);
}

export async function getListing(listingId: string): Promise<Listing | undefined> {
  const snap = await getDoc(doc(requireDb(), "listings", listingId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Listing) : undefined;
}

export async function createListing(
  input: Omit<Listing, "id" | "applicants" | "publishedAt">,
): Promise<Listing> {
  const data = { ...input, applicants: 0, publishedAt: new Date().toISOString() };
  const ref = await addDoc(collection(requireDb(), "listings"), data);
  return { id: ref.id, ...data };
}

export async function updateListing(
  listingId: string,
  patch: Partial<Omit<Listing, "id" | "applicants" | "publishedAt">>,
): Promise<void> {
  await updateDoc(doc(requireDb(), "listings", listingId), patch);
}

export async function closeListing(listingId: string): Promise<void> {
  await updateDoc(doc(requireDb(), "listings", listingId), { status: "Closed" });
}
