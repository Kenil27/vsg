import type { SelectHTMLAttributes } from "react";

type Option = { value: string; label: string };

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  id: string;
  options: readonly Option[];
  placeholder?: string;
};

export function Select({
  id,
  options,
  placeholder = "Select…",
  className = "",
  ...props
}: SelectProps) {
  return (
    <select
      id={id}
      className={`w-full rounded-lg border border-zinc-300 bg-white px-3 py-2.5 text-sm text-zinc-900 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 dark:border-zinc-600 dark:bg-zinc-900 dark:text-zinc-100 ${className}`}
      {...props}
    >
      <option value="">{placeholder}</option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
}
