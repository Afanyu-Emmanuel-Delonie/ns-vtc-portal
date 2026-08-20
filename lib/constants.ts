import type { ApplicationField } from "@/lib/types";

export const pipelineStages = [
  "New",
  "Screening",
  "Under Review",
  "Shortlisted",
  "Interview",
  "Offer",
  "Hired",
  "Closed",
] as const;

export type PipelineStage = (typeof pipelineStages)[number];

// Mutable so the store can push new trades at runtime
export const tradeOptions: string[] = [
  "Welder",
  "Electrician",
  "Plumber",
  "Boilermaker",
  "Carpenter",
  "Mechanic",
];

export const DIAL_CODES = [
  { code: "+250", country: "RW" },
  { code: "+254", country: "KE" },
  { code: "+255", country: "TZ" },
  { code: "+256", country: "UG" },
  { code: "+257", country: "BI" },
  { code: "+243", country: "CD" },
  { code: "+27",  country: "ZA" },
  { code: "+234", country: "NG" },
  { code: "+233", country: "GH" },
  { code: "+1",   country: "US" },
  { code: "+44",  country: "GB" },
] as const;

export const defaultApplicationFields: ApplicationField[] = [
  { key: "email",     label: "Email address",  type: "text",     required: false, enabled: false },
  { key: "trade",     label: "Trade / skill",  type: "text",     required: false, enabled: true  },
  { key: "notes",     label: "Cover note",     type: "textarea", required: false, enabled: true  },
  { key: "cv",        label: "CV / Résumé",    type: "file",     required: false, enabled: false },
  { key: "portfolio", label: "Portfolio link", type: "url",      required: false, enabled: false },
];
