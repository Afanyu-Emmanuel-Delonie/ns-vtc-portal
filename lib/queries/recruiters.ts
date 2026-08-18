import type { Recruiter } from "@/lib/types";
import { mockStore } from "@/lib/mock-data";

export async function getRecruiters(): Promise<Recruiter[]> {
  return mockStore.listRecruiters();
}

export async function getRecruiter(
  recruiterId: string,
): Promise<Recruiter | undefined> {
  return mockStore.getRecruiter(recruiterId);
}
