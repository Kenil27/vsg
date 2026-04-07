"use client";

import { useMemo, useState } from "react";
import type { SevakOption } from "@/lib/firestore/sevak";
import { Button } from "@/components/ui/Button";
import { Field } from "@/components/ui/Field";
import { Select } from "@/components/ui/Select";

type SevakMultiPickerProps = {
  id: string;
  label: string;
  options: SevakOption[];
  value: string[];
  onChange: (names: string[]) => void;
  disabled?: boolean;
};

export function SevakMultiPicker({
  id,
  label,
  options,
  value,
  onChange,
  disabled,
}: SevakMultiPickerProps) {
  const [pending, setPending] = useState("");

  const selectOptions = useMemo(
    () => options.map((o) => ({ value: o.name, label: o.name })),
    [options],
  );

  const addPending = () => {
    const name = pending.trim();
    if (!name || value.includes(name)) return;
    onChange([...value, name]);
    setPending("");
  };

  const removeAt = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const pickerId = `${id}-picker`;

  return (
    <Field
      id={pickerId}
      label={label}
      hint="Pick a name and tap + to add more sainiks."
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Select
            id={pickerId}
            aria-label={`${label} picker`}
            value={pending}
            disabled={disabled || options.length === 0}
            onChange={(e) => setPending(e.target.value)}
            options={selectOptions}
            placeholder={
              options.length === 0 ? "No sevak in database" : "Choose sainik"
            }
          />
        </div>
        <Button
          type="button"
          variant="secondary"
          disabled={disabled || !pending}
          onClick={addPending}
          className="shrink-0 sm:min-w-[3rem]"
          aria-label="Add sainik"
        >
          +
        </Button>
      </div>
      {value.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-2">
          {value.map((name, index) => (
            <li
              key={`${name}-${index}`}
              className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-sm text-emerald-900 dark:bg-emerald-950/50 dark:text-emerald-100"
            >
              <span>{name}</span>
              <button
                type="button"
                className="rounded p-0.5 text-emerald-700 hover:bg-emerald-200/60 dark:text-emerald-300 dark:hover:bg-emerald-900"
                onClick={() => removeAt(index)}
                aria-label={`Remove ${name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </Field>
  );
}
