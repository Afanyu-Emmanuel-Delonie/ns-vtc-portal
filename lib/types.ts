import type { PipelineStage } from "@/lib/constants";

export interface ApplicationField {
  key: string;
  label: string;
  required: boolean;
  enabled: boolean;
  type: "text" | "textarea" | "file" | "url";
}

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
  applicationFields: ApplicationField[];
  employerId?: string;
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

export interface Employer {
  id: string;
  name: string;
  industry: string;
  email: string;
  phone?: string;
  location: string;
  joinedAt: string;
  activeListings: number;
  totalPlacements: number;
  complaints: Complaint[];
}

export interface DashboardStats {
  openListings: number;
  totalApplications: number;
  inPipeline: number;
  hired: number;
  overdueFollowUps: number;
}
