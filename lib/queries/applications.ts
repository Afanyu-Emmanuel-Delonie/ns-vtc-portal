import type { Application } from "@/lib/types";
import { mockStore } from "@/lib/mock-data";
import type { PipelineStage } from "@/lib/constants";

export async function createApplication(
  input: Omit<Application, "id" | "appliedAt" | "followUps" | "stage">,
): Promise<Application> {
  return mockStore.createApplication(input);
}

export async function getApplications(): Promise<Application[]> {
  return mockStore.listApplications();
}

export async function getApplication(
  applicationId: string,
): Promise<Application | undefined> {
  return mockStore.getApplication(applicationId);
}

export async function updateStage(
  applicationId: string,
  stage: PipelineStage,
): Promise<void> {
  mockStore.updateStage(applicationId, stage);
}

export async function addFollowUp(
  applicationId: string,
  note: string,
  recruiter: string,
): Promise<void> {
  mockStore.addFollowUp(applicationId, note, recruiter);
}
