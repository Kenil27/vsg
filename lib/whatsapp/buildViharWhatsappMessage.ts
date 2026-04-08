export type ViharWhatsappPayload = {
  /** e.g. 7/4/2026 */
  dateDmy: string;
  thana: number;
  mahatmaName: string;
  viharStartTime: string;
  viharStartLocation: string;
  viharEndLocation: string;
  initialViharStart: string;
  finalViharEnd: string;
  viharSainikLines: string[];
  updhiLine: string | null;
  wheelchairYes: boolean;
  wheelchairCount: number;
};

function prettyLocation(raw: string): string {
  return raw
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Matches the template you provided; static lines (Milap, S v road, etc.) stay fixed.
 */
export function buildViharWhatsappMessage(p: ViharWhatsappPayload): string {
  const vs = prettyLocation(p.viharStartLocation);
  const ve = prettyLocation(p.viharEndLocation);
  const ini = prettyLocation(p.initialViharStart);
  const fin = prettyLocation(p.finalViharEnd);

  const lines: string[] = [
    `VIHAR - (${p.dateDmy})`,
    "",
    `${p.thana} Thana`,
    p.mahatmaName.trim(),
    p.viharStartTime.trim(),
    "",
    "From",
    "",
    vs,
  ];

  if (ini !== "") {
    lines.push("", `Sahebji coming from ${ini}`);
  }

  lines.push("", "To", "", ve);

  if (fin !== "") {
    lines.push(`(Sahebji going further till ${fin})`);
  }

  lines.push(
    "",
    "Vihar sevak",
    ...p.viharSainikLines.map((s) => s.trim()).filter(Boolean),
  );

  if (p.wheelchairYes && p.wheelchairCount > 0) {
    lines.push("", `Wheelchair: ${p.wheelchairCount}`);
  }

  if (p.updhiLine?.trim()) {
    lines.push("", "Updhi transfer", p.updhiLine.trim());
  }

  return lines.join("\n");
}
