import type { Complaint, Recruiter } from "@/lib/types";
import { mockStore } from "@/lib/mock-data";

export async function getRecruiters(): Promise<Recruiter[]> {
  return mockStore.listRecruiters();
}

export async function getRecruiter(recruiterId: string): Promise<Recruiter | undefined> {
  return mockStore.getRecruiter(recruiterId);
}

export async function createRecruiter(
  input: Omit<Recruiter, "id" | "joinedAt" | "workload" | "activeApplications" | "placedCandidates" | "complaints">,
): Promise<Recruiter> {
  return mockStore.createRecruiter(input);
}

export async function addComplaint(
  recruiterId: string,
  complaint: Omit<Complaint, "id" | "createdAt" | "resolved">,
): Promise<void> {
  mockStore.addComplaint(recruiterId, complaint);
}

export async function resolveComplaint(recruiterId: string, complaintId: string): Promise<void> {
  mockStore.resolveComplaint(recruiterId, complaintId);
}
