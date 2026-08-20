import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import type { Application, FollowUp } from "@/lib/types";
import { requireDb } from "@/lib/firebase";
import type { PipelineStage } from "@/lib/constants";

export async function createApplication(
  input: Omit<Application, "id" | "appliedAt" | "followUps" | "stage">,
): Promise<Application> {
  const data = {
    ...input,
    stage: "New" as PipelineStage,
    appliedAt: new Date().toISOString(),
    followUps: [] as FollowUp[],
  };
  const ref = await addDoc(collection(requireDb(), "applications"), data);
  await updateDoc(doc(requireDb(), "listings", input.listingId), { applicants: increment(1) });
  return { id: ref.id, ...data };
}

export async function getApplications(): Promise<Application[]> {
  const snap = await getDocs(query(collection(requireDb(), "applications"), orderBy("appliedAt", "desc")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Application);
}

export async function getApplication(applicationId: string): Promise<Application | undefined> {
  const snap = await getDoc(doc(requireDb(), "applications", applicationId));
  return snap.exists() ? ({ id: snap.id, ...snap.data() } as Application) : undefined;
}

export async function updateStage(applicationId: string, stage: PipelineStage): Promise<void> {
  const ref = doc(requireDb(), "applications", applicationId);
  if (stage === "Hired") {
    await updateDoc(ref, { stage, hiredAt: new Date().toISOString() });
  } else {
    await updateDoc(ref, { stage });
  }
}

export async function addFollowUp(
  applicationId: string,
  note: string,
  recruiter: string,
  type: FollowUp["type"],
): Promise<void> {
  const ref = doc(requireDb(), "applications", applicationId);
  const snap = await getDoc(ref);
  if (!snap.exists()) return;

  const existing = (snap.data().followUps as FollowUp[] | undefined) ?? [];
  const entry: FollowUp = {
    id: `fu-${Date.now()}`,
    note,
    recruiter,
    type,
    createdAt: new Date().toISOString(),
  };
  await updateDoc(ref, { followUps: [entry, ...existing] });
}
