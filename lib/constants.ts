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

export const tradeOptions = [
  "Welder",
  "Electrician",
  "Plumber",
  "Boilermaker",
  "Carpenter",
  "Mechanic",
] as const;
