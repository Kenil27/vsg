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
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { SevakMultiPicker } from "@/components/admin/SevakMultiPicker";

type ViharEntryFormProps = {
  db: Firestore;
  auth: Auth;
};

function isoDateToSlash(iso: string): string {
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${y}/${m}/${d}`;
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
  label: loc,
}));

const updhiOptions = [
  { value: "no", label: "No" },
  { value: "yes", label: "Yes" },
] as const;

export function ViharEntryForm({ db, auth }: ViharEntryFormProps) {
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
  const [formError, setFormError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
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
  }, [db]);

  const sevakNameOptions = useMemo(
    () => sevakList.map((o) => ({ value: o.name, label: o.name })),
    [sevakList],
  );

  const resetForm = () => {
    setDateIso("");
    setGender("");
    setTimeOfDay("");
    setViharStart("");
    setViharEnd("");
    setKms("");
    setViharSainiks([]);
    setUpdhi("no");
    setUpdhiSevakName("");
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

    const user = auth.currentUser;
    if (!user) {
      setFormError("You are not signed in.");
      return;
    }

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
    </Card>
  );
}
