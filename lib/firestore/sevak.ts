import { collection, getDocs } from "firebase/firestore";
import type { Firestore } from "firebase/firestore";

export type SevakOption = { id: string; name: string };

/** Expects each document to have a string field `name`, or falls back to document id. */
export async function fetchSevakOptions(db: Firestore): Promise<SevakOption[]> {
  const snap = await getDocs(collection(db, "sevak"));
  return snap.docs.map((doc) => {
    const data = doc.data() as Record<string, unknown>;
    const name =
      typeof data.name === "string" && data.name.trim()
        ? data.name.trim()
        : doc.id;
    return { id: doc.id, name };
  }).sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: "base" }));
}
