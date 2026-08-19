"use client";

import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import type { Auth } from "firebase/auth";
import {
  addDoc,
  collection,
  serverTimestamp,
  type Firestore,
} from "firebase/firestore";
import { VIHAR_LOCATIONS } from "@/lib/constants/locations";
import {
  type SevakOption,
  fetchSevakOptions,
} from "@/lib/firestore/sevak";
import { buildViharWhatsappMessage } from "@/lib/whatsapp/buildViharWhatsappMessage";
import { toWhatsAppE164 } from "@/lib/whatsapp/extractPhone";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SevakMultiPicker } from "@/components/admin/SevakMultiPicker";
import { ViharWhatsappPanel } from "@/components/admin/ViharWhatsappPanel";

type ViharEntryFormProps = {
  db: Firestore;
  auth: Auth;
  /** Increment to refetch sevak names from Firestore (e.g. after admin editor saves). */
  sevakRefreshToken?: number;
};

function isoDateToSlash(iso: string): string {
  const [y, m, d] = iso.split("/");
  if (!y || !m || !d) return iso;
  return `${y}/${m}/${d}`;
}

function isoToDmy(iso: string): string {
  const [ys, ms, ds] = iso.split("-");
  const y = Number(ys);
  const m = Number(ms);
  const d = Number(ds);
  if (!y || !m || !d) return iso;
  return `${d}/${m}/${y}`;
}

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
] as const;

const timeOptions = [
  { value: "morning", label: "Morning" },
  { value: "evening", label: "Evening" },
] as const;

const locationSelectOptions = VIHAR_LOCATIONS.map((loc) => ({
  value: loc,
  label: loc.charAt(0).toUpperCase() + loc.slice(1).toLowerCase(),
}));

const updhiOptions = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
] as const;

const wheelchairOptions = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
] as const;

export function ViharEntryForm({
  db,
  auth,
  sevakRefreshToken = 0,
}: ViharEntryFormProps) {
  const [sevakList, setSevakList] = useState<SevakOption[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [dateIso, setDateIso] = useState("");
  const [gender, setGender] = useState("");
  const [timeOfDay, setTimeOfDay] = useState("");
  const [viharStart, setViharStart] = useState("");
  const [viharEnd, setViharEnd] = useState("");
  const [kms, setKms] = useState("");
  const [viharSainiks, setViharSainiks] = useState<string[]>([]);
  const [updhi, setUpdhi] = useState<"yes" | "no">("no");
  const [updhiSevakName, setUpdhiSevakName] = useState("");
  const [mahatmaName, setMahatmaName] = useState("");
  const [viharStartTime, setViharStartTime] = useState("");
  const [thana, setThana] = useState("");
  const [initialViharStart, setInitialViharStart] = useState("");
  const [finalViharEnd, setFinalViharEnd] = useState("");
  const [wheelchair, setWheelchair] = useState<"yes" | "no">("no");
  const [wheelchairCount, setWheelchairCount] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoadError(null);
    (async () => {
      try {
        const rows = await fetchSevakOptions(db);
        if (!cancelled) setSevakList(rows);
      } catch {
        if (!cancelled) {
          setLoadError("Could not load sevak list. Check Firestore rules.");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [db, sevakRefreshToken]);

  const sevakNameOptions = useMemo(
    () => sevakList.map((o) => ({ value: o.name, label: o.name })),
    [sevakList],
  );

  const whatsappMessage = useMemo(() => {
    if (!dateIso) return "";
    const thanaNum = Number(thana);
    if (Number.isNaN(thanaNum) || thanaNum < 0) return "";
    if (
      !mahatmaName.trim() ||
      !viharStartTime.trim() ||
      !viharStart ||
      !viharEnd ||
      !initialViharStart ||
      !finalViharEnd
    ) {
      return "";
    }
    const wc =
      wheelchair === "yes" ? Math.max(0, Number(wheelchairCount) || 0) : 0;
    return buildViharWhatsappMessage({
      dateDmy: isoToDmy(dateIso),
      thana: thanaNum,
      mahatmaName: mahatmaName.trim(),
      viharStartTime: viharStartTime.trim(),
      viharStartLocation: viharStart,
      viharEndLocation: viharEnd,
      initialViharStart,
      finalViharEnd,
      viharSainikLines: viharSainiks,
      updhiLine:
        updhi === "yes" && updhiSevakName.trim()
          ? updhiSevakName.trim()
          : null,
      wheelchairYes: wheelchair === "yes",
      wheelchairCount: wc,
    });
  }, [
    dateIso,
    thana,
    mahatmaName,
    viharStartTime,
    viharStart,
    viharEnd,
    initialViharStart,
    finalViharEnd,
    viharSainiks,
  ]);

  const waTargets = useMemo(() => {
    const out: { label: string; wa: string }[] = [];
    const seen = new Set<string>();
    const push = (label: string, raw: string) => {
      const wa = toWhatsAppE164(raw);
      if (!wa || seen.has(wa)) return;
      seen.add(wa);
      out.push({ label, wa });
    };
    for (const line of viharSainiks) {
      const t = line.trim();
      if (t) push(t, t);
    }
    if (updhi === "yes" && updhiSevakName.trim()) {
      const t = updhiSevakName.trim();
      push(`Updhi · ${t}`, t);
    }
    return out;
  }, [viharSainiks, updhi, updhiSevakName]);

  const resetForm = () => {
    setDateIso("");
    setTimeOfDay("");
    setViharStart("");
    setViharEnd("");
    setKms("");
    setUpdhi("no");
    setUpdhiSevakName("");
    setMahatmaName("");
    setViharStartTime("");
    setThana("");
    setInitialViharStart("");
    setFinalViharEnd("");
    setWheelchair("no");
    setWheelchairCount("");
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setSuccess(null);

    if (!dateIso) {
      setFormError("Please choose a date.");
      return;
    }
    if (!gender || !timeOfDay || !viharStart || !viharEnd) {
      setFormError("Please fill all required fields.");
      return;
    }
    if (viharSainiks.length === 0) {
      setFormError("Add at least one Vihar Sainik.");
      return;
    }
    const kmsNum = Number(kms);
    if (Number.isNaN(kmsNum) || kmsNum < 0) {
      setFormError("Enter a valid Kms value.");
      return;
    }
    if (updhi === "yes" && !updhiSevakName) {
      setFormError("Select sevak name for Updhi.");
      return;
    }
    if (!mahatmaName.trim()) {
      setFormError("Enter Mahatma name.");
      return;
    }
    if (!viharStartTime.trim()) {
      setFormError("Enter Vihar start time.");
      return;
    }
    const thanaNum = Number(thana);
    if (Number.isNaN(thanaNum) || thanaNum < 0) {
      setFormError("Enter a valid Thana (0 or greater).");
      return;
    }
    if (!initialViharStart || !finalViharEnd) {
      setFormError("Choose Initial Vihar Start and Final Vihar End.");
      return;
    }
    const user = auth.currentUser;
    if (!user) {
      setFormError("You are not signed in.");
      return;
    }

    const wcNum =
      wheelchair === "yes" ? Math.max(1, Number(wheelchairCount) || 0) : 0;

    setSubmitting(true);
    try {
      await addDoc(collection(db, "vihar"), {
        date: isoDateToSlash(dateIso),
        gender,
        timeOfDay,
        viharStart,
        viharEnd,
        kms: kmsNum,
        viharSainiks,
        updhi: updhi === "yes",
        updhiSevakName: updhi === "yes" ? updhiSevakName : null,
        mahatmaName: mahatmaName.trim(),
        viharStartTime: viharStartTime.trim(),
        thana: thanaNum,
        initialViharStart,
        finalViharEnd,
        wheelchair: wheelchair === "yes",
        wheelchairCount: wcNum,
        createdAt: serverTimestamp(),
        createdByUid: user.uid,
      });
      setSuccess("Entry saved.");
      resetForm();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Could not save. Try again.";
      setFormError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card title="New vihar entry">
      {loadError ? (
        <p className="mb-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {loadError}
        </p>
      ) : null}
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <Field id="entry-date" label="Date (stored as YYYY/MM/DD)">
          <Input
            id="entry-date"
            type="date"
            required
            value={dateIso}
            onChange={(e) => setDateIso(e.target.value)}
          />
        </Field>
        <Field id="entry-gender" label="Gender">
          <Select
            id="entry-gender"
            required
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            options={[...genderOptions]}
          />
        </Field>
        <Field id="entry-time" label="Time of day">
          <Select
            id="entry-time"
            required
            value={timeOfDay}
            onChange={(e) => setTimeOfDay(e.target.value)}
            options={[...timeOptions]}
          />
        </Field>
        <Field id="entry-start" label="Vihar start">
          <Select
            id="entry-start"
            required
            value={viharStart}
            onChange={(e) => setViharStart(e.target.value)}
            options={locationSelectOptions}
          />
        </Field>
        <Field id="entry-end" label="Vihar end">
          <Select
            id="entry-end"
            required
            value={viharEnd}
            onChange={(e) => setViharEnd(e.target.value)}
            options={locationSelectOptions}
          />
        </Field>
        <Field id="entry-kms" label="Kms">
          <Input
            id="entry-kms"
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            required
            value={kms}
            onChange={(e) => setKms(e.target.value)}
          />
        </Field>
        <SevakMultiPicker
          id="entry-sainiks"
          label="Vihar Sainiks"
          options={sevakList}
          value={viharSainiks}
          onChange={setViharSainiks}
          disabled={submitting}
        />
        <Field id="entry-updhi" label="Updhi">
          <Select
            id="entry-updhi"
            value={updhi}
            onChange={(e) => setUpdhi(e.target.value as "yes" | "no")}
            options={[...updhiOptions]}
          />
        </Field>
        {updhi === "yes" ? (
          <Field id="entry-updhi-sevak" label="Sevak name (Updhi)">
            <Select
              id="entry-updhi-sevak"
              required
              value={updhiSevakName}
              onChange={(e) => setUpdhiSevakName(e.target.value)}
              options={sevakNameOptions}
              placeholder="Select sevak"
            />
          </Field>
        ) : null}

        <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-4 dark:border-zinc-700 dark:bg-zinc-900/40">
          <h3 className="mb-3 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            WhatsApp message fields
          </h3>
          <div className="flex flex-col gap-4">
            <Field id="entry-mahatma" label="Mahatma name">
              <Input
                id="entry-mahatma"
                value={mahatmaName}
                onChange={(e) => setMahatmaName(e.target.value)}
                placeholder="e.g. Pu.Munishratna suri ma.sa"
                required
              />
            </Field>
            <Field
              id="entry-vihar-clock"
              label="Vihar start time"
              hint="Shown in the message as typed (e.g. 5.30am)."
            >
              <Input
                id="entry-vihar-clock"
                value={viharStartTime}
                onChange={(e) => setViharStartTime(e.target.value)}
                placeholder="e.g. 5.30am"
                required
              />
            </Field>
            <Field id="entry-thana" label="Thana">
              <Input
                id="entry-thana"
                type="number"
                inputMode="numeric"
                min={0}
                step={1}
                value={thana}
                onChange={(e) => setThana(e.target.value)}
                required
              />
            </Field>
            <Field id="entry-initial" label="Initial Vihar start">
              <Select
                id="entry-initial"
                required
                value={initialViharStart}
                onChange={(e) => setInitialViharStart(e.target.value)}
                options={locationSelectOptions}
              />
            </Field>
            <Field id="entry-final" label="Final Vihar end">
              <Select
                id="entry-final"
                required
                value={finalViharEnd}
                onChange={(e) => setFinalViharEnd(e.target.value)}
                options={locationSelectOptions}
              />
            </Field>
            <Field id="entry-wheelchair" label="Wheelchair">
              <Select
                id="entry-wheelchair"
                value={wheelchair}
                onChange={(e) => setWheelchair(e.target.value as "yes" | "no")}
                options={[...wheelchairOptions]}
              />
            </Field>
            {wheelchair === "yes" ? (
              <Field id="entry-wheelchair-n" label="Wheelchair count">
                <Input
                  id="entry-wheelchair-n"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  step={1}
                  value={wheelchairCount}
                  onChange={(e) => setWheelchairCount(e.target.value)}
                  required
                />
              </Field>
            ) : null}
          </div>
        </div>

        {formError ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-800 dark:bg-red-950/40 dark:text-red-200">
            {formError}
          </p>
        ) : null}
        {success ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
            {success}
          </p>
        ) : null}
        <Button type="submit" disabled={submitting}>
          {submitting ? "Saving…" : "Submit"}
        </Button>
      </form>

      <div className="mt-6">
        <ViharWhatsappPanel message={whatsappMessage} targets={waTargets} />
      </div>
    </Card>
  );
}
