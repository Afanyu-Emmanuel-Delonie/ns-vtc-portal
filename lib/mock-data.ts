import type { Application, Listing, Recruiter } from "@/lib/types";
import { pipelineStages } from "@/lib/constants";

const now = new Date();
const iso = (days: number) =>
  new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString();
const isoDaysAgo = (days: number) => iso(-days);

let listingSeed: Listing[] = [
  {
    id: "lst-1001",
    title: "Senior Welder Apprentice Intake",
    trade: "Welder",
    location: "Kigali, Gasabo",
    employer: "Kigali Steel & Fabrication",
    status: "Open",
    description: "Training pathway for motivated candidates who want hands-on workshop experience.",
    salary: "RWF 75,000 stipend",
    applicants: 14,
    publishedAt: isoDaysAgo(8),
    applicationDeadline: iso(5),
  },
  {
    id: "lst-1002",
    title: "Electrical Installation Trainee",
    trade: "Electrician",
    location: "Musanze, Northern Province",
    employer: "RwandaPower Solutions",
    status: "Open",
    description: "Campus-linked placement with rotating site visits and a strong mentorship plan.",
    salary: "RWF 82,500 stipend",
    applicants: 9,
    publishedAt: isoDaysAgo(4),
    applicationDeadline: iso(10),
  },
  {
    id: "lst-1003",
    title: "Commercial Plumbing Learnership",
    trade: "Plumber",
    location: "Huye, Southern Province",
    employer: "AquaTech Rwanda",
    status: "Paused",
    description: "Mid-size commercial maintenance role with exposure to water systems and fittings.",
    salary: "RWF 91,000 stipend",
    applicants: 6,
    publishedAt: isoDaysAgo(13),
    applicationDeadline: iso(3),
  },
  {
    id: "lst-1004",
    title: "Boilermaker Learnership",
    trade: "Boilermaker",
    location: "Rubavu, Western Province",
    employer: "Great Lakes Industrial",
    status: "Open",
    description: "Hands-on boilermaking learnership with RTQF-aligned accreditation.",
    salary: "RWF 80,000 stipend",
    applicants: 4,
    publishedAt: isoDaysAgo(2),
    applicationDeadline: iso(12),
  },
];

let applicationSeed: Application[] = [
  {
    id: "app-2001",
    listingId: "lst-1001",
    candidateName: "Lerato Mkhize",
    candidateEmail: "lerato@example.com",
    phone: "082 555 0101",
    trade: "Welder",
    stage: "Interview",
    recruiter: "Ayesha Khan",
    notes: "Strong attendance record and workshop safety awareness.",
    appliedAt: isoDaysAgo(10),
    interviewDate: iso(1),
    nextFollowUpDate: iso(2),
    followUps: [{ id: "fu-1", note: "Requested ID copy and school results.", type: "document_request" as const, createdAt: isoDaysAgo(2), recruiter: "Ayesha Khan" }],
  },
  {
    id: "app-2002",
    listingId: "lst-1002",
    candidateName: "Thabo Dlamini",
    candidateEmail: "thabo@example.com",
    phone: "083 555 0102",
    trade: "Electrician",
    stage: "Screening",
    recruiter: "Mpho Ndlovu",
    notes: "Needs confirmation on travel availability.",
    appliedAt: isoDaysAgo(5),
    nextFollowUpDate: isoDaysAgo(1),
    followUps: [],
  },
  {
    id: "app-2003",
    listingId: "lst-1003",
    candidateName: "Anele Jacobs",
    candidateEmail: "anele@example.com",
    phone: "079 555 0103",
    trade: "Plumber",
    stage: "Offer",
    recruiter: "Mpho Ndlovu",
    notes: "Offer prepared pending reference check.",
    appliedAt: isoDaysAgo(12),
    offerDate: isoDaysAgo(1),
    nextFollowUpDate: isoDaysAgo(2),
    followUps: [{ id: "fu-2", note: "Spoke with guardian about onboarding requirements.", type: "call" as const, createdAt: isoDaysAgo(4), recruiter: "Mpho Ndlovu" }],
  },
  {
    id: "app-2004",
    listingId: "lst-1001",
    candidateName: "Sipho Nkosi",
    candidateEmail: "sipho@example.com",
    phone: "071 555 0104",
    trade: "Welder",
    stage: "Under Review",
    recruiter: "Ayesha Khan",
    notes: "Good practical test results.",
    appliedAt: isoDaysAgo(7),
    nextFollowUpDate: iso(0),
    followUps: [],
  },
  {
    id: "app-2005",
    listingId: "lst-1002",
    candidateName: "Nomsa Dube",
    candidateEmail: "nomsa@example.com",
    phone: "084 555 0105",
    trade: "Electrician",
    stage: "Shortlisted",
    recruiter: "Ayesha Khan",
    notes: "Top candidate from Pietermaritzburg cohort.",
    appliedAt: isoDaysAgo(6),
    interviewDate: iso(3),
    followUps: [],
  },
  {
    id: "app-2006",
    listingId: "lst-1004",
    candidateName: "Kagiso Sithole",
    candidateEmail: "kagiso@example.com",
    phone: "076 555 0106",
    trade: "Boilermaker",
    stage: "Hired",
    recruiter: "Mpho Ndlovu",
    notes: "Accepted offer. Starting next month.",
    appliedAt: isoDaysAgo(20),
    followUps: [],
  },
  {
    id: "app-2007",
    listingId: "lst-1001",
    candidateName: "Zanele Mokoena",
    candidateEmail: "zanele@example.com",
    phone: "082 555 0107",
    trade: "Welder",
    stage: "New",
    recruiter: "Ayesha Khan",
    notes: "",
    appliedAt: isoDaysAgo(1),
    followUps: [],
  },
  {
    id: "app-2008",
    listingId: "lst-1003",
    candidateName: "Bongani Cele",
    candidateEmail: "bongani@example.com",
    phone: "073 555 0108",
    trade: "Plumber",
    stage: "Interview",
    recruiter: "Mpho Ndlovu",
    notes: "Second interview scheduled.",
    appliedAt: isoDaysAgo(9),
    interviewDate: iso(0),
    nextFollowUpDate: isoDaysAgo(3),
    followUps: [],
  },
];

const recruiterSeed: Recruiter[] = [
  { id: "rec-1", name: "Ayesha Uwimana", role: "Senior Recruiter", email: "ayesha@nsvtc.rw", workload: 18, activeApplications: 11, placedCandidates: 4 },
  { id: "rec-2", name: "Mpho Nkurunziza", role: "Recruiter", email: "mpho@nsvtc.rw", workload: 12, activeApplications: 8, placedCandidates: 2 },
];

const clone = <T,>(value: T): T =>
  (value === undefined ? value : (JSON.parse(JSON.stringify(value)) as T));

export const mockStore = {
  pipelineStages,
  listListings: () => clone(listingSeed),
  getListing: (listingId: string) => clone(listingSeed.find((l) => l.id === listingId)),
  createListing: (input: Omit<Listing, "id" | "applicants" | "publishedAt">) => {
    const listing: Listing = { ...input, id: `lst-${listingSeed.length + 1001}`, applicants: 0, publishedAt: new Date().toISOString() };
    listingSeed = [listing, ...listingSeed];
    return clone(listing);
  },
  closeListing: (listingId: string) => {
    listingSeed = listingSeed.map((l) => l.id === listingId ? { ...l, status: "Closed" } : l);
  },
  listApplications: () => clone(applicationSeed),
  getApplication: (applicationId: string) => clone(applicationSeed.find((a) => a.id === applicationId)),
  createApplication: (input: Omit<Application, "id" | "appliedAt" | "followUps" | "stage"> & { listingId: string }) => {
    const application: Application = { ...input, id: `app-${applicationSeed.length + 2001}`, stage: "New", appliedAt: new Date().toISOString(), followUps: [] };
    applicationSeed = [application, ...applicationSeed];
    listingSeed = listingSeed.map((l) => l.id === application.listingId ? { ...l, applicants: l.applicants + 1 } : l);
    return clone(application);
  },
  updateStage: (applicationId: string, stage: (typeof pipelineStages)[number]) => {
    applicationSeed = applicationSeed.map((a) => a.id === applicationId ? { ...a, stage } : a);
  },
  addFollowUp: (applicationId: string, note: string, recruiter: string, type: import("@/lib/types").FollowUp["type"]) => {
    applicationSeed = applicationSeed.map((a) =>
      a.id === applicationId
        ? { ...a, followUps: [{ id: `fu-${Date.now()}`, note, recruiter, type, createdAt: new Date().toISOString() }, ...a.followUps] }
        : a,
    );
  },
  listRecruiters: () => clone(recruiterSeed),
  getRecruiter: (recruiterId: string) => clone(recruiterSeed.find((r) => r.id === recruiterId)),
};
