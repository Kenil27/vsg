import type { ReactNode } from "react";

type FieldProps = {
  id: string;
  label: string;
  children: ReactNode;
  hint?: string;
};

export function Field({ id, label, children, hint }: FieldProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-sm font-medium text-zinc-800 dark:text-zinc-200"
      >
        {label}
      </label>
      {children}
      {hint ? (
        <p className="text-xs text-zinc-500 dark:text-zinc-400">{hint}</p>
      ) : null}
    </div>
  );
}
