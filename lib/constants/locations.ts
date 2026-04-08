export const VIHAR_LOCATIONS = [
  "Goregaon",
  "Malad",
  "Kandivali",
  "Borivali",
  "Dahisar",
  "Vile Parle",
  "Ghatkopar",
  "Mulund",
  "Powai",
  "Santacruz",
  "Khar",
  "Jogeshwari",
  "Andheri",
  "Rajhansh Aarey",
] as const;

export type ViharLocation = (typeof VIHAR_LOCATIONS)[number];
