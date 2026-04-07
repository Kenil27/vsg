export const VIHAR_LOCATIONS = [
  "Goregaon",
  "Malad",
  "Kandivali",
  "Jogeshwari",
  "Andheri",
  "Rajhansh Aarey",
] as const;

export type ViharLocation = (typeof VIHAR_LOCATIONS)[number];
