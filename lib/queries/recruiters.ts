import { addDoc, collection, doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import type { Complaint, Employer } from "@/lib/types";
import { requireDb } from "@/lib/firebase";

export async function getEmployers(): Promise<Employer[]> {
  const snap = await getDocs(collection(requireDb(), "employers"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Employer);
}

export async function getEmployer(employerId: string): Promise<Employer | undefined> {
  const snap = await getDoc(doc(requireDb(), "employers", employerId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Employer) : undefined;
}

export async function createEmployer(
  input: Omit<Employer, "id" | "joinedAt" | "activeListings" | "totalPlacements" | "complaints">,
): Promise<Employer> {
  const data = {
    ...input,
    joinedAt: new Date().toISOString(),
    activeListings: 0,
    totalPlacements: 0,
    complaints: [] as Complaint[],
  };
  const ref = await addDoc(collection(requireDb(), "employers"), data);
  return { id: ref.id, ...data };
}

export async function addComplaint(
  employerId: string,
  complaint: Omit<Complaint, "id" | "createdAt" | "resolved">,
): Promise<void> {
  const ref = doc(requireDb(), "employers", employerId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const existing = (snap.data().complaints as Complaint[] | undefined) ?? [];
  const entry: Complaint = { ...complaint, id: `cmp-${Date.now()}`, createdAt: new Date().toISOString(), resolved: false };
  await updateDoc(ref, { complaints: [entry, ...existing] });
}

export async function resolveComplaint(employerId: string, complaintId: string): Promise<void> {
  const ref = doc(requireDb(), "employers", employerId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;
  const existing = (snap.data().complaints as Complaint[] | undefined) ?? [];
  await updateDoc(ref, { complaints: existing.map((c) => (c.id === complaintId ? { ...c, resolved: true } : c)) });
}
