import { doc, getDoc, setDoc } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

export type SevakOption = { id: string; name: string };

const SEVAK_COLLECTION = "sevak";
const SEVAK_NAMES_DOC = "names";
/** Field on `sevak/names` that holds the list (array of strings). */
const SEVAK_NAMES_FIELD = "names";

function parseNamesField(data: Record<string, unknown> | undefined): string[] {
  if (!data) return [];
  const raw = data[SEVAK_NAMES_FIELD];
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((x): x is string => typeof x === "string" && x.trim().length > 0)
    .map((s) => s.trim());
}

function normalizeNameList(names: string[]): string[] {
  const trimmed = names.map((s) => s.trim()).filter((s) => s.length > 0);
  const unique = [...new Set(trimmed)];
  unique.sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
  return unique;
}

/**
 * Reads `sevak/names`: document `names` in collection `sevak` with a string array
 * field `names` (deduped, sorted). `id` matches `name` for stable keys in the UI.
 */
export async function fetchSevakOptions(db: Firestore): Promise<SevakOption[]> {
  const list = await fetchSevakNameList(db);
  return list.map((name) => ({ id: name, name }));
}

/** Sorted, unique names for admin editor and dropdowns. */
export async function fetchSevakNameList(db: Firestore): Promise<string[]> {
  const snap = await getDoc(doc(db, SEVAK_COLLECTION, SEVAK_NAMES_DOC));
  if (!snap.exists()) return [];
  return normalizeNameList(parseNamesField(snap.data() as Record<string, unknown>));
}

/** Writes the `names` array on `sevak/names` (trimmed, deduped, sorted). */
export async function saveSevakNameList(
  db: Firestore,
  names: string[],
): Promise<void> {
  const normalized = normalizeNameList(names);
  await setDoc(
    doc(db, SEVAK_COLLECTION, SEVAK_NAMES_DOC),
    { [SEVAK_NAMES_FIELD]: normalized },
    { merge: true },
  );
}
