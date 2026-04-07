export const VIHAR_LOCATIONS = [
  "goregaon",
  "malad",
  "Kandivali",
  "Jogeshwari",
  "Andheri",
  "Rajhansh Aarey",
] as const;

export type ViharLocation = (typeof VIHAR_LOCATIONS)[number];
