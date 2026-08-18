import type { PipelineStage } from "@/lib/constants";

export interface Listing {
  id: string;
  title: string;
  trade: string;
  location: string;
  employer: string;
  status: "Open" | "Paused" | "Closed";
  description: string;
  salary: string;
  applicants: number;
  publishedAt: string;
  applicationDeadline?: string;
}

export interface FollowUp {
  id: string;
  note: string;
  type: "note" | "cv_request" | "portfolio_request" | "document_request" | "call" | "email";
  createdAt: string;
  recruiter: string;
}

export interface Application {
  id: string;
  listingId: string;
  candidateName: string;
  candidateEmail: string;
  phone: string;
  trade: string;
  stage: PipelineStage;
  recruiter: string;
  notes: string;
  appliedAt: string;
  interviewDate?: string;
  offerDate?: string;
  nextFollowUpDate?: string;
  followUps: FollowUp[];
}

export interface Complaint {
  id: string;
  note: string;
  severity: "low" | "medium" | "high";
  createdAt: string;
  reportedBy: string;
  resolved: boolean;
}

export interface Recruiter {
  id: string;
  name: string;
  role: string;
  email: string;
  phone?: string;
  joinedAt: string;
  workload: number;
  activeApplications: number;
  placedCandidates: number;
  complaints: Complaint[];
}

export interface DashboardStats {
  openListings: number;
  totalApplications: number;
  inPipeline: number;
  hired: number;
  overdueFollowUps: number;
}
